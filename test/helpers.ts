/** Test harness: an in-memory MCP client wired to the server with fetch mocked. */
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { vi } from "vitest";
import { StaticTokenProvider } from "../src/auth.js";
import { WxccClient } from "../src/client.js";
import { resolveConfig, type ConfigFile } from "../src/config.js";
import { buildServer } from "../src/server.js";
import type { FileProcessor } from "../src/write/files.js";

export const TOKEN = "fake-token-harness";
export const ORG = "org-1";
export const BASE = "https://api.wxcc-us1.cisco.com";

export type Route = (url: URL, init: RequestInit) => Response | Promise<Response> | undefined;

export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

export async function startServer(opts: { config?: Partial<ConfigFile>; routes?: Route[]; files?: FileProcessor } = {}) {
  const logDir = mkdtempSync(join(tmpdir(), "wxcc-ext-log-"));
  const snapshotDir = mkdtempSync(join(tmpdir(), "wxcc-ext-snap-"));
  const config = resolveConfig(
    { region: "us1", org_id: ORG, log_dir: logDir, snapshot_dir: snapshotDir, ...opts.config },
    { env: {} },
  );
  const routes = opts.routes ?? [];
  const fetchMock = vi.fn(async (url: string, init: RequestInit) => {
    const u = new URL(url);
    for (const r of routes) {
      const res = await r(u, init);
      if (res) return res;
    }
    return json(404, { error: { message: [{ description: `no mock for ${init.method} ${u.pathname}` }] } });
  });
  const client = new WxccClient({
    baseUrl: config.baseUrl,
    orgId: config.orgId,
    tokenProvider: new StaticTokenProvider(TOKEN),
    fetch: fetchMock as unknown as typeof fetch,
  });
  const server = buildServer({ config, client, files: opts.files });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const mcp = new Client({ name: "test", version: "0" });
  await mcp.connect(clientTransport);

  const call = async (name: string, args: Record<string, unknown>) => {
    const res = (await mcp.callTool({ name, arguments: args })) as {
      isError?: boolean;
      content: Array<{ type: string; text: string }>;
    };
    const text = res.content.map((c) => c.text).join("\n");
    return { isError: res.isError === true, text, json: () => JSON.parse(res.content[0]!.text) };
  };

  const logLines = (): Array<Record<string, unknown>> =>
    readdirSync(logDir)
      .flatMap((f) => readFileSync(join(logDir, f), "utf8").trim().split("\n"))
      .filter(Boolean)
      .map((l) => JSON.parse(l));

  const rawLog = (): string => readdirSync(logDir).map((f) => readFileSync(join(logDir, f), "utf8")).join("");

  /** Non-GET requests sent to the API. */
  const writes = () => fetchMock.mock.calls.filter(([, init]) => init.method !== "GET");

  return { mcp, call, fetchMock, writes, logDir, snapshotDir, logLines, rawLog, config, close: () => mcp.close() };
}

/** Route helper: matches method and path (after the org prefix) exactly. */
export function route(method: string, path: string, respond: (url: URL, init: RequestInit) => Response): Route {
  return (url, init) => (init.method === method && url.pathname === `/organization/${ORG}${path}` ? respond(url, init) : undefined);
}
