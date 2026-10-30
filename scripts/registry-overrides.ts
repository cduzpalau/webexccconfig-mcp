/**
 * Hand-maintained input to scripts/gen-registry.ts: which API path belongs to which registry
 * resource, plus what the specs cannot express (keys, aliases, toolsets, singletons, op names).
 *
 * Every non-deprecated operation in apireference/openapi/configuration.json must match exactly
 * one `base` here (longest match wins), or the generator fails.
 */
import type { Toolset } from "../src/config.js";

export interface ResourceOverride {
  key: string;
  /** Path after /organization/{orgid}, version segments removed; `{x}` matches any placeholder. */
  base: string;
  displayName: string;
  aliases?: string[];
  toolset: Toolset;
  singleton?: boolean;
  parent?: { resource: string; param: string };
  /** Renames for derived view/action names: derived → preferred. */
  rename?: Record<string, string>;
  /** Names for specific source operations ("METHOD path"), for when two ops derive the same name. */
  nameBySource?: Record<string, string>;
}

/** Fields stripped from merged PUT bodies in addition to those the spec marks readOnly. */
export const ALWAYS_READ_ONLY = ["createdTime", "lastUpdatedTime"];

export const RESOURCES: ResourceOverride[] = [
  { key: "address-book", base: "address-book", displayName: "Address Book", toolset: "telephony" },
  {
    key: "address-book-entry",
    base: "address-book/{x}/entry",
    displayName: "Address Book Entry",
    toolset: "telephony",
    parent: { resource: "address-book", param: "addressBookId" },
  },
  {
    key: "agent-personal-greeting",
    base: "agent-personal-greeting",
    displayName: "Agent Personal Greeting",
    aliases: ["greeting", "personal-greeting"],
    toolset: "media",
  },
  { key: "ai-feature", base: "ai-feature", displayName: "AI Feature", toolset: "ai" },
  {
    key: "ai-feature-auto-csat-question",
    base: "ai-feature/auto-csat/question",
    displayName: "AI Feature AutoCSAT Question",
    aliases: ["auto-csat-question"],
    toolset: "ai",
  },
  { key: "asset", base: "asset", displayName: "Asset", toolset: "digital" },
  { key: "audio-file", base: "audio-file", displayName: "Audio File", aliases: ["audio", "prompt"], toolset: "media" },
  {
    key: "auxiliary-code",
    base: "auxiliary-code",
    displayName: "Auxiliary Code",
    aliases: ["aux-code", "idle-code", "wrap-up-code"],
    toolset: "agent",
  },
  { key: "business-hours", base: "business-hours", displayName: "Business Hours", toolset: "schedule" },
  { key: "call-monitoring", base: "call-monitoring", displayName: "Call Monitoring", toolset: "agent" },
  { key: "channel", base: "channel", displayName: "Channel", toolset: "digital" },
  { key: "contact-number", base: "contact-number", displayName: "Contact Number", toolset: "telephony" },
  {
    key: "contact-service-queue",
    base: "contact-service-queue",
    displayName: "Contact Service Queue",
    aliases: ["queue", "csq"],
    toolset: "routing",
  },
  { key: "desktop-layout", base: "desktop-layout", displayName: "Desktop Layout", aliases: ["layout"], toolset: "agent" },
  {
    key: "desktop-profile",
    base: "agent-profile",
    displayName: "Desktop Profile",
    aliases: ["agent-profile"],
    toolset: "agent",
  },
  {
    key: "dial-number",
    base: "dial-number",
    displayName: "Dialed Number Mapping",
    aliases: ["dialed-number-mapping"],
    toolset: "telephony",
  },
  { key: "entry-point", base: "entry-point", displayName: "Entry Point", toolset: "routing" },
  {
    key: "global-variable",
    base: "cad-variable",
    displayName: "Global Variable",
    aliases: ["cad-variable", "variable"],
    toolset: "data",
  },
  { key: "holiday-list", base: "holiday-list", displayName: "Holiday List", toolset: "schedule" },
  { key: "multimedia-profile", base: "multimedia-profile", displayName: "Multimedia Profile", toolset: "agent" },
  {
    key: "organization-setting",
    base: "organization-setting",
    displayName: "Organization Setting",
    toolset: "org",
    singleton: true,
  },
  {
    key: "outdial-ani",
    base: "outdial-ani",
    displayName: "Outdial ANI",
    toolset: "telephony",
    rename: { entry: "all-entries" },
  },
  {
    key: "outdial-ani-entry",
    base: "outdial-ani/{x}/entry",
    displayName: "Outdial ANI Entry",
    toolset: "telephony",
    parent: { resource: "outdial-ani", param: "outDialAniId" },
  },
  { key: "overrides", base: "overrides", displayName: "Overrides", aliases: ["override"], toolset: "schedule" },
  { key: "resource-collection", base: "resource-collection", displayName: "Resource Collection", toolset: "org" },
  { key: "site", base: "site", displayName: "Site", toolset: "org" },
  { key: "skill", base: "skill", displayName: "Skill", toolset: "routing" },
  { key: "skill-profile", base: "skill-profile", displayName: "Skill Profile", toolset: "routing" },
  { key: "team", base: "team", displayName: "Team", toolset: "routing" },
  {
    key: "tenant-configuration",
    base: "tenant-configuration",
    displayName: "Tenant Configuration",
    toolset: "org",
    singleton: true,
  },
  {
    key: "user",
    base: "user",
    displayName: "User",
    aliases: ["agent", "users"],
    toolset: "agent",
    nameBySource: { "GET /organization/{orgid}/user/with-user-profile/{id}": "with-user-profile-by-id" },
  },
  { key: "user-profile", base: "user-profile", displayName: "User Profile", toolset: "agent" },
  { key: "work-type", base: "work-type", displayName: "Work Type", toolset: "agent" },
];
