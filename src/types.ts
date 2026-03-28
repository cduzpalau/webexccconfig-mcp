/**
 * Configuration for the Webex Contact Center MCP Server.
 */
export interface IServerConfig {
  /**
   * Webex API Token for authentication.
   */
  webexToken: string;
  /**
   * Webex Contact Center Organization ID.
   */
  orgId: string;
  /**
   * Datacenter specific base URL (e.g., https://api.wxcc-us1.cisco.com/v1).
   */
  baseUrl: string;
}

/**
 * Valid Global Variable Types.
 */
export type GlobalVariableType = 
  | "STRING" 
  | "INTEGER" 
  | "DATE_TIME" 
  | "BOOLEAN" 
  | "DECIMAL"
  | "String"
  | "Integer"
  | "DateTime"
  | "Boolean"
  | "Decimal";

/**
 * Data Transfer Object for Global Variable (CadVariable).
 */
export interface ICadVariableDTO {
  /** A name for the Global Variable. */
  name: string;
  /** A default value for the Global Variable. */
  defaultValue: string;
  /** A valid Global Variable Type. */
  variableType: GlobalVariableType;
  /** Indicates whether the Global Variable is active or not. */
  active: boolean;
  /** Indicates whether the Global Variable is editable in the Agent Desktop by the agent or not. */
  agentEditable: boolean;
  /** Indicates whether the agent can view the Global Variable in Agent Desktop or not. */
  agentViewable: boolean;
  /** Indicates whether the Global Variable is reportable or not. */
  reportable: boolean;
  /** The description for the Global Variable created. */
  description?: string;
  /** A desktop label for the Global Variable created. */
  desktopLabel?: string;
  /** Indicates whether the Global Variable is sensitive or not. */
  sensitive?: boolean;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** ID of this contact center resource. */
  id?: string;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Address Book.
 */
export interface IAddressBookDTO {
  /** A name for the address book. */
  name: string;
  /** A parent type which indicates whether the address book is accessible for all sites or a specific site. */
  parentType: "ORGANIZATION" | "SITE";
  /** A short description indicating the context of the address book. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The specific site id where the address book is accessible. */
  siteId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Address Book Entry.
 */
export interface IAddressBookEntryDTO {
  /** A name for the address book entry. */
  name: string;
  /** The phone number for the entry. */
  number: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Entry details for Address Book Bulk Export.
 */
export interface IAddressBookEntryDetailsDTO {
  /** A name for the address book entry. */
  entryName: string;
  /** The phone number for the entry. */
  phoneNumber: string;
}

/**
 * Data Transfer Object for Address Book Bulk Export Resource.
 */
export interface IAddressBookBulkExportDTO {
  /** The id for the address book in the bulk export request. */
  id: string;
  /** A name for the address book in the bulk export request. */
  name: string;
  /** A short description indicating the context of the address book. */
  description?: string;
  /** The specific site id where the address book is accessible. */
  parentSite?: string;
  /** Entry details for the address book. */
  entryDetails?: IAddressBookEntryDetailsDTO[];
}

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
 * Data Transfer Object for Contact Number.
 */
export interface IContactNumberDTO {
  /** The customized ani number. */
  number: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Resource for Contact Number Bulk Export.
 */
export interface IContactNumberBulkExportDTO {
  number: string;
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
 * Data Transfer Object for Audio File Info.
 */
export interface IAudioFileInfoDTO {
  /** A name for the Agent's personal greeting file. It should have valid extension i.e. .wav */
  name: string;
  /** Indicates Content-Type of the Audio file. */
  contentType: "AUDIO_WAV" | "TEXT_HTML" | "TEXT_PHP" | "AUDIO_X_WAV" | "APPLICATION_OCTET_STREAM";
  /** Identifier for the audio file. */
  blobId?: string;
  /** A short description of the dial plan. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** Audio file download url. */
  url?: string;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Version of the resource. */
  version?: number;
  /** Extra field often present in payload. */
  audioFile?: string;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Agent Personal Greeting.
 */
export interface IAgentGreetingDTO {
  /** Agent Id with which this greeting file is to be associated with. */
  agentId: string;
  /** A name for the Agent's personal greeting file. It should have valid extension i.e. .wav */
  name: string;
  /** Indicates Content-Type of the Audio file. */
  contentType: "AUDIO_WAV" | "TEXT_HTML" | "TEXT_PHP" | "AUDIO_X_WAV" | "APPLICATION_OCTET_STREAM";
  /** This is used to identify the purpose of a greeting. */
  attributeTag?: string;
  /** Identifier for the audio file. */
  blobId?: string;
  /** Id of the Agent in common identity. */
  ciUserId?: string;
  /** Email of the Agent. */
  email?: string;
  /** First Name of the Agent. */
  firstName?: string;
  /** Last Name of the Agent. */
  lastName?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** Audio file download url. */
  url?: string;
  /** Indicates whether the Agent is active. */
  agentActive?: boolean;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
  /** Extra field often present in payload. */
  audioFile?: string;
}

/**
 * Data Transfer Object for Queue Agent.
 */
export interface IQueueAgentsDTO {
  id: string;
  ciUserId?: string;
}

/**
 * Data Transfer Object for Call Distribution Group.
 */
export interface ICallDistributionGroupDTO {
  order: number;
  duration?: number;
  agentGroups: Array<{ teamId: string }>;
}

/**
 * Data Transfer Object for Queue Skill Requirement.
 */
export interface IQueueSkillRequirementDTO {
  skillId: string;
  condition: string;
  skillValue: string;
  id?: string;
  version?: number;
  skillName?: string;
  skillType?: string;
  organizationId?: string;
}

/**
 * Data Transfer Object for Contact Service Queue.
 */
export interface IContactServiceQueueDTO {
  /** Name of the Contact Service Queue */
  name: string;
  /** Setting to indicate the channel type. TELEPHONY, EMAIL, SOCIAL_CHANNEL, CHAT. */
  channelType: string;
  /** INBOUND or OUTBOUND. */
  queueType: "INBOUND" | "OUTBOUND";
  /** TEAM_BASED, SKILL_BASED, AGENT_BASED. */
  queueRoutingType: string;
  /** LONGEST_AVAILABLE_AGENT, SKILLS_BASED, CIRCULAR, LINEAR. */
  routingType: string;
  /** Specify whether the queue is active or not active. */
  active: boolean;
  /** The maximum number of simultaneous contacts allowed. */
  maxActiveContacts: number;
  /** The time in seconds before overflow. */
  maxTimeInQueue: number;
  /** The time in seconds for service level flag. */
  serviceLevelThreshold: number;
  /** Exclude teams with no logged in agents. */
  checkAgentAvailability: boolean;
  
