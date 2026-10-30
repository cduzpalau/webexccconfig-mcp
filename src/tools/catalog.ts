/**
 * Runtime view of the generated registry for one config: resolves resource names and aliases,
 * and applies `defer_to_official` and `toolsets`. Deferred and disabled resources are invisible
 * in listings and refused by every tool.
 */
import type { AppConfig, Toolset } from "../config.js";
import { ToolError } from "../errors.js";
import type { RegistryEntry, RegistryOperation } from "../registry-types.js";

export { ToolError };

export function normaliseName(name: string): string {
  return name.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

export class Catalog {
  readonly #byName = new Map<string, RegistryEntry>();
  readonly #entries: readonly RegistryEntry[];
  readonly #deferred = new Set<string>();
  readonly #toolsets: Set<Toolset>;

  constructor(entries: readonly RegistryEntry[], config: Pick<AppConfig, "deferToOfficial" | "toolsets">) {
    this.#entries = entries;
    this.#toolsets = new Set(config.toolsets);
    const deferNames = new Set(config.deferToOfficial.map(normaliseName));
    for (const e of entries) {
      for (const n of [e.key, ...e.aliases]) this.#byName.set(normaliseName(n), e);
      if ([e.key, ...e.aliases].some((n) => deferNames.has(normaliseName(n)))) this.#deferred.add(e.key);
    }
  }

  /** Resources usable with this config. */
  visible(): RegistryEntry[] {
    return this.#entries.filter((e) => this.#isVisible(e));
  }

  /** Resolves a key or alias, refusing deferred or disabled resources with a short reason. */
  resolve(name: string): RegistryEntry {
    const n = normaliseName(name);
    const entry = this.#byName.get(n) ?? this.#byName.get(n.replace(/s$/, ""));
    if (!entry) {
      const hint = this.#suggest(n);
      throw new ToolError(
        `unknown resource "${name}"${hint ? `; did you mean ${hint}?` : ""} (see wxcc-ext-list-resource-types)`,
      );
    }
    if (this.#deferred.has(entry.key)) {
      throw new ToolError(`${entry.key} is deferred by config (defer_to_official): not available in this server`);
    }
    if (!this.#toolsets.has(entry.toolset)) {
      throw new ToolError(`${entry.key} is in toolset "${entry.toolset}", which is disabled in config (toolsets)`);
    }
    return entry;
  }

  #isVisible(e: RegistryEntry): boolean {
    return !this.#deferred.has(e.key) && this.#toolsets.has(e.toolset);
  }

  #suggest(n: string): string | undefined {
    const candidates = this.visible().filter(
      (e) => e.key.includes(n) || n.includes(e.key) || e.aliases.some((a) => a.includes(n) || n.includes(a)),
    );
    return candidates.length ? candidates.slice(0, 3).map((e) => e.key).join(", ") : undefined;
  }
}

/** Finds a standard op (e.g. "list") or a named view/action. */
export function findOp(entry: RegistryEntry, kind: RegistryOperation["kind"], name?: string): RegistryOperation | undefined {
  return entry.operations.find((o) => o.kind === kind && o.name === name);
}

export function viewNames(entry: RegistryEntry): string[] {
  const names = entry.operations.filter((o) => o.kind === "view").map((o) => o.name!);
  return findOp(entry, "references") ? ["references", ...names] : names;
}

export function actionNames(entry: RegistryEntry): string[] {
  return entry.operations.filter((o) => o.kind === "action").map((o) => o.name!);
}
