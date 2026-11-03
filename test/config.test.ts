import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ConfigError,
  DEFAULT_DEFER_TO_OFFICIAL,
  DEFAULT_REGIONS,
  TOOLSETS,
  findConfigFile,
  loadConfig,
  normaliseBaseUrl,
  resolveConfig,
} from "../src/config.js";

const ORG = "11111111-2222-3333-4444-555555555555";
const noEnv = { env: {}, home: "/home/test" };

describe("resolveConfig", () => {
  it("derives the base URL from the region and applies defaults", () => {
    const c = resolveConfig({ region: "us1", org_id: ORG }, noEnv);
    expect(c.baseUrl).toBe("https://api.wxcc-us1.cisco.com");
    expect(c.orgId).toBe(ORG);
    expect(c.mode).toBe("read-only");
    expect(c.regions).toEqual([...DEFAULT_REGIONS]);
    expect(c.toolsets).toEqual([...TOOLSETS]);
    expect(c.deferToOfficial).toEqual([...DEFAULT_DEFER_TO_OFFICIAL]);
    expect(c.logDir).toBe("/home/test/.wxcc-ext/logs");
    expect(c.snapshotDir).toBe("/home/test/.wxcc-ext/snapshots");
    expect(c.exportDir).toBe("/home/test/.wxcc-ext/exports");
    expect(c.bulkConcurrency).toBe(4);
    expect(c.webexBaseUrl).toBe("https://webexapis.com");
    expect(c.deferToOfficial).not.toContain("flow");
    expect(c.audio).toEqual({
      voice: undefined,
      ffmpegPath: "ffmpeg",
      ttsCommand: "say",
      ttsArgs: ["-o", "{out}", "-f", "{in}"],
      voiceArgs: ["-v", "{voice}"],
      sampleRate: 8000,
      channels: 1,
      codec: "pcm_s16le",
    });
  });

  it.each(DEFAULT_REGIONS)("maps official region %s to its host", (region) => {
    expect(resolveConfig({ region, org_id: ORG }, noEnv).baseUrl).toBe(`https://api.wxcc-${region}.cisco.com`);
  });

  it("accepts a region added via `regions`", () => {
    const c = resolveConfig({ region: "in1", regions: [...DEFAULT_REGIONS, "in1"], org_id: ORG }, noEnv);
    expect(c.baseUrl).toBe("https://api.wxcc-in1.cisco.com");
  });

  it("rejects an unknown region and names the known ones", () => {
    expect(() => resolveConfig({ region: "xx9", org_id: ORG }, noEnv)).toThrow(
      /unknown region "xx9"; known regions: us1, eu1/,
    );
  });

  it("rejects a region removed from a custom `regions` list", () => {
    expect(() => resolveConfig({ region: "us1", regions: ["eu1"], org_id: ORG }, noEnv)).toThrow(ConfigError);
  });

  it("lets base_url override the derived host", () => {
    const c = resolveConfig({ region: "us1", base_url: "https://api.example.test/", org_id: ORG }, noEnv);
    expect(c.baseUrl).toBe("https://api.example.test");
  });

  it.each(["https://api.wxcc-us1.cisco.com/v1", "https://api.wxcc-us1.cisco.com/v1/", "https://api.wxcc-us1.cisco.com/V1"])(
    "rejects base_url ending in /v1: %s",
    (base_url) => {
      expect(() => resolveConfig({ base_url, org_id: ORG }, noEnv)).toThrow(/must not end in \/v1/);
    },
  );

  it("takes webex_base_url from config or WEBEX_API_BASE_URL, without /v1", () => {
    expect(resolveConfig({ region: "us1", org_id: ORG, webex_base_url: "https://api-usgov.webex.com/" }, noEnv).webexBaseUrl).toBe(
      "https://api-usgov.webex.com",
    );
    expect(
      resolveConfig({ region: "us1", org_id: ORG }, { ...noEnv, env: { WEBEX_API_BASE_URL: "https://webex.example.com" } }).webexBaseUrl,
    ).toBe("https://webex.example.com");
    expect(() => resolveConfig({ region: "us1", org_id: ORG, webex_base_url: "https://webexapis.com/v1" }, noEnv)).toThrow(
      "webex_base_url must not end in /v1: use the bare host, e.g. https://webexapis.com",
    );
  });

  it("rejects a non-https base_url", () => {
    expect(() => resolveConfig({ base_url: "http://api.wxcc-us1.cisco.com", org_id: ORG }, noEnv)).toThrow(/https/);
  });

  it("falls back to env for region, base URL and org id", () => {
    expect(resolveConfig({}, { env: { WXCC_REGION: "eu2", WEBEX_ORG_ID: ORG } }).baseUrl).toBe(
      "https://api.wxcc-eu2.cisco.com",
    );
    expect(
      resolveConfig({}, { env: { WEBEX_BASE_URL: "https://api.wxcc-us1.cisco.com", WEBEX_ORG_ID: ORG } }).baseUrl,
    ).toBe("https://api.wxcc-us1.cisco.com");
  });

  it("prefers the config file over env", () => {
    const c = resolveConfig({ region: "us1", org_id: ORG }, { env: { WXCC_REGION: "eu1", WEBEX_ORG_ID: "other" } });
    expect(c.baseUrl).toBe("https://api.wxcc-us1.cisco.com");
    expect(c.orgId).toBe(ORG);
  });

  it("requires a region or base_url", () => {
    expect(() => resolveConfig({ org_id: ORG }, noEnv)).toThrow(/set `region`/);
  });

  it("requires an org id", () => {
    expect(() => resolveConfig({ region: "us1" }, noEnv)).toThrow(/org_id/);
  });

  it("rejects unknown keys, bad modes and bad toolsets with the field path", () => {
    expect(() => resolveConfig({ region: "us1", org_id: ORG, colour: "red" }, noEnv)).toThrow(/invalid config/);
    expect(() => resolveConfig({ region: "us1", org_id: ORG, mode: "yolo" }, noEnv)).toThrow(/mode/);
    expect(() => resolveConfig({ region: "us1", org_id: ORG, toolsets: ["nope"] }, noEnv)).toThrow(/toolsets\.0/);
    expect(() => resolveConfig({ region: "us1", org_id: ORG, bulk_concurrency: 11 }, noEnv)).toThrow(/bulk_concurrency/);
    expect(() => resolveConfig({ region: "us1", org_id: ORG, audio: { sample_rate: -1 } }, noEnv)).toThrow(
      /audio\.sample_rate/,
    );
  });

  it("reads explicit settings", () => {
    const c = resolveConfig(
      {
        region: "anz1",
        org_id: ORG,
        mode: "read-write",
        toolsets: ["routing"],
        defer_to_official: ["flow", "holiday-list"],
        log_dir: "~/logs",
        audio: { voice: "Samantha", sample_rate: 16000 },
      },
      noEnv,
    );
    expect(c.mode).toBe("read-write");
    expect(c.toolsets).toEqual(["routing"]);
    expect(c.deferToOfficial).toEqual(["flow", "holiday-list"]);
    expect(c.logDir).toBe("/home/test/logs");
    expect(c.audio.voice).toBe("Samantha");
    expect(c.audio.sampleRate).toBe(16000);
  });
});

