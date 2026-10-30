import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FileProcessor } from "../src/write/files.js";
import { json, ORG, route, startServer, TOKEN, type Route } from "./helpers.js";

type Harness = Awaited<ReturnType<typeof startServer>>;
let h: Harness | undefined;
afterEach(async () => {
  await h?.close();
  h = undefined;
});

const rw = { mode: "read-write" as const };

/** A mutable fake record served at GET path, with a version that can be bumped between calls. */
function record(path: string, data: Record<string, unknown>) {
  const state = { data: { ...data } };
  const r: Route = route("GET", path, () => json(200, { ...state.data, _links: { self: { href: "/x" } } }));
  return { state, route: r };
}

function bodyOf(call: [string, RequestInit]): unknown {
  return JSON.parse(String(call[1].body));
}

function snapshots(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(d, e.name));
      else out.push(join(d, e.name));
    }
  };
  walk(dir);
  return out;
}

describe("mode gating", () => {
  it("registers no write tools in read-only mode", async () => {
    h = await startServer();
    const names = (await h.mcp.listTools()).tools.map((t) => t.name);
    expect(names).not.toContain("wxcc-ext-update");
    const res = await h.call("wxcc-ext-update", { resource: "team", id: "t1", changes: { name: "x" } }).catch((e: Error) => ({
      isError: true,
      text: e.message,
    }));
    expect(res.isError).toBe(true);
    expect(h.writes()).toHaveLength(0);
  });

  it("registers nine tools within the 8 KB budget in read-write mode", async () => {
    h = await startServer({ config: rw });
    const { tools } = await h.mcp.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "wxcc-ext-action",
      "wxcc-ext-bulk",
      "wxcc-ext-create",
      "wxcc-ext-delete",
      "wxcc-ext-describe-resource",
      "wxcc-ext-get",
      "wxcc-ext-list",
      "wxcc-ext-list-resource-types",
      "wxcc-ext-update",
    ]);
    expect(JSON.stringify(tools).length).toBeLessThan(8 * 1024);
  });
});

