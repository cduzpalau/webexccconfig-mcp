/**
 * Shared plumbing for the generic tools: request building from registry ops, the API call with
 * operation logging, and turning results and errors into short MCP tool results.
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { WxccApiError, WxccClientError, type ApiResponse, type QueryValue, type WxccClient } from "../client.js";
import type { AppConfig } from "../config.js";
import type { QueryParam, RegistryEntry, RegistryOperation } from "../registry-types.js";
import type { PendingPlans } from "../write/confirm.js";
import type { FileProcessor } from "../write/files.js";
import type { LogPhase, OperationLog } from "../write/oplog.js";
import type { SnapshotStore } from "../write/snapshot.js";
import { ToolError, type Catalog } from "./catalog.js";

export interface ToolContext {
  config: AppConfig;
  client: WxccClient;
  catalog: Catalog;
  oplog: OperationLog;
  snapshots: SnapshotStore;
  pending: PendingPlans;
  files: FileProcessor;
}

export type QueryInput = Record<string, string | number | boolean | string[]>;

export function opLabel(op: RegistryOperation): string {
  return op.name ? `${op.kind}:${op.name}` : op.kind;
}

/** Fills path params: {id} from `id`, the parent param from `parentId`, anything else from `params`. */
export function buildPathParams(
  entry: RegistryEntry,
  op: RegistryOperation,
  input: { id?: string; parentId?: string; params?: Record<string, string> },
): Record<string, string> {
  const params = { ...input.params };
  const out: Record<string, string> = {};
  for (const name of op.pathParams) {
    let value: string | undefined;
    if (entry.parent && name === entry.parent.param) value = input.parentId ?? params[name];
    else if (name === "id") value = input.id ?? params.id;
    else value = params[name];
    delete params[name];
    if (!value) {
      const how =
        entry.parent && name === entry.parent.param
          ? `parentId (the ${entry.parent.resource} id)`
          : name === "id"
            ? "id"
            : `params.${name}`;
      throw new ToolError(`${entry.key} ${opLabel(op)} needs ${how}`);
    }
    out[name] = value;
  }
  const unused = Object.keys(params);
  if (unused.length) {
    throw new ToolError(
      `${entry.key} ${opLabel(op)} has no path param ${unused.join(", ")}` +
        (op.pathParams.length ? ` (path params: ${op.pathParams.join(", ")})` : ""),
    );
  }
  return out;
}

/** Validates query values against the op's declared params and coerces them to the right type. */
export function buildQuery(entry: RegistryEntry, op: RegistryOperation, input: QueryInput): Record<string, QueryValue> {
  const declared = new Map(op.queryParams.map((p) => [p.name, p]));
  const out: Record<string, QueryValue> = {};
  for (const [name, raw] of Object.entries(input)) {
    const p = declared.get(name);
    if (!p) {
      const supported = op.queryParams.map((q) => q.name).join(", ") || "none";
      throw new ToolError(`${entry.key} ${opLabel(op)} does not support "${name}" (supported: ${supported})`);
    }
    out[name] = coerce(entry, op, p, raw);
  }
  const missing = op.queryParams.filter((p) => p.required && out[p.name] === undefined).map((p) => p.name);
  if (missing.length) throw new ToolError(`${entry.key} ${opLabel(op)} requires ${missing.join(", ")}`);
  return out;
}

function coerce(entry: RegistryEntry, op: RegistryOperation, p: QueryParam, raw: unknown): QueryValue {
  const bad = (want: string) => new ToolError(`${entry.key} ${opLabel(op)}: "${p.name}" must be ${want}`);
  let value: QueryValue;
  switch (p.type) {
    case "integer": {
      const n = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : raw;
      if (typeof n !== "number" || !Number.isInteger(n)) throw bad("an integer");
      value = n;
      break;
    }
    case "boolean":
      if (raw === "true" || raw === "false") value = raw === "true";
      else if (typeof raw === "boolean") value = raw;
      else throw bad("true or false");
      break;
    case "string[]":
      if (typeof raw === "string") value = [raw];
      else if (Array.isArray(raw) && raw.every((v) => typeof v === "string")) value = raw;
      else throw bad("a string or list of strings");
      break;
    default:
      if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") value = String(raw);
      else throw bad("a string");
  }
  if (p.enum && !(Array.isArray(value) ? value : [String(value)]).every((v) => p.enum!.includes(v))) {
    throw bad(`one of ${p.enum.join(", ")}`);
  }
  return value;
}

export interface CallSpec {
  tool: string;
  phase: LogPhase;
  entry: RegistryEntry;
  op: RegistryOperation;
  id?: string;
  pathParams: Record<string, string>;
  query?: Record<string, QueryValue>;
  json?: unknown;
  form?: FormData;
  /** Extra operation-log fields for writes. */
  log?: { changedFields?: string[]; snapshot?: string };
}

