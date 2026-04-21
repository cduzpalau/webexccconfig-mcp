import { IAddressBookDTO, IAddressBookEntryDTO, IAddressBookBulkExportDTO } from "./addressBooks.js";
import { IContactNumberDTO, IContactNumberBulkExportDTO } from "./contactNumbers.js";
import { IContactServiceQueueDTO, IContactServiceQueueBulkExportDTO } from "./queues.js";
import { IDesktopLayoutDTO, IDesktopLayoutBulkExportDTO } from "./desktopLayouts.js";
import { IDesktopProfileDTO, IDesktopProfileBulkExportDTO } from "./desktopProfiles.js";
import { IEntryPointDTO, IEntryPointBulkExportDTO } from "./entryPoints.js";
import { ITeamDTO, ITeamBulkExportDTO } from "./teams.js";
import { IAuxiliaryCodeDTO, IAuxiliaryCodeBulkExportDTO } from "./auxiliaryCodes.js";
import { IMultimediaProfileDTO, IMultimediaProfileExportDTO } from "./multimediaProfiles.js";
import { IOutdialAniDTO, IOutdialAniEntryDTO, IOutdialAniBulkExportDTO } from "./outdialAnis.js";
import { IDialPlanDTO, IDialPlanBulkExportDTO } from "./dialPlans.js";
import { ISkillDTO, ISkillBulkExportDTO } from "./skills.js";
import { ICadVariableDTO } from "./globalVariables.js";
import { ICadVariableBulkExportDTO } from "./common.js";
import { IDialedNumberMappingDTO, IDialedNumberMappingBulkExportDTO } from "./dialedNumberMappings.js";
/**
 * Data Transfer Object for Bulk Export Address Books.
 */
