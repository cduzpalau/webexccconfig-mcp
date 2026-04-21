/**
 * Data Transfer Object for Auxiliary Code.
 */
export interface IAuxiliaryCodeDTO {
  /** A name for the code. */
  name: string;
  /** Indicates whether the code is active or not active. */
  active: boolean;
  /** Indicates whether this is the default code or not. */
  defaultCode: boolean;
  /** Indicates the work type id associated with this code. */
  workTypeId: string;
  /** Indicates the work type associated with this code. IDLE_CODE, WRAP_UP_CODE. */
  workTypeCode: "IDLE_CODE" | "WRAP_UP_CODE";
  /** Indicates the idle code Inclusion status for agent burnout calculation. */
  burnoutInclusion?: "NOT_APPLICABLE" | "EXCLUDED" | "INCLUDED";
  /** A short description indicating the context of the code. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Indicates whether this is the system default code or not. */
  isSystemCode?: boolean;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Auxiliary Code Bulk Export.
 */
export interface IAuxiliaryCodeBulkExportDTO {
  name: string;
  description?: string;
  defaultCode?: string;
  workTypeName?: string;
}
