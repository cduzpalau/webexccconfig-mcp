/**
 * Configuration loading: an optional YAML file plus environment variables, validated with Zod.
 *
 * The Webex token is never part of this config. It is read separately by the token provider.
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

/** Official Webex Contact Center region codes. Overridable via `regions` in config. */
export const DEFAULT_REGIONS = ["us1", "eu1", "eu2", "anz1", "ca1", "jp1", "sg1"] as const;

export const TOOLSETS = [
  "routing",
  "agent",
  "telephony",
  "media",
  "data",
  "schedule",
  "org",
  "digital",
  "ai",
  "flow",
] as const;
export type Toolset = (typeof TOOLSETS)[number];

export const DEFAULT_DEFER_TO_OFFICIAL = [
  "entry-point",
  "business-hours",
  "dial-plan",
  "dial-number",
] as const;

export type Mode = "read-only" | "read-write";

export interface AudioConfig {
  /** Default voice for macOS `say`; undefined means the system default. */
  voice?: string;
  ffmpegPath: string;
  ttsCommand: string;
  /** Arguments for ttsCommand; {in} is a text file, {out} the audio file to write. */
  ttsArgs: string[];
  /** Extra arguments when a voice is chosen; {voice} is replaced. */
  voiceArgs: string[];
  sampleRate: number;
  channels: number;
  codec: string;
}

