/**
 * The only module that talks to the Webex Contact Center REST API.
 *
 * Paths are registry templates such as `/organization/{orgid}/v2/team/{id}` (Configuration) or
 * `/{orgid}/project/<projectId>/flows/{id}` (Flows); both are served by the same regional gateway.
 * The client fills in `{orgid}` from config and every other placeholder from `pathParams`, then
 * maps API errors to short, actionable messages. The token is only ever placed in the
 * Authorization header.
 */
import type { TokenProvider } from "./auth.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type QueryValue = string | number | boolean | string[] | undefined | null;

export interface RequestOptions {
  method: HttpMethod;
  /** Path template starting with /organization/{orgid} or /{orgid}/. */
  path: string;
  pathParams?: Record<string, string>;
  query?: Record<string, QueryValue>;
  /** JSON request body. Mutually exclusive with `form`. */
  json?: unknown;
  /** multipart/form-data request body (audio uploads). Mutually exclusive with `json`. */
  form?: FormData;
}

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  trackingId?: string;
}

export interface EntityRef {
  id?: string;
  name?: string;
  entity?: string;
}

export class WxccApiError extends Error {
  readonly status: number;
  readonly trackingId?: string;
  readonly key?: string;
  readonly references: EntityRef[];
  readonly retryAfterSeconds?: number;

  constructor(
    message: string,
    details: {
      status: number;
      trackingId?: string;
      key?: string;
      references?: EntityRef[];
      retryAfterSeconds?: number;
    },
  ) {
    super(message);
    this.name = "WxccApiError";
    this.status = details.status;
    this.trackingId = details.trackingId;
    this.key = details.key;
    this.references = details.references ?? [];
    this.retryAfterSeconds = details.retryAfterSeconds;
  }
}

/** Raised for network failures, timeouts and invalid requests built by the caller. */
export class WxccClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WxccClientError";
  }
}

export interface ClientOptions {
  baseUrl: string;
  orgId: string;
  tokenProvider: TokenProvider;
  timeoutMs?: number;
  /** Injectable for tests. */
  fetch?: typeof fetch;
}

const ACCEPT = "application/json, */*;q=0.8";
const MAX_REFS_IN_MESSAGE = 10;

export class WxccClient {
  readonly #baseUrl: string;
  readonly #orgId: string;
  readonly #tokens: TokenProvider;
  readonly #timeoutMs: number;
  readonly #fetch: typeof fetch;

  constructor(opts: ClientOptions) {
    this.#baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.#orgId = opts.orgId;
    this.#tokens = opts.tokenProvider;
    this.#timeoutMs = opts.timeoutMs ?? 30_000;
    this.#fetch = opts.fetch ?? globalThis.fetch;
  }

  get orgId(): string {
    return this.#orgId;
  }

