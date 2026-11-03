import { describe, expect, it } from "vitest";
import {
  buildRegistry,
  classify,
  cleanText,
  diffAgainstDisk,
  loadSpec,
  matchResource,
  mergeSpecs,
  normalisePath,
  parsePath,
  render,
  withBasePath,
} from "../scripts/gen-registry.js";
import { RESOURCES as OVERRIDES } from "../scripts/registry-overrides.js";
import { DEFAULT_DEFER_TO_OFFICIAL, TOOLSETS } from "../src/config.js";
import { RESOURCES, SCHEMA_LOADERS } from "../src/registry/index.js";
import type { SpecFile, SpecOperation } from "../scripts/fetch-spec.js";
import type { ResourceOverride } from "../scripts/registry-overrides.js";
import { MINI_OVERRIDES, MINI_SPEC } from "./fixtures/mini-spec.js";

describe("parsePath", () => {
  it("strips version segments wherever they appear", () => {
    expect(parsePath("/organization/{orgid}/v2/team/{id}")).toEqual({ segments: ["team", "{id}"], version: 2 });
    expect(parsePath("/organization/{orgid}/contact-service-queue/v2/bulk")).toEqual({
      segments: ["contact-service-queue", "bulk"],
      version: 2,
    });
    expect(parsePath("/organization/{orgid}/skill")).toEqual({ segments: ["skill"], version: 1 });
  });

  it("parses flow paths and splits colon verbs into segments", () => {
    const P = "/{orgid}/project/5e5c9ad6d61f870d6d778c1b";
    expect(parsePath(`${P}/v2/flows/{id}:export`)).toEqual({ segments: ["flows", "{id}", "export"], version: 2 });
    expect(parsePath(`${P}/v2/flows:import`)).toEqual({ segments: ["flows", "import"], version: 2 });
    expect(parsePath(`${P}/flows`)).toEqual({ segments: ["flows"], version: 1 });
    expect(() => parsePath("/v2/{orgId}/functions")).toThrow(/unexpected path/);
    expect(parsePath("/v1/people/{id}")).toEqual({ segments: ["people", "{id}"], version: 1 });
  });
});

describe("normalisePath", () => {
  it("lowercases {orgId}, fills the fixed project id and renames the resource id", () => {
    expect(normalisePath("/{orgId}/project/{projectId}/flows/{flowId}:unlock", "flowId")).toBe(
      "/{orgid}/project/5e5c9ad6d61f870d6d778c1b/flows/{id}:unlock",
    );
    expect(normalisePath("/organization/{orgid}/team/{id}")).toBe("/organization/{orgid}/team/{id}");
  });
});

describe("mergeSpecs", () => {
  it("refuses an operation that appears in two spec files", () => {
    expect(() => mergeSpecs([MINI_SPEC, MINI_SPEC])).toThrow(/more than one spec file/);
  });
});

describe("matchResource", () => {
  it("prefers the longest base and matches placeholders by position", () => {
    const m = matchResource(["team", "{teamId}", "member", "{id}"], MINI_OVERRIDES);
    expect(m?.override.key).toBe("team-member");
    expect(m?.rest).toEqual(["{id}"]);
    expect(matchResource(["team", "{id}"], MINI_OVERRIDES)?.override.key).toBe("team");
    expect(matchResource(["nothing"], MINI_OVERRIDES)).toBeUndefined();
  });
});

describe("classify", () => {
  it.each([
    ["GET", [], { kind: "list" }],
    ["POST", [], { kind: "create" }],
    ["GET", ["{id}"], { kind: "get" }],
    ["PUT", ["{id}"], { kind: "update" }],
    ["PATCH", ["{id}"], { kind: "patch" }],
    ["DELETE", ["{id}"], { kind: "delete" }],
    ["POST", ["bulk"], { kind: "bulkSave" }],
    ["PATCH", ["bulk"], { kind: "bulkPatch" }],
    ["GET", ["{id}", "incoming-references"], { kind: "references" }],
    ["POST", ["purge-inactive-entities"], { kind: "action", name: "purge-inactive" }],
    ["GET", ["by-user-id", "{userid}", "agent-based-queues"], { kind: "view", name: "by-user-id-agent-based-queues" }],
    ["POST", ["{id}", "reassign-agents"], { kind: "action", name: "reassign-agents" }],
    ["PATCH", ["bulk", "update-dynamic-skill", "{skillId}"], { kind: "action", name: "bulk-update-dynamic-skill" }],
    ["POST", ["fetch-by-userId-skillProfileId"], { kind: "action", name: "fetch-by-user-id-skill-profile-id" }],
  ] as const)("%s %j", (method, rest, expected) => {
    expect(classify(method, [...rest])).toEqual(expected);
  });

  it("never exposes collection delete-all or bulk export", () => {
    expect(classify("DELETE", [])).toBeUndefined();
    expect(classify("GET", ["bulk-export"])).toBeUndefined();
  });
});

