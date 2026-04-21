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
