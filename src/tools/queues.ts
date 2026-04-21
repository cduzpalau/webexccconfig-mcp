import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerQueuesTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
server.tool(
    "Add_Remove_Agents_to_Queue",
    "Add or remove agents/users to/from an agent based queue",
    {
      id: z.string().describe("Resource ID of the Contact Service Queue."),
      add: z.array(z.string()).optional().describe("List of agent IDs to add."),
      remove: z.array(z.string()).optional().describe("List of agent IDs to remove."),
    },
    async ({ id, add, remove }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v2/contact-service-queue/${id}/reassign-agents`;
      const body: IReassignAgentsRequestDTO = { add, remove };
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
        if (response.status === 204 || response.ok) {
          return { content: [{ type: "text", text: `Successfully reassigned agents for queue: ${id}` }] };
        }
        const data = await response.json();
        const errorData = data as IApiErrorResponse;
        return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Export_Contact_Service_Queues",
    "Export all Contact Service Queue(s) in a given organization",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/contact-service-queue/bulk-export?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Bulk Export Contact Service Queues:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Save_Contact_Service_Queues",
    "Create, Update or delete Contact Service Queue(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type."),
        item: z.any().describe("The Contact Service Queue object."),
      })).describe("List of items for bulk operation."),
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-service-queue/bulk`;
      const body: IBulkRequestDTOContactServiceQueue = {
        items: items.map(item => ({
          ...item,
          requestAction: item.requestAction as "SAVE" | "DELETE",
          item: {
            ...item.item,
            organizationId: item.item.organizationId || config.orgId,
          } as IContactServiceQueueDTO,
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
        return { content: [{ type: "text", text: `Bulk Save Contact Service Queues Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Partial_Update_Contact_Service_Queues",
    "Update some or all properties for multiple Contact Service Queue(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).optional().default("SAVE").describe("Identifier for action type."),
        item: z.any().describe("The partial Contact Service Queue object."),
      })).describe("List of items for bulk operation."),
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/contact-service-queue/bulk`;
      const body: IBulkRequestDTOContactServiceQueue = {
        items: items.map(item => ({
          ...item,
          requestAction: item.requestAction as "SAVE" | "DELETE",
          item: {
            ...item.item,
            organizationId: item.item.organizationId || config.orgId,
          } as IContactServiceQueueDTO,
        })),
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
        return { content: [{ type: "text", text: `Bulk Partial Update Contact Service Queues Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Get_Contact_Service_Queue_by_ID",
    "Retrieve an existing Contact Service Queue by ID",
    {
      id: z.string().describe("Resource ID of the Contact Service Queue."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v2/contact-service-queue/${id}`;
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
        return { content: [{ type: "text", text: `Successfully retrieved Contact Service Queue: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Agent_Based_Queues",
    "Retrieve a list of AgentBased Contact Service Queue(s) for a specific user",
    {
      userId: z.string().describe("ID of an agent in WxCC."),
    },
    async ({ userId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v2/contact-service-queue/agent-based/${userId}`;
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
        return { content: [{ type: "text", text: `AgentBased Queues for user ${userId}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Skill_Based_Queues",
    "Retrieve a list of SkillBased Contact Service Queue(s) for a specific user",
    {
      userId: z.string().describe("ID of an agent in WxCC."),
    },
    async ({ userId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v2/contact-service-queue/skill-based/${userId}`;
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
        return { content: [{ type: "text", text: `SkillBased Queues for user ${userId}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Team_Based_Queues",
    "Retrieve a list of TeamBased Contact Service Queue(s) for a specific user",
    {
      userId: z.string().describe("ID of an agent in WxCC."),
    },
    async ({ userId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/v2/contact-service-queue/team-based/${userId}`;
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
        return { content: [{ type: "text", text: `TeamBased Queues for user ${userId}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Contact_Service_Queue_References",
    "Retrieve a list of all entities that have reference to an existing Contact Service Queue",
    {
      id: z.string().describe("Resource ID of the Contact Service Queue."),
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

      const url = `${config.baseUrl}/organization/${config.orgId}/contact-service-queue/${id}/incoming-references?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Retrieved references for Contact Service Queue ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Purge_Inactive_Contact_Service_Queues",
    "Purge inactive Contact Service Queue(s) older than the configured interval",
    {
      nextStartId: z.string().optional().describe("This is the entity ID from which items for the next purge batch with be selected."),
    },
    async ({ nextStartId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (nextStartId) queryParams.append("nextStartId", nextStartId);

      const url = `${config.baseUrl}/organization/${config.orgId}/contact-service-queue/purge-inactive-entities?${queryParams.toString()}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${config.webexToken}`,
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (!response.ok) {
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Purge Inactive Contact Service Queues Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Update_Contact_Service_Queue",
    "Update an existing Contact Service Queue by ID",
    {
      id: z.string().describe("Resource ID of the Contact Service Queue."),
      name: z.string().describe("Name of the Contact Service Queue."),
      channelType: z.string().describe("Setting to indicate the channel type."),
      queueType: z.enum(["INBOUND", "OUTBOUND"]).describe("INBOUND or OUTBOUND."),
      queueRoutingType: z.string().describe("TEAM_BASED, SKILL_BASED, AGENT_BASED."),
      routingType: z.string().describe("LONGEST_AVAILABLE_AGENT, SKILLS_BASED, CIRCULAR, LINEAR."),
      active: z.boolean().describe("Specify whether the queue is active or not active."),
      maxActiveContacts: z.number().describe("The maximum number of simultaneous contacts allowed."),
      maxTimeInQueue: z.number().describe("The time in seconds before overflow."),
      serviceLevelThreshold: z.number().describe("The time in seconds for service level flag."),
      checkAgentAvailability: z.boolean().describe("Exclude teams with no logged in agents."),
      description: z.string().optional().describe("A short description of the queue."),
      organizationId: z.string().optional().describe("ID of the contact center organization."),
      version: z.number().optional().describe("The version of this resource."),
      overflowNumber: z.string().optional().describe("The destination phone number for overflow."),
      skillBasedRoutingType: z.string().optional().describe("Skill based routing type."),
      socialChannelType: z.string().optional().describe("Social channel type."),
      timezone: z.string().optional().describe("Time zone."),
      vendorId: z.string().optional().describe("Vendor ID."),
      manuallyAssignable: z.boolean().optional().describe("Indicates whether the queue can be manually assigned."),
      outdialCampaignEnabled: z.boolean().optional().describe("Should be specified only for outdial queues."),
      recordingPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      ivrRequeueUrl: z.string().optional().describe("Mandatory for TELEPHONY."),
      recordingAllCallsPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      monitoringPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      parkingPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      pauseRecordingPermitted: z.boolean().optional().describe("Mandatory for TELEPHONY."),
      controlFlowScriptUrl: z.string().optional().describe("Mandatory for TELEPHONY."),
      defaultMusicInQueueMediaFileId: z.string().optional().describe("Mandatory for TELEPHONY."),
      recordingPauseDuration: z.number().optional().describe("The duration in seconds of pause in recording."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/v2/organization/${config.orgId}/contact-service-queue/${id}`;
      const body: IContactServiceQueueDTO = { ...params, id, organizationId: config.orgId } as IContactServiceQueueDTO;

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
        return { content: [{ type: "text", text: `Successfully updated Contact Service Queue: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

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
};
