/**
 * v2.3: Webex people, licenses and roles on the Webex API (webexapis.com): host selection, org
 * check, cursor lists, license names, volatile presence fields, partial creates and updates, and
 * the guard against deleting the token's own person.
 */
import { afterEach, describe, expect, it } from "vitest";
import { nextCursorOf } from "../src/client.js";
import { hydraUuid } from "../src/tools/exec.js";
import { json, startServer, type Route } from "./helpers.js";

type Harness = Awaited<ReturnType<typeof startServer>>;
let h: Harness | undefined;
afterEach(async () => {
  await h?.close();
  h = undefined;
});

const UUID = "d79da35d-544e-4595-a122-c201a0871103";
const OTHER = "11111111-2222-3333-4444-555555555555";
const hydra = (kind: string, uuid: string) => Buffer.from(`ciscospark://us/${kind}/${uuid}`).toString("base64").replace(/=+$/, "");
const ME = hydra("PEOPLE", "aaaaaaaa-0000-0000-0000-000000000001");
const rw = { mode: "read-write" as const, org_id: UUID };

const LICENSES = [
  { id: "L-basic", name: "Basic Messaging", totalUnits: 4, consumedUnits: 2 },
  { id: "L-cc", name: "Contact Center Premium Agent", totalUnits: 100, consumedUnits: 3 },
  { id: "L-full", name: "Webex Calling - Professional", totalUnits: 1, consumedUnits: 1 },
  { id: "L-dup1", name: "Hybrid - Message", totalUnits: 4, consumedUnits: 0 },
  { id: "L-dup2", name: "Hybrid - Message", totalUnits: 4, consumedUnits: 0 },
];

/** Matches a Webex API request: host webexapis.com, path after /v1. */
function webex(method: string, path: string, respond: (url: URL, init: RequestInit) => Response | Promise<Response>): Route {
  return (url, init) =>
    init.method === method && url.host === "webexapis.com" && url.pathname === `/v1${path}` ? respond(url, init) : undefined;
}

function me(orgUuid = UUID): Route {
  return webex("GET", "/people/me", () => json(200, { id: ME, displayName: "Admin", orgId: hydra("ORGANIZATION", orgUuid) }));
}

const licenses = webex("GET", "/licenses", () => json(200, { items: LICENSES }));

function person(extra: Record<string, unknown> = {}) {
  return {
    id: "P1",
    emails: ["a@example.com"],
    displayName: "Ann Agent",
    firstName: "Ann",
    lastName: "Agent",
    orgId: hydra("ORGANIZATION", UUID),
    roles: [],
    licenses: ["L-basic"],
    created: "2026-11-03T10:00:00.000Z",
    lastModified: "2026-11-03T10:00:00.000Z",
    sipAddresses: [{ type: "cloud-calling", value: "a@x.calls.webex.com", primary: true }],
    invitePending: true,
    loginEnabled: true,
    type: "person",
    ...extra,
  };
}

const bodyOf = (init: RequestInit) => JSON.parse(String(init.body));

describe("helpers", () => {
  it("reads the next cursor from a Link header", () => {
    expect(nextCursorOf('<https://webexapis.com/v1/people?max=2&cursor=abc%3D>; rel="next"')).toBe("abc=");
    expect(nextCursorOf('<https://x/v1/people?cursor=p>; rel="prev", <https://x/v1/people?cursor=n>; rel="next"')).toBe("n");
    expect(nextCursorOf(null)).toBeUndefined();
    expect(nextCursorOf('<https://x/v1/people?cursor=p>; rel="prev"')).toBeUndefined();
  });

  it("decodes the uuid inside a Webex id", () => {
    expect(hydraUuid(hydra("ORGANIZATION", UUID))).toBe(UUID);
    expect(hydraUuid(UUID)).toBe(UUID);
    expect(hydraUuid("not-an-id")).toBeUndefined();
  });
});

