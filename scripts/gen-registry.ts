/**
 * Generates src/registry/ from apireference/openapi/configuration.json (see scripts/fetch-spec.ts)
 * and scripts/registry-overrides.ts. Offline and deterministic.
 *
 *   npm run gen:registry             write src/registry/
 *   npm run gen:registry -- --check  exit 1 if src/registry/ is out of date
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import type {
  HttpMethod,
  OpKind,
  QueryParam,
  RegistryEntry,
  RegistryOperation,
  ResourceSchemaDoc,
  UpdateSemantics,
} from "../src/registry-types.js";
import type { SpecFile, SpecOperation } from "./fetch-spec.js";
import { ALWAYS_READ_ONLY, RESOURCES, type ResourceOverride } from "./registry-overrides.js";

const ROOT = resolve(import.meta.dirname, "..");
const SPEC_PATH = join(ROOT, "apireference", "openapi", "configuration.json");
export const REGISTRY_DIR = join(ROOT, "src", "registry");
const ORG_PREFIX = "/organization/{orgid}";

const KIND_ORDER: OpKind[] = [
  "list",
  "get",
  "create",
  "update",
  "patch",
  "delete",
  "bulkSave",
  "bulkPatch",
  "references",
  "view",
  "action",
];

interface Classified {
  kind: OpKind;
  name?: string;
}

export interface BuildResult {
  entries: RegistryEntry[];
  schemas: Record<string, ResourceSchemaDoc>;
  report: { deprecatedSkipped: number; excluded: string[]; superseded: string[]; emptyResources: string[] };
}

/** Splits a path into segments after /organization/{orgid}, removing /vN segments. */
export function parsePath(path: string): { segments: string[]; version: number } {
  if (!path.startsWith(ORG_PREFIX)) throw new Error(`unexpected path: ${path}`);
  let version = 1;
  const segments: string[] = [];
  for (const seg of path.slice(ORG_PREFIX.length).split("/").filter(Boolean)) {
    const m = /^v(\d+)$/.exec(seg);
    if (m) version = Math.max(version, Number(m[1]));
    else segments.push(seg);
  }
  return { segments, version };
}

const isPlaceholder = (s: string) => s.startsWith("{") && s.endsWith("}");

/** Longest-prefix match of segments against override bases; `{x}` in a base matches any placeholder. */
export function matchResource(
  segments: string[],
  overrides: ResourceOverride[],
): { override: ResourceOverride; rest: string[] } | undefined {
  let best: { override: ResourceOverride; rest: string[]; len: number } | undefined;
  for (const o of overrides) {
    const base = o.base.split("/");
    if (base.length > segments.length) continue;
    const ok = base.every((b, i) => (isPlaceholder(b) ? isPlaceholder(segments[i]!) : b === segments[i]));
    if (ok && (!best || base.length > best.len)) best = { override: o, rest: segments.slice(base.length), len: base.length };
  }
  return best && { override: best.override, rest: best.rest };
}

