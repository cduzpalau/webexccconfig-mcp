/**
 * Read tools: wxcc-ext-list-resource-types, wxcc-ext-describe-resource, wxcc-ext-list, wxcc-ext-get.
 * Descriptions stay short: details come from list-resource-types and describe-resource.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TOOLSETS } from "../config.js";
import { SCHEMA_LOADERS } from "../registry/index.js";
import type { QueryParam, RegistryEntry, RegistryOperation } from "../registry-types.js";
import { actionNames, findOp, ToolError, viewNames } from "./catalog.js";
import {
  buildPathParams,
  buildQuery,
  callApi,
  handler,
  isObject,
  jsonResult,
  opLabel,
  shapeResult,
  type QueryInput,
  type ToolContext,
} from "./exec.js";
import { compactSchema } from "./schema.js";

const READ_ANNOTATIONS = { readOnlyHint: true } as const;
const LIST_HINT = "use page/pageSize, filter or attributes to fetch less";
const GET_HINT = "use wxcc-ext-list with attributes to fetch selected fields";

const resource = z.string().describe("Resource key or alias, e.g. team");
const queryValue = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);
const common = {
  view: z.string().optional().describe("View name, e.g. references"),
  parentId: z.string().optional().describe("Parent id (child resources)"),
  params: z.record(z.string(), z.string()).optional().describe("Other path params"),
  query: z.record(z.string(), queryValue).optional().describe("Other query params"),
};

const OP_SUMMARY_KINDS = ["list", "get", "create", "update", "patch", "delete", "bulkSave", "bulkPatch"] as const;

function summarise(entry: RegistryEntry) {
  return {
    key: entry.key,
    name: entry.displayName,
    toolset: entry.toolset,
    ops: OP_SUMMARY_KINDS.filter((k) => findOp(entry, k)).join(" "),
    ...(viewNames(entry).length ? { views: viewNames(entry) } : {}),
    ...(actionNames(entry).length ? { actions: actionNames(entry) } : {}),
    ...(entry.singleton ? { singleton: true } : {}),
    ...(entry.parent ? { parent: entry.parent.resource } : {}),
    ...(entry.aliases.length ? { aliases: entry.aliases } : {}),
  };
}

function describeParam(p: QueryParam): string {
  return `${p.name}${p.required ? "*" : ""}:${p.type}${p.default !== undefined ? `=${p.default}` : ""}${p.enum ? `[${p.enum.join("|")}]` : ""}`;
}

function describeOp(op: RegistryOperation) {
  return {
    op: opLabel(op),
    method: op.method,
    path: op.path,
    summary: op.summary,
    ...(op.pathParams.length ? { pathParams: op.pathParams } : {}),
    ...(op.queryParams.length ? { query: op.queryParams.map(describeParam) } : {}),
    ...(op.hasBody ? { body: op.bodyEncoding } : {}),
  };
}

/** Resolves the op for a read: a named view (or "references"), else the given standard kind. */
function readOp(entry: RegistryEntry, view: string | undefined, kind: "list" | "get"): RegistryOperation {
  if (view) {
    const op = view === "references" ? findOp(entry, "references") : findOp(entry, "view", view);
    if (!op) {
      const views = viewNames(entry);
      throw new ToolError(`${entry.key} has no view "${view}"${views.length ? ` (views: ${views.join(", ")})` : ""}`);
    }
    return op;
  }
  const op = findOp(entry, kind);
  if (!op) throw new ToolError(`${entry.key} does not support ${kind}`);
  return op;
}

