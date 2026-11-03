/**
 * Before-snapshots of records changed by applied writes, for manual rollback:
 * <dir>/<resource>/<id>/<timestamp>.json. No automatic cleanup.
 *
 * Writes are asynchronous so a bulk delete fanning out over many records does not block the event
 * loop while large records (flows) are written.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export class SnapshotStore {
  readonly #dir: string;
  readonly #now: () => Date;

  constructor(dir: string, now: () => Date = () => new Date()) {
    this.#dir = dir;
    this.#now = now;
  }

  /**
   * Writes the snapshot and returns its path; rejects if it cannot be written. Never overwrites:
   * a second snapshot of the same record in the same millisecond gets a -1, -2, ... suffix.
   */
  async save(resource: string, id: string, data: unknown): Promise<string> {
    const dir = join(this.#dir, safe(resource), safe(id));
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const stamp = this.#now().toISOString().replace(/:/g, "-");
    const text = JSON.stringify(data, null, 2) + "\n";
    for (let n = 0; n < 100; n++) {
      const file = join(dir, `${stamp}${n ? `-${n}` : ""}.json`);
      try {
        await writeFile(file, text, { mode: 0o600, flag: "wx" });
        return file;
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
      }
    }
    throw new Error(`too many snapshots of ${resource}/${id} at ${stamp}`);
  }
}

function safe(segment: string): string {
  const s = segment.replace(/[^A-Za-z0-9._-]/g, "_");
  return s === "." || s === ".." || !s ? "_" : s;
}