  /** Builds the full request URL for a path template. */
  buildUrl(path: string, pathParams: Record<string, string> = {}, query: Record<string, QueryValue> = {}): string {
    if (!path.startsWith("/organization/{orgid}") && !path.startsWith("/{orgid}/")) {
      throw new WxccClientError(`path must start with /organization/{orgid} or /{orgid}/: ${path}`);
    }
    const filled = path.replace(/\{([^}]+)\}/g, (_, name: string) => {
      if (name === "orgid") return encodeURIComponent(this.#orgId);
      const value = pathParams[name];
      if (value === undefined || value === "") {
        throw new WxccClientError(`missing path parameter: ${name}`);
      }
      return encodeURIComponent(value);
    });
    const url = new URL(this.#baseUrl + filled);
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) for (const v of value) url.searchParams.append(key, v);
      else url.searchParams.set(key, String(value));
    }
    return url.toString();
  }

  async request<T = unknown>(opts: RequestOptions): Promise<ApiResponse<T>> {
    if (opts.json !== undefined && opts.form !== undefined) {
      throw new WxccClientError("request cannot have both a JSON and a multipart body");
    }
    const url = this.buildUrl(opts.path, opts.pathParams, opts.query);
    const label = `${opts.method} ${new URL(url).pathname}`;
    const token = await this.#tokens.getToken();

    const headers: Record<string, string> = { Authorization: `Bearer ${token}`, Accept: ACCEPT };
    let body: string | FormData | undefined;
    if (opts.json !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(opts.json);
    } else if (opts.form !== undefined) {
      body = opts.form; // fetch sets the multipart boundary
    }

    let res: Response;
    try {
      res = await this.#fetch(url, {
        method: opts.method,
        headers,
        body,
        signal: AbortSignal.timeout(this.#timeoutMs),
      });
    } catch (err) {
      throw new WxccClientError(redact(describeNetworkError(err, label, this.#timeoutMs), token));
    }

    const data = await readBody(res);
    const headerTrackingId = res.headers.get("trackingid") ?? undefined;
    if (!res.ok) throw toApiError(res, data, label, headerTrackingId, token);

    return { status: res.status, data: data as T, trackingId: headerTrackingId };
  }
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Documented error shape. Fields are treated as untrusted: the live API sends `key` as a number. */
interface ApiErrorBody {
  trackingId?: unknown;
  error?: {
    key?: unknown;
    reason?: unknown;
    message?: Array<{ description?: unknown; entity?: unknown; references?: Array<Record<string, unknown>> }>;
  };
}

function toApiError(
  res: Response,
  data: unknown,
  label: string,
  headerTrackingId: string | undefined,
  token: string,
): WxccApiError {
  const body: ApiErrorBody = isObject(data) ? (data as ApiErrorBody) : {};
  const trackingId = redactOpt(body.trackingId, token) ?? headerTrackingId;
  const messages = Array.isArray(body.error?.message) ? body.error.message.filter(isObject) : [];
  const descriptions = messages.map((m) => str(m.description)).filter((d): d is string => !!d);
  const references = messages.flatMap((m) =>
    (Array.isArray(m.references) ? m.references.filter(isObject) : []).map((r) => ({
      id: redactOpt(r.id, token),
      name: redactOpt(r.name, token),
      entity: redactOpt(r.entity ?? m.entity, token),
    })),
  );
  const desc =
    descriptions.join("; ") ||
    str(body.error?.reason) ||
    (typeof data === "string" ? truncate(data.trim(), 300) : "");
  const retryAfterSeconds = res.status === 429 ? parseRetryAfter(res.headers.get("retry-after")) : undefined;

  let message: string;
  switch (res.status) {
    case 400:
      message = `bad request: ${desc || label}`;
      break;
    case 401:
      message = "token expired: refresh WEBEX_TOKEN";
      break;
    case 403:
      message = `forbidden: ${desc || "the token lacks permission (needs cjp:config_read / cjp:config_write)"}`;
      break;
    case 404:
      // The API often just echoes "Not Found"; naming the request is more useful.
      message = `not found: ${desc && !/^not found\.?$/i.test(desc) ? desc : label}`;
      // A wrong region is the usual cause: each org lives in one regional API.
      if (/no organization was found/i.test(desc)) message += " (check region / base_url: the org may be in another region)";
      break;
    case 409:
      message = `duplicate: ${desc || "a similar entity already exists"}`;
      break;
    case 412:
      message = `in use by other entities: ${formatRefs(references) || desc || "check incoming references"}`;
      break;
    case 429:
      message =
        retryAfterSeconds !== undefined
          ? `rate limited: retry after ${retryAfterSeconds}s`
          : "rate limited: retry later";
      break;
    default:
      message =
        res.status >= 500
          ? `WxCC server error ${res.status}: ${desc || label}`
          : `request failed (${res.status}): ${desc || label}`;
  }
  if (trackingId && res.status !== 401) message += ` (trackingId: ${trackingId})`;

  return new WxccApiError(redact(message, token), {
    status: res.status,
    trackingId,
    key: redactOpt(body.error?.key, token),
    references,
    retryAfterSeconds,
  });
}

function formatRefs(refs: EntityRef[]): string {
  if (!refs.length) return "";
  const shown = refs.slice(0, MAX_REFS_IN_MESSAGE).map((r) => {
    const name = r.name ?? r.id ?? "?";
    const kind = r.entity ? `${r.entity} ` : "";
    return r.id && r.name ? `${kind}${r.name} (${r.id})` : `${kind}${name}`;
  });
  const more = refs.length > MAX_REFS_IN_MESSAGE ? ` and ${refs.length - MAX_REFS_IN_MESSAGE} more` : "";
  return shown.join(", ") + more;
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

function describeNetworkError(err: unknown, label: string, timeoutMs: number): string {
  if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
    return `request timed out after ${timeoutMs}ms: ${label}`;
  }
  const cause = err instanceof Error ? (err.cause as { code?: string; message?: string } | undefined) : undefined;
  const detail = cause?.code ?? cause?.message ?? (err instanceof Error ? err.message : String(err));
  return `network error calling WxCC (${detail}): ${label}`;
}

/** Defensive: strips the token from any message even if an upstream echoed it back. */
function redact(message: string, token: string): string {
  return token ? message.split(token).join("[redacted]") : message;
}

function redactOpt(value: unknown, token: string): string | undefined {
  const s = str(value);
  return s === undefined ? undefined : redact(s, token);
}

/** Accepts strings and numbers from untrusted bodies; anything else is dropped. */
function str(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
