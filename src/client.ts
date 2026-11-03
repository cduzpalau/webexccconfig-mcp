/**
 * The only module that talks to the Webex Contact Center and Webex REST APIs.
 *
 * Paths are registry templates such as `/organization/{orgid}/v2/team/{id}` (Configuration) or
 * `/{orgid}/project/<projectId>/flows/{id}` (Flows), both served by the regional WxCC gateway, or
 * `/v1/people/{id}` (Webex API, served by webexapis.com in every region). The prefix picks the host.
 * The client fills in `{orgid}` from config and every other placeholder from `pathParams`, then
 * maps API errors to short, actionable messages. The token is only ever placed in the
 * Authorization header.
 */
import type { TokenProvider } from "./auth.js";
import { DEFAULT_WEBEX_BASE_URL } from "./config.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type QueryValue = string | number | boolean | string[] | undefined | null;

export interface RequestOptions {
  method: HttpMethod;
  /** Path template starting with /organization/{orgid}, /{orgid}/ (WxCC) or /v1/ (Webex). */
  path: string;
  pathParams?: Record<string, string>;
  query?: Record<string, QueryValue>;
  /** JSON request body. Mutually exclusive with `form`. */
  json?: unknown;
  /** multipart/form-data request body (audio uploads). Mutually exclusive with `json`. */
  form?: FormData;
  /** Raises the client's timeout for this request (slow operations such as flow deletes). */
  timeoutMs?: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  trackingId?: string;
  /** Webex lists: the cursor of the next page, from the Link: <…>; rel="next" header. */
  nextCursor?: string;
}

/** Webex API paths (webexapis.com) start with /v1/; everything else goes to the WxCC gateway. */
export function isWebexPath(path: string): boolean {
  return path.startsWith("/v1/");
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
  /** Entity types that refer to the record (412), e.g. ["skill-profile"]. */
  readonly referencedEntities: string[];
  readonly retryAfterSeconds?: number;

  constructor(
    message: string,
    details: {
      status: number;
      trackingId?: string;
      key?: string;
      references?: EntityRef[];
      referencedEntities?: string[];
      retryAfterSeconds?: number;
    },
  ) {
    super(message);
    this.name = "WxccApiError";
    this.status = details.status;
    this.trackingId = details.trackingId;
    this.key = details.key;
    this.references = details.references ?? [];
    this.referencedEntities = details.referencedEntities ?? [];
    this.retryAfterSeconds = details.retryAfterSeconds;
  }
}

/** Raised for network failures, timeouts and invalid requests built by the caller. */
export class WxccClientError extends Error {
  /** The request was sent but no response arrived in time: a write may still have happened. */
  readonly timedOut: boolean;

  constructor(message: string, timedOut = false) {
    super(message);
    this.name = "WxccClientError";
    this.timedOut = timedOut;
  }
}

export interface ClientOptions {
  baseUrl: string;
  /** Host for /v1/ paths; defaults to https://webexapis.com. */
  webexBaseUrl?: string;
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
  readonly #webexBaseUrl: string;
  readonly #orgId: string;
  readonly #tokens: TokenProvider;
  readonly #timeoutMs: number;
  readonly #fetch: typeof fetch;

