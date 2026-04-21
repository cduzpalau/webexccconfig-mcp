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
