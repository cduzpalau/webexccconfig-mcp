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
import {
  IServerConfig, IApiErrorResponse, ICadVariableDTO, IResponseEnvelope, IAddressBookDTO,
  IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO,
  ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO,
  IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry,
  IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook,
  IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO,
  IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO,
  IHolidayListDTO, IOverridesDTO
} from "./types.js";

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
const registerTools = (server: McpServer, config: IServerConfig | null): void => {
  /**
   * Tool: Create_Global_Variable
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
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/cad-variable`;
      const body: ICadVariableDTO = { ...params, organizationId: config.orgId } as ICadVariableDTO;

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
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: `Successfully created Global Variable: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Global_Variables
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
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
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
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<ICadVariableDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Global Variable(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Global_Variable
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
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/cad-variable/${id}`;
      const body: ICadVariableDTO = { ...params, id, organizationId: config.orgId } as ICadVariableDTO;

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully updated Global Variable: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Global_Variable
   */
  server.tool(
    "Delete_Global_Variable",
    "Delete an existing Global Variable by ID",
    {
      id: z.string().describe("ID of the Global Variable to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/cad-variable/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        if (!response.ok) {
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Global Variable with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Address_Books
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
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
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
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IAddressBookDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Address Book(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Address_Book
   */
  server.tool(
    "Create_Address_Book",
    "Create a new Address Book in a given organization",
    {
      name: z.string().describe("A name for the address book."),
      parentType: z.enum(["ORGANIZATION", "SITE"]).describe("A parent type which indicates whether the address book is accessible for all sites or a specific site."),
      description: z.string().optional().describe("A short description indicating the context of the address book."),
      siteId: z.string().optional().describe("The specific site id where the address book is accessible."),
    },
    async ({ name, parentType, description, siteId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v3/address-book`;
      const body: IAddressBookDTO = {
        name,
        parentType: parentType as "ORGANIZATION" | "SITE",
        description,
        siteId,
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Created Address Book:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Address_Book
   */
  server.tool(
    "Update_Address_Book",
    "Update an existing Address Book by ID",
    {
      id: z.string().describe("Resource ID of the Address Book to update."),
      name: z.string().describe("A name for the address book."),
      parentType: z.enum(["ORGANIZATION", "SITE"]).describe("A parent type which indicates whether the address book is accessible for all sites or a specific site."),
      description: z.string().optional().describe("A short description indicating the context of the address book."),
      siteId: z.string().optional().describe("The specific site id where the address book is accessible."),
      version: z.number().describe("The version of this resource."),
    },
    async ({ id, name, parentType, description, siteId, version }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v3/address-book/${id}`;
      const body: IAddressBookDTO = {
        name,
        parentType: parentType as "ORGANIZATION" | "SITE",
        description,
        siteId,
        version,
      };
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Updated Address Book:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Address_Book
   */
  server.tool(
    "Delete_Address_Book",
    "Delete an existing Address Book by ID",
    {
      id: z.string().describe("Resource ID of the Address Book to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v3/address-book/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        if (response.status === 204 || response.ok) {
          return { content: [{ type: "text", text: `Successfully deleted Address Book with ID: ${id}` }] };
        }
        const data = await response.json();
        const errorData = data as IApiErrorResponse;
        return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Address_Book_by_ID
   */
  server.tool(
    "Get_Address_Book_by_ID",
    "Retrieve a specific Address Book by ID",
    {
      id: z.string().describe("Resource ID of the Address Book."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v3/address-book/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Address Book Details:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Address_Book_References
   */
  server.tool(
    "List_Address_Book_References",
    "List references for a specific Address Book",
    {
      id: z.string().describe("Resource ID of the Address Book."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v3/address-book/${id}/references`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Address Book References:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Export_Address_Books
   */
  server.tool(
    "Bulk_Export_Address_Books",
    "Export all Address Book(s) in a given organization",
    {
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(50).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/address-book/bulk-export?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk Export Address Books:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Address_Book_Entries
   */
  server.tool(
    "List_Address_Book_Entries",
    "Retrieve a list of Address Book Entry(s) for a specific Address Book",
    {
      addressBookId: z.string().describe("Resource ID of the Address Book"),
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ addressBookId, filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/address-book/${addressBookId}/entry?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved Address Book Entries:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Address_Book_Entry
   */
  server.tool(
    "Create_Address_Book_Entry",
    "Create a new Address Book Entry in a given Address Book",
    {
      addressBookId: z.string().describe("Resource ID of the Address Book"),
      name: z.string().describe("A name for the address book entry."),
      number: z.string().describe("The phone number for the entry."),
    },
    async ({ addressBookId, name, number }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/address-book/${addressBookId}/entry`;
      const body: IAddressBookEntryDTO = {
        name,
        number,
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Created Address Book Entry:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Address_Book_Entry_by_ID
   */
  server.tool(
    "Get_Address_Book_Entry_by_ID",
    "Retrieve an existing Address Book Entry by ID",
    {
      addressBookId: z.string().describe("Resource ID of the Address Book"),
      id: z.string().describe("Resource ID of the Address Book Entry"),
    },
    async ({ addressBookId, id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/address-book/${addressBookId}/entry/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Address Book Entry Details:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Address_Book_Entry
   */
  server.tool(
    "Update_Address_Book_Entry",
    "Update an existing Address Book Entry by ID",
    {
      addressBookId: z.string().describe("Resource ID of the Address Book"),
      id: z.string().describe("Resource ID of the Address Book Entry to update."),
      name: z.string().describe("A name for the address book entry."),
      number: z.string().describe("The phone number for the entry."),
      version: z.number().describe("The version of this resource."),
    },
    async ({ addressBookId, id, name, number, version }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/address-book/${addressBookId}/entry/${id}`;
      const body: IAddressBookEntryDTO = {
        name,
        number,
        version,
      };
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Updated Address Book Entry:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Address_Book_Entry
   */
  server.tool(
    "Delete_Address_Book_Entry",
    "Delete an existing Address Book Entry by ID",
    {
      addressBookId: z.string().describe("Resource ID of the Address Book"),
      id: z.string().describe("Resource ID of the Address Book Entry to delete."),
    },
    async ({ addressBookId, id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/address-book/${addressBookId}/entry/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        if (response.status === 204 || response.ok) {
          return { content: [{ type: "text", text: `Successfully deleted Address Book Entry with ID: ${id}` }] };
        }
        const data = await response.json();
        const errorData = data as IApiErrorResponse;
        return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Save_Address_Book_Entries
   */
  server.tool(
    "Bulk_Save_Address_Book_Entries",
    "Create, Update or delete Address Book Entry(s) in bulk",
    {
      addressBookId: z.string().describe("Resource ID of the Address Book"),
      items: z.array(z.object({
        itemIdentifier: z.number().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type."),
        item: z.object({
          name: z.string().describe("A name for the address book entry."),
          number: z.string().describe("The phone number for the entry."),
          id: z.string().optional().describe("ID of this contact center resource."),
          version: z.number().optional().describe("The version of this resource."),
          organizationId: z.string().optional().describe("ID of the contact center organization."),
        }).describe("The Address Book Entry object."),
      })).describe("List of items for bulk operation."),
    },
    async ({ addressBookId, items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/address-book/${addressBookId}/entry/bulk`;
      const body: IBulkRequestDTOAddressBookEntry = {
        items: items.map(item => ({
          ...item,
          requestAction: item.requestAction as "SAVE" | "DELETE",
        })),
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok && response.status !== 207) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk Save Address Book Entries Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Contact_Numbers
   */
  server.tool(
    "List_Contact_Numbers",
    "Retrieve a list of Contact Number(s) in the organization (v2)",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/contact-number?${queryParams.toString()}`;
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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved Contact Numbers:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Contact_Number_by_ID
   */
  server.tool(
    "Get_Contact_Number_by_ID",
    "Retrieve a specific Contact Number by ID",
    {
      id: z.string().describe("Resource ID of the Contact Number."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-number/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Contact Number Details:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Contact_Number
   */
  server.tool(
    "Create_Contact_Number",
    "Create a new Contact Number in a given organization",
    {
      number: z.string().describe("The customized ani number."),
    },
    async ({ number }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-number`;
      const body: IContactNumberDTO = {
        number,
      };
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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Created Contact Number:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Contact_Number
   */
  server.tool(
    "Update_Contact_Number",
    "Update an existing Contact Number by ID",
    {
      id: z.string().describe("Resource ID of the Contact Number to update."),
      number: z.string().describe("The customized ani number."),
      version: z.number().describe("The version of this resource."),
    },
    async ({ id, number, version }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-number/${id}`;
      const body: IContactNumberDTO = {
        number,
        version,
      };
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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Updated Contact Number:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Contact_Number
   */
  server.tool(
    "Delete_Contact_Number",
    "Delete an existing Contact Number by ID",
    {
      id: z.string().describe("Resource ID of the Contact Number to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-number/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "*/*",
          },
        });
        if (response.status === 204 || response.ok) {
          return { content: [{ type: "text", text: `Successfully deleted Contact Number with ID: ${id}` }] };
        }
        const data = await response.json();
        const errorData = data as IApiErrorResponse;
        return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_All_Contact_Numbers_Raw
   */
  server.tool(
    "List_All_Contact_Numbers_Raw",
    "Retrieve a list of only contact numbers without pagination",
    {},
    async () => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-number/all-numbers`;
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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `All Contact Numbers:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Save_Contact_Numbers
   */
  server.tool(
    "Bulk_Save_Contact_Numbers",
    "Create, Update or delete Contact Number(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type."),
        item: z.object({
          number: z.string().describe("The customized ani number."),
          id: z.string().optional().describe("ID of this contact center resource."),
          version: z.number().optional().describe("The version of this resource."),
          organizationId: z.string().optional().describe("ID of the contact center organization."),
        }).describe("The Contact Number object."),
      })).describe("List of items for bulk operation."),
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-number/bulk`;
      const body: IBulkRequestDTOContactNumber = {
        items: items.map(item => ({
          ...item,
          requestAction: item.requestAction as "SAVE" | "DELETE",
        })),
      };
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
        if (!response.ok && response.status !== 207) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk Save Contact Numbers Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Export_Contact_Numbers
   */
  server.tool(
    "Bulk_Export_Contact_Numbers",
    "Export all Contact Number(s) in a given organization",
    {
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(10).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/contact-number/bulk-export?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk Export Contact Numbers:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Audio_File
   */
  server.tool(
    "Create_Audio_File",
    "Create a new Audio File in Webex Contact Center",
    {
      name: z.string().describe("A name for the Agent's personal greeting file. It should have valid extension i.e. .wav"),
      contentType: z.enum(["AUDIO_WAV", "TEXT_HTML", "TEXT_PHP", "AUDIO_X_WAV", "APPLICATION_OCTET_STREAM"]).describe("Indicates Content-Type of the Audio file."),
      audioFile: z.string().describe("The audio file content (e.g., base64 string)."),
      description: z.string().optional().describe("A short description of the audio file."),
      blobId: z.string().optional().describe("Identifier for the audio file."),
      url: z.string().optional().describe("Audio file download url."),
      systemDefault: z.boolean().optional().describe("Indicates whether the created resource is system created or not."),
    },
    async ({ name, contentType, audioFile, ...rest }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/audio-file`;
      const body = {
        audioFileInfo: { ...rest, name, contentType, organizationId: config.orgId, audioFile: "string" },
        audioFile: audioFile
      };

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully created Audio File: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Agent_Greeting
   */
  server.tool(
    "Create_Agent_Greeting",
    "Create a new agent personal greeting File for a given organization",
    {
      agentId: z.string().describe("Agent Id with which this greeting file is to be associated with."),
      name: z.string().describe("A name for the Agent's personal greeting file. It should have valid extension i.e. .wav"),
      contentType: z.enum(["AUDIO_WAV", "TEXT_HTML", "TEXT_PHP", "AUDIO_X_WAV", "APPLICATION_OCTET_STREAM"]).describe("Indicates Content-Type of the Audio file."),
      audioFile: z.string().describe("The audio file content (e.g., base64 string)."),
      attributeTag: z.string().optional().describe("This is used to identify the purpose of a greeting."),
      blobId: z.string().optional().describe("Identifier for the audio file."),
      ciUserId: z.string().optional().describe("Id of the Agent in common identity."),
      email: z.string().optional().describe("Email of the Agent."),
      firstName: z.string().optional().describe("First Name of the Agent."),
      lastName: z.string().optional().describe("Last Name of the Agent."),
      agentActive: z.boolean().optional().describe("Indicates whether the Agent is active."),
    },
    async ({ audioFile, ...greetingInfo }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-personal-greeting`;
      const body = {
        agentPersonalGreetingInfo: { ...greetingInfo, organizationId: config.orgId, audioFile: "string" },
        audioFile: audioFile
      };

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully created Agent Greeting: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Agent_Greeting_References
   */
  server.tool(
    "Delete_Agent_Greeting_References",
    "Delete references for an agent personal greeting file",
    {
      references: z.record(z.any()).describe("References to be deleted."),
    },
    async ({ references }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-personal-greeting/delete-reference`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify({ references }),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Agent Greeting references: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Agent_Greeting
   */
  server.tool(
    "Delete_Agent_Greeting",
    "Delete an existing Greeting File by ID",
    {
      id: z.string().describe("Resource ID of the Greeting File."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-personal-greeting/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        if (response.status === 204 || response.ok) {
          return { content: [{ type: "text", text: `Successfully deleted Agent Greeting with ID: ${id}` }] };
        }
        const data = await response.json();
        const errorData = data as IApiErrorResponse;
        return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Agent_Greetings_Meta
   */
  server.tool(
    "List_Agent_Greetings_Meta",
    "Retrieve all configurations with meta data for agent personal greetings (v2)",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      includeAgentDetails: z.boolean().optional().default(false).describe("If set to true, enable projection, filtering, searching, and sorting on agent details."),
    },
    async ({ filter, search, attributes, page, pageSize, includeAgentDetails }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (search) queryParams.append("search", search);
      if (attributes) queryParams.append("attributes", attributes);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("includeAgentDetails", includeAgentDetails.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/agent-personal-greeting?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IAgentGreetingDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Agent Greeting(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Agent_Greeting_by_ID
   */
  server.tool(
    "Get_Agent_Greeting_by_ID",
    "Retrieve an existing Greeting File by ID",
    {
      id: z.string().describe("Resource ID of the Greeting File."),
      includeUrl: z.boolean().optional().default(true).describe("Indicates if the URL for downloading should be included."),
    },
    async ({ id, includeUrl }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("includeUrl", includeUrl.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/agent-personal-greeting/${id}?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Agent Greeting: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Agent_Greetings
   */
  server.tool(
    "List_Agent_Greetings",
    "Retrieve a list of Greeting File(s) in a given organization (v3)",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      includeAgentDetails: z.boolean().optional().default(false).describe("If set to true, enable projection, filtering, searching, and sorting on agent details."),
    },
    async ({ filter, search, attributes, page, pageSize, includeAgentDetails }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (search) queryParams.append("search", search);
      if (attributes) queryParams.append("attributes", attributes);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("includeAgentDetails", includeAgentDetails.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v3/agent-personal-greeting?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IAgentGreetingDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Agent Greeting(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Partially_Update_Agent_Greeting
   */
  server.tool(
    "Partially_Update_Agent_Greeting",
    "Partially update Greeting File by ID",
    {
      id: z.string().describe("Resource ID of the Greeting File."),
      attributeTag: z.string().optional().describe("This is used to identify the purpose of a greeting."),
      greetingPurposeId: z.string().optional().describe("Id of the greeting purpose."),
    },
    async ({ id, ...patchData }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-personal-greeting/${id}`;
      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(patchData),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully partially updated Agent Greeting: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Agent_Greeting
   */
  server.tool(
    "Update_Agent_Greeting",
    "Update specific Greeting File by ID",
    {
      id: z.string().describe("Resource ID of the Greeting File."),
      agentId: z.string().describe("Agent Id with which this greeting file is to be associated with."),
      name: z.string().describe("A name for the Agent's personal greeting file. It should have valid extension i.e. .wav"),
      contentType: z.enum(["AUDIO_WAV", "TEXT_HTML", "TEXT_PHP", "AUDIO_X_WAV", "APPLICATION_OCTET_STREAM"]).describe("Indicates Content-Type of the Audio file."),
      audioFile: z.string().describe("The audio file content (e.g., base64 string)."),
      version: z.number().describe("The version of this resource."),
      attributeTag: z.string().optional().describe("This is used to identify the purpose of a greeting."),
      blobId: z.string().optional().describe("Identifier for the audio file."),
      ciUserId: z.string().optional().describe("Id of the Agent in common identity."),
      email: z.string().optional().describe("Email of the Agent."),
      firstName: z.string().optional().describe("First Name of the Agent."),
      lastName: z.string().optional().describe("Last Name of the Agent."),
      agentActive: z.boolean().optional().describe("Indicates whether the Agent is active."),
    },
    async ({ id, audioFile, ...greetingInfo }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-personal-greeting/${id}`;
      const body = {
        agentPersonalGreetingInfo: { ...greetingInfo, id, organizationId: config.orgId, audioFile: "string" },
        audioFile: audioFile
      };

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully updated Agent Greeting: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Audio_File
   */
  server.tool(
    "Delete_Audio_File",
    "Delete an existing Audio File by ID",
    {
      id: z.string().describe("Resource ID of the Audio File."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/audio-file/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        if (response.status === 204 || response.ok) {
          return { content: [{ type: "text", text: `Successfully deleted Audio File with ID: ${id}` }] };
        }
        const data = await response.json();
        const errorData = data as IApiErrorResponse;
        return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Audio_File_by_ID
   */
  server.tool(
    "Get_Audio_File_by_ID",
    "Retrieve an existing Audio File by ID",
    {
      id: z.string().describe("Resource ID of the Audio File."),
      includeUrl: z.boolean().optional().default(true).describe("Indicates if the URL for downloading should be included."),
    },
    async ({ id, includeUrl }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("includeUrl", includeUrl.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/audio-file/${id}?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Audio File: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Audio_Files
   */
  server.tool(
    "List_Audio_Files",
    "Retrieve a list of Audio File(s) in a given organization (v2)",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/audio-file?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IAudioFileInfoDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Audio File(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Audio_File_References
   */
  server.tool(
    "List_Audio_File_References",
    "Retrieve a list of all entities that have reference to an existing Audio File",
    {
      id: z.string().describe("ID of this contact center resource."),
      type: z.string().optional().describe("Entity type of the other entity that has a reference to this specific entity."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ id, type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/audio-file/${id}/incoming-references?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved references for Audio File ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Partially_Update_Audio_File
   */
  server.tool(
    "Partially_Update_Audio_File",
    "Partially update Audio File by ID",
    {
      id: z.string().describe("Resource ID of the Audio File."),
      description: z.string().optional().describe("A short description of the dial plan."),
    },
    async ({ id, ...patchData }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/audio-file/${id}`;
      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(patchData),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully partially updated Audio File: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Audio_File
   */
  server.tool(
    "Update_Audio_File",
    "Update specific Audio File by ID",
    {
      id: z.string().describe("Resource ID of the Audio File."),
      name: z.string().describe("A name for the Agent's personal greeting file. It should have valid extension i.e. .wav"),
      contentType: z.enum(["AUDIO_WAV", "TEXT_HTML", "TEXT_PHP", "AUDIO_X_WAV", "APPLICATION_OCTET_STREAM"]).describe("Indicates Content-Type of the Audio file."),
      audioFile: z.string().describe("The audio file content (e.g., base64 string)."),
      version: z.number().describe("The version of this resource."),
      description: z.string().optional().describe("A short description of the audio file."),
      blobId: z.string().optional().describe("Identifier for the audio file."),
      url: z.string().optional().describe("Audio file download url."),
      systemDefault: z.boolean().optional().describe("Indicates whether the created resource is system created or not."),
    },
    async ({ id, audioFile, ...fileInfo }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/audio-file/${id}`;
      const body = {
        audioFileInfo: { ...fileInfo, id, organizationId: config.orgId, audioFile: "string" },
        audioFile: audioFile
      };

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully updated Audio File: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Contact_Service_Queues
   */
  server.tool(
    "List_Contact_Service_Queues",
    "Retrieve a list of Contact Service Queue(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      desktopProfileFilter: z.boolean().optional().default(false).describe("If set to true, return only data the user has access to via Desktop Profile."),
      provisioningView: z.boolean().optional().default(false).describe("If set to true, return only data that user has access to, according to User Profile."),
    },
    async ({ filter, attributes, search, page, pageSize, desktopProfileFilter, provisioningView }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("desktopProfileFilter", desktopProfileFilter.toString());
      queryParams.append("provisioningView", provisioningView.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v3/contact-service-queue?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IContactServiceQueueDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Contact Service Queue(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Contact_Service_Queue
   */
  server.tool(
    "Create_Contact_Service_Queue",
    "Create a new Contact Service Queue",
    {
      name: z.string().describe("Name of the Contact Service Queue."),
      channelType: z.enum(["TELEPHONY", "EMAIL", "FAX", "CHAT", "VIDEO", "OTHERS", "SOCIAL_CHANNEL"]).describe("Setting to indicate the channel type."),
      queueType: z.enum(["INBOUND", "OUTBOUND"]).describe("This can be INBOUND or OUTBOUND."),
      queueRoutingType: z.enum(["TEAM_BASED", "SKILL_BASED", "AGENT_BASED"]).describe("This can be TEAM_BASED, SKILL_BASED, or AGENT_BASED."),
      routingType: z.enum(["LONGEST_AVAILABLE_AGENT", "SKILLS_BASED", "CIRCULAR", "LINEAR"]).describe("This can be LONGEST_AVAILABLE_AGENT, SKILLS_BASED, CIRCULAR, or LINEAR."),
      active: z.boolean().describe("Specify whether the queue is active or not active."),
      maxActiveContacts: z.number().int().describe("The maximum number of simultaneous contacts allowed for this queue."),
      maxTimeInQueue: z.number().int().describe("The time in seconds after which the system distributes to overflow."),
      serviceLevelThreshold: z.number().int().describe("The time in seconds before the system flags outside service level."),
      checkAgentAvailability: z.boolean().describe("Exclude teams with no logged in agents."),
      description: z.string().optional().describe("A short description of the queue."),
      skillBasedRoutingType: z.enum(["LONGEST_AVAILABLE_AGENT", "BEST_AVAILABLE_AGENT"]).optional().describe("Mandatory if routingType is SKILLS_BASED."),
      socialChannelType: z.enum(["MESSAGEBIRD", "MESSENGER", "WHATSAPP", "APPLE_BUSINESS_CHAT", "GOOGLE_BUSINESS_MESSAGES"]).optional().describe("Social channel type."),
      timezone: z.string().optional().describe("Any routing strategy for this queue uses this time zone."),
      overflowNumber: z.string().optional().describe("The destination phone number for overflow."),
      
      /** Telephony mandatory fields */
      recordingPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      ivrRequeueUrl: z.string().optional().describe("Mandatory for TELEPHONY."),
      recordingAllCallsPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      monitoringPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      parkingPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      pauseRecordingPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      controlFlowScriptUrl: z.string().optional().describe("Mandatory for TELEPHONY."),
      defaultMusicInQueueMediaFileId: z.string().optional().describe("Mandatory for TELEPHONY."),
      
      /** Other optional */
      manuallyAssignable: z.boolean().optional().describe("Indicates whether the queue can be manually assigned."),
      outdialCampaignEnabled: z.boolean().optional().describe("Should be specified only for outdial queues."),
      recordingPauseDuration: z.number().int().optional().describe("The duration in seconds of pause in recording."),
      
      /** Nested objects */
      assistantSkillId: z.string().optional().describe("Id of an Assistant Skill mapped to the Queue."),
      agents: z.array(z.object({ id: z.string(), ciUserId: z.string().optional() })).optional().describe("The list of agents for AgentBased queue."),
      callDistributionGroups: z.array(z.object({
        order: z.number().int(),
        duration: z.number().int().optional(),
        agentGroups: z.array(z.object({ teamId: z.string() }))
      })).optional().describe("Call Distribution Groups for the queue."),
      queueSkillRequirements: z.array(z.object({
        skillId: z.string(),
        condition: z.string(),
        skillValue: z.string()
      })).optional().describe("Skill requirements for the queue."),
    },
    async ({ assistantSkillId, agents, callDistributionGroups, queueSkillRequirements, ...rest }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      
      const body: any = {
        ...rest,
        organizationId: config.orgId,
      };

      if (assistantSkillId) body.assistantSkill = { assistantSkillId };
      if (agents) body.agents = agents;
      if (callDistributionGroups) body.callDistributionGroups = callDistributionGroups;
      if (queueSkillRequirements) body.queueSkillRequirements = queueSkillRequirements;

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/contact-service-queue`;
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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully created Contact Service Queue: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Contact_Service_Queue
   */
  server.tool(
    "Delete_Contact_Service_Queue",
    "Delete an existing Contact Service Queue by ID",
    {
      id: z.string().describe("Resource ID of the Contact Service Queue to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-service-queue/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });

        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Contact Service Queue with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return {
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }

        return { content: [{ type: "text", text: `Successfully deleted Contact Service Queue with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Skill
   */
  server.tool(
    "Create_Skill",
    "Create a new Skill in Webex Contact Center",
    {
      name: z.string().describe("Indicates the name of the skill. Once created, name cannot be modified."),
      skillType: z.enum(["PROFICIENCY", "BOOLEAN", "TEXT", "ENUM"]).describe("This can be PROFICIENCY, BOOLEAN, TEXT, or ENUM. Once created, skillType cannot be modified."),
      active: z.boolean().describe("Indicates the status of the skill whether it is active or not."),
      serviceLevelThreshold: z.number().int().describe("Allows to set the time that a customer request can be in a queue before the system flags it as outside the service level."),
      description: z.string().optional().describe("Indicates the description of the skill."),
      enumSkillValues: z.array(z.object({
        name: z.string().describe("Indicates the name of the enumSkillValue."),
        description: z.string().optional().describe("Indicates the description of the enumSkillValue.")
      })).optional().describe("If skillType is enum, the skill can take different sub-values which are defined with this field."),
    },
    async ({ skillType, enumSkillValues, ...rest }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/skill`;
      
      const body: any = {
        ...rest,
        skillType: skillType.toUpperCase(),
        organizationId: config.orgId,
      };

      if (enumSkillValues) {
        body.enumSkillValues = enumSkillValues.map(val => ({
          ...val,
          organizationId: config.orgId
        }));
      }

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
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: `Successfully created Skill: ${JSON.stringify(data, null, 2)}` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Skills
   */
  server.tool(
    "List_Skills",
    "Retrieve a list of Skill(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      singleObjectResponse: z.boolean().optional().default(false).describe("Specify whether to include array fields in the response."),
    },
    async ({ filter, attributes, search, page, pageSize, singleObjectResponse }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("singleObjectResponse", singleObjectResponse.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/skill?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<ISkillDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Skill(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Skill
   */
  server.tool(
    "Delete_Skill",
    "Delete an existing Skill by ID",
    {
      id: z.string().describe("Resource ID of the Skill to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/skill/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });

        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Skill with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return {
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }

        return { content: [{ type: "text", text: `Successfully deleted Skill with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Desktop_Layouts
   */
  server.tool(
    "List_Desktop_Layouts",
    "Retrieve a list of Desktop Layout(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      singleObjectResponse: z.boolean().optional().default(false).describe("Specify whether to include array fields in the response."),
    },
    async ({ filter, attributes, search, page, pageSize, singleObjectResponse }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("singleObjectResponse", singleObjectResponse.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/desktop-layout?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IDesktopLayoutDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Desktop Layout(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Desktop_Layout_by_ID
   */
  server.tool(
    "Get_Desktop_Layout_by_ID",
    "Retrieve a specific Desktop Layout by ID",
    {
      id: z.string().describe("Resource ID of the Desktop Layout."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/desktop-layout/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return {
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }
        return {
          content: [{ type: "text", text: `Successfully retrieved Desktop Layout: ${JSON.stringify(data, null, 2)}` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Desktop_Layout_by_ID
   */
  server.tool(
    "Update_Desktop_Layout_by_ID",
    "Update an existing Desktop Layout by ID",
    {
      id: z.string().describe("Resource ID of the Desktop Layout."),
      name: z.string().describe("A name for the Desktop Layout."),
      editedBy: z.string().describe("Indicates who modified the Desktop Layout."),
      jsonFileName: z.string().describe("Enter the name of the file."),
      jsonFileContent: z.string().describe("Enter the Desktop Layout json."),
      global: z.boolean().describe("Indicates if the Desktop Layout is a global layout or a custom layout."),
      status: z.boolean().describe("Indicates if the Desktop Layout is in active state or inactive."),
      defaultJsonModified: z.boolean().describe("Indicates if the default Desktop Layout is modified."),
      validated: z.boolean().describe("Indicates if the Desktop Layout is validated."),
      description: z.string().optional().describe("A short description indicating the context of the Desktop Layout."),
      version: z.number().optional().describe("The version of this resource."),
      teamIds: z.array(z.string()).optional().describe("Specify the teams id to assign to this Desktop Layout."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/desktop-layout/${id}`;
      
      const body: IDesktopLayoutDTO = {
        ...params,
        id,
        organizationId: config.orgId,
      } as IDesktopLayoutDTO;

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
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: `Successfully updated Desktop Layout: ${JSON.stringify(data, null, 2)}` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Desktop_Layout
   */
  server.tool(
    "Delete_Desktop_Layout",
    "Delete an existing Desktop Layout by ID",
    {
      id: z.string().describe("Resource ID of the Desktop Layout to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/desktop-layout/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });

        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Desktop Layout with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return {
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }

        return { content: [{ type: "text", text: `Successfully deleted Desktop Layout with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Entry_Points
   */
  server.tool(
    "List_Entry_Points",
    "Retrieve a list of Entry Point(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      desktopProfileFilter: z.boolean().optional().default(false).describe("If set to true, return only data the user has access to via Desktop Profile."),
      provisioningView: z.boolean().optional().default(false).describe("If set to true, return only data that user has access to, according to User Profile."),
      includeCount: z.boolean().optional().default(false).describe("Enable the flag to get the count of DN-EP Mapping."),
      singleObjectResponse: z.boolean().optional().default(false).describe("Specify whether to include array fields in the response."),
    },
    async ({ filter, attributes, search, page, pageSize, desktopProfileFilter, provisioningView, includeCount, singleObjectResponse }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("desktopProfileFilter", desktopProfileFilter.toString());
      queryParams.append("provisioningView", provisioningView.toString());
      queryParams.append("includeCount", includeCount.toString());
      queryParams.append("singleObjectResponse", singleObjectResponse.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/entry-point?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return {
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }
        const envelope = data as IResponseEnvelope<IEntryPointDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Entry Point(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Skill_Profile
   * Create a new Skill Profile in a given organization.
   */
  server.tool(
    "Create_Skill_Profile",
    "Create a new Skill Profile in Webex Contact Center",
    {
      name: z.string().describe("Indicates the name of the skill Profile."),
      description: z.string().optional().describe("A short description of the skill profile."),
      activeSkills: z.array(z.object({
        skillId: z.string().describe("Indicates a value that represents a skill the agent has."),
        booleanValue: z.boolean().describe("Indicates whether the agent has this skill (True) or does not have the skill (False)."),
        proficiencyValue: z.number().int().min(0).max(10).optional().describe("A number between 0 and 10 to indicate proficiency."),
        textValue: z.string().optional().describe("A short textual description that represents a skill."),
      })).describe("List of active skills."),
      activeEnumSkills: z.array(z.object({
        enumSkillValueId: z.string().describe("ID of the enumSkillValue."),
      })).optional().describe("List of active enum skills."),
    },
    async (params) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/skill-profile`;
      
      const body: ISkillProfileDTO = {
        ...params,
        organizationId: config.orgId,
        activeSkills: params.activeSkills.map(skill => ({ ...skill, organizationId: config.orgId })),
        activeEnumSkills: params.activeEnumSkills?.map(skill => ({ ...skill, organizationId: config.orgId })),
      } as ISkillProfileDTO;

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
            content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: `Successfully created Skill Profile: ${JSON.stringify(data, null, 2)}` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Teams
   */
  server.tool(
    "List_Teams",
    "Retrieve a list of Team(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      supervisorView: z.boolean().optional().default(false).describe("supervisorView flag honours user-profile team access rights."),
      provisioningView: z.boolean().optional().default(false).describe("If set to true, return only data that user has access to, according to User Profile."),
      singleObjectResponse: z.boolean().optional().default(false).describe("Specify whether to include array fields in the response."),
    },
    async ({ filter, attributes, search, page, pageSize, supervisorView, provisioningView, singleObjectResponse }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("supervisorView", supervisorView.toString());
      queryParams.append("provisioningView", provisioningView.toString());
      queryParams.append("singleObjectResponse", singleObjectResponse.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/team?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<ITeamDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Team(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Team_by_ID
   */
  server.tool(
    "Get_Team_by_ID",
    "Retrieve a specific Team by ID",
    {
      id: z.string().describe("Resource ID of the Team."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/team/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Team: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Team
   */
  server.tool(
    "Create_Team",
    "Create a new Team",
    {
      name: z.string().describe("Enter the name for the team."),
      teamType: z.enum(["AGENT", "CAPACITY"]).describe("Team type can be AGENT or CAPACITY."),
      teamStatus: z.enum(["IN_SERVICE", "NOT_AVAILABLE"]).describe("Select the status of the team."),
      active: z.boolean().describe("Specify whether the team is active or not Active."),
      siteId: z.string().describe("Identifier for a site."),
      rankQueuesForTeam: z.boolean().describe("Indicates whether the queues should be ranked for the team."),
      dialedNumber: z.string().optional().describe("Enter the dial number (Required for CAPACITY)."),
      capacity: z.number().int().optional().describe("Enter the maximum number of simultaneous contacts (Required for CAPACITY)."),
      description: z.string().optional().describe("A short description of the team."),
      desktopLayoutId: z.string().optional().describe("Identifier for an agent desktop layout."),
      multiMediaProfileId: z.string().optional().describe("Id of the multimedia profile for this team."),
      skillProfileId: z.string().optional().describe("Id of the skill profile for this team."),
      userIds: z.array(z.string()).optional().describe("Specify the agents id who will be part of this team."),
      queueRankings: z.array(z.object({
        rank: z.number().int(),
        queueId: z.string(),
        id: z.string().optional(),
        version: z.number().int().optional(),
      })).optional().describe("Queue rankings for the team."),
    },
    async (params) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/team`;
      const body: ITeamDTO = {
        ...params,
        organizationId: config.orgId,
      } as ITeamDTO;

      if (params.queueRankings) {
        body.queueRankings = params.queueRankings.map(qr => ({ ...qr, organizationId: config.orgId }));
      }

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully created Team: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Team
   */
  server.tool(
    "Update_Team",
    "Update an existing Team by ID",
    {
      id: z.string().describe("Resource ID of the Team."),
      name: z.string().describe("Enter the name for the team."),
      teamType: z.enum(["AGENT", "CAPACITY"]).describe("Team type can be AGENT or CAPACITY."),
      teamStatus: z.enum(["IN_SERVICE", "NOT_AVAILABLE"]).describe("Select the status of the team."),
      active: z.boolean().describe("Specify whether the team is active or not Active."),
      siteId: z.string().describe("Identifier for a site."),
      rankQueuesForTeam: z.boolean().describe("Indicates whether the queues should be ranked for the team."),
      dialedNumber: z.string().optional().describe("Enter the dial number (Required for CAPACITY)."),
      capacity: z.number().int().optional().describe("Enter the maximum number of simultaneous contacts (Required for CAPACITY)."),
      description: z.string().optional().describe("A short description of the team."),
      desktopLayoutId: z.string().optional().describe("Identifier for an agent desktop layout."),
      multiMediaProfileId: z.string().optional().describe("Id of the multimedia profile for this team."),
      skillProfileId: z.string().optional().describe("Id of the skill profile for this team."),
      userIds: z.array(z.string()).optional().describe("Specify the agents id who will be part of this team."),
      version: z.number().int().optional().describe("The version of this resource."),
      queueRankings: z.array(z.object({
        rank: z.number().int(),
        queueId: z.string(),
        id: z.string().optional(),
        version: z.number().int().optional(),
      })).optional().describe("Queue rankings for the team."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/team/${id}`;
      const body: ITeamDTO = {
        ...params,
        id,
        organizationId: config.orgId,
      } as ITeamDTO;

      if (params.queueRankings) {
        body.queueRankings = params.queueRankings.map(qr => ({ ...qr, organizationId: config.orgId }));
      }

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully updated Team: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Team
   */
  server.tool(
    "Delete_Team",
    "Delete an existing Team by ID",
    {
      id: z.string().describe("Resource ID of the Team to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/team/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Team with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Team with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Team_References
   */
  server.tool(
    "List_Team_References",
    "Retrieve a list of all entities that have reference to an existing Team",
    {
      id: z.string().describe("ID of this contact center resource."),
      type: z.string().optional().describe("Entity type of the other entity that has a reference to this specific entity."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ id, type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/team/${id}/incoming-references?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved references for Team ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Export_Teams
   */
  server.tool(
    "Bulk_Export_Teams",
    "Export all Team(s) in the organization",
    {
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(50).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/team/bulk-export?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully exported Teams:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Save_Teams
   */
  server.tool(
    "Bulk_Save_Teams",
    "Create, Update or delete Team(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().int().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type. Possible values can be SAVE and DELETE."),
        item: z.object({
          name: z.string().describe("Enter the name for the team."),
          teamType: z.enum(["AGENT", "CAPACITY"]).describe("Team type can be AGENT or CAPACITY."),
          teamStatus: z.enum(["IN_SERVICE", "NOT_AVAILABLE"]).describe("Select the status of the team."),
          active: z.boolean().describe("Specify whether the team is active or not Active."),
          siteId: z.string().describe("Identifier for a site."),
          rankQueuesForTeam: z.boolean().describe("Indicates whether the queues should be ranked for the team."),
          dialedNumber: z.string().optional().describe("Enter the dial number (Required for CAPACITY)."),
          capacity: z.number().int().optional().describe("Enter the maximum number of simultaneous contacts (Required for CAPACITY)."),
          id: z.string().optional().describe("ID of this contact center resource."),
          description: z.string().optional().describe("A short description of the team."),
          desktopLayoutId: z.string().optional().describe("Identifier for an agent desktop layout."),
          multiMediaProfileId: z.string().optional().describe("Id of the multimedia profile for this team."),
          skillProfileId: z.string().optional().describe("Id of the skill profile for this team."),
          userIds: z.array(z.string()).optional().describe("Specify the agents id who will be part of this team."),
          version: z.number().int().optional().describe("The version of this resource."),
          queueRankings: z.array(z.object({
            rank: z.number().int(),
            queueId: z.string(),
            id: z.string().optional(),
            version: z.number().int().optional(),
          })).optional().describe("Queue rankings for the team."),
        })
      })).describe("List of items for bulk operation.")
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/team/bulk`;
      const body: IBulkRequestDTOTeam = {
        items: items.map(item => ({
          ...item,
          item: {
            ...item.item,
            organizationId: config.orgId,
            queueRankings: item.item.queueRankings?.map(qr => ({ ...qr, organizationId: config.orgId }))
          } as ITeamDTO
        }))
      };

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
        if (!response.ok && response.status !== 207) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk save operation completed (Status ${response.status}):\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Purge_Inactive_Teams
   */
  server.tool(
    "Purge_Inactive_Teams",
    "Purge inactive Team(s) older than the configured interval",
    {
      nextStartId: z.string().optional().describe("This is the entity ID from which items for the next purge batch with be selected."),
    },
    async ({ nextStartId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (nextStartId) queryParams.append("nextStartId", nextStartId);

      const url = `${config.baseUrl}/organization/${config.orgId}/team/purge-inactive-entities?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Accept": "*/*",
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully purged inactive Teams: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Users
   */
  server.tool(
    "List_Users",
    "Retrieve a list of User(s) in the organization (v2)",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      supervisorManagedAgentsOnly: z.boolean().optional().default(false).describe("If set to true, return contact center enabled users based on supervisor access rights."),
      singleObjectResponse: z.boolean().optional().default(false).describe("Specify whether to include array fields in the response."),
      buddyTeamAgentsOnly: z.boolean().optional().default(false).describe("If set to true, returns only users who are part of buddy teams."),
      userInQueue: z.enum(["assigned", "unassigned"]).optional().describe("Returns users assigned or unassigned to a queue."),
      queueId: z.string().optional().describe("Contact Service Queue Id for filtering."),
    },
    async ({ filter, attributes, search, page, pageSize, supervisorManagedAgentsOnly, singleObjectResponse, buddyTeamAgentsOnly, userInQueue, queueId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("supervisorManagedAgentsOnly", supervisorManagedAgentsOnly.toString());
      queryParams.append("singleObjectResponse", singleObjectResponse.toString());
      queryParams.append("buddyTeamAgentsOnly", buddyTeamAgentsOnly.toString());
      if (userInQueue) queryParams.append("userInQueue", userInQueue);
      if (queueId) queryParams.append("queueId", queueId);

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/user?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IUserDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} User(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_User_by_ID
   */
  server.tool(
    "Get_User_by_ID",
    "Retrieve a specific User by ID",
    {
      id: z.string().describe("Resource ID of the User."),
      includeCount: z.boolean().optional().default(false).describe("Include count of Contact Service Queues assigned to user."),
      includeSkillProfileAudit: z.boolean().optional().default(false).describe("Include skill profile modification info."),
    },
    async ({ id, includeCount, includeSkillProfileAudit }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("includeCount", includeCount.toString());
      queryParams.append("includeSkillProfileAudit", includeSkillProfileAudit.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/user/${id}?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/hal+json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved User: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_User_by_CI_ID
   */
  server.tool(
    "Get_User_by_CI_ID",
    "Retrieve a specific User by CI ID (v2)",
    {
      id: z.string().describe("CI ID of the User."),
      includeUserProfile: z.boolean().optional().default(true).describe("Specify whether to include user profile data."),
      includeNames: z.boolean().optional().default(true).describe("Specify whether to include resource collection names."),
    },
    async ({ id, includeUserProfile, includeNames }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("includeUserProfile", includeUserProfile.toString());
      queryParams.append("includeNames", includeNames.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/user/by-ci-user-id/${id}?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/hal+json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved User by CI ID: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_User_With_Profile
   */
  server.tool(
    "Get_User_With_Profile",
    "Retrieve a specific User along with UserProfile by ID",
    {
      id: z.string().describe("Resource ID of the User."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/user/with-user-profile/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/hal+json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved User with Profile: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Users_With_Profile
   */
  server.tool(
    "List_Users_With_Profile",
    "Retrieve a list of User(s) along with their UserProfiles",
    {},
    async () => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/user/with-user-profile`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Users with Profiles:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_User_References
   */
  server.tool(
    "List_User_References",
    "Retrieve a list of all entities that have reference to an existing User",
    {
      id: z.string().describe("ID of this contact center resource."),
      type: z.string().optional().describe("Entity type of the other entity that has a reference to this specific entity."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ id, type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/user/${id}/incoming-references?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved references for User ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_User
   */
  server.tool(
    "Update_User",
    "Update an existing User by ID",
    {
      id: z.string().describe("Resource ID of the User."),
      firstName: z.string().describe("The first name of the user."),
      lastName: z.string().describe("The last name of the user."),
      email: z.string().describe("The email address of the user."),
      active: z.boolean().describe("Indicates whether the user is active or not active."),
      contactCenterEnabled: z.boolean().describe("The setting is for accessing the Agent Desktop."),
      agentProfileId: z.string().describe("Identifier for a Desktop Profile."),
      userProfileId: z.string().describe("Identifier for an user profile."),
      siteId: z.string().describe("Identifier for a site."),
      version: z.number().int().optional().describe("The version of this resource."),
      ciUserId: z.string().optional().describe("Cisco Common Identity user Id."),
      broadCloudUserId: z.string().optional().describe("Broadcloud user Id."),
      deafultDialledNumber: z.string().optional().describe("The dial number of the agent."),
      externalIdentifier: z.string().optional().describe("Agent identification details."),
      mobile: z.string().optional().describe("The mobile phone number."),
      workPhone: z.string().optional().describe("The work phone number."),
      timezone: z.string().optional().describe("The time zone."),
      multimediaProfileId: z.string().optional().describe("Id of the multimedia profile."),
      skillProfileId: z.string().optional().describe("Id of the skill profile."),
      preferredSupervisorTeamId: z.string().optional().describe("Indicates the id of a preferred supervisor."),
      teamIds: z.array(z.string()).optional().describe("Specify the teams id which got assigned to this user."),
      userLevelAutoCSATInclusion: z.enum(["INCLUDED", "EXCLUDED"]).optional().describe("User level AutoCSAT inclusion type."),
      userLevelBurnoutInclusion: z.enum(["INCLUDED", "EXCLUDED"]).optional().describe("User level burnout inclusion type."),
      userLevelSummariesInclusion: z.enum(["INCLUDED", "EXCLUDED"]).optional().describe("User level Generated Summaries inclusion type."),
      userLevelWellnessBreakReminders: z.enum(["DISABLED", "ENABLED"]).optional().describe("User level Wellness break reminder type."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/user/${id}`;
      const body: IUserDTO = { ...params, id, organizationId: config.orgId } as IUserDTO;

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully updated User: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Partially_Update_User
   */
  server.tool(
    "Partially_Update_User",
    "Partially update User by ID",
    {
      id: z.string().describe("Resource ID of the User."),
      firstName: z.string().optional().describe("The first name of the user."),
      lastName: z.string().optional().describe("The last name of the user."),
      email: z.string().optional().describe("The email address of the user."),
      active: z.boolean().optional().describe("Indicates whether the user is active or not active."),
      contactCenterEnabled: z.boolean().optional().describe("The setting is for accessing the Agent Desktop."),
      agentProfileId: z.string().optional().describe("Identifier for a Desktop Profile."),
      userProfileId: z.string().optional().describe("Identifier for an user profile."),
      siteId: z.string().optional().describe("Identifier for a site."),
      version: z.number().int().optional().describe("The version of this resource."),
      teamIds: z.array(z.string()).optional().describe("Specify the teams id which got assigned to this user."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/user/${id}`;
      const body = { ...params };

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully partially updated User: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Partial_Update_Users
   */
  server.tool(
    "Bulk_Partial_Update_Users",
    "Update multiple users in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().int().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).optional().default("SAVE").describe("Identifier for action type."),
        item: z.object({
          id: z.string().describe("ID of the user to update."),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().optional(),
          active: z.boolean().optional(),
          contactCenterEnabled: z.boolean().optional(),
          agentProfileId: z.string().optional(),
          userProfileId: z.string().optional(),
          siteId: z.string().optional(),
          version: z.number().int().optional(),
          teamIds: z.array(z.string()).optional(),
        })
      })).describe("List of items for bulk operation.")
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/user/bulk`;
      const body = {
        items: items.map(item => ({
          ...item,
          item: {
            ...item.item,
            organizationId: config.orgId,
          }
        }))
      };

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok && response.status !== 207) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk partial update operation completed (Status ${response.status}):\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Export_Users
   */
  server.tool(
    "Bulk_Export_Users",
    "Export all User(s) in the organization",
    {
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/user/bulk-export?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully exported Users:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Users_by_IDs
   */
  server.tool(
    "Get_Users_by_IDs",
    "Retrieve User's first name, last name and email by list of IDs",
    {
      userIds: z.array(z.string()).optional().describe("List of valid user IDs."),
      search: z.string().optional().describe("Text used to search for users."),
      queueId: z.string().optional().describe("Agent Based Queue ID to filter users."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(10).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ userIds, search, queueId, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/user/fetch-user-details-by-ids?${queryParams.toString()}`;
      const body: IUserDetailsRequestDTO = { userIds, search, queueId };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved user details:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Agents_by_Skill_Requirements
   */
  server.tool(
    "Get_Agents_by_Skill_Requirements",
    "Fetch agents who match the provided skill requirements criteria",
    {
      skillRequirements: z.array(z.object({
        skillId: z.string(),
        condition: z.string(),
        skillValue: z.string(),
        id: z.string().optional(),
        version: z.number().int().optional(),
        skillName: z.string().optional(),
        skillType: z.string().optional(),
      })).describe("Skill requirements for filtering."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ skillRequirements, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/user/fetch-by-skill-requirements?${queryParams.toString()}`;
      const body = {
        skillRequirements: skillRequirements.map(sr => ({ ...sr, organizationId: config.orgId }))
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved agents by skill requirements:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Export_Auxiliary_Codes
   */
  server.tool(
    "Bulk_Export_Auxiliary_Codes",
    "Export all Auxiliary Code(s) in a given organization",
    {
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(50).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/bulk-export?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully exported Auxiliary Codes:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Partial_Update_Auxiliary_Codes
   */
  server.tool(
    "Bulk_Partial_Update_Auxiliary_Codes",
    "Update multiple auxiliary codes in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().int().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).optional().default("SAVE").describe("Identifier for action type."),
        item: z.object({
          id: z.string().describe("ID of the auxiliary code to update."),
          name: z.string().optional(),
          description: z.string().optional(),
          active: z.boolean().optional(),
          defaultCode: z.boolean().optional(),
          workTypeId: z.string().optional(),
          workTypeCode: z.enum(["IDLE_CODE", "WRAP_UP_CODE"]).optional(),
          burnoutInclusion: z.enum(["NOT_APPLICABLE", "EXCLUDED", "INCLUDED"]).optional(),
          version: z.number().int().optional(),
        })
      })).describe("List of items for bulk operation.")
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/bulk`;
      const body = {
        items: items.map(item => ({
          ...item,
          item: {
            ...item.item,
            organizationId: config.orgId,
          }
        }))
      };

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok && response.status !== 207) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk partial update operation completed (Status ${response.status}):\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Bulk_Save_Auxiliary_Codes
   */
  server.tool(
    "Bulk_Save_Auxiliary_Codes",
    "Create, Update or delete Auxiliary Code(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().int().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type."),
        item: z.object({
          name: z.string().describe("A name for the code."),
          active: z.boolean().describe("Indicates whether the code is active."),
          defaultCode: z.boolean().describe("Indicates whether this is the default code."),
          workTypeId: z.string().describe("Indicates the work type id associated with this code."),
          workTypeCode: z.enum(["IDLE_CODE", "WRAP_UP_CODE"]).describe("Indicates the work type associated with this code."),
          id: z.string().optional().describe("ID of this contact center resource."),
          description: z.string().optional().describe("A short description indicating the context of the code."),
          burnoutInclusion: z.enum(["NOT_APPLICABLE", "EXCLUDED", "INCLUDED"]).optional().describe("Indicates the idle code Inclusion status for agent burnout calculation."),
          version: z.number().int().optional().describe("The version of this resource."),
        })
      })).describe("List of items for bulk operation.")
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/bulk`;
      const body: IBulkRequestDTOAuxiliaryCode = {
        items: items.map(item => ({
          ...item,
          item: {
            ...item.item,
            organizationId: config.orgId,
          } as IAuxiliaryCodeDTO
        }))
      };

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
        if (!response.ok && response.status !== 207) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Bulk save operation completed (Status ${response.status}):\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Create_Auxiliary_Code
   */
  server.tool(
    "Create_Auxiliary_Code",
    "Create a new Auxiliary Code",
    {
      name: z.string().describe("A name for the code."),
      active: z.boolean().describe("Indicates whether the code is active."),
      defaultCode: z.boolean().describe("Indicates whether this is the default code."),
      workTypeId: z.string().describe("Indicates the work type id associated with this code."),
      workTypeCode: z.enum(["IDLE_CODE", "WRAP_UP_CODE"]).describe("Indicates the work type associated with this code."),
      description: z.string().optional().describe("A short description indicating the context of the code."),
      burnoutInclusion: z.enum(["NOT_APPLICABLE", "EXCLUDED", "INCLUDED"]).optional().describe("Indicates the idle code Inclusion status for agent burnout calculation."),
    },
    async (params) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code`;
      const body: IAuxiliaryCodeDTO = {
        ...params,
        organizationId: config.orgId,
      } as IAuxiliaryCodeDTO;

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully created Auxiliary Code: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Auxiliary_Code
   */
  server.tool(
    "Delete_Auxiliary_Code",
    "Delete an existing Auxiliary Code by ID",
    {
      id: z.string().describe("Resource ID of the Auxiliary Code to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Auxiliary Code with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Auxiliary Code with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Auxiliary_Code_by_ID
   */
  server.tool(
    "Get_Auxiliary_Code_by_ID",
    "Retrieve a specific Auxiliary Code by ID",
    {
      id: z.string().describe("Resource ID of the Auxiliary Code."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Auxiliary Code: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Auxiliary_Codes
   */
  server.tool(
    "List_Auxiliary_Codes",
    "Retrieve a list of Auxiliary Code(s) in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/auxiliary-code?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IAuxiliaryCodeDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Auxiliary Code(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Auxiliary_Code_References
   */
  server.tool(
    "List_Auxiliary_Code_References",
    "Retrieve a list of all entities that have reference to an existing Auxiliary Code",
    {
      id: z.string().describe("ID of this contact center resource."),
      type: z.string().optional().describe("Entity type of the other entity that has a reference to this specific entity."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ id, type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/${id}/incoming-references?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved references for Auxiliary Code ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Purge_Inactive_Auxiliary_Codes
   */
  server.tool(
    "Purge_Inactive_Auxiliary_Codes",
    "Purge inactive Auxiliary Code(s) older than the configured interval",
    {
      nextStartId: z.string().optional().describe("This is the entity ID from which items for the next purge batch with be selected."),
    },
    async ({ nextStartId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (nextStartId) queryParams.append("nextStartId", nextStartId);

      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/purge-inactive-entities?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully purged inactive Auxiliary Codes: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Update_Auxiliary_Code
   */
  server.tool(
    "Update_Auxiliary_Code",
    "Update an existing Auxiliary Code by ID",
    {
      id: z.string().describe("Resource ID of the Auxiliary Code to update."),
      name: z.string().describe("A name for the code."),
      active: z.boolean().describe("Indicates whether the code is active."),
      defaultCode: z.boolean().describe("Indicates whether this is the default code."),
      workTypeId: z.string().describe("Indicates the work type id associated with this code."),
      workTypeCode: z.enum(["IDLE_CODE", "WRAP_UP_CODE"]).describe("Indicates the work type associated with this code."),
      version: z.number().int().optional().describe("The version of this resource."),
      description: z.string().optional().describe("A short description indicating the context of the code."),
      burnoutInclusion: z.enum(["NOT_APPLICABLE", "EXCLUDED", "INCLUDED"]).optional().describe("Indicates the idle code Inclusion status for agent burnout calculation."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/auxiliary-code/${id}`;
      const body: IAuxiliaryCodeDTO = {
        ...params,
        id,
        organizationId: config.orgId,
      } as IAuxiliaryCodeDTO;

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
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully updated Auxiliary Code: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Business_Hours
   */
  server.tool(
    "Delete_Business_Hours",
    "Delete an existing Business Hours resource by ID",
    {
      id: z.string().describe("Resource ID of the Business Hours resource to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/business-hours/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Business Hours with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Business Hours with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Business_Hours_by_ID
   */
  server.tool(
    "Get_Business_Hours_by_ID",
    "Retrieve a specific Business Hours resource by ID",
    {
      id: z.string().describe("Resource ID of the Business Hours resource."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/business-hours/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Business Hours: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Business_Hours
   */
  server.tool(
    "List_Business_Hours",
    "Retrieve a list of Business Hours resources in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/business-hours?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IBusinessHoursDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Business Hours resource(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Business_Hours_References
   */
  server.tool(
    "List_Business_Hours_References",
    "Retrieve a list of all entities that have reference to an existing Business Hours resource",
    {
      id: z.string().describe("ID of this contact center resource."),
      type: z.string().optional().describe("Entity type of the other entity that has a reference to this specific entity."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ id, type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/business-hours/${id}/incoming-references?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved references for Business Hours ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Holiday_List
   */
  server.tool(
    "Delete_Holiday_List",
    "Delete an existing Holiday List by ID",
    {
      id: z.string().describe("Resource ID of the Holiday List to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/holiday-list/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Holiday List with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Holiday List with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Holiday_List_by_ID
   */
  server.tool(
    "Get_Holiday_List_by_ID",
    "Retrieve a specific Holiday List by ID",
    {
      id: z.string().describe("Resource ID of the Holiday List."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/holiday-list/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Holiday List: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Holiday_Lists
   */
  server.tool(
    "List_Holiday_Lists",
    "Retrieve a list of Holiday Lists in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/holiday-list?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IHolidayListDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Holiday List(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Holiday_List_References
   */
  server.tool(
    "List_Holiday_List_References",
    "Retrieve a list of all entities that have reference to an existing Holiday List",
    {
      id: z.string().describe("ID of this contact center resource."),
      type: z.string().optional().describe("Entity type of the other entity that has a reference to this specific entity."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ id, type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/holiday-list/${id}/incoming-references?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved references for Holiday List ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Delete_Overrides
   */
  server.tool(
    "Delete_Overrides",
    "Delete an existing Overrides resource by ID",
    {
      id: z.string().describe("Resource ID of the Overrides resource to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/overrides/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Overrides with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Overrides with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: Get_Overrides_by_ID
   */
  server.tool(
    "Get_Overrides_by_ID",
    "Retrieve a specific Overrides resource by ID",
    {
      id: z.string().describe("Resource ID of the Overrides resource."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/overrides/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully retrieved Overrides: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Overrides
   */
  server.tool(
    "List_Overrides",
    "Retrieve a list of Overrides resources in the organization",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ filter, attributes, search, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/overrides?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        const envelope = data as IResponseEnvelope<IOverridesDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Overrides resource(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  /**
   * Tool: List_Overrides_References
   */
  server.tool(
    "List_Overrides_References",
    "Retrieve a list of all entities that have reference to an existing Overrides resource",
    {
      id: z.string().describe("ID of this contact center resource."),
      type: z.string().optional().describe("Entity type of the other entity that has a reference to this specific entity."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ id, type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (type) queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/overrides/${id}/incoming-references?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "*/*" },
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Retrieved references for Overrides ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
};

/**
 * Creates and starts the Webex CC Configuration MCP Server.
 */
const main = async (): Promise<void> => {
  const config = loadConfig();
  
  if (process.env.PORT) {
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
