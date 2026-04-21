import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerDialedNumberMappingsTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
server.tool(
    "Bulk_Export_Dialed_Number_Mappings",
    "Export all Dialed Number Mapping(s) in a given organization",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number/bulk-export?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Successfully exported Dialed Number Mappings:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Save_Dialed_Number_Mappings",
    "Create, Update or delete Dialed Number Mapping(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().int().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type. Possible values are SAVE and DELETE."),
        item: z.object({
          entryPointId: z.string().describe("The identifier of an entry point to which you want to map the DN."),
          entryPointName: z.string().describe("The entryPoint name of the entryPointId."),
          dialledNumber: z.string().optional().describe("The dialed number(DN) used to map to entry points."),
          extension: z.string().or(z.number()).optional().describe("The extension used to map to entry points."),
          routingPrefix: z.string().or(z.number()).optional().describe("The routing prefix is mapped to a location and can be prefixed with an extension."),
          esn: z.string().or(z.number()).optional().describe("The esn is routing prefix with extension."),
          routePointId: z.string().optional().describe("The identifier of a route point of WxC which is similar to entry point of WxCC."),
          defaultAni: z.boolean().optional().describe("The default dial number for the tenant to make outdial calls."),
          location: z.string().optional().describe("The name of the location as configured on Webex Calling."),
          regionId: z.string().optional().describe("Specify the telephony region id."),
          dialledNumberDigits: z.string().optional().describe("Dialed number digits."),
          id: z.string().optional().describe("ID of this contact center resource."),
          version: z.number().int().optional().describe("The version of this resource."),
        })
      })).describe("List of items for bulk operation.")
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number/bulk`;
      const body: IBulkRequestDTODialedNumberMapping = {
        items: items.map(item => ({
          ...item,
          item: {
            ...item.item,
            extension: item.item.extension?.toString(),
            routingPrefix: item.item.routingPrefix?.toString(),
            esn: item.item.esn?.toString(),
            organizationId: config.orgId
          } as IDialedNumberMappingDTO
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
    "Create_Dialed_Number_Mapping",
    "Create a new Dialed Number Mapping in a given organization",
    {
      entryPointId: z.string().describe("The identifier of an entry point to which you want to map the DN."),
      entryPointName: z.string().describe("The entryPoint name of the entryPointId."),
      dialledNumber: z.string().optional().describe("The dialed number(DN) used to map to entry points."),
      extension: z.string().or(z.number()).optional().describe("The extension used to map to entry points."),
      routingPrefix: z.string().or(z.number()).optional().describe("The routing prefix is mapped to a location and can be prefixed with an extension."),
      esn: z.string().or(z.number()).optional().describe("The esn is routing prefix with extension."),
      routePointId: z.string().optional().describe("The identifier of a route point of WxC which is similar to entry point of WxCC."),
      defaultAni: z.boolean().optional().describe("The default dial number for the tenant to make outdial calls."),
      location: z.string().optional().describe("The name of the location as configured on Webex Calling."),
      regionId: z.string().optional().describe("Specify the telephony region id."),
      dialledNumberDigits: z.string().optional().describe("Dialed number digits."),
      version: z.number().int().optional().describe("The version of this resource."),
    },
    async (params) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number`;
      const body: IDialedNumberMappingDTO = {
        ...params,
        extension: params.extension?.toString(),
        routingPrefix: params.routingPrefix?.toString(),
        esn: params.esn?.toString(),
        organizationId: config.orgId
      } as IDialedNumberMappingDTO;

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
        return { content: [{ type: "text", text: `Successfully created Dialed Number Mapping: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Delete_All_Dialed_Number_Mappings",
    "Delete all Dialed Number Mapping(s) in a given organization",
    {},
    async () => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        if (!response.ok) {
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted all Dialed Number Mappings` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Delete_Dialed_Number_Mapping",
    "Delete an existing Dialed Number Mapping by ID in a given organization",
    {
      id: z.string().describe("Resource ID of the Dialed Number Mapping."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        if (!response.ok) {
          const data = await response.json();
          const errorData = data as IApiErrorResponse;
          return { content: [{ type: "text", text: `Error ${response.status}: ${errorData.error?.reason || "Unknown error"}\nDetails: ${JSON.stringify(errorData.error?.message || data)}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Successfully deleted Dialed Number Mapping with ID: ${id}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Get_Dialed_Number_Mapping_by_ID",
    "Retrieve an existing Dialed Number Mapping by ID in a given organization",
    {
      id: z.string().describe("Resource ID of the Dialed Number Mapping."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number/${id}`;
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
        return { content: [{ type: "text", text: `Successfully retrieved Dialed Number Mapping:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Dialed_Number_Mappings",
    "Retrieve a list of Dialed Number Mapping(s) in a given organization (v3)",
    {
      filter: z.string().optional().describe("Specify a filter based on which the results will be fetched (RSQL syntax)."),
      attributes: z.string().optional().describe("Specify the attributes to be returned."),
      search: z.string().optional().describe("Filter data based on the search keyword."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(100).describe("Defines the number of items to be displayed on a page."),
      includeEntryPointName: z.boolean().optional().default(false).describe("If set to true and entryPointName is in the attributes, the API will return entryPointName in the Get All response."),
    },
    async ({ filter, attributes, search, page, pageSize, includeEntryPointName }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("filter", filter);
      if (attributes) queryParams.append("attributes", attributes);
      if (search) queryParams.append("search", search);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("includeEntryPointName", includeEntryPointName.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/v3/dial-number?${queryParams.toString()}`;
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
        const envelope = data as IResponseEnvelope<IDialedNumberMappingDTO>;
        return { content: [{ type: "text", text: `Retrieved ${envelope.data.length} Dialed Number Mapping(s):\n${JSON.stringify(envelope, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Dialed_Number_Mapping_References",
    "Retrieve a list of all entities that have reference to an existing Dialed Number Mapping by ID",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number/${id}/incoming-references?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Retrieved references for Dialed Number Mapping ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Update_Dialed_Number_Mapping",
    "Update an existing Dialed Number Mapping by ID in a given organization",
    {
      id: z.string().describe("Resource ID of the Dialed Number Mapping."),
      entryPointId: z.string().describe("The identifier of an entry point to which you want to map the DN."),
      entryPointName: z.string().describe("The entryPoint name of the entryPointId."),
      dialledNumber: z.string().optional().describe("The dialed number(DN) used to map to entry points."),
      extension: z.string().or(z.number()).optional().describe("The extension used to map to entry points."),
      routingPrefix: z.string().or(z.number()).optional().describe("The routing prefix is mapped to a location and can be prefixed with an extension."),
      esn: z.string().or(z.number()).optional().describe("The esn is routing prefix with extension."),
      routePointId: z.string().optional().describe("The identifier of a route point of WxC which is similar to entry point of WxCC."),
      defaultAni: z.boolean().optional().describe("The default dial number for the tenant to make outdial calls."),
      location: z.string().optional().describe("The name of the location as configured on Webex Calling."),
      regionId: z.string().optional().describe("Specify the telephony region id."),
      dialledNumberDigits: z.string().optional().describe("Dialed number digits."),
      version: z.number().int().optional().describe("The version of this resource."),
    },
    async ({ id, ...params }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/dial-number/${id}`;
      const body: IDialedNumberMappingDTO = {
        ...params,
        id,
        extension: params.extension?.toString(),
        routingPrefix: params.routingPrefix?.toString(),
        esn: params.esn?.toString(),
        organizationId: config.orgId
      } as IDialedNumberMappingDTO;

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
        return { content: [{ type: "text", text: `Successfully updated Dialed Number Mapping: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
};
