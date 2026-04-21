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