describe("wxcc-ext-update", () => {
  const userRec = () =>
    record("/user/u1", { id: "u1", version: 3, firstName: "Ann", lastName: "Lee", teamIds: ["t1"], createdTime: 1, lastUpdatedTime: 2 });

  it("dry-runs by default: reads, diffs, writes nothing, logs a dry-run", async () => {
    const u = userRec();
    h = await startServer({ config: rw, routes: [u.route] });
    const res = await h.call("wxcc-ext-update", { resource: "user", id: "u1", changes: { firstName: "Anna" } });
    const d = res.json();
    expect(d.dryRun).toBe(true);
    expect(d.request).toBe(`PATCH /organization/${ORG}/user/u1`);
    expect(d.changes).toEqual([{ path: "firstName", before: "Ann", after: "Anna" }]);
    expect(d.confirm).toMatch(/^[0-9a-f]{16}$/);
    expect(d.next).toContain(`confirm: "${d.confirm}"`);
    expect(h.writes()).toHaveLength(0);
    expect(h.logLines().map((l) => l.phase)).toEqual(["read", "dry-run"]);
    expect(h.logLines()[1]).toMatchObject({ tool: "wxcc-ext-update", changedFields: ["firstName"], status: "ok" });
  });

  it("applies with the hash: PATCH with only the changes, before-snapshot, apply log line", async () => {
    const u = userRec();
    h = await startServer({
      config: rw,
      routes: [u.route, route("PATCH", "/user/u1", () => json(200, { id: "u1", version: 4, firstName: "Anna" }, { trackingid: "trk-p" }))],
    });
    const args = { resource: "user", id: "u1", changes: { firstName: "Anna" } };
    const { confirm } = (await h.call("wxcc-ext-update", args)).json();
    const res = (await h.call("wxcc-ext-update", { ...args, confirm })).json();
    expect(res).toMatchObject({ applied: true, httpStatus: 200, trackingId: "trk-p", result: { id: "u1", version: 4 } });
    const [patch] = h.writes();
    expect(bodyOf(patch!)).toEqual({ firstName: "Anna" });
    const snap = JSON.parse(readFileSync(res.snapshot, "utf8"));
    expect(snap).toMatchObject({ id: "u1", version: 3, firstName: "Ann" });
    expect(res.snapshot.startsWith(h.snapshotDir)).toBe(true);
    const apply = h.logLines().at(-1)!;
    expect(apply).toMatchObject({ phase: "apply", method: "PATCH", status: "ok", changedFields: ["firstName"], snapshot: res.snapshot });
  });

  it("merges and PUTs full-replace resources, stripping read-only fields and replacing arrays", async () => {
    const team = record("/team/t1", {
      id: "t1",
      version: 7,
      name: "Sales",
      teamType: "AGENT",
      queueRankings: [{ queueId: "q1", rank: 1 }, { queueId: "q2", rank: 2 }],
      createdTime: 1,
      lastUpdatedTime: 2,
    });
    h = await startServer({ config: rw, routes: [team.route, route("PUT", "/team/t1", () => json(200, { id: "t1" }))] });
    const args = { resource: "team", id: "t1", changes: { name: "Sales EMEA", queueRankings: [{ queueId: "q3", rank: 1 }] } };
    const dry = (await h.call("wxcc-ext-update", args)).json();
    expect(dry.request).toBe(`PUT /organization/${ORG}/team/t1`);
    expect(dry.summary).toContain("(read, merge, PUT)");
    await h.call("wxcc-ext-update", { ...args, confirm: dry.confirm });
    expect(bodyOf(h.writes()[0]!)).toEqual({
      id: "t1",
      version: 7,
      name: "Sales EMEA",
      teamType: "AGENT",
      queueRankings: [{ queueId: "q3", rank: 1 }],
    });
  });

  it("rejects a stale version between dry-run and apply", async () => {
    const u = userRec();
    h = await startServer({ config: rw, routes: [u.route, route("PATCH", "/user/u1", () => json(200, {}))] });
    const args = { resource: "user", id: "u1", changes: { firstName: "Anna" } };
    const { confirm } = (await h.call("wxcc-ext-update", args)).json();
    u.state.data.version = 4; // someone else saved the record
    const res = await h.call("wxcc-ext-update", { ...args, confirm });
    expect(res.isError).toBe(true);
    expect(res.text).toMatch(/^stale version: user u1 changed since the dry-run \(v3 → v4\)/);
    expect(h.writes()).toHaveLength(0);
  });

  it("rejects a confirm hash for different arguments", async () => {
    const u = userRec();
    h = await startServer({ config: rw, routes: [u.route] });
    const { confirm } = (await h.call("wxcc-ext-update", { resource: "user", id: "u1", changes: { firstName: "Anna" } })).json();
    const res = await h.call("wxcc-ext-update", { resource: "user", id: "u1", changes: { firstName: "Bob" }, confirm });
    expect(res.text).toMatch(/^confirmation does not match this request/);
    expect(h.writes()).toHaveLength(0);
  });

  it("refuses no-op changes and warns about read-only fields", async () => {
    const u = userRec();
    h = await startServer({ config: rw, routes: [u.route] });
    expect((await h.call("wxcc-ext-update", { resource: "user", id: "u1", changes: { firstName: "Ann" } })).text).toBe(
      "no changes: the record already has these values",
    );
    const d = (await h.call("wxcc-ext-update", { resource: "user", id: "u1", changes: { lastName: "Li", createdTime: 9 } })).json();
    expect(d.warnings).toEqual(["ignored read-only fields: createdTime"]);
    expect(d.changes).toEqual([{ path: "lastName", before: "Lee", after: "Li" }]);
  });

  it("resolves a singleton's id from its list", async () => {
    h = await startServer({
      config: rw,
      routes: [
        route("GET", "/v2/tenant-configuration", () => json(200, { meta: {}, data: [{ id: "tc1" }] })),
        record("/tenant-configuration/tc1", { id: "tc1", version: 1, timezone: "UTC" }).route,
      ],
    });
    const d = (await h.call("wxcc-ext-update", { resource: "tenant-configuration", changes: { timezone: "CET" } })).json();
    expect(d.request).toBe(`PUT /organization/${ORG}/tenant-configuration/tc1`);
  });

  it("refuses writes when the operation log cannot be written", async () => {
    const u = userRec();
    h = await startServer({ config: rw, routes: [u.route, route("PATCH", "/user/u1", () => json(200, {}))] });
    const args = { resource: "user", id: "u1", changes: { firstName: "Anna" } };
    const { confirm } = (await h.call("wxcc-ext-update", args)).json();
    await h.close();
    const blocker = join(h.logDir, "blocker");
    writeFileSync(blocker, "x");
    h = await startServer({ config: { ...rw, log_dir: join(blocker, "logs") }, routes: [u.route, route("PATCH", "/user/u1", () => json(200, {}))] });
    const res = await h.call("wxcc-ext-update", { ...args, confirm });
    expect(res.text).toMatch(/^operation log not writable .*writes are refused/);
    expect(h.writes()).toHaveLength(0);
  });
});

