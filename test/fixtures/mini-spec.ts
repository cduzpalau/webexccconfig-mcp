/** A small spec in the apireference/openapi/configuration.json format, covering generator edge cases. */
import type { SpecFile, SpecOperation } from "../../scripts/fetch-spec.js";
import type { ResourceOverride } from "../../scripts/registry-overrides.js";

const ERR = { description: "Unauthorized", content: { "application/json": { schema: { type: "object" } } } };
const page = { name: "page", in: "query", schema: { type: "integer", default: 0 } };
const pageSize = { name: "pageSize", in: "query", schema: { type: "integer", default: 100 } };
const orgid = { name: "orgid", in: "path", required: true, schema: { type: "string" } };
const id = { name: "id", in: "path", required: true, schema: { type: "string" } };

const teamDTO = {
  type: "object",
  required: ["name", "teamType"],
  properties: {
    id: { type: "string" },
    name: { type: "string", description: "<p>Team <b>name</b> &amp; label</p>" },
    teamType: { type: "string", enum: ["AGENT", "CAPACITY"] },
    createdTime: { type: "integer", readOnly: true },
    systemDefault: { type: "boolean", readOnly: true },
    queueRankings: { type: "array", items: { type: "object", $$ref: "#/components/schemas/QueueRankingDTO" } },
  },
};

function op(method: string, path: string, extra: Record<string, unknown> = {}, meta: Partial<SpecOperation> = {}): [string, SpecOperation] {
  return [
    `${method} ${path}`,
    {
      group: "Team",
      title: `${method} ${path}`,
      docPath: "/docs/api/v1/team/x",
      docVersion: 1,
      apiTitle: "Team",
      ...meta,
      operation: {
        method: method as "GET",
        path,
        operationId: `op_${method}_${path}`,
        summary: `${method} summary`,
        parameters: [orgid],
        responses: { "200": { description: "OK" }, "401": { $shared: "err401" } },
        ...extra,
      } as SpecOperation["operation"],
    },
  ];
}

export const MINI_SPEC: SpecFile = {
  _source: { url: "https://developer.webex.com/x", fetchedAt: "2026-10-30", section: "Webex Contact Center: Configuration", operationCount: 0 },
  apis: {
    Team: "<p>A team groups agents.</p><p><strong>Authentication &amp; Authorization:</strong> scopes…</p>",
    Audio: "Audio files.",
    Setting: "One per org.",
  },
  sharedResponses: { err401: ERR },
  operations: Object.fromEntries([
    // list in two versions: v2 must win
    op("GET", "/organization/{orgid}/team", { parameters: [orgid, page, pageSize] }),
    op("GET", "/organization/{orgid}/v2/team", {
      parameters: [orgid, { name: "filter", in: "query", description: "RSQL <code>filter</code>", schema: { type: "string" } }, page, pageSize],
    }),
    op("GET", "/organization/{orgid}/team/{id}", {
      parameters: [orgid, id],
      responses: { "200": { description: "OK", content: { "*/*": { schema: teamDTO } } } },
    }),
    // body declared as a *DTO query param (springdoc artefact)
    op("POST", "/organization/{orgid}/team", {
      parameters: [orgid, { name: "teamDTO", in: "query", required: true, schema: teamDTO }],
      responses: { "201": { description: "Created" } },
    }),
    op("PUT", "/organization/{orgid}/team/{id}", { parameters: [orgid, id, { name: "teamDTO", in: "query", schema: teamDTO }] }),
    op("DELETE", "/organization/{orgid}/team/{id}", { parameters: [orgid, id] }),
    op("POST", "/organization/{orgid}/team/bulk", {
      requestBody: { content: { "application/json": { schema: { type: "object", properties: { items: { type: "array" } } } } } },
      responses: { "207": { description: "Multi-status", content: { "application/json": { schema: { type: "object", properties: { items: { type: "array" } } } } } } },
    }),
    op("GET", "/organization/{orgid}/team/bulk-export"),
    op("GET", "/organization/{orgid}/team/{id}/incoming-references", { parameters: [orgid, id, { name: "type", in: "query", schema: { type: "string", enum: ["queue", "user"] } }] }),
    op("POST", "/organization/{orgid}/team/purge-inactive-entities", { parameters: [orgid, { name: "nextStartId", in: "query", schema: { type: "string" } }] }),
    op("POST", "/organization/{orgid}/team/fetch-by-userId-skillProfileId", {
      requestBody: { content: { "application/json": { schema: { type: "object" } } } },
    }),
    op("GET", "/organization/{orgid}/team/by-user-id/{userid}/rankings", { parameters: [orgid, { name: "userid", in: "path", required: true }] }),
    op("DELETE", "/organization/{orgid}/team"),
    op("GET", "/organization/{orgid}/team/legacy", { deprecated: true }),
    // child resource
    op("GET", "/organization/{orgid}/v2/team/{teamId}/member", { parameters: [orgid, { name: "teamId", in: "path", required: true }, page, pageSize] }),
    op("PATCH", "/organization/{orgid}/team/{teamId}/member/{id}", {
      requestBody: { content: { "application/json": { schema: { type: "object", properties: { note: { type: "string" } } } } } },
    }),
    // multipart upload
    op(
      "POST",
      "/organization/{orgid}/audio-file",
      {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["audioFile"],
                properties: { audioFile: { type: "string", format: "binary" }, audioFileInfo: { type: "object", properties: { name: { type: "string" } } } },
              },
            },
            "multipart/form-data": { schema: { type: "object" } },
          },
        },
      },
      { apiTitle: "Audio", group: "Audio Files" },
    ),
    // singleton
    op("GET", "/organization/{orgid}/v2/setting", { parameters: [orgid, page, pageSize] }, { apiTitle: "Setting" }),
    op("PATCH", "/organization/{orgid}/setting/{id}", { requestBody: { content: { "application/json": { schema: { type: "object" } } } } }, { apiTitle: "Setting" }),
  ]),
};
MINI_SPEC._source.operationCount = Object.keys(MINI_SPEC.operations).length;

export const MINI_OVERRIDES: ResourceOverride[] = [
  { key: "team", base: "team", displayName: "Team", aliases: ["group"], toolset: "routing", rename: { "by-user-id-rankings": "rankings-for-user" } },
  { key: "team-member", base: "team/{x}/member", displayName: "Team Member", toolset: "routing", parent: { resource: "team", param: "teamId" } },
  { key: "audio-file", base: "audio-file", displayName: "Audio File", toolset: "media" },
  { key: "setting", base: "setting", displayName: "Setting", toolset: "org", singleton: true },
  { key: "unused", base: "unused", displayName: "Unused", toolset: "org" },
];
