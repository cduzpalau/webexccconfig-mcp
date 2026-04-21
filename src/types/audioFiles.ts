/**
 * Data Transfer Object for Audio File Info.
 */
export interface IAudioFileInfoDTO {
  /** A name for the Agent's personal greeting file. It should have valid extension i.e. .wav */
  name: string;
  /** Indicates Content-Type of the Audio file. */
  contentType: "AUDIO_WAV" | "TEXT_HTML" | "TEXT_PHP" | "AUDIO_X_WAV" | "APPLICATION_OCTET_STREAM";
  /** Identifier for the audio file. */
  blobId?: string;
  /** A short description of the dial plan. */
  description?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** Audio file download url. */
  url?: string;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** Version of the resource. */
  version?: number;
  /** Extra field often present in payload. */
  audioFile?: string;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Agent Personal Greeting.
 */
export interface IAgentGreetingDTO {
  /** Agent Id with which this greeting file is to be associated with. */
  agentId: string;
  /** A name for the Agent's personal greeting file. It should have valid extension i.e. .wav */
  name: string;
  /** Indicates Content-Type of the Audio file. */
  contentType: "AUDIO_WAV" | "TEXT_HTML" | "TEXT_PHP" | "AUDIO_X_WAV" | "APPLICATION_OCTET_STREAM";
  /** This is used to identify the purpose of a greeting. */
  attributeTag?: string;
  /** Identifier for the audio file. */
  blobId?: string;
  /** Id of the Agent in common identity. */
  ciUserId?: string;
  /** Email of the Agent. */
  email?: string;
  /** First Name of the Agent. */
  firstName?: string;
  /** Last Name of the Agent. */
  lastName?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** Audio file download url. */
  url?: string;
  /** Indicates whether the Agent is active. */
  agentActive?: boolean;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis). (Read-only) */
  createdTime?: number;
  /** Last updated time (in epoch millis). (Read-only) */
  lastUpdatedTime?: number;
  /** Extra field often present in payload. */
  audioFile?: string;
}
