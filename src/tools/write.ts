/**
 * Write tools (read-write mode only): wxcc-ext-create, -update, -delete, -bulk, -action.
 *
 * Every write runs the same pipeline: read the current record(s) → build the exact request →
 * dry-run (default: returns the diff and a confirmation hash) → apply (requires the hash; the plan
 * is rebuilt from a fresh read, so a stale version is rejected) → before-snapshot → API call →
 * operation log.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { QueryValue } from "../client.js";
import type { RegistryEntry, RegistryOperation } from "../registry-types.js";
import { fingerprint, planHash } from "../write/confirm.js";
import type { FileInput, UploadKind } from "../write/files.js";
import { changedFields, deepMerge, diff, isPlainObject, omit, presentChanges, type Change } from "../write/merge.js";
import { actionNames, findOp, ToolError } from "./catalog.js";
import {
  buildPathParams,
  buildQuery,
  callApi,
  handler,
  jsonResult,
  opLabel,
  shapeResult,
  stripLinks,
  type QueryInput,
  type ToolContext,
} from "./exec.js";


interface Upload {
  jsonPart: string;
  filePart: string;
  info: unknown;
  file: FileInput;
  kind: UploadKind;
  name: string;
  fingerprint: string;
}

interface Plan {
  tool: string;
  entry: RegistryEntry;
  op: RegistryOperation;
  id?: string;
  pathParams: Record<string, string>;
  query?: Record<string, QueryValue>;
  json?: unknown;
  upload?: Upload;
  /** Records read before the write: snapshotted on apply, and their versions pin the plan. */
  before: Array<{ id: string; data: unknown }>;
  changes: Change[];
  summary: string;
  warnings: string[];
  /** Include the request body in the dry-run (create, bulk, action). */
  showBody?: boolean;
}

function hashOf(plan: Plan): string {
  return planHash({
    tool: plan.tool,
    resource: plan.entry.key,
    method: plan.op.method,
    path: plan.op.path,
    pathParams: plan.pathParams,
    query: plan.query,
    json: plan.json,
    upload: plan.upload && {
      jsonPart: plan.upload.jsonPart,
      filePart: plan.upload.filePart,
      info: plan.upload.info,
      file: plan.upload.fingerprint,
    },
    bases: plan.before.map((b) => [b.id, fingerprint(b.data)]),
  });
}

function baseOf(plan: Plan): string {
  return plan.before.map((b) => fingerprint(b.data)).join(",");
}

function label(record: unknown): string {
  if (!isPlainObject(record)) return "";
  return typeof record.name === "string" ? ` "${record.name}"` : "";
}

