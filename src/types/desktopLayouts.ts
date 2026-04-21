/**
 * Data Transfer Object for Desktop Layout.
 */
export interface IDesktopLayoutDTO {
  /** A name for the Desktop Layout. */
  name: string;
  /** Indicates who modified the Desktop Layout. */
  editedBy: string;
  /** Enter the name of the file. */
  jsonFileName: string;
  /** Indicates if the Desktop Layout is a global layout or a custom layout. */
  global: boolean;
  /** Indicates if the Desktop Layout is in active state or inactive. */
  status: boolean;
  /** Indicates if the default Desktop Layout is modified. */
  defaultJsonModified: boolean;
  /** Indicates if the Desktop Layout is validated. */
  validated: boolean;
  /** ID of this contact center resource. */
  id?: string;
  /** A short description indicating the context of the Desktop Layout. */
  description?: string;
  /** Enter the Desktop Layout json. (Only in Get by ID) */
  jsonFileContent?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** Version of this resource. */
  version?: number;
  /** Specify the teams id to assign to this Desktop Layout. */
  teamIds?: string[];
  /** Validated time (in epoch millis) of this resource. */
  validatedTime?: number;
  /** Default Json Modified time (in epoch millis) of this resource. */
  defaultJsonModifiedTime?: number;
  /** Modified time (in epoch millis) of this resource. */
  modifiedTime?: number;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Desktop Layout Bulk Export Resource.
 */
export interface IDesktopLayoutBulkExportDTO {
  id: string;
  name: string;
  description?: string;
  jsonFileName: string;
  teamNames?: string[];
}
