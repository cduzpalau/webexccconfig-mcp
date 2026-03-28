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
  /** ID of the asset in IMI that corresponds to this entrypoint. */
  assetId?: string;
  /** Refers to the type of digital channels used by the org. MIXED_MODE, IMI. */
  imiOrgType?: string;
  /** Setting to indicate the type of Social Channel. */
  socialChannelType?: string;
  /** Any routing strategy for this entry point uses the time zone that you select here. */
  timezone?: string;
  /** Identifier of a route point of WxC which is similar to entry point of WxCC. */
  routePointId?: string;
  /** Flow ID. */
  flowId?: string;
  /** Flow Tag ID. */
  flowTagId?: string;
  /** Music on Hold ID. */
  musicOnHoldId?: string;
  /** Outdial Queue ID. */
  outdialQueueId?: string;
  /** Destination phone number for overflow. */
  overflowNumber?: string;
  /** Subscription ID for recording events. */
  subscriptionId?: string;
  /** XSP Version for recording events. */
  xspVersion?: string;
  /** Indicates whether the created resource is call back enabled or not. */
  callbackEnabled?: boolean;
  /** Indicates whether the resource is Default Outdial Transfer to Queue. */
  outdialTransferToQueueEnabled?: boolean;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Map of entrypoint to flow mapping count. */
  dnEpMappingCount?: number;
  /** Flow override settings. */
  flowOverrideSettings?: IFlowOverrideSettingDTO[];
}

/**
 * Data Transfer Object for Flow Override Setting.
 */
