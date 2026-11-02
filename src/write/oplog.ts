/**
 * Operation log: one JSON object per line in daily files (wxcc-ext-YYYY-MM-DD.log), covering every
 * tool call the server handles, so the files stay searchable with grep and jq.
 *
 * Entries never contain the token or audio bytes: callers pass only the fields below.
 */
import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export type LogPhase = "local" | "read" | "dry-run" | "apply";

export interface OpLogEntry {
  tool: string;
  phase: LogPhase;
  resource?: string;
  id?: string;
  /** Operation kind or view/action name, e.g. "list", "view:acl". */
  op?: string;
  method?: string;
  /** Request path without the host, e.g. /organization/<org>/v2/team. */
  path?: string;
  status: "ok" | "error";
  httpStatus?: number;
  trackingId?: string;
  durationMs?: number;
  error?: string;
  changedFields?: string[];
  snapshot?: string;
  /** Local JSON file written (saveTo) or read (bodyFile). */
  file?: string;
}

export interface OperationLogOptions {
  dir: string;
  now?: () => Date;
  /** Called once if the log cannot be written; defaults to a stderr warning. */
  onError?: (err: Error) => void;
}

export class OperationLog {
  readonly #dir: string;
  readonly #now: () => Date;
  readonly #onError: (err: Error) => void;
  #warned = false;
  #dirReady = false;

  constructor(opts: OperationLogOptions) {
    this.#dir = opts.dir;
    this.#now = opts.now ?? (() => new Date());
    this.#onError =
      opts.onError ?? ((err) => console.error(`webexccconfig-mcp: cannot write operation log in ${this.#dir}: ${err.message}`));
  }

  /** Path of the log file for a given date. */
  fileFor(date: Date): string {
    return join(this.#dir, `wxcc-ext-${date.toISOString().slice(0, 10)}.log`);
  }

  /** True if the log directory and today's file can be written; writes are refused otherwise. */
  writable(): boolean {
    try {
      mkdirSync(this.#dir, { recursive: true, mode: 0o700 });
      this.#dirReady = true;
      appendFileSync(this.fileFor(this.#now()), "", { mode: 0o600 });
      return true;
    } catch {
      return false;
    }
  }

  /** Appends one entry. Returns false (after reporting once) if the log could not be written. */
  record(entry: OpLogEntry): boolean {
    const now = this.#now();
    const line = JSON.stringify({ ts: now.toISOString(), ...entry }) + "\n";
    try {
      if (!this.#dirReady) {
        mkdirSync(this.#dir, { recursive: true, mode: 0o700 });
        this.#dirReady = true;
      }
      appendFileSync(this.fileFor(now), line, { mode: 0o600 });
      return true;
    } catch (err) {
      if (!this.#warned) {
        this.#warned = true;
        this.#onError(err as Error);
      }
      return false;
    }
  }
}
