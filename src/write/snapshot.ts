/**
 * Before-snapshots of records changed by applied writes, for manual rollback:
 * <dir>/<resource>/<id>/<timestamp>.json. No automatic cleanup.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export class SnapshotStore {
  readonly #dir: string;
  readonly #now: () => Date;

  constructor(dir: string, now: () => Date = () => new Date()) {
    this.#dir = dir;
    this.#now = now;
  }

  /** Writes the snapshot and returns its path; throws if it cannot be written. */
  save(resource: string, id: string, data: unknown): string {
    const dir = join(this.#dir, safe(resource), safe(id));
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const file = join(dir, `${this.#now().toISOString().replace(/:/g, "-")}.json`);
    writeFileSync(file, JSON.stringify(data, null, 2) + "\n", { mode: 0o600, flag: "wx" });
    return file;
  }
}

function safe(segment: string): string {
  const s = segment.replace(/[^A-Za-z0-9._-]/g, "_");
  return s === "." || s === ".." || !s ? "_" : s;
}
