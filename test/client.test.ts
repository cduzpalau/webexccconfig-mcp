import { describe, expect, it, vi } from "vitest";
import { StaticTokenProvider } from "../src/auth.js";
import { WxccApiError, WxccClient, WxccClientError } from "../src/client.js";

const BASE = "https://api.wxcc-us1.cisco.com";
const ORG = "org-123";
const TOKEN = "fake-token-abc123";

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function makeClient(fetchImpl: (url: string, init: RequestInit) => Promise<Response>) {
  const fetchMock = vi.fn(fetchImpl);
  const client = new WxccClient({
    baseUrl: BASE,
    orgId: ORG,
    tokenProvider: new StaticTokenProvider(TOKEN),
    fetch: fetchMock as unknown as typeof fetch,
  });
  return { client, fetchMock };
}

const apiError = (description: string, extra: Record<string, unknown> = {}) => ({
  trackingId: "ccconfig_abc",
  error: { key: "4xx", reason: "reason text", message: [{ description, ...extra }] },
});

describe("buildUrl", () => {
  const { client } = makeClient(async () => jsonResponse(200, {}));

  it("fills {orgid} for unversioned (v1) paths", () => {
    expect(client.buildUrl("/organization/{orgid}/skill/{id}", { id: "s1" })).toBe(
      `${BASE}/organization/${ORG}/skill/s1`,
    );
  });

  it("keeps v2 and v3 version segments after the org id", () => {
    expect(client.buildUrl("/organization/{orgid}/v2/team")).toBe(`${BASE}/organization/${ORG}/v2/team`);
    expect(client.buildUrl("/organization/{orgid}/v3/address-book/{id}", { id: "ab" })).toBe(
      `${BASE}/organization/${ORG}/v3/address-book/ab`,
    );
  });

  it("handles the CSQ bulk path with the version after the resource", () => {
    expect(client.buildUrl("/organization/{orgid}/contact-service-queue/v2/bulk")).toBe(
      `${BASE}/organization/${ORG}/contact-service-queue/v2/bulk`,
    );
  });

  it("fills parent ids for child resources", () => {
    expect(
      client.buildUrl("/organization/{orgid}/address-book/{addressBookId}/entry/{id}", {
        addressBookId: "ab1",
        id: "e1",
      }),
    ).toBe(`${BASE}/organization/${ORG}/address-book/ab1/entry/e1`);
  });

  it("encodes path params so they cannot add segments", () => {
    expect(client.buildUrl("/organization/{orgid}/team/{id}", { id: "../x y" })).toBe(
      `${BASE}/organization/${ORG}/team/..%2Fx%20y`,
    );
  });

  it("encodes query params and skips undefined/null", () => {
    const url = new URL(
      client.buildUrl("/organization/{orgid}/v2/team", {}, {
        filter: 'id=in=("a","b")',
        page: 0,
        pageSize: 50,
        singleObjectResponse: false,
        search: undefined,
        attributes: null,
      }),
    );
    expect(url.searchParams.get("filter")).toBe('id=in=("a","b")');
    expect(url.searchParams.get("page")).toBe("0");
    expect(url.searchParams.get("singleObjectResponse")).toBe("false");
    expect(url.searchParams.has("search")).toBe(false);
    expect(url.searchParams.has("attributes")).toBe(false);
  });

  it("rejects missing path params and foreign paths", () => {
    expect(() => client.buildUrl("/organization/{orgid}/team/{id}")).toThrow(/missing path parameter: id/);
    expect(() => client.buildUrl("/organization/{orgid}/team/{id}", { id: "" })).toThrow(WxccClientError);
    expect(() => client.buildUrl("/v1/people/me")).toThrow(/must start with/);
  });
});