/** Maps the path remainder after the resource base to an op kind; undefined means never exposed. */
export function classify(method: HttpMethod, rest: string[]): Classified | undefined {
  const [first, second] = rest;
  if (rest.length === 0) {
    if (method === "GET") return { kind: "list" };
    if (method === "POST") return { kind: "create" };
    if (method === "DELETE") return undefined; // collection-level delete-all: never exposed
  }
  if (rest.length === 1 && first === "{id}") {
    const kinds: Partial<Record<HttpMethod, OpKind>> = { GET: "get", PUT: "update", PATCH: "patch", DELETE: "delete" };
    if (kinds[method]) return { kind: kinds[method]! };
  }
  if (rest.length === 1 && first === "bulk") {
    if (method === "POST") return { kind: "bulkSave" };
    if (method === "PATCH") return { kind: "bulkPatch" };
  }
  if (rest.length === 1 && first === "bulk-export") return undefined; // bulk export is not exposed
  if (rest.length === 2 && first === "{id}" && second === "incoming-references" && method === "GET") {
    return { kind: "references" };
  }
  if (rest.length === 1 && first === "purge-inactive-entities" && method === "POST") {
    return { kind: "action", name: "purge-inactive" };
  }
  const name = rest
    .filter((s) => !isPlaceholder(s))
    .join("-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
  if (!name) throw new Error(`cannot name ${method} …/${rest.join("/")}`);
  return { kind: method === "GET" ? "view" : "action", name };
}

export function buildRegistry(spec: SpecFile, overrides: ResourceOverride[] = RESOURCES): BuildResult {
  const keys = new Set<string>();
  for (const o of overrides) {
    if (keys.has(o.key)) throw new Error(`duplicate override key ${o.key}`);
    keys.add(o.key);
  }

  type Candidate = { op: RegistryOperation; src: SpecOperation; schemaKey: string };
  const byResource = new Map<string, Map<string, Candidate>>();
  const report: BuildResult["report"] = { deprecatedSkipped: 0, excluded: [], superseded: [], emptyResources: [] };
  const problems: string[] = [];

  for (const [sourceKey, src] of Object.entries(spec.operations)) {
    const op = src.operation;
    if (op.deprecated) {
      report.deprecatedSkipped++;
      continue;
    }
    const method = op.method as HttpMethod;
    const { segments, version } = parsePath(op.path);
    const match = matchResource(segments, overrides);
    if (!match) {
      problems.push(`no resource for ${sourceKey}`);
      continue;
    }
    const classified = classify(method, match.rest);
    if (!classified) {
      report.excluded.push(sourceKey);
      continue;
    }
    const name = classified.name
      ? (match.override.nameBySource?.[sourceKey] ?? match.override.rename?.[classified.name] ?? classified.name)
      : undefined;
    const schemaKey = name ? `${classified.kind}:${name}` : classified.kind;
    const registryOp = toRegistryOperation(sourceKey, src, classified.kind, name, version);

    const ops = byResource.get(match.override.key) ?? new Map<string, Candidate>();
    byResource.set(match.override.key, ops);
    const existing = ops.get(schemaKey);
    if (existing && existing.op.apiVersion === version) {
      problems.push(`${match.override.key}: ${schemaKey} defined twice at v${version} (${existing.op.source}, ${sourceKey})`);
      continue;
    }
    if (!existing || version > existing.op.apiVersion) {
      if (existing) report.superseded.push(existing.op.source);
      ops.set(schemaKey, { op: registryOp, src, schemaKey });
    } else {
      report.superseded.push(sourceKey);
    }
  }
  if (problems.length) throw new Error(`registry generation failed:\n  ${problems.join("\n  ")}`);

  const entries: RegistryEntry[] = [];
  const schemas: Record<string, ResourceSchemaDoc> = {};
  for (const o of [...overrides].sort((a, b) => cmp(a.key, b.key))) {
    const ops = byResource.get(o.key);
    if (!ops?.size) {
      report.emptyResources.push(o.key);
      continue;
    }
    const candidates = [...ops.values()].sort(
      (a, b) => KIND_ORDER.indexOf(a.op.kind) - KIND_ORDER.indexOf(b.op.kind) || cmp(a.op.name ?? "", b.op.name ?? ""),
    );
    const find = (kind: OpKind) => candidates.find((c) => c.op.kind === kind && !c.op.name);
    const get = find("get");
    const create = find("create");
    const update = find("update");
    const patch = find("patch");

    const updateSemantics: UpdateSemantics =
      update && patch ? "put-and-patch" : patch ? "patch-partial" : update ? "put-full-replace" : "none";
    const readOnly = new Set(ALWAYS_READ_ONLY);
    for (const schema of [get && responseSchema(spec, get.src), create && bodySchema(create.src), update && bodySchema(update.src)]) {
      for (const [prop, def] of Object.entries(propertiesOf(schema))) if (isObject(def) && def.readOnly === true) readOnly.add(prop);
    }
    const createSchema = create ? bodySchema(create.src) : undefined;
    const required = isObject(createSchema) && Array.isArray(createSchema.required) ? createSchema.required.map(String) : [];
    const anySrc = candidates[0]!.src;

    entries.push({
      key: o.key,
      displayName: o.displayName,
      description: apiDescription(spec.apis[anySrc.apiTitle] ?? ""),
      aliases: o.aliases ?? [],
      toolset: o.toolset,
      singleton: o.singleton ?? false,
      idField: "id",
      ...(o.parent ? { parent: o.parent } : {}),
      updateSemantics,
      readOnlyFields: [...readOnly].sort(cmp),
      requiredOnCreate: required,
      operations: candidates.map((c) => c.op),
    });
    schemas[o.key] = {
      key: o.key,
      operations: Object.fromEntries(
        candidates.map((c) => {
          const op = c.src.operation;
          const description = op.description ? cleanText(op.description) : undefined;
          return [
            c.schemaKey,
            {
              method: c.op.method,
              path: c.op.path,
              summary: c.op.summary,
              ...(description && description !== c.op.summary ? { description } : {}),
              queryParams: queryParams(c.src, true),
              ...(c.op.hasBody ? { requestBody: cleanSchema(bodySchema(c.src)) } : {}),
              ...(responseSchema(spec, c.src) !== undefined ? { response: cleanSchema(responseSchema(spec, c.src)) } : {}),
            },
          ];
        }),
      ),
    };
  }
  report.excluded.sort(cmp);
  report.superseded.sort(cmp);
  return { entries, schemas, report };
}

function toRegistryOperation(
  source: string,
  src: SpecOperation,
  kind: OpKind,
  name: string | undefined,
  apiVersion: number,
): RegistryOperation {
  const op = src.operation;
  const body = bodySchema(src);
  const qp = queryParams(src, false);
  return {
    kind,
    ...(name ? { name } : {}),
    method: op.method as HttpMethod,
    path: op.path,
    apiVersion,
    pathParams: [...op.path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]!).filter((p) => p !== "orgid"),
    queryParams: qp,
    hasBody: body !== undefined,
    ...(body !== undefined ? { bodyEncoding: hasBinary(body) ? "multipart" : "json" } : {}),
    paginated: qp.some((p) => p.name === "page") && qp.some((p) => p.name === "pageSize"),
    summary: cleanText(op.summary ?? src.title),
    source,
  } as RegistryOperation;
}