async function execute(ctx: ToolContext, plan: Plan, confirm: string | undefined): Promise<CallToolResult> {
  const hash = hashOf(plan);
  const target = `${plan.tool}:${plan.entry.key}:${plan.id ?? ""}`;
  const base = baseOf(plan);
  const path = new URL(ctx.client.buildUrl(plan.op.path, plan.pathParams, plan.query)).pathname;
  const fields = changedFields(plan.changes);

  if (!confirm) {
    ctx.pending.remember(hash, target, base);
    ctx.oplog.record({
      tool: plan.tool,
      phase: "dry-run",
      resource: plan.entry.key,
      id: plan.id,
      op: opLabel(plan.op),
      method: plan.op.method,
      path,
      status: "ok",
      changedFields: fields,
    });
    const body = plan.upload ? { [plan.upload.jsonPart]: plan.upload.info, [plan.upload.filePart]: "<file>" } : plan.json;
    const bodyText = body === undefined ? "" : JSON.stringify(body);
    return jsonResult({
      dryRun: true,
      summary: plan.summary,
      request: `${plan.op.method} ${path}`,
      ...(plan.changes.length ? { changes: presentChanges(plan.changes) } : {}),
      ...(plan.warnings.length ? { warnings: plan.warnings } : {}),
      ...(plan.showBody && body !== undefined
        ? bodyText.length <= 6000
          ? { body }
          : { body: `${bodyText.slice(0, 6000)}…` }
        : {}),
      confirm: hash,
      next: `Nothing changed yet. To apply, call ${plan.tool} again with the same arguments plus confirm: "${hash}".`,
    });
  }

  if (confirm !== hash) {
    const pending = ctx.pending.get(confirm);
    if (pending && pending.target === target && pending.base !== base) {
      throw new ToolError(
        `stale version: ${plan.entry.key}${plan.id ? ` ${plan.id}` : ""} changed since the dry-run ` +
          `(${pending.base || "none"} → ${base || "none"}); run without confirm to review the current state`,
      );
    }
    throw new ToolError(
      "confirmation does not match this request (arguments changed or the dry-run is unknown): run without confirm for a new dry-run",
    );
  }

  if (!ctx.oplog.writable()) {
    throw new ToolError(`operation log not writable (log_dir ${ctx.config.logDir}): writes are refused`);
  }
  let snapshot: string | undefined;
  if (plan.before.length) {
    try {
      snapshot =
        plan.before.length === 1
          ? ctx.snapshots.save(plan.entry.key, plan.before[0]!.id, plan.before[0]!.data)
          : ctx.snapshots.save(plan.entry.key, "bulk", { items: plan.before });
    } catch (err) {
      throw new ToolError(`cannot write snapshot (snapshot_dir ${ctx.config.snapshotDir}): ${(err as Error).message}`);
    }
  }

  let form: FormData | undefined;
  if (plan.upload) {
    const file = await ctx.files.prepare(plan.upload.file, plan.upload.kind, plan.upload.name);
    form = new FormData();
    form.append(plan.upload.filePart, new Blob([new Uint8Array(file.bytes)], { type: file.contentType }), file.filename);
    form.append(plan.upload.jsonPart, new Blob([JSON.stringify(plan.upload.info)], { type: "application/json" }));
  }

  const res = await callApi(ctx, {
    tool: plan.tool,
    phase: "apply",
    entry: plan.entry,
    op: plan.op,
    id: plan.id,
    pathParams: plan.pathParams,
    query: plan.query,
    json: plan.json,
    form,
    log: { changedFields: fields, snapshot },
  });
  ctx.pending.forget(hash);
  return jsonResult({
    applied: true,
    summary: plan.summary,
    httpStatus: res.status,
    ...(res.trackingId ? { trackingId: res.trackingId } : {}),
    ...(snapshot ? { snapshot } : {}),
    result: summariseResult(res.data, ctx.config.maxResponseChars),
  });
}

/** Keeps apply results small: bulk results per item, big records reduced to their identity. */
function summariseResult(data: unknown, maxChars: number): unknown {
  const clean = stripLinks(data);
  if (isPlainObject(clean) && Array.isArray(clean.items)) {
    const items = clean.items.filter(isPlainObject).map((i) => {
      const apiError = isPlainObject(i.apiError) ? i.apiError : undefined;
      const err = isPlainObject(apiError?.error) ? apiError.error : undefined;
      const messages = Array.isArray(err?.message) ? err.message.filter(isPlainObject) : [];
      const description = messages.map((m) => m.description).filter((d) => typeof d === "string").join("; ");
      return {
        itemIdentifier: i.itemIdentifier,
        status: i.status,
        ...(i.operationType ? { operationType: i.operationType } : {}),
        ...(typeof i.href === "string" ? { href: i.href } : {}),
        ...(apiError ? { error: description || (typeof err?.reason === "string" ? err.reason : "failed") } : {}),
      };
    });
    const failed = items.filter((i) => typeof i.status !== "number" || i.status >= 300).length;
    return { succeeded: items.length - failed, failed, items };
  }
  const text = JSON.stringify(clean ?? null);
  if (text.length <= maxChars / 2) return clean ?? null;
  if (isPlainObject(clean)) {
    return { id: clean.id, name: clean.name, version: clean.version, note: "full record omitted; use wxcc-ext-get" };
  }
  return `${text.slice(0, 2000)}…`;
}

