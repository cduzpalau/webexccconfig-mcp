/**
 * Name references (registry `nameRefs`): body fields that hold lists of another resource's ids,
 * such as a person's licenses and roles. Writes accept names or ids; names are resolved against
 * the referenced resource's list, so the dry-run shows (and the hash pins) the exact ids sent.
 */
import type { RegistryEntry } from "../registry-types.js";
import { findOp, ToolError } from "./catalog.js";
import { buildQuery, callApi, isObject, type ToolContext } from "./exec.js";

/** Pages read from a referenced resource's list (licenses and roles fit in one). */
const MAX_PAGES = 10;

interface RefRecord {
  id: string;
  name: string;
  raw: Record<string, unknown>;
}

export interface ResolvedRefs {
  /** The body with every referenced name replaced by its id. */
  body: Record<string, unknown>;
  /** For the dry-run: each field's resulting list as "name (id)"; current names too when given. */
  shown: Record<string, { now?: string[]; after: string[] }>;
  warnings: string[];
}

/**
 * Resolves the nameRefs fields present in `body`. `current` is the record before an update: ids
 * it already has are shown by name, and capacity warnings are only given for newly added refs.
 */
export async function resolveRefs(
  ctx: ToolContext,
  tool: string,
  entry: RegistryEntry,
  body: Record<string, unknown>,
  current?: Record<string, unknown>,
): Promise<ResolvedRefs> {
  const out: ResolvedRefs = { body: { ...body }, shown: {}, warnings: [] };
  for (const [field, ref] of Object.entries(entry.nameRefs ?? {})) {
    const value = body[field];
    if (value === undefined) continue;
    if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
      throw new ToolError(`${field} must be a list of ${ref.resource} names or ids`);
    }
    const records = await loadRefs(ctx, tool, ref.resource, ref.field);
    const ids: string[] = [];
    for (const v of value as string[]) {
      const id = resolveOne(records, ref.resource, field, v);
      if (!ids.includes(id)) ids.push(id);
    }
    out.body[field] = ids;
    const had = new Set(Array.isArray(current?.[field]) ? (current[field] as unknown[]).filter((x) => typeof x === "string") : []);
    const show = (id: string) => {
      const r = records.find((x) => x.id === id);
      return r ? `${r.name} (${id})` : id;
    };
    out.shown[field] = { ...(current ? { now: [...had].map(show) } : {}), after: ids.map(show) };
    for (const id of ids) {
      if (had.has(id)) continue;
      const r = records.find((x) => x.id === id);
      const total = r?.raw.totalUnits;
      const used = r?.raw.consumedUnits;
      if (typeof total === "number" && typeof used === "number" && used >= total) {
        out.warnings.push(`${ref.resource} "${r!.name}" has no free units (${used} of ${total} used): the API may not assign it`);
      }
    }
  }
  return out;
}

function resolveOne(records: RefRecord[], resource: string, field: string, value: string): string {
  if (records.some((r) => r.id === value)) return value;
  const wanted = value.trim().toLowerCase();
  const matches = records.filter((r) => r.name.trim().toLowerCase() === wanted);
  if (matches.length === 1) return matches[0]!.id;
  if (matches.length > 1) {
    throw new ToolError(
      `${field}: "${value}" matches ${matches.length} ${resource} records (${matches.map((m) => m.id).join(", ")}): pass the id`,
    );
  }
  const names = [...new Set(records.map((r) => r.name))].sort();
  const shown = names.slice(0, 30).join(", ") + (names.length > 30 ? ", ..." : "");
  throw new ToolError(`${field}: unknown ${resource} "${value}" (known: ${shown || "none"})`);
}

async function loadRefs(ctx: ToolContext, tool: string, resource: string, nameField: string): Promise<RefRecord[]> {
  const entry = ctx.catalog.resolve(resource);
  const op = findOp(entry, "list");
  if (!op) throw new ToolError(`${resource} cannot be listed, so names cannot be resolved: pass ids`);
  const records: RefRecord[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const query = buildQuery(entry, op, cursor ? { cursor } : {});
    const res = await callApi(ctx, { tool, phase: "read", entry, op, pathParams: {}, query });
    const data = isObject(res.data) ? res.data : {};
    const rows = Array.isArray(data.items) ? data.items : Array.isArray(data.data) ? data.data : [];
    for (const row of rows) {
      if (isObject(row) && typeof row.id === "string") {
        records.push({ id: row.id, name: typeof row[nameField] === "string" ? (row[nameField] as string) : row.id, raw: row });
      }
    }
    cursor = res.nextCursor;
    if (!cursor || !op.queryParams.some((p) => p.name === "cursor")) break;
  }
  return records;
}
