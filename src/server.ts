/**
 * Builds the MCP server and registers the generic tools over the generated registry.
 * The tools capability is declared up front so `tools/list` always answers.
 */
import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WxccClient } from "./client.js";
import type { AppConfig } from "./config.js";
import { RESOURCES } from "./registry/index.js";
import type { RegistryEntry } from "./registry-types.js";
import { Catalog } from "./tools/catalog.js";
import type { ToolContext } from "./tools/exec.js";
import { registerReadTools } from "./tools/read.js";
import { OperationLog } from "./write/oplog.js";

const pkg = createRequire(import.meta.url)("../package.json") as { version: string };

export const SERVER_NAME = "webexccconfig-mcp";
export const SERVER_VERSION = pkg.version;

export interface ServerDeps {
  config: AppConfig;
  client: WxccClient;
  /** Defaults to a log in config.logDir. */
  oplog?: OperationLog;
  /** Defaults to the generated registry. */
  registry?: readonly RegistryEntry[];
}

export function buildServer(deps: ServerDeps): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );
  const ctx: ToolContext = {
    config: deps.config,
    client: deps.client,
    catalog: new Catalog(deps.registry ?? RESOURCES, deps.config),
    oplog: deps.oplog ?? new OperationLog({ dir: deps.config.logDir }),
  };
  registerReadTools(server, ctx);
  return server;
}