/** Reads the current record through the resource's get op (logged as a read). */
async function readCurrent(
  ctx: ToolContext,
  tool: string,
  entry: RegistryEntry,
  id: string,
  parentId: string | undefined,
): Promise<Record<string, unknown> | undefined> {
  const getOp = findOp(entry, "get");
  if (!getOp) return undefined;
  const pathParams = buildPathParams(entry, getOp, { id, parentId });
  const res = await callApi(ctx, { tool, phase: "read", entry, op: getOp, id, pathParams, query: {} });
  const data = stripLinks(res.data);
  if (!isPlainObject(data)) throw new ToolError(`${entry.key} ${id}: unexpected response when reading the current record`);
  return data;
}

async function singletonId(ctx: ToolContext, tool: string, entry: RegistryEntry): Promise<string> {
  const listOp = findOp(entry, "list");
  if (!listOp) throw new ToolError(`${entry.key} needs id`);
  const res = await callApi(ctx, { tool, phase: "read", entry, op: listOp, pathParams: {}, query: {} });
  const rows = isPlainObject(res.data) && Array.isArray(res.data.data) ? res.data.data : [];
  const id = isPlainObject(rows[0]) ? rows[0].id : undefined;
  if (typeof id !== "string") throw new ToolError(`no ${entry.key} record found for this organization`);
  return id;
}

function uploadFor(
  ctx: ToolContext,
  entry: RegistryEntry,
  op: RegistryOperation,
  info: Record<string, unknown>,
  file: FileInput | undefined,
  warnings: string[],
): Upload {
  const parts = op.multipartParts!;
  if (!file) {
    throw new ToolError(
      parts.file === "audioFile"
        ? `${entry.key} ${opLabel(op)} needs file: { path } to a local audio file, or { text } to synthesise`
        : `${entry.key} ${opLabel(op)} needs file: { path } to a local file for ${parts.file}`,
    );
  }
  const kind: UploadKind = parts.file === "audioFile" ? "audio" : "raw";
  const withDefaults: Record<string, unknown> = { ...info };
  if (kind === "audio") {
    if (withDefaults.contentType === undefined) withDefaults.contentType = "AUDIO_WAV";
    // The API requires audio names to end in .wav; uploads are always converted to WAV.
    if (typeof withDefaults.name === "string" && !/\.wav$/i.test(withDefaults.name)) {
      withDefaults.name = `${withDefaults.name}.wav`;
      warnings.push(`name must end in .wav: using "${withDefaults.name}"`);
    }
  }
  return {
    jsonPart: parts.json,
    filePart: parts.file,
    info: withDefaults,
    file,
    kind,
    name: typeof withDefaults.name === "string" ? withDefaults.name : entry.key,
    fingerprint: ctx.files.fingerprint(file, kind),
  };
}

function dropReadOnly(entry: RegistryEntry, changes: Record<string, unknown>, warnings: string[]): Record<string, unknown> {
  const ro = entry.readOnlyFields.filter((f) => f in changes);
  if (ro.length) warnings.push(`ignored read-only fields: ${ro.join(", ")}`);
  return omit(changes, ro);
}

const resource = z.string().describe("Resource key or alias");
const confirm = z.string().optional().describe("Dry-run hash; omit to dry-run");
const parentId = z.string().optional().describe("Parent id (child resources)");
const file = z
  .object({ path: z.string().optional(), text: z.string().optional(), voice: z.string().optional() })
  .optional()
  .describe("Upload: local path, or text to speak (audio)");
const record = z.record(z.string(), z.unknown());

