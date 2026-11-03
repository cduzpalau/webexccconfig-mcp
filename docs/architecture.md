# v2 architecture (2.1)

## Purpose
webexccconfig-mcp fills the gaps in Cisco's official Webex Contact Center MCP server. It covers the
config resources the official server doesn't (queues, skills, teams, users, desktop profiles, global
variables, …), plus the flow operations it lacks (list, export, import, unlock, delete). It runs over
**stdio only**, with no HTTP, SSE or Docker.

## Components
| Module | Role |
|---|---|
| `src/index.ts` | Loads config, validates that a token is present, registers tools, connects the stdio transport |
| `src/config.ts` | Loads the YAML config plus env: region, org id, mode, enabled toolsets, `defer_to_official` list, log/snapshot/export dirs (Zod-validated) |
| `src/auth.ts` | `TokenProvider` interface and the current static-token implementation |
| `src/client.ts` | The **only** code that calls the WxCC REST API. Builds regional URLs for both path families (`/organization/{orgid}/…` and `/{orgid}/project/…`), fills `{orgid}`, normalises errors |
| `src/registry/` | Generated resource registry (`npm run gen:registry`). Never hand-edited |
| `src/tools/` | The fixed set of generic tools |
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
`org`, `digital`, `ai` or `flow`. Config chooses which toolsets are enabled. Deprecated operations are not
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
                    src/client.ts (TokenProvider, region URL, {orgid}, error mapping)
                         ▼
        WxCC regional gateway: config API + flow store
```
