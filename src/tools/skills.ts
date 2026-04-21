import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Hack: Import everything config related
import { IServerConfig, IApiErrorResponse, IResponseEnvelope, IAddressBookDTO, IAudioFileInfoDTO, IContactServiceQueueDTO, ISkillDTO, IDesktopLayoutDTO, IEntryPointDTO, ISkillProfileDTO, ITeamDTO, IBulkExportDTOTeam, IBulkRequestDTOTeam, IUserDTO, IUserDetailsRequestDTO, IAddressBookEntryDTO, IBulkRequestDTOAddressBookEntry, IContactNumberDTO, IBulkRequestDTOContactNumber, IBulkExportDTOAddressBook, IBulkExportDTOContactNumber, IAgentGreetingDTO, IAuxiliaryCodeDTO, IBulkExportDTOAuxiliaryCode, IBulkRequestDTOAuxiliaryCode, IBusinessHoursDTO, IHolidayListDTO, IOverridesDTO, IDesktopProfileDTO, IBulkExportDTODesktopProfile, IBulkRequestDTODesktopProfile, IPurgeResponseDTO, IDialedNumberMappingDTO, IBulkExportDTODialedNumberMapping, IBulkRequestDTODialedNumberMapping, IBulkResponseDTO, IEntityReferenceInfoDTO, IDialPlanDTO, IBulkExportDTODialPlan, IBulkRequestDTODialPlan, IMultimediaProfileDTO, IBulkRequestDTOMultimediaProfile, IBulkRequestDTOSkill, IBulkRequestDTOCadVariable, IBulkRequestDTOOutdialAni, IOutdialAniDTO, IBulkRequestDTOOutdialAniEntry, IOutdialAniEntryDTO, IBulkExportDTODesktopLayout, IBulkRequestDTODesktopLayout, IBulkExportDTOEntryPoint, IBulkRequestDTOEntryPoint, IReassignAgentsRequestDTO, IBulkExportDTOContactServiceQueue, IBulkRequestDTOContactServiceQueue, ICadVariableDTO } from "../types/index.js";
import { WebexClient } from "../client/WebexClient.js";

export const registerSkillsTools = (server: McpServer, client: WebexClient, config: IServerConfig | null): void => {
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

server.tool(
    "Get_Skill_by_ID",
    "Retrieve a specific Skill by ID",
    {
      id: z.string().describe("Resource ID of the Skill."),
    },
    async ({ id }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/skill/${id}`;
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
        return { content: [{ type: "text", text: `Successfully retrieved Skill: ${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Update_Skill",
    "Update an existing Skill by ID",
    {
      id: z.string().describe("Resource ID of the Skill."),
      name: z.string().describe("Indicates the name of the skill. Once created, name cannot be modified."),
      skillType: z.enum(["Proficiency", "Boolean", "Text", "enum"]).describe("This can be Proficiency, Boolean, Text, or enum. Once created, skillType cannot be modified."),
      active: z.boolean().describe("Indicates the status of the skill whether it is active or not."),
      serviceLevelThreshold: z.number().int().describe("Allows to set the time that a customer request can be in a queue before the system flags it as outside the service level."),
      version: z.number().int().describe("The version of this resource."),
      description: z.string().optional().describe("Indicates the description of the skill."),
      enumSkillValues: z.array(z.object({
        id: z.string().optional().describe("ID of this contact center resource."),
        name: z.string().describe("Indicates the name of the enumSkillValue."),
        description: z.string().optional().describe("Indicates the description of the enumSkillValue."),
        version: z.number().int().optional().describe("The version of this resource."),
        skillId: z.string().optional().describe("Represents the skillId of the enumSkillValue."),
      })).optional().describe("If skillType is enum, the skill can take different sub-values which are defined with this field."),
    },
    async ({ id, enumSkillValues, ...rest }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/skill/${id}`;
      
      const body: any = {
        ...rest,
        id,
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
          content: [{ type: "text", text: `Successfully updated Skill: ${JSON.stringify(data, null, 2)}` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Export_Skills",
    "Export all Skill(s) in a given organization",
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

      const url = `${config.baseUrl}/organization/${config.orgId}/skill/bulk-export?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Bulk Export Skills:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Bulk_Save_Skills",
    "Create, Update or delete Skill(s) in bulk",
    {
      items: z.array(z.object({
        itemIdentifier: z.number().describe("Unique item identifier for a bulk operation."),
        requestAction: z.enum(["SAVE", "DELETE"]).describe("Identifier for action type."),
        item: z.object({
          name: z.string().describe("Indicates the name of the skill."),
          skillType: z.enum(["Proficiency", "Boolean", "Text", "enum"]).describe("This can be Proficiency, Boolean, Text, or enum."),
          active: z.boolean().describe("Indicates the status of the skill."),
          serviceLevelThreshold: z.number().int().describe("Allows to set the time for service level."),
          id: z.string().optional().describe("ID of this contact center resource."),
          version: z.number().optional().describe("The version of this resource."),
          description: z.string().optional().describe("Indicates the description of the skill."),
          organizationId: z.string().optional().describe("ID of the contact center organization."),
          enumSkillValues: z.array(z.object({
            id: z.string().optional().describe("ID of this contact center resource."),
            name: z.string().describe("Indicates the name of the enumSkillValue."),
            description: z.string().optional().describe("Indicates the description of the enumSkillValue."),
            version: z.number().int().optional().describe("The version of this resource."),
            skillId: z.string().optional().describe("Represents the skillId of the enumSkillValue."),
            organizationId: z.string().optional().describe("ID of the contact center organization."),
          })).optional().describe("If skillType is enum, the skill can take different sub-values."),
        }).describe("The Skill object."),
      })).describe("List of items for bulk operation."),
    },
    async ({ items }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const url = `${config.baseUrl}/organization/${config.orgId}/skill/bulk`;
      const body: IBulkRequestDTOSkill = {
        items: items.map(item => ({
          ...item,
          requestAction: item.requestAction as "SAVE" | "DELETE",
          item: {
            ...item.item,
            organizationId: item.item.organizationId || config.orgId,
            enumSkillValues: item.item.enumSkillValues?.map(val => ({
              ...val,
              organizationId: val.organizationId || config.orgId
            }))
          } as ISkillDTO,
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
        return { content: [{ type: "text", text: `Bulk Save Skills Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "List_Skill_References",
    "List references for a specific Skill",
    {
      id: z.string().describe("Resource ID of the Skill."),
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

      const url = `${config.baseUrl}/organization/${config.orgId}/skill/${id}/incoming-references?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Retrieved references for Skill ${id}:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

server.tool(
    "Purge_Inactive_Skills",
    "Purge inactive Skill(s) older than the configured interval",
    {
      nextStartId: z.string().optional().describe("This is the entity ID from which items for the next purge batch with be selected."),
    },
    async ({ nextStartId }) => {
      if (!config) {
        return { content: [{ type: "text", text: "Error: Server not properly configured." }], isError: true };
      }
      const queryParams = new URLSearchParams();
      if (nextStartId) queryParams.append("nextStartId", nextStartId);

      const url = `${config.baseUrl}/organization/${config.orgId}/skill/purge-inactive-entities?${queryParams.toString()}`;
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
        return { content: [{ type: "text", text: `Purge Inactive Skills Result:\n${JSON.stringify(data, null, 2)}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Network or unexpected error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

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
};
