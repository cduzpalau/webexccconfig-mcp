/**
 * Merge and diff for the write pipeline. Objects merge recursively; arrays and scalars in the
 * change replace the current value (so a list is always sent in full).
 */

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function deepMerge(base: unknown, change: unknown): unknown {
  if (change === undefined) return base;
  if (isPlainObject(base) && isPlainObject(change)) {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(change)) out[k] = k in base ? deepMerge(base[k], v) : v;
    return out;
  }
  return change;
}

export function omit(obj: Record<string, unknown>, fields: Iterable<string>): Record<string, unknown> {
  const drop = new Set(fields);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !drop.has(k)));
}

export interface Change {
  path: string;
  before?: unknown;
  after?: unknown;
}

/** Field-level differences between two JSON values, as dotted paths ("queueRankings[0].rank"). */
export function diff(before: unknown, after: unknown, path = ""): Change[] {
  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = [...Object.keys(after), ...Object.keys(before).filter((k) => !(k in after))];
    return keys.flatMap((k) => diff(before[k], after[k], path ? `${path}.${k}` : k));
  }
  if (Array.isArray(before) && Array.isArray(after) && before.length === after.length) {
    if (before.every(isPlainObject) && after.every(isPlainObject)) {
      return after.flatMap((v, i) => diff(before[i], v, `${path}[${i}]`));
    }
  }
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  return [{ path: path || "(record)", ...(before !== undefined ? { before } : {}), ...(after !== undefined ? { after } : {}) }];
}

/** Top-level field names touched by a set of changes, for the operation log. */
export function changedFields(changes: Change[]): string[] {
  return [...new Set(changes.map((c) => c.path.split(/[.[]/)[0]!))];
}

/** Shortens long values so a dry-run stays readable. */
export function presentChanges(changes: Change[], max = 50): Array<Change | { more: number }> {
  const clip = (v: unknown): unknown => {
    if (v === undefined) return undefined;
    const s = JSON.stringify(v);
    return s.length > 200 ? `${s.slice(0, 199)}…` : v;
  };
  const shown = changes.slice(0, max).map((c) => ({
    path: c.path,
    ...("before" in c ? { before: clip(c.before) } : {}),
    ...("after" in c ? { after: clip(c.after) } : {}),
  }));
  return changes.length > max ? [...shown, { more: changes.length - max }] : shown;
}
