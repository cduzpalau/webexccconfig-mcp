# v2 refactor plan

Basis:
- CLAUDE.md
- the v1 implementation in ../wxcc-v1 (src/index.ts, src/client/WebexClient.ts, src/types/*.ts, src/tools/*.ts)
- the 176 scraped Markdown files in apireference/
- the OpenAPI operation specs embedded in developer.webex.com. That is 319 operations under "Webex Contact Center: Configuration", extracted on 2026-10-30. Section c explains where they come from.

Where the two sources disagree, the live specs win. Design summary: see [architecture.md](architecture.md). Work one phase at a time (section d).

## a. Resource inventory

Conventions used in the table:
- "Path" is the path after `/organization/{orgid}`. "vN" is the version segment; no segment means v1.
- The current (non-deprecated) operation is listed. "dep" marks operations the live docs flag as deprecated.
- Ops in brackets are documented but fall outside the 6 core ops.
- "new" in the v1-tools column means a resource that neither v1 nor apireference/ had.

| Resource (registry key) | API path & version | Ops available | Update semantics | ID field | v1 tools | Toolset | Defer? |
|---|---|---|---|---|---|---|---|
| address-book | `/v3/address-book` (list/get/create/update/delete); references v1. v1/v2 CRUD dep | list, get, create, update, delete, bulk (export dep) [references] | PUT | `id` | 7 | telephony | no |
| address-book-entry (child) | `/address-book/{addressBookId}/entry` v1; list v2 | list, get, create, update, delete, bulk (save) | PUT | `id` + parent `addressBookId` | 6 | telephony | no |
| agent-personal-greeting | `/v2/agent-personal-greeting` (CRUD + PATCH); list v3 and v2. v1 CRUD dep | list, get, create, update, delete [delete-reference] | PUT and PATCH (partial DTO) | `id` | 8 | media | no |
| audio-file | `/audio-file` v1; list v2. Create/update are multipart | list, get, create, update, delete [references] | PUT and PATCH (partial DTO) | `id` | 7 | media | no |
| auxiliary-code | `/auxiliary-code` v1; list v2 | list, get, create, update, delete, bulk (save, PATCH; export dep) [references, purge] | PUT; bulk PATCH | `id` | 10 | agent | no |
| business-hours | `/business-hours` v1; list v2 (v1 list also live) | list, get, create, update, delete, bulk (save) [references] | PUT | `id` | 4 | — | **yes** |
| holiday-list | `/holiday-list` v1; list v2 | list, get, create, update, delete, bulk (save) [references] | PUT | `id` | 4 | schedule | no |
| overrides | `/overrides` v1; list v2 | list, get, create, update, delete, bulk (save) [references] | PUT | `id` | 4 | schedule | no |
| contact-number | `/contact-number` v1; list v2 | list, get, create, update, delete, bulk (save; export dep) [all-numbers] | PUT | `id` | 8 | telephony | no |
| contact-service-queue | `/v2/contact-service-queue` (list/get/create/update); delete v1; bulk save `/contact-service-queue/bulk` v1 **and** `/contact-service-queue/v2/bulk`. v3 list dep | list, get, create, update, delete, bulk (save, PATCH) [references, purge, delete-reference, reassign-agents, by-user-id ×3, by-skill-profile-id, 4× fetch-by-*] | PUT; bulk PATCH | `id` | 14 | routing | no |
| desktop-layout | `/desktop-layout` v1; list v2 | list, get, create, update, delete, bulk (save) [references, purge] | PUT | `id` | 9 | agent | no |
| desktop-profile (API `agent-profile`) | `/agent-profile` v1; list v2 | list, get, create, update, delete, bulk (save) [references, purge] | PUT | `id` | 9 | agent | no |
| dial-number (dialed-number mapping) | `/dial-number` v1; list v1, v2 and v3 all live | list, get, create, update, delete, bulk (save; export dep) [delete-all, numbers-only, references] | PUT | `id` | 10 (9 + `List_All_Dialed_Numbers_Raw`) | — | **yes** |
| dial-plan | `/dial-plan` v1; list v2. **Every op dep** | list, get, create, update, delete, bulk [references] | PUT | `id` | 8 | — | **yes** |
| entry-point | `/entry-point` v1; list v2 | list, get, create, update, delete, bulk (save; export dep) [references, purge] | PUT | `id` | 6 | — | **yes** |
| flow | not in either source; no v1 tools | — | — | — | 0 | — | **yes** |
| global-variable (API `cad-variable`) | `/cad-variable` v1; list v2 | list, get, create, update, delete, bulk (save; export dep) [references, purge, reportable-count] | PUT | `id` | 10 | data | no |
| multimedia-profile | `/multimedia-profile` v1; list v2 | list, get, create, update, delete, bulk (save; export dep) [references, purge] | PUT | `id` | 9 | agent | no |
| outdial-ani | `/outdial-ani` v1; list v2 | list, get, create, update, delete, bulk (save) [references, list-all-entries] | PUT | `id` | 8 | telephony | no |
| outdial-ani-entry (child) | `/outdial-ani/{outDialAniId}/entry` v1; list v2 | list, get, create, update, delete, bulk (save) | PUT | `id` + parent `outDialAniId` | 6 | telephony | no |
| skill | `/skill` v1; list v2 | list, get, create, update, delete, bulk (save) [references, purge] | PUT | `id` | 9 | routing | no |
| skill-profile | `/skill-profile` v1; list v2 | list, get, create, update, delete, bulk (save) [references] | PUT | `id` | 1 | routing | no |
| team | `/team` v1; list v2 | list, get, create, update, delete, bulk (save) [references, purge] | PUT | `id` | 9 | routing | no |
| user | `/user/{id}` v1; list `/v2/user`; `/v2/user/by-ci-user-id/{id}` | list, get, update, bulk (PATCH). **No create/delete** [references, with-user-profile, fetch-by-ids, fetch-by-skill-requirements, by-call-monitoring-id, by-dynamic-skill-id, reskill, bulk update-dynamic-skill] | PUT and PATCH (opaque body) | `id` (also CI user id) | 12 (11 + `Get_Agents_by_Skill_Requirements`) | agent | no |
| user-profile | `/v3/user-profile` (all CRUD); references v1 | list, get, create, update, delete, bulk (save) [references, acl] | PUT | `id` | new | agent | no |
| work-type | `/work-type` v1; list v2 | list, get, create, update, delete, bulk (save; export dep) [references, purge] | PUT | `id` | new | agent | no |
| call-monitoring | `/call-monitoring` v1; list v2 | list, get, create, update, delete [delete-reference] | PUT and PATCH (partial DTO) | `id` | new | agent | no |
| site | `/site` v1; list v2 (v1 list also live) | list, get, create, update, delete, bulk (save; export dep) [references, purge] | PUT | `id` | new | org | no |
| resource-collection | `/resource-collection` v1; list v2 | list, get, create, update, delete, bulk (PATCH) [references, update-resource] | PUT; bulk PATCH | `id` | new | org | no |
| organization-setting (singleton) | `/organization-setting/{id}` v1; list v2 | list, get, update. No create/delete | PUT and PATCH (partial DTO) | `id` | new | org | no |
| tenant-configuration (singleton) | `/tenant-configuration/{id}` v1; list v2 | list, get, update. No create/delete | PUT | `id` | new | org | no |
| channel | `/channel` v1; list v2 | list, get, create, update, delete, bulk (save) [references] | PUT and PATCH (partial DTO) | `id` | new | digital | no |
| asset | `/asset` v1; list v2 | list, get, create, update, delete, bulk (save) [references] | PUT and PATCH (opaque body) | `id` | new | digital | no |
| ai-feature | `/ai-feature/{id}` v1; list v2 | list, get, update | PATCH only (partial DTO) | `id` | new | ai | no |
| ai-feature-auto-csat-question | `/ai-feature/auto-csat/question` v1; list v2 | list, get, create, delete, bulk (save) | none (no update op) | `id` | new | ai | no |
v1 total: 178 tools, of which 28 belong to deferred resources (business-hours 4, dial-number 10, dial-plan 8, entry-point 6).

The live specs cover 38 resources; flow is the only one they don't have. 52 of the 319 live operations are deprecated. Four AI resources are entirely deprecated: agent-burnout, auto-csat, auto-csat-question and generated-summaries, replaced by ai-feature and ai-feature-auto-csat-question. Those four are **out of scope**. Dial-plan is also entirely deprecated (and deferred anyway), so the generated registry holds **33 resources**.

**Corrections versus apireference/ (the live docs win):**
- CSQ list: the current version is **v2**; v3 is deprecated. apireference/ had it the other way round.
- Greeting CRUD has moved to v2.
- These operations exist but were missing from apireference/:
  - update for desktop-layout and entry-point
  - full CRUD for skill-profile
  - create, update and bulk for business-hours, holiday-list and overrides
- 8 bulk-export endpoints in apireference/ are **absent** from the live docs: team, skill, user, agent-profile, desktop-layout, dial-plan, outdial-ani and CSQ. The remaining exports are flagged deprecated.

## b. Cross-cutting API behaviours
- **Paths and orgId.** Every path is `/organization/{orgid}/…`. orgId is always a path segment, never a header or query param.
  - The version segment comes after orgId (`/organization/{orgid}/v2/team`). No segment means v1.
  - Exception: CSQ bulk save `/organization/{orgid}/contact-service-queue/v2/bulk`, where the version comes after the resource.
  - Bulk item bodies need `organizationId`.
- **Versions are mixed within one resource.** Usually list is v2 and get/create/update/delete are v1. Address book and user profile use v3; CSQ and greeting use v2. Several resources have more than one live list version (dial-number v1/v2/v3; site, team, outdial-ani, business-hours and others have v1+v2). The registry must store path and version per operation, and should pick the newest non-deprecated one.
- **Deprecation is explicit.** Each live operation has a `deprecated` flag. The generator skips deprecated ops, so resources that have only deprecated ops are not emitted.
- **Pagination.**
  - Params: `page` (0-based, default 0) and `pageSize`. The pageSize default **varies by endpoint (10, 50 or 100)**, and values above an undocumented maximum are silently clamped.
  - Response shape: `{ meta, data[] }` with `meta.{page,pageSize,totalPages,totalRecords,links{self,first,prev,next,last}}`. Some examples show `meta: {}`, so don't rely on meta.
  - Not paginated: `contact-number/all-numbers`, `dial-number/numbers-only`, `cad-variable/reportable-count`.
  - Purge uses a `nextStartId` cursor instead.
- **Filtering.**
  - `filter` uses RSQL (e.g. `id=in=("a","b")`), and each resource excludes some fields from filtering.
  - `search` takes a keyword, or the forms `field=="name";value=="x"` and `fields=in=(…);value==…`.
  - `attributes` is a field projection.
  - `singleObjectResponse` is available on many lists. `sort` is available on business-hours, holiday-list and overrides.
  - Resource-specific flags include `desktopProfileFilter`, `provisioningView`, `supervisorView`, `includeEntryPointName`, `includeAgentDetails`, `queueId`, `userInQueue`, `includeUrl` and `agentsUpdatedInfo`.
- **Regional base URL.** The base URL is `https://api.wxcc-<region>.cisco.com` with **no** `/v1` suffix. A full request looks like `https://api.wxcc-us1.cisco.com/organization/{orgid}/v2/team`, as in the developer.webex.com code samples; confirmed by the owner. The v1 README's `…/v1` base URL was wrong. The specs' `servers` are internal service hosts (`config-service.produs1.ciscoccservice.com`, `…intgus1…`, even `localhost:8084`) and must not be used. Config takes a `region` code with an optional `base_url` override (see Resolved).
- **Status codes, as declared in the live specs:**
  - POST: 200/201, **409** "similar entity is already present", 207 on bulk.
  - PUT: 200, **412** "resource referred in other entity(s), call incoming-references".
  - DELETE: 200 or 204, 412.
  - PATCH: 200, 207 on bulk.
  - Every method: 400/401/403/404/429/500.
- **Error body.** `ApiErrorResponse = { trackingId, error: { key, reason, message: [{ description, entity, references[{id,name,…}] }] } }`. The useful text is in `message[].description`. `references` lists the blockers behind a 412.
- **Bulk body and response.** The body is `{ items: [{ itemIdentifier, requestAction: "SAVE"|"DELETE", item: <DTO> }] }`. A 207 response returns `items[{ itemIdentifier, status, href, operationType, apiError }]`, so failures have to be reported per item.
- **PATCH.** Most PATCH bodies are real partial DTOs: greeting, audio-file, channel, call-monitoring, organization-setting, ai-feature and user reskill. `user/{id}` and `asset/{id}` are still documented as an opaque `JsonValue`. Decision: `update` uses PATCH wherever it exists, user and asset included.
- **Uploads.** Audio-file and greeting create/update are `multipart/form-data`, with a binary `audioFile` part plus a JSON info part.
- **Inconsistencies:**
  - `operationId` is not unique, so key operations by method + path.
  - Some write ops declare their body as a **query parameter** named `*DTO` (team, agent-profile, skill-profile POST/PUT). This is a springdoc artefact; the real request is a JSON body.
  - Many request bodies are listed under both `application/json` and `multipart/form-data`; only the upload ops are really multipart.
  - Some v1 paths differ from the docs:
    - CSQ by-user: v1 used `/v2/contact-service-queue/agent-based/{userId}`; the docs have `…/by-user-id/{userid}/agent-based-queues`.
    - Address-book references: v1 used `/v3/address-book/{id}/references`; the docs have `/address-book/{id}/incoming-references`.
  - API names differ from UI names: Desktop Profile = `agent-profile`, Global Variable = `cad-variable`.
  - v1 sent three different `Accept` headers.
  - Some doc examples were copy-pasted across endpoints.
  - Collection-level `DELETE /dial-number` exists. It's deferred anyway, but the registry must never expose collection deletes.

## c. Spec source and generator approach

### Source format
- **Primary: OpenAPI embedded in developer.webex.com.** Every API reference page (e.g. `https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/update-specific-desktop-layout-by-id`) returns about 23 MB of server-rendered HTML containing `window.__INITIAL_STATE__`.
  - Navigation path: `sideNavigation.sideNavigationData.subMenu` → `"API Reference (Contact Center)"` → `"Webex Contact Center: Configuration"`. That node has 29 groups, and each leaf carries `versions[].spec`.
  - `versions[].spec` is a JSON string: `{ type, title, meta: { id, info, servers, openapi }, spec: { method, path, operationId, summary, parameters, requestBody, responses, deprecated } }`.
  - Schemas are fully inlined (marked with `$$ref`), so no `$ref` resolution is needed.
  - Plain `curl` is enough; no browser or scraper is required.
  - The structure is undocumented and could change. That risk is accepted: the snapshot is committed, so builds never need the network, and `fetch-spec.ts` fails loudly if the structure changes.
- **Fallback: apireference/.** Scraped Markdown, one file per operation, 176 files. It is kept for reference and for the 8 bulk-export endpoints no longer in the live docs. The generator no longer parses it.

### scripts/fetch-spec.ts (new, run manually, network)
1. GET one Contact Center API reference page.
2. Extract `__INITIAL_STATE__` and walk to the Configuration node.
3. Collect every leaf's specs.
4. Validate each one with Zod (method, path, parameters, responses present), treating the fetched data as untrusted input.
5. Write `apireference/openapi/configuration.json`: a map keyed `"METHOD path"`, with sorted keys and no timestamps, plus a `_source` header holding the URL and fetch date. Commit it.
6. Print a diff summary against the previous file: added, removed and newly deprecated ops.

### scripts/gen-registry.ts (offline, deterministic)
1. Read `configuration.json` and skip deprecated ops (always).
2. Classify the op kind from method + path shape:

   | Shape | Kind |
   |---|---|
   | collection GET | list |
   | `/{id}` GET | get |
   | collection POST | create |
   | `/{id}` PUT | update |
   | `/{id}` PATCH | patch |
   | `/{id}` DELETE | delete |
   | `/bulk` POST | bulkSave |
   | `/bulk` PATCH | bulkPatch |
   | `/bulk-export` | bulkExport |
   | `/{id}/incoming-references` | references |
   | `/purge-inactive-entities` | purgeInactive |
   | anything else | custom |

3. Group ops into resources by normalised path (strip `/vN` and ids). A `{parentId}` segment marks a child resource. When several versions exist, pick the highest non-deprecated version per kind.
4. Normalise the known quirks:
   - a `*DTO` query parameter becomes the request body schema
   - multipart is only used where a `format: binary` property exists
5. Derive `readOnlyFields` from schema `readOnly`, plus a fixed list (`createdTime`, `lastUpdatedTime`). The live specs rarely mark readOnly.
6. Derive `requiredOnCreate` from the schema's `required`.
7. Merge `scripts/registry-overrides.ts`, which is hand-maintained input: registry key, display name, aliases, toolset, singleton flag, and anything the specs get wrong.
8. Emit:
   - `src/registry/resources.generated.ts`: compact entries, always loaded.
   - `src/registry/schemas/<key>.json`: full request/response schemas, loaded only by describe_resource.
9. Keep the output deterministic. A test reruns the generator and fails if the committed output differs.

### Registry entry (as built in phase 2)
The types live in `src/registry-types.ts`. Summary of how they differ from the original proposal:
- Op kinds are `list`, `get`, `create`, `update`, `patch`, `delete`, `bulkSave`, `bulkPatch` and `references`, plus named `view` ops (extra GETs, reached through the `view` param of list/get) and named `action` ops (extra writes, reached through `wxcc-ext-action`).
- `purge-inactive-entities` becomes `action:purge-inactive`. Collection-level delete-all and bulk export are never emitted.
- There is no `deferToOfficial` field. Deferral is decided at runtime by config `defer_to_official` alone. A test checks that the default list's keys exist in the registry, except flow and dial-plan, which have no live ops.
- Each op records `hasBody`, `bodyEncoding` (`multipart` when the body has a `format: binary` property), `paginated` (has `page` + `pageSize`) and `source`, the "METHOD path" key in the spec snapshot.
- When several live versions exist for one kind, the highest wins. Same-version duplicates fail the build. `nameBySource` and `rename` in the overrides resolve name clashes.
- Full schemas for describe_resource are emitted per resource as `src/registry/schemas/<key>.ts`, loaded lazily through `SCHEMA_LOADERS`.

## d. Build phases and acceptance criteria
1. **Skeleton (stdio, config, auth, API client)**
   - Remove express, cors and their @types from package.json. Switch the test runner to vitest.
   - `config.ts` loads YAML (`region` code, from which the base URL `https://api.wxcc-<region>.cisco.com` is derived; `regions`, the list of valid codes, defaulting to the official us1, eu1, eu2, anz1, ca1, jp1, sg1 and editable in config so new regions need no code change; optional `base_url` override, rejected if it ends in `/v1`; `audio.voice`, `audio.ffmpeg_path`, `audio.tts_command`; orgId, mode `read-only` by default, enabled toolsets, `defer_to_official` list) plus `WEBEX_TOKEN` from env, all validated with Zod.
   - `auth.ts`: `TokenProvider` interface with a `StaticTokenProvider`.
   - `client.ts`: builds the regional URL and fills in `{orgid}`. Sends JSON or multipart bodies. Maps errors to short messages:
     - 401 → "token expired: refresh WEBEX_TOKEN"
     - 403
     - 404
     - 409 duplicate
     - 412 with the referencing entities
     - 429 with retry-after
     It never includes the token in errors or logs.
   - *Accept:*
     - build, typecheck and tests pass
     - the server starts on stdio and answers `initialize` and `tools/list` in MCP Inspector
     - there is no HTTP/SSE code or dependency
     - unit tests cover config validation (including the region → host mapping, a region added via `regions`, an unknown region rejected, the `base_url` override and rejection of a `/v1` suffix), URL building for v1/v2/v3 and the CSQ special path, error mapping, and a check that the token never appears in thrown errors
2. **Spec fetch and registry generator**
   - Add `npm run fetch:spec` (runs `scripts/fetch-spec.ts`).
   - *Accept:*
     - `scripts/fetch-spec.ts` reproduces `apireference/openapi/configuration.json` (319 ops on 2026-10-30) and reports drift.
     - `npm run gen:registry` classifies every non-deprecated op with 0 unclassified. It emits one entry per live resource (33: flow has no spec, and dial-plan and the 4 deprecated AI resources have only deprecated ops).
     - Deprecated-only resources are not emitted. Collection delete-all and bulk export are excluded and reported.
     - The `*DTO`-query quirk is normalised.
     - A rerun is byte-identical (the drift test passes).
     - Fixture tests cover a list, a PUT with nested body, a child resource, a 207 bulk, a multipart upload and a singleton.
3. **Read tools**: `wxcc-ext-list-resource-types`, `wxcc-ext-describe-resource`, `wxcc-ext-list`, `wxcc-ext-get`.
   - `list` takes filter/search/attributes/page/pageSize/sort and passes resource-specific flags through after checking them against the registry.
   - Read-only custom ops are reached through a `view` param, e.g. `get` with `view: "references"` or `"acl"`, and `list` with `view: "by-user-id"`, `"fetch-by-skill-requirements"` and so on. The registry lists the valid views per resource.
   - Singletons resolve without an id.
   - Every tool call is written to the operation log (see phase 4).
   - *Accept:*
     - resources in `defer_to_official` are refused with a short "deferred by config" message
     - disabled toolsets are hidden
     - tool descriptions do not enumerate what the official server covers; that is controlled above this server
     - the combined `tools/list` payload stays under a fixed budget (proposed 6 KB JSON)
     - mocked-fetch tests cover each tool, each `view`, pagination meta passthrough and filter encoding
     - responses are trimmed to a size cap with a "use page/attributes" hint
4. **Write pipeline**: `wxcc-ext-create`, `update`, `delete`, `bulk`, `action`, available only when `mode: read-write`.
   - **Update semantics:** if the resource has a PATCH op, `update` sends the partial change as PATCH. That includes user and asset, whose PATCH body is undocumented; the phase 5 smoke tests verify it. Otherwise `update` is GET current → deep-merge the partial → PUT.
   - **Bulk:** write-only, with `SAVE` and `DELETE` items. There is no client-side item cap; the API's own limits apply. Bulk export is not exposed (all exports are deprecated or gone; use paginated `list`).
   - **`wxcc-ext-action`:** a single generic tool for non-CRUD writes: purge-inactive, reassign-agents, delete-reference, reskill, update-dynamic-skill, update-resource and the CSQ `fetch-by-*` POSTs. Each is a registry `custom` op with its own body schema, available via describe-resource.
   - **Flow:**
     1. snapshot: GET current and write it to the snapshot dir. This costs little, because the GET is already needed for the merge and the version check.
     2. build the request: a partial body for PATCH, a merged body for PUT (strip readOnly fields, keep `version`), or the given body for create/action.
     3. dry-run: the default. Returns a diff and a confirmation hash, and makes no API change.
     4. apply: requires the hash. Re-GETs the resource and **rejects** the write if its `version` differs from the snapshot (stale version), telling the model to re-read and retry.
     5. log: append an entry to the operation log.
   - **Operation log:** covers every operation the server performs, reads and writes, dry-runs and applies.
     - Location: daily text files `~/.wxcc-ext/logs/wxcc-ext-YYYY-MM-DD.log` (directory configurable).
     - Format: one line per operation, a single JSON object starting with an ISO-8601 timestamp, so `grep` and `jq` both work.
     - Fields: `ts`, `tool`, `resource`, `id`, `method`, `path`, `phase` (read/dry-run/apply), `status`, `trackingId`, `durationMs`, `changedFields`, and `snapshot` (path to the snapshot file).
     - Never the token or audio bytes.
   - **Snapshots:** `~/.wxcc-ext/snapshots/<resource>/<id>/<timestamp>.json` holds the before state of each applied write, which makes a manual rollback possible. No automatic retention or cleanup in v2.
   - **Audio input** (audio-file and agent-personal-greeting create/update):
     - The tool accepts either `audioPath` (a local file in any format) or `text`, plus an optional `voice`.
     - With `text`, the server runs macOS `say` to synthesise the audio. The voice comes from the call's `voice` if given, else from config `audio.voice`, else the system default.
     - Either way, it converts the result with `ffmpeg` to the format WxCC requires (default: WAV, 8 kHz, mono, 16-bit PCM; configurable), then uploads it as multipart.
     - At startup and before use, the server checks for `ffmpeg` and `say`. If either is missing, the tool returns a short message asking the user to install it or to name an alternative via config (`audio.ffmpeg_path`, `audio.tts_command`).
     - Child processes are spawned with argument arrays, never a shell string, and work in a temp dir that is removed afterwards.
   - *Accept:* tests cover:
     - PATCH chosen over PUT when available
     - merge semantics for PUT (arrays replaced, not merged, unless overridden)
     - stale-version rejection
     - 207 per-item reporting, including DELETE items
     - 412 reporting the referencing entities
     - read-only mode refusing all writes
     - a log line for reads, dry-runs and applies on both success and failure, with no token in it
     - the audio path with `ffmpeg`/`say` mocked, including the missing-tool message
     
     No tool handler imports `fetch`; a lint or grep test enforces this.
5. **Live smoke tests (sandbox)**
   - `npm run test:live` is skipped unless `WXCC_LIVE=1` is set and the configured orgId is in a `sandbox_org_ids` allowlist.
   - *Accept:*
     - list + get pass for every non-deferred resource
     - full create → get → update (dry-run, then apply) → delete passes for one simple resource (global-variable or work-type, name prefix `wxcc-ext-smoke-`), with cleanup in `afterAll`
     - a PATCH update on a user (a harmless field, restored afterwards) confirms the undocumented PATCH body
     - a stale-version update is rejected
     - one TTS audio file is created and deleted, confirming the WAV format is accepted
     - singletons are read-only in the smoke test
     - no token appears in output
6. **Docs and side-by-side setup**
   - README covers:
     - install
     - the config file (region, mode, toolsets, `defer_to_official`, log/snapshot dirs, audio tools)
     - the token-only-in-env rule
     - how to search the operation log
     - sample Claude Code / Claude Desktop MCP configs that run this server next to Cisco's official server
   - *Accept:* following the README from a clean checkout gets both servers listed in a client, and a deferred resource is refused with the config message.

## e. Open questions
None at the moment. Anything new found during a phase gets added here.

### Resolved
- **Base URL form:** `https://api.wxcc-<region>.cisco.com` + `/organization/{orgid}/…`, with no `/v1` prefix. This matches the developer.webex.com code samples; the v1 README was wrong.
- **Region config:** config takes `region` (e.g. `us1`), and the client derives `https://api.wxcc-<region>.cisco.com` from it. An optional `base_url` overrides the derived host. A `base_url` ending in `/v1` is rejected with a short error.
- **Deprecated AI resources** (agent-burnout, auto-csat, auto-csat-question, generated-summaries): not needed. They are dropped from the registry.
- **Portal page state as the spec source:** accepted, using the committed snapshot approach in section c.
- **organization-setting / tenant-configuration writes:** no extra protection beyond `read-write` mode. They go through the normal write pipeline, and admins decide when to use them.
- **PATCH:** use PATCH whenever the resource has it, including user and asset; otherwise GET + merge + PUT.
- **Audio uploads:** in scope. Input is a provided file or text for macOS `say`, converted with `ffmpeg`. If a tool is missing, ask the user for an alternative.
- **Deprecated ops:** always removed. Bulk is write-only, and bulk export is not exposed.
- **Ops outside CRUD:** reads via `view` on list/get, writes via the new `wxcc-ext-action` tool.
- **Bulk DELETE:** allowed, with no client-side item cap. The admin is responsible for the instructions.
- **Logging and snapshots:** daily, timestamped, grep-able text log of every operation, plus before-snapshots for applied writes.
- **Stale versions:** rejected before apply.
- **Official server coverage:** not modelled in this server; controlled at a higher level. Only `defer_to_official` applies.
- **Region list:** the official codes are us1, eu1, eu2, anz1, ca1, jp1 and sg1. They are the default `regions` list in config, editable so future regions need no code change.
- **Audio format:** default WAV, 8 kHz, mono, 16-bit PCM, configurable. The phase 5 smoke test confirms it is accepted.
- **TTS voice:** a default `audio.voice` in config, overridable per call.
- **Holiday lists and overrides:** kept in this server (toolset `schedule`). They can be deferred later via `defer_to_official`.
- **CLAUDE.md:** updated to match these decisions (official server coverage not described in tool descriptions, `action` tool, PATCH-first update, operation log, spec fetch).