  /** Mandatory for TELEPHONY channelType */
  recordingPermitted?: boolean;
  ivrRequeueUrl?: boolean;
  recordingAllCallsPermitted?: boolean;
  monitoringPermitted?: boolean;
  parkingPermitted?: boolean;
  pauseRecordingPermitted?: boolean;
  controlFlowScriptUrl?: string;
  defaultMusicInQueueMediaFileId?: string;

  /** Optional fields */
  id?: string;
  description?: string;
  organizationId?: string;
  version?: number;
  agentsLastUpdatedTime?: number;
  agentsLastUpdatedByUserName?: string;
  agentsLastUpdatedByUserEmailPrefix?: string;
  overflowNumber?: string;
  skillBasedRoutingType?: string;
  socialChannelType?: string;
  subscriptionId?: string;
  timezone?: string;
  vendorId?: string;
  xspVersion?: string;
  manuallyAssignable?: boolean;
  outdialCampaignEnabled?: boolean;
  systemDefault?: boolean;
  recordingPauseDuration?: number;

  /** Nested Objects */
  assistantSkill?: { assistantSkillId: string; assistantSkillUpdatedTime?: number };
  agents?: IQueueAgentsDTO[];
  callDistributionGroups?: ICallDistributionGroupDTO[];
  queueSkillRequirements?: IQueueSkillRequirementDTO[];

