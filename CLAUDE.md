# webexccconfig-mcp (v2)

Stdio-only MCP server that fills the gaps in Cisco's official Webex Contact Center MCP server.
It exposes a SMALL, FIXED set of generic tools over a generated resource registry.
Design details: see docs/architecture.md. Current work plan: see docs/refactor-plan.md.

## Hard rules
- Stdio transport only. Never add Express, HTTP, SSE, or Docker code.
- Never add per-resource tools. New resources go in the registry, not in server.tool() calls.
- Never expose a resource listed under `defer_to_official` in config (default list: flows, entry
  points, business hours, dial plans, dial numbers).
- Never expose deprecated API operations.
- All tool names are prefixed `wxcc-ext-`.
- .env holds a SANDBOX token only. You may read and edit it for development and live testing.
  Never copy the token into code, docs, fixtures, logs, test output, or commits.
- Never log, print, or write the Webex token anywhere. Read it only from the WEBEX_TOKEN env var.
- Writes must go through the write pipeline (snapshot → build PATCH or merged PUT → dry-run/diff →
  stale-version check + apply → operation log). Never call fetch directly from a tool handler.
- Spawn external tools (ffmpeg, say) with argument arrays, never a shell string.

## Layout
- src/index.ts           entry point: load config, validate token, start stdio server
- src/config.ts          YAML config + env loading (region + editable regions list, base_url override,
                         org id, mode, toolsets, defer list, log/snapshot dirs, audio tools)
- src/auth.ts            token provider interface (personal token now, OAuth later)
- src/client.ts          the only place that calls the Webex CC REST API
- src/registry/          GENERATED resource registry. Do not hand-edit; run `npm run gen:registry`
- src/registry-types.ts  hand-written types for the generated registry
- src/tools/             the generic tools (list_resource_types, describe_resource, list, get,
                         create, update, delete, bulk, action)
- src/write/             snapshot, merge, diff, operation log, audio conversion
- scripts/fetch-spec.ts  snapshots the OpenAPI embedded in developer.webex.com into
                         apireference/openapi/configuration.json (manual, needs network)
- scripts/gen-registry.ts  builds src/registry from apireference/openapi/configuration.json (offline)
- scripts/registry-overrides.ts  hand-maintained generator input (keys, aliases, toolsets, quirks)
- apireference/          source API docs; openapi/ is the generator input, *.md is legacy reference
- test/                  vitest tests with fetch mocked; fixtures in test/fixtures

## Commands
- npm run build          compile TypeScript
- npm run typecheck      tsc --noEmit
- npm test               unit tests (no network)
- npm run test:live      opt-in smoke tests against a SANDBOX tenant only
- npm run fetch:spec     refresh apireference/openapi/ from developer.webex.com
- npm run gen:registry   regenerate the registry from apireference/openapi/

## Conventions
- TypeScript ESM, @modelcontextprotocol/sdk, Zod for all input schemas.
- Keep always-loaded tool schemas small; detailed resource schemas are returned by describe_resource.
- Tool descriptions do not describe what the official server covers; routing between servers is
  controlled above this server. Only `defer_to_official` applies here.
- update = PATCH when the resource has a PATCH op; otherwise GET current → deep-merge the partial
  change → PUT. Reject the write if `version` changed since the snapshot.
- Non-CRUD reads go through a `view` param on list/get; non-CRUD writes go through `wxcc-ext-action`.
- Log every operation (reads included) to the daily operation log in ~/.wxcc-ext/logs/, one
  timestamped JSON line per operation. Never log the token or audio bytes.
- Errors returned to the model should be short and actionable (e.g. "token expired: refresh WEBEX_TOKEN").

## Workflow
- Work one phase of docs/refactor-plan.md at a time; run typecheck and tests before finishing.
- The v1 implementation is available read-only in ../wxcc-v1 for endpoint quirks. Do not copy
  its per-tool structure.
