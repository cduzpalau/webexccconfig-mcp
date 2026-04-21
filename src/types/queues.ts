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
 * Data Transfer Object for Queues Count.
 */
export interface IQueuesCountDTO {
  agentBased: number;
  skillBased: number;
  teamBased: number;
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
