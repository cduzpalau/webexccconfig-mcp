/**
 * Snapshots Webex Contact Center API specs embedded in developer.webex.com.
 *
 * Every API reference page server-renders `window.__INITIAL_STATE__`, whose side navigation
 * carries the OpenAPI operation spec of every Contact Center endpoint. This script fetches one
 * page, walks to "API Reference (Contact Center)" → each section in SECTIONS, validates each
 * operation and writes one file per section under apireference/openapi/:
 *   configuration.json  "Webex Contact Center: Configuration" (all groups)
 *   flows.json          "Webex Contact Center: Flow Orchestration" → "Flow Orchestration: Flows"
 *
 * Manual, needs network: `npm run fetch:spec [-- [--only <name>] [<page url>]]`. The page content
 * is untrusted: it is only JSON-parsed and validated, never evaluated.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { z } from "zod";

const ROOT = resolve(import.meta.dirname, "..");
export const SPEC_DIR = join(ROOT, "apireference", "openapi");
const DEFAULT_URL =
  "https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/update-specific-desktop-layout-by-id";
const API_REFERENCE_TITLE = "API Reference (Contact Center)";

export interface SectionSpec {
  /** Short name, also the file name: apireference/openapi/<name>.json. */
  name: string;
  /** Section title under "API Reference (Contact Center)". */
  title: string;
  /** Only these groups of the section; all groups when omitted. */
  groups?: string[];
  /** Every operation path must start with this. */
  pathPrefix: string;
  /** Removed from group titles, e.g. "Configuration: Team" → "Team". */
  groupTitlePrefix: RegExp;
}

export const SECTIONS: SectionSpec[] = [
  {
    name: "configuration",
    title: "Webex Contact Center: Configuration",
    pathPrefix: "/organization/{orgid}",
    groupTitlePrefix: /^Configuration:\s*/,
  },
  {
    name: "flows",
    title: "Webex Contact Center: Flow Orchestration",
    groups: ["Flow Orchestration: Flows"],
    pathPrefix: "/{orgId}/project/{projectId}",
    groupTitlePrefix: /^Flow Orchestration:\s*/,
  },
];

export const specFile = (name: string) => join(SPEC_DIR, `${name}.json`);

const parameterSchema = z
  .object({
    name: z.string().min(1),
    in: z.enum(["path", "query", "header", "cookie"]),
    required: z.boolean().optional(),
  })
  .passthrough();

const operationSchema = z
  .object({
    method: z.string().transform((m) => m.toUpperCase()).pipe(z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])),
    path: z.string().startsWith("/"),
    operationId: z.string().min(1),
    summary: z.string().optional(),
    description: z.string().optional(),
    deprecated: z.boolean().optional(),
    parameters: z.array(parameterSchema).optional(),
    requestBody: z.object({ content: z.record(z.string(), z.unknown()) }).passthrough().optional(),
    responses: z.record(z.string(), z.unknown()),
  })
  .passthrough();

const embeddedSpecSchema = z.object({
  title: z.string().optional(),
  meta: z
    .object({ info: z.object({ title: z.string(), description: z.string().optional() }).passthrough() })
    .passthrough(),
  spec: operationSchema,
});

export type Operation = z.infer<typeof operationSchema>;

export interface SpecOperation {
  group: string;
  title: string;
  docPath: string;
  docVersion: number;
  apiTitle: string;
  /** Responses whose bodies are shared by several operations are `{ "$shared": "<id>" }`. */
  operation: Operation;
}

export interface SpecFile {
  _source: { url: string; fetchedAt: string; section: string; operationCount: number };
  /** API group description, keyed by apiTitle. */
  apis: Record<string, string>;
  /** Response objects used by more than one operation, keyed by content hash. */
  sharedResponses: Record<string, unknown>;
  operations: Record<string, SpecOperation>;
}

interface Collected {
  operations: Record<string, SpecOperation>;
  apis: Record<string, string>;
}

interface NavNode {
  title?: string;
  displayText?: string;
  url?: string;
  subMenu?: NavNode[];
  versions?: Array<{ version?: number; spec?: string }>;
}

export function extractInitialState(html: string): unknown {
  const marker = "window.__INITIAL_STATE__ = ";
  const start = html.indexOf(marker);
  if (start === -1) throw new Error("page has no window.__INITIAL_STATE__ (portal structure changed?)");
  const end = html.indexOf("</script>", start);
  if (end === -1) throw new Error("unterminated __INITIAL_STATE__ script");
  const json = html.slice(start + marker.length, end).trim().replace(/;$/, "");
  return JSON.parse(json);
}

