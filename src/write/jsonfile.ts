/**
 * Local JSON files for large documents (flow exports and imports): `saveTo` on wxcc-ext-get writes
 * a full API response to disk instead of returning it, and `bodyFile` on wxcc-ext-create /
 * wxcc-ext-action reads the request body from disk instead of passing it through the model.
 *
 * Relative paths resolve under export_dir. Saving never overwrites an existing file.
 */
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, statSync, writeSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { ToolError } from "../errors.js";

/** Bodies larger than this are refused: far beyond any flow document seen in practice. */
export const MAX_BODY_FILE_BYTES = 20 * 1024 * 1024;

export function resolveJsonPath(input: string, exportDir: string, home = homedir()): string {
  const trimmed = input.trim();
  if (!trimmed) throw new ToolError("file path is empty");
  const expanded = trimmed === "~" ? home : trimmed.startsWith("~/") ? join(home, trimmed.slice(2)) : trimmed;
  const full = isAbsolute(expanded) ? resolve(expanded) : resolve(exportDir, expanded);
  if (!/\.json$/i.test(full)) throw new ToolError(`file must end in .json: ${full}`);
  return full;
}

/** Writes pretty-printed JSON to a new file; refuses to overwrite. Returns the path and size. */
export function saveJson(input: string, data: unknown, exportDir: string): { path: string; bytes: number } {
  const path = resolveJsonPath(input, exportDir);
  if (existsSync(path)) throw new ToolError(`file already exists, choose another name: ${path}`);
  const text = `${JSON.stringify(data, null, 2)}\n`;
  try {
    mkdirSync(dirname(path), { recursive: true });
    const fd = openSync(path, "wx");
    try {
      writeSync(fd, text);
    } finally {
      closeSync(fd);
    }
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EEXIST") throw new ToolError(`file already exists, choose another name: ${path}`);
    throw new ToolError(`cannot write ${path}: ${(err as Error).message}`);
  }
  return { path, bytes: Buffer.byteLength(text) };
}

/** Reads and parses a JSON file. */
export function loadJson(input: string, exportDir: string): { path: string; data: unknown; bytes: number } {
  const path = resolveJsonPath(input, exportDir);
  let bytes: number;
  try {
    bytes = statSync(path).size;
  } catch {
    throw new ToolError(`file not found: ${path}`);
  }
  if (bytes > MAX_BODY_FILE_BYTES) throw new ToolError(`file too large (${bytes} bytes, max ${MAX_BODY_FILE_BYTES}): ${path}`);
  try {
    return { path, data: JSON.parse(readFileSync(path, "utf8")), bytes };
  } catch (err) {
    throw new ToolError(`not valid JSON: ${path}: ${(err as Error).message.slice(0, 200)}`);
  }
}

/**
 * A short picture of a large body for dry-runs: top-level scalars, sizes of arrays and objects.
 * E.g. a flow: { name, flowType, nodes: "[42 items]", ... }.
 */
export function outline(data: unknown, maxKeys = 30): unknown {
  if (Array.isArray(data)) return `[${data.length} items]`;
  if (typeof data !== "object" || data === null) return data;
  const out: Record<string, unknown> = {};
  const entries = Object.entries(data);
  for (const [k, v] of entries.slice(0, maxKeys)) {
    if (Array.isArray(v)) out[k] = `[${v.length} items]`;
    else if (typeof v === "object" && v !== null) out[k] = `{${Object.keys(v).length} fields}`;
    else if (typeof v === "string" && v.length > 120) out[k] = `${v.slice(0, 117)}…`;
    else out[k] = v;
  }
  if (entries.length > maxKeys) out["…"] = `${entries.length - maxKeys} more fields`;
  return out;
}
