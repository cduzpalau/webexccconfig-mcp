import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { RESOURCES } from "../src/registry/index.js";
import { Catalog, findOp, normaliseName, ToolError } from "../src/tools/catalog.js";
import { buildPathParams, buildQuery, shapeResult, stripLinks } from "../src/tools/exec.js";
import { compactSchema } from "../src/tools/schema.js";
import { OperationLog } from "../src/write/oplog.js";

const all = { deferToOfficial: [] as string[], toolsets: ["routing", "agent", "telephony", "media", "data", "schedule", "org", "digital", "ai"] as never[] };

describe("Catalog", () => {
  const catalog = new Catalog(RESOURCES, all);

  it("resolves keys, aliases, plurals, case and underscores", () => {
    expect(catalog.resolve("contact-service-queue").key).toBe("contact-service-queue");
    expect(catalog.resolve("queue").key).toBe("contact-service-queue");
    expect(catalog.resolve("Teams").key).toBe("team");
    expect(catalog.resolve("desktop_profile").key).toBe("desktop-profile");
    expect(catalog.resolve("cad-variable").key).toBe("global-variable");
  });

  it("suggests close matches for unknown names", () => {
    expect(() => catalog.resolve("skil")).toThrow(/did you mean skill/);
    expect(() => catalog.resolve("zzz")).toThrow(/^unknown resource "zzz" \(see wxcc-ext-list-resource-types\)$/);
  });

  it("defers by key or alias", () => {
    const c = new Catalog(RESOURCES, { ...all, deferToOfficial: ["queue"] });
    expect(() => c.resolve("contact-service-queue")).toThrow(/deferred by config/);
    expect(c.visible().map((e) => e.key)).not.toContain("contact-service-queue");
  });

  it("hides resources in disabled toolsets", () => {
    const c = new Catalog(RESOURCES, { deferToOfficial: [], toolsets: ["routing"] as never[] });
    expect(c.visible().every((e) => e.toolset === "routing")).toBe(true);
    expect(() => c.resolve("user")).toThrow(ToolError);
  });

  it("normalises names", () => {
    expect(normaliseName("  Desktop Profile ")).toBe("desktop-profile");
  });
});

describe("buildPathParams / buildQuery", () => {
  const catalog = new Catalog(RESOURCES, all);
  const entry = catalog.resolve("address-book-entry");
  const get = findOp(entry, "get")!;

  it("fills id and parent", () => {
    expect(buildPathParams(entry, get, { id: "e1", parentId: "ab1" })).toEqual({ addressBookId: "ab1", id: "e1" });
    expect(buildPathParams(entry, get, { params: { id: "e1", addressBookId: "ab1" } })).toEqual({ addressBookId: "ab1", id: "e1" });
  });

  it("rejects missing and unknown path params", () => {
    expect(() => buildPathParams(entry, get, { id: "e1" })).toThrow(/needs parentId \(the address-book id\)/);
    expect(() => buildPathParams(entry, get, { id: "e1", parentId: "a", params: { extra: "x" } })).toThrow(/no path param extra/);
  });

  it("coerces query types", () => {
    const team = catalog.resolve("team");
    const list = findOp(team, "list")!;
    expect(buildQuery(team, list, { page: "2", pageSize: 10, supervisorView: "false", filter: 5 })).toEqual({
      page: 2,
      pageSize: 10,
      supervisorView: false,
      filter: "5",
    });
    expect(() => buildQuery(team, list, { page: "two" })).toThrow(/"page" must be an integer/);
    expect(() => buildQuery(team, list, { page: 1.5 })).toThrow(/integer/);
    const acl = findOp(catalog.resolve("user-profile"), "view", "acl")!;
    expect(buildQuery(catalog.resolve("user-profile"), acl, { names: "a" })).toEqual({ names: ["a"] });
  });

  it("checks enums and required params", () => {
    const team = catalog.resolve("team");
    const op = {
      ...findOp(team, "list")!,
      queryParams: [
        { name: "type", type: "string" as const, required: true, enum: ["queue", "user"] },
        { name: "names", type: "string[]" as const, required: false, enum: ["a", "b"] },
      ],
    };
    expect(buildQuery(team, op, { type: "queue", names: ["a", "b"] })).toEqual({ type: "queue", names: ["a", "b"] });
    expect(() => buildQuery(team, op, { type: "nope" })).toThrow(/"type" must be one of queue, user/);
    expect(() => buildQuery(team, op, { type: "user", names: ["c"] })).toThrow(/one of a, b/);
    expect(() => buildQuery(team, op, {})).toThrow(/team list requires type/);
  });
});

