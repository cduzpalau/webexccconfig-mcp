/**
 * v2.2: confirm hashes that ignore API array order, wxcc-ext-bulk operation "delete" (one by one,
 * per-record results), 412 explanations and verification of timed-out deletes.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { RESOURCES } from "../src/registry/index.js";
import { json, ORG, route, startServer, type Route } from "./helpers.js";

type Harness = Awaited<ReturnType<typeof startServer>>;
let h: Harness | undefined;
afterEach(async () => {
  await h?.close();
  h = undefined;
});

const rw = { mode: "read-write" as const };
const PROJECT = "5e5c9ad6d61f870d6d778c1b";

function flowRoute(method: string, path: string, respond: (url: URL, init: RequestInit) => Response | Promise<Response>): Route {
  return (url, init) =>
    init.method === method && decodeURIComponent(url.pathname) === `/${ORG}/project/${PROJECT}${path}` ? respond(url, init) : undefined;
}

/** A skill profile whose activeSkills come back in a different order on every read, like the live API. */
function shuffledProfile(id: string) {
  let reads = 0;
  const skills = [
    { id: "a1", skillId: "s1", booleanValue: true },
    { id: "a2", skillId: "s2", booleanValue: true },
    { id: "a3", skillId: "s3", booleanValue: true },
  ];
  return route("GET", `/skill-profile/${id}`, () => {
    reads++;
    const rotated = [...skills.slice(reads % 3), ...skills.slice(0, reads % 3)];
    return json(200, { id, name: `P ${id}`, activeSkills: rotated, createdTime: 1, lastUpdatedTime: 2 });
  });
}

describe("confirm hashes ignore the API's array order", () => {
  it("single delete of a record without version confirms although activeSkills changed order", async () => {
    h = await startServer({
      config: rw,
      routes: [shuffledProfile("p1"), route("DELETE", "/skill-profile/p1", () => new Response(null, { status: 204 }))],
    });
    const dry = (await h.call("wxcc-ext-delete", { resource: "skill-profile", id: "p1" })).json();
    const applied = await h.call("wxcc-ext-delete", { resource: "skill-profile", id: "p1", confirm: dry.confirm });
    expect(applied.isError, applied.text).toBe(false);
    expect(applied.json()).toMatchObject({ applied: true, httpStatus: 204 });
  });

  it("native bulk DELETE items need only an id and confirm despite reordering", async () => {
    h = await startServer({
      config: rw,
      routes: [
        shuffledProfile("p1"),
        shuffledProfile("p2"),
        route("POST", "/skill-profile/bulk", () => json(207, { items: [{ itemIdentifier: 1, status: 200 }, { itemIdentifier: 2, status: 200 }] })),
      ],
    });
    const args = { resource: "skill-profile", items: [{ action: "DELETE", id: "p1" }, { action: "DELETE", id: "p2" }] };
    const dry = await h.call("wxcc-ext-bulk", args);
    expect(dry.isError, dry.text).toBe(false);
    const applied = await h.call("wxcc-ext-bulk", { ...args, confirm: dry.json().confirm });
    expect(applied.isError, applied.text).toBe(false);
    const body = JSON.parse(String(h.writes()[0]![1].body));
    expect(body.items.map((i: { item: { id: string; name: string } }) => i.item.name)).toEqual(["P p1", "P p2"]);
  });
});

