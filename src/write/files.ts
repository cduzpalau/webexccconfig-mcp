/**
 * Upload preparation for multipart writes. Audio comes from a local file or from text spoken by
 * the configured TTS command (macOS `say` by default) and is always converted with ffmpeg to the
 * configured WAV format. Other uploads (channel logos) are sent as-is from a local file.
 *
 * External tools run with argument arrays (never a shell) in a temp dir that is removed afterwards.
 */
import { execFile, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import type { AudioConfig } from "../config.js";
import { ToolError } from "../errors.js";

export interface FileInput {
  /** Local file path (any audio format for audio uploads). */
  path?: string;
  /** Text to synthesise (audio uploads only). */
  text?: string;
  voice?: string;
}

export type UploadKind = "audio" | "raw";

export interface PreparedFile {
  bytes: Uint8Array;
  filename: string;
  contentType: string;
}

export interface FileProcessor {
  /** Cheap identity of the input for dry-run hashing (does not run any tool). */
  fingerprint(input: FileInput, kind: UploadKind): string;
  prepare(input: FileInput, kind: UploadKind, name: string): Promise<PreparedFile>;
}

const RAW_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

function validate(input: FileInput, kind: UploadKind): void {
  if (!!input.path === !!input.text) {
    throw new ToolError(kind === "audio" ? "file needs exactly one of path or text" : "file needs path");
  }
  if (kind === "raw" && input.text) throw new ToolError("this upload takes a file path, not text");
  if (input.path) {
    const p = resolve(input.path);
    let isFile = false;
    try {
      isFile = statSync(p).isFile();
    } catch {
      /* reported below */
    }
    if (!isFile) throw new ToolError(`file not found: ${p}`);
  }
}

export function createFileProcessor(cfg: AudioConfig): FileProcessor {
  return {
    fingerprint(input, kind) {
      validate(input, kind);
      const source = input.path
        ? { path: resolve(input.path), sha256: sha256(readFileSync(resolve(input.path))) }
        : { text: input.text, voice: input.voice ?? cfg.voice ?? null };
      return sha256(
        JSON.stringify({ kind, source, format: kind === "audio" ? [cfg.sampleRate, cfg.channels, cfg.codec] : null }),
      );
    },

    async prepare(input, kind, name) {
      validate(input, kind);
      if (kind === "raw") {
        const p = resolve(input.path!);
        return {
          bytes: readFileSync(p),
          filename: basename(p),
          contentType: RAW_TYPES[extname(p).toLowerCase()] ?? "application/octet-stream",
        };
      }
      const work = mkdtempSync(join(tmpdir(), "wxcc-ext-audio-"));
      try {
        let source = input.path ? resolve(input.path) : "";
        if (input.text) {
          const textFile = join(work, "text.txt");
          writeFileSync(textFile, input.text);
          source = join(work, "tts.aiff");
          const voice = input.voice ?? cfg.voice;
          const args = [
            ...cfg.ttsArgs.map((a) => a.replace("{in}", textFile).replace("{out}", source)),
            ...(voice ? cfg.voiceArgs.map((a) => a.replace("{voice}", voice)) : []),
          ];
          await run(cfg.ttsCommand, args, "audio.tts_command", ttsHint(cfg));
        }
        const out = join(work, "out.wav");
        await run(
          cfg.ffmpegPath,
          ["-hide_banner", "-loglevel", "error", "-y", "-i", source, "-ac", String(cfg.channels), "-ar", String(cfg.sampleRate), "-c:a", cfg.codec, out],
          "audio.ffmpeg_path",
          "install it (e.g. brew install ffmpeg) or set audio.ffmpeg_path to an alternative",
        );
        return { bytes: readFileSync(out), filename: `${safeName(name)}.wav`, contentType: "audio/wav" };
      } finally {
        rmSync(work, { recursive: true, force: true });
      }
    },
  };
}

function ttsHint(cfg: AudioConfig): string {
  return cfg.ttsCommand === "say"
    ? "`say` is macOS-only: provide file.path instead, or set audio.tts_command / audio.tts_args to an alternative (e.g. espeak-ng)"
    : "install it, or set audio.tts_command / audio.tts_args to an alternative, or provide file.path";
}

function run(cmd: string, args: string[], setting: string, hint: string): Promise<void> {
  return new Promise((done, fail) => {
    execFile(cmd, args, { timeout: 120_000, maxBuffer: 1024 * 1024 }, (err, _stdout, stderr) => {
      if (!err) return done();
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return fail(new ToolError(`${cmd} not found (${setting}): ${hint}`));
      }
      const detail = (stderr || err.message).trim().split("\n").slice(-3).join(" ").slice(0, 300);
      fail(new ToolError(`${basename(cmd)} failed: ${detail}`));
    });
  });
}

/** Startup check: returns a message per missing audio tool (empty when all are present). */
export function missingAudioTools(cfg: AudioConfig): string[] {
  const missing: string[] = [];
  const probe = (cmd: string, args: string[]) => {
    const r = spawnSync(cmd, args, { timeout: 5_000, stdio: "ignore" });
    return (r.error as NodeJS.ErrnoException | undefined)?.code !== "ENOENT";
  };
  if (!probe(cfg.ffmpegPath, ["-version"])) missing.push(`${cfg.ffmpegPath} not found (audio.ffmpeg_path): audio uploads will fail`);
  if (!probe(cfg.ttsCommand, cfg.ttsCommand === "say" ? ["-v", "?"] : ["--version"])) {
    missing.push(`${cfg.ttsCommand} not found (audio.tts_command): text-to-speech uploads will fail`);
  }
  return missing;
}

function sha256(data: string | Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

function safeName(name: string): string {
  return name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 80) || "audio";
}