type Param = { name: string; in: string; required?: boolean; description?: string; schema?: Record<string, unknown> };

/** A query param named *DTO carrying an object schema is a springdoc artefact for the JSON body. */
function isDtoQueryParam(p: Param): boolean {
  return p.in === "query" && /DTO$/.test(p.name) && p.schema?.type === "object";
}

function queryParams(src: SpecOperation, withDescriptions: boolean): Array<QueryParam & { description?: string }> {
  const params = (src.operation.parameters ?? []) as Param[];
  return params
    .filter((p) => p.in === "query" && !isDtoQueryParam(p))
    .map((p) => {
      const s = p.schema ?? {};
      const type: QueryParam["type"] =
        s.type === "integer" ? "integer" : s.type === "boolean" ? "boolean" : s.type === "array" ? "string[]" : "string";
      const description = withDescriptions && p.description ? truncate(cleanText(p.description), 400) : undefined;
      return {
        name: p.name,
        type,
        required: p.required === true,
        ...(s.default !== undefined ? { default: String(s.default) } : {}),
        ...(Array.isArray(s.enum) ? { enum: s.enum.map(String) } : {}),
        ...(description ? { description } : {}),
      };
    });
}

function bodySchema(src: SpecOperation): unknown {
  const content = src.operation.requestBody?.content as Record<string, { schema?: unknown }> | undefined;
  const fromContent = content?.["application/json"]?.schema ?? content?.["multipart/form-data"]?.schema;
  if (fromContent !== undefined) return fromContent;
  const dto = ((src.operation.parameters ?? []) as Param[]).find(isDtoQueryParam);
  return dto?.schema;
}

function responseSchema(spec: SpecFile, src: SpecOperation): unknown {
  for (const code of ["200", "201", "207"]) {
    let r = src.operation.responses[code] as Record<string, unknown> | undefined;
    if (!r) continue;
    if (typeof r.$shared === "string") r = spec.sharedResponses[r.$shared] as Record<string, unknown> | undefined;
    const content = r?.content as Record<string, { schema?: unknown }> | undefined;
    if (!content) continue;
    const first = Object.values(content)[0];
    if (first?.schema !== undefined) return first.schema;
  }
  return undefined;
}

function propertiesOf(schema: unknown): Record<string, unknown> {
  return isObject(schema) && isObject(schema.properties) ? schema.properties : {};
}