describe("wxcc-ext-create", () => {
  it("dry-runs with the body and required-field warnings, then POSTs without a snapshot", async () => {
    h = await startServer({ config: rw, routes: [route("POST", "/team", () => json(201, { id: "t9", name: "New" }))] });
    const args = { resource: "team", body: { name: "New", teamType: "AGENT" } };
    const dry = (await h.call("wxcc-ext-create", args)).json();
    expect(dry.body).toEqual(args.body);
    expect(dry.warnings[0]).toMatch(/required: active, rankQueuesForTeam, siteId, teamStatus/);
    const res = (await h.call("wxcc-ext-create", { ...args, confirm: dry.confirm })).json();
    expect(res).toMatchObject({ applied: true, httpStatus: 201, result: { id: "t9" } });
    expect(res.snapshot).toBeUndefined();
    expect(bodyOf(h.writes()[0]!)).toEqual(args.body);
  });

  it("fills parentId into child resource paths", async () => {
    h = await startServer({ config: rw });
    const dry = (await h.call("wxcc-ext-create", { resource: "address-book-entry", parentId: "ab1", body: { name: "x", number: "+1" } })).json();
    expect(dry.request).toBe(`POST /organization/${ORG}/address-book/ab1/entry`);
  });
});

describe("audio uploads", () => {
  const files: FileProcessor = {
    fingerprint: vi.fn((input) => `fp-${input.text ?? input.path}`),
    prepare: vi.fn(async (_input, _kind, name) => ({ bytes: new Uint8Array([82, 73, 70, 70]), filename: `${name}.wav`, contentType: "audio/wav" })),
  };

  it("creates an audio file as multipart with a default WAV content type", async () => {
    h = await startServer({ config: rw, files, routes: [route("POST", "/audio-file", () => json(200, { id: "a1" }))] });
    const missing = await h.call("wxcc-ext-create", { resource: "audio-file", body: { name: "Welcome" } });
    expect(missing.text).toMatch(/needs file: \{ path \} to a local audio file, or \{ text \}/);
    const args = { resource: "audio", body: { name: "Welcome" }, file: { text: "Welcome to Acme", voice: "Samantha" } };
    const dry = (await h.call("wxcc-ext-create", args)).json();
    expect(dry.body).toEqual({ audioFileInfo: { name: "Welcome", contentType: "AUDIO_WAV" }, audioFile: "<file>" });
    expect(files.prepare).not.toHaveBeenCalled();
    await h.call("wxcc-ext-create", { ...args, confirm: dry.confirm });
    expect(files.prepare).toHaveBeenCalledWith({ text: "Welcome to Acme", voice: "Samantha" }, "audio", "Welcome");
    const form = h.writes()[0]![1].body as FormData;
    expect(form).toBeInstanceOf(FormData);
    const audio = form.get("audioFile") as File;
    expect(audio.name).toBe("Welcome.wav");
    expect(audio.type).toBe("audio/wav");
    expect(JSON.parse(await (form.get("audioFileInfo") as Blob).text())).toEqual({ name: "Welcome", contentType: "AUDIO_WAV" });
  });

  it("updates with PUT multipart when a file is given, PATCH otherwise", async () => {
    const a = record("/audio-file/a1", { id: "a1", version: 1, name: "Welcome", contentType: "AUDIO_WAV", description: "old" });
    h = await startServer({ config: rw, files, routes: [a.route] });
    const withFile = (await h.call("wxcc-ext-update", { resource: "audio-file", id: "a1", changes: {}, file: { path: "/x.mp3" } })).json();
    expect(withFile.request).toBe(`PUT /organization/${ORG}/audio-file/a1`);
    expect(withFile.summary).toContain("with a new file");
    const noFile = (await h.call("wxcc-ext-update", { resource: "audio-file", id: "a1", changes: { description: "new" } })).json();
    expect(noFile.request).toBe(`PATCH /organization/${ORG}/audio-file/a1`);
  });
});

