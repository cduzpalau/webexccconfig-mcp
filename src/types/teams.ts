import { IQueueRankingDTO } from "./queues.js";
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
