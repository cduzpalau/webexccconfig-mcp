import { IQueuesCountDTO } from "./queues.js";
/**
 * Data Transfer Object for User.
 */
export interface IUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  contactCenterEnabled: boolean;
  id?: string;
  organizationId?: string;
  version?: number;
  ciUserId?: string;
  broadCloudUserId?: string;
  dbId?: string;
  deafultDialledNumber?: string;
  externalIdentifier?: string;
  mobile?: string;
  workPhone?: string;
  timezone?: string;
  xspVersion?: string;
  subscriptionId?: string;
  userProfileId?: string;
  siteId?: string;
  siteName?: string;
  teamIds?: string[];
  skillProfileId?: string;
  agentProfileId?: string;
  multimediaProfileId?: string;
  preferredSupervisorTeamId?: string;
  userLevelAutoCSATInclusion?: "INCLUDED" | "EXCLUDED";
  userLevelBurnoutInclusion?: "INCLUDED" | "EXCLUDED";
  userLevelSummariesInclusion?: "INCLUDED" | "EXCLUDED";
  userLevelWellnessBreakReminders?: "DISABLED" | "ENABLED";
  imiUserCreated?: boolean;
  systemDefault?: boolean;
  skillProfileUpdatedBy?: string;
  skillProfileUpdatedTime?: number;
  queuesCount?: IQueuesCountDTO | string;
  userProfileData?: IUserProfileDTO;
  userProfileGranularAccessData?: IUserProfileGranularAccessDTO;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for User Profile.
 */
export interface IUserProfileDTO {
  name: string;
  profileType: string;
  active: boolean;
  accessAllEntryPoints: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  accessAllModules: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  accessAllQueues: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  accessAllSites: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  accessAllTeams: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  description?: string;
  id?: string;
  organizationId?: string;
  version?: number;
  systemDefault?: boolean;
  editableFolderIds?: number[];
  entryPoints?: string[];
  nonViewableFolderIds?: number[];
  queues?: string[];
  sites?: string[];
  teams?: string[];
  viewableFolderIds?: number[];
  userProfileAppModules?: IUserProfileAppModuleDTO[];
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for User Profile App Feature.
 */
export interface IUserProfileAppFeatureDTO {
  appFeatureId: string;
  featureAccessType: "OFF" | "ON";
  appFeatureName?: string;
  id?: string;
  organizationId?: string;
  version?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for User Profile App Module.
 */
export interface IUserProfileAppModuleDTO {
  appModuleId: string;
  moduleAccessType: "NONE" | "VIEW" | "EDIT";
  userProfileAppFeature: IUserProfileAppFeatureDTO[];
  id?: string;
  organizationId?: string;
  version?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for User Profile Permissions.
 */
export interface IUserProfilePermissionsDTO {
  id: string;
  name: string;
  access: "EDIT" | "VIEW" | "NONE" | "ENABLED" | "DISABLED";
}

/**
 * Data Transfer Object for Resource Types.
 */
export interface IResourceTypesDTO {
  name: string;
  accessLevel: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  ids: string[];
}

/**
 * Data Transfer Object for Resource Collection.
 */
export interface IResourceCollectionDTO {
  id: string;
  name?: string;
  description?: string;
  organizationId?: string;
  version?: number;
  resourceCount?: number;
  resources?: IResourceTypesDTO[];
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for User Profile Granular Access.
 */
export interface IUserProfileGranularAccessDTO {
  name: string;
  profileType: string;
  active: boolean;
  permissionAccessLevel: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  resourceAccessLevel: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  id?: string;
  description?: string;
  organizationId?: string;
  version?: number;
  systemDefault?: boolean;
  defaultResourceCollectionId?: string;
  editableFolderIds?: number[];
  nonViewableFolderIds?: number[];
  viewableFolderIds?: number[];
  permissions?: IUserProfilePermissionsDTO[];
  resourceCollections?: Array<{ id: string }>;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Reassign Agents Request.
 */
export interface IReassignAgentsRequestDTO {
  /** List of agent IDs to add to the queue. */
  add?: string[];
  /** List of agent IDs to remove from the queue. */
  remove?: string[];
}

/**
 * Data Transfer Object for User Details Request.
 */
export interface IUserDetailsRequestDTO {
  userIds?: string[];
  search?: string;
  queueId?: string;
}

/**
 * Data Transfer Object for User Details Response.
 */
export interface IUserDetailsResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Data Transfer Object for User With Skill Details.
 */
export interface IUserWithSkillDetailsDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId?: string;
  version?: number;
  skillProfileName?: string;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for User Bulk Export.
 */
export interface IUserBulkExportDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  active?: boolean;
  contactCenterEnabled?: boolean;
  siteName?: string;
  teamNames?: string;
  userProfileName?: string;
  skillProfileName?: string;
  agentProfileName?: string;
  multimediaProfileName?: string;
}
