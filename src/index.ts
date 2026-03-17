#!/usr/bin/env node
/**
 * Main entry point for the Webex Contact Center Configuration MCP Server.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { IServerConfig, IApiErrorResponse, ICadVariableDTO, IResponseEnvelope, IAddressBookDTO } from "./types.js";

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
      if (!config) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Server not properly configured with environment variables.",
            },
          ],
          isError: true,
        };
      }
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

  /**
   * Tool: List_Global_Variables
   * Retrieves a list of Global Variable(s) in a given organization (v2).
   */
  server.tool(
    "List_Global_Variables",
    "Retrieve a list of Global Variable(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Server not properly configured with environment variables.",
            },
          ],
          isError: true,
        };
      }

      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/cad-variable?${queryParams.toString()}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "*/*",
          },
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

        const envelope = data as IResponseEnvelope<ICadVariableDTO>;
        return {
          content: [
            {
              type: "text",
              text: `Retrieved ${envelope.data.length} Global Variable(s):\n${JSON.stringify(envelope, null, 2)}`,
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

  /**
   * Tool: Update_Global_Variable
   * Update an existing Global Variable by ID in a given organization.
   */
  server.tool(
    "Update_Global_Variable",
    "Update an existing Global Variable by ID",
    {
      id: z.string().describe("ID of the Global Variable to update."),
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
      version: z.number().optional().describe("The version of this resource."),
      description: z.string().optional().describe("The description for the Global Variable created."),
      desktopLabel: z.string().optional().describe("A desktop label for the Global Variable created."),
      sensitive: z.boolean().optional().describe("Indicates whether the Global Variable is sensitive or not."),
      systemDefault: z.boolean().optional().describe("Indicates whether the created resource is system created or not."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Server not properly configured with environment variables.",
            },
          ],
          isError: true,
        };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/cad-variable/${id}`;
      
      const body: ICadVariableDTO = {
        ...params,
        id,
        organizationId: config.orgId,
      } as ICadVariableDTO;

      try {
        const response = await fetch(url, {
          method: "PUT",
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
              text: `Successfully updated Global Variable: ${JSON.stringify(data, null, 2)}`,
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

  /**
   * Tool: Delete_Global_Variable
   * Delete an existing Global Variable by ID in a given organization.
   */
  server.tool(
    "Delete_Global_Variable",
    "Delete an existing Global Variable by ID",
    {
      id: z.string().describe("ID of the Global Variable to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Server not properly configured with environment variables.",
            },
          ],
          isError: true,
        };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/cad-variable/${id}`;

      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "*/*",
          },
        });

        if (!response.ok) {
          const data = await response.json();
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
              text: `Successfully deleted Global Variable with ID: ${id}`,
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

  /**
   * Tool: List_Address_Books
   * Retrieve a list of Address Book(s) in a given organization (v3).
   */
  server.tool(
    "List_Address_Books",
    "Retrieve a list of Address Book(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Server not properly configured with environment variables.",
            },
          ],
          isError: true,
        };
      }

      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v3/address-book?${queryParams.toString()}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "*/*",
          },
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

        const envelope = data as IResponseEnvelope<IAddressBookDTO>;
        return {
          content: [
            {
              type: "text",
              text: `Retrieved ${envelope.data.length} Address Book(s):\n${JSON.stringify(envelope, null, 2)}`,
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
    app.use(cors()); // Enable CORS for the MCP Inspector
    const port = parseInt(process.env.PORT, 10);
    
    // Track active SSE transports by session ID
    const transports = new Map<string, SSEServerTransport>();
    
    app.get("/sse", async (req, res) => {
      const transport = new SSEServerTransport("/messages", res);
      transports.set(transport.sessionId, transport);
      
      transport.onclose = () => {
        transports.delete(transport.sessionId);
      };

      await server.connect(transport);
    });

    app.post("/messages", async (req, res) => {
      const sessionId = req.query.sessionId as string;
      const transport = transports.get(sessionId);

      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        res.status(404).send(`Session ${sessionId} not found`);
      }
    });

    app.listen(port, "0.0.0.0", () => {
      console.error(`Webex CC Configuration MCP Server running on port ${port}`);
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