export function registerReadTools(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "wxcc-ext-list-resource-types",
    {
      description:
        "Start here. Lists the Webex Contact Center configuration resource types this server manages " +
        "(queues, teams, skills, users, desktop profiles, sites, ...), with their operations, views and actions.",
      inputSchema: { toolset: z.enum(TOOLSETS).optional().describe("Only this toolset") },
      annotations: READ_ANNOTATIONS,
    },
    handler(ctx, "wxcc-ext-list-resource-types", async ({ toolset }: { toolset?: string }) => {
      const resources = ctx.catalog.visible().filter((e) => !toolset || e.toolset === toolset);
      ctx.oplog.record({ tool: "wxcc-ext-list-resource-types", phase: "local", status: "ok" });
      return jsonResult({ mode: ctx.config.mode, resources: resources.map(summarise) });
    }),
  );

  server.registerTool(
    "wxcc-ext-describe-resource",
    {
      description:
        "Fields, required fields, operations, query params and views of one resource type. " +
        "Pass operation (e.g. create, update, view:acl) for that operation's request and response schema.",
      inputSchema: {
        resource,
        operation: z.string().optional().describe("Operation id from the operations list"),
      },
      annotations: READ_ANNOTATIONS,
    },
    handler(ctx, "wxcc-ext-describe-resource", async (args: { resource: string; operation?: string }) => {
      const entry = ctx.catalog.resolve(args.resource);
      const { default: doc } = await SCHEMA_LOADERS[entry.key]!();
      const budget = Math.floor(ctx.config.maxResponseChars * 0.8);

      const summary = {
        key: entry.key,
        name: entry.displayName,
        description: entry.description,
        toolset: entry.toolset,
        ...(entry.aliases.length ? { aliases: entry.aliases } : {}),
        ...(entry.singleton ? { singleton: true } : {}),
        ...(entry.parent ? { parent: entry.parent } : {}),
        updateSemantics: entry.updateSemantics,
        requiredOnCreate: entry.requiredOnCreate,
        readOnlyFields: entry.readOnlyFields,
        operations: entry.operations.map(describeOp),
        usage:
          "list/get take view for views; parentId for child resources; params for other path params; " +
          "query for extra query params. Actions run through wxcc-ext-action (read-write mode).",
      };

      let schemaKey: string | undefined;
      if (args.operation) {
        const wanted = args.operation.trim();
        schemaKey =
          doc.operations[wanted] !== undefined
            ? wanted
            : Object.keys(doc.operations).find((k) => k.endsWith(`:${wanted}`));
        if (!schemaKey) {
          throw new ToolError(`${entry.key} has no operation "${wanted}" (operations: ${Object.keys(doc.operations).join(", ")})`);
        }
      }

      const fit = (value: unknown): unknown => {
        for (let depth = 6; depth >= 1; depth--) {
          const compact = compactSchema(value, depth);
          if (JSON.stringify(compact).length <= budget) return compact;
        }
        return compactSchema(value, 0);
      };

      let schema: Record<string, unknown> | undefined;
      if (schemaKey) {
        const d = doc.operations[schemaKey]!;
        schema = {
          operation: schemaKey,
          ...(d.description ? { description: d.description } : {}),
          ...(d.queryParams.length ? { queryParams: d.queryParams } : {}),
          ...(d.requestBody !== undefined ? { requestBody: fit(d.requestBody) } : {}),
          ...(d.response !== undefined ? { response: fit(d.response) } : {}),
        };
      } else {
        const bodyKey = ["create", "update", "patch"].find((k) => doc.operations[k]?.requestBody !== undefined);
        const bodySource = bodyKey ?? (doc.operations.get?.response !== undefined ? "get" : undefined);
        if (bodySource) {
          const d = doc.operations[bodySource]!;
          schema = { operation: bodySource, fields: fit(bodyKey ? d.requestBody : d.response) };
        }
      }
      ctx.oplog.record({ tool: "wxcc-ext-describe-resource", phase: "local", resource: entry.key, status: "ok" });
      return shapeResult(entry.key, { ...summary, ...(schema ? { schema } : {}) }, ctx.config.maxResponseChars, "pass operation to narrow the schema");
    }),
  );

  server.registerTool(
    "wxcc-ext-list",
    {
      description:
        "List records of a resource type. filter is RSQL (e.g. name==\"Sales\"), search is a keyword, attributes " +
        "selects fields, page is 0-based. view runs a named list view from describe-resource.",
      inputSchema: {
        resource,
        filter: z.string().optional(),
        search: z.string().optional(),
        attributes: z.string().optional().describe("Comma-separated fields to return"),
        sort: z.string().optional(),
        page: z.number().int().min(0).optional(),
        pageSize: z.number().int().min(1).max(1000).optional(),
        ...common,
      },
      annotations: READ_ANNOTATIONS,
    },
    handler(
      ctx,
      "wxcc-ext-list",
      async (args: {
        resource: string;
        filter?: string;
        search?: string;
        attributes?: string;
        sort?: string;
        page?: number;
        pageSize?: number;
        view?: string;
        parentId?: string;
        params?: Record<string, string>;
        query?: QueryInput;
      }) => {
        const entry = ctx.catalog.resolve(args.resource);
        const op = readOp(entry, args.view, "list");
        const named: QueryInput = {};
        for (const k of ["filter", "search", "attributes", "sort", "page", "pageSize"] as const) {
          if (args[k] !== undefined) named[k] = args[k]!;
        }
        const query = buildQuery(entry, op, { ...args.query, ...named });
        const pathParams = buildPathParams(entry, op, { parentId: args.parentId, params: args.params });
        const res = await callApi(ctx, { tool: "wxcc-ext-list", phase: "read", entry, op, pathParams, query });
        return shapeResult(entry.key, res.data, ctx.config.maxResponseChars, LIST_HINT);
      },
    ),
  );

  server.registerTool(
    "wxcc-ext-get",
    {
      description:
        "Get one record by id; singletons need no id. view: references lists the entities that use the record; " +
        "other views come from describe-resource.",
      inputSchema: {
        resource,
        id: z.string().optional(),
        ...common,
      },
      annotations: READ_ANNOTATIONS,
    },
    handler(
      ctx,
      "wxcc-ext-get",
      async (args: {
        resource: string;
        id?: string;
        view?: string;
        parentId?: string;
        params?: Record<string, string>;
        query?: QueryInput;
      }) => {
        const entry = ctx.catalog.resolve(args.resource);

        if (!args.view && !args.id && entry.singleton) {
          const op = readOp(entry, undefined, "list");
          const res = await callApi(ctx, { tool: "wxcc-ext-get", phase: "read", entry, op, pathParams: {}, query: {} });
          const rows = isObject(res.data) && Array.isArray(res.data.data) ? res.data.data : undefined;
          if (!rows?.length) throw new ToolError(`no ${entry.key} record found for this organization`);
          return shapeResult(entry.key, rows[0], ctx.config.maxResponseChars, GET_HINT);
        }
        if (!args.view && !args.id) throw new ToolError(`${entry.key} get needs id`);

        const op = readOp(entry, args.view, "get");
        const query = buildQuery(entry, op, args.query ?? {});
        const pathParams = buildPathParams(entry, op, { id: args.id, parentId: args.parentId, params: args.params });
        const res = await callApi(ctx, { tool: "wxcc-ext-get", phase: "read", entry, op, id: args.id, pathParams, query });
        return shapeResult(entry.key, res.data, ctx.config.maxResponseChars, args.view ? LIST_HINT : GET_HINT);
      },
    ),
  );
}