describe("wxcc-ext-delete", () => {
  it("snapshots then deletes; a 412 names the referencing entities", async () => {
    const s = record("/skill/s1", { id: "s1", version: 2, name: "French" });
    let blocked = true;
    h = await startServer({
      config: rw,
      routes: [
        s.route,
        route("DELETE", "/skill/s1", () =>
          blocked
            ? json(412, { trackingId: "trk-d", error: { message: [{ description: "in use", entity: "skill-profile", references: [{ id: "sp1", name: "Bilingual" }] }] } })
            : new Response(null, { status: 204 }),
        ),
      ],
    });
    const dry = (await h.call("wxcc-ext-delete", { resource: "skill", id: "s1" })).json();
    expect(dry.summary).toBe('delete skill s1 "French"');
    const fail = await h.call("wxcc-ext-delete", { resource: "skill", id: "s1", confirm: dry.confirm });
    expect(fail.text).toBe("in use by other entities: skill-profile Bilingual (sp1) (trackingId: trk-d)");
    expect(h.logLines().at(-1)).toMatchObject({ phase: "apply", status: "error", httpStatus: 412 });
    blocked = false;
    const ok = (await h.call("wxcc-ext-delete", { resource: "skill", id: "s1", confirm: dry.confirm })).json();
    expect(ok.httpStatus).toBe(204);
    expect(snapshots(h.snapshotDir)).toHaveLength(2);
  });
});

describe("wxcc-ext-bulk", () => {
  it("merges existing items, injects organizationId, sends DELETE items, reports 207 per item", async () => {
    const existing = record("/skill/s1", { id: "s1", version: 1, name: "French", active: true, createdTime: 5 });
    const gone = record("/skill/s2", { id: "s2", version: 1, name: "Old" });
    h = await startServer({
      config: rw,
      routes: [
        existing.route,
        gone.route,
        route("POST", "/skill/bulk", () =>
          json(207, {
            items: [
              { itemIdentifier: 1, status: 200, operationType: "UPDATE", href: "/skill/s1" },
              { itemIdentifier: 2, status: 201, operationType: "CREATE" },
              { itemIdentifier: 3, status: 412, apiError: { error: { message: [{ description: "skill in use" }] } } },
            ],
          }),
        ),
      ],
    });
    const args = {
      resource: "skill",
      items: [
        { item: { id: "s1", active: false } },
        { item: { name: "German", skillType: "BOOLEAN" } },
        { action: "DELETE", item: { id: "s2" } },
      ],
    };
    const dry = (await h.call("wxcc-ext-bulk", args)).json();
    expect(dry.summary).toBe("bulk save of 3 skill item(s), 1 DELETE");
    expect(dry.changes).toEqual([
      { path: "[1] active", before: true, after: false },
      { path: "[1] organizationId", after: ORG },
      { path: "[2] SAVE (new)", after: '"German"' },
      { path: "[3] DELETE", before: 's2 "Old"' },
    ]);
    const res = (await h.call("wxcc-ext-bulk", { ...args, confirm: dry.confirm })).json();
    expect(bodyOf(h.writes()[0]!)).toEqual({
      items: [
        { itemIdentifier: 1, requestAction: "SAVE", item: { id: "s1", version: 1, name: "French", active: false, organizationId: ORG } },
        { itemIdentifier: 2, requestAction: "SAVE", item: { name: "German", skillType: "BOOLEAN", organizationId: ORG } },
        { itemIdentifier: 3, requestAction: "DELETE", item: { id: "s2", version: 1, name: "Old", organizationId: ORG } },
      ],
    });
    expect(res.result).toEqual({
      succeeded: 2,
      failed: 1,
      items: [
        { itemIdentifier: 1, status: 200, operationType: "UPDATE", href: "/skill/s1" },
        { itemIdentifier: 2, status: 201, operationType: "CREATE" },
        { itemIdentifier: 3, status: 412, error: "skill in use" },
      ],
    });
    const snap = JSON.parse(readFileSync(res.snapshot, "utf8"));
    expect(snap.items.map((i: { id: string }) => i.id)).toEqual(["s1", "s2"]);
  });

  it("patch sends partial items and needs ids", async () => {
    const a = record("/auxiliary-code/a1", { id: "a1", version: 1, name: "Lunch", active: true });
    h = await startServer({ config: rw, routes: [a.route] });
    expect((await h.call("wxcc-ext-bulk", { resource: "auxiliary-code", operation: "patch", items: [{ item: { active: false } }] })).text).toBe(
      "item 1: patch items need item.id",
    );
    const dry = (await h.call("wxcc-ext-bulk", { resource: "auxiliary-code", operation: "patch", items: [{ item: { id: "a1", active: false } }] })).json();
    expect(dry.request).toBe(`PATCH /organization/${ORG}/auxiliary-code/bulk`);
    expect(dry.body).toEqual({ items: [{ itemIdentifier: 1, item: { active: false, id: "a1", organizationId: ORG } }] });
  });

  it("refuses bulk on resources without it", async () => {
    h = await startServer({ config: rw });
    expect((await h.call("wxcc-ext-bulk", { resource: "address-book", items: [{ item: {} }] })).text).toBe(
      "address-book does not support bulk save",
    );
  });
});

