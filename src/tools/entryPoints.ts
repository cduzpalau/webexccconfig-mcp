import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerEntryPointsTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
server.tool(
    "Bulk_Export_Entry_Points",
    "Export all Entry Point(s) in a given organization",
    {
      type: z.enum(["INBOUND", "OUTBOUND"]).describe("Indicates the type of Entrypoint; can be INBOUND or OUTBOUND."),
      page: z.number().optional().default(0).describe("Defines the number of displayed page (starts from 0)."),
      pageSize: z.number().optional().default(50).describe("Defines the number of items to be displayed on a page."),
    },
    async ({ type, page, pageSize }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/entry-point/bulk-export?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Bulk Export Entry Points:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Save_Entry_Points",
    "Create, Update or delete Entry Point(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type."),
        item: z.object({
          name: z.string().describe("A unique name for the entry point."),
          channelType: z.string().describe("Setting to indicate the channel type."),
          entryPointType: z.string().describe("INBOUND or OUTBOUND."),
          active: z.boolean().describe("Indicates whether the state is active or inactive."),
          maximumActiveContacts: z.number().describe("Caps the maximum number of simultaneous calls."),
          serviceLevelThreshold: z.number().describe("Time in seconds for service level flag."),
          id: z.string().optional().describe("ID of this contact center resource."),
          description: z.string().optional().describe("A short description of the entry point."),
          organizationId: z.string().optional().describe("ID of the contact center organization."),
          version: z.number().optional().describe("The version of this resource."),
          assetId: z.string().optional().describe("ID of the asset in IMI."),
          imiOrgType: z.string().optional().describe("Refers to the type of digital channels used."),
          socialChannelType: z.string().optional().describe("Type of Social Channel."),
          timezone: z.string().optional().describe("Time zone."),
          flowId: z.string().optional().describe("Flow ID."),
          flowTagId: z.string().optional().describe("Flow Tag ID."),
          musicOnHoldId: z.string().optional().describe("Music on Hold ID."),
          outdialQueueId: z.string().optional().describe("Outdial Queue ID."),
          callbackEnabled: z.boolean().optional().describe("Is call back enabled."),
        }).describe("The Entry Point object."),
      })).describe("List of items for bulk operation."),
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/entry-point/bulk`;
      const body: IBulkRequestDTOEntryPoint = {
        items: items.map(item => ({
          ...item,
          requestAction: item.requestAction as "SAVE" | "DELETE",
          item: {
            ...item.item,
            organizationId: item.item.organizationId || config.orgId,
          } as IEntryPointDTO,
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
        return { content: [{ type: "text", text: `Bulk Save Entry Points Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Create_Entry_Point",
    "Create a new Entry Point",
    {
      name: z.string().describe("A unique name for the entry point."),
      channelType: z.string().describe("Setting to indicate the channel type."),
      entryPointType: z.enum(["INBOUND", "OUTBOUND"]).describe("Setting to indicate if this entry point is meant for incoming or outgoing contacts."),
      active: z.boolean().describe("Used to toggle the state of the entrypoint from active to inactive and vice-versa."),
      serviceLevelThreshold: z.number().describe("Allows to set the time that a customer request can be in a queue before the system flags it as outside the service level."),
      maximumActiveContacts: z.number().describe("Caps the maximum number of simultaneous calls for this entry point."),
      description: z.string().optional().describe("A short description of the entry point."),
      assetId: z.string().optional().describe("ID of the asset in IMI that corresponds to this entrypoint."),
      imiOrgType: z.string().optional().describe("Refers to the type of digital channels used by the org. MIXED_MODE, IMI."),
      socialChannelType: z.string().optional().describe("Setting to indicate the type of Social Channel."),
      timezone: z.string().optional().describe("Any routing strategy for this entry point uses the time zone that you select here."),
      flowId: z.string().optional().describe("Flow ID."),
      flowTagId: z.string().optional().describe("Flow Tag ID."),
      musicOnHoldId: z.string().optional().describe("Music on Hold ID."),
      outdialQueueId: z.string().optional().describe("Outdial Queue ID."),
      callbackEnabled: z.boolean().optional().describe("Indicates whether the created resource is call back enabled or not."),
    },
    async (params) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/entry-point`;
      const body: IEntryPointDTO = { ...params, organizationId: config.orgId } as IEntryPointDTO;

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
        return { content: [{ type: "text", text: `Successfully created Entry Point: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Delete_Entry_Point",
    "Delete an existing Entry Point by ID",
    {
      id: z.string().describe("Resource ID of the Entry Point."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/entry-point/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${config.webexToken}`, "Accept": "application/json" },
        });
        if (response.status === 204 || response.ok) {
          return { content: [{ type: "text", text: `Successfully deleted Entry Point with ID: ${id}` }] };
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
    "Get_Entry_Point_by_ID",
    "Retrieve an existing Entry Point by ID",
    {
      id: z.string().describe("Resource ID of the Entry Point."),
      includeNames: z.boolean().optional().default(false).describe("Specify whether to include flow override settings reference variable names."),
    },
    async ({ id, includeNames }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      queryParams.append("includeNames", includeNames.toString());

      const url = `${config.baseUrl}/organization/${config.orgId}/entry-point/${id}?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Successfully retrieved Entry Point: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

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
};
