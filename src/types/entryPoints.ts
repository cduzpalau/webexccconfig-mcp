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