export function collectOperations(state: unknown, spec: SectionSpec = SECTIONS[0]!): Collected {
  const menus = (state as { sideNavigation?: { sideNavigationData?: { subMenu?: NavNode[] } } })
    ?.sideNavigation?.sideNavigationData?.subMenu;
  if (!Array.isArray(menus)) throw new Error("sideNavigation.sideNavigationData.subMenu missing");
  const apiRef = menus.find((m) => m.title === API_REFERENCE_TITLE);
  if (!apiRef) throw new Error(`"${API_REFERENCE_TITLE}" not found in navigation`);
  const section = apiRef.subMenu?.find((m) => m.title === spec.title);
  if (!section?.subMenu) throw new Error(`"${spec.title}" not found in navigation`);
  const groups = spec.groups
    ? spec.groups.map((g) => {
        const found = section.subMenu!.find((m) => m.title === g);
        if (!found) throw new Error(`"${g}" not found in "${spec.title}"`);
        return found;
      })
    : section.subMenu;

  const out: Record<string, SpecOperation> = {};
  const apis: Record<string, string> = {};
  const problems: string[] = [];
  const visit = (node: NavNode, group: string): void => {
    if (node.subMenu?.length) {
      for (const child of node.subMenu) visit(child, group);
      return;
    }
    for (const v of node.versions ?? []) {
      let parsed: z.infer<typeof embeddedSpecSchema>;
      try {
        parsed = embeddedSpecSchema.parse(JSON.parse(v.spec ?? "null"));
      } catch (err) {
        problems.push(`${node.url ?? node.title}: ${(err as Error).message.slice(0, 200)}`);
        continue;
      }
      const op = parsed.spec;
      const key = `${op.method} ${op.path}`;
      if (!op.path.startsWith(spec.pathPrefix)) {
        problems.push(`${key}: path does not start with ${spec.pathPrefix}`);
        continue;
      }
      if (out[key]) {
        problems.push(`duplicate operation ${key} (${node.url})`);
        continue;
      }
      out[key] = {
        group,
        title: node.displayText ?? parsed.title ?? op.summary ?? key,
        docPath: node.url ?? "",
        docVersion: v.version ?? 1,
        apiTitle: parsed.meta.info.title,
        operation: op,
      };
      apis[parsed.meta.info.title] ??= parsed.meta.info.description ?? "";
    }
  };
  for (const group of groups) visit(group, (group.title ?? "").replace(spec.groupTitlePrefix, ""));
  if (problems.length) throw new Error(`invalid operations:\n  ${problems.join("\n  ")}`);
  if (Object.keys(out).length === 0) throw new Error("no operations found");
  return { operations: sortKeys(out), apis: sortKeys(apis) };
}

/** Moves response objects that occur more than once into a shared table referenced by hash. */
export function shareResponses(operations: Record<string, SpecOperation>): {
  operations: Record<string, SpecOperation>;
  sharedResponses: Record<string, unknown>;
} {
  const counts = new Map<string, number>();
  for (const o of Object.values(operations)) {
    for (const r of Object.values(o.operation.responses)) {
      const k = JSON.stringify(r);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  const shared: Record<string, unknown> = {};
  const idFor = (json: string) => createHash("sha256").update(json).digest("hex").slice(0, 12);
  const result: Record<string, SpecOperation> = {};
  for (const [key, o] of Object.entries(operations)) {
    const responses: Record<string, unknown> = {};
    for (const [code, r] of Object.entries(o.operation.responses)) {
      const json = JSON.stringify(r);
      if ((counts.get(json) ?? 0) > 1) {
        const id = idFor(json);
        shared[id] = r;
        responses[code] = { $shared: id };
      } else {
        responses[code] = r;
      }
    }
    result[key] = { ...o, operation: { ...o.operation, responses } };
  }
  return { operations: result, sharedResponses: sortKeys(shared) };
}

function sortKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

function summariseDrift(prev: SpecFile | undefined, next: SpecFile): string {
  if (!prev) return `new snapshot: ${next._source.operationCount} operations`;
  const before = new Set(Object.keys(prev.operations));
  const after = new Set(Object.keys(next.operations));
  const added = [...after].filter((k) => !before.has(k));
  const removed = [...before].filter((k) => !after.has(k));
  const newlyDeprecated = [...after].filter(
    (k) => before.has(k) && next.operations[k]!.operation.deprecated && !prev.operations[k]!.operation.deprecated,
  );
  const changed = [...after].filter(
    (k) => before.has(k) && JSON.stringify(prev.operations[k]) !== JSON.stringify(next.operations[k]),
  );
  const lines = [
    `${prev._source.operationCount} → ${next._source.operationCount} operations`,
    ...added.map((k) => `  + ${k}`),
    ...removed.map((k) => `  - ${k}`),
    ...newlyDeprecated.map((k) => `  ~ deprecated: ${k}`),
    `  ${changed.length} existing operation(s) changed`,
  ];
  return lines.join("\n");
}

/** Builds the snapshot of one section from the page state. */
export function buildSpecFile(state: unknown, section: SectionSpec, url: string, fetchedAt: string): SpecFile {
  const collected = collectOperations(state, section);
  const { operations, sharedResponses } = shareResponses(collected.operations);
  return {
    _source: {
      url,
      fetchedAt,
      section: section.groups ? `${section.title} → ${section.groups.join(", ")}` : section.title,
      operationCount: Object.keys(operations).length,
    },
    apis: collected.apis,
    sharedResponses,
    operations,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const onlyAt = args.indexOf("--only");
  const only = onlyAt >= 0 ? args.splice(onlyAt, 2)[1] : undefined;
  const sections = only ? SECTIONS.filter((s) => s.name === only) : SECTIONS;
  if (!sections.length) throw new Error(`unknown section "${only}" (sections: ${SECTIONS.map((s) => s.name).join(", ")})`);
  const url = args[0] ?? DEFAULT_URL;
  if (!url.startsWith("https://developer.webex.com/")) throw new Error("only developer.webex.com pages are supported");
  const res = await fetch(url, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  const state = extractInitialState(await res.text());
  const fetchedAt = new Date().toISOString().slice(0, 10);

  for (const section of sections) {
    const file = specFile(section.name);
    const next = buildSpecFile(state, section, url, fetchedAt);
    const prev = existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as SpecFile) : undefined;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(next, null, 1) + "\n");
    console.log(`wrote ${file}\n${summariseDrift(prev, next)}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err: unknown) => {
    console.error(`fetch-spec: ${(err as Error).message}`);
    process.exit(1);
  });
}
