/**
 * Dry-run confirmation. A dry-run returns a hash of the exact request it would send plus the
 * version of the record it was computed from. Applying rebuilds the plan from a fresh read and
 * only proceeds if the hash still matches, so a stale version or changed arguments are rejected.
 */
import { createHash } from "node:crypto";

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/**
 * Like stableStringify, but arrays are also put in a fixed order (by each element's canonical
 * string). WxCC returns some arrays (activeSkills, loginVoiceOptions, ...) in a different order on
 * every read, so an order-sensitive hash would never match between dry-run and apply.
 */
export function canonicalString(value: unknown): string {
  if (Array.isArray(value)) {
    const items = value.map(canonicalString).sort();
    return `[${items.join(",")}]`;
  }
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalString(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** Order-insensitive for object keys and array elements: see canonicalString. */
export function planHash(plan: unknown): string {
  return createHash("sha256").update(canonicalString(plan)).digest("hex").slice(0, 16);
}

/** Identifies the state a plan was computed from: the record's version, else its content. */
export function fingerprint(record: unknown): string | undefined {
  if (record === undefined) return undefined;
  if (typeof record === "object" && record !== null) {
    const r = record as Record<string, unknown>;
    if (typeof r.version === "number") return `v${r.version}`;
    // lastUpdatedTime has one-second resolution: two changes in the same second share it, so the
    // content hash is added to catch them.
    if (typeof r.lastUpdatedTime === "number") return `t${r.lastUpdatedTime}-${planHash(record).slice(0, 8)}`;
  }
  return `h${planHash(record)}`;
}

interface Pending {
  target: string;
  base?: string;
  expires: number;
}

/** Remembers recent dry-runs so an apply against a changed record gets a precise "stale" message. */
export class PendingPlans {
  readonly #plans = new Map<string, Pending>();
  readonly #ttlMs: number;
  readonly #now: () => number;

  constructor(ttlMs = 60 * 60 * 1000, now: () => number = Date.now) {
    this.#ttlMs = ttlMs;
    this.#now = now;
  }

  remember(hash: string, target: string, base: string | undefined): void {
    const now = this.#now();
    for (const [h, p] of this.#plans) if (p.expires < now) this.#plans.delete(h);
    this.#plans.set(hash, { target, base, expires: now + this.#ttlMs });
  }

  get(hash: string): Pending | undefined {
    const p = this.#plans.get(hash);
    return p && p.expires >= this.#now() ? p : undefined;
  }

  forget(hash: string): void {
    this.#plans.delete(hash);
  }
}
