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