describe("wxcc-ext-action", () => {
  it("dry-runs and applies a named write action with query params", async () => {
    h = await startServer({ config: rw, routes: [route("POST", "/team/purge-inactive-entities", () => json(200, { code: 200 }))] });
    const args = { resource: "team", action: "purge-inactive", query: { nextStartId: "x" } };
    const dry = (await h.call("wxcc-ext-action", args)).json();
    expect(dry.request).toBe(`POST /organization/${ORG}/team/purge-inactive-entities`);
    await h.call("wxcc-ext-action", { ...args, confirm: dry.confirm });
    expect(new URL(h.writes()[0]![0]).searchParams.get("nextStartId")).toBe("x");
  });

  it("snapshots the target of id-scoped actions", async () => {
    const q = record("/v2/contact-service-queue/q1", { id: "q1", version: 5, name: "Sales" });
    h = await startServer({ config: rw, routes: [q.route, route("POST", "/v2/contact-service-queue/q1/reassign-agents", () => json(200, {}))] });
    const args = { resource: "queue", action: "reassign-agents", id: "q1", body: { agentsToAdd: ["u1"] } };
    const dry = (await h.call("wxcc-ext-action", args)).json();
    expect(dry.summary).toBe('reassign-agents on contact-service-queue q1 "Sales"');
    expect(dry.body).toEqual({ agentsToAdd: ["u1"] });
    const res = (await h.call("wxcc-ext-action", { ...args, confirm: dry.confirm })).json();
    expect(JSON.parse(readFileSync(res.snapshot, "utf8")).version).toBe(5);
  });

  it("runs fetch-* actions immediately as reads", async () => {
    h = await startServer({
      config: rw,
      routes: [route("POST", "/user/fetch-user-details-by-ids", () => json(200, { meta: {}, data: [{ id: "u1" }] }))],
    });
    const res = (await h.call("wxcc-ext-action", { resource: "user", action: "fetch-user-details-by-ids", body: { ids: ["u1"] } })).json();
    expect(res.data).toEqual([{ id: "u1" }]);
    expect(h.logLines().at(-1)).toMatchObject({ phase: "read", op: "action:fetch-user-details-by-ids", status: "ok" });
  });

  it("lists available actions for unknown names", async () => {
    h = await startServer({ config: rw });
    expect((await h.call("wxcc-ext-action", { resource: "team", action: "explode" })).text).toBe(
      'team has no action "explode" (actions: purge-inactive)',
    );
  });
});

describe("secrets", () => {
  it("never writes the token to logs or snapshots", async () => {
    const u = record("/user/u1", { id: "u1", version: 1, firstName: "A" });
    h = await startServer({ config: rw, routes: [u.route, route("PATCH", "/user/u1", () => json(500, { error: { message: [{ description: TOKEN }] } }))] });
    const args = { resource: "user", id: "u1", changes: { firstName: "B" } };
    const { confirm } = (await h.call("wxcc-ext-update", args)).json();
    await h.call("wxcc-ext-update", { ...args, confirm });
    expect(h.rawLog()).not.toContain(TOKEN);
    for (const f of snapshots(h.snapshotDir)) expect(readFileSync(f, "utf8")).not.toContain(TOKEN);
  });
});