describe("shapeResult", () => {
  it("passes non-list values through and truncates huge ones with a hint", () => {
    expect(shapeResult("x", { a: 1 }, 1000, "h").content).toEqual([{ type: "text", text: '{"a":1}' }]);
    const big = shapeResult("x", { blob: "y".repeat(5000) }, 2000, "use attributes");
    expect((big.content[0] as { text: string }).text).toHaveLength(2000);
    expect((big.content[1] as { text: string }).text).toMatch(/truncated at 2000 .*use attributes/);
  });

  it("strips HAL links only when they look like links", () => {
    expect(stripLinks({ id: 1, links: [{ rel: "self", href: "/x" }], _links: {} })).toEqual({ id: 1 });
    expect(stripLinks({ id: 1, links: ["not-a-link"] })).toEqual({ id: 1, links: ["not-a-link"] });
    expect(stripLinks([{ id: 1, links: [] }])).toEqual([{ id: 1 }]);
  });
});

describe("compactSchema", () => {
  const schema = {
    type: "object",
    description: "A team of agents for one function. More text that is not needed.",
    required: ["name"],
    properties: {
      name: { type: "string", example: "Sales", pattern: "^.*$", maxLength: 80, description: "Name." },
      createdTime: { type: "integer", format: "int64", readOnly: true },
      siteId: { type: "string", format: "uuid" },
      nested: { type: "object", properties: { deeper: { type: "object", properties: { x: { type: "string" } } } } },
    },
  };

  it("keeps structure and drops noise", () => {
    expect(compactSchema(schema)).toEqual({
      type: "object",
      description: "A team of agents for one function.",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Name." },
        createdTime: { type: "integer", readOnly: true },
        siteId: { type: "string", format: "uuid" },
        nested: { type: "object", properties: { deeper: { type: "object", properties: { x: { type: "string" } } } } },
      },
    });
  });

  it("cuts nesting at maxDepth with a note", () => {
    const c = compactSchema(schema, 1) as { properties: { nested: { note?: string; properties?: unknown } } };
    expect(c.properties.nested.properties).toBeUndefined();
    expect(c.properties.nested.note).toMatch(/nested fields omitted/);
  });
});

describe("OperationLog", () => {
  it("appends JSON lines to a daily file, creating the directory", () => {
    const dir = join(mkdtempSync(join(tmpdir(), "wxcc-ext-oplog-")), "nested", "logs");
    const log = new OperationLog({ dir, now: () => new Date("2026-10-30T12:00:00Z") });
    expect(log.record({ tool: "t", phase: "read", status: "ok", httpStatus: 200 })).toBe(true);
    log.record({ tool: "t2", phase: "local", status: "error", error: "boom" });
    const lines = readFileSync(join(dir, "wxcc-ext-2026-10-30.log"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    expect(lines).toEqual([
      { ts: "2026-10-30T12:00:00.000Z", tool: "t", phase: "read", status: "ok", httpStatus: 200 },
      { ts: "2026-10-30T12:00:00.000Z", tool: "t2", phase: "local", status: "error", error: "boom" },
    ]);
  });

  it("reports an unwritable log once and keeps going", () => {
    const base = mkdtempSync(join(tmpdir(), "wxcc-ext-oplog-"));
    const blocker = join(base, "file");
    writeFileSync(blocker, "x");
    const onError = vi.fn();
    const log = new OperationLog({ dir: join(blocker, "logs"), onError });
    expect(log.record({ tool: "t", phase: "read", status: "ok" })).toBe(false);
    expect(log.record({ tool: "t", phase: "read", status: "ok" })).toBe(false);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
