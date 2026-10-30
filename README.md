# webexccconfig-mcp

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
  user and desktop profiles, sites, global variables, audio prompts and more.

The two can run side by side. This server fills the configuration gaps and defers what the official server owns.

This server exposes nine generic tools, not one tool per API call, over a registry generated from Cisco's
published OpenAPI specs: 33 resource types and 253 operations. Writes are dry-run by default, need explicit confirmation,
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
- [Audio uploads](#audio-uploads)
- [Operation log and snapshots](#operation-log-and-snapshots)
- [Resources](#resources)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Requirements
- Node.js 20.12 or later.
- A Webex Contact Center organization and an access token with `cjp:config_read` (and `cjp:config_write` for writes).
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
   # toolsets: [routing, agent, telephony, media, data, schedule, org, digital, ai]
   # defer_to_official: [flow, entry-point, business-hours, dial-plan, dial-number]
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

**Toolsets and defer list.** `toolsets` limits which resource groups are visible. Any resource (key or alias)
listed in `defer_to_official` is hidden and refused with `deferred by config`. Use the defer list for whatever
your other MCP server should own.

See `wxcc-ext.example.yaml` for every option: log and snapshot folders, request timeout, response size cap and
audio settings.

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

**How the two fit together.** This server's default `defer_to_official` list (flows, entry points, business
hours, dial plans, dial numbers) is exactly what the official server writes. Leave it as is to let the official
server own those resources and use this one for the rest of the configuration.

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
| `wxcc-ext-list` | always | List records. Takes `filter` (RSQL, e.g. `name=="Sales"`), `search`, `attributes`, `sort` and 0-based `page`/`pageSize`. `view` runs a named list view; `parentId` is for child resources. |
| `wxcc-ext-get` | always | One record by id. Singletons need no id. `view: "references"` shows what uses the record; other views come from describe-resource. |
| `wxcc-ext-create` | read-write | Create a record (`body`). Audio, greeting and channel resources also take `file`. |
| `wxcc-ext-update` | read-write | Change fields (`changes`). Uses PATCH where the API has it, otherwise reads, merges and PUTs. Lists are replaced whole. |
| `wxcc-ext-delete` | read-write | Delete a record by id. |
| `wxcc-ext-bulk` | read-write | Save (create or update) or delete many records in one request, or `operation: "patch"` for partial items. Per-item results. |
| `wxcc-ext-action` | read-write | Named non-CRUD operations such as `purge-inactive`, `reassign-agents`, `reskill` or `delete-reference`. `fetch-*` actions only read and run at once. |

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
- If other entities still use a record, delete fails with their names, e.g. `in use by other entities: skill-profile Bilingual (sp1)`.

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
  `status`, `httpStatus`, `trackingId`, `durationMs`, `error`, `changedFields`, `snapshot`.
- **Never logged:** the token and audio bytes.

```bash
grep '"phase":"apply"' ~/.wxcc-ext/logs/wxcc-ext-2026-10-30.log          # every applied write
grep -h '"resource":"team"' ~/.wxcc-ext/logs/*.log | jq -c '{ts, tool, id, status}'
jq -c 'select(.status == "error") | {ts, tool, error}' ~/.wxcc-ext/logs/*.log
grep -h 'ccconfig_<trackingId>' ~/.wxcc-ext/logs/*.log                  # find a call by Cisco trackingId
```

**Snapshots.** Applied writes save the record's previous state to
`~/.wxcc-ext/snapshots/<resource>/<id>/<timestamp>.json`. Bulk writes save one file under `<resource>/bulk/`.
Snapshots are never overwritten or cleaned up automatically. To roll back by hand, run `wxcc-ext-update` with
the fields from the snapshot.

## Resources
33 resource types, grouped into toolsets. `*` = deferred by default.

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

Flows and dial plans are not in the registry: flows have no published config spec, and every dial-plan
operation is deprecated. Deprecated API operations are never exposed.

## Development
```bash
npm run build          # compile to dist/
npm run typecheck      # tsc --noEmit (src, tests, scripts)
npm test               # unit tests, fetch mocked, no network
npm run dev            # run from source with tsx
npm run fetch:spec     # refresh apireference/openapi/configuration.json from developer.webex.com
npm run gen:registry   # regenerate src/registry/ (add -- --check to verify it is up to date)
```

**How the registry is built.**
1. `scripts/fetch-spec.ts` snapshots the OpenAPI operation specs that developer.webex.com embeds in its API
   reference pages. The snapshot is committed, so builds never need the network.
2. `scripts/gen-registry.ts` turns the snapshot into `src/registry/`. `scripts/registry-overrides.ts` is its
   hand-maintained input: resource keys, aliases, toolsets and naming fixes.

Never edit `src/registry/` by hand. A test fails if it drifts from the generator's output.

**Live smoke tests (sandbox only).** These create, update and delete throwaway `wxcc_ext_smoke_*` records and
restore anything they change:
```bash
WXCC_LIVE=1 WXCC_SANDBOX_ORG_IDS=<sandbox org id> npm run test:live
```
They refuse to run unless the configured org id is in `WXCC_SANDBOX_ORG_IDS`.

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

## License
MIT