describe("request", () => {
  it("sends the bearer token, Accept and a JSON body", async () => {
    const { client, fetchMock } = makeClient(async () => jsonResponse(201, { id: "t1" }, { trackingid: "trk-1" }));
    const res = await client.request({
      method: "POST",
      path: "/organization/{orgid}/team",
      json: { name: "Billing" },
    });
    expect(res).toEqual({ status: 201, data: { id: "t1" }, trackingId: "trk-1" });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`${BASE}/organization/${ORG}/team`);
    const headers = init.headers as Record<string, string>;
    expect(init.method).toBe("POST");
    expect(headers.Authorization).toBe(`Bearer ${TOKEN}`);
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Accept).toContain("application/json");
    expect(init.body).toBe(JSON.stringify({ name: "Billing" }));
  });

  it("sends multipart bodies without forcing a Content-Type", async () => {
    const { client, fetchMock } = makeClient(async () => jsonResponse(200, { id: "a1" }));
    const form = new FormData();
    form.append("audioFile", new Blob([new Uint8Array([1, 2, 3])], { type: "audio/wav" }), "x.wav");
    await client.request({ method: "POST", path: "/organization/{orgid}/audio-file", form });
    const init = fetchMock.mock.calls[0]![1];
    expect(init.body).toBe(form);
    expect((init.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
  });

  it("rejects requests with both JSON and multipart bodies", async () => {
    const { client } = makeClient(async () => jsonResponse(200, {}));
    await expect(
      client.request({ method: "POST", path: "/organization/{orgid}/team", json: {}, form: new FormData() }),
    ).rejects.toThrow(/both/);
  });

  it("returns undefined data for 204 and text for non-JSON bodies", async () => {
    const { client: c1 } = makeClient(async () => new Response(null, { status: 204 }));
    expect((await c1.request({ method: "DELETE", path: "/organization/{orgid}/team/{id}", pathParams: { id: "t" } })).data).toBeUndefined();
    const { client: c2 } = makeClient(async () => new Response("plain", { status: 200 }));
    expect((await c2.request({ method: "GET", path: "/organization/{orgid}/v2/team" })).data).toBe("plain");
  });

  it("treats 207 multi-status as success and returns the per-item body", async () => {
    const body = { items: [{ itemIdentifier: 1, status: 409 }] };
    const { client } = makeClient(async () => jsonResponse(207, body));
    const res = await client.request({ method: "POST", path: "/organization/{orgid}/team/bulk", json: { items: [] } });
    expect(res.status).toBe(207);
    expect(res.data).toEqual(body);
  });
});

