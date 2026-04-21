import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerUsersTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
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
};
