import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerDesktopProfilesTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
server.tool(
    "List_Desktop_Profiles",
    "Retrieve a list of Desktop Profile(s) in the organization (v2)",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/agent-profile?${queryParams.toString()}`;
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
        const envelope = data as IResponseEnvelope<IDesktopProfileDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Desktop Profile(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Get_Desktop_Profile_by_ID",
    "Retrieve a specific Desktop Profile by ID",
    {
      id: z.string().describe("Resource ID of the Desktop Profile."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile/${id}`;
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
        return { content: [{ type: "text", text: `Successfully retrieved Desktop Profile: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Create_Desktop_Profile",
    "Create a new Desktop Profile",
    {
      name: z.string().describe("Enter a name for the agent profile."),
      parentType: z.enum(["ORGANIZATION", "SITE"]).describe("ORGANIZATION: enterprise-wide, SITE: specific site."),
      active: z.boolean().describe("Specify whether the agent profile is active."),
      accessBuddyTeam: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessEntryPoint: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessIdleCode: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessQueue: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessWrapUpCode: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      agentDNValidation: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      description: z.string().optional(),
      siteId: z.string().optional(),
      autoWrapAfterSeconds: z.number().optional(),
      timeoutDesktopInactivityMins: z.number().optional(),
      addressBookId: z.string().optional(),
      agentDNValidationCriteria: z.string().optional(),
      outdialANIId: z.string().optional(),
      outdialEntryPointId: z.string().optional(),
      agentAvailableAfterOutdial: z.boolean().optional(),
      allowAutoWrapUpExtension: z.boolean().optional(),
      autoAnswer: z.boolean().optional(),
      autoWrapUp: z.boolean().optional(),
      consultToQueue: z.boolean().optional(),
      dialPlanEnabled: z.boolean().optional(),
      lastAgentRouting: z.boolean().optional(),
      outdialEnabled: z.boolean().optional(),
      screenPopup: z.boolean().optional(),
      showUserDetailsMS: z.boolean().optional(),
      showUserDetailsWebex: z.boolean().optional(),
      stateSynchronizationMS: z.boolean().optional(),
      stateSynchronizationWebex: z.boolean().optional(),
      timeoutDesktopInactivityCustomEnabled: z.boolean().optional(),
      agentDNValidationCriterions: z.array(z.string()).optional(),
      buddyTeams: z.array(z.string()).optional(),
      dialPlans: z.array(z.string()).optional(),
      entryPoints: z.array(z.string()).optional(),
      idleCodes: z.array(z.string()).optional(),
      loginVoiceOptions: z.array(z.string()).optional(),
      queues: z.array(z.string()).optional(),
      thresholdRules: z.array(z.string()).optional(),
      wrapUpCodes: z.array(z.string()).optional(),
      viewableStatistics: z.object({
        agentStats: z.boolean().optional(),
        accessQueueStats: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
        contactServiceQueues: z.array(z.string()).optional(),
        loggedInTeamStats: z.boolean().optional(),
        accessTeamStats: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
        teams: z.array(z.string()).optional(),
      }).optional(),
    },
    async (params) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile`;
      const body: IDesktopProfileDTO = {
        ...params,
        organizationId: config.orgId,
      } as IDesktopProfileDTO;

      if (body.viewableStatistics) {
        body.viewableStatistics.organizationId = config.orgId;
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
        return { content: [{ type: "text", text: `Successfully created Desktop Profile: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Update_Desktop_Profile",
    "Update an existing Desktop Profile by ID",
    {
      id: z.string().describe("Resource ID of the Desktop Profile."),
      name: z.string().describe("Enter a name for the agent profile."),
      parentType: z.enum(["ORGANIZATION", "SITE"]).describe("ORGANIZATION: enterprise-wide, SITE: specific site."),
      active: z.boolean().describe("Specify whether the agent profile is active."),
      accessBuddyTeam: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessEntryPoint: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessIdleCode: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessQueue: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      accessWrapUpCode: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      agentDNValidation: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
      version: z.number().int().optional().describe("The version of this resource."),
      description: z.string().optional(),
      siteId: z.string().optional(),
      autoWrapAfterSeconds: z.number().optional(),
      timeoutDesktopInactivityMins: z.number().optional(),
      addressBookId: z.string().optional(),
      agentDNValidationCriteria: z.string().optional(),
      outdialANIId: z.string().optional(),
      outdialEntryPointId: z.string().optional(),
      agentAvailableAfterOutdial: z.boolean().optional(),
      allowAutoWrapUpExtension: z.boolean().optional(),
      autoAnswer: z.boolean().optional(),
      autoWrapUp: z.boolean().optional(),
      consultToQueue: z.boolean().optional(),
      dialPlanEnabled: z.boolean().optional(),
      lastAgentRouting: z.boolean().optional(),
      outdialEnabled: z.boolean().optional(),
      screenPopup: z.boolean().optional(),
      showUserDetailsMS: z.boolean().optional(),
      showUserDetailsWebex: z.boolean().optional(),
      stateSynchronizationMS: z.boolean().optional(),
      stateSynchronizationWebex: z.boolean().optional(),
      timeoutDesktopInactivityCustomEnabled: z.boolean().optional(),
      agentDNValidationCriterions: z.array(z.string()).optional(),
      buddyTeams: z.array(z.string()).optional(),
      dialPlans: z.array(z.string()).optional(),
      entryPoints: z.array(z.string()).optional(),
      idleCodes: z.array(z.string()).optional(),
      loginVoiceOptions: z.array(z.string()).optional(),
      queues: z.array(z.string()).optional(),
      thresholdRules: z.array(z.string()).optional(),
      wrapUpCodes: z.array(z.string()).optional(),
      viewableStatistics: z.object({
        id: z.string().optional(),
        version: z.number().int().optional(),
        agentStats: z.boolean().optional(),
        accessQueueStats: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
        contactServiceQueues: z.array(z.string()).optional(),
        loggedInTeamStats: z.boolean().optional(),
        accessTeamStats: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
        teams: z.array(z.string()).optional(),
      }).optional(),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile/${id}`;
      const body: IDesktopProfileDTO = {
        ...params,
        id,
        organizationId: config.orgId,
      } as IDesktopProfileDTO;

      if (body.viewableStatistics) {
        body.viewableStatistics.organizationId = config.orgId;
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
        return { content: [{ type: "text", text: `Successfully updated Desktop Profile: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Delete_Desktop_Profile",
    "Delete an existing Desktop Profile by ID",
    {
      id: z.string().describe("Resource ID of the Desktop Profile to delete."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        if (!response.ok) {
          if (response.status === 204) {
            return { content: [{ type: "text", text: `Successfully deleted Desktop Profile with ID: ${id}` }] };
          }
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Desktop Profile with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Desktop_Profile_References",
    "Retrieve a list of all entities that have reference to an existing Desktop Profile",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile/${id}/incoming-references?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Retrieved references for Desktop Profile ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Export_Desktop_Profiles",
    "Export all Desktop Profile(s) in a given organization",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile/bulk-export?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Successfully exported Desktop Profiles:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Save_Desktop_Profiles",
    "Create, Update or delete Desktop Profile(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().int().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type. Possible values can be SAVE and DELETE."),
        item: z.object({
          name: z.string().describe("Enter a name for the agent profile."),
          parentType: z.enum(["ORGANIZATION", "SITE"]),
          active: z.boolean(),
          accessBuddyTeam: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
          accessEntryPoint: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
          accessIdleCode: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
          accessQueue: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
          accessWrapUpCode: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
          agentDNValidation: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
          id: z.string().optional(),
          description: z.string().optional(),
          organizationId: z.string().optional(),
          version: z.number().int().optional(),
          siteId: z.string().optional(),
          autoWrapAfterSeconds: z.number().optional(),
          timeoutDesktopInactivityMins: z.number().optional(),
          addressBookId: z.string().optional(),
          agentDNValidationCriteria: z.string().optional(),
          outdialANIId: z.string().optional(),
          outdialEntryPointId: z.string().optional(),
          agentAvailableAfterOutdial: z.boolean().optional(),
          allowAutoWrapUpExtension: z.boolean().optional(),
          autoAnswer: z.boolean().optional(),
          autoWrapUp: z.boolean().optional(),
          consultToQueue: z.boolean().optional(),
          dialPlanEnabled: z.boolean().optional(),
          lastAgentRouting: z.boolean().optional(),
          outdialEnabled: z.boolean().optional(),
          screenPopup: z.boolean().optional(),
          showUserDetailsMS: z.boolean().optional(),
          showUserDetailsWebex: z.boolean().optional(),
          stateSynchronizationMS: z.boolean().optional(),
          stateSynchronizationWebex: z.boolean().optional(),
          timeoutDesktopInactivityCustomEnabled: z.boolean().optional(),
          agentDNValidationCriterions: z.array(z.string()).optional(),
          buddyTeams: z.array(z.string()).optional(),
          dialPlans: z.array(z.string()).optional(),
          entryPoints: z.array(z.string()).optional(),
          idleCodes: z.array(z.string()).optional(),
          loginVoiceOptions: z.array(z.string()).optional(),
          queues: z.array(z.string()).optional(),
          thresholdRules: z.array(z.string()).optional(),
          wrapUpCodes: z.array(z.string()).optional(),
          viewableStatistics: z.object({
            id: z.string().optional(),
            version: z.number().int().optional(),
            agentStats: z.boolean().optional(),
            accessQueueStats: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
            contactServiceQueues: z.array(z.string()).optional(),
            loggedInTeamStats: z.boolean().optional(),
            accessTeamStats: z.enum(["SPECIFIC", "ALL", "PROVISIONED_VALUE", "NONE"]),
            teams: z.array(z.string()).optional(),
          }).optional(),
        })
      })).describe("List of items for bulk operation.")
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile/bulk`;
      const body: IBulkRequestDTODesktopProfile = {
        items: items.map(item => ({
          ...item,
          item: {
            ...item.item,
            organizationId: config.orgId,
            viewableStatistics: item.item.viewableStatistics ? { ...item.item.viewableStatistics, organizationId: config.orgId } : undefined
          } as IDesktopProfileDTO
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

server.tool(
    "Purge_Inactive_Desktop_Profiles",
    "Purge inactive Desktop Profile(s) older than the configured interval",
    {
      nextStartId: z.string().optional().describe("This is the entity ID from which items for the next purge batch with be selected."),
    },
    async ({ nextStartId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (nextStartId) queryParams.append("nextStartId", nextStartId);

      const url = `${config.baseUrl}/organization/${config.orgId}/agent-profile/purge-inactive-entities?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Successfully purged inactive Desktop Profiles: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
};
