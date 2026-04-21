import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerTeamsTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
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
};
