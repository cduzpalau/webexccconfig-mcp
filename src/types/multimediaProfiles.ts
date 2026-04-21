/**
 * Data Transfer Object for Multimedia Profile.
 */
export interface IMultimediaProfileDTO {
  /** Enter the name for the multimedia profile. */
  name: string;
  /** Blending mode. */
  blendingMode: "BLENDED" | "BLENDED_REALTIME" | "EXCLUSIVE" | string;
  /** Specify whether the multimedia profile is active. */
  active: boolean;
  /** Specify whether the blending mode is enabled. */
  blendingModeEnabled: boolean;
  /** Define the upper limits for telephony channel. */
  telephony: number;
  /** Define the upper limits for chat channel. */
  chat: number;
  /** Define the upper limits for email channel. */
  email: number;
  /** Define the upper limits for social channel. */
  social: number;
  /** Enter a description for the multimedia profile. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Indicates whether the created resource is system created. */
  systemDefault?: boolean;
  /** Upper limits for manually assignable channels. */
  manuallyAssignable?: IMultimediaProfileChannelDTO;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Multimedia Profile Channel.
 */
export interface IMultimediaProfileChannelDTO {
  /** Define the upper limits for telephony channel. */
  telephony: number;
  /** Define the upper limits for chat channel. */
  chat: number;
  /** Define the upper limits for email channel. */
  email: number;
  /** Define the upper limits for social channel. */
  social: number;
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
 * Data Transfer Object for Multimedia Profile Export.
 */
export interface IMultimediaProfileExportDTO {
  name: string;
  description?: string;
  chat: number;
  email: number;
  fax?: number;
  others?: number;
  social: number;
  telephony: number;
  video?: number;
  active: boolean;
  blendingModeEnabled: boolean;
  blendingMode: string;
  manuallyAssignable?: IMultimediaProfileChannelDTO;
}
