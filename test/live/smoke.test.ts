/**
 * Live smoke tests against a SANDBOX tenant. Opt-in only:
 *
 *   WXCC_LIVE=1 WXCC_SANDBOX_ORG_IDS=<org id>[,<org id>] npm run test:live
 *
 * The configured org id must be in WXCC_SANDBOX_ORG_IDS, or the suite refuses to run. Records it
 * creates are named wxcc_ext_smoke_*, and leftovers from earlier runs are swept afterwards.
 * Every write goes through the real tools (dry-run, then confirm).
 */
import { existsSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { StaticTokenProvider } from "../../src/auth.js";
import { WxccClient } from "../../src/client.js";
import { loadConfig, type AppConfig } from "../../src/config.js";
import { buildServer } from "../../src/server.js";

const LIVE = process.env.WXCC_LIVE === "1";
// Global variable names allow only letters, digits and "_".
const PREFIX = "wxcc_ext_smoke_";
const RUN = `${PREFIX}${Date.now().toString(36)}`;

interface ToolOutput {
  isError: boolean;
  text: string;
  json: () => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

describe.skipIf(!LIVE)("live smoke (sandbox)", () => {
  let config: AppConfig;
  let mcp: Client;
  let token = "";
  const outputs: string[] = [];
  const created: Array<{ resource: string; id: string }> = [];
  const restores: Array<() => Promise<void>> = [];

  const call = async (name: string, args: Record<string, unknown>): Promise<ToolOutput> => {
    const res = (await mcp.callTool({ name, arguments: args })) as { isError?: boolean; content: Array<{ text: string }> };
    const text = res.content.map((c) => c.text).join("\n");
    outputs.push(text);
    return { isError: res.isError === true, text, json: () => JSON.parse(res.content[0]!.text) };
  };

  /** Dry-run, check it, then apply with the returned hash. */
  const apply = async (tool: string, args: Record<string, unknown>) => {
    const dry = await call(tool, args);
    expect(dry.isError, dry.text).toBe(false);
    expect(dry.json().dryRun).toBe(true);
    const res = await call(tool, { ...args, confirm: dry.json().confirm });
    expect(res.isError, res.text).toBe(false);
    return res.json();
  };

  const findByName = async (resource: string, name: string): Promise<string | undefined> => {
    const res = await call("wxcc-ext-list", { resource, search: name, pageSize: 50 });
    expect(res.isError, res.text).toBe(false);
    return res.json().data.find((r: { name?: string }) => r.name === name)?.id;
  };

  beforeAll(async () => {
    const envFile = resolve(".env");
    if (existsSync(envFile)) process.loadEnvFile(envFile);
    config = loadConfig();
    const allowed = (process.env.WXCC_SANDBOX_ORG_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (!allowed.includes(config.orgId)) {
      throw new Error("refusing to run: the configured org id is not listed in WXCC_SANDBOX_ORG_IDS");
    }
    const tokens = StaticTokenProvider.fromEnv();
    token = await tokens.getToken();
    config = {
      ...config,
      mode: "read-write",
      logDir: mkdtempSync(join(tmpdir(), "wxcc-ext-live-log-")),
      snapshotDir: mkdtempSync(join(tmpdir(), "wxcc-ext-live-snap-")),
      exportDir: mkdtempSync(join(tmpdir(), "wxcc-ext-live-export-")),
    };
    const client = new WxccClient({ baseUrl: config.baseUrl, orgId: config.orgId, tokenProvider: tokens });
    const [a, b] = InMemoryTransport.createLinkedPair();
    await buildServer({ config, client }).connect(b);
    mcp = new Client({ name: "live-smoke", version: "0" });
    await mcp.connect(a);
  });

  afterAll(async () => {
    if (!mcp) return;
    for (const restore of restores.reverse()) await restore().catch((e: Error) => console.error(`restore failed: ${e.message}`));
    // Delete what this run created, then sweep leftovers of earlier runs.
    // Skill profiles before skills: a profile refers to its skills.
    for (const resource of ["skill-profile", "global-variable", "work-type", "audio-file", "skill"]) {
      const res = await call("wxcc-ext-list", { resource, search: PREFIX, pageSize: 100 });
      if (res.isError) continue;
      for (const r of res.json().data as Array<{ id: string; name?: string }>) {
        if (r.name?.startsWith(PREFIX) && !created.some((c) => c.id === r.id)) created.push({ resource, id: r.id });
      }
    }
    const flows = await call("wxcc-ext-list", { resource: "flow", pageSize: 100, query: { partialNameSearch: PREFIX } });
    if (!flows.isError) {
      for (const f of flows.json().data as Array<{ id: string; name?: string }>) {
        if (f.name?.startsWith(PREFIX) && !created.some((c) => c.id === f.id)) created.push({ resource: "flow", id: f.id });
      }
    }
    created.sort((a, b) => Number(b.resource === "skill-profile") - Number(a.resource === "skill-profile"));
    for (const c of created) {
      const dry = await call("wxcc-ext-delete", { resource: c.resource, id: c.id });
      if (!dry.isError) await call("wxcc-ext-delete", { resource: c.resource, id: c.id, confirm: dry.json().confirm });
    }
    await mcp.close();
  });

  it("reads every visible resource (list, and get where an id is available)", async () => {
    const types = (await call("wxcc-ext-list-resource-types", {})).json().resources as Array<{
      key: string;
      ops: string;
      singleton?: boolean;
      parent?: string;
    }>;
    const firstIds = new Map<string, string>();
    const results: Array<{ resource: string; list: string; get: string }> = [];
    const ordered = [...types.filter((t) => !t.parent), ...types.filter((t) => t.parent)];
    for (const t of ordered) {
      const parentId = t.parent ? firstIds.get(t.parent) : undefined;
      if (t.parent && !parentId) {
        results.push({ resource: t.key, list: `skipped (no ${t.parent})`, get: "-" });
        continue;
      }
      const list = await call("wxcc-ext-list", { resource: t.key, pageSize: 1, ...(parentId ? { parentId } : {}) });
      let get = "-";
      if (!list.isError) {
        const id = list.json().data?.[0]?.id as string | undefined;
        if (id) firstIds.set(t.key, id);
        if (t.ops.split(" ").includes("get") && (id || t.singleton)) {
          const g = await call("wxcc-ext-get", { resource: t.key, ...(id && !t.singleton ? { id } : {}), ...(parentId ? { parentId } : {}) });
          get = g.isError ? g.text : "ok";
        } else if (!id) {
          get = "empty";
        }
      }
      results.push({ resource: t.key, list: list.isError ? list.text : `ok (${list.json().meta?.totalRecords ?? "?"})`, get });
    }
    console.table(results);
    // 403 means the feature is not licensed or permitted for this token: reported, not a failure.
    const broken = results.filter((r) => [r.list, r.get].some((s) => !/^(ok|-|empty|skipped|forbidden)/.test(s)));
    expect(broken).toEqual([]);
  }, 300_000);

  it("runs a global variable through create → get → update → delete", async () => {
    const name = `${RUN}_gv`;
    await apply("wxcc-ext-create", {
      resource: "global-variable",
      body: {
        name,
        description: "created by the webexccconfig-mcp smoke test",
        variableType: "String",
        defaultValue: "a",
        active: true,
        agentEditable: false,
        agentViewable: false,
        reportable: false,
      },
    });
    const id = await findByName("global-variable", name);
    expect(id).toBeDefined();
    created.push({ resource: "global-variable", id: id! });

    const got = (await call("wxcc-ext-get", { resource: "global-variable", id })).json();
    expect(got).toMatchObject({ name, defaultValue: "a" });

    const upd = await apply("wxcc-ext-update", { resource: "global-variable", id, changes: { defaultValue: "b" } });
    expect(upd.applied).toBe(true);
    expect(existsSync(upd.snapshot)).toBe(true);
    expect((await call("wxcc-ext-get", { resource: "global-variable", id })).json().defaultValue).toBe("b");

    await apply("wxcc-ext-delete", { resource: "global-variable", id });
    created.splice(created.findIndex((c) => c.id === id), 1);
    const gone = await call("wxcc-ext-get", { resource: "global-variable", id });
    expect(gone.isError).toBe(true);
    expect(gone.text).toMatch(/^not found/);
  }, 120_000);

  it("rejects a stale version between dry-run and apply", async () => {
    const name = `${RUN}_stale`;
    await apply("wxcc-ext-create", {
      resource: "global-variable",
      body: { name, variableType: "String", defaultValue: "1", active: true, agentEditable: false, agentViewable: false, reportable: false },
    });
    const id = (await findByName("global-variable", name))!;
    created.push({ resource: "global-variable", id });

    const first = { resource: "global-variable", id, changes: { defaultValue: "2" } };
    const dry = (await call("wxcc-ext-update", first)).json();
    await apply("wxcc-ext-update", { resource: "global-variable", id, changes: { defaultValue: "3" } }); // someone else
    const stale = await call("wxcc-ext-update", { ...first, confirm: dry.confirm });
    expect(stale.isError).toBe(true);
    expect(stale.text).toMatch(/^stale version: global-variable/);
    expect((await call("wxcc-ext-get", { resource: "global-variable", id })).json().defaultValue).toBe("3");
  }, 120_000);

  it("bulk-saves new records and bulk-deletes them", async () => {
    const names = [`${RUN}_bulk_1`, `${RUN}_bulk_2`];
    const save = await apply("wxcc-ext-bulk", {
      resource: "global-variable",
      items: names.map((name) => ({
        item: { name, variableType: "String", defaultValue: "x", active: true, agentEditable: false, agentViewable: false, reportable: false },
      })),
    });
    expect(save.result.failed, JSON.stringify(save.result)).toBe(0);
    const ids = await Promise.all(names.map((n) => findByName("global-variable", n)));
    expect(ids.every(Boolean)).toBe(true);
    for (const id of ids) created.push({ resource: "global-variable", id: id! });

    const del = await apply("wxcc-ext-bulk", { resource: "global-variable", items: ids.map((id) => ({ action: "DELETE", item: { id } })) });
    expect(del.result.failed, JSON.stringify(del.result)).toBe(0);
    for (const id of ids) {
      expect((await call("wxcc-ext-get", { resource: "global-variable", id })).isError).toBe(true);
      created.splice(created.findIndex((c) => c.id === id), 1);
    }
  }, 180_000);

  it("bulk-deletes one by one: profiles with reordered arrays, then skills with per-record results", async () => {
    const skillIds: string[] = [];
    for (const n of [1, 2, 3, 4]) {
      const name = `${RUN}_skill_${n}`;
      await apply("wxcc-ext-create", {
        resource: "skill",
        body: { name, active: true, serviceLevelThreshold: 30, skillType: "BOOLEAN" },
      });
      const id = await findByName("skill", name);
      expect(id).toBeDefined();
      skillIds.push(id!);
      created.push({ resource: "skill", id: id! });
    }
    const profileIds: string[] = [];
    for (const n of [1, 2]) {
      const name = `${RUN}_profile_${n}`;
      await apply("wxcc-ext-create", {
        resource: "skill-profile",
        body: { name, activeSkills: skillIds.slice(0, 3).map((skillId) => ({ skillId, booleanValue: true })) },
      });
      const id = await findByName("skill-profile", name);
      expect(id).toBeDefined();
      profileIds.push(id!);
      created.push({ resource: "skill-profile", id: id! });
    }

    // Skill 1 is used by both profiles, skill 4 is free, the third id does not exist.
    const missing = "00000000-0000-0000-0000-000000000000";
    const skills = await apply("wxcc-ext-bulk", { resource: "skill", operation: "delete", ids: [skillIds[0], skillIds[3], missing] });
    expect(skills, JSON.stringify(skills)).toMatchObject({ succeededCount: 1, failedCount: 1, skippedCount: 1 });
    expect(skills.succeeded[0].id).toBe(skillIds[3]);
    expect(skills.failed[0]).toMatchObject({ id: skillIds[0], httpStatus: 412 });
    expect(skills.failed[0].error).toContain(`${RUN}_profile_`);
    expect(skills.skipped).toEqual([{ id: missing, reason: "not found" }]);
    created.splice(created.findIndex((c) => c.id === skillIds[3]), 1);

    // activeSkills come back in a different order on each read; the confirm must still match.
    const profiles = await apply("wxcc-ext-bulk", { resource: "skill-profile", operation: "delete", ids: profileIds });
    expect(profiles, JSON.stringify(profiles)).toMatchObject({ succeededCount: 2, failedCount: 0 });
    const rest = await apply("wxcc-ext-bulk", { resource: "skill", operation: "delete", ids: skillIds.slice(0, 3) });
    expect(rest, JSON.stringify(rest)).toMatchObject({ succeededCount: 3, failedCount: 0 });
    for (const id of [...profileIds, ...skillIds]) created.splice(created.findIndex((c) => c.id === id), 1);
  }, 240_000);

  it("PATCHes a harmless user field and restores it", async () => {
    const users = (await call("wxcc-ext-list", { resource: "user", pageSize: 1, attributes: "id" })).json().data;
    const id = users[0].id as string;
    const original = (await call("wxcc-ext-get", { resource: "user", id })).json().externalIdentifier ?? "";
    restores.push(async () => {
      const now = (await call("wxcc-ext-get", { resource: "user", id })).json().externalIdentifier ?? "";
      if (now !== original) await apply("wxcc-ext-update", { resource: "user", id, changes: { externalIdentifier: original } });
    });
    const marker = `smk${Date.now().toString(36)}`; // the API allows at most 20 characters
    const res = await apply("wxcc-ext-update", { resource: "user", id, changes: { externalIdentifier: marker } });
    expect(res.summary).toContain("(PATCH)");
    expect((await call("wxcc-ext-get", { resource: "user", id })).json().externalIdentifier).toBe(marker);
    await apply("wxcc-ext-update", { resource: "user", id, changes: { externalIdentifier: original } });
    expect((await call("wxcc-ext-get", { resource: "user", id })).json().externalIdentifier ?? "").toBe(original);
  }, 120_000);

  it("uploads a text-to-speech audio file and deletes it", async () => {
    const name = `${RUN}_audio.wav`;
    const res = await apply("wxcc-ext-create", {
      resource: "audio-file",
      body: { name, description: "webexccconfig-mcp smoke test" },
      file: { text: "This is a webexccconfig smoke test prompt." },
    });
    expect(res.applied).toBe(true);
    const id = (await findByName("audio-file", name))!;
    expect(id).toBeDefined();
    created.push({ resource: "audio-file", id });
    expect((await call("wxcc-ext-get", { resource: "audio-file", id })).json()).toMatchObject({ name, contentType: "AUDIO_WAV" });
    await apply("wxcc-ext-delete", { resource: "audio-file", id });
    created.splice(created.findIndex((c) => c.id === id), 1);
  }, 120_000);

  it("exports a flow to a file, imports a renamed copy, unlocks it and deletes it", async () => {
    const list = await call("wxcc-ext-list", { resource: "flow", pageSize: 20 });
    expect(list.isError, list.text).toBe(false);
    const source = (list.json().data as Array<{ id: string; name: string }>).find((f) => !f.name.startsWith(PREFIX));
    expect(source, "the sandbox needs at least one flow").toBeDefined();

    const exported = await call("wxcc-ext-get", {
      resource: "flow",
      id: source!.id,
      view: "export",
      query: { version: "draft" },
      saveTo: `${RUN}-source.json`,
    });
    expect(exported.isError, exported.text).toBe(false);
    const doc = JSON.parse(readFileSync(exported.json().saved, "utf8")) as Record<string, unknown>;
    expect(typeof doc.name).toBe("string");

    const copyName = `${RUN}_flow`;
    writeFileSync(join(config.exportDir, `${RUN}-copy.json`), JSON.stringify({ ...doc, name: copyName }));
    const imported = await apply("wxcc-ext-action", { resource: "flow", action: "import", bodyFile: `${RUN}-copy.json` });
    expect(imported.httpStatus).toBeLessThan(300);

    const found = await call("wxcc-ext-list", { resource: "flow", query: { partialNameSearch: copyName } });
    const copy = (found.json().data as Array<{ id: string; name: string }>).find((f) => f.name === copyName);
    expect(copy, found.text).toBeDefined();
    created.push({ resource: "flow", id: copy!.id });

    await apply("wxcc-ext-action", { resource: "flow", action: "unlock", id: copy!.id });
    await apply("wxcc-ext-delete", { resource: "flow", id: copy!.id });
    created.splice(created.findIndex((c) => c.id === copy!.id), 1);
    const gone = await call("wxcc-ext-get", { resource: "flow", id: copy!.id });
    expect(gone.isError).toBe(true);

    // Two more copies, deleted together: flows have no native bulk endpoint.
    const copies: string[] = [];
    for (const n of [2, 3]) {
      const name = `${RUN}_flow_${n}`;
      writeFileSync(join(config.exportDir, `${name}.json`), JSON.stringify({ ...doc, name }));
      await apply("wxcc-ext-action", { resource: "flow", action: "import", bodyFile: `${name}.json` });
      const hit = (await call("wxcc-ext-list", { resource: "flow", query: { partialNameSearch: name } })).json().data as Array<{ id: string; name: string }>;
      const id = hit.find((f) => f.name === name)?.id;
      expect(id).toBeDefined();
      copies.push(id!);
      created.push({ resource: "flow", id: id! });
    }
    const bulk = await apply("wxcc-ext-bulk", { resource: "flow", operation: "delete", items: copies.map((id) => ({ id })) });
    expect(bulk, JSON.stringify(bulk)).toMatchObject({ succeededCount: 2, failedCount: 0 });
    for (const id of copies) created.splice(created.findIndex((c) => c.id === id), 1);
  }, 240_000);

  it("reads singletons without an id", async () => {
    for (const resource of ["organization-setting", "tenant-configuration"]) {
      const res = await call("wxcc-ext-get", { resource });
      expect(res.isError, res.text).toBe(false);
      expect(res.json().id).toBeTypeOf("string");
    }
  }, 60_000);

  it("never shows the token in tool output, logs or snapshots", () => {
    expect(token.length).toBeGreaterThan(10);
    for (const text of outputs) expect(text.includes(token)).toBe(false);
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
    for (const f of [...files(config.logDir), ...files(config.snapshotDir)]) {
      expect(readFileSync(f, "utf8").includes(token), f).toBe(false);
    }
  });
});
