/**
 * Data Transfer Object for Working Hours.
 */
export interface IWorkingHoursDTO {
  /** Enter a name for the working hours. */
  name: string;
  /** Days of the week. */
  days: string[];
  /** Start time in HH:mm format. */
  startTime?: string;
  /** End time in HH:mm format. */
  endTime?: string;
}

/**
 * Data Transfer Object for Business Hours.
 */
export interface IBusinessHoursDTO {
  /** Enter a name for the business hours profile. */
  name: string;
  /** The time zone that you provision for your business hour. */
  timezone: string;
  /** Working hours. */
  workingHours: IWorkingHoursDTO[];
  /** (Optional) Enter a description of the profile. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** ID of the holiday list associated with this business hour. */
  holidaysId?: string;
  /** ID of the overrides associated with this business hour. */
  overridesId?: string;
  /** Number of working hours entries. */
  workingHoursCount?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Holiday.
 */
export interface IHolidaysDTO {
  /** Enter a name for the holiday. */
  name: string;
  /** Start date in YYYY-MM-DD format. */
  startDate?: string;
  /** End date in YYYY-MM-DD format. */
  endDate?: string;
}

/**
 * Data Transfer Object for Holiday List.
 */
export interface IHolidayListDTO {
  /** Enter a name for the holiday list. */
  name: string;
  /** Holiday list. */
  holidays: IHolidaysDTO[];
  /** (Optional) Enter a description of the holiday list. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Number of holidays in the list. */
  holidaysCount?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Override.
 */
export interface IOverrideDTO {
  /** Enter a name for the override. */
  name: string;
  /** Start date and time in ISO format. */
  startDateTime?: string;
  /** End date and time in ISO format. */
  endDateTime?: string;
  /** Indicates whether the business is open or closed during this period. */
  workingHours: boolean;
}

/**
 * Data Transfer Object for Overrides.
 */
export interface IOverridesDTO {
  /** Enter a name for the overrides profile. */
  name: string;
  /** The time zone that you provision for your overrides. */
  timezone: string;
  /** Work hours to be overridden. */
  overrides: IOverrideDTO[];
  /** (Optional) Enter a description of the profile. */
  description?: string;
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
