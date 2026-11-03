/**
 * Deletes (read-write mode): the apply step shared by wxcc-ext-delete and wxcc-ext-bulk with
 * operation "delete", which deletes records one at a time with bounded concurrency.
 *
 * - A refused delete (412) names what still uses the record: from the error body (flows list their
 *   dependents there) or, when the body has no names, from the resource's references view.
 * - A DELETE that times out is re-checked: if the record now reads as 404 the delete counts as done.
 * - Bulk delete reads every record first (dry-run and again on apply), skips records that do not
 *   exist or are system defaults, snapshots each record before its delete, and reports per record.
 * - Resources with a `me` view on the Webex API (person) never delete the token's own record.
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { formatRefs, isWebexPath, WxccApiError, WxccClientError, type ApiResponse, type EntityRef, type QueryValue } from "../client.js";
import type { RegistryEntry, RegistryOperation } from "../registry-types.js";
import { fingerprint, planHash } from "../write/confirm.js";
import { findOp, ToolError } from "./catalog.js";
import {
  buildPathParams,
  buildQuery,
  callApi,
  checkWebexOrg,
  isObject,
  jsonResult,
  readCurrent,
  type CallSpec,
  type QueryInput,
  type ToolContext,
  type ToolExtra,
} from "./exec.js";

/** Records per wxcc-ext-bulk delete call: keeps a call within typical client tool timeouts. */
export const MAX_BULK_DELETE = 50;

/** Waits before re-reading a record whose DELETE timed out. */
const VERIFY_DELAYS_MS = [2_000, 5_000, 10_000];

const MAX_REFERENCE_TYPES = 5;

/** Result of a write's apply step (deletes, and creates/updates that check what took effect). */
export interface DeleteOutcome {
  res?: ApiResponse;
  /** Set when the DELETE timed out and a follow-up read showed the record gone. */
  note?: string;
  /** Extra result fields, e.g. notApplied after a partial update. */
  extra?: Record<string, unknown>;
}

export const SELF = "the token's own person: never deleted by this server";

/** The token owner's id when the resource is the Webex person resource (it has a `me` view). */
export async function selfId(ctx: ToolContext, entry: RegistryEntry): Promise<string | undefined> {
  const me = findOp(entry, "view", "me");
  if (!me || !isWebexPath(me.path)) return undefined;
  return (await checkWebexOrg(ctx)).personId;
}

/** Sends one DELETE; explains 412s and verifies timeouts. */
export async function sendDelete(
  ctx: ToolContext,
  spec: {
    tool: string;
    entry: RegistryEntry;
    op: RegistryOperation;
    id: string;
    parentId?: string;
    query?: Record<string, QueryValue>;
    /** Caller query, for the get op used to verify a timed-out delete (e.g. flowType). */
    readQuery?: QueryInput;
    log?: CallSpec["log"];
  },
): Promise<DeleteOutcome> {
  const { tool, entry, op, id } = spec;
  try {
    const res = await callApi(ctx, {
      tool,
      phase: "apply",
      entry,
      op,
      id,
      pathParams: buildPathParams(entry, op, { id, parentId: spec.parentId }),
      query: spec.query,
      log: spec.log,
    });
    return { res };
  } catch (err) {
    if (err instanceof WxccClientError && err.timedOut) return verifyGone(ctx, spec, err);
    if (err instanceof WxccApiError && err.status === 412) throw await explainInUse(ctx, tool, entry, id, spec.parentId, err);
    throw err;
  }
}