describe("buildRegistry on the fixture spec", () => {
  const { entries, schemas, report } = buildRegistry(MINI_SPEC, MINI_OVERRIDES);
  const team = entries.find((e) => e.key === "team")!;
  const opOf = (key: string, kind: string, name?: string) =>
    entries.find((e) => e.key === key)!.operations.find((o) => o.kind === kind && o.name === name);

  it("emits resources in key order and skips resources without live ops", () => {
    expect(entries.map((e) => e.key)).toEqual(["audio-file", "setting", "team", "team-member"]);
    expect(report.emptyResources).toEqual(["unused"]);
  });

  it("skips deprecated ops and reports exclusions and superseded versions", () => {
    expect(report.deprecatedSkipped).toBe(1);
    expect(report.excluded).toEqual(["DELETE /organization/{orgid}/team", "GET /organization/{orgid}/team/bulk-export"]);
    expect(report.superseded).toEqual(["GET /organization/{orgid}/team"]);
  });

  it("keeps the highest version of a list and marks it paginated", () => {
    const list = opOf("team", "list")!;
    expect(list.path).toBe("/organization/{orgid}/v2/team");
    expect(list.apiVersion).toBe(2);
    expect(list.paginated).toBe(true);
    expect(list.queryParams.map((q) => q.name)).toEqual(["filter", "page", "pageSize"]);
    expect(list.queryParams.find((q) => q.name === "page")).toEqual({ name: "page", type: "integer", required: false, default: "0" });
  });

  it("turns a *DTO query param into the request body", () => {
    const update = opOf("team", "update")!;
    expect(update.hasBody).toBe(true);
    expect(update.bodyEncoding).toBe("json");
    expect(update.queryParams).toEqual([]);
    expect(schemas.team!.operations.update!.requestBody).toMatchObject({ required: ["name", "teamType"] });
  });

  it("derives update semantics, readOnly fields and required-on-create", () => {
    expect(team.updateSemantics).toBe("put-full-replace");
    expect(team.readOnlyFields).toEqual(["createdTime", "lastUpdatedTime", "systemDefault"]);
    expect(team.requiredOnCreate).toEqual(["name", "teamType"]);
    expect(entries.find((e) => e.key === "setting")!.updateSemantics).toBe("patch-partial");
  });

  it("classifies bulk, references, views and actions with names and renames", () => {
    expect(opOf("team", "bulkSave")?.path).toBe("/organization/{orgid}/team/bulk");
    expect(opOf("team", "references")?.queryParams[0]).toMatchObject({ name: "type", enum: ["queue", "user"] });
    expect(opOf("team", "action", "purge-inactive")?.queryParams[0]?.name).toBe("nextStartId");
    expect(opOf("team", "action", "fetch-by-user-id-skill-profile-id")?.hasBody).toBe(true);
    const view = opOf("team", "view", "rankings-for-user")!;
    expect(view.pathParams).toEqual(["userid"]);
  });

  it("keeps the 207 bulk response schema", () => {
    expect(schemas.team!.operations.bulkSave!.response).toMatchObject({ properties: { items: { type: "array" } } });
  });

  it("models child resources with their parent", () => {
    const member = entries.find((e) => e.key === "team-member")!;
    expect(member.parent).toEqual({ resource: "team", param: "teamId" });
    expect(opOf("team-member", "list")?.pathParams).toEqual(["teamId"]);
    expect(opOf("team-member", "patch")?.pathParams).toEqual(["teamId", "id"]);
  });

  it("detects multipart uploads from binary properties", () => {
    const create = opOf("audio-file", "create")!;
    expect(create.bodyEncoding).toBe("multipart");
    expect(create.multipartParts).toEqual({ file: "audioFile", json: "audioFileInfo" });
    expect(entries.find((e) => e.key === "audio-file")!.requiredOnCreate).toEqual(["audioFile"]);
  });

  it("marks singletons and carries descriptions without HTML or auth boilerplate", () => {
    expect(entries.find((e) => e.key === "setting")!.singleton).toBe(true);
    expect(team.description).toBe("A team groups agents.");
    expect(team.aliases).toEqual(["group"]);
  });

  it("cleans schemas for describe_resource", () => {
    const body = schemas.team!.operations.update!.requestBody as { properties: Record<string, Record<string, unknown>> };
    expect(body.properties.name!.description).toBe("Team name & label");
    expect(JSON.stringify(body)).not.toContain("$$ref");
    expect(schemas.team!.operations.list!.queryParams[0]).toMatchObject({ name: "filter", description: "RSQL filter" });
  });

  it("fails loudly on unmatched ops and same-version duplicates", () => {
    expect(() => buildRegistry(MINI_SPEC, MINI_OVERRIDES.filter((o) => o.key !== "setting"))).toThrow(
      /no resource for GET \/organization\/\{orgid\}\/v2\/setting/,
    );
    const dup = structuredClone(MINI_SPEC);
    dup.operations["GET /organization/{orgid}/v2/team/rankings"] = structuredClone(
      dup.operations["GET /organization/{orgid}/team/by-user-id/{userid}/rankings"]!,
    );
    dup.operations["GET /organization/{orgid}/v2/team/rankings"]!.operation.path = "/organization/{orgid}/team/rankings";
    dup.operations["GET /organization/{orgid}/team/rankings-other"] = structuredClone(dup.operations["GET /organization/{orgid}/v2/team/rankings"]!);
    expect(() =>
      buildRegistry(dup, [{ ...MINI_OVERRIDES[0]!, rename: { rankings: "same", "by-user-id-rankings": "same" } }, ...MINI_OVERRIDES.slice(1)]),
    ).toThrow(/defined twice/);
  });

  it("renders deterministically", () => {
    const a = render(buildRegistry(MINI_SPEC, MINI_OVERRIDES));
    const b = render(buildRegistry(structuredClone(MINI_SPEC), MINI_OVERRIDES));
    expect([...a.entries()]).toEqual([...b.entries()]);
    expect(a.get("index.ts")).toMatch(/^\/\/ GENERATED/);
    expect(a.get("index.ts")).toContain(`"team": () => import("./schemas/team.js")`);
  });
});

