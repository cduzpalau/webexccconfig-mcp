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
import type { ApiResponse, QueryValue } from "../client.js";
import type { RegistryEntry, RegistryOperation } from "../registry-types.js";
import { fingerprint, planHash } from "../write/confirm.js";
import type { FileInput, UploadKind } from "../write/files.js";
import { loadJson, outline } from "../write/jsonfile.js";
import { changedFields, deepMerge, diff, isPlainObject, omit, presentChanges, type Change } from "../write/merge.js";
import { actionNames, findOp, ToolError } from "./catalog.js";
import { bulkDelete, isSystemDefault, sendDelete, SYSTEM_DEFAULT, type DeleteOutcome } from "./delete.js";
import {
  buildPathParams,
  buildQuery,
  callApi,
  handler,
  jsonResult,
  label,
  opLabel,
  readCurrent,
  shapeResult,
  stripLinks,
  type CallSpec,
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
  /** The body came from this local file: the dry-run shows an outline instead of the body. */
  bodyFile?: string;
  /** Replaces the plain API call on apply (deletes: 412 explanations, timeout checks). */
  send?: (log: CallSpec["log"]) => Promise<DeleteOutcome>;
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
      ...(plan.bodyFile ? { file: plan.bodyFile } : {}),
    });
    const body = plan.upload
      ? { [plan.upload.jsonPart]: plan.upload.info, [plan.upload.filePart]: "<file>" }
      : plan.bodyFile
        ? { file: plan.bodyFile, outline: outline(plan.json) }
        : plan.json;
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
          ? await ctx.snapshots.save(plan.entry.key, plan.before[0]!.id, plan.before[0]!.data)
          : await ctx.snapshots.save(plan.entry.key, "bulk", { items: plan.before });
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

  const log = { changedFields: fields, snapshot, ...(plan.bodyFile ? { file: plan.bodyFile } : {}) };
  const out: DeleteOutcome = plan.send
    ? await plan.send(log)
    : {
        res: await callApi(ctx, {
          tool: plan.tool,
          phase: "apply",
          entry: plan.entry,
          op: plan.op,
          id: plan.id,
          pathParams: plan.pathParams,
          query: plan.query,
          json: plan.json,
          form,
          log,
        }),
      };
  ctx.pending.forget(hash);
  const res: ApiResponse | undefined = out.res;
  return jsonResult({
    applied: true,
    summary: plan.summary,
    ...(res ? { httpStatus: res.status } : {}),
    ...(res?.trackingId ? { trackingId: res.trackingId } : {}),
    ...(out.note ? { note: out.note } : {}),
    ...(snapshot ? { snapshot } : {}),
    ...(res ? { result: summariseResult(res.data, ctx.config.maxResponseChars) } : {}),
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
/** Query values; buildQuery checks names, types and enums against the op. */
const queryArg = record;
const bodyFile = z.string().optional().describe("Local .json file as the body (relative: export_dir)");

/** Exactly one of an inline body or a bodyFile; the file is read now so the plan hash covers it. */
function bodyFrom(ctx: ToolContext, body: unknown, file: string | undefined): { json: unknown; file?: string } {
  if (file === undefined) return { json: body };
  if (body !== undefined) throw new ToolError("give body or bodyFile, not both");
  const loaded = loadJson(file, ctx.config.exportDir);
  return { json: loaded.data, file: loaded.path };
}

export function registerWriteTools(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "wxcc-ext-create",
    {
      description: "Create a record. Dry-runs unless confirm is given. Fields: describe-resource.",
      inputSchema: { resource, body: record.optional(), bodyFile, parentId, file, confirm },
      annotations: { destructiveHint: false },
    },
    handler(
      ctx,
      "wxcc-ext-create",
      async (args: {
        resource: string;
        body?: Record<string, unknown>;
        bodyFile?: string;
        parentId?: string;
        file?: FileInput;
        confirm?: string;
      }) => {
        const entry = ctx.catalog.resolve(args.resource);
        const op = findOp(entry, "create");
        if (!op) throw new ToolError(`${entry.key} does not support create`);
        const source = bodyFrom(ctx, args.body, args.bodyFile);
        if (!isPlainObject(source.json)) throw new ToolError(args.bodyFile ? "bodyFile must hold a JSON object" : "create needs body or bodyFile");
        const body = source.json;
        const warnings: string[] = [];
        if ("id" in body) warnings.push("body.id is ignored by create; use wxcc-ext-update for existing records");
        const plan: Plan = {
          tool: "wxcc-ext-create",
          entry,
          op,
          pathParams: buildPathParams(entry, op, { parentId: args.parentId }),
          before: [],
          changes: source.file ? [] : diff({}, body),
          summary: `create ${entry.key}${label(body)}${source.file ? ` from ${source.file}` : ""}`,
          warnings,
          showBody: true,
          ...(source.file ? { bodyFile: source.file } : {}),
        };
        if (op.multipartParts) {
          if (source.file) throw new ToolError(`${entry.key} create takes an upload; bodyFile is not supported`);
          plan.upload = uploadFor(ctx, entry, op, body, args.file, warnings);
        } else {
          if (args.file) throw new ToolError(`${entry.key} create takes no file`);
          const missing = entry.requiredOnCreate.filter((f) => !(f in body));
          if (missing.length) warnings.push(`the API lists these as required: ${missing.join(", ")}`);
          plan.json = body;
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
      inputSchema: { resource, id: z.string(), parentId, query: queryArg.optional(), confirm },
    },
    handler(ctx, "wxcc-ext-delete", async (args: { resource: string; id: string; parentId?: string; query?: QueryInput; confirm?: string }) => {
      const tool = "wxcc-ext-delete";
      const entry = ctx.catalog.resolve(args.resource);
      const op = findOp(entry, "delete");
      if (!op) throw new ToolError(`${entry.key} does not support delete`);
      const query = buildQuery(entry, op, args.query ?? {});
      const current = await readCurrent(ctx, tool, entry, args.id, args.parentId, args.query);
      const warnings = isSystemDefault(current)
        ? [SYSTEM_DEFAULT]
        : ["if other entities use this record the API refuses, and the error names them"];
      return execute(
        ctx,
        {
          tool,
          entry,
          op,
          id: args.id,
          pathParams: buildPathParams(entry, op, { id: args.id, parentId: args.parentId }),
          query,
          before: current ? [{ id: args.id, data: current }] : [],
          changes: [{ path: "(record)", before: current ? `${args.id}${label(current)}` : args.id }],
          summary: `delete ${entry.key} ${args.id}${label(current)}`,
          warnings,
          send: (log) =>
            sendDelete(ctx, { tool, entry, op, id: args.id, parentId: args.parentId, query, readQuery: args.query, log }),
        },
        args.confirm,
      );
    }),
  );

  server.registerTool(
    "wxcc-ext-bulk",
    {
      description:
        "Many records at once; dry-runs unless confirm is given. save: one bulk request, items with an id merge with " +
        "the current record. patch: partial items. delete: ids, deleted one by one with per-record results.",
      inputSchema: {
        resource,
        operation: z.enum(["save", "patch", "delete"]).optional().describe("Default save"),
        items: z
          .array(z.object({ action: z.enum(["SAVE", "DELETE"]).optional(), id: z.string().optional(), item: record.optional() }))
          .min(1)
          .optional(),
        ids: z.array(z.string()).min(1).optional().describe("delete: record ids"),
        query: queryArg.optional().describe("delete: query for each DELETE"),
        parentId,
        confirm,
      },
    },
    handler(
      ctx,
      "wxcc-ext-bulk",
      async (
        args: {
          resource: string;
          operation?: "save" | "patch" | "delete";
          items?: Array<{ action?: "SAVE" | "DELETE"; id?: string; item?: Record<string, unknown> }>;
          ids?: string[];
          query?: QueryInput;
          parentId?: string;
          confirm?: string;
        },
        extra,
      ) => {
        const tool = "wxcc-ext-bulk";
        if (args.operation === "delete") {
          if (args.items?.some((i) => i.action === "SAVE")) throw new ToolError("operation delete takes ids, not SAVE items");
          const fromItems = (args.items ?? []).map((i) => i.id ?? (typeof i.item?.id === "string" ? i.item.id : undefined));
          if (fromItems.some((id) => !id)) throw new ToolError("operation delete: every item needs an id");
          const ids = [...(args.ids ?? []), ...(fromItems as string[])];
          return bulkDelete(ctx, tool, { resource: args.resource, ids, parentId: args.parentId, query: args.query, confirm: args.confirm }, extra);
        }
        if (args.ids) throw new ToolError("ids is for operation delete; save and patch take items");
        if (args.query) throw new ToolError("query is for operation delete");
        if (!args.items) throw new ToolError(`operation ${args.operation ?? "save"} needs items`);
        const entry = ctx.catalog.resolve(args.resource);
        const patch = args.operation === "patch";
        const op = findOp(entry, patch ? "bulkPatch" : "bulkSave");
        if (!op) {
          throw new ToolError(
            `${entry.key} does not support bulk ${patch ? "patch" : "save"}` +
              (findOp(entry, "delete") ? "; to delete many records use operation delete with ids" : ""),
          );
        }
        const orgId = ctx.client.orgId;
        const before: Plan["before"] = [];
        const changes: Change[] = [];
        const warnings: string[] = [];
        const items: unknown[] = [];

        for (const [i, input] of args.items.entries()) {
          const itemIdentifier = i + 1;
          const action = input.action ?? "SAVE";
          if (patch && input.action === "DELETE") throw new ToolError("operation patch does not take DELETE items");
          const given = input.item ?? {};
          if (action !== "DELETE" && !input.item) throw new ToolError(`item ${itemIdentifier}: ${patch ? "patch" : "SAVE"} items need item`);
          const id = input.id ?? (typeof given.id === "string" ? given.id : undefined);
          if ((action === "DELETE" || patch) && !id) throw new ToolError(`item ${itemIdentifier}: ${patch ? "patch" : "DELETE"} items need an id`);
          const current = id ? await readCurrent(ctx, tool, entry, id, args.parentId) : undefined;
          if (current) before.push({ id: id!, data: current });
          if (action === "DELETE" && isSystemDefault(current)) warnings.push(`item ${itemIdentifier} (${id}): ${SYSTEM_DEFAULT}`);
          const changesIn = dropReadOnly(entry, id ? { ...given, id } : given, warnings);

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
        "Run a named non-CRUD operation from describe-resource (e.g. purge-inactive, reassign-agents, unlock). " +
        "fetch-* actions only read and run at once; others dry-run unless confirm is given.",
      inputSchema: {
        resource,
        action: z.string(),
        id: z.string().optional(),
        parentId,
        params: z.record(z.string(), z.string()).optional().describe("Other path params"),
        query: queryArg.optional(),
        body: z.unknown().optional(),
        bodyFile,
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
        bodyFile?: string;
        confirm?: string;
      }) => {
        const tool = "wxcc-ext-action";
        const entry = ctx.catalog.resolve(args.resource);
        const op = findOp(entry, "action", args.action);
        if (!op) {
          const names = actionNames(entry);
          throw new ToolError(`${entry.key} has no action "${args.action}"${names.length ? ` (actions: ${names.join(", ")})` : ""}`);
        }
        if ((args.body !== undefined || args.bodyFile !== undefined) && !op.hasBody) {
          throw new ToolError(`${entry.key} ${args.action} takes no body`);
        }
        if (op.multipartParts) throw new ToolError(`${entry.key} ${args.action} needs an upload, which actions do not support`);
        const source = bodyFrom(ctx, args.body, args.bodyFile);
        const pathParams = buildPathParams(entry, op, { id: args.id, parentId: args.parentId, params: args.params });
        const query = buildQuery(entry, op, args.query ?? {});

        if (args.action.startsWith("fetch-")) {
          const res = await callApi(ctx, { tool, phase: "read", entry, op, id: args.id, pathParams, query, json: source.json });
          return shapeResult(entry.key, res.data, ctx.config.maxResponseChars, "narrow the request body or page through results");
        }

        const current = pathParams.id ? await readCurrent(ctx, tool, entry, pathParams.id, args.parentId, args.query) : undefined;
        return execute(
          ctx,
          {
            tool,
            entry,
            op,
            id: pathParams.id,
            pathParams,
            query,
            json: source.json,
            before: current && pathParams.id ? [{ id: pathParams.id, data: current }] : [],
            changes: [],
            summary:
              `${args.action} on ${entry.key}${pathParams.id ? ` ${pathParams.id}${label(current)}` : ""}` +
              `${source.file ? ` from ${source.file}${label(source.json)}` : ""}`,
            warnings: [],
            showBody: true,
            ...(source.file ? { bodyFile: source.file } : {}),
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
