# v2 architecture (2.3)

## Purpose
webexccconfig-mcp fills the gaps in Cisco's official Webex Contact Center MCP server. It covers the
config resources the official server doesn't (queues, skills, teams, users, desktop profiles, global
variables, …), plus the flow operations it lacks (list, export, import, unlock, delete), and the Webex
people behind agents, with their licenses (Webex People API). It runs over **stdio only**, with no HTTP,
SSE or Docker.

## Components
| Module | Role |
|---|---|
| `src/index.ts` | Loads config, validates that a token is present, registers tools, connects the stdio transport |
| `src/config.ts` | Loads the YAML config plus env: region, org id, Webex API host, mode, enabled toolsets, `defer_to_official` list, log/snapshot/export dirs (Zod-validated) |
| `src/auth.ts` | `TokenProvider` interface and the current static-token implementation |
| `src/client.ts` | The **only** code that calls the WxCC and Webex REST APIs. Builds regional URLs for the WxCC path families (`/organization/{orgid}/…`, `/{orgid}/project/…`) and Webex URLs for `/v1/…`, fills `{orgid}`, normalises both APIs' errors, reads the `Link` cursor |
| `src/registry/` | Generated resource registry (`npm run gen:registry`). Never hand-edited |
| `src/tools/` | The fixed set of generic tools; `delete.ts` holds the shared delete step and bulk delete, `refs.ts` resolves license and role names |
| `src/write/` | Write pipeline: snapshot, merge, diff, operation log, audio conversion, local JSON files (`saveTo`/`bodyFile`) |

## Generic tools over a generated registry
The server exposes a small, fixed tool set. Every tool name is prefixed `wxcc-ext-`:

- `list-resource-types`
- `describe-resource`
- `list`
- `get`
- `create`
- `update`
- `delete`
- `bulk`
- `action` (non-CRUD writes such as purge, reassign-agents, reskill, flow import/unlock)