describe("cleanText", () => {
  it("strips tags and decodes entities", () => {
    expect(cleanText("<ul><li>a &amp; b</li><li>c&nbsp;&lt;d&gt;</li></ul>")).toBe("a & b c <d>");
  });
});

describe("buildRegistry with an allowlisted flows resource", () => {
  const F = "/{orgId}/project/{projectId}";
  const flowOp = (method: string, path: string, params: unknown[] = []): [string, SpecOperation] => [
    `${method} ${path}`,
    {
      group: "Flows",
      title: path,
      docPath: "/docs/api/v1/flows/x",
      docVersion: 1,
      apiTitle: "Flows",
      operation: {
        method: method as "GET",
        path,
        operationId: `op_${method}_${path}`,
        summary: `${method} flows`,
        parameters: [
          { name: "orgId", in: "path", required: true, schema: { type: "string" } },
          { name: "flowType", in: "query", schema: { type: "string", default: "FLOW" } },
          ...params,
        ],
        responses: { "200": { description: "OK" } },
      } as SpecOperation["operation"],
    },
  ];
  const spec: SpecFile = {
    _source: { url: "x", fetchedAt: "x", section: "flows", operationCount: 3 },
    apis: { Flows: "Manage flows" },
    sharedResponses: {},
    operations: Object.fromEntries([
      flowOp("GET", `${F}/flows`),
      flowOp("DELETE", `${F}/flows/{flowId}`, [{ name: "skipRsEPCheck", in: "query", schema: { type: "boolean", default: true } }]),
      flowOp("POST", `${F}/flows/{flowId}:lock`),
    ]),
  };
  const override: ResourceOverride = {
    key: "flow",
    base: "flows",
    displayName: "Flow",
    toolset: "flow",
    idParam: "flowId",
    operations: [`GET ${F}/flows`, `DELETE ${F}/flows/{flowId}`],
    queryEnums: { flowType: ["FLOW", "SUBFLOW"] },
    sendDefaults: { delete: { skipRsEPCheck: "false" } },
  };

  it("keeps only allowlisted ops, renames the id and applies enums and send defaults", () => {
    const { entries, report } = buildRegistry(spec, [override]);
    expect(entries[0]!.operations.map((o) => o.kind)).toEqual(["list", "delete"]);
    const del = entries[0]!.operations[1]!;
    expect(del.path).toBe("/{orgid}/project/5e5c9ad6d61f870d6d778c1b/flows/{id}");
    expect(del.pathParams).toEqual(["id"]);
    expect(del.sendDefaults).toEqual({ skipRsEPCheck: "false" });
    expect(del.queryParams[0]).toMatchObject({ name: "flowType", enum: ["FLOW", "SUBFLOW"] });
    expect(report.excluded).toEqual([`POST ${F}/flows/{flowId}:lock`]);
  });

  it("fails on a stale allowlist entry or an unknown send-default param", () => {
    expect(() => buildRegistry(spec, [{ ...override, operations: [...override.operations!, `GET ${F}/gone`] }])).toThrow(
      /allowlisted operation not in spec/,
    );
    expect(() => buildRegistry(spec, [{ ...override, sendDefaults: { delete: { nope: "1" } } }])).toThrow(/unknown query param nope/);
  });
});