export interface AppConfig {
  region?: string;
  regions: string[];
  /** Fully resolved API base URL, without a trailing slash, e.g. https://api.wxcc-us1.cisco.com */
  baseUrl: string;
  orgId: string;
  mode: Mode;
  toolsets: Toolset[];
  deferToOfficial: string[];
  logDir: string;
  snapshotDir: string;
  /** Where relative saveTo / bodyFile paths resolve (flow exports and imports). */
  exportDir: string;
  requestTimeoutMs: number;
  /** Tool responses larger than this are trimmed, with a hint to page or select attributes. */
  maxResponseChars: number;
  audio: AudioConfig;
  /** Path of the YAML file that was loaded, if any. */
  configPath?: string;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

const regionCode = z
  .string()
  .regex(/^[a-z]{2,4}[0-9]{1,2}$/, "region codes look like us1, eu2, anz1");

const fileSchema = z
  .object({
    region: regionCode.optional(),
    regions: z.array(regionCode).min(1).optional(),
    base_url: z.string().url().optional(),
    org_id: z.string().min(1).optional(),
    mode: z.enum(["read-only", "read-write"]).optional(),
    toolsets: z.array(z.enum(TOOLSETS)).optional(),
    defer_to_official: z.array(z.string().min(1)).optional(),
    log_dir: z.string().min(1).optional(),
    snapshot_dir: z.string().min(1).optional(),
    export_dir: z.string().min(1).optional(),
    request_timeout_ms: z.number().int().positive().max(300_000).optional(),
    max_response_chars: z.number().int().min(2_000).max(1_000_000).optional(),
    audio: z
      .object({
        voice: z.string().min(1).optional(),
        ffmpeg_path: z.string().min(1).optional(),
        tts_command: z.string().min(1).optional(),
        tts_args: z.array(z.string()).min(1).optional(),
        voice_args: z.array(z.string()).optional(),
        sample_rate: z.number().int().positive().optional(),
        channels: z.number().int().min(1).max(2).optional(),
        codec: z.string().min(1).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type ConfigFile = z.infer<typeof fileSchema>;

export interface LoadOptions {
  /** Explicit config path (from --config). */
  configPath?: string;
  env?: NodeJS.ProcessEnv;
  cwd?: string;
  home?: string;
}

/** Resolves which YAML file to read: --config, then WXCC_EXT_CONFIG, then ./wxcc-ext.yaml, then ~/.wxcc-ext/config.yaml. */
export function findConfigFile(opts: LoadOptions = {}): string | undefined {
  const env = opts.env ?? process.env;
  const cwd = opts.cwd ?? process.cwd();
  const home = opts.home ?? homedir();
  const explicit = opts.configPath ?? env.WXCC_EXT_CONFIG;
  if (explicit) {
    const p = resolve(cwd, expandHome(explicit, home));
    if (!existsSync(p)) throw new ConfigError(`config file not found: ${p}`);
    return p;
  }
  for (const candidate of [join(cwd, "wxcc-ext.yaml"), join(home, ".wxcc-ext", "config.yaml")]) {
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

export function loadConfig(opts: LoadOptions = {}): AppConfig {
  const configPath = findConfigFile(opts);
  let raw: unknown = {};
  if (configPath) {
    try {
      raw = parseYaml(readFileSync(configPath, "utf8")) ?? {};
    } catch (err) {
      throw new ConfigError(`cannot parse ${configPath}: ${(err as Error).message}`);
    }
  }
  return resolveConfig(raw, { ...opts, configPath });
}

/** Validates a parsed config object and applies env fallbacks and defaults. */
export function resolveConfig(raw: unknown, opts: LoadOptions & { configPath?: string } = {}): AppConfig {
  const env = opts.env ?? process.env;
  const home = opts.home ?? homedir();
  const where = opts.configPath ?? "config";

  const parsed = fileSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ConfigError(`invalid ${where}: ${issues}`);
  }
  const file = parsed.data;

  const regions = file.regions ?? [...DEFAULT_REGIONS];
  const region = file.region ?? emptyToUndefined(env.WXCC_REGION);
  const baseUrlOverride = file.base_url ?? emptyToUndefined(env.WEBEX_BASE_URL);

  if (region && !regions.includes(region)) {
    throw new ConfigError(
      `unknown region "${region}"; known regions: ${regions.join(", ")} (add new ones under \`regions\`)`,
    );
  }
  let baseUrl: string;
  if (baseUrlOverride) {
    baseUrl = normaliseBaseUrl(baseUrlOverride);
  } else if (region) {
    baseUrl = `https://api.wxcc-${region}.cisco.com`;
  } else {
    throw new ConfigError("set `region` in config (e.g. region: us1) or WXCC_REGION in env");
  }

  const orgId = file.org_id ?? emptyToUndefined(env.WEBEX_ORG_ID);
  if (!orgId) throw new ConfigError("set `org_id` in config or WEBEX_ORG_ID in env");

  const audio = file.audio ?? {};
  return {
    region,
    regions,
    baseUrl,
    orgId,
    mode: file.mode ?? "read-only",
    toolsets: file.toolsets ?? [...TOOLSETS],
    deferToOfficial: file.defer_to_official ?? [...DEFAULT_DEFER_TO_OFFICIAL],
    logDir: expandHome(file.log_dir ?? "~/.wxcc-ext/logs", home),
    snapshotDir: expandHome(file.snapshot_dir ?? "~/.wxcc-ext/snapshots", home),
    exportDir: expandHome(file.export_dir ?? "~/.wxcc-ext/exports", home),
    requestTimeoutMs: file.request_timeout_ms ?? 30_000,
    maxResponseChars: file.max_response_chars ?? 50_000,
    audio: {
      voice: audio.voice,
      ffmpegPath: audio.ffmpeg_path ?? "ffmpeg",
      ttsCommand: audio.tts_command ?? "say",
      ttsArgs: audio.tts_args ?? ["-o", "{out}", "-f", "{in}"],
      voiceArgs: audio.voice_args ?? ["-v", "{voice}"],
      sampleRate: audio.sample_rate ?? 8000,
      channels: audio.channels ?? 1,
      codec: audio.codec ?? "pcm_s16le",
    },
    configPath: opts.configPath,
  };
}

/** Trims trailing slashes and rejects a `/v1` suffix (paths already carry their version). */
export function normaliseBaseUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new ConfigError(`base_url is not a valid URL: ${input}`);
  }
  if (url.protocol !== "https:") throw new ConfigError("base_url must use https");
  if (url.search || url.hash) throw new ConfigError("base_url must not contain a query or fragment");
  const trimmed = url.toString().replace(/\/+$/, "");
  if (/\/v1$/i.test(trimmed)) {
    throw new ConfigError(
      "base_url must not end in /v1: use the bare host, e.g. https://api.wxcc-us1.cisco.com",
    );
  }
  return trimmed;
}

function expandHome(p: string, home: string): string {
  return p === "~" ? home : p.startsWith("~/") ? join(home, p.slice(2)) : p;
}

function emptyToUndefined(v: string | undefined): string | undefined {
  return v && v.trim() ? v.trim() : undefined;
}
