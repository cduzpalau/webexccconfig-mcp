# webexccconfig-mcp (v2)

Stdio-only MCP server that fills the gaps in Cisco's official Webex Contact Center MCP server.
It exposes a SMALL, FIXED set of generic tools over a generated resource registry.
Design details: see docs/architecture.md. Current work plan: see docs/refactor-plan.md.

## Hard rules
- Stdio transport only. Never add Express, HTTP, SSE, or Docker code.
- Never add per-resource tools. New resources go in the registry, not in server.tool() calls.
- Never expose a resource listed under `defer_to_official` in config (flows, entry points,
  business hours, dial plans, dial numbers are handled by the official server).
- All tool names are prefixed `wxcc-ext-`.
- Never log, print, or write the Webex token anywhere. Read it only from the WEBEX_TOKEN env var.
- Never read .env files.
- Writes must go through the write pipeline (snapshot → merge → dry-run/diff → apply → audit log).
  Never call fetch directly from a tool handler.

## Layout
- src/index.ts           entry point: load config, validate token, start stdio server
- src/config.ts          YAML config + env loading (region, org id, mode, toolsets, defer list)
- src/auth.ts            token provider interface (personal token now, OAuth later)
- src/client.ts          the only place that calls the Webex CC REST API
- src/registry/          GENERATED resource registry. Do not hand-edit; run `npm run gen:registry`
- src/tools/             the generic tools (list_resource_types, describe_resource, list, get,
                         create, update, delete, bulk)
- src/write/             snapshot, merge, diff, audit log
- scripts/gen-registry.ts  builds src/registry from apireference/
- apireference/          source API docs (input to the generator)
- test/                  vitest tests with fetch mocked; fixtures in test/fixtures

## Commands
- npm run build          compile TypeScript
- npm run typecheck      tsc --noEmit
- npm test               unit tests (no network)
- npm run test:live      opt-in smoke tests against a SANDBOX tenant only
- npm run gen:registry   regenerate the registry from apireference/

## Conventions
- TypeScript ESM, @modelcontextprotocol/sdk, Zod for all input schemas.
- Keep always-loaded tool schemas small; detailed resource schemas are returned by describe_resource.
- Tool descriptions must say what the official server handles so the model routes correctly.
- For full-replace (PUT) resources, update = GET current → deep-merge the partial change → PUT.
- Errors returned to the model should be short and actionable (e.g. "token expired: refresh WEBEX_TOKEN").

## Workflow
- Work one phase of docs/refactor-plan.md at a time; run typecheck and tests before finishing.
- The v1 implementation is available read-only in ../wxcc-v1 for endpoint quirks. Do not copy
  its per-tool structure.