describe("Webex API sections", () => {
  const op = (method: string, path: string, responses: Record<string, unknown>): [string, SpecOperation] => [
    `${method} ${path}`,
    {
      group: "People",
      title: path,
      docPath: "/docs/api/v1/people/x",
      docVersion: 1,
      apiTitle: "People",
      operation: { method: method as "GET", path, operationId: `${method}${path}`, summary: `${method} people`, responses },
    },
  ];
  const ok = { "200": { description: "OK" } };
  const person = { type: "object", properties: { id: {}, displayName: {}, created: {}, status: {} } };
  const raw: SpecFile = {
    _source: { url: "x", fetchedAt: "x", section: "admin", operationCount: 4 },
    apis: { People: "People" },
    sharedResponses: { s1: { description: "OK", headers: { Link: { schema: { type: "string" } } } } },
    operations: Object.fromEntries([
      op("GET", "/people", { "200": { $shared: "s1" } }),
      op("GET", "/people/{personId}", { "200": { description: "OK", content: { "application/json": { schema: person } } } }),
      op("PUT", "/people/{personId}", ok),
      op("GET", "/people/me", ok),
    ]),
  };
  raw.operations["PUT /people/{personId}"]!.operation.requestBody = {
    content: { "application/json": { schema: { type: "object", properties: { displayName: {} } } } },
  };

  it("prefixes the section basePath to paths and keys", () => {
    const spec = withBasePath(raw, "/v1");
    expect(Object.keys(spec.operations).sort()).toEqual([
      "GET /v1/people",
      "GET /v1/people/me",
      "GET /v1/people/{personId}",
      "PUT /v1/people/{personId}",
    ]);
    expect(withBasePath(raw, undefined)).toBe(raw);
  });

  it("adds a cursor to lists with a Link header, a me view, and read-only fields from the PUT body", () => {
    const override: ResourceOverride = {
      key: "person",
      base: "people",
      displayName: "Person",
      toolset: "people",
      idParam: "personId",
      readOnlyFromBody: true,
      volatileFields: ["status"],
    };
    const [entry] = buildRegistry(withBasePath(raw, "/v1"), [override]).entries;
    const list = entry!.operations.find((o) => o.kind === "list")!;
    expect(list.path).toBe("/v1/people");
    expect(list.queryParams).toEqual([{ name: "cursor", type: "string", required: false }]);
    expect(list.paginated).toBe(true);
    expect(entry!.operations.find((o) => o.kind === "view")).toMatchObject({ name: "me", path: "/v1/people/me" });
    expect(entry!.operations.find((o) => o.kind === "get")!.queryParams).toEqual([]);
    expect(entry!.readOnlyFields).toEqual(expect.arrayContaining(["id", "created", "status"]));
    expect(entry!.readOnlyFields).not.toContain("displayName");
    expect(entry!.volatileFields).toEqual(["status"]);
  });
});