describe("Webex API reads", () => {
  it("lists people from webexapis.com with max, excludeStatus and the next cursor", async () => {
    let seen: URL | undefined;
    h = await startServer({
      config: { org_id: UUID },
      routes: [
        me(),
        webex("GET", "/people", (url) => {
          seen = url;
          return json(200, { items: [person()], notFoundIds: null }, { link: '<https://webexapis.com/v1/people?max=1&cursor=NEXT>; rel="next"' });
        }),
      ],
    });
    const res = await h.call("wxcc-ext-list", { resource: "people", pageSize: 1, query: { cursor: "PREV" } });
    expect(res.isError, res.text).toBe(false);
    expect(res.json()).toMatchObject({ resource: "person", meta: { count: 1, nextCursor: "NEXT" }, data: [{ id: "P1" }] });
    expect(res.json()).not.toHaveProperty("notFoundIds");
    expect(seen!.searchParams.get("max")).toBe("1");
    expect(seen!.searchParams.get("cursor")).toBe("PREV");
    expect(seen!.searchParams.get("excludeStatus")).toBe("true");
  });

  it("checks the token's org once, and refuses Webex calls for another org", async () => {
    h = await startServer({ config: { org_id: UUID }, routes: [me(), webex("GET", "/people/P1", () => json(200, person()))] });
    await h.call("wxcc-ext-get", { resource: "person", id: "P1" });
    await h.call("wxcc-ext-get", { resource: "person", id: "P1" });
    const meCalls = h.fetchMock.mock.calls.filter(([u]) => String(u).endsWith("/v1/people/me"));
    expect(meCalls).toHaveLength(1);
    await h.close();

    h = await startServer({ config: { org_id: UUID }, routes: [me(OTHER), webex("GET", "/people/P1", () => json(200, person()))] });
    const res = await h.call("wxcc-ext-get", { resource: "person", id: "P1" });
    expect(res.isError).toBe(true);
    expect(res.text).toContain(`the token belongs to Webex org ${OTHER}, not org_id ${UUID}`);
    expect(h.fetchMock.mock.calls.some(([u]) => String(u).endsWith("/v1/people/P1"))).toBe(false);
  });

  it("maps Webex error bodies to short messages", async () => {
    h = await startServer({
      config: { org_id: UUID },
      routes: [
        me(),
        webex("GET", "/people/NOPE", () =>
          json(404, { message: "Person not found", errors: [{ description: "Person not found" }], trackingId: "ROUTERGW_1" }),
        ),
        webex("GET", "/roles", () => json(403, { message: "", errors: [], trackingId: "ROUTERGW_2" })),
      ],
    });
    expect((await h.call("wxcc-ext-get", { resource: "person", id: "NOPE" })).text).toBe(
      "not found: Person not found (trackingId: ROUTERGW_1)",
    );
    expect((await h.call("wxcc-ext-list", { resource: "role" })).text).toMatch(/forbidden: .*spark-admin:people_read/);
  });

  it("drops pageSize for lists that always return everything (roles, licenses)", async () => {
    let seen: URL | undefined;
    h = await startServer({
      config: { org_id: UUID },
      routes: [me(), webex("GET", "/roles", (url) => ((seen = url), json(200, { items: [{ id: "R1", name: "Full Admin" }] })))],
    });
    const res = await h.call("wxcc-ext-list", { resource: "roles", pageSize: 1 });
    expect(res.isError, res.text).toBe(false);
    expect(res.json().data).toEqual([{ id: "R1", name: "Full Admin" }]);
    expect([...seen!.searchParams.keys()]).toEqual([]);
  });

  it("offers the token's own record as view me", async () => {
    h = await startServer({ config: { org_id: UUID }, routes: [me()] });
    const res = await h.call("wxcc-ext-get", { resource: "person", view: "me" });
    expect(res.json()).toMatchObject({ id: ME });
  });
});

