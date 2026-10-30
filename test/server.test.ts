import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { StaticTokenProvider } from "../src/auth.js";
import { WxccClient } from "../src/client.js";
import { resolveConfig } from "../src/config.js";
import { buildServer, SERVER_NAME } from "../src/server.js";

const ROOT = resolve(import.meta.dirname, "..");

describe("buildServer", () => {
  it("answers initialize and tools/list", async () => {
    const config = resolveConfig({ region: "us1", org_id: "org-1" }, { env: {} });
    const client = new WxccClient({
      baseUrl: config.baseUrl,
      orgId: config.orgId,
      tokenProvider: new StaticTokenProvider("t"),
      fetch: (() => Promise.reject(new Error("no network in tests"))) as unknown as typeof fetch,
    });
    const server = buildServer({ config, client });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    const mcp = new Client({ name: "test", version: "0" });
    await mcp.connect(clientTransport);

    expect(mcp.getServerVersion()?.name).toBe(SERVER_NAME);
    expect(mcp.getServerCapabilities()?.tools).toBeDefined();
    const { tools } = await mcp.listTools();
    expect(Array.isArray(tools)).toBe(true);
    for (const t of tools) expect(t.name).toMatch(/^wxcc-ext-/);
    await mcp.close();
  });
});

describe("stdio entry point", () => {
  const run = (env: Record<string, string>, input: string) =>
    new Promise<{ code: number | null; stdout: string; stderr: string }>((done) => {
      const cwd = mkdtempSync(join(tmpdir(), "wxcc-ext-stdio-")); // no .env, no wxcc-ext.yaml
      const child = spawn(process.execPath, ["--import", import.meta.resolve("tsx"), join(ROOT, "src/index.ts")], {
        cwd,
        env: { PATH: process.env.PATH ?? "", HOME: cwd, ...env },
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d) => (stdout += d));
      child.stderr.on("data", (d) => (stderr += d));
      child.on("close", (code) => done({ code, stdout, stderr }));
      child.stdin.end(input);
    });

  it("speaks JSON-RPC on stdout and logs only to stderr", async () => {
    const token = "fake-token-stdio";
    const init = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "0" } },
    };
    const list = { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} };
    const initialized = { jsonrpc: "2.0", method: "notifications/initialized" };
    const input = [init, initialized, list].map((m) => JSON.stringify(m)).join("\n") + "\n";

    const res = await run({ WEBEX_TOKEN: token, WXCC_REGION: "us1", WEBEX_ORG_ID: "org-1" }, input);
    const lines = res.stdout.trim().split("\n").map((l) => JSON.parse(l));
    expect(lines.find((l) => l.id === 1)?.result?.serverInfo?.name).toBe(SERVER_NAME);
    expect(lines.find((l) => l.id === 2)?.result?.tools).toEqual([]);
    expect(res.stderr).toContain("on stdio: https://api.wxcc-us1.cisco.com, mode read-only");
    expect(res.stdout + res.stderr).not.toContain(token);
  }, 20_000);

  it("exits with a short message when the token is missing", async () => {
    const res = await run({ WXCC_REGION: "us1", WEBEX_ORG_ID: "org-1" }, "");
    expect(res.code).toBe(1);
    expect(res.stderr.trim()).toBe(`${SERVER_NAME}: WEBEX_TOKEN is not set: export a Webex access token`);
    expect(res.stdout).toBe("");
  }, 20_000);

  it("exits with a short message on bad config", async () => {
    const res = await run({ WEBEX_TOKEN: "x", WEBEX_BASE_URL: "https://api.wxcc-us1.cisco.com/v1", WEBEX_ORG_ID: "o" }, "");
    expect(res.code).toBe(1);
    expect(res.stderr).toMatch(/must not end in \/v1/);
  }, 20_000);
});
