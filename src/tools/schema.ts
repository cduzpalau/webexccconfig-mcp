/**
 * Compacts OpenAPI schemas for describe_resource: keeps structure, types, enums, required lists,
 * readOnly and short descriptions; drops examples, patterns and length limits.
 */
const MAX_DESCRIPTION = 160;
const KEEP_FORMATS = new Set(["binary", "date-time", "date", "uuid", "email"]);

export function compactSchema(schema: unknown, maxDepth = 5, depth = 0): unknown {
  if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return schema;
  const s = schema as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  if (s.type !== undefined) out.type = s.type;
  if (typeof s.format === "string" && KEEP_FORMATS.has(s.format)) out.format = s.format;
  if (Array.isArray(s.enum)) out.enum = s.enum;
  if (s.readOnly === true) out.readOnly = true;
  if (typeof s.description === "string" && s.description) out.description = shorten(s.description);
  if (Array.isArray(s.required) && s.required.length) out.required = s.required;
  if (depth >= maxDepth) {
    if (s.properties || s.items) out.note = "nested fields omitted; ask describe-resource with a smaller scope";
    return out;
  }
  if (typeof s.properties === "object" && s.properties !== null) {
    out.properties = Object.fromEntries(
      Object.entries(s.properties as Record<string, unknown>).map(([k, v]) => [k, compactSchema(v, maxDepth, depth + 1)]),
    );
  }
  if (s.items !== undefined) out.items = compactSchema(s.items, maxDepth, depth + 1);
  for (const k of ["oneOf", "anyOf", "allOf"] as const) {
    if (Array.isArray(s[k])) out[k] = (s[k] as unknown[]).map((v) => compactSchema(v, maxDepth, depth + 1));
  }
  if (typeof s.additionalProperties === "object" && s.additionalProperties !== null) {
    out.additionalProperties = compactSchema(s.additionalProperties, maxDepth, depth + 1);
  }
  return out;
}

function shorten(text: string): string {
  const firstSentence = /^(.{20,}?[.!?])(\s|$)/.exec(text)?.[1] ?? text;
  return firstSentence.length > MAX_DESCRIPTION ? `${firstSentence.slice(0, MAX_DESCRIPTION - 1)}…` : firstSentence;
}
