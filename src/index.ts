#!/usr/bin/env node
/**
 * Entry point: load config, validate the token, start the stdio server.
 * stdout carries the MCP protocol, so every diagnostic goes to stderr.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { AuthError, StaticTokenProvider } from "./auth.js";
import { WxccClient } from "./client.js";
import { ConfigError, loadConfig } from "./config.js";
import { buildServer, SERVER_NAME, SERVER_VERSION } from "./server.js";
import { missingAudioTools } from "./write/files.js";

function configPathFromArgs(argv: string[]): string | undefined {
  const i = argv.indexOf("--config");
  if (i !== -1) return argv[i + 1];
  return argv.find((a) => a.startsWith("--config="))?.slice("--config=".length);
}

async function main(): Promise<void> {
  // Development convenience: values already in the environment take precedence over .env.
  const envFile = resolve(process.cwd(), ".env");
  if (existsSync(envFile)) process.loadEnvFile(envFile);

  const config = loadConfig({ configPath: configPathFromArgs(process.argv.slice(2)) });
  const tokenProvider = StaticTokenProvider.fromEnv();
  const client = new WxccClient({
    baseUrl: config.baseUrl,
    orgId: config.orgId,
    tokenProvider,
    timeoutMs: config.requestTimeoutMs,
  });

  if (config.mode === "read-write") {
    for (const warning of missingAudioTools(config.audio)) console.error(`${SERVER_NAME}: warning: ${warning}`);
  }

  const server = buildServer({ config, client });
  await server.connect(new StdioServerTransport());
  console.error(
    `${SERVER_NAME} ${SERVER_VERSION} on stdio: ${config.baseUrl}, mode ${config.mode}` +
      (config.configPath ? `, config ${config.configPath}` : ", no config file (env only)"),
  );
}

main().catch((err: unknown) => {
  const expected = err instanceof ConfigError || err instanceof AuthError;
  console.error(`${SERVER_NAME}: ${expected ? (err as Error).message : String(err)}`);
  process.exit(1);
});