export interface IFlowOverrideSettingDTO {
  name: string;
  type: string;
  entityType?: string;
  value?: string;
  id?: string;
  entityId?: string;
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
 * Data Transfer Object for Desktop Layout Bulk Export Resource.
 */
export interface IDesktopLayoutBulkExportDTO {
  id: string;
  name: string;
  description?: string;
  jsonFileName: string;
  teamNames?: string[];
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
 * Data Transfer Object for Entry Point Bulk Export Resource.
 */
export interface IEntryPointBulkExportDTO {
  name: string;
  description: string;
  serviceLevelThreshold: string;
  timezone: string;
  channelType: string;
  socialChannelType: string;
  entryPointType: string;
  assetId: string;
  flowId: string;
  flowTag: string;
  musicOnHoldId: string;
  outdialQueueId: string;
  callbackEnabled: boolean;
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
 * Data Transfer Object for Contact Service Queue Bulk Export Resource.
 */
export interface IContactServiceQueueBulkExportDTO {
  id: string;
  name: string;
  description?: string;
  queueType: string;
  channelType: string;
  active: boolean;
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
 * Metadata for Entity Reference Info.
 */
export interface IEntityReferenceMetaDTO {
  orgid: string;
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  referencedEntities: string[];
  currentEntity: string;
  links?: Record<string, string>;
}

/**
 * Data Transfer Object for Entity Reference Information.
 */
export interface IEntityReferenceInfoDTO {
  description: string;
  meta: IEntityReferenceMetaDTO;
  data: IEntityInfo[];
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
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Site Team Pair for Desktop Profile Bulk Export.
 */
export interface ISiteTeamPairDTO {
  siteName: string;
  teamName: string;
}

/**
 * Data Transfer Object for Viewable Statistics in Desktop Profile.
 */
export interface IViewableStatisticsDTO {
  organizationId?: string;
  id?: string;
  version?: number;
  agentStats?: boolean;
  accessQueueStats: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  contactServiceQueues?: string[];
  loggedInTeamStats?: boolean;
  accessTeamStats: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  teams?: string[];
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Desktop Profile (Agent Profile).
 */
export interface IDesktopProfileDTO {
  /** Enter a name for the agent profile. */
  name: string;
  /** ORGANIZATION: enterprise-wide, SITE: specific site. */
  parentType: "ORGANIZATION" | "SITE";
  /** Specify whether the agent profile is active or not Active. */
  active: boolean;
  /** Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED_VALUE', 'NONE' */
  accessBuddyTeam: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  /** Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED_VALUE', 'NONE' */
  accessEntryPoint: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  /** Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED_VALUE', 'NONE' */
  accessIdleCode: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  /** Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED_VALUE', 'NONE' */
  accessQueue: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  /** Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED_VALUE', 'NONE' */
  accessWrapUpCode: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  /** Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED_VALUE', 'NONE' */
  agentDNValidation: "SPECIFIC" | "ALL" | "PROVISIONED_VALUE" | "NONE";
  /** (Optional) Enter a description of the profile. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Identifier for a site. */
  siteId?: string;
  /** This setting allows auto wrap-up after seconds. */
  autoWrapAfterSeconds?: number;
  /** Specify time in minute(s). */
  timeoutDesktopInactivityMins?: number;
  /** Specify the address book id. */
  addressBookId?: string;
  /** Validation criteria setting. */
  agentDNValidationCriteria?: string;
  /** Specify the Outdial ANI id. */
  outdialANIId?: string;
  /** Specify the entry point id for outdial. */
  outdialEntryPointId?: string;
  /** Go to Available state after outdial. */
  agentAvailableAfterOutdial?: boolean;
  /** Allow auto wrap-up extension. */
  allowAutoWrapUpExtension?: boolean;
  /** Automatically answer incoming calls. */
  autoAnswer?: boolean;
  /** Allow auto wrap-up. */
  autoWrapUp?: boolean;
  /** Select a queue as target for consultation. */
  consultToQueue?: boolean;
  /** Enable dial plan. */
  dialPlanEnabled?: boolean;
  /** Allow Last Agent Routing check box. */
  lastAgentRouting?: boolean;
  /** Enable outdial calls. */
  outdialEnabled?: boolean;
  /** Allow external pop-up screens. */
  screenPopup?: boolean;
  /** Show user details of microsoft account. */
  showUserDetailsMS?: boolean;
  /** Show user details of webex account. */
  showUserDetailsWebex?: boolean;
  /** State synchronization of microsoft account. */
  stateSynchronizationMS?: boolean;
  /** State synchronization of webex account. */
  stateSynchronizationWebex?: boolean;
  /** Indicates if resource is system created. */
  systemDefault?: boolean;
  /** Enable time out desktop inactivity feature. */
  timeoutDesktopInactivityCustomEnabled?: boolean;
  /** Validation criteria list. */
  agentDNValidationCriterions?: string[];
  /** Teams list for consultation. */
  buddyTeams?: string[];
  /** Dial plans list. */
  dialPlans?: string[];
  /** Entry points list. */
  entryPoints?: string[];
  /** Idle codes list. */
  idleCodes?: string[];
  /** Login voice options: AGENT_DN, EXTENSION, BROWSER. */
  loginVoiceOptions?: string[];
  /** Queues list. */
  queues?: string[];
  /** Threshold alerts rules. */
  thresholdRules?: string[];
  /** Wrap-up codes list. */
  wrapUpCodes?: string[];
  /** Specifies the Statistics that agent can view. */
  viewableStatistics?: IViewableStatisticsDTO;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Desktop Profile Bulk Export Resource.
 */
export interface IDesktopProfileBulkExportDTO {
  name: string;
  parentType: string;
  description?: string;
  siteId?: string;
  autoWrapAfterSeconds?: number;
  accessBuddyTeam: string;
  accessEntryPoint: string;
  accessIdleCode: string;
  accessQueue: string;
  accessQueueStats: string;
  accessTeamStats: string;
  accessWrapUpCode: string;
  addressBook?: string;
  agentDNValidation: string;
  agentDNValidationCriteria?: string;
  outdialANI?: string;
  outdialEntryPoint?: string;
  agentAvailableAfterOutdial?: boolean;
  agentStats?: boolean;
  allowAutoWrapUpExtension?: boolean;
  autoAnswer?: boolean;
  autoWrapUp?: boolean;
  consultToQueue?: boolean;
  dialPlanEnabled?: boolean;
  lastAgentRouting?: boolean;
  loggedInTeamStats?: boolean;
  outdialEnabled?: boolean;
  screenPopup?: boolean;
  showUserDetailsMS?: boolean;
  showUserDetailsWebex?: boolean;
  stateSynchronizationMS?: boolean;
  stateSynchronizationWebex?: boolean;
  agentDNValidationCriterions?: string[];
  dialPlans?: string[];
  entryPoints?: string[];
  idleCodes?: string[];
  loginVoiceOptions?: string[];
  queues?: string[];
  thresholdRules?: string[];
  viewableStatsQueue?: string[];
  wrapUpCodes?: string[];
  buddyTeamsList?: ISiteTeamPairDTO[];
  viewableStatsTeam?: ISiteTeamPairDTO[];
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
 * Data Transfer Object for Dialed Number Mapping.
 */
export interface IDialedNumberMappingDTO {
  /** The identifier of an entry point. */
  entryPointId: string;
  /** The entryPoint name. */
  entryPointName: string;
  /** The dialed number(DN). */
  dialledNumber?: string;
  /** The extension. */
  extension?: string;
  /** The routing prefix. */
  routingPrefix?: string;
  /** The esn (routing prefix with extension). */
  esn?: string;
  /** The identifier of a route point of WxC. */
  routePointId?: string;
  /** Default dial number for the tenant. */
  defaultAni?: boolean;
  /** The name of the location. */
  location?: string;
  /** The telephony region id. */
  regionId?: string;
  /** Dialed number digits. */
  dialledNumberDigits?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Dialed Number Mapping Bulk Export Resource.
 */
export interface IDialedNumberMappingBulkExportDTO {
  dialledNumber?: string;
  extension?: string;
  routingPrefix?: string;
  esn?: string;
  routePointId?: string;
  entryPointName: string;
  defaultAni?: boolean;
  location?: string;
  regionId?: string;
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
 * Bulk Response Item.
 */
export interface IBulkResponseItemDTO {
  /** Unique item identifier for a bulk operation. */
  itemIdentifier: number;
  /** Indicates the error status code. */
  status: number;
  /** The resource URI of an entity. */
  href?: string;
  /** The kind of operation desired of an entity. */
  operationType?: "CREATE" | "UPDATE" | "DELETE" | "GET";
  /** API Error Response structure. */
  apiError?: IApiErrorResponse;
}

/**
 * Bulk Response.
 */
export interface IBulkResponseDTO {
  items: IBulkResponseItemDTO[];
}

/**
 * Data Transfer Object for Multimedia Profile Channel.
 */
export interface IMultimediaProfileChannelDTO {
  /** Define the upper limits for telephony channel. */
  telephony: number;
  /** Define the upper limits for chat channel. */
  chat: number;
  /** Define the upper limits for email channel. */
  email: number;
  /** Define the upper limits for social channel. */
  social: number;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Multimedia Profile.
 */
export interface IMultimediaProfileDTO {
  /** Enter the name for the multimedia profile. */
  name: string;
  /** Blending mode. */
  blendingMode: "BLENDED" | "BLENDED_REALTIME" | "EXCLUSIVE" | string;
  /** Specify whether the multimedia profile is active. */
  active: boolean;
  /** Specify whether the blending mode is enabled. */
  blendingModeEnabled: boolean;
  /** Define the upper limits for telephony channel. */
  telephony: number;
  /** Define the upper limits for chat channel. */
  chat: number;
  /** Define the upper limits for email channel. */
  email: number;
  /** Define the upper limits for social channel. */
  social: number;
  /** Enter a description for the multimedia profile. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Indicates whether the created resource is system created. */
  systemDefault?: boolean;
  /** Upper limits for manually assignable channels. */
  manuallyAssignable?: IMultimediaProfileChannelDTO;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Multimedia Profile Export.
 */
export interface IMultimediaProfileExportDTO {
  name: string;
  description?: string;
  chat: number;
  email: number;
  fax?: number;
  others?: number;
  social: number;
  telephony: number;
  video?: number;
  active: boolean;
  blendingModeEnabled: boolean;
  blendingMode: string;
  manuallyAssignable?: IMultimediaProfileChannelDTO;
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
 * Data Transfer Object for Outdial ANI Entry.
 */
export interface IOutdialAniEntryDTO {
  /** Enter a name for the outdial ANI entry. */
  name: string;
  /** Enter a valid phone number or valid SIP URI. */
  number: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Outdial ANI.
 */
export interface IOutdialAniDTO {
  /** Enter a name for the outdial ANI. */
  name: string;
  /** (Optional) Enter a description for the outdial ANI. */
  description?: string;
  /** List of outdial ANI entries. */
  outdialANIEntries?: IOutdialAniEntryDTO[];
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Entry details for Outdial ANI Bulk Export.
 */
export interface IOutdialAniEntryDetailsDTO {
  entryName: string;
  entryNumber: string;
}

/**
 * Data Transfer Object for Outdial ANI Bulk Export.
 */
export interface IOutdialAniBulkExportDTO {
  name: string;
  description?: string;
  entryDetails?: IOutdialAniEntryDetailsDTO[];
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
 * Data Transfer Object for Dial Plan.
 */
export interface IDialPlanDTO {
  /** Enter the name for the dial plan. */
  name: string;
  /** Format of the phone number. */
  regularExpression: string;
  /** Specify whether the dial plan is active. */
  active: boolean;
  /** A short description of the dial plan. */
  description?: string;
  /** Prefix added to the phone number. */
  prefix?: string;
  /** Characters removed from the phone number. */
  strippedChars?: string;
  /** Indicates if resource is system created. */
  systemDefault?: boolean;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Dial Plan Bulk Export Resource.
 */
export interface IDialPlanBulkExportDTO {
  name: string;
  description?: string;
  regularExpression: string;
  prefix?: string;
  strippedChars?: string;
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
 * Data Transfer Object for Skill Bulk Export Resource.
 */
export interface ISkillBulkExportDTO {
  name: string;
  description?: string;
  serviceLevelThreshold?: string;
  skillType?: string;
  enumSkillValues?: string[];
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
 * Data Transfer Object for Global Variable Bulk Export Resource.
 */
export interface ICadVariableBulkExportDTO {
  name: string;
  defaultValue: string;
  variableType: string;
  active: boolean;
  agentEditable: boolean;
  agentViewable: boolean;
  reportable: boolean;
  description?: string;
  desktopLabel?: string;
  sensitive?: boolean;
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

/**
 * Data Transfer Object for Link.
 */
export interface ILink {
  href: string;
  hreflang?: string;
  title?: string;
  type?: string;
  deprecation?: string;
  profile?: string;
  name?: string;
  templated?: boolean;
}

/**
 * Data Transfer Object for Generic Response (e.g., Purge).
 */
export interface IPurgeResponseDTO {
  code: number;
  details: Record<string, any>;
  links: ILink[];
}