describe("committed registry", () => {
  it("matches what the generator produces from the committed spec (run npm run gen:registry)", () => {
    expect(diffAgainstDisk(render(buildRegistry(loadSpec())))).toEqual([]);
  });

  it("has unique keys and aliases, valid toolsets and parents, and a schema loader per resource", () => {
    const names = RESOURCES.flatMap((r) => [r.key, ...r.aliases]);
    expect(new Set(names).size).toBe(names.length);
    const keys = new Set(RESOURCES.map((r) => r.key));
    for (const r of RESOURCES) {
      expect(TOOLSETS).toContain(r.toolset);
      expect(SCHEMA_LOADERS[r.key]).toBeTypeOf("function");
      if (r.parent) {
        expect(keys.has(r.parent.resource)).toBe(true);
        for (const op of r.operations) expect(op.pathParams).toContain(r.parent.param);
      }
      for (const op of r.operations) {
        const prefixes = ["/organization/{orgid}/", "/{orgid}/project/5e5c9ad6d61f870d6d778c1b/", "/v1/"];
        expect(prefixes.some((p) => op.path.startsWith(p)), op.path).toBe(true);
        expect(op.kind === "view" || op.kind === "action" ? op.name : undefined).toBe(op.name);
      }
    }
  });

  it("knows every default-deferred resource except dial-plan (no live ops), and no longer defers flow", () => {
    const keys = new Set(RESOURCES.map((r) => r.key));
    expect(DEFAULT_DEFER_TO_OFFICIAL.filter((k) => !keys.has(k))).toEqual(["dial-plan"]);
    expect(DEFAULT_DEFER_TO_OFFICIAL).not.toContain("flow");
  });

  it("exposes only the flow operations the official server lacks", () => {
    const flow = RESOURCES.find((r) => r.key === "flow")!;
    expect(flow.toolset).toBe("flow");
    expect(flow.aliases).toEqual([]);
    expect(flow.operations.map((o) => (o.name ? `${o.kind}:${o.name}` : o.kind))).toEqual([
      "list",
      "get",
      "delete",
      "view:export",
      "action:import",
      "action:unlock",
    ]);
    const methods = Object.fromEntries(flow.operations.map((o) => [o.name ?? o.kind, `${o.method} ${o.path}`]));
    expect(methods.export).toBe("GET /{orgid}/project/5e5c9ad6d61f870d6d778c1b/v2/flows/{id}:export");
    expect(methods.import).toBe("POST /{orgid}/project/5e5c9ad6d61f870d6d778c1b/v2/flows:import");
    expect(methods.delete).toBe("DELETE /{orgid}/project/5e5c9ad6d61f870d6d778c1b/flows/{id}");
    for (const op of flow.operations) expect(op.queryParams.find((q) => q.name === "flowType")?.enum).toEqual(["FLOW", "SUBFLOW"]);
    expect(flow.operations.find((o) => o.kind === "delete")?.sendDefaults).toEqual({ skipRsEPCheck: "false" });
    expect(flow.operations.find((o) => o.kind === "list")?.paginated).toBe(true);
  });

  it("has no deprecated or excluded operations", () => {
    const spec = loadSpec();
    for (const r of RESOURCES) {
      for (const op of r.operations) {
        expect(spec.operations[op.source]?.operation.deprecated ?? false).toBe(false);
        expect(op.path).not.toMatch(/bulk-export$/);
        expect(op.method === "DELETE" && !op.pathParams.includes("id")).toBe(false);
      }
    }
  });

  it("covers every override except the deprecated-only ones", () => {
    const keys = new Set(RESOURCES.map((r) => r.key));
    expect(OVERRIDES.filter((o) => !keys.has(o.key)).map((o) => o.key)).toEqual([]);
    expect(RESOURCES).toHaveLength(37);
  });

  it("loads a schema doc lazily", async () => {
    const { default: doc } = await SCHEMA_LOADERS["team"]!();
    expect(doc.key).toBe("team");
    expect(Object.keys(doc.operations)).toContain("update");
  });
});
