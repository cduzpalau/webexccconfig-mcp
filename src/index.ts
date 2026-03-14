#!/usr/bin/env node
/**
 * Main entry point for the Webex Contact Center Configuration MCP Server.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { IServerConfig, IApiErrorResponse, ICadVariableDTO } from "./types.js";

/**
 * Loads server configuration from environment variables.
 * @returns {IServerConfig}
 */
const loadConfig = (): IServerConfig => {
  const webexToken = process.env.WEBEX_TOKEN;
  const orgId = process.env.WEBEX_ORG_ID;
  const baseUrl = process.env.WEBEX_BASE_URL;

  if (!webexToken || !orgId || !baseUrl) {
    throw new Error(
      "Missing required environment variables: WEBEX_TOKEN, WEBEX_ORG_ID, WEBEX_BASE_URL"
    );
  }

  return {
    webexToken,
    orgId,
    baseUrl: baseUrl.replace(/\/$/, ""), // Remove trailing slash if present
  };
};

import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

/**
 * Creates and starts the Webex CC Configuration MCP Server.
 * @returns {Promise<void>}
 */
const main = async (): Promise<void> => {
  const config = loadConfig();
  
  const server = new McpServer({
    name: "webex-cc-config",
    version: "1.0.0",
  });

  /**
   * Tool: Create_Global_Variable
   * Consumes the Create Global Variable API.
   */
  server.tool(
    "Create_Global_Variable",
    "Create a new Global Variable in Webex Contact Center",
    {
      name: z.string().describe("A name for the Global Variable."),
      defaultValue: z.string().describe("A default value for the Global Variable."),
      variableType: z.enum([
        "STRING", "INTEGER", "DATE_TIME", "BOOLEAN", "DECIMAL",
        "String", "Integer", "DateTime", "Boolean", "Decimal"
      ]).describe("A valid Global Variable Type."),
      active: z.boolean().describe("Indicates whether the Global Variable is active or not."),
      agentEditable: z.boolean().describe("Indicates whether the Global Variable is editable in the Agent Desktop by the agent or not."),
      agentViewable: z.boolean().describe("Indicates whether the agent can view the Global Variable in Agent Desktop or not."),
      reportable: z.boolean().describe("Indicates whether the Global Variable is reportable or not."),
      description: z.string().optional().describe("The description for the Global Variable created."),
      desktopLabel: z.string().optional().describe("A desktop label for the Global Variable created."),
      sensitive: z.boolean().optional().describe("Indicates whether the Global Variable is sensitive or not."),
      systemDefault: z.boolean().optional().describe("Indicates whether the created resource is system created or not."),
    },
    async (params) => {
      const url = `${config.baseUrl}/organization/${config.orgId}/cad-variable`;
      
      const body: ICadVariableDTO = {
        ...params,
        organizationId: config.orgId,
      } as ICadVariableDTO;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return {
            content: [
              {
                type: "text",
                text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Successfully created Global Variable: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  if (process.env.PORT) {
    // Cloud Run / HTTP Server mode
    const app = express();
    const port = parseInt(process.env.PORT, 10);
    
    let transport: SSEServerTransport | null = null;
    
    app.get("/sse", async (req, res) => {
      transport = new SSEServerTransport("/messages", res);
      await server.connect(transport);
    });

    app.post("/messages", async (req, res) => {
      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        res.status(503).send("SSE transport not initialized");
      }
    });

    app.listen(port, () => {
      console.log(`Webex CC Configuration MCP Server running on HTTP port ${port}`);
      console.log(`SSE endpoint: http://localhost:${port}/sse`);
      console.log(`Messages endpoint: http://localhost:${port}/messages`);
    });
  } else {
    // Local / Stdio mode
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Webex CC Configuration MCP Server running on stdio");
  }
};

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
