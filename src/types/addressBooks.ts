/**
 * Data Transfer Object for Address Book.
 */
export interface IAddressBookDTO {
  /** A name for the address book. */
  name: string;
  /** A parent type which indicates whether the address book is accessible for all sites or a specific site. */
  parentType: "ORGANIZATION" | "SITE";
  /** A short description indicating the context of the address book. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The specific site id where the address book is accessible. */
  siteId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Address Book Entry.
 */
export interface IAddressBookEntryDTO {
  /** A name for the address book entry. */
  name: string;
  /** The phone number for the entry. */
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
 * Entry details for Address Book Bulk Export.
 */
export interface IAddressBookEntryDetailsDTO {
  /** A name for the address book entry. */
  entryName: string;
  /** The phone number for the entry. */
  phoneNumber: string;
}

/**
 * Data Transfer Object for Address Book Bulk Export Resource.
 */
export interface IAddressBookBulkExportDTO {
  /** The id for the address book in the bulk export request. */
  id: string;
  /** A name for the address book in the bulk export request. */
  name: string;
  /** A short description indicating the context of the address book. */
  description?: string;
  /** The specific site id where the address book is accessible. */
  parentSite?: string;
  /** Entry details for the address book. */
  entryDetails?: IAddressBookEntryDetailsDTO[];
}
