/**
 * Builds the MCP server. Tools are registered here from the registry (phase 3 onwards); the
 * tools capability is declared up front so `tools/list` answers even before any are registered.
 */
import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WxccClient } from "./client.js";
import type { AppConfig } from "./config.js";

const pkg = createRequire(import.meta.url)("../package.json") as { version: string };

export const SERVER_NAME = "webexccconfig-mcp";
export const SERVER_VERSION = pkg.version;

export interface ServerDeps {
  config: AppConfig;
  client: WxccClient;
}

export function buildServer(_deps: ServerDeps): McpServer {
  return new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );
}