describe("normaliseBaseUrl", () => {
  it("strips trailing slashes", () => {
    expect(normaliseBaseUrl("https://api.wxcc-us1.cisco.com///")).toBe("https://api.wxcc-us1.cisco.com");
  });
  it("rejects garbage", () => {
    expect(() => normaliseBaseUrl("not a url")).toThrow(ConfigError);
  });
});

describe("loadConfig / findConfigFile", () => {
  const dir = () => mkdtempSync(join(tmpdir(), "wxcc-ext-config-"));

  it("loads ./wxcc-ext.yaml from cwd", () => {
    const cwd = dir();
    writeFileSync(join(cwd, "wxcc-ext.yaml"), `region: eu1\norg_id: ${ORG}\nmode: read-write\n`);
    const c = loadConfig({ cwd, env: {}, home: dir() });
    expect(c.baseUrl).toBe("https://api.wxcc-eu1.cisco.com");
    expect(c.mode).toBe("read-write");
    expect(c.configPath).toBe(join(cwd, "wxcc-ext.yaml"));
  });

  it("falls back to ~/.wxcc-ext/config.yaml", () => {
    const home = dir();
    mkdirSync(join(home, ".wxcc-ext"));
    writeFileSync(join(home, ".wxcc-ext", "config.yaml"), `region: ca1\norg_id: ${ORG}\n`);
    expect(loadConfig({ cwd: dir(), env: {}, home }).baseUrl).toBe("https://api.wxcc-ca1.cisco.com");
  });

  it("prefers --config, then WXCC_EXT_CONFIG", () => {
    const cwd = dir();
    writeFileSync(join(cwd, "a.yaml"), "region: us1\n");
    writeFileSync(join(cwd, "b.yaml"), "region: us1\n");
    writeFileSync(join(cwd, "wxcc-ext.yaml"), "region: us1\n");
    expect(findConfigFile({ cwd, configPath: "a.yaml", env: { WXCC_EXT_CONFIG: "b.yaml" } })).toBe(join(cwd, "a.yaml"));
    expect(findConfigFile({ cwd, env: { WXCC_EXT_CONFIG: "b.yaml" } })).toBe(join(cwd, "b.yaml"));
  });

  it("errors on a missing explicit file", () => {
    expect(() => findConfigFile({ cwd: dir(), configPath: "missing.yaml", env: {} })).toThrow(/not found/);
  });

  it("works with no file at all using env only", () => {
    const c = loadConfig({ cwd: dir(), home: dir(), env: { WXCC_REGION: "jp1", WEBEX_ORG_ID: ORG } });
    expect(c.baseUrl).toBe("https://api.wxcc-jp1.cisco.com");
    expect(c.configPath).toBeUndefined();
  });

  it("reports YAML syntax errors with the file path", () => {
    const cwd = dir();
    writeFileSync(join(cwd, "wxcc-ext.yaml"), "region: [us1\n");
    expect(() => loadConfig({ cwd, env: {}, home: dir() })).toThrow(/cannot parse .*wxcc-ext\.yaml/);
  });
});
