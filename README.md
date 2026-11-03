# webexccconfig-mcp

**Version 2.3.0** · [Changelog](#changelog)

> [!WARNING]
> **Unsupported. Use at your own risk.**
> This is an independent project. It is **not** a Cisco product and is **not supported by Cisco**.
> **Cisco TAC will not provide help** for issues caused by or related to it.
> It can change your Webex Contact Center configuration, and it comes with no warranty and no support of any kind.
> Test it against a sandbox first, and review every dry-run before you confirm a write.
>
> **The supported option is Cisco's official Webex Contact Center MCP Server:**
> https://developer.webex.com/mcp/docs/contact-center-mcp-server
> Use it whenever it covers what you need.

**How this server differs from Cisco's.**
- **Cisco's official server** is hosted. You connect over HTTP with Webex OAuth, and an administrator enables it
  for the organization in Control Hub. It focuses on flows, Day 0 administration and real-time and analytics use
  cases.
- **webexccconfig-mcp** is a local **stdio** server. It runs on your machine with a **personal access token** and
  is built for **configuring a contact center programmatically**: queues, teams, skills, skill profiles, users,
  user and desktop profiles, sites, global variables, audio prompts and more. For flows it adds only what the
  official server lacks: list, export, import, unlock and delete. It also creates, updates and deletes the
  **Webex people** behind agents, with their licenses (Webex People API).

The two can run side by side. This server fills the configuration gaps and defers what the official server owns.

This server exposes nine generic tools, not one tool per API call, over a registry generated from Cisco's
published OpenAPI specs: 37 resource types and 269 operations. Writes are dry-run by default, need explicit confirmation,
are checked for stale versions, snapshot the previous state and are logged.

- **Transport:** stdio only (no HTTP server).
- **Default mode:** read-only. Write tools only exist in `read-write` mode.
- **Credentials:** the Webex token comes from the `WEBEX_TOKEN` environment variable and is never logged or written anywhere.

## Contents
- [Requirements](#requirements)
- [Install](#install)
- [Configure](#configure)
- [Connect a client (side by side with Cisco's server)](#connect-a-client-side-by-side-with-ciscos-server)
- [Tools](#tools)
- [How writes work](#how-writes-work)
- [Flows: list, export, import, unlock, delete](#flows-list-export-import-unlock-delete)
- [Webex people and licenses](#webex-people-and-licenses)
- [Audio uploads](#audio-uploads)
- [Operation log and snapshots](#operation-log-and-snapshots)
- [Resources](#resources)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)

## Requirements
- Node.js 20.12 or later.
- A Webex Contact Center organization and an access token with `cjp:config_read` (and `cjp:config_write` for writes).
- For Webex people, licenses and roles: a token of a Webex full or user administrator of the same organization
  (`spark-admin:people_read`, `spark-admin:licenses_read`, `spark-admin:roles_read`, and
  `spark-admin:people_write` for writes). A developer.webex.com personal token of an admin has them.
- For audio uploads only: `ffmpeg`. Text-to-speech also needs macOS `say` or a configured alternative (see [Audio uploads](#audio-uploads)).

## Install
```bash
git clone https://github.com/cduzpalau/webexccconfig-mcp.git
cd webexccconfig-mcp
npm install
npm run build
```
The entry point is `dist/index.js`.

## Configure
Settings come from a YAML file plus environment variables.

1. Copy the example and edit it:
   ```bash
   cp wxcc-ext.example.yaml wxcc-ext.yaml
   ```
   ```yaml
   region: us1                 # us1, eu1, eu2, anz1, ca1, jp1, sg1 (extend with `regions:`)
   org_id: <your org id>
   mode: read-only             # or read-write
   # toolsets: [routing, agent, telephony, media, data, schedule, org, digital, ai, flow, people]
   # defer_to_official: [entry-point, business-hours, dial-plan, dial-number]
   # export_dir: ~/.wxcc-ext/exports
   ```
   The server looks for the file in this order:
   1. `--config <path>`
   2. the `WXCC_EXT_CONFIG` environment variable
   3. `./wxcc-ext.yaml`
   4. `~/.wxcc-ext/config.yaml`

   MCP clients start servers from varying working directories, so pass `--config` with an absolute path.

2. Provide the token as an environment variable. It is never read from the config file:
   ```bash
   export WEBEX_TOKEN=<access token>
   ```
   Personal access tokens from developer.webex.com are short-lived. When one expires, tools answer
   `token expired: refresh WEBEX_TOKEN`.

Without a config file, `WXCC_REGION`, `WEBEX_ORG_ID` and `WEBEX_BASE_URL` work as fallbacks (see `.env.example`).
For development, a `.env` file in the working directory is loaded automatically. Variables already set in the
environment take precedence over it.

**Base URL.** It is derived as `https://api.wxcc-<region>.cisco.com`. `base_url` overrides it, and must be the
bare host: a `/v1` suffix is rejected, because API paths carry their own version.

**Webex API host.** People, licenses and roles use the Webex API, `https://webexapis.com`, the same for every
region. `webex_base_url` (or `WEBEX_API_BASE_URL`) overrides it, e.g. for FedRAMP organizations; it is also the
bare host, without `/v1`.

**Toolsets and defer list.** `toolsets` limits which resource groups are visible. Any resource (key or alias)
listed in `defer_to_official` is hidden and refused with `deferred by config`. Use the defer list for whatever
your other MCP server should own.

If you leave `defer_to_official` out, the default list applies: `entry-point`, `business-hours`, `dial-plan`,
`dial-number`. Set `defer_to_official: []` to defer nothing, or list exactly what you want deferred.

See `wxcc-ext.example.yaml` for every option: log, snapshot and export folders, request timeout, bulk delete
concurrency, response size cap and audio settings.

## Connect a client (side by side with Cisco's server)
Both servers can be enabled at once. This server's tools are all prefixed `wxcc-ext-`, so names never clash.
Its tool descriptions don't mention what the official server covers. Routing between the two is decided by
your client setup and by `defer_to_official`.

### Claude Code
This server, as a project-scoped `.mcp.json`. Claude Code expands `${VAR}` from your shell, so the token stays
out of the file:
```json
{
  "mcpServers": {
    "wxcc-ext": {
      "command": "node",
      "args": ["/absolute/path/to/webexccconfig-mcp/dist/index.js", "--config", "/absolute/path/to/wxcc-ext.yaml"],
      "env": { "WEBEX_TOKEN": "${WEBEX_TOKEN}" }
    }
  }
}
```
Or from the CLI:
```bash
claude mcp add wxcc-ext -e WEBEX_TOKEN="$WEBEX_TOKEN" -- node /absolute/path/to/webexccconfig-mcp/dist/index.js --config /absolute/path/to/wxcc-ext.yaml
```
`claude mcp add -e` stores the value you pass in Claude Code's configuration. Prefer the `.mcp.json` form if you
don't want the token saved there.

Cisco's server uses OAuth. Cisco documents this command for it
([Claude Code guide](https://developer.webex.com/mcp/docs/webex-agentic-mcp-servers-claude-code)):
```bash
MCP_CLIENT_SECRET=<client secret> claude mcp add --transport http \
  --client-id <client id> --client-secret --callback-port <port> \
  wxcc-official <Contact Center MCP server URL>
```
Then run `/mcp` in Claude Code, select the server and choose **Authenticate**. `claude mcp list` should show both
servers.

### Claude Desktop and other stdio clients
Add this server to the client's MCP config (for Claude Desktop, `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "wxcc-ext": {
      "command": "node",
      "args": ["/absolute/path/to/webexccconfig-mcp/dist/index.js", "--config", "/absolute/path/to/wxcc-ext.yaml"],
      "env": { "WEBEX_TOKEN": "<access token>" }
    }
  }
}
```
Add Cisco's server with the guide for your client. Cisco lists guides for Amazon Quick, Claude Code, Claude
Desktop, Codex, Copilot Studio, Cursor, Gemini CLI and VS Code on its
[Contact Center MCP Server page](https://developer.webex.com/mcp/docs/contact-center-mcp-server).

### Cisco's official server (supported)
From Cisco's [Contact Center MCP Server documentation](https://developer.webex.com/mcp/docs/contact-center-mcp-server):

**Enablement.** An administrator enables the server for the organization through the Webex Agentic Platform,
or the Agentic Apps settings in Control Hub, and can choose which of its tools are enabled.

**Authentication.** A Webex OAuth 2.0 bearer token (issuer `https://webexapis.com`), with these scopes:
`spark:mcp cjp:config_read cjp:config_write cjp:user spark:people_read`.

**Coverage.**
- **Flows:** list, create, read, save and patch drafts, validate (FlowV2), plus templates and activity discovery.
- **Admin config:** create, update and delete entry points, business hours, dial plans and dial numbers.
  Read-only views of queues, teams, users, skill profiles, auxiliary codes, agent profiles and outdial ANIs.
- **Also:** real-time telemetry subscriptions, AI customer journey context and historical analytics queries.

Check Cisco's page for the current tool list and for your server URL.

**How the two fit together.** This server's default `defer_to_official` list (entry points, business hours,
dial plans, dial numbers) is the admin configuration the official server writes. Leave it as is to let the
official server own those resources and use this one for the rest of the configuration.

Flows are split by operation rather than deferred. The official server builds flows: drafts, save, patch,
validate and publish. This server only adds the flow operations it lacks: list, export, import, unlock and
delete. To leave flows entirely to the official server, add `flow` to `defer_to_official`.

### Check the setup
- `claude mcp list` (or your client's server list) shows both servers.
- Asking for "the list of WxCC config resource types" calls `wxcc-ext-list-resource-types`.
- Asking this server for a deferred resource (e.g. entry points) returns
  `entry-point is deferred by config (defer_to_official): not available in this server`.
- Without a client, the MCP Inspector lists the tools. It has its own `--config` flag, so pass this server's
  config through `WXCC_EXT_CONFIG` instead:
  ```bash
  WXCC_EXT_CONFIG=$PWD/wxcc-ext.yaml npx @modelcontextprotocol/inspector --cli node dist/index.js --method tools/list
  ```

## Tools
| Tool | Mode | What it does |
|---|---|---|
| `wxcc-ext-list-resource-types` | always | Resource types available with this config, with their operations, views and actions. Start here. |
| `wxcc-ext-describe-resource` | always | One resource's fields, required fields, operations and query params. `operation` returns that operation's request and response schema. |
| `wxcc-ext-list` | always | List records. Takes `filter` (RSQL, e.g. `name=="Sales"`), `search`, `attributes`, `sort` and 0-based `page`/`pageSize`. `view` runs a named list view; `parentId` is for child resources. Webex lists (people) page with a cursor instead: the result's `meta.nextCursor` goes back as `query: { cursor }`. |
| `wxcc-ext-get` | always | One record by id. Singletons need no id. `view: "references"` shows what uses the record; other views come from describe-resource. `saveTo` writes the full response to a new local `.json` file instead of returning it. |
| `wxcc-ext-create` | read-write | Create a record (`body`, or `bodyFile` to read it from a local `.json` file). Audio, greeting and channel resources also take `file`. |
| `wxcc-ext-update` | read-write | Change fields (`changes`). Uses PATCH where the API has it, otherwise reads, merges and PUTs. Lists are replaced whole. |
| `wxcc-ext-delete` | read-write | Delete a record by id. `query` takes the delete's query params (e.g. `flowType`, `force`). |
| `wxcc-ext-bulk` | read-write | Many records at once. `save` (default): one native bulk request that creates, updates or deletes items. `patch`: partial items. `delete`: up to 50 `ids`, deleted one by one, with per-record results. |
| `wxcc-ext-action` | read-write | Named non-CRUD operations such as `purge-inactive`, `reassign-agents`, `reskill`, `delete-reference`, or flow `import` and `unlock`. `bodyFile` reads the body from a local `.json` file. `fetch-*` actions only read and run at once. |

Names are flexible. Keys, aliases (`queue`, `csq`, `cad-variable`), plurals and any case all resolve. Unknown
names get suggestions. Large results are trimmed to `max_response_chars` with a hint to page or select attributes.

## How writes work
Every write tool runs the same pipeline:
1. **Dry-run (default).** Called without `confirm`, the tool reads the current record and shows the exact request
   (`PATCH /organization/…/user/…`), a field-level diff and any warnings. It returns a `confirm` hash. Nothing
   changes.
2. **Apply.** Calling it again with the same arguments plus `confirm: "<hash>"` re-reads the record and rebuilds
   the request. It only proceeds if the hash still matches:
   - if someone changed the record in between, you get `stale version: … (v3 → v4)`
   - if the arguments changed, you get `confirmation does not match`
3. **Snapshot.** The previous state is saved before the write (see below).
4. **Log.** The request and its outcome go to the operation log.

Writes are refused if the log or the snapshot cannot be written. Other behaviour:
- Read-only fields (`createdTime`, `lastUpdatedTime`, and any the spec marks read-only) are stripped from merged bodies.
- Bulk SAVE items with an `id` are merged with the current record, just like `update`.
- Bulk adds `organizationId` to every item.
- If other entities still use a record, delete fails with their names, e.g.
  `in use by other entities (skill-profile): skill-profile Bilingual (sp1)`. When the API's error only gives the
  entity types, the server reads the record's references view to fill in the names.
- Deleting a system default record (`systemDefault: true`, such as `Team-1`) is flagged in the dry-run: the API
  refuses it.
- If a DELETE times out, the server re-reads the record after 2, 7 and 17 seconds. If it is gone, the delete is
  reported as applied with a `note`; if it still exists, the error says the delete may still finish.
- The confirmation hash ignores the order of array elements. The API returns some arrays (`activeSkills`,
  `loginVoiceOptions`, …) in a different order on every read.

### Deleting many records
`wxcc-ext-bulk` with `operation: "delete"` deletes records one at a time through the single-record delete. It
works for every resource that has a delete, including flows, which have no bulk endpoint:
```json
{ "resource": "team", "operation": "delete", "ids": ["t1", "t2", "t3"] }
```
- **Dry-run:** reads every record and lists what will be deleted. Ids that do not exist and system defaults are
  listed under `skipped` and never sent.
- **Apply:** snapshots each record, then deletes it, with `bulk_concurrency` requests in flight (default 4). One
  failure does not stop the others. The result has `succeeded`, `failed` (with `httpStatus` and the reason, such
  as the names of referring entities) and `skipped`.
- **Limits:** up to 50 ids per call; split longer lists into several calls. `query` applies to every DELETE (e.g.
  `{ flowType: "SUBFLOW" }`). Clients that send a progress token get a progress notification per record.
- `items: [{ "id": "t1" }]` also works, and the native bulk request still takes `{ "action": "DELETE", "id": "t1" }`
  without an `item`. The native request's per-item handling varies by resource: skills report each item (207), but
  some resources refuse the whole batch when one item is in use. Use `operation: "delete"` when you need to know
  which records failed.

## Flows: list, export, import, unlock, delete
The `flow` resource (toolset `flow`) covers flows and subflows built in Flow Designer. It only has the
operations Cisco's official server lacks; drafts, save, patch, validate, publish and lock stay there.

| Task | Tool call |
|---|---|
| List flows | `wxcc-ext-list` `{ resource: "flow", query: { partialNameSearch: "IVR" } }` |
| List subflows | `wxcc-ext-list` `{ resource: "flow", query: { flowType: "SUBFLOW" } }` |
| Read the current draft | `wxcc-ext-get` `{ resource: "flow", id }` |
| Export to a file | `wxcc-ext-get` `{ resource: "flow", id, view: "export", saveTo: "main-ivr.json" }` |
| Import from a file | `wxcc-ext-action` `{ resource: "flow", action: "import", bodyFile: "main-ivr.json" }` |
| Unlock (so it can be edited or deleted) | `wxcc-ext-action` `{ resource: "flow", action: "unlock", id }` |
| Delete | `wxcc-ext-delete` `{ resource: "flow", id }` |
| Delete many | `wxcc-ext-bulk` `{ resource: "flow", operation: "delete", ids: [...] }` |
| Entry points using a flow | `wxcc-ext-list` `{ resource: "entry-point", filter: "flowId==\"<id>\"" }` |

**Subflows.** Every flow operation takes `query: { flowType: "SUBFLOW" }`. The default is `FLOW`.

**Export.** `view: "export"` returns the latest published version by default. Pass `query: { version: "draft" }`
for the working copy, or a version id. Flow documents are large, so use `saveTo`:
- the full document is written to a new file, and the tool returns only the path, size, name and type
- relative paths resolve under `export_dir` (default `~/.wxcc-ext/exports`); `~/` and absolute paths also work
- the file must end in `.json`, and existing files are never overwritten

Export works in read-only mode: it reads from the API and writes only the local file.

**Import.** `bodyFile` sends a flow document from disk, typically an export, without passing it through the
model.
- The dry-run shows an outline instead of the full body: name, flowType, and the number of nodes and edges.
- The confirmation hash covers the file's content, so editing the file after the dry-run invalidates it.
- Import creates the flow as a draft. If a flow with the same name exists, the API refuses (`duplicate: …`)
  unless you pass `query: { overwrite: true }`. `associatedChannels` in the document sets the channel; without
  it, the flow is imported as telephony.

**Unlock.** Releases a lock held by another user (locks expire after 15 minutes of inactivity anyway), for
example so a flow can be deleted. It needs an admin role.

**Delete.** Deletes are permanent. Export the flow first if you might need it; the before-snapshot only keeps
the current draft.
- This server sends `skipRsEPCheck=false` by default, so the API checks routing strategy and entry point
  associations before deleting. The API's own default skips that check. Pass `query: { skipRsEPCheck: true }`
  to skip it.
- `query: { force: "yes" }` deletes a flow even if other entities still reference it.
- A refused delete names what still uses the flow, from the API's error: dependent flows, subflows, and entry
  points or routing strategies. There is no references endpoint for flows, so this is also the only way to see
  which flows call a subflow. Entry points can be found up front with the `flowId` filter above (unless
  `entry-point` is deferred).
- Deleting a published flow can take 15 to 35 seconds, so flow deletes wait up to 90 seconds (or
  `request_timeout_ms`, if higher). A delete that still times out is re-checked, as described under
  [How writes work](#how-writes-work).

**Paths and scopes.** Flows use the same regional gateway as the configuration API
(`https://api.wxcc-<region>.cisco.com`), under `/{orgId}/project/5e5c9ad6d61f870d6d778c1b/…`. Cisco documents that
project id as fixed for all organizations. Reads need `cjp:config_read`; import, unlock and delete need
`cjp:config_write` and the Full Admin or Contact Center Service Admin role.

## Webex people and licenses
The `person` resource (toolset `people`, aliases `people`, `webex-user`) creates, updates and deletes Webex
users with the Webex People API. `license` and `role` list the organization's licenses (with total and used
units) and admin roles.

| Task | Tool call |
|---|---|
| Find people | `wxcc-ext-list` `{ resource: "person", query: { email: "ann@example.com" } }` (or `displayName`: starts with) |
| Read one | `wxcc-ext-get` `{ resource: "person", id }` |
| The token's own person | `wxcc-ext-get` `{ resource: "person", view: "me" }` |
| Licenses and free units | `wxcc-ext-list` `{ resource: "license" }` |
| Create an agent | `wxcc-ext-create` `{ resource: "person", body: { emails: ["ann@example.com"], displayName: "Ann Agent", firstName: "Ann", lastName: "Agent", licenses: ["Contact Center Premium Agent"] } }` |
| Change licenses | `wxcc-ext-update` `{ resource: "person", id, changes: { licenses: ["Basic Messaging", "Contact Center Standard Agent"] } }` |
| Delete | `wxcc-ext-delete` `{ resource: "person", id }`, or `wxcc-ext-bulk` with `operation: "delete"` |

**Licenses and roles by name.** `licenses` and `roles` take names (any case) or ids. The dry-run shows the ids
it will send, with names, under `refs` (`now` and `after` on updates), and warns when a newly added license
has no free units. An unknown name lists the known ones; a name shared by several licenses (one per
subscription) asks for the id.

**Creates.** Pass `licenses` to license the person. Without it, the person is created with no licenses
requested, but Webex always adds the organization's default licenses (on the sandbox: Basic Space Meetings,
Basic Messaging, Free screen share, Call on Webex); even `licenses: []` gets them. The dry-run warns about it.
The People API can create a person even when it answers with an error (for example a 400 on calling data).
After a failed create, the server looks the person up by email, and the error then says the person exists, so
you fix it with `wxcc-ext-update` instead of creating it twice.

**Updates.** The People API replaces the whole record, so the server reads the person, merges your changes and
PUTs everything back; read-only fields (`created`, `status`, `sipAddresses`, …) are left out. `licenses` and
`roles` replace the list: include the ones to keep. Webex applies an update part by part:
- an answer of **206** means some fields did not change; the server re-reads the person and the result lists them
  under `notApplied` (on the sandbox, removing the last default licenses returns 206 and keeps one)
- after an error, the server re-reads the person and says which requested fields changed anyway

Presence and fields Webex updates on its own (`status`, `lastActivity`, `lastModified`, `sipAddresses`,
`invitePending`) do not count as a change between the dry-run and the apply, and are not in snapshots.

**Deletes.** Deleting a person is permanent: a new person with the same email gets a new id. The token's own
person is never deleted (refused on `wxcc-ext-delete`, skipped by bulk delete).

**Contact Center.** Every person gets a Contact Center `user` record right away (`contactCenterEnabled: false`).
Its `ciUserId` is the uuid inside the person id (the id is base64 of `ciscospark://us/PEOPLE/<uuid>`), so
`wxcc-ext-get` `{ resource: "user", view: "by-ci-user-id", id: "<uuid>" }` finds it. A Contact Center license
makes the person an agent, which can take a while to show on the user. Deleting the person removes the user.

**Org check.** The Webex API acts on the token's own organization. Before the first Webex call, the server reads
`/v1/people/me` and refuses every Webex call if that organization is not `org_id`, so a partner administrator's
token never lists or changes people in the wrong organization.

**Search lag.** `email` and `displayName` searches use an index that can lag creates and deletes by minutes. Read
by id when you need the current state.

## Audio uploads
`wxcc-ext-create` and `wxcc-ext-update` on `audio-file` and `agent-personal-greeting` take:
- `file: { "path": "/local/prompt.mp3" }`: any format ffmpeg can read, or
- `file: { "text": "Welcome to Acme", "voice": "Samantha" }`: speech synthesised with macOS `say`.

**Conversion.** Both inputs are converted with ffmpeg to WAV, 8 kHz, mono, 16-bit PCM. The format is
configurable under `audio:`.

**Upload.** The file is sent as multipart with `contentType: AUDIO_WAV`. The API requires names to end in
`.wav`, and the tool appends it if needed.

**Missing tools.** In read-write mode the server warns at startup if `ffmpeg` or the TTS command is missing.
An upload then fails with the setting to change. On systems without `say`, point `audio.tts_command`,
`audio.tts_args` and `audio.voice_args` at another TTS command (e.g. `espeak-ng`). `{in}` is a text file,
`{out}` the audio file to write, and `{voice}` the voice name.

Channel logos (`channel` create/update) take `file: { "path": … }` and are uploaded as-is.

## Operation log and snapshots
**Operation log.** Every tool call is appended to a daily file, `~/.wxcc-ext/logs/wxcc-ext-YYYY-MM-DD.log`.
That includes reads, dry-runs, applies and input errors.
- **Format:** one JSON object per line.
- **Fields:** `ts`, `tool`, `phase` (`local`/`read`/`dry-run`/`apply`), `resource`, `id`, `op`, `method`, `path`,
  `status`, `httpStatus`, `trackingId`, `durationMs`, `error`, `changedFields`, `snapshot`, `file` (local file
  written by `saveTo` or read by `bodyFile`), `count` (records in a bulk delete) and `note` (e.g. a timed-out
  delete confirmed by a follow-up read).
- **Never logged:** the token and audio bytes.

```bash
grep '"phase":"apply"' ~/.wxcc-ext/logs/wxcc-ext-2026-10-30.log          # every applied write
grep -h '"resource":"team"' ~/.wxcc-ext/logs/*.log | jq -c '{ts, tool, id, status}'
jq -c 'select(.status == "error") | {ts, tool, error}' ~/.wxcc-ext/logs/*.log
grep -h 'ccconfig_<trackingId>' ~/.wxcc-ext/logs/*.log                  # find a call by Cisco trackingId
```

**Snapshots.** Applied writes save the record's previous state to
`~/.wxcc-ext/snapshots/<resource>/<id>/<timestamp>.json`. Native bulk requests save one file under
`<resource>/bulk/`; `operation: "delete"` saves one file per record.
Snapshots are never overwritten or cleaned up automatically. To roll back by hand, run `wxcc-ext-update` with
the fields from the snapshot.

## Resources
37 resource types, grouped into toolsets. `*` = deferred by default.

| Toolset | Resources |
|---|---|
| `routing` | contact-service-queue, entry-point*, skill, skill-profile, team |
| `agent` | auxiliary-code, call-monitoring, desktop-layout, desktop-profile, multimedia-profile, user, user-profile, work-type |
| `telephony` | address-book, address-book-entry, contact-number, dial-number*, outdial-ani, outdial-ani-entry |
| `media` | agent-personal-greeting, audio-file |
| `data` | global-variable |
| `schedule` | business-hours*, holiday-list, overrides |
| `org` | organization-setting, resource-collection, site, tenant-configuration |
| `digital` | asset, channel |
| `ai` | ai-feature, ai-feature-auto-csat-question |
| `flow` | flow (list, get, export, import, unlock, delete only) |
| `people` | person, license, role (Webex API, `webexapis.com`) |

Dial plans are not in the registry: every dial-plan operation is deprecated. Deprecated API operations are never
exposed.

## Development
```bash
npm run build          # compile to dist/
npm run typecheck      # tsc --noEmit (src, tests, scripts)
npm test               # unit tests, fetch mocked, no network
npm run dev            # run from source with tsx
npm run fetch:spec     # refresh apireference/openapi/*.json from developer.webex.com (-- --only flows for one)
npm run gen:registry   # regenerate src/registry/ (add -- --check to verify it is up to date)
```

**How the registry is built.**
1. `scripts/fetch-spec.ts` snapshots the OpenAPI operation specs that developer.webex.com embeds in its API
   reference pages: `configuration.json` (Configuration), `flows.json` (Flow Orchestration → Flows) and
   `webex-admin.json` (Webex Admin → People, Licenses, Roles, from the admin docs portal). The snapshots are
   committed, so builds never need the network.
2. `scripts/gen-registry.ts` turns the snapshots into `src/registry/`. `scripts/registry-overrides.ts` is its
   hand-maintained input: resource keys, aliases, toolsets, naming fixes, and per-resource operation allowlists
   (the `flow` resource uses one to expose only the operations the official server lacks).

Never edit `src/registry/` by hand. A test fails if it drifts from the generator's output.

**Live smoke tests (sandbox only).** These create, update and delete throwaway `wxcc_ext_smoke_*` records and
restore anything they change:
```bash
WXCC_LIVE=1 WXCC_SANDBOX_ORG_IDS=<sandbox org id> npm run test:live
```
They refuse to run unless the configured org id is in `WXCC_SANDBOX_ORG_IDS`. Test people get throwaway email
addresses from [throwawaymail.app](https://throwawaymail.app/for-agents), so activation emails go nowhere real.

Design notes are in `docs/architecture.md`; the build history and the API findings are in `docs/refactor-plan.md`.

## Troubleshooting
| Message | Fix |
|---|---|
| `WEBEX_TOKEN is not set` / `token expired: refresh WEBEX_TOKEN` | Export a fresh token in the environment that launches the server. |
| `unknown region "xx1"` | Use an official region, or add the new code under `regions:` in config. |
| `not found: No Organization was found … (check region …)` | The org is in a different region: fix `region` (or `base_url`). |
| `base_url must not end in /v1` | Use the bare host, e.g. `https://api.wxcc-us1.cisco.com`. |
| `… is deferred by config` / `… toolset … is disabled` | Edit `defer_to_official` / `toolsets`. |
| `forbidden: …` | The token lacks the scope or role for that resource. Some resources (e.g. call-monitoring) need a user-scoped token. |
| `ffmpeg not found (audio.ffmpeg_path)` | `brew install ffmpeg`, or set `audio.ffmpeg_path`. |
| Write tools missing | Set `mode: read-write`. |
| `file already exists, choose another name` | `saveTo` never overwrites: pick a new file name. |
| `duplicate: …` on flow import | A flow with that name exists: rename it in the file or pass `query: { overwrite: true }`. |
| `in use by other entities …` | Remove the named references first, or check `view: "references"`. For flows, the error lists the dependents. |
| `request timed out … the record still exists` | The API may still finish the delete. Check with `wxcc-ext-get` before retrying, or raise `request_timeout_ms`. |
| `at most 50 ids per call` | Split the list over several `wxcc-ext-bulk` calls. |
| `the token belongs to Webex org …, not org_id …` | Use a token of an administrator in the configured organization (partner tokens are not supported). |
| `forbidden: … spark-admin:people_read / people_write` | The token is not a Webex full or user administrator. |
| `partly applied (HTTP 206): … did not change` | Webex kept some fields; see `notApplied`. Some default licenses cannot be removed. |
| `… now exists with email …` after a failed create | The person was created anyway: fix it with `wxcc-ext-update`. |
| A person you just created or deleted is missing from (or still in) a search | The People search index lags; read by id. |

## Changelog

### 2.3.0 (2026-11-03)
**Added**
- **Webex people:** new `person` resource (toolset `people`) with list, get, create, update and delete, plus
  `view: "me"`, on the Webex People API. Bulk delete works for people. See
  [Webex people and licenses](#webex-people-and-licenses).
- **`license` and `role` resources** (list, get).
- **Licenses and roles by name** on person creates and updates, resolved to ids in the dry-run, with a warning for
  licenses without free units.
- **Partial-write reporting:** a 206 update lists the fields that did not change (`notApplied`); a failed update
  says which fields changed anyway; a failed create checks whether the person was created anyway.
- **Safety:** Webex calls are refused unless the token's organization is `org_id`; the token's own person is never
  deleted.
- **`webex_base_url` config setting** (default `https://webexapis.com`), and the `people` toolset.

**Changed**
- **The client serves two APIs.** Paths starting with `/v1/` go to the Webex API host; error bodies of both APIs
  are parsed.
- **Lists** map `pageSize` to the Webex `max`, return `meta.nextCursor` from the `Link` header, and ignore
  `pageSize` for lists that always return everything (licenses, roles).
- **`npm run fetch:spec`** reads each section from its own portal page, and writes `webex-admin.json`.
- **Bulk delete** shows `displayName` when a record has no `name`.

### 2.2.0 (2026-11-02)
Improvements from a cleanup of about 500 stale records on a production tenant, each one checked against the
sandbox before the fix.

**Added**
- **`operation: "delete"` on `wxcc-ext-bulk`:** deletes up to 50 `ids` one at a time with bounded concurrency,
  for every resource with a delete, including flows. Each record is snapshotted first. Results list `succeeded`,
  `failed` (with the reason) and `skipped`, and one failure does not stop the others. See
  [Deleting many records](#deleting-many-records).
- **Skipped before sending:** the bulk delete dry-run skips ids that do not exist and system default records.
  `wxcc-ext-delete` warns about a system default in its dry-run.
- **Refused deletes name the referring records.** Flow deletes list dependent flows, subflows and entry points from
  the API's error. Configuration deletes whose error only gives entity types are filled in from the references
  view.
- **Timed-out deletes are verified.** The server re-reads the record, and a record that is gone counts as
  deleted (with a `note`).
- **Progress notifications** for bulk deletes, for clients that send a progress token.
- **`bulk_concurrency` config setting** (1 to 10, default 4).

**Changed**
- **Flow deletes** wait up to 90 seconds instead of 30.
- **Snapshots** are written asynchronously.
- **Operation log:** new `count` and `note` fields.
- **`query` parameters** are typed loosely in the tool schema. The server still checks names, types and allowed
  values against the operation, so behaviour is unchanged.

**Fixed**
- **Confirm always failed on some resources.** Deletes, updates and bulk requests on records whose arrays come
  back in a varying order (skill profile `activeSkills`, desktop profile `loginVoiceOptions`) could never be
  confirmed: the hash covered the arrays' order, which changes on every read. The hash now ignores array order.
- **Bulk DELETE items needed a dummy `item: {}`.** Items now take `id` directly.
- **Flow delete errors said only "check incoming references".** The Flows API uses its own error shape
  (`errorMessage`, `dependentFlows`, …), which is now parsed. Configuration 412s now show the referring entity
  types.

### 2.1.0 (2026-11-02)
**Added**
- **Flows:** a new `flow` resource (toolset `flow`) with list, get, export, import, unlock and delete for flows and
  subflows (`query: { flowType: "SUBFLOW" }`). See [Flows](#flows-list-export-import-unlock-delete).
- **`saveTo` on `wxcc-ext-get`:** writes the full response to a new local `.json` file. It works for any resource
  and is meant for large documents such as flow exports.
- **`bodyFile` on `wxcc-ext-create` and `wxcc-ext-action`:** reads the request body from a local `.json` file.
  The dry-run shows an outline, and the confirmation hash covers the file's content.
- **`query` on `wxcc-ext-delete`:** passes the delete's query params (e.g. flow `force`, `flowType`).
- **`export_dir` config setting:** where relative `saveTo` and `bodyFile` paths resolve (default
  `~/.wxcc-ext/exports`).
- **Spec snapshot:** `apireference/openapi/flows.json`. `npm run fetch:spec` refreshes both snapshots and takes
  `-- --only <name>`.

**Changed**
- **Default defer list:** `flow` is no longer in the default `defer_to_official` list, because this server only
  exposes the flow operations the official server lacks. To keep the old behaviour, add `flow` to
  `defer_to_official`. The rest of the default list is unchanged.
- **Reading before a write:** write tools that read the current record first now pass along query values the
  get operation also takes, such as `flowType: SUBFLOW`.
- **Operation log:** lines carry a `file` field when a local file is written or read.

**Fixed**
- **Stale-version check:** records without a `version` field (such as global variables) are now pinned by
  `lastUpdatedTime` plus a content hash. `lastUpdatedTime` only has one-second resolution, so a competing change
  made within the same second as the dry-run could slip through.
- **Snapshots:** two snapshots of the same record within one millisecond no longer collide. The second gets a
  `-1` suffix instead of the write being refused.

### 2.0.0 (2026-10-31)
- **Rewrite:** nine generic tools over a registry generated from Cisco's OpenAPI specs (33 resource types,
  253 operations).
- **Writes:** dry-run, confirmation hash, stale-version check, before-snapshots and an operation log.
- **Defaults:** read-only by default, with a configurable defer list for resources Cisco's official server owns.
- **Audio uploads:** prompts and greetings, converted with ffmpeg, with macOS `say` for text-to-speech.
- **Dependencies:** zod upgraded to 4.6.7 (GHSA-mrhx-c7xc-m3w5).

## License
MIT
