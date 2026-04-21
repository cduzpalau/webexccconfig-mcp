/**
 * Valid Global Variable Types.
 */
export type GlobalVariableType = 
  | "STRING" 
  | "INTEGER" 
  | "DATE_TIME" 
  | "BOOLEAN" 
  | "DECIMAL"
  | "String"
  | "Integer"
  | "DateTime"
  | "Boolean"
  | "Decimal";

/**
 * Data Transfer Object for Global Variable (CadVariable).
 */
export interface ICadVariableDTO {
  /** A name for the Global Variable. */
  name: string;
  /** A default value for the Global Variable. */
  defaultValue: string;
  /** A valid Global Variable Type. */
  variableType: GlobalVariableType;
  /** Indicates whether the Global Variable is active or not. */
  active: boolean;
  /** Indicates whether the Global Variable is editable in the Agent Desktop by the agent or not. */
  agentEditable: boolean;
  /** Indicates whether the agent can view the Global Variable in Agent Desktop or not. */
  agentViewable: boolean;
  /** Indicates whether the Global Variable is reportable or not. */
  reportable: boolean;
  /** The description for the Global Variable created. */
  description?: string;
  /** A desktop label for the Global Variable created. */
  desktopLabel?: string;
  /** Indicates whether the Global Variable is sensitive or not. */
  sensitive?: boolean;
  /** Indicates whether the created resource is system created or not. */
  systemDefault?: boolean;
  /** ID of the contact center organization. */
  organizationId?: string;
  /** The version of this resource. */
  version?: number;
  /** ID of this contact center resource. */
  id?: string;
  /** Creation time (in epoch millis) of this resource. (Read-only) */
  createdTime?: number;
  /** Time (in epoch millis) when this resource was last updated. (Read-only) */
  lastUpdatedTime?: number;
}