/** After a timed-out DELETE: the API often finishes it anyway, so read the record again. */
async function verifyGone(
  ctx: ToolContext,
  spec: { tool: string; entry: RegistryEntry; id: string; parentId?: string; readQuery?: QueryInput; log?: CallSpec["log"] },
  timeout: WxccClientError,
): Promise<DeleteOutcome> {
  const { tool, entry, id } = spec;
  if (!findOp(entry, "get")) {
    throw new WxccClientError(`${timeout.message}: the delete may still finish; check with wxcc-ext-list before retrying`, true);
  }
  let waited = 0;
  for (const delay of VERIFY_DELAYS_MS) {
    await ctx.sleep(delay);
    waited += delay;
    try {
      await readCurrent(ctx, tool, entry, id, spec.parentId, spec.readQuery);
    } catch (err) {
      if (err instanceof WxccApiError && err.status === 404) {
        const note = `the DELETE timed out, but ${waited / 1000}s later the record reads as not found: deleted`;
        ctx.oplog.record({ tool, phase: "apply", resource: entry.key, id, op: "delete", status: "ok", note, ...spec.log });
        return { note };
      }
      // Another error (e.g. a second timeout): try again after the next delay.
    }
  }
  throw new WxccClientError(
    `${timeout.message}: the record still exists ${waited / 1000}s later; the delete may still finish, ` +
      "check with wxcc-ext-get before retrying",
    true,
  );
}

/**
 * Rebuilds a 412 so it names the referring records. The API's own body often only says "referred in
 * other entities" plus the entity types, so the references view supplies the names.
 */
async function explainInUse(
  ctx: ToolContext,
  tool: string,
  entry: RegistryEntry,
  id: string,
  parentId: string | undefined,
  err: WxccApiError,
): Promise<WxccApiError> {
  if (err.references.length) return err;
  const refOp = findOp(entry, "references");
  if (!refOp) return err;
  const declared = new Set(refOp.queryParams.map((p) => p.name));
  const types: Array<string | undefined> = declared.has("type") && err.referencedEntities.length
    ? err.referencedEntities.slice(0, MAX_REFERENCE_TYPES)
    : [undefined];
  const refs: EntityRef[] = [];
  let total = 0;
  for (const type of types) {
    try {
      const query: QueryInput = {};
      if (type) query.type = type;
      if (declared.has("pageSize")) query.pageSize = 20;
      const res = await callApi(ctx, {
        tool,
        phase: "read",
        entry,
        op: refOp,
        id,
        pathParams: buildPathParams(entry, refOp, { id, parentId }),
        query: buildQuery(entry, refOp, query),
      });
      const body = isObject(res.data) ? res.data : {};
      const meta = isObject(body.meta) ? body.meta : {};
      const entity = type ?? (typeof meta.currentEntity === "string" ? meta.currentEntity : undefined);
      const rows = Array.isArray(body.data) ? body.data.filter(isObject) : [];
      total += typeof meta.totalRecords === "number" ? meta.totalRecords : rows.length;
      for (const r of rows) {
        refs.push({
          id: typeof r.id === "string" ? r.id : undefined,
          name: typeof r.name === "string" ? r.name : undefined,
          entity,
        });
      }
    } catch {
      // Best effort: the original error still stands.
    }
  }
  if (!refs.length) return err;
  const more = total > refs.length ? ` (${total} in total: see view: references)` : "";
  const kinds = err.referencedEntities.length ? ` (${err.referencedEntities.join(", ")})` : "";
  const tracking = err.trackingId ? ` (trackingId: ${err.trackingId})` : "";
  return new WxccApiError(`in use by other entities${kinds}: ${formatRefs(refs)}${more}${tracking}`, {
    status: err.status,
    trackingId: err.trackingId,
    key: err.key,
    references: refs,
    referencedEntities: err.referencedEntities,
  });
}

/** Runs fn over items with at most `limit` in flight; results keep the input order. */
export async function pool<T, R>(items: readonly T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]!, i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

/** System default records (Team-1, default profiles, ...) cannot be deleted. */
export function isSystemDefault(record: unknown): boolean {
  return isObject(record) && record.systemDefault === true;
}

export const SYSTEM_DEFAULT = "system default: the API refuses to delete it";

interface Skipped {
  id: string;
  name?: string;
  reason: string;
}

interface Target {
  id: string;
  record?: Record<string, unknown>;
}

