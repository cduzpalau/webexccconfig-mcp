import { afterEach, describe, expect, it } from "vitest";
import { json, ORG, route, startServer, TOKEN } from "./helpers.js";

type Harness = Awaited<ReturnType<typeof startServer>>;
let h: Harness | undefined;
afterEach(async () => {
  await h?.close();
  h = undefined;
});

const TEAMS = {
  meta: { orgid: ORG, page: 0, pageSize: 2, totalPages: 3, totalRecords: 5, links: { next: "/x?page=1" } },
  data: [
    { id: "t1", name: "Sales", links: [] },
    { id: "t2", name: "Support", _links: { self: { href: "/x" } } },
  ],
};

describe("tools/list", () => {
  it("exposes the four read tools, prefixed, within the size budget", async () => {
    h = await startServer();
    const { tools } = await h.mcp.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "wxcc-ext-describe-resource",
      "wxcc-ext-get",
      "wxcc-ext-list",
      "wxcc-ext-list-resource-types",
    ]);
    expect(JSON.stringify(tools).length).toBeLessThan(6 * 1024);
    for (const t of tools) {
      expect(t.annotations?.readOnlyHint).toBe(true);
      expect(t.description ?? "").not.toMatch(/official/i);
    }
  });
});

describe("wxcc-ext-list-resource-types", () => {
  it("lists visible resources with ops, views and actions, hiding deferred ones", async () => {
    h = await startServer();
    const res = (await h.call("wxcc-ext-list-resource-types", {})).json();
    const keys = res.resources.map((r: { key: string }) => r.key);
    expect(res.mode).toBe("read-only");
    expect(keys).toContain("team");
    for (const deferred of ["entry-point", "business-hours", "dial-number"]) expect(keys).not.toContain(deferred);
    const csq = res.resources.find((r: { key: string }) => r.key === "contact-service-queue");
    expect(csq.ops).toBe("list get create update delete bulkSave bulkPatch");
    expect(csq.views).toContain("references");
    expect(csq.actions).toContain("reassign-agents");
    expect(csq.aliases).toEqual(["queue", "csq"]);
    expect(h.logLines().at(-1)).toMatchObject({ tool: "wxcc-ext-list-resource-types", phase: "local", status: "ok" });
  });

  it("honours config toolsets and defer list, and the toolset filter", async () => {
    h = await startServer({ config: { toolsets: ["routing", "schedule"], defer_to_official: ["skill"] } });
    const keys = (await h.call("wxcc-ext-list-resource-types", {})).json().resources.map((r: { key: string }) => r.key);
    expect(keys).toContain("team");
    expect(keys).toContain("business-hours"); // no longer deferred
    expect(keys).not.toContain("skill");
    expect(keys).not.toContain("user");
    const sched = (await h.call("wxcc-ext-list-resource-types", { toolset: "schedule" })).json();
    expect(sched.resources.map((r: { key: string }) => r.key)).toEqual(["business-hours", "holiday-list", "overrides"]);
  });
});

describe("wxcc-ext-describe-resource", () => {
  it("summarises a resource and includes the create body schema by default", async () => {
    h = await startServer();
    const d = (await h.call("wxcc-ext-describe-resource", { resource: "team" })).json();
    expect(d.key).toBe("team");
    expect(d.updateSemantics).toBe("put-full-replace");
    expect(d.requiredOnCreate).toContain("name");
    const list = d.operations.find((o: { op: string }) => o.op === "list");
    expect(list.path).toBe("/organization/{orgid}/v2/team");
    expect(list.query).toContain("pageSize:integer=100");
    expect(d.schema.operation).toBe("create");
    expect(d.schema.fields.properties.name.type).toBe("string");
    expect(JSON.stringify(d)).not.toMatch(/"example"/);
  });

  it("returns one operation's schema, accepting the bare view name", async () => {
    h = await startServer();
    const d = (await h.call("wxcc-ext-describe-resource", { resource: "user-profile", operation: "acl" })).json();
    expect(d.schema.operation).toBe("view:acl");
    expect(d.schema.queryParams[0].name).toBe("names");
  });

  it("errors on unknown operations and resources", async () => {
    h = await startServer();
    const op = await h.call("wxcc-ext-describe-resource", { resource: "team", operation: "explode" });
    expect(op.isError).toBe(true);
    expect(op.text).toMatch(/no operation "explode".*operations: list, get/);
    const res = await h.call("wxcc-ext-describe-resource", { resource: "tea" });
    expect(res.text).toMatch(/unknown resource "tea"; did you mean team/);
  });
});