function hasBinary(schema: unknown): boolean {
  if (!isObject(schema)) return false;
  return Object.values(propertiesOf(schema)).some((p) => isObject(p) && p.type === "string" && p.format === "binary");
}

/** Removes generator-irrelevant keys and turns HTML descriptions into plain text. */
function cleanSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(cleanSchema);
  if (!isObject(schema)) return schema;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(schema)) {
    if (k === "$$ref") continue;
    out[k] = k === "description" && typeof v === "string" ? cleanText(v) : cleanSchema(v);
  }
  return out;
}

/** Plain-text group description without the shared authentication boilerplate. */
function apiDescription(html: string): string {
  const text = cleanText(html).split(/Authentication\s*&\s*Authorization:/)[0]!.trim();
  return truncate(text, 500);
}

export function cleanText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|li|ul|ol)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const HEADER = "// GENERATED by scripts/gen-registry.ts from apireference/openapi/configuration.json. Do not edit.\n";

/** Renders the registry as files keyed by path relative to src/registry/. */
export function render(result: BuildResult): Map<string, string> {
  const files = new Map<string, string>();
  const loaders = result.entries
    .map((e) => `  ${JSON.stringify(e.key)}: () => import(${JSON.stringify(`./schemas/${e.key}.js`)}),`)
    .join("\n");
  files.set(
    "index.ts",
    `${HEADER}import type { RegistryEntry, ResourceSchemaDoc } from "../registry-types.js";\n\n` +
      `export const RESOURCES: readonly RegistryEntry[] = ${JSON.stringify(result.entries, null, 2)};\n\n` +
      `/** Lazy loaders for full schemas, used by describe_resource. */\n` +
      `export const SCHEMA_LOADERS: Record<string, () => Promise<{ default: ResourceSchemaDoc }>> = {\n${loaders}\n};\n`,
  );
  for (const [key, doc] of Object.entries(result.schemas)) {
    files.set(
      `schemas/${key}.ts`,
      `${HEADER}import type { ResourceSchemaDoc } from "../../registry-types.js";\n\n` +
        `const doc: ResourceSchemaDoc = ${JSON.stringify(doc, null, 2)};\n\nexport default doc;\n`,
    );
  }
  return files;
}

function listExisting(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && !e.name.startsWith("."))
    .map((e) => relative(dir, join(e.parentPath, e.name)));
}

/** Returns the relative paths whose content differs from (or is missing in / extra on) disk. */
export function diffAgainstDisk(files: Map<string, string>, dir = REGISTRY_DIR): string[] {
  const stale: string[] = [];
  for (const [rel, content] of files) {
    const p = join(dir, rel);
    if (!existsSync(p) || readFileSync(p, "utf8") !== content) stale.push(rel);
  }
  for (const rel of listExisting(dir)) if (!files.has(rel)) stale.push(rel);
  return stale.sort(cmp);
}

export function loadSpec(path = SPEC_PATH): SpecFile {
  return JSON.parse(readFileSync(path, "utf8")) as SpecFile;
}

function main(): void {
  const check = process.argv.includes("--check");
  const result = buildRegistry(loadSpec());
  const files = render(result);
  const stale = diffAgainstDisk(files);
  if (check) {
    if (stale.length) {
      console.error(`src/registry is out of date (${stale.length} file(s)): run npm run gen:registry`);
      process.exit(1);
    }
    console.log("src/registry is up to date");
    return;
  }
  for (const rel of listExisting(REGISTRY_DIR)) if (!files.has(rel)) rmSync(join(REGISTRY_DIR, rel));
  for (const [rel, content] of files) {
    const p = join(REGISTRY_DIR, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
  const opCount = result.entries.reduce((n, e) => n + e.operations.length, 0);
  console.log(
    `wrote ${files.size} files: ${result.entries.length} resources, ${opCount} operations` +
      `\n  skipped ${result.report.deprecatedSkipped} deprecated ops` +
      `\n  superseded by a newer version: ${result.report.superseded.length}` +
      `\n  excluded (never exposed): ${result.report.excluded.length ? result.report.excluded.join(", ") : "none"}` +
      (result.report.emptyResources.length ? `\n  resources with no live ops: ${result.report.emptyResources.join(", ")}` : ""),
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