function nameOf(record: unknown): string | undefined {
  if (!isObject(record)) return undefined;
  if (typeof record.name === "string") return record.name;
  return typeof record.displayName === "string" ? record.displayName : undefined;
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export interface BulkDeleteArgs {
  resource: string;
  ids: string[];
  parentId?: string;
  query?: QueryInput;
  confirm?: string;
}

/** wxcc-ext-bulk with operation "delete". */
export async function bulkDelete(ctx: ToolContext, tool: string, args: BulkDeleteArgs, extra?: ToolExtra): Promise<CallToolResult> {
  const entry = ctx.catalog.resolve(args.resource);
  const op = findOp(entry, "delete");
  if (!op) throw new ToolError(`${entry.key} does not support delete`);
  const ids = [...new Set(args.ids.map((i) => i.trim()).filter(Boolean))];
  if (!ids.length) throw new ToolError("operation delete needs ids");
  if (ids.length > MAX_BULK_DELETE) {
    throw new ToolError(`at most ${MAX_BULK_DELETE} ids per call (got ${ids.length}): split the list into several calls`);
  }
  const query = buildQuery(entry, op, args.query ?? {});
  const concurrency = ctx.config.bulkConcurrency;
  const self = await selfId(ctx, entry);

  // Read every record: snapshots, names, system defaults, and the state the confirm hash pins.
  const reads = await pool(ids, concurrency, async (id): Promise<Target | Skipped> => {
    if (id === self) return { id, reason: SELF };
    try {
      const record = await readCurrent(ctx, tool, entry, id, args.parentId, args.query);
      if (isSystemDefault(record)) return { id, name: nameOf(record), reason: SYSTEM_DEFAULT };
      return { id, record };
    } catch (err) {
      if (err instanceof WxccApiError && err.status === 404) return { id, reason: "not found" };
      throw err;
    }
  });
  const targets = reads.filter((r): r is Target => !("reason" in r));
  const skipped = reads.filter((r): r is Skipped => "reason" in r);

  const states = targets.map((t) => `${t.id}=${fingerprint(t.record) ?? "-"}`);
  const hash = planHash({
    tool,
    operation: "delete",
    resource: entry.key,
    path: op.path,
    parentId: args.parentId,
    query,
    states,
    skipped: skipped.map((s) => `${s.id}:${s.reason}`),
  });
  const key = `${tool}:delete:${entry.key}:${planHash(ids)}`;
  const base = [...states, ...skipped.map((s) => `${s.id}=${s.reason}`)].sort().join(",");
  const shape = { ...fill(op), ...(args.parentId && entry.parent ? { [entry.parent.param]: args.parentId } : {}) };
  const path = decodeURIComponent(new URL(ctx.client.buildUrl(op.path, shape, query)).pathname);
  const request = `${op.method} ${path} for each record`;
  const skippedOut = skipped.map((s) => ({ id: s.id, ...(s.name ? { name: s.name } : {}), reason: s.reason }));

  if (!args.confirm) {
    ctx.oplog.record({ tool, phase: "dry-run", resource: entry.key, op: "delete", method: op.method, path, status: "ok", count: targets.length });
    if (!targets.length) {
      return jsonResult({ dryRun: true, summary: `nothing to delete: all ${ids.length} id(s) skipped`, skipped: skippedOut });
    }
    ctx.pending.remember(hash, key, base);
    return jsonResult({
      dryRun: true,
      summary:
        `delete ${targets.length} ${entry.key} record(s) one at a time` +
        `${skipped.length ? `; ${skipped.length} skipped` : ""}`,
      request,
      delete: targets.map((t) => ({ id: t.id, ...(nameOf(t.record) ? { name: nameOf(t.record) } : {}) })),
      ...(skipped.length ? { skipped: skippedOut } : {}),
      warnings: [
        "each record is snapshotted, then deleted; a failure does not stop the others",
        ...(entry.key === "flow" ? ["deleting a published flow can take 30 s or more"] : []),
      ],
      confirm: hash,
      next: `Nothing changed yet. To apply, call ${tool} again with the same arguments plus confirm: "${hash}".`,
    });
  }

  if (args.confirm !== hash) {
    const pending = ctx.pending.get(args.confirm);
    if (pending && pending.target === key && pending.base !== base) {
      const before = new Set((pending.base ?? "").split(","));
      const changed = base.split(",").filter((s) => !before.has(s)).map((s) => s.split("=")[0]);
      throw new ToolError(
        `stale: ${changed.length ? `${[...new Set(changed)].join(", ")} changed` : "records changed"} since the dry-run; ` +
          "run without confirm to review the current state",
      );
    }
    throw new ToolError(
      "confirmation does not match this request (arguments changed or the dry-run is unknown): run without confirm for a new dry-run",
    );
  }
  if (!targets.length) throw new ToolError("nothing to delete: all ids were skipped");
  if (!ctx.oplog.writable()) {
    throw new ToolError(`operation log not writable (log_dir ${ctx.config.logDir}): writes are refused`);
  }
  ctx.pending.forget(hash);

  const progressToken = extra?._meta?.progressToken;
  let done = 0;
  const results = await pool(targets, concurrency, async (t) => {
    const name = nameOf(t.record);
    const who = { id: t.id, ...(name ? { name } : {}) };
    try {
      if (extra?.signal?.aborted) throw new ToolError("not attempted: the request was cancelled");
      let snapshot: string | undefined;
      if (t.record) {
        try {
          snapshot = await ctx.snapshots.save(entry.key, t.id, t.record);
        } catch (err) {
          throw new ToolError(`not deleted: cannot write snapshot (snapshot_dir ${ctx.config.snapshotDir}): ${errorText(err)}`);
        }
      }
      const out = await sendDelete(ctx, {
        tool,
        entry,
        op,
        id: t.id,
        parentId: args.parentId,
        query,
        readQuery: args.query,
        log: snapshot ? { snapshot } : undefined,
      });
      return { ok: true as const, ...who, ...(out.note ? { note: out.note } : {}) };
    } catch (err) {
      return {
        ok: false as const,
        ...who,
        ...(err instanceof WxccApiError ? { httpStatus: err.status } : {}),
        error: errorText(err),
      };
    } finally {
      done++;
      if (progressToken !== undefined) {
        await extra!
          .sendNotification({
            method: "notifications/progress",
            params: { progressToken, progress: done, total: targets.length, message: `deleted ${done} of ${targets.length}` },
          })
          .catch(() => undefined);
      }
    }
  });

  const succeeded = results.filter((r) => r.ok).map(({ ok: _ok, ...r }) => r);
  const failed = results.filter((r) => !r.ok).map(({ ok: _ok, ...r }) => r);
  ctx.oplog.record({
    tool,
    phase: "apply",
    resource: entry.key,
    op: "delete",
    status: failed.length ? "error" : "ok",
    count: targets.length,
    note: `${succeeded.length} deleted, ${failed.length} failed, ${skipped.length} skipped`,
  });
  return jsonResult({
    applied: true,
    summary: `deleted ${succeeded.length} of ${targets.length} ${entry.key} record(s)${failed.length ? `; ${failed.length} failed` : ""}`,
    total: ids.length,
    succeededCount: succeeded.length,
    failedCount: failed.length,
    skippedCount: skipped.length,
    succeeded,
    ...(failed.length ? { failed } : {}),
    ...(skipped.length ? { skipped: skippedOut } : {}),
    snapshots: `${ctx.config.snapshotDir}/${entry.key}/<id>/`,
  });
}

/** Placeholder values so the request line shows the path shape: {id} stays visible. */
function fill(op: RegistryOperation): Record<string, string> {
  return Object.fromEntries(op.pathParams.map((p) => [p, `{${p}}`]));
}