/** Calls the API for a registry op and writes an operation-log line for success or failure. */
export async function callApi(ctx: ToolContext, spec: CallSpec): Promise<ApiResponse> {
  const { op } = spec;
  let path: string | undefined;
  try {
    path = new URL(ctx.client.buildUrl(op.path, spec.pathParams, spec.query)).pathname;
  } catch (err) {
    throw new ToolError((err as Error).message);
  }
  const started = Date.now();
  const base = {
    tool: spec.tool,
    phase: spec.phase,
    resource: spec.entry.key,
    id: spec.id,
    op: opLabel(op),
    method: op.method,
    path,
    ...spec.log,
  } as const;
  try {
    const res = await ctx.client.request({
      method: op.method,
      path: op.path,
      pathParams: spec.pathParams,
      query: spec.query,
      json: spec.json,
      form: spec.form,
    });
    ctx.oplog.record({
      ...base,
      status: "ok",
      httpStatus: res.status,
      trackingId: res.trackingId,
      durationMs: Date.now() - started,
    });
    return res;
  } catch (err) {
    ctx.oplog.record({
      ...base,
      status: "error",
      httpStatus: err instanceof WxccApiError ? err.status : undefined,
      trackingId: err instanceof WxccApiError ? err.trackingId : undefined,
      durationMs: Date.now() - started,
      error: (err as Error).message,
    });
    throw err;
  }
}

/** Errors that already went to the operation log via callApi. */
function loggedByCallApi(err: unknown): boolean {
  return err instanceof WxccApiError || err instanceof WxccClientError;
}

/**
 * Wraps a tool handler: maps errors to short isError results and logs failures that happened
 * before any API call (bad input, unknown or deferred resource).
 */
export function handler<A extends object>(
  ctx: ToolContext,
  tool: string,
  fn: (args: A) => Promise<CallToolResult>,
): (args: A) => Promise<CallToolResult> {
  return async (args) => {
    try {
      return await fn(args);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!loggedByCallApi(err)) {
        const { resource, id } = args as { resource?: unknown; id?: unknown };
        ctx.oplog.record({
          tool,
          phase: "local",
          resource: typeof resource === "string" ? resource : undefined,
          id: typeof id === "string" ? id : undefined,
          status: "error",
          error: message,
        });
      }
      const known = err instanceof ToolError || loggedByCallApi(err);
      return errorResult(known ? message : `internal error: ${message}`);
    }
  };
}

export function errorResult(message: string): CallToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export function jsonResult(value: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value) }] };
}

interface PageMeta {
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalRecords?: number;
}

/**
 * Shapes an API response for the model: list envelopes become { meta, data } without links, and
 * anything over the size cap is trimmed with a hint instead of overflowing the context.
 */
export function shapeResult(resource: string, input: unknown, maxChars: number, hint: string): CallToolResult {
  const data = stripLinks(input);
  if (isObject(data) && Array.isArray(data.data)) {
    const rawMeta = isObject(data.meta) ? data.meta : {};
    const meta: PageMeta = {};
    for (const k of ["page", "pageSize", "totalPages", "totalRecords"] as const) {
      if (typeof rawMeta[k] === "number") meta[k] = rawMeta[k] as number;
    }
    const rows = data.data as unknown[];
    const full = { resource, meta, data: rows };
    if (JSON.stringify(full).length <= maxChars) return jsonResult(full);
    let lo = 0;
    let hi = rows.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (JSON.stringify({ ...full, data: rows.slice(0, mid) }).length <= maxChars - 300) lo = mid;
      else hi = mid - 1;
    }
    return jsonResult({
      ...full,
      data: rows.slice(0, lo),
      truncated: { shown: lo, onPage: rows.length, hint },
    });
  }
  const text = JSON.stringify(data ?? null);
  if (text.length <= maxChars) return jsonResult(data ?? null);
  return {
    content: [
      { type: "text", text: text.slice(0, maxChars) },
      { type: "text", text: `[truncated at ${maxChars} of ${text.length} characters; ${hint}]` },
    ],
  };
}

/** Drops HAL navigation (`_links`, and `links` arrays of rel/href) from records: noise for the model. */
export function stripLinks(value: unknown): unknown {
  const clean = (o: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) {
      if (k === "_links") continue;
      if (k === "links" && Array.isArray(v) && v.every((l) => isObject(l) && ("href" in l || "rel" in l))) continue;
      out[k] = v;
    }
    return out;
  };
  if (Array.isArray(value)) return value.map((v) => (isObject(v) ? clean(v) : v));
  if (!isObject(value)) return value;
  const top = clean(value);
  if (Array.isArray(top.data)) top.data = top.data.map((v) => (isObject(v) ? clean(v) : v));
  return top;
}

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