export interface IBulkExportDTOAddressBook {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IAddressBookBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Contact Numbers.
 */
export interface IBulkExportDTOContactNumber {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IContactNumberBulkExportDTO[];
}

/**
 * Data Transfer Object for Desktop Layout Bulk Export.
 */
export interface IBulkExportDTODesktopLayout {
  pageNumber: number;
  pageSize: number;
  totalResources: number;
  rel: string;
  resources: IDesktopLayoutBulkExportDTO[];
}

/**
 * Data Transfer Object for Entry Point Bulk Export.
 */
export interface IBulkExportDTOEntryPoint {
  pageNumber: number;
  pageSize: number;
  totalResources: number;
  rel: string;
  resources: IEntryPointBulkExportDTO[];
}

/**
 * Data Transfer Object for Contact Service Queue Bulk Export.
 */
export interface IBulkExportDTOContactServiceQueue {
  pageNumber: number;
  pageSize: number;
  totalResources: number;
  rel: string;
  resources: IContactServiceQueueBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Teams.
 */
export interface IBulkExportDTOTeam {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: ITeamBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Auxiliary Codes.
 */
export interface IBulkExportDTOAuxiliaryCode {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IAuxiliaryCodeBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Desktop Profiles.
 */
export interface IBulkExportDTODesktopProfile {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IDesktopProfileBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Dialed Number Mappings.
 */
export interface IBulkExportDTODialedNumberMapping {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IDialedNumberMappingBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Multimedia Profiles.
 */
export interface IBulkExportDTOMultimediaProfile {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IMultimediaProfileExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Outdial ANIs.
 */
export interface IBulkExportDTOOutdialAni {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IOutdialAniBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Dial Plans.
 */
export interface IBulkExportDTODialPlan {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: IDialPlanBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Skills.
 */
export interface IBulkExportDTOSkill {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: ISkillBulkExportDTO[];
}

/**
 * Data Transfer Object for Bulk Export Global Variables.
 */
export interface IBulkExportDTOCadVariable {
  totalResources: number;
  pageNumber: number;
  pageSize: number;
  rel: string;
  resources: ICadVariableBulkExportDTO[];
}

/**
 * Bulk Request Item for Address Book Entry.
 */
export interface IBulkRequestItemAddressBookEntryDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IAddressBookEntryDTO;
}

/**
 * Bulk Request for Address Book Entries.
 */
export interface IBulkRequestDTOAddressBookEntry {
  items: IBulkRequestItemAddressBookEntryDTO[];
}

/**
 * Bulk Request Item for Contact Number.
 */
export interface IBulkRequestItemContactNumberDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IContactNumberDTO;
}

/**
 * Bulk Request for Contact Numbers.
 */
export interface IBulkRequestDTOContactNumber {
  items: IBulkRequestItemContactNumberDTO[];
}

/**
 * Data Transfer Object for Desktop Layout Bulk Request Item.
 */
export interface IBulkRequestItemDesktopLayoutDTO {
  id?: string;
  name: string;
  editedBy: string;
  jsonFileName: string;
  jsonFileContent: string;
  global: boolean;
  status: boolean;
  defaultJsonModified: boolean;
  validated: boolean;
  teamIds?: string[];
  description?: string;
  organizationId?: string;
  version?: number;
}

/**
 * Data Transfer Object for Desktop Layout Bulk Request.
 */
export interface IBulkRequestDTODesktopLayout {
  items: IBulkRequestItemDesktopLayoutDTO[];
}

/**
 * Data Transfer Object for Entry Point Bulk Request Item.
 */
export interface IBulkRequestItemEntryPointDTO {
  itemIdentifier?: number;
  requestAction?: string;
  item: IEntryPointDTO;
}

/**
 * Data Transfer Object for Entry Point Bulk Request.
 */
export interface IBulkRequestDTOEntryPoint {
  items: IBulkRequestItemEntryPointDTO[];
}

/**
 * Data Transfer Object for Contact Service Queue Bulk Request Item.
 */
export interface IBulkRequestItemContactServiceQueueDTO {
  itemIdentifier?: number;
  requestAction?: string;
  item: IContactServiceQueueDTO;
}

/**
 * Data Transfer Object for Contact Service Queue Bulk Request.
 */
export interface IBulkRequestDTOContactServiceQueue {
  items: IBulkRequestItemContactServiceQueueDTO[];
}

/**
 * Data Transfer Object for Bulk Request Item Team.
 */
export interface IBulkRequestItemTeamDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: ITeamDTO;
}

/**
 * Data Transfer Object for Bulk Request Teams.
 */
export interface IBulkRequestDTOTeam {
  items: IBulkRequestItemTeamDTO[];
}

/**
 * Bulk Request Item for Auxiliary Code.
 */
export interface IBulkRequestItemAuxiliaryCodeDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IAuxiliaryCodeDTO;
}

/**
 * Bulk Request for Auxiliary Codes.
 */
export interface IBulkRequestDTOAuxiliaryCode {
  items: IBulkRequestItemAuxiliaryCodeDTO[];
}

/**
 * Bulk Request Item for Desktop Profile.
 */
export interface IBulkRequestItemDesktopProfileDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IDesktopProfileDTO;
}

/**
 * Bulk Request for Desktop Profiles.
 */
export interface IBulkRequestDTODesktopProfile {
  items: IBulkRequestItemDesktopProfileDTO[];
}

/**
 * Bulk Request Item for Dialed Number Mapping.
 */
export interface IBulkRequestItemDialedNumberMappingDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IDialedNumberMappingDTO;
}

/**
 * Bulk Request for Dialed Number Mappings.
 */
export interface IBulkRequestDTODialedNumberMapping {
  items: IBulkRequestItemDialedNumberMappingDTO[];
}

/**
 * Bulk Request Item for Multimedia Profile.
 */
export interface IBulkRequestItemMultimediaProfileDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IMultimediaProfileDTO;
}

/**
 * Bulk Request for Multimedia Profiles.
 */
export interface IBulkRequestDTOMultimediaProfile {
  items: IBulkRequestItemMultimediaProfileDTO[];
}

/**
 * Bulk Request Item for Outdial ANI.
 */
export interface IBulkRequestItemOutdialAniDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IOutdialAniDTO;
}

/**
 * Bulk Request for Outdial ANIs.
 */
export interface IBulkRequestDTOOutdialAni {
  items: IBulkRequestItemOutdialAniDTO[];
}

/**
 * Bulk Request Item for Outdial ANI Entry.
 */
export interface IBulkRequestItemOutdialAniEntryDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IOutdialAniEntryDTO;
}

/**
 * Bulk Request for Outdial ANI Entries.
 */
export interface IBulkRequestDTOOutdialAniEntry {
  items: IBulkRequestItemOutdialAniEntryDTO[];
}

/**
 * Bulk Request Item for Dial Plan.
 */
export interface IBulkRequestItemDialPlanDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: IDialPlanDTO;
}

/**
 * Bulk Request for Dial Plans.
 */
export interface IBulkRequestDTODialPlan {
  items: IBulkRequestItemDialPlanDTO[];
}

/**
 * Bulk Request Item for Skill.
 */
export interface IBulkRequestItemSkillDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: ISkillDTO;
}

/**
 * Bulk Request for Skills.
 */
export interface IBulkRequestDTOSkill {
  items: IBulkRequestItemSkillDTO[];
}

/**
 * Bulk Request Item for Global Variable.
 */
export interface IBulkRequestItemCadVariableDTO {
  itemIdentifier: number;
  requestAction: "SAVE" | "DELETE";
  item: ICadVariableDTO;
}

/**
 * Bulk Request for Global Variables.
 */
export interface IBulkRequestDTOCadVariable {
  items: IBulkRequestItemCadVariableDTO[];
}
