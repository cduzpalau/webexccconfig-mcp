import { WebexClient } from "../client/WebexClient.js";
import { registerGlobalVariablesTools } from "./globalVariables.js";
import { registerAddressBooksTools } from "./addressBooks.js";
import { registerContactNumbersTools } from "./contactNumbers.js";
import { registerDesktopLayoutsTools } from "./desktopLayouts.js";
import { registerAudioFilesTools } from "./audioFiles.js";
import { registerQueuesTools } from "./queues.js";
import { registerSkillsTools } from "./skills.js";
import { registerEntryPointsTools } from "./entryPoints.js";
import { registerTeamsTools } from "./teams.js";
import { registerUsersTools } from "./users.js";
import { registerAuxiliaryCodesTools } from "./auxiliaryCodes.js";
import { registerBusinessHoursTools } from "./businessHours.js";
import { registerDesktopProfilesTools } from "./desktopProfiles.js";
import { registerDialedNumberMappingsTools } from "./dialedNumberMappings.js";
import { registerCommonTools } from "./common.js";
import { registerDialPlansTools } from "./dialPlans.js";
import { registerMultimediaProfilesTools } from "./multimediaProfiles.js";
import { registerOutdialAnisTools } from "./outdialAnis.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { IServerConfig } from "../types/index.js";

export function registerAllTools(server: McpServer, client: WebexClient, config: IServerConfig | null) {
  registerGlobalVariablesTools(server, client, config);
  registerAddressBooksTools(server, client, config);
  registerContactNumbersTools(server, client, config);
  registerDesktopLayoutsTools(server, client, config);
  registerAudioFilesTools(server, client, config);
  registerQueuesTools(server, client, config);
  registerSkillsTools(server, client, config);
  registerEntryPointsTools(server, client, config);
  registerTeamsTools(server, client, config);
  registerUsersTools(server, client, config);
  registerAuxiliaryCodesTools(server, client, config);
  registerBusinessHoursTools(server, client, config);
  registerDesktopProfilesTools(server, client, config);
  registerDialedNumberMappingsTools(server, client, config);
  registerCommonTools(server, client, config);
  registerDialPlansTools(server, client, config);
  registerMultimediaProfilesTools(server, client, config);
  registerOutdialAnisTools(server, client, config);
}
