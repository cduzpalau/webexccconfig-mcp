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
 * Site Team Pair for Desktop Profile Bulk Export.
 */
export interface ISiteTeamPairDTO {
  siteName: string;
  teamName: string;
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