  constructor(opts: ClientOptions) {
    this.#baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.#webexBaseUrl = (opts.webexBaseUrl ?? DEFAULT_WEBEX_BASE_URL).replace(/\/+$/, "");
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
    const webex = isWebexPath(path);
    if (!webex && !path.startsWith("/organization/{orgid}") && !path.startsWith("/{orgid}/")) {
      throw new WxccClientError(`path must start with /organization/{orgid}, /{orgid}/ or /v1/: ${path}`);
    }
    const filled = path.replace(/\{([^}]+)\}/g, (_, name: string) => {
      if (name === "orgid") return encodeURIComponent(this.#orgId);
      const value = pathParams[name];
      if (value === undefined || value === "") {
        throw new WxccClientError(`missing path parameter: ${name}`);
      }
      return encodeURIComponent(value);
    });
    const url = new URL((webex ? this.#webexBaseUrl : this.#baseUrl) + filled);
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
    const api = isWebexPath(opts.path) ? "Webex" : "WxCC";
    const token = await this.#tokens.getToken();

    const headers: Record<string, string> = { Authorization: `Bearer ${token}`, Accept: ACCEPT };
    let body: string | FormData | undefined;
    if (opts.json !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(opts.json);
    } else if (opts.form !== undefined) {
      body = opts.form; // fetch sets the multipart boundary
    }

    const timeoutMs = Math.max(this.#timeoutMs, opts.timeoutMs ?? 0);
    let res: Response;
    try {
      res = await this.#fetch(url, {
        method: opts.method,
        headers,
        body,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      throw new WxccClientError(redact(describeNetworkError(err, label, timeoutMs, api), token), isTimeout(err));
    }

    const data = await readBody(res);
    const headerTrackingId = res.headers.get("trackingid") ?? undefined;
    if (!res.ok) throw toApiError(res, data, label, headerTrackingId, token, api);

    const nextCursor = nextCursorOf(res.headers.get("link"));
    return { status: res.status, data: data as T, trackingId: headerTrackingId, ...(nextCursor ? { nextCursor } : {}) };
  }
}

/** The `cursor` query value of the rel="next" link, if any. */
export function nextCursorOf(link: string | null): string | undefined {
  if (!link) return undefined;
  for (const part of link.split(",")) {
    const m = /<([^>]+)>\s*;\s*rel="?next"?/i.exec(part);
    if (!m) continue;
    try {
      return new URL(m[1]!).searchParams.get("cursor") ?? undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
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

/**
 * Error shapes. Fields are treated as untrusted: the live API sends `key` as a number.
 * Configuration API: { trackingId, error: { key, reason, message[], referencedEntities? } }.
 * Flows API: { errorCode, errorMessage, dependentFlows[], dependentSubflows[], dependentEPsAndRSs[],
 * dependentRcs[] } (a 412 on delete lists what still uses the flow).
 * Webex API: { message, errors: [{ description }], trackingId }.
 */
interface ApiErrorBody {
  trackingId?: unknown;
  message?: unknown;
  errors?: unknown;
  error?: {
    key?: unknown;
    reason?: unknown;
    message?: Array<{ description?: unknown; entity?: unknown; references?: Array<Record<string, unknown>> }>;
    referencedEntities?: unknown;
  };
  errorMessage?: unknown;
}

/** Flow delete 412: dependents by field, with the entity type shown for each. */
const FLOW_DEPENDENTS: Record<string, string> = {
  dependentFlows: "flow",
  dependentSubflows: "subflow",
  dependentEPsAndRSs: "entry point / routing strategy",
  dependentRcs: "entry point",
};

function flowDependents(body: Record<string, unknown>, token: string): EntityRef[] {
  return Object.entries(FLOW_DEPENDENTS).flatMap(([field, entity]) => {
    const list = body[field];
    if (!Array.isArray(list)) return [];
    return list.flatMap((d): EntityRef[] => {
      if (typeof d === "string") return [{ name: redact(d, token), entity }];
      if (!isObject(d)) return [];
      return [{ id: redactOpt(d.id, token), name: redactOpt(d.name, token), entity }];
    });
  });
}

function toApiError(
  res: Response,
  data: unknown,
  label: string,
  headerTrackingId: string | undefined,
  token: string,
  api: "WxCC" | "Webex" = "WxCC",
): WxccApiError {
  const body: ApiErrorBody = isObject(data) ? (data as ApiErrorBody) : {};
  const trackingId = redactOpt(body.trackingId, token) ?? headerTrackingId;
  const messages = Array.isArray(body.error?.message) ? body.error.message.filter(isObject) : [];
  const webexErrors = Array.isArray(body.errors) ? body.errors.filter(isObject) : [];
  const descriptions = [
    ...new Set(
      [...messages, ...webexErrors].map((m) => str(m.description)).filter((d): d is string => !!d),
    ),
  ];
  if (!descriptions.length && str(body.message)) descriptions.push(str(body.message)!);
  const references = [
    ...messages.flatMap((m) =>
      (Array.isArray(m.references) ? m.references.filter(isObject) : []).map((r) => ({
        id: redactOpt(r.id, token),
        name: redactOpt(r.name, token),
        entity: redactOpt(r.entity ?? m.entity, token),
      })),
    ),
    ...(isObject(data) ? flowDependents(data, token) : []),
  ];
  const referencedEntities = (Array.isArray(body.error?.referencedEntities) ? body.error.referencedEntities : [])
    .map((e) => redactOpt(e, token))
    .filter((e): e is string => !!e);
  const desc =
    descriptions.join("; ") ||
    str(body.error?.reason) ||
    (references.length ? "" : truncate(str(body.errorMessage) ?? "", 300)) ||
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
      message = `forbidden: ${
        desc ||
        (api === "Webex"
          ? "the token lacks permission (needs a Webex admin with spark-admin:people_read / people_write)"
          : "the token lacks permission (needs cjp:config_read / cjp:config_write)")
      }`;
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
    case 412: {
      const kinds = referencedEntities.length ? ` (${referencedEntities.join(", ")})` : "";
      message = `in use by other entities${kinds}: ${formatRefs(references) || desc || "check incoming references"}`;
      break;
    }
    case 429:
      message =
        retryAfterSeconds !== undefined
          ? `rate limited: retry after ${retryAfterSeconds}s`
          : "rate limited: retry later";
      break;
    default:
      message =
        res.status >= 500
          ? `${api} server error ${res.status}: ${desc || label}`
          : `request failed (${res.status}): ${desc || label}`;
  }
  if (trackingId && res.status !== 401) message += ` (trackingId: ${trackingId})`;

  return new WxccApiError(redact(message, token), {
    status: res.status,
    trackingId,
    key: redactOpt(body.error?.key, token),
    references,
    referencedEntities,
    retryAfterSeconds,
  });
}

export function formatRefs(refs: EntityRef[]): string {
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

function isTimeout(err: unknown): boolean {
  return err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
}

function describeNetworkError(err: unknown, label: string, timeoutMs: number, api: string): string {
  if (isTimeout(err)) {
    return `request timed out after ${timeoutMs}ms: ${label}`;
  }
  const cause = err instanceof Error ? (err.cause as { code?: string; message?: string } | undefined) : undefined;
  const detail = cause?.code ?? cause?.message ?? (err instanceof Error ? err.message : String(err));
  return `network error calling ${api} (${detail}): ${label}`;
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
