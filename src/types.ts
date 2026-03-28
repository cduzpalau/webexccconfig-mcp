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