describe("create a person", () => {
  it("resolves license names to ids, shows them, and warns about full licenses", async () => {
    let sent: Record<string, unknown> | undefined;
    h = await startServer({
      config: rw,
      routes: [
        me(),
        licenses,
        webex("POST", "/people", (_u, init) => {
          sent = bodyOf(init);
          return json(200, person({ id: "P9", licenses: ["L-basic", "L-cc", "L-full"] }));
        }),
      ],
    });
    const args = {
      resource: "person",
      body: { emails: ["new@example.com"], displayName: "New", licenses: ["contact center premium agent", "L-full"] },
    };
    const dry = (await h.call("wxcc-ext-create", args)).json();
    expect(dry.body.licenses).toEqual(["L-cc", "L-full"]);
    expect(dry.refs.licenses.after).toEqual(["Contact Center Premium Agent (L-cc)", "Webex Calling - Professional (L-full)"]);
    expect(dry.warnings.join(" ")).toContain('"Webex Calling - Professional" has no free units (1 of 1 used)');
    expect(dry.warnings.join(" ")).not.toContain("no licenses given");
    const res = await h.call("wxcc-ext-create", { ...args, confirm: dry.confirm });
    expect(res.isError, res.text).toBe(false);
    expect(sent!.licenses).toEqual(["L-cc", "L-full"]);
  });

  it("warns that a create without licenses still gets the org's default licenses", async () => {
    h = await startServer({ config: rw, routes: [me()] });
    const dry = (await h.call("wxcc-ext-create", { resource: "person", body: { emails: ["n@example.com"], displayName: "N" } })).json();
    expect(dry.warnings).toContain(
      "no licenses given: the person gets only the org's default licenses (pass licenses by name to add more)",
    );
  });

  it("refuses unknown and ambiguous license names", async () => {
    h = await startServer({ config: rw, routes: [me(), licenses] });
    const unknown = await h.call("wxcc-ext-create", { resource: "person", body: { emails: ["n@example.com"], licenses: ["Gold"] } });
    expect(unknown.isError).toBe(true);
    expect(unknown.text).toMatch(/^licenses: unknown license "Gold" \(known: Basic Messaging, Contact Center Premium Agent/);
    const dup = await h.call("wxcc-ext-create", { resource: "person", body: { emails: ["n@example.com"], licenses: ["Hybrid - Message"] } });
    expect(dup.text).toBe('licenses: "Hybrid - Message" matches 2 license records (L-dup1, L-dup2): pass the id');
    const bad = await h.call("wxcc-ext-create", { resource: "person", body: { emails: ["n@example.com"], licenses: "L-cc" } });
    expect(bad.text).toBe("licenses must be a list of license names or ids");
  });

  it("looks the person up by email when the create fails, and says it was created anyway", async () => {
    let lookup: URL | undefined;
    h = await startServer({
      config: rw,
      routes: [
        me(),
        webex("POST", "/people", () => json(400, { message: "Invalid phone number", errors: [{ description: "Invalid phone number" }] })),
        webex("GET", "/people", (url) => {
          lookup = url;
          return json(200, { items: [person({ id: "P7", displayName: "Half Made" })] });
        }),
      ],
    });
    const args = { resource: "person", body: { emails: ["half@example.com"], displayName: "Half Made" } };
    const dry = (await h.call("wxcc-ext-create", args)).json();
    const res = await h.call("wxcc-ext-create", { ...args, confirm: dry.confirm });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('bad request: Invalid phone number; but person P7 "Half Made" now exists with email half@example.com');
    expect(lookup!.searchParams.get("email")).toBe("half@example.com");
  });

  it("does not look up after a duplicate (409): nothing was created", async () => {
    h = await startServer({
      config: rw,
      routes: [me(), webex("POST", "/people", () => json(409, { message: "User already exists", errors: [{ description: "User already exists" }] }))],
    });
    const args = { resource: "person", body: { emails: ["dup@example.com"] } };
    const dry = (await h.call("wxcc-ext-create", args)).json();
    const res = await h.call("wxcc-ext-create", { ...args, confirm: dry.confirm });
    expect(res.text).toBe("duplicate: User already exists");
    expect(h.fetchMock.mock.calls.some(([u, init]) => init.method === "GET" && new URL(String(u)).pathname === "/v1/people")).toBe(false);
  });
});

describe("update a person", () => {
  it("sends a full PUT without read-only fields, and presence changes do not stale the confirm", async () => {
    let reads = 0;
    let sent: Record<string, unknown> | undefined;
    h = await startServer({
      config: rw,
      routes: [
        me(),
        licenses,
        webex("GET", "/people/P1", () => {
          reads++;
          return json(200, person({ status: reads % 2 ? "active" : "inactive", lastActivity: `2026-11-03T10:0${reads}:00Z` }));
        }),
        webex("PUT", "/people/P1", (_u, init) => {
          sent = bodyOf(init);
          return json(200, person({ displayName: "Ann B", licenses: ["L-basic", "L-cc"] }));
        }),
      ],
    });
    const args = { resource: "person", id: "P1", changes: { displayName: "Ann B", licenses: ["Basic Messaging", "Contact Center Premium Agent"] } };
    const dry = (await h.call("wxcc-ext-update", args)).json();
    expect(dry.summary).toBe('update person P1 "Ann Agent" (read, merge, PUT)');
    expect(dry.refs.licenses).toEqual({
      now: ["Basic Messaging (L-basic)"],
      after: ["Basic Messaging (L-basic)", "Contact Center Premium Agent (L-cc)"],
    });
    const res = await h.call("wxcc-ext-update", { ...args, confirm: dry.confirm });
    expect(res.isError, res.text).toBe(false);
    expect(sent).toMatchObject({ displayName: "Ann B", licenses: ["L-basic", "L-cc"], emails: ["a@example.com"], loginEnabled: true });
    for (const f of ["id", "created", "lastModified", "status", "lastActivity", "sipAddresses", "invitePending", "type"]) {
      expect(sent).not.toHaveProperty(f);
    }
  });

  it("reports the fields a 206 did not apply", async () => {
    let reads = 0;
    h = await startServer({
      config: rw,
      routes: [
        me(),
        licenses,
        webex("GET", "/people/P1", () => {
          reads++;
          // Third read (after the PUT): the name changed, one license would not go.
          return json(200, reads >= 3 ? person({ displayName: "Ann B", licenses: ["L-basic"] }) : person({ licenses: ["L-basic", "L-cc"] }));
        }),
        webex("PUT", "/people/P1", () => json(206, person({ displayName: "Ann B", licenses: ["L-basic"] }))),
      ],
    });
    const args = { resource: "person", id: "P1", changes: { displayName: "Ann B", licenses: [] } };
    const dry = (await h.call("wxcc-ext-update", args)).json();
    const res = (await h.call("wxcc-ext-update", { ...args, confirm: dry.confirm })).json();
    expect(res).toMatchObject({
      applied: true,
      httpStatus: 206,
      note: "partly applied (HTTP 206): licenses did not change as requested",
      notApplied: [{ field: "licenses", now: ["L-basic"] }],
    });
  });

  it("after a failed PUT, says which requested fields changed anyway", async () => {
    let reads = 0;
    h = await startServer({
      config: rw,
      routes: [
        me(),
        webex("GET", "/people/P1", () => {
          reads++;
          return json(200, reads >= 3 ? person({ displayName: "Ann B" }) : person());
        }),
        webex("PUT", "/people/P1", () => json(500, { message: "calling service failed", errors: [{ description: "calling service failed" }] })),
      ],
    });
    const args = { resource: "person", id: "P1", changes: { displayName: "Ann B", department: "Sales" } };
    const dry = (await h.call("wxcc-ext-update", args)).json();
    const res = await h.call("wxcc-ext-update", { ...args, confirm: dry.confirm });
    expect(res.isError).toBe(true);
    expect(res.text).toBe(
      "Webex server error 500: calling service failed; but these fields did change: displayName; not changed: department. " +
        "Check the record with wxcc-ext-get",
    );
  });
});

describe("delete people", () => {
  it("refuses to delete the token's own person, singly and in bulk", async () => {
    h = await startServer({
      config: rw,
      routes: [
        me(),
        webex("GET", "/people/P1", () => json(200, person())),
        webex("DELETE", "/people/P1", () => new Response(null, { status: 204 })),
      ],
    });
    const single = await h.call("wxcc-ext-delete", { resource: "person", id: ME });
    expect(single.isError).toBe(true);
    expect(single.text).toBe(`refusing to delete person ${ME}: the token's own person: never deleted by this server`);

    const args = { resource: "person", operation: "delete", ids: [ME, "P1"] };
    const dry = (await h.call("wxcc-ext-bulk", args)).json();
    expect(dry.delete).toEqual([{ id: "P1", name: "Ann Agent" }]);
    expect(dry.skipped).toEqual([{ id: ME, reason: "the token's own person: never deleted by this server" }]);
    const res = (await h.call("wxcc-ext-bulk", { ...args, confirm: dry.confirm })).json();
    expect(res).toMatchObject({ succeededCount: 1, skippedCount: 1, succeeded: [{ id: "P1", name: "Ann Agent" }] });
    expect(h.writes().map(([u]) => new URL(String(u)).pathname)).toEqual(["/v1/people/P1"]);
  });
});
