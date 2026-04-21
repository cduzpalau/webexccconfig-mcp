/**
 * Data Transfer Object for Skill.
 */
export interface ISkillDTO {
  /** Indicates the name of the skill. */
  name: string;
  /** PROFICIENCY, BOOLEAN, TEXT, ENUM. */
  skillType: "Proficiency" | "Boolean" | "Text" | "enum";
  /** Indicates the status of the skill. */
  active: boolean;
  /** Allows to set the time that a customer request can be in a queue before being flagged. */
  serviceLevelThreshold: number;
  /** Indicates the description of the skill. */
  description?: string;
  /** If skillType is enum, the sub-values are defined here. */
  enumSkillValues?: IEnumSkillValueDTO[];
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Enum Skill Value.
 */
export interface IEnumSkillValueDTO {
  /** Indicates the name of the enumSkillValue. */
  name: string;
  /** Indicates the description of the enumSkillValue. */
  description?: string;
  /** Represents the skillId of the enumSkillValue. */
  skillId?: string;
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Active Skill.
 */
export interface IActiveSkillDTO {
  skillId: string;
  booleanValue: boolean;
  proficiencyValue?: number;
  textValue?: string;
  skillName?: string;
  id?: string;
  organizationId?: string;
  version?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Active Enum Skill.
 */
export interface IActiveEnumSkillDTO {
  enumSkillValueId: string;
  enumSkillId?: string;
  enumSkillName?: string;
  enumSkillValue?: string;
  id?: string;
  organizationId?: string;
  version?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Skill Profile.
 */
export interface ISkillProfileDTO {
  /** Indicates the name of the skill Profile. */
  name: string;
  /** A short description of the skill profile. */
  description?: string;
  /** List of active skills. */
  activeSkills: IActiveSkillDTO[];
  /** List of active enum skills. */
  activeEnumSkills?: IActiveEnumSkillDTO[];
  /** ID of this contact center resource. */
  id?: string;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}

/**
 * Data Transfer Object for Skill Bulk Export Resource.
 */
export interface ISkillBulkExportDTO {
  name: string;
  description?: string;
  serviceLevelThreshold?: string;
  skillType?: string;
  enumSkillValues?: string[];
}
