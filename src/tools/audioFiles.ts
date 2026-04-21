import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerAudioFilesTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
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
};