describe("wxcc-ext-bulk operation delete", () => {
  it("deletes flows one by one with bounded concurrency and reports each record", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const flows: Record<string, Record<string, unknown> | undefined> = {
      f1: { id: "f1", name: "One" },
      f2: { id: "f2", name: "Two" },
      f3: { id: "f3", name: "Used" },
      f4: { id: "f4", name: "Four" },
      f5: { id: "f5", name: "Five" },
    };
    h = await startServer({
      config: { ...rw, bulk_concurrency: 2 },
      routes: [
        (url, init) => {
          const m = decodeURIComponent(url.pathname).match(new RegExp(`^/${ORG}/project/${PROJECT}/v2/flows/(\\w+)$`));
          if (init.method !== "GET" || !m) return undefined;
          const f = flows[m[1]!];
          return f ? json(200, f) : json(404, { errorMessage: "Flow not found" });
        },
        async (url, init) => {
          const m = decodeURIComponent(url.pathname).match(new RegExp(`^/${ORG}/project/${PROJECT}/flows/(\\w+)$`));
          if (init.method !== "DELETE" || !m) return undefined;
          inFlight++;
          maxInFlight = Math.max(maxInFlight, inFlight);
          await new Promise((r) => setTimeout(r, 5));
          inFlight--;
          if (m[1] === "f3") {
            return json(412, {
              errorCode: 412,
              errorMessage: "Flow f3 of type FLOW has dependent flows: ...",
              dependentFlows: [{ id: "f9", name: "Main IVR" }],
              dependentSubflows: [],
              dependentEPsAndRSs: [],
              dependentRcs: [{ default: false, id: "ep1", name: "Sales EP" }],
            });
          }
          return json(200, "OK");
        },
      ],
    });
    const args = { resource: "flow", operation: "delete", ids: ["f1", "f2", "f3", "f4", "f5", "gone", "f1"] };
    const dry = await h.call("wxcc-ext-bulk", args);
    expect(dry.isError, dry.text).toBe(false);
    expect(dry.json()).toMatchObject({
      dryRun: true,
      summary: "delete 5 flow record(s) one at a time; 1 skipped",
      request: `DELETE /${ORG}/project/${PROJECT}/flows/{id} for each record`,
      skipped: [{ id: "gone", reason: "not found" }],
    });
    expect(h.writes()).toHaveLength(0);

    const res = await h.call("wxcc-ext-bulk", { ...args, confirm: dry.json().confirm });
    expect(res.isError, res.text).toBe(false);
    const out = res.json();
    expect(out).toMatchObject({ applied: true, total: 6, succeededCount: 4, failedCount: 1, skippedCount: 1 });
    expect(out.succeeded.map((s: { id: string }) => s.id)).toEqual(["f1", "f2", "f4", "f5"]);
    expect(out.failed).toEqual([
      {
        id: "f3",
        name: "Used",
        httpStatus: 412,
        error: "in use by other entities: flow Main IVR (f9), entry point Sales EP (ep1)",
      },
    ]);
    expect(maxInFlight).toBe(2);
    // Every DELETE sends the reference check; every record was snapshotted on its own.
    expect(h.writes().every(([u]) => new URL(u).searchParams.get("skipRsEPCheck") === "false")).toBe(true);
    expect(readdirSync(join(h.snapshotDir, "flow")).sort()).toEqual(["f1", "f2", "f3", "f4", "f5"]);
    expect(h.logLines().filter((l) => l.phase === "apply" && l.op === "delete" && l.id).length).toBe(5);
  });

  it("accepts items with ids, skips system defaults and refuses stale records", async () => {
    let version = 1;
    h = await startServer({
      config: rw,
      routes: [
        route("GET", "/team/t1", () => json(200, { id: "t1", name: "Team-1", systemDefault: true })),
        route("GET", "/team/t2", () => json(200, { id: "t2", name: "Old", version })),
        route("DELETE", "/team/t2", () => new Response(null, { status: 204 })),
      ],
    });
    const args = { resource: "team", operation: "delete", items: [{ id: "t1" }, { item: { id: "t2" } }] };
    const dry = (await h.call("wxcc-ext-bulk", args)).json();
    expect(dry.skipped).toEqual([{ id: "t1", name: "Team-1", reason: "system default: the API refuses to delete it" }]);
    expect(dry.delete).toEqual([{ id: "t2", name: "Old" }]);

    version = 2;
    const stale = await h.call("wxcc-ext-bulk", { ...args, confirm: dry.confirm });
    expect(stale.isError).toBe(true);
    expect(stale.text).toMatch(/stale: t2 changed since the dry-run/);
    expect(h.writes()).toHaveLength(0);

    const dry2 = (await h.call("wxcc-ext-bulk", args)).json();
    const ok = (await h.call("wxcc-ext-bulk", { ...args, confirm: dry2.confirm })).json();
    expect(ok).toMatchObject({ succeededCount: 1, failedCount: 0, skippedCount: 1 });
  });

  it("sends progress notifications when the client asks for them", async () => {
    h = await startServer({
      config: rw,
      routes: [
        route("GET", "/skill/s1", () => json(200, { id: "s1", version: 1 })),
        route("GET", "/skill/s2", () => json(200, { id: "s2", version: 1 })),
        route("DELETE", "/skill/s1", () => new Response(null, { status: 204 })),
        route("DELETE", "/skill/s2", () => new Response(null, { status: 204 })),
      ],
    });
    const args = { resource: "skill", operation: "delete", ids: ["s1", "s2"] };
    const dry = (await h.call("wxcc-ext-bulk", args)).json();
    const progress: number[] = [];
    await h.mcp.callTool({ name: "wxcc-ext-bulk", arguments: { ...args, confirm: dry.confirm } }, undefined, {
      onprogress: (p) => progress.push(p.progress),
    });
    expect(progress).toEqual([1, 2]);
  });

  it("validates input", async () => {
    h = await startServer({ config: rw });
    const many = Array.from({ length: 51 }, (_, i) => `id${i}`);
    expect((await h.call("wxcc-ext-bulk", { resource: "skill", operation: "delete", ids: many })).text).toMatch(/at most 50 ids/);
    expect((await h.call("wxcc-ext-bulk", { resource: "skill", operation: "delete", items: [{ action: "SAVE", item: {} }] })).text).toMatch(
      /takes ids, not SAVE items/,
    );
    expect((await h.call("wxcc-ext-bulk", { resource: "skill", operation: "delete", items: [{}] })).text).toMatch(/every item needs an id/);
    expect((await h.call("wxcc-ext-bulk", { resource: "skill", ids: ["a"] })).text).toMatch(/ids is for operation delete/);
    expect((await h.call("wxcc-ext-bulk", { resource: "skill", items: [{ action: "SAVE" }] })).text).toMatch(/SAVE items need item/);
    expect((await h.call("wxcc-ext-bulk", { resource: "flow", items: [{ id: "f1", action: "DELETE" }] })).text).toMatch(
      /flow does not support bulk save; to delete many records use operation delete with ids/,
    );
  });
});

