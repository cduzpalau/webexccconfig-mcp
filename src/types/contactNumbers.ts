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
