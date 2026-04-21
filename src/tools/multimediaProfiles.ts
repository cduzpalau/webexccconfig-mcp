import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerMultimediaProfilesTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
server.tool(
    "Bulk_Export_Multimedia_Profiles",
    "Export all Multimedia Profile(s) in a given organization",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile/bulk-export?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Bulk Export Multimedia Profiles:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Save_Multimedia_Profiles",
    "Create, Update or delete Multimedia Profile(s) in bulk in a given organization",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().int().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type. Possible values can be SAVE and DELETE."),
        item: z.object({
          name: z.string().describe("Enter the name for the multimedia profile."),
          blendingMode: z.string().describe("Blending mode (BLENDED, BLENDED_REALTIME, EXCLUSIVE)."),
          active: z.boolean().describe("Specify whether the multimedia profile is active or not."),
          blendingModeEnabled: z.boolean().describe("Specify whether the blending mode is enabled or not."),
          telephony: z.number().int().describe("Upper limit for telephony channel."),
          chat: z.number().int().describe("Upper limit for chat channel."),
          email: z.number().int().describe("Upper limit for email channel."),
          social: z.number().int().describe("Upper limit for social channel."),
          description: z.string().optional().describe("Enter a description for the multimedia profile."),
          id: z.string().optional().describe("ID of this contact center resource. Mandatory when updating."),
          version: z.number().int().optional().describe("The version of this resource."),
          systemDefault: z.boolean().optional().describe("Indicates whether the created resource is system created or not"),
          manuallyAssignable: z.object({
            telephony: z.number().int(),
            chat: z.number().int(),
            email: z.number().int(),
            social: z.number().int(),
            id: z.string().optional(),
            version: z.number().int().optional(),
          }).optional().describe("Upper limits for manually assignable channels."),
        })
      })).describe("List of items for bulk operation.")
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile/bulk`;
      const body: IBulkRequestDTOMultimediaProfile = {
        items: items.map(item => ({
          ...item,
          item: {
            ...item.item,
            organizationId: config.orgId,
            manuallyAssignable: item.item.manuallyAssignable ? { ...item.item.manuallyAssignable, organizationId: config.orgId } : undefined
          } as IMultimediaProfileDTO
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
    "Create_Multimedia_Profile",
    "Create a new Multimedia Profile in a given organization",
    {
      name: z.string().describe("Enter the name for the multimedia profile."),
      blendingMode: z.string().describe("Blending mode (BLENDED, BLENDED_REALTIME, EXCLUSIVE)."),
      active: z.boolean().describe("Specify whether the multimedia profile is active or not."),
      blendingModeEnabled: z.boolean().describe("Specify whether the blending mode is enabled or not."),
      telephony: z.number().int().describe("Upper limit for telephony channel."),
      chat: z.number().int().describe("Upper limit for chat channel."),
      email: z.number().int().describe("Upper limit for email channel."),
      social: z.number().int().describe("Upper limit for social channel."),
      description: z.string().optional().describe("Enter a description for the multimedia profile."),
      version: z.number().int().optional().describe("The version of this resource."),
      systemDefault: z.boolean().optional().describe("Indicates whether the created resource is system created or not"),
      manuallyAssignable: z.object({
        telephony: z.number().int(),
        chat: z.number().int(),
        email: z.number().int(),
        social: z.number().int(),
      }).optional().describe("Upper limits for manually assignable channels."),
    },
    async (params) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile`;
      const body: IMultimediaProfileDTO = {
        ...params,
        organizationId: config.orgId,
        manuallyAssignable: params.manuallyAssignable ? { ...params.manuallyAssignable, organizationId: config.orgId } : undefined
      } as IMultimediaProfileDTO;

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
        return { content: [{ type: "text", text: `Successfully created Multimedia Profile: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Delete_Multimedia_Profile",
    "Delete an existing Multimedia Profile by ID in a given organization",
    {
      id: z.string().describe("Resource ID of the Multimedia Profile."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        if (!response.ok) {
          if (response.status === 200) return { content: [{ type: "text", text: `Successfully deleted Multimedia Profile with ID: ${id}` }] };
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Multimedia Profile with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Get_Multimedia_Profile_by_ID",
    "Retrieve an existing Multimedia Profile by ID in a given organization",
    {
      id: z.string().describe("Resource ID of the Multimedia Profile."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile/${id}`;
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
        return { content: [{ type: "text", text: `Successfully retrieved Multimedia Profile:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Multimedia_Profiles",
    "Retrieve a list of Multimedia Profile(s) in a given organization (v2)",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/v2/multimedia-profile?${queryParams.toString()}`;
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
        const envelope = data as IResponseEnvelope<IMultimediaProfileDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Multimedia Profile(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Multimedia_Profile_References",
    "Retrieve a list of all entities that have reference to an existing Multimedia Profile by ID",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile/${id}/incoming-references?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Retrieved references for Multimedia Profile ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Purge_Inactive_Multimedia_Profiles",
    "Purge inactive Multimedia Profile(s) older than the configured interval",
    {
      nextStartId: z.string().optional().default("").describe("This is the entity ID from which items for the next purge batch with be selected."),
    },
    async ({ nextStartId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (nextStartId) queryParams.append("nextStartId", nextStartId);

      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile/purge-inactive-entities?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Purge operation completed:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Update_Multimedia_Profile",
    "Update an existing Multimedia Profile by ID in a given organization",
    {
      id: z.string().describe("Resource ID of the Multimedia Profile."),
      name: z.string().describe("Enter the name for the multimedia profile."),
      blendingMode: z.string().describe("Blending mode (BLENDED, BLENDED_REALTIME, EXCLUSIVE)."),
      active: z.boolean().describe("Specify whether the multimedia profile is active or not."),
      blendingModeEnabled: z.boolean().describe("Specify whether the blending mode is enabled or not."),
      telephony: z.number().int().describe("Upper limit for telephony channel."),
      chat: z.number().int().describe("Upper limit for chat channel."),
      email: z.number().int().describe("Upper limit for email channel."),
      social: z.number().int().describe("Upper limit for social channel."),
      description: z.string().optional().describe("Enter a description for the multimedia profile."),
      version: z.number().int().optional().describe("The version of this resource."),
      systemDefault: z.boolean().optional().describe("Indicates whether the created resource is system created or not"),
      manuallyAssignable: z.object({
        telephony: z.number().int(),
        chat: z.number().int(),
        email: z.number().int(),
        social: z.number().int(),
        id: z.string().optional(),
        version: z.number().int().optional(),
      }).optional().describe("Upper limits for manually assignable channels."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/multimedia-profile/${id}`;
      const body: IMultimediaProfileDTO = {
        ...params,
        id,
        organizationId: config.orgId,
        manuallyAssignable: params.manuallyAssignable ? { ...params.manuallyAssignable, organizationId: config.orgId } : undefined
      } as IMultimediaProfileDTO;

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
        return { content: [{ type: "text", text: `Successfully updated Multimedia Profile: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
};