Each tool takes a `resource` key (e.g. `contact-service-queue`) and resolves it against the registry.
The registry entry gives the method, path, API version, path/query params, ID field, parent resource,
update semantics, readOnly and required fields for each operation (see the `RegistryEntry` interface in
[refactor-plan.md](refactor-plan.md#c-apireference-format-and-generator-approach)).

The always-loaded tool schemas stay small and generic. `describe-resource` returns the full DTO schema
for one resource on demand. Adding or fixing a resource means re-running `scripts/fetch-spec.ts` (which
snapshots the OpenAPI embedded in developer.webex.com into `apireference/openapi/`) and regenerating
the registry, never adding a `server.tool()` call.

Tool descriptions do not try to describe what Cisco's official server covers; routing between servers is
controlled at a higher level. Read-only non-CRUD operations (references, acl, by-user-id, …) are
reached through a `view` parameter on `list`/`get`.

## Toolsets
Every resource belongs to one toolset: `routing`, `agent`, `telephony`, `media`, `data`, `schedule`,
`org`, `digital`, `ai`, `flow` or `people`. Config chooses which toolsets are enabled. Deprecated operations are not
in the registry. Resources in disabled toolsets don't appear in
`list-resource-types`, and the other tools refuse them.

## Read-only mode
Read-only is the default `mode`. In this mode the write tools (`create`, `update`, `delete`, `bulk`)
are not registered at all. Setting `mode: read-write` enables them, along with `action`.

## Defer list
`defer_to_official` in config defaults to entry points, business hours, dial plans and dial numbers.
Deferred resources are filtered out of the registry at startup. A request for one of them gets a
short "deferred by config" refusal. Leaving the setting out applies the default; `[]` defers nothing.

## Flows (2.1)
Flows come from a second spec snapshot, `apireference/openapi/flows.json` (Flow Orchestration →
Flows). They are served by the same regional gateway as the configuration API, under a different
path family: `/{orgId}/project/{projectId}/…`, where Cisco documents `projectId` as the fixed value
`5e5c9ad6d61f870d6d778c1b`. The generator normalises these paths: `{orgId}` → `{orgid}`, the
project id written in as a literal, and `{flowId}` → `{id}`. Colon verbs (`flows/{id}:export`,
`flows:import`) are split into segments for classification only; the registry keeps the real path.

Flows are split by operation, not deferred. The `flow` override carries an `operations` allowlist,
so only list, get, `view:export`, `action:import`, `action:unlock` and delete are generated. The
official server keeps drafts, save, patch, validate, publish and lock; the generator reports those
as excluded. Two more override fields serve flows: `queryEnums` (e.g. `flowType` FLOW|SUBFLOW) and
`sendDefaults`, which are query values the client sends when the caller gives none. Delete sends
`skipRsEPCheck=false`, so the API checks entry point associations (its own default skips the check),
and list sends `includePagination=true`.

Flow documents are too large to pass through the model, so two generic parameters move them through
local files instead:
- `saveTo` on `get` writes the response to a new `.json` file and returns only the path and size.
- `bodyFile` on `create`/`action` reads the body from a `.json` file. The dry-run shows an outline,
  and the plan hash covers the file content.

Relative paths resolve under `export_dir`, and saving never overwrites. These are parameters on the
existing generic tools, not new tools, so the tool set stays fixed.

## Webex people (2.3)
People, licenses and roles come from a third snapshot, `apireference/openapi/webex-admin.json`, taken from
the admin docs portal ("API Reference (Admin)" → People, Licenses, Roles). They are served by a second host,
`https://webexapis.com` (`webex_base_url`), the same for every region. The snapshot keeps the published
paths (`/people/{personId}`); the generator prefixes the section's `basePath`, so registry paths read
`/v1/people/{id}`, and the client sends every `/v1/…` path to the Webex host. Everything else is the same
registry and the same tools.

The two APIs differ in ways the registry and tools absorb:
- **Org.** Webex paths carry no org: the API acts on the token's own organization. Before the first Webex
  call the server reads `/v1/people/me` and refuses Webex calls unless its `orgId` (base64 of
  `ciscospark://us/ORGANIZATION/<uuid>`) holds the configured `org_id`. The result also gives the token
  owner's person id, which delete and bulk delete refuse to remove.
- **Paging.** Webex lists return `{items}` and the next page as a `cursor` in the `Link` header. The generator
  adds a `cursor` query param to list ops whose spec documents a `Link` header; the list tool maps `pageSize`
  to `max` and returns `meta.nextCursor`.
- **Confirms.** A person has no `version`, and Webex changes some read-only fields on its own (presence,
  `lastModified` a few seconds after a create). The override's `volatileFields` are dropped from every read a
  write makes, so the content hash pins only fields an update can write. `readOnlyFromBody` marks every field
  of the GET response that the PUT body lacks as read-only, so the merged PUT leaves them out.
- **Names.** `nameRefs` declares body fields that hold other resources' ids (`licenses` → `license`,
  `roles` → `role`). `src/tools/refs.ts` resolves names to ids before the plan is hashed, so the dry-run shows
  and the confirm pins the exact ids.
- **Partial writes.** The People API applies a PUT part by part (206 when some fields did not take) and can
  create a person while answering with an error. Updates re-read the record after a 206, or after an error or
  timeout on the Webex API, and report which requested fields took effect. A failed create looks the person
  up by the `createLookup` query (`email`).

## Write pipeline
Every write goes through the same steps:

1. **snapshot**: GET the current resource and store it locally.
2. **build**: if the resource has PATCH, send the partial change as PATCH. Otherwise deep-merge it onto
   the current resource, strip readOnly fields, keep `version` and PUT.
3. **dry-run/diff**: the default. Returns the diff and a confirmation hash, with no API change.
4. **apply**: requires the hash. The plan is rebuilt from a fresh read, so a changed `version`
   (stale) or changed arguments produce a different hash and the write is rejected. A record without a
   `version` is pinned by `lastUpdatedTime` plus a content hash, because the timestamp has one-second
   resolution. The hash puts array elements in a fixed order first: the API returns some arrays
   (`activeSkills`, `loginVoiceOptions`) in a different order on every read. Otherwise the
   before-state is snapshotted and the request goes through `client.ts`.
5. **log**: appends a line to the operation log.

**Deletes** (`src/tools/delete.ts`) add two steps to apply:
- A **412** is rebuilt to name the referring records. They come from the error body (the Flows API lists
  dependent flows, subflows and entry points there) or, when the body only gives entity types, from the
  resource's references view.
- A **timed-out DELETE** is re-checked: the record is read again after 2, 7 and 17 s, and a 404 counts as
  deleted. Ops can carry a longer timeout from the registry (`timeoutMs`, flow delete: 90 s).

**Bulk delete** (`wxcc-ext-bulk` `operation: "delete"`) runs this single-record delete over up to 50 ids,
with `bulk_concurrency` in flight. It does not use the native `/bulk` endpoint. Flows have none, and on some
resources a native batch fails as a whole when one item is in use. The dry-run reads every record and skips
missing ids and system defaults (`systemDefault: true`). The hash pins every record's state. Apply re-reads,
then snapshots and deletes each record and collects per-record results; one failure does not stop the
others. Clients that send a progress token get one notification per record, and cancellation stops records
not yet started.

The **operation log** records every operation, reads included. It is a set of daily text files,
`~/.wxcc-ext/logs/wxcc-ext-YYYY-MM-DD.log`, with one timestamped JSON object per line, so it is
grep- and jq-searchable. The token is never recorded. Before-snapshots of applied writes go to
`~/.wxcc-ext/snapshots/`.

**Audio:** audio-file and greeting uploads accept a local file or text. Text is synthesised with
macOS `say`. Either input is converted with `ffmpeg` to the required WAV format and uploaded as
multipart. If a tool is missing, the user is asked for an alternative.

Tool handlers never call `fetch`.

## Auth provider interface
```ts
interface TokenProvider { getToken(): Promise<string>; }
```
Today a static provider reads `WEBEX_TOKEN` from env. An OAuth refresh provider can replace it later
without touching the tools or the client. The token is never logged, printed or written anywhere.

## Request flow
```
MCP client ──stdio──▶ wxcc-ext-<tool>
                         │ resolve resource in registry (toolset / defer / mode checks)
                         ▼
             read ───────┴─────── write
               │                    │ snapshot → merge → dry-run diff → apply → audit
               ▼                    ▼
                    src/client.ts (TokenProvider, host by path, {orgid}, error mapping)
                         ▼                                   ▼
        WxCC regional gateway: config API + flow store    webexapis.com: people, licenses, roles
```
