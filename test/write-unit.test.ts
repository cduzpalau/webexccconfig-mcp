import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveConfig } from "../src/config.js";
import { fingerprint, PendingPlans, planHash, stableStringify } from "../src/write/confirm.js";
import { createFileProcessor, missingAudioTools } from "../src/write/files.js";
import { changedFields, deepMerge, diff, presentChanges } from "../src/write/merge.js";
import { SnapshotStore } from "../src/write/snapshot.js";

describe("deepMerge", () => {
  it("merges objects recursively and replaces arrays and scalars", () => {
    expect(
      deepMerge(
        { a: 1, nested: { x: 1, y: 2 }, list: [1, 2, 3], keep: true },
        { a: 2, nested: { y: 3, z: 4 }, list: [9], extra: null },
      ),
    ).toEqual({ a: 2, nested: { x: 1, y: 3, z: 4 }, list: [9], keep: true, extra: null });
  });
  it("ignores undefined changes", () => {
    expect(deepMerge({ a: 1 }, undefined)).toEqual({ a: 1 });
  });
});

describe("diff", () => {
  it("reports field paths, including inside same-length object arrays", () => {
    const before = { name: "A", ranks: [{ q: "q1", r: 1 }, { q: "q2", r: 2 }], tags: ["x"], gone: 1 };
    const after = { name: "B", ranks: [{ q: "q1", r: 1 }, { q: "q2", r: 5 }], tags: ["x", "y"], added: true };
    expect(diff(before, after)).toEqual([
      { path: "name", before: "A", after: "B" },
      { path: "ranks[1].r", before: 2, after: 5 },
      { path: "tags", before: ["x"], after: ["x", "y"] },
      { path: "added", after: true },
      { path: "gone", before: 1 },
    ]);
    expect(changedFields(diff(before, after))).toEqual(["name", "ranks", "tags", "added", "gone"]);
  });
  it("is empty for equal values", () => {
    expect(diff({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toEqual([]);
  });
  it("clips long values and caps the list", () => {
    const changes = Array.from({ length: 60 }, (_, i) => ({ path: `f${i}`, after: "x".repeat(300) }));
    const shown = presentChanges(changes);
    expect(shown).toHaveLength(51);
    expect(shown.at(-1)).toEqual({ more: 10 });
    expect(String((shown[0] as { after: string }).after).length).toBe(200);
  });
});

describe("confirmation", () => {
  it("hashes independent of key order and ignores undefined", () => {
    expect(stableStringify({ b: 1, a: { d: [1, { y: 2, x: 1 }], c: undefined } })).toBe('{"a":{"d":[1,{"x":1,"y":2}]},"b":1}');
    expect(planHash({ a: 1, b: 2 })).toBe(planHash({ b: 2, a: 1 }));
    expect(planHash({ a: 1 })).not.toBe(planHash({ a: 2 }));
  });
  it("fingerprints by version, then lastUpdatedTime, then content", () => {
    expect(fingerprint({ version: 3, lastUpdatedTime: 9 })).toBe("v3");
    expect(fingerprint({ lastUpdatedTime: 9 })).toBe("t9");
    expect(fingerprint({ a: 1 })).toMatch(/^h[0-9a-f]{16}$/);
    expect(fingerprint(undefined)).toBeUndefined();
  });
  it("forgets plans after the TTL", () => {
    let now = 0;
    const p = new PendingPlans(1000, () => now);
    p.remember("h1", "t", "v1");
    expect(p.get("h1")).toMatchObject({ target: "t", base: "v1" });
    now = 2000;
    expect(p.get("h1")).toBeUndefined();
  });
});

describe("SnapshotStore", () => {
  it("writes per resource/id with a timestamped name and sanitised segments", () => {
    const dir = mkdtempSync(join(tmpdir(), "wxcc-ext-snap-"));
    const store = new SnapshotStore(dir, () => new Date("2026-10-30T12:34:56.789Z"));
    const p = store.save("team", "../../etc", { id: "x" });
    expect(p).toBe(join(dir, "team", ".._.._etc", "2026-10-30T12-34-56.789Z.json"));
    expect(JSON.parse(readFileSync(p, "utf8"))).toEqual({ id: "x" });
    expect(() => store.save("team", "../../etc", {})).toThrow(); // never overwrites
  });
});

describe("file processor", () => {
  const cfg = resolveConfig({ region: "us1", org_id: "o" }, { env: {} }).audio;
  const files = createFileProcessor(cfg);

  it("validates inputs and fingerprints without running tools", () => {
    expect(() => files.fingerprint({}, "audio")).toThrow(/exactly one of path or text/);
    expect(() => files.fingerprint({ path: "/a", text: "b" }, "audio")).toThrow(/exactly one/);
    expect(() => files.fingerprint({ text: "hi" }, "raw")).toThrow(/takes a file path/);
    expect(() => files.fingerprint({ path: "/definitely/missing.wav" }, "audio")).toThrow(/file not found/);
    expect(files.fingerprint({ text: "hi" }, "audio")).toBe(files.fingerprint({ text: "hi" }, "audio"));
    expect(files.fingerprint({ text: "hi" }, "audio")).not.toBe(files.fingerprint({ text: "hi", voice: "Alex" }, "audio"));
  });

  it("sends raw uploads as-is with a content type from the extension", async () => {
    const dir = mkdtempSync(join(tmpdir(), "wxcc-ext-raw-"));
    writeFileSync(join(dir, "logo.png"), Buffer.from([1, 2, 3]));
    const f = await files.prepare({ path: join(dir, "logo.png") }, "raw", "x");
    expect(f).toMatchObject({ filename: "logo.png", contentType: "image/png" });
    expect([...f.bytes]).toEqual([1, 2, 3]);
  });

  it("reports a missing tool with the setting to change", async () => {
    const broken = createFileProcessor({ ...cfg, ttsCommand: "/no/such/tts" });
    await expect(broken.prepare({ text: "hi" }, "audio", "x")).rejects.toThrow(/\/no\/such\/tts not found \(audio\.tts_command\)/);
    expect(missingAudioTools({ ...cfg, ffmpegPath: "/no/such/ffmpeg", ttsCommand: "/no/such/tts" })).toHaveLength(2);
  });

  const haveTools =
    process.platform === "darwin" &&
    spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0 &&
    spawnSync("say", ["-v", "?"], { stdio: "ignore" }).status === 0;

  it.skipIf(!haveTools)("speaks text with say and converts it to 8 kHz mono 16-bit PCM WAV with ffmpeg", async () => {
    const f = await files.prepare({ text: "Welcome to the test queue" }, "audio", "Welcome Prompt");
    expect(f.filename).toBe("Welcome_Prompt.wav");
    const b = Buffer.from(f.bytes);
    expect(b.toString("ascii", 0, 4)).toBe("RIFF");
    expect(b.toString("ascii", 8, 12)).toBe("WAVE");
    expect(b.readUInt16LE(20)).toBe(1); // PCM
    expect(b.readUInt16LE(22)).toBe(1); // mono
    expect(b.readUInt32LE(24)).toBe(8000);
    expect(b.readUInt16LE(34)).toBe(16);
    expect(b.length).toBeGreaterThan(1000);
  }, 30_000);
});