describe("refused deletes name what uses the record", () => {
  it("fills in names from the references view when the 412 only gives entity types", async () => {
    let refQuery: URLSearchParams | undefined;
    h = await startServer({
      config: rw,
      routes: [
        route("GET", "/skill/s1", () => json(200, { id: "s1", name: "Billing", version: 1 })),
        route("DELETE", "/skill/s1", () =>
          json(412, {
            trackingId: "tr-1",
            error: { key: "412", reason: "Entity with id s1 is referred in other entities.", referencedEntities: ["skill-profile"] },
          }),
        ),
        route("GET", "/skill/s1/incoming-references", (url) => {
          refQuery = url.searchParams;
          return json(200, { meta: { totalRecords: 1, currentEntity: "skill-profile" }, data: [{ id: "p1", name: "Gold" }] });
        }),
      ],
    });
    const dry = (await h.call("wxcc-ext-delete", { resource: "skill", id: "s1" })).json();
    const res = await h.call("wxcc-ext-delete", { resource: "skill", id: "s1", confirm: dry.confirm });
    expect(res.isError).toBe(true);
    expect(res.text).toBe("in use by other entities (skill-profile): skill-profile Gold (p1) (trackingId: tr-1)");
    expect(refQuery?.get("type")).toBe("skill-profile");
  });

  it("warns in the dry-run when the record is a system default", async () => {
    h = await startServer({ config: rw, routes: [route("GET", "/team/t1", () => json(200, { id: "t1", name: "Team-1", systemDefault: true }))] });
    const dry = (await h.call("wxcc-ext-delete", { resource: "team", id: "t1" })).json();
    expect(dry.warnings).toEqual(["system default: the API refuses to delete it"]);
  });
});

describe("timed-out deletes", () => {
  const timeout = () => {
    throw new DOMException("The operation timed out.", "TimeoutError");
  };

  it("flow deletes get a 90 s timeout", () => {
    const del = RESOURCES.find((r) => r.key === "flow")!.operations.find((o) => o.kind === "delete")!;
    expect(del.timeoutMs).toBe(90_000);
  });

  it("counts a timed-out delete as done when the record then reads as not found", async () => {
    let gets = 0;
    h = await startServer({
      config: rw,
      routes: [
        flowRoute("GET", "/v2/flows/f1", () => (++gets <= 2 ? json(200, { id: "f1", name: "Slow" }) : json(404, { errorMessage: "not found" }))),
        flowRoute("DELETE", "/flows/f1", timeout),
      ],
    });
    const dry = (await h.call("wxcc-ext-delete", { resource: "flow", id: "f1" })).json();
    const res = await h.call("wxcc-ext-delete", { resource: "flow", id: "f1", confirm: dry.confirm });
    expect(res.isError, res.text).toBe(false);
    expect(res.json()).toMatchObject({ applied: true, note: "the DELETE timed out, but 2s later the record reads as not found: deleted" });
    expect(res.json().httpStatus).toBeUndefined();
    expect(h.sleeps).toEqual([2000]);
    expect(h.logLines().some((l) => l.note && l.status === "ok" && l.id === "f1")).toBe(true);
  });

  it("reports a timed-out delete whose record still exists", async () => {
    h = await startServer({
      config: rw,
      routes: [flowRoute("GET", "/v2/flows/f1", () => json(200, { id: "f1" })), flowRoute("DELETE", "/flows/f1", timeout)],
    });
    const dry = (await h.call("wxcc-ext-delete", { resource: "flow", id: "f1" })).json();
    const res = await h.call("wxcc-ext-delete", { resource: "flow", id: "f1", confirm: dry.confirm });
    expect(res.isError).toBe(true);
    expect(res.text).toMatch(/^request timed out after 90000ms: DELETE .*: the record still exists 17s later; the delete may still finish/);
    expect(h.sleeps).toEqual([2000, 5000, 10000]);
  });
});
