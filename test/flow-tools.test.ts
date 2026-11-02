/** Flow support (v2.1): list, export to file, import from file, unlock and delete through the generic tools. */
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { json, ORG, startServer, type Route } from "./helpers.js";

type Harness = Awaited<ReturnType<typeof startServer>>;
let h: Harness | undefined;
afterEach(async () => {
  await h?.close();
  h = undefined;
});

const PROJECT = "5e5c9ad6d61f870d6d778c1b";

/** Route helper for flow paths: /<org>/project/<project><path>. */
function flowRoute(method: string, path: string, respond: (url: URL, init: RequestInit) => Response): Route {
  return (url, init) =>
    init.method === method && decodeURIComponent(url.pathname) === `/${ORG}/project/${PROJECT}${path}` ? respond(url, init) : undefined;
}

const FLOW_DOC = {
  name: "Main IVR",
  flowType: "FLOW",
  associatedChannels: [{ channelType: "telephony" }],
  nodes: [{ id: "n1" }, { id: "n2" }],
  edges: [{ from: "n1", to: "n2" }],
};

function exportDir(): string {
  return mkdtempSync(join(tmpdir(), "wxcc-ext-export-"));
}

describe("flow resource", () => {
  it("is visible by default and can still be deferred by config", async () => {
    h = await startServer();
    const listed = (await h.call("wxcc-ext-list-resource-types", { toolset: "flow" })).json();
    expect(listed.resources).toEqual([
      expect.objectContaining({ key: "flow", ops: "list get delete", views: ["export"], actions: ["import", "unlock"] }),
    ]);
    await h.close();

    h = await startServer({ config: { defer_to_official: ["flow"] } });
    const res = await h.call("wxcc-ext-list", { resource: "flow" });
    expect(res.isError).toBe(true);
    expect(res.text).toMatch(/flow is deferred by config/);
  });

  it("lists flows on the regional gateway, maps pageSize to size and asks for page metadata", async () => {
    let seen: URL | undefined;
    h = await startServer({
      routes: [
        flowRoute("GET", "/flows", (url) => {
          seen = url;
          return json(200, { pageInfo: { currentPage: 1, pageSize: 2, totalPages: 3, totalRecords: 5 }, data: [{ id: "f1", name: "A" }] });
        }),
      ],
    });
    const res = await h.call("wxcc-ext-list", { resource: "flow", page: 1, pageSize: 2, query: { flowType: "SUBFLOW" } });
    expect(res.isError).toBe(false);
    expect(seen?.origin).toBe("https://api.wxcc-us1.cisco.com");
    expect(Object.fromEntries(seen!.searchParams)).toEqual({ page: "1", size: "2", flowType: "SUBFLOW", includePagination: "true" });
    expect(res.json()).toEqual({ resource: "flow", meta: { page: 1, pageSize: 2, totalPages: 3, totalRecords: 5 }, data: [{ id: "f1", name: "A" }] });
  });

  it("rejects an unknown flowType", async () => {
    h = await startServer();
    const res = await h.call("wxcc-ext-list", { resource: "flow", query: { flowType: "flows" } });
    expect(res.isError).toBe(true);
    expect(res.text).toMatch(/flowType" must be one of FLOW, SUBFLOW/);
  });
});

describe("flow export with saveTo (read-only mode)", () => {
  it("writes the full export to a new file under export_dir and never overwrites", async () => {
    const dir = exportDir();
    let seen: URL | undefined;
    h = await startServer({
      config: { export_dir: dir },
      routes: [
        flowRoute("GET", "/v2/flows/f1:export", (url) => {
          seen = url;
          return json(200, FLOW_DOC);
        }),
      ],
    });
    const args = { resource: "flow", id: "f1", view: "export", query: { version: "draft" }, saveTo: "ivr/main.json" };
    const res = await h.call("wxcc-ext-get", args);
    expect(res.isError).toBe(false);
    const out = res.json();
    expect(out).toMatchObject({ saved: join(dir, "ivr", "main.json"), name: "Main IVR", flowType: "FLOW" });
    expect(JSON.parse(readFileSync(out.saved, "utf8"))).toEqual(FLOW_DOC);
    expect(seen?.searchParams.get("version")).toBe("draft");
    expect(h.logLines().some((l) => l.file === out.saved && l.op === "view:export")).toBe(true);

    const again = await h.call("wxcc-ext-get", args);
    expect(again.isError).toBe(true);
    expect(again.text).toMatch(/file already exists/);

    const bad = await h.call("wxcc-ext-get", { ...args, saveTo: "main.txt" });
    expect(bad.text).toMatch(/must end in \.json/);
  });
});

describe("flow import with bodyFile", () => {
  it("dry-runs with an outline, applies the exact file content, and rejects a file changed after the dry-run", async () => {
    const dir = exportDir();
    const file = join(dir, "main.json");
    writeFileSync(file, JSON.stringify(FLOW_DOC));
    h = await startServer({
      config: { mode: "read-write", export_dir: dir },
      routes: [flowRoute("POST", "/v2/flows:import", () => json(201, { flowId: "new1", name: "Main IVR" }))],
    });
    const args = { resource: "flow", action: "import", bodyFile: "main.json", query: { overwrite: false } };

    const dry = (await h.call("wxcc-ext-action", args)).json();
    expect(dry.dryRun).toBe(true);
    expect(dry.summary).toBe(`import on flow from ${file} "Main IVR"`);
    expect(dry.body).toEqual({
      file,
      outline: { name: "Main IVR", flowType: "FLOW", associatedChannels: "[1 items]", nodes: "[2 items]", edges: "[1 items]" },
    });
    expect(h.writes()).toHaveLength(0);

    const applied = (await h.call("wxcc-ext-action", { ...args, confirm: dry.confirm })).json();
    expect(applied).toMatchObject({ applied: true, httpStatus: 201, result: { flowId: "new1" } });
    const [url, init] = h.writes()[0]!;
    expect(new URL(url).searchParams.get("overwrite")).toBe("false");
    expect(JSON.parse(String(init.body))).toEqual(FLOW_DOC);
    expect(h.logLines().filter((l) => l.phase === "apply")[0]).toMatchObject({ file, op: "action:import" });

    const dry2 = (await h.call("wxcc-ext-action", args)).json();
    writeFileSync(file, JSON.stringify({ ...FLOW_DOC, name: "Changed" }));
    const stale = await h.call("wxcc-ext-action", { ...args, confirm: dry2.confirm });
    expect(stale.isError).toBe(true);
    expect(h.writes()).toHaveLength(1);
  });

  it("refuses both body and bodyFile, missing files and invalid JSON", async () => {
    const dir = exportDir();
    writeFileSync(join(dir, "broken.json"), "{ nope");
    h = await startServer({ config: { mode: "read-write", export_dir: dir } });
    const both = await h.call("wxcc-ext-action", { resource: "flow", action: "import", body: {}, bodyFile: "x.json" });
    expect(both.text).toMatch(/not both/);
    const missing = await h.call("wxcc-ext-action", { resource: "flow", action: "import", bodyFile: "x.json" });
    expect(missing.text).toMatch(/file not found/);
    const broken = await h.call("wxcc-ext-action", { resource: "flow", action: "import", bodyFile: "broken.json" });
    expect(broken.text).toMatch(/not valid JSON/);
    expect(h.writes()).toHaveLength(0);
  });
});

describe("flow unlock and delete", () => {
  it("unlocks a subflow, reading it with the same flowType first", async () => {
    const gets: URL[] = [];
    h = await startServer({
      config: { mode: "read-write" },
      routes: [
        flowRoute("GET", "/v2/flows/s1", (url) => {
          gets.push(url);
          return json(200, { id: "s1", name: "Sub", flowType: "SUBFLOW" });
        }),
        flowRoute("POST", "/flows/s1:unlock", () => json(200, { locked: false })),
      ],
    });
    const args = { resource: "flow", action: "unlock", id: "s1", query: { flowType: "SUBFLOW" } };
    const dry = (await h.call("wxcc-ext-action", args)).json();
    expect(dry.summary).toBe('unlock on flow s1 "Sub"');
    const applied = (await h.call("wxcc-ext-action", { ...args, confirm: dry.confirm })).json();
    expect(applied.applied).toBe(true);
    expect(applied.snapshot).toMatch(/flow/);
    expect(gets.every((u) => u.searchParams.get("flowType") === "SUBFLOW")).toBe(true);
    expect(new URL(h.writes()[0]![0]).searchParams.get("flowType")).toBe("SUBFLOW");
  });

  it("deletes with the reference check on by default and passes force through", async () => {
    h = await startServer({
      config: { mode: "read-write" },
      routes: [
        flowRoute("GET", "/v2/flows/f1", () => json(200, { id: "f1", name: "Old IVR" })),
        flowRoute("DELETE", "/flows/f1", () => json(200, {})),
      ],
    });
    const dry = (await h.call("wxcc-ext-delete", { resource: "flow", id: "f1" })).json();
    expect(dry.request).toBe(`DELETE /${ORG}/project/${PROJECT}/flows/f1`);
    await h.call("wxcc-ext-delete", { resource: "flow", id: "f1", confirm: dry.confirm });
    expect(Object.fromEntries(new URL(h.writes()[0]![0]).searchParams)).toEqual({ skipRsEPCheck: "false" });

    const args = { resource: "flow", id: "f1", query: { force: "yes", skipRsEPCheck: true } };
    const dry2 = (await h.call("wxcc-ext-delete", args)).json();
    await h.call("wxcc-ext-delete", { ...args, confirm: dry2.confirm });
    expect(Object.fromEntries(new URL(h.writes()[1]![0]).searchParams)).toEqual({ force: "yes", skipRsEPCheck: "true" });
    expect(existsSync(h.snapshotDir)).toBe(true);
  });
});
