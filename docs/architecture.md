# v2 architecture

## Purpose
webexccconfig-mcp fills the gaps in Cisco's official Webex Contact Center MCP server. It covers the
config resources the official server doesn't (queues, skills, teams, users, desktop profiles, global
variables, …). It runs over **stdio only**, with no HTTP, SSE or Docker.

## Components
| Module | Role |
|---|---|
| `src/index.ts` | Loads config, validates that a token is present, registers tools, connects the stdio transport |
| `src/config.ts` | Loads the YAML config plus env: region, org id, mode, enabled toolsets, `defer_to_official` list (Zod-validated) |
| `src/auth.ts` | `TokenProvider` interface and the current static-token implementation |
| `src/client.ts` | The **only** code that calls the WxCC REST API. Builds regional URLs, fills `{orgid}`, normalises errors |
| `src/registry/` | Generated resource registry (`npm run gen:registry`). Never hand-edited |
| `src/tools/` | The fixed set of generic tools |
| `src/write/` | Write pipeline: snapshot, merge, diff, audit log |

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
- `action` (non-CRUD writes such as purge, reassign-agents, reskill)

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
`org`, `digital` or `ai`. Config chooses which toolsets are enabled. Deprecated operations are not
in the registry. Resources in disabled toolsets don't appear in
`list-resource-types`, and the other tools refuse them.

## Read-only mode
Read-only is the default `mode`. In this mode the write tools (`create`, `update`, `delete`, `bulk`)
are not registered at all. Setting `mode: read-write` enables them, along with `action`.

## Defer list
`defer_to_official` in config defaults to flows, entry points, business hours, dial plans and dial
numbers. Deferred resources are filtered out of the registry at startup. A request for one of them
gets a short "deferred by config" refusal.

## Write pipeline
Every write goes through the same steps:

1. **snapshot**: GET the current resource and store it locally.
2. **build**: if the resource has PATCH, send the partial change as PATCH. Otherwise deep-merge it onto
   the current resource, strip readOnly fields, keep `version` and PUT.
3. **dry-run/diff**: the default. Returns the diff and a confirmation hash, with no API change.
4. **apply**: requires the hash. The plan is rebuilt from a fresh read, so a changed `version`
   (stale) or changed arguments produce a different hash and the write is rejected. Otherwise the
   before-state is snapshotted and the request goes through `client.ts`.
5. **log**: appends a line to the operation log.

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
                 WxCC config REST API
```
