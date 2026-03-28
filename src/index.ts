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
import { IServerConfig, IApiErrorResponse, ICadVariableDTO, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO } from "./types.js";

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
