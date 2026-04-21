#!/usr/bin/env node
/**
 * Main entry point for the Webex Contact Center Configuration MCP Server.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

import {
  IServerConfig, IApiErrorResponse, ICadVariableDTO, IResponseEnvelope, IAddressBookDTO,
  IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO,
  ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO,
  IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry,
  IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook,
  IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO,
  IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO,
  IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile,
  IBulkRequestDTODesktopProfile, IPurgeResponseDTO,
  IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping,
  IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan,
  IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile,
  IBulkRequestDTOSkill, IBulkRequestDTOCadVariable,
  IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO,
  IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint,
  IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue,
  IBulkRequestDTOContactServiceQueue
} from "./types/index.js";

/**
 * Loads server configuration from environment variables.
 * @returns {IServerConfig | null}
 */
const loadConfig = (): IServerConfig | null => {
  const webexToken = process.env.WEBEX_TOKEN;
  const orgId = process.env.WEBEX_ORG_ID;
  const baseUrl = process.env.WEBEX_BASE_URL;

  if (!webexToken || !orgId || !baseUrl) {
    console.error(
      "Warning: Missing required environment variables: WEBEX_TOKEN, WEBEX_ORG_ID, WEBEX_BASE_URL. Server will start but tools will fail until configured."
    );
    return null;
  }

  return {
    webexToken,
    orgId,
    baseUrl: baseUrl.replace(/\/$/, ""), // Remove trailing slash if present
  };
};

/**
 * Registers all tools for the given MCP server instance.
 * @param server The McpServer instance to register tools on.
 * @param config The server configuration.
 */
import { registerAllTools } from "./tools/index.js";
import { WebexClient } from "./client/WebexClient.js";

const registerTools = (server: McpServer, config: IServerConfig | null): void => {
  const client = config ? new WebexClient(config) : null;
  registerAllTools(server, client as any, config);
};

/**
 * Main function to start the server\n */
const main = async (): Promise<void> => {
  const config = loadConfig();
  
  if (process.env.PORT && !process.argv.includes("--stdio")) {
    // Cloud Run / HTTP Server mode
    const app = express();
    app.use(cors());
    const port = parseInt(process.env.PORT, 10);
    
    // Create singleton transport/server for Streamable HTTP multiplexing
    const mcpServer = new McpServer({
      name: "webex-cc-config",
      version: "1.0.0",
    });
    registerTools(mcpServer, config);

    const streamableTransport = new StreamableHTTPServerTransport();
    await mcpServer.connect(streamableTransport);

    // Store server instances by session ID only for legacy SSE/Messages
    const sseSessions = new Map<string, { server: McpServer; transport: SSEServerTransport }>();
    
    app.get("/sse", async (req, res) => {
      const server = new McpServer({
        name: "webex-cc-config",
        version: "1.0.0",
      });
      registerTools(server, config);

      const transport = new SSEServerTransport("/messages", res);
      const sessionId = transport.sessionId;
      sseSessions.set(sessionId, { server, transport });
      
      transport.onclose = () => {
        sseSessions.delete(sessionId);
      };

      await server.connect(transport);
    });

    app.post("/messages", async (req, res) => {
      const sessionId = req.query.sessionId as string;
      const session = sseSessions.get(sessionId);

      if (session) {
        await session.transport.handlePostMessage(req, res);
      } else {
        res.status(404).send(`Session ${sessionId} not found`);
      }
    });

    // New Unified Streamable HTTP endpoint
    app.all("/mcp", express.json(), async (req, res) => {
      try {
        await streamableTransport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error("Error handling Streamable HTTP request:", error);
        if (!res.headersSent) {
          res.status(500).send("Internal Server Error");
        }
      }
    });

    app.get("/", (req, res) => {
      res.send("Webex CC Configuration MCP Server is running.");
    });

    app.listen(port, "0.0.0.0", () => {
      console.error(`Webex CC Configuration MCP Server running on port ${port}`);
    });
  } else {
    // Local / Stdio mode
    const server = new McpServer({
      name: "webex-cc-config",
      version: "1.0.0",
    });
    registerTools(server, config);

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Webex CC Configuration MCP Server running on stdio");
  }
};

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