  /** Read-only */
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Enum Skill Value.
 */
export interface IEnumSkillValueDTO {
  /** Indicates the name of the enumSkillValue. */
  name: string;
  /** Indicates the description of the enumSkillValue. */
  description?: string;
  /** Represents the skillId of the enumSkillValue. */
  skillId?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Skill.
 */
export interface ISkillDTO {
  /** Indicates the name of the skill. */
  name: string;
  /** PROFICIENCY, BOOLEAN, TEXT, ENUM. */
  skillType: "Proficiency" | "Boolean" | "Text" | "enum";
  /** Indicates the status of the skill. */
  active: boolean;
  /** Allows to set the time that a customer request can be in a queue before being flagged. */
  serviceLevelThreshold: number;
  /** Indicates the description of the skill. */
  description?: string;
  /** If skillType is enum, the sub-values are defined here. */
  enumSkillValues?: IEnumSkillValueDTO[];
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Desktop Layout.
 */
export interface IDesktopLayoutDTO {
  /** A name for the Desktop Layout. */
  name: string;
  /** Indicates who modified the Desktop Layout. */
  editedBy: string;
  /** Enter the name of the file. */
  jsonFileName: string;
  /** Indicates if the Desktop Layout is a global layout or a custom layout. */
  global: boolean;
  /** Indicates if the Desktop Layout is in active state or inactive. */
  status: boolean;
  /** Indicates if the default Desktop Layout is modified. */
  defaultJsonModified: boolean;
  /** Indicates if the Desktop Layout is validated. */
  validated: boolean;
  /** ID of this contact center resource. */
  id?: string;
  /** A short description indicating the context of the Desktop Layout. */
  description?: string;
  /** Enter the Desktop Layout json. (Only in Get by ID) */
  jsonFileContent?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** Version of this resource. */
  version?: number;
  /** Specify the teams id to assign to this Desktop Layout. */
  teamIds?: string[];
  /** Validated time (in epoch millis) of this resource. */
  validatedTime?: number;
  /** Default Json Modified time (in epoch millis) of this resource. */
  defaultJsonModifiedTime?: number;
  /** Modified time (in epoch millis) of this resource. */
  modifiedTime?: number;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Entry Point.
 */
export interface IEntryPointDTO {
  /** A unique name for the entry point. */
  name: string;
  /** Setting to indicate the channel type. */
  channelType: string;
  /** INBOUND or OUTBOUND. */
  entryPointType: string;
  /** Indicates whether the state of the entrypoint is active or inactive. */
  active: boolean;
  /** Caps the maximum number of simultaneous calls. */
  maximumActiveContacts: number;
  /** Allows to set the time that a customer request can be in a queue before being flagged. */
  serviceLevelThreshold: number;
  /** ID of this contact center resource. */
  id?: string;
  /** A short description of the entry point. */
  description?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** Version of the resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Active Enum Skill.
 */
export interface IActiveEnumSkillDTO {
  enumSkillValueId: string;
  enumSkillId?: string;
  enumSkillName?: string;
  enumSkillValue?: string;
  id?: string;
  organizationId?: string;
  version?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Active Skill.
 */
export interface IActiveSkillDTO {
  skillId: string;
  booleanValue: boolean;
  proficiencyValue?: number;
  textValue?: string;
  skillName?: string;
  id?: string;
  organizationId?: string;
  version?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Skill Profile.
 */
export interface ISkillProfileDTO {
  /** Indicates the name of the skill Profile. */
  name: string;
  /** A short description of the skill profile. */
  description?: string;
  /** List of active skills. */
  activeSkills: IActiveSkillDTO[];
  /** List of active enum skills. */
  activeEnumSkills?: IActiveEnumSkillDTO[];
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Reference information for errors.
 */
export interface IEntityInfo {
  id?: string;
  name?: string;
}

/**
 * Error details for an operation.
 */
export interface IOperationError {
  description: string;
  entity?: string;
  references?: IEntityInfo[];
}

/**
 * Detailed error information.
 */
export interface IErrorDetails {
  key: string;
  message: IOperationError[];
  reason: string;
}

/**
 * API Error Response structure.
 */
export interface IApiErrorResponse {
  trackingId: string;
  error: IErrorDetails;
}

/**
 * Generic Response Envelope for list operations.
 */
export interface IResponseEnvelope<T> {
  meta: Record<string, any>;
  data: T[];
}

/**
 * Data Transfer Object for Queue Ranking.
 */
export interface IQueueRankingDTO {
  /** Ranking for the queue. */
  rank: number;
  /** ID of this contact center resource. */
  id?: string;
  /** The version of this resource. */
  version?: number;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** ID of the queue. */
  queueId: string;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Team.
 */
export interface ITeamDTO {
  /** Enter the name for the team. */
  name: string;
  /** Team type can be AGENT or CAPACITY. */
  teamType: "AGENT" | "CAPACITY";
  /** Select the status of the team. */
  teamStatus: "IN_SERVICE" | "NOT_AVAILABLE";
  /** Specify whether the team is active or not Active. */
  active: boolean;
  /** Indicates whether the queues should be ranked for the team. */
  rankQueuesForTeam: boolean;
  /** Identifier for a site. */
  siteId: string;
  /** Enter the dial number where the system distributes the calls for this team. (Required for CAPACITY) */
  dialedNumber?: string;
  /** Enter the maximum number of simultaneous contacts. (Required for CAPACITY) */
  capacity?: number;
  /** ID of this contact center resource. */
  id?: string;
  /** ID for an agent desktop layout. */
  desktopLayoutId?: string;
  /** Id of the multimedia profile for this team. */
  multiMediaProfileId?: string;
  /** Id of the skill profile for this team. */
  skillProfileId?: string;
  /** Specify the agents id who will be part of this team. */
  userIds?: string[];
  /** Queue rankings for the team. */
  queueRankings?: IQueueRankingDTO[];
  /** A short description of the team. */
  description?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Name of the site this team belongs to. (Read-only) */
  siteName?: string;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Team Bulk Export.
 */
export interface ITeamBulkExportDTO {
  siteName?: string;
  name?: string;
  teamType?: string;
  multimediaProfileName?: string;
  skillProfileName?: string;
  dialedNumber?: string;
  capacity?: string;
  desktopLayoutName?: string;
  rankQueuesForTeam?: boolean;
  queueRankings?: Array<{ queueName: string; rank: number }>;
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
 * Data Transfer Object for Queues Count.
 */
export interface IQueuesCountDTO {
  agentBased: number;
  skillBased: number;
  teamBased: number;
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
 * Data Transfer Object for Auxiliary Code.
 */
export interface IAuxiliaryCodeDTO {
  /** A name for the code. */
  name: string;
  /** Indicates whether the code is active or not active. */
  active: boolean;
  /** Indicates whether this is the default code or not. */
  defaultCode: boolean;
  /** Indicates the work type id associated with this code. */
  workTypeId: string;
  /** Indicates the work type associated with this code. IDLE_CODE, WRAP_UP_CODE. */
  workTypeCode: "IDLE_CODE" | "WRAP_UP_CODE";
  /** Indicates the idle code Inclusion status for agent burnout calculation. */
  burnoutInclusion?: "NOT_APPLICABLE" | "EXCLUDED" | "INCLUDED";
  /** A short description indicating the context of the code. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Indicates whether this is the system default code or not. */
  isSystemCode?: boolean;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Auxiliary Code Bulk Export.
 */
export interface IAuxiliaryCodeBulkExportDTO {
  name: string;
  description?: string;
  defaultCode?: string;
  workTypeName?: string;
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
 * Data Transfer Object for Working Hours.
 */
export interface IWorkingHoursDTO {
  /** Enter a name for the working hours. */
  name: string;
  /** Days of the week. */
  days: string[];
  /** Start time in HH:mm format. */
  startTime?: string;
  /** End time in HH:mm format. */
  endTime?: string;
}

/**
 * Data Transfer Object for Business Hours.
 */
export interface IBusinessHoursDTO {
  /** Enter a name for the business hours profile. */
  name: string;
  /** The time zone that you provision for your business hour. */
  timezone: string;
  /** Working hours. */
  workingHours: IWorkingHoursDTO[];
  /** (Optional) Enter a description of the profile. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** ID of the holiday list associated with this business hour. */
  holidaysId?: string;
  /** ID of the overrides associated with this business hour. */
  overridesId?: string;
  /** Number of working hours entries. */
  workingHoursCount?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Holiday.
 */
export interface IHolidaysDTO {
  /** Enter a name for the holiday. */
  name: string;
  /** Start date in YYYY-MM-DD format. */
  startDate?: string;
  /** End date in YYYY-MM-DD format. */
  endDate?: string;
}

/**
 * Data Transfer Object for Holiday List.
 */
export interface IHolidayListDTO {
  /** Enter a name for the holiday list. */
  name: string;
  /** Holiday list. */
  holidays: IHolidaysDTO[];
  /** (Optional) Enter a description of the holiday list. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Number of holidays in the list. */
  holidaysCount?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Override.
 */
export interface IOverrideDTO {
  /** Enter a name for the override. */
  name: string;
  /** Start date and time in ISO format. */
  startDateTime?: string;
  /** End date and time in ISO format. */
  endDateTime?: string;
  /** Indicates whether the business is open or closed during this period. */
  workingHours: boolean;
}

/**
 * Data Transfer Object for Overrides.
 */
export interface IOverridesDTO {
  /** Enter a name for the overrides profile. */
  name: string;
  /** The time zone that you provision for your overrides. */
  timezone: string;
  /** Work hours to be overridden. */
  overrides: IOverrideDTO[];
  /** (Optional) Enter a description of the profile. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** The latest override entry. */
  latestOverride?: IOverrideDTO;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}