describe("error mapping", () => {
  async function errorFor(res: Response): Promise<WxccApiError> {
    const { client } = makeClient(async () => res);
    try {
      await client.request({ method: "GET", path: "/organization/{orgid}/team/{id}", pathParams: { id: "t1" } });
    } catch (err) {
      return err as WxccApiError;
    }
    throw new Error("expected an error");
  }

  it("401 → token expired", async () => {
    const err = await errorFor(jsonResponse(401, apiError("Unauthorized")));
    expect(err).toBeInstanceOf(WxccApiError);
    expect(err.message).toBe("token expired: refresh WEBEX_TOKEN");
    expect(err.status).toBe(401);
  });

  it("401 with the live body shape (numeric key) still maps cleanly", async () => {
    const err = await errorFor(
      jsonResponse(401, {
        error: { key: 401, message: [{ description: "Validation Unsuccessful: FAIL_VALIDATE_TOKEN" }] },
        trackingId: "AUTHSVC_x",
      }),
    );
    expect(err.message).toBe("token expired: refresh WEBEX_TOKEN");
    expect(err.key).toBe("401");
    expect(err.trackingId).toBe("AUTHSVC_x");
  });

  it("ignores malformed error bodies instead of crashing", async () => {
    const err = await errorFor(
      jsonResponse(400, { error: { key: { nested: true }, reason: 42, message: [null, { description: 7, references: [null, { id: 5 }] }] } }),
    );
    expect(err.message).toBe("bad request: 7");
    expect(err.key).toBeUndefined();
    expect(err.references).toEqual([{ id: "5", name: undefined, entity: undefined }]);
  });

  it("400 uses the API description and appends the trackingId", async () => {
    const err = await errorFor(jsonResponse(400, apiError("siteId: not found for given orgId.")));
    expect(err.message).toBe("bad request: siteId: not found for given orgId. (trackingId: ccconfig_abc)");
    expect(err.trackingId).toBe("ccconfig_abc");
    expect(err.key).toBe("4xx");
  });

  it("403 falls back to a scope hint", async () => {
    const err = await errorFor(new Response(null, { status: 403 }));
    expect(err.message).toMatch(/^forbidden: .*cjp:config_write/);
  });

  it("404 names the request when the body is empty", async () => {
    const err = await errorFor(new Response(null, { status: 404 }));
    expect(err.message).toBe(`not found: GET /organization/${ORG}/team/t1`);
  });

  it("404 replaces a bare 'Not Found' description with the request", async () => {
    const err = await errorFor(jsonResponse(404, apiError("Not Found")));
    expect(err.message).toBe(`not found: GET /organization/${ORG}/team/t1 (trackingId: ccconfig_abc)`);
  });

  it("409 → duplicate", async () => {
    const err = await errorFor(jsonResponse(409, apiError("Team with name Billing already exists")));
    expect(err.message).toMatch(/^duplicate: Team with name Billing already exists/);
  });

  it("412 lists the referencing entities", async () => {
    const err = await errorFor(
      jsonResponse(
        412,
        apiError("dependency exists", {
          entity: "contact-service-queue",
          references: [
            { id: "q1", name: "Sales" },
            { id: "q2", name: "Support" },
          ],
        }),
      ),
    );
    expect(err.message).toBe(
      "in use by other entities: contact-service-queue Sales (q1), contact-service-queue Support (q2) (trackingId: ccconfig_abc)",
    );
    expect(err.references).toHaveLength(2);
  });

  it("412 caps the reference list", async () => {
    const references = Array.from({ length: 13 }, (_, i) => ({ id: `id${i}`, name: `n${i}` }));
    const err = await errorFor(jsonResponse(412, apiError("dependency exists", { references })));
    expect(err.message).toMatch(/and 3 more/);
  });

  it("429 reports Retry-After in seconds", async () => {
    const err = await errorFor(jsonResponse(429, {}, { "retry-after": "7" }));
    expect(err.message).toBe("rate limited: retry after 7s");
    expect(err.retryAfterSeconds).toBe(7);
    const noHeader = await errorFor(new Response(null, { status: 429 }));
    expect(noHeader.message).toBe("rate limited: retry later");
  });

  it("5xx → server error", async () => {
    const err = await errorFor(new Response("upstream exploded", { status: 503 }));
    expect(err.message).toBe("WxCC server error 503: upstream exploded");
  });

  it("network failures and timeouts become short client errors", async () => {
    const { client } = makeClient(async () => {
      throw new TypeError("fetch failed", { cause: { code: "ENOTFOUND" } });
    });
    await expect(client.request({ method: "GET", path: "/organization/{orgid}/v2/team" })).rejects.toThrow(
      /network error calling WxCC \(ENOTFOUND\): GET/,
    );
    const { client: slow } = makeClient(async () => {
      throw new DOMException("timed out", "TimeoutError");
    });
    await expect(slow.request({ method: "GET", path: "/organization/{orgid}/v2/team" })).rejects.toThrow(
      /request timed out after 30000ms/,
    );
  });
});

describe("token never leaks into errors", () => {
  const cases: Array<[string, () => Promise<Response>]> = [
    ["400 echoing the token", async () => jsonResponse(400, apiError(`bad header Bearer ${TOKEN}`))],
    ["412 echoing the token", async () => jsonResponse(412, apiError("x", { references: [{ id: TOKEN, name: TOKEN }] }))],
    ["500 text echoing the token", async () => new Response(`Authorization: Bearer ${TOKEN}`, { status: 500 })],
    ["401", async () => jsonResponse(401, apiError(TOKEN))],
    [
      "network error echoing the token",
      async () => {
        throw new TypeError("fetch failed", { cause: { message: `boom ${TOKEN}` } });
      },
    ],
  ];

  it.each(cases)("%s", async (_name, impl) => {
    const { client } = makeClient(impl);
    try {
      await client.request({ method: "GET", path: "/organization/{orgid}/v2/team" });
      expect.unreachable();
    } catch (err) {
      const e = err as Error;
      expect(e.message).not.toContain(TOKEN);
      expect(e.stack ?? "").not.toContain(TOKEN);
      expect(JSON.stringify(e)).not.toContain(TOKEN);
    }
  });
});