describe("wxcc-ext-list", () => {
  it("calls the list op with validated query params and shapes the envelope", async () => {
    h = await startServer({ routes: [route("GET", "/v2/team", () => json(200, TEAMS, { trackingid: "trk-9" }))] });
    const res = await h.call("wxcc-ext-list", {
      resource: "teams",
      filter: 'name=="Sales"',
      attributes: "id,name",
      page: 0,
      pageSize: 2,
      query: { supervisorView: "true" },
    });
    expect(res.isError).toBe(false);
    expect(res.json()).toEqual({
      resource: "team",
      meta: { page: 0, pageSize: 2, totalPages: 3, totalRecords: 5 },
      data: [
        { id: "t1", name: "Sales" },
        { id: "t2", name: "Support" },
      ],
    });
    const [url, init] = h.fetchMock.mock.calls[0]!;
    const u = new URL(url);
    expect(u.pathname).toBe(`/organization/${ORG}/v2/team`);
    expect(Object.fromEntries(u.searchParams)).toEqual({
      supervisorView: "true",
      filter: 'name=="Sales"',
      attributes: "id,name",
      page: "0",
      pageSize: "2",
    });
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${TOKEN}`);
    expect(h.logLines().at(-1)).toMatchObject({
      tool: "wxcc-ext-list",
      phase: "read",
      resource: "team",
      op: "list",
      method: "GET",
      path: `/organization/${ORG}/v2/team`,
      status: "ok",
      httpStatus: 200,
      trackingId: "trk-9",
    });
  });

  it("rejects unsupported params, wrong types and bad enums without calling the API", async () => {
    h = await startServer();
    const sort = await h.call("wxcc-ext-list", { resource: "team", sort: "name" });
    expect(sort.text).toMatch(/team list does not support "sort"/);
    const bool = await h.call("wxcc-ext-list", { resource: "team", query: { supervisorView: "maybe" } });
    expect(bool.text).toMatch(/"supervisorView" must be true or false/);
    const int = await h.call("wxcc-ext-get", { resource: "team", id: "t1", view: "references", query: { page: "x" } });
    expect(int.text).toMatch(/"page" must be an integer/);
    expect(h.fetchMock).not.toHaveBeenCalled();
    expect(h.logLines().every((l) => l.phase === "local" && l.status === "error")).toBe(true);
  });

  it("needs parentId for child resources and fills it into the path", async () => {
    h = await startServer({
      routes: [route("GET", "/v2/address-book/ab1/entry", () => json(200, { meta: {}, data: [{ id: "e1" }] }))],
    });
    const missing = await h.call("wxcc-ext-list", { resource: "address-book-entry" });
    expect(missing.text).toBe("address-book-entry list needs parentId (the address-book id)");
    const ok = await h.call("wxcc-ext-list", { resource: "address-book-entry", parentId: "ab1" });
    expect(ok.json().data).toEqual([{ id: "e1" }]);
  });

  it("runs named views with their path params", async () => {
    h = await startServer({
      routes: [route("GET", "/v2/contact-service-queue/by-user-id/u1/agent-based-queues", () => json(200, { data: [] }))],
    });
    const missing = await h.call("wxcc-ext-list", { resource: "queue", view: "by-user-id-agent-based-queues" });
    expect(missing.text).toMatch(/needs params\.userid/);
    const ok = await h.call("wxcc-ext-list", {
      resource: "queue",
      view: "by-user-id-agent-based-queues",
      params: { userid: "u1" },
    });
    expect(ok.isError).toBe(false);
    const bad = await h.call("wxcc-ext-list", { resource: "queue", view: "nope" });
    expect(bad.text).toMatch(/has no view "nope" \(views: references, by-skill-profile-id/);
  });

  it("refuses deferred and disabled resources", async () => {
    h = await startServer({ config: { toolsets: ["routing"] } });
    expect((await h.call("wxcc-ext-list", { resource: "dial-number" })).text).toBe(
      "dial-number is deferred by config (defer_to_official): not available in this server",
    );
    expect((await h.call("wxcc-ext-list", { resource: "user" })).text).toBe(
      'user is in toolset "agent", which is disabled in config (toolsets)',
    );
  });

  it("trims oversized pages and says how to fetch less", async () => {
    const rows = Array.from({ length: 400 }, (_, i) => ({ id: `id-${i}`, name: "x".repeat(40) }));
    h = await startServer({
      config: { max_response_chars: 5000 },
      routes: [route("GET", "/v2/skill", () => json(200, { meta: { totalRecords: 400 }, data: rows }))],
    });
    const res = await h.call("wxcc-ext-list", { resource: "skill" });
    expect(res.text.length).toBeLessThanOrEqual(5000);
    const body = res.json();
    expect(body.truncated.onPage).toBe(400);
    expect(body.truncated.shown).toBe(body.data.length);
    expect(body.truncated.shown).toBeGreaterThan(10);
    expect(body.truncated.hint).toMatch(/page\/pageSize/);
  });

  it("maps API errors and logs them once with status and trackingId", async () => {
    h = await startServer({
      routes: [route("GET", "/v2/team", () => json(401, { error: { key: 401 }, trackingId: "AUTH_1" }))],
    });
    const res = await h.call("wxcc-ext-list", { resource: "team" });
    expect(res).toMatchObject({ isError: true, text: "token expired: refresh WEBEX_TOKEN" });
    const lines = h.logLines();
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ phase: "read", status: "error", httpStatus: 401, trackingId: "AUTH_1" });
  });
});

describe("wxcc-ext-get", () => {
  it("gets by id, by alias, and strips HAL links", async () => {
    h = await startServer({
      routes: [route("GET", "/team/t1", () => json(200, { id: "t1", name: "Sales", _links: { self: { href: "/x" } } }))],
    });
    const res = await h.call("wxcc-ext-get", { resource: "Team", id: "t1" });
    expect(res.json()).toEqual({ id: "t1", name: "Sales" });
    expect(h.logLines().at(-1)).toMatchObject({ tool: "wxcc-ext-get", id: "t1", op: "get", status: "ok" });
  });

  it("uses view: references", async () => {
    h = await startServer({
      routes: [
        route("GET", "/team/t1/incoming-references", (u) =>
          json(200, { meta: { totalRecords: 1 }, data: [{ id: "q1", name: `Queue ${u.searchParams.get("type") ?? ""}` }] }),
        ),
      ],
    });
    const res = await h.call("wxcc-ext-get", { resource: "team", id: "t1", view: "references" });
    expect(res.json().data).toEqual([{ id: "q1", name: "Queue " }]);
  });

  it("resolves singletons without an id", async () => {
    h = await startServer({
      routes: [route("GET", "/v2/organization-setting", () => json(200, { meta: {}, data: [{ id: "s1", timezone: "UTC" }] }))],
    });
    expect((await h.call("wxcc-ext-get", { resource: "organization-setting" })).json()).toEqual({ id: "s1", timezone: "UTC" });
  });

  it("requires an id for normal resources", async () => {
    h = await startServer();
    expect((await h.call("wxcc-ext-get", { resource: "skill" })).text).toBe("skill get needs id");
  });

  it("encodes ids so they cannot change the path", async () => {
    h = await startServer();
    await h.call("wxcc-ext-get", { resource: "team", id: "../../user/x" });
    expect(new URL(h.fetchMock.mock.calls[0]![0]).pathname).toBe(`/organization/${ORG}/team/..%2F..%2Fuser%2Fx`);
  });
});

describe("operation log", () => {
  it("never contains the token", async () => {
    h = await startServer({
      routes: [route("GET", "/v2/team", () => json(400, { error: { message: [{ description: `bad ${TOKEN}` }] } }))],
    });
    await h.call("wxcc-ext-list", { resource: "team" });
    await h.call("wxcc-ext-list-resource-types", {});
    expect(h.rawLog()).not.toContain(TOKEN);
    expect(h.rawLog()).toContain("[redacted]");
  });
});