export function registerWriteTools(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "wxcc-ext-create",
    {
      description: "Create a record. Dry-runs unless confirm is given. Fields: describe-resource.",
      inputSchema: { resource, body: record, parentId, file, confirm },
      annotations: { destructiveHint: false },
    },
    handler(
      ctx,
      "wxcc-ext-create",
      async (args: { resource: string; body: Record<string, unknown>; parentId?: string; file?: FileInput; confirm?: string }) => {
        const entry = ctx.catalog.resolve(args.resource);
        const op = findOp(entry, "create");
        if (!op) throw new ToolError(`${entry.key} does not support create`);
        const warnings: string[] = [];
        if ("id" in args.body) warnings.push("body.id is ignored by create; use wxcc-ext-update for existing records");
        const plan: Plan = {
          tool: "wxcc-ext-create",
          entry,
          op,
          pathParams: buildPathParams(entry, op, { parentId: args.parentId }),
          before: [],
          changes: diff({}, args.body),
          summary: `create ${entry.key}${label(args.body)}`,
          warnings,
          showBody: true,
        };
        if (op.multipartParts) {
          plan.upload = uploadFor(ctx, entry, op, args.body, args.file, warnings);
        } else {
          if (args.file) throw new ToolError(`${entry.key} create takes no file`);
          const missing = entry.requiredOnCreate.filter((f) => !(f in args.body));
          if (missing.length) warnings.push(`the API lists these as required: ${missing.join(", ")}`);
          plan.json = args.body;
        }
        return execute(ctx, plan, args.confirm);
      },
    ),
  );

  server.registerTool(
    "wxcc-ext-update",
    {
      description:
        "Change fields of a record: PATCH where supported, else read, merge and PUT. Pass only the fields to change; " +
        "lists are replaced whole. Dry-runs unless confirm is given.",
      inputSchema: { resource, id: z.string().optional(), parentId, changes: record, file, confirm },
    },
    handler(
      ctx,
      "wxcc-ext-update",
      async (args: {
        resource: string;
        id?: string;
        parentId?: string;
        changes: Record<string, unknown>;
        file?: FileInput;
        confirm?: string;
      }) => {
        const tool = "wxcc-ext-update";
        const entry = ctx.catalog.resolve(args.resource);
        const id = args.id ?? (entry.singleton ? await singletonId(ctx, tool, entry) : undefined);
        if (!id) throw new ToolError(`${entry.key} update needs id`);
        if (!Object.keys(args.changes).length && !args.file) throw new ToolError("changes is empty: nothing to update");

        const warnings: string[] = [];
        const changes = dropReadOnly(entry, args.changes, warnings);
        const current = await readCurrent(ctx, tool, entry, id, args.parentId);
        if (!current) throw new ToolError(`${entry.key} has no get operation, so it cannot be updated safely`);
        const base = omit(current, entry.readOnlyFields);
        const after = deepMerge(base, changes) as Record<string, unknown>;

        const patchOp = findOp(entry, "patch");
        const putOp = findOp(entry, "update");
        let plan: Plan;
        const common = {
          tool,
          entry,
          id,
          before: [{ id, data: current }],
          changes: diff(base, after),
          warnings,
        };
        if (args.file) {
          if (!putOp?.multipartParts) throw new ToolError(`${entry.key} update takes no file`);
          plan = {
            ...common,
            op: putOp,
            pathParams: buildPathParams(entry, putOp, { id, parentId: args.parentId }),
            upload: uploadFor(ctx, entry, putOp, after, args.file, warnings),
            summary: `update ${entry.key} ${id}${label(current)} with a new file (PUT)`,
          };
        } else if (patchOp) {
          plan = {
            ...common,
            op: patchOp,
            pathParams: buildPathParams(entry, patchOp, { id, parentId: args.parentId }),
            json: changes,
            summary: `update ${entry.key} ${id}${label(current)} (PATCH)`,
          };
        } else if (putOp && !putOp.multipartParts) {
          plan = {
            ...common,
            op: putOp,
            pathParams: buildPathParams(entry, putOp, { id, parentId: args.parentId }),
            json: after,
            summary: `update ${entry.key} ${id}${label(current)} (read, merge, PUT)`,
          };
        } else {
          throw new ToolError(`${entry.key} does not support update${putOp?.multipartParts ? " without a file" : ""}`);
        }
        if (!plan.changes.length && !args.file) throw new ToolError("no changes: the record already has these values");
        return execute(ctx, plan, args.confirm);
      },
    ),
  );

  server.registerTool(
    "wxcc-ext-delete",
    {
      description: "Delete a record by id. Dry-runs unless confirm is given; the record is snapshotted first.",
      inputSchema: { resource, id: z.string(), parentId, confirm },
    },
    handler(ctx, "wxcc-ext-delete", async (args: { resource: string; id: string; parentId?: string; confirm?: string }) => {
      const tool = "wxcc-ext-delete";
      const entry = ctx.catalog.resolve(args.resource);
      const op = findOp(entry, "delete");
      if (!op) throw new ToolError(`${entry.key} does not support delete`);
      const current = await readCurrent(ctx, tool, entry, args.id, args.parentId);
      return execute(
        ctx,
        {
          tool,
          entry,
          op,
          id: args.id,
          pathParams: buildPathParams(entry, op, { id: args.id, parentId: args.parentId }),
          before: current ? [{ id: args.id, data: current }] : [],
          changes: [{ path: "(record)", before: current ? `${args.id}${label(current)}` : args.id }],
          summary: `delete ${entry.key} ${args.id}${label(current)}`,
          warnings: ["if other entities use this record the API refuses with their names; check view: references first"],
        },
        args.confirm,
      );
    }),
  );

  server.registerTool(
    "wxcc-ext-bulk",
    {
      description:
        "Save (create/update) or delete many records in one request. SAVE items with an id are merged with the " +
        "current record. operation patch sends partial items. Dry-runs unless confirm is given.",
      inputSchema: {
        resource,
        operation: z.enum(["save", "patch"]).optional().describe("save (default) or patch"),
        items: z.array(z.object({ action: z.enum(["SAVE", "DELETE"]).optional(), item: record })).min(1),
        parentId,
        confirm,
      },
    },
    handler(
      ctx,
      "wxcc-ext-bulk",
      async (args: {
        resource: string;
        operation?: "save" | "patch";
        items: Array<{ action?: "SAVE" | "DELETE"; item: Record<string, unknown> }>;
        parentId?: string;
        confirm?: string;
      }) => {
        const tool = "wxcc-ext-bulk";
        const entry = ctx.catalog.resolve(args.resource);
        const patch = args.operation === "patch";
        const op = findOp(entry, patch ? "bulkPatch" : "bulkSave");
        if (!op) throw new ToolError(`${entry.key} does not support bulk ${patch ? "patch" : "save"}`);
        const orgId = ctx.client.orgId;
        const before: Plan["before"] = [];
        const changes: Change[] = [];
        const warnings: string[] = [];
        const items: unknown[] = [];

        for (const [i, input] of args.items.entries()) {
          const itemIdentifier = i + 1;
          const action = input.action ?? "SAVE";
          if (patch && input.action === "DELETE") throw new ToolError("operation patch does not take DELETE items");
          const id = typeof input.item.id === "string" ? input.item.id : undefined;
          if ((action === "DELETE" || patch) && !id) throw new ToolError(`item ${itemIdentifier}: ${patch ? "patch" : "DELETE"} items need item.id`);
          const current = id ? await readCurrent(ctx, tool, entry, id, args.parentId) : undefined;
          if (current) before.push({ id: id!, data: current });
          const changesIn = dropReadOnly(entry, input.item, warnings);

          let item: Record<string, unknown>;
          if (action === "DELETE") {
            item = { ...(current ? omit(current, entry.readOnlyFields) : { id }), organizationId: orgId };
            changes.push({ path: `[${itemIdentifier}] DELETE`, before: `${id}${label(current)}` });
          } else if (patch) {
            item = { ...changesIn, id, organizationId: orgId };
            const base = current ? omit(current, entry.readOnlyFields) : {};
            changes.push(...prefix(itemIdentifier, diff(base, deepMerge(base, changesIn))));
          } else if (current) {
            const base = omit(current, entry.readOnlyFields);
            item = { ...(deepMerge(base, changesIn) as Record<string, unknown>), organizationId: orgId };
            changes.push(...prefix(itemIdentifier, diff(base, item)));
          } else {
            item = { ...changesIn, organizationId: orgId };
            changes.push({ path: `[${itemIdentifier}] SAVE (new)`, after: `${label(item).trim() || "record"}` });
          }
          items.push(patch ? { itemIdentifier, item } : { itemIdentifier, requestAction: action, item });
        }

        const deletes = args.items.filter((i) => i.action === "DELETE").length;
        return execute(
          ctx,
          {
            tool,
            entry,
            op,
            pathParams: buildPathParams(entry, op, { parentId: args.parentId }),
            json: { items },
            before,
            changes,
            summary: `bulk ${patch ? "patch" : "save"} of ${items.length} ${entry.key} item(s)${deletes ? `, ${deletes} DELETE` : ""}`,
            warnings: [...new Set(warnings)],
            showBody: true,
          },
          args.confirm,
        );
      },
    ),
  );

  server.registerTool(
    "wxcc-ext-action",
    {
      description:
        "Run a named non-CRUD operation from describe-resource (e.g. purge-inactive, reassign-agents, reskill). " +
        "fetch-* actions only read and run at once; others dry-run unless confirm is given.",
      inputSchema: {
        resource,
        action: z.string(),
        id: z.string().optional(),
        parentId,
        params: z.record(z.string(), z.string()).optional().describe("Other path params"),
        query: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])).optional(),
        body: z.unknown().optional(),
        confirm,
      },
    },
    handler(
      ctx,
      "wxcc-ext-action",
      async (args: {
        resource: string;
        action: string;
        id?: string;
        parentId?: string;
        params?: Record<string, string>;
        query?: QueryInput;
        body?: unknown;
        confirm?: string;
      }) => {
        const tool = "wxcc-ext-action";
        const entry = ctx.catalog.resolve(args.resource);
        const op = findOp(entry, "action", args.action);
        if (!op) {
          const names = actionNames(entry);
          throw new ToolError(`${entry.key} has no action "${args.action}"${names.length ? ` (actions: ${names.join(", ")})` : ""}`);
        }
        if (args.body !== undefined && !op.hasBody) throw new ToolError(`${entry.key} ${args.action} takes no body`);
        if (op.multipartParts) throw new ToolError(`${entry.key} ${args.action} needs an upload, which actions do not support`);
        const pathParams = buildPathParams(entry, op, { id: args.id, parentId: args.parentId, params: args.params });
        const query = buildQuery(entry, op, args.query ?? {});

        if (args.action.startsWith("fetch-")) {
          const res = await callApi(ctx, { tool, phase: "read", entry, op, id: args.id, pathParams, query, json: args.body });
          return shapeResult(entry.key, res.data, ctx.config.maxResponseChars, "narrow the request body or page through results");
        }

        const current = pathParams.id ? await readCurrent(ctx, tool, entry, pathParams.id, args.parentId) : undefined;
        return execute(
          ctx,
          {
            tool,
            entry,
            op,
            id: pathParams.id,
            pathParams,
            query,
            json: args.body,
            before: current && pathParams.id ? [{ id: pathParams.id, data: current }] : [],
            changes: [],
            summary: `${args.action} on ${entry.key}${pathParams.id ? ` ${pathParams.id}${label(current)}` : ""}`,
            warnings: [],
            showBody: true,
          },
          args.confirm,
        );
      },
    ),
  );
}

function prefix(itemIdentifier: number, changes: Change[]): Change[] {
  return changes.map((c) => ({ ...c, path: `[${itemIdentifier}] ${c.path}` }));
}
