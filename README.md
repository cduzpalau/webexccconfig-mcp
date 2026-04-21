# Webex Contact Center Configuration MCP Server

A comprehensive Model Context Protocol (MCP) server for managing and configuring Cisco Webex Contact Center resources. This server provides an LLM-friendly interface to 178+ configuration APIs, including Teams, Users, Skills, Queues, and more.

## 🚀 Quick Start

### Local Development (Stdio Mode)
To run the server locally for testing with the MCP Inspector or Gemini CLI:

1. **Clone and Install:**
   ```bash
   git clone <your-repo-url>
   cd webexccconfig-mcp
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file or export the following variables:
   ```bash
   export WEBEX_TOKEN="your_access_token"
   export WEBEX_ORG_ID="your_organization_id"
   export WEBEX_BASE_URL="https://api.wxcc-us1.cisco.com/v1"
   ```

3. **Run in Dev Mode:**
   ```bash
   npm run dev
   ```

### Test with MCP Inspector

If you want to run the compiled Javascript (Recommended if you've already run npm run build):
Command: node
Arguments: /Users/cpalau/wodev/work/webexccconfig-mcp/dist/index.js (Note: Remove webexccconfig-mcp completely from the command field)
If you want to run the TypeScript directly without building:
Command: npx
Arguments: Add these three separate arguments (most Inspector UIs let you add multiple args or separate them via space depending on the UI):
tsx
/Users/cpalau/wodev/work/webexccconfig-mcp/src/index.ts
--stdio

### Use with Claude Code or Gemini CLI

For terminal-based AI assistants like **Claude Code** or **Gemini CLI**, configure the server using stdio mode.

**For Claude Code:**
Add the MCP server directly via the CLI:
```bash
claude mcp add webexcc node /absolute/path/to/webexccconfig-mcp/dist/index.js
```
*Note: Make sure your `WEBEX_TOKEN`, `WEBEX_ORG_ID`, and `WEBEX_BASE_URL` are exported in your environment before running Claude Code, or pass them in.*

**Standard MCP Configuration JSON (Gemini / Claude Desktop):**
If your client uses a configuration file (like `mcp.json` or `claude_desktop_config.json`), add the following entry:
```json
{
  "mcpServers": {
    "webexccconfig-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/webexccconfig-mcp/dist/index.js"
      ],
      "env": {
        "WEBEX_TOKEN": "your_access_token",
        "WEBEX_ORG_ID": "your_organization_id",
        "WEBEX_BASE_URL": "https://api.wxcc-us1.cisco.com/v1"
      }
    }
  }
}
```
*(If running TypeScript directly without building, use `npx` as the command, with `["tsx", "/absolute/path/to/webexccconfig-mcp/src/index.ts"]` as arguments).*


### Deployment to Google Cloud Run (SSE/HTTP Mode)
The server is optimized for Cloud Run using the `Streamable HTTP` transport.

1. **Setup Deployment Script:**
   ```bash
   cp deploy.sh.example deploy.sh
   chmod +x deploy.sh
   # Edit deploy.sh with your GCP Project ID and Region
   ```

2. **Deploy:**
   ```bash
   ./deploy.sh dev
   ```

3. **Secure with IAM:**
   Ensure your service is protected by disabling public access and granting `roles/run.invoker` to authorized users/service accounts.

### Other Cloud Providers
The project includes a multi-stage `Dockerfile`. You can deploy the container to any provider (AWS Fargate, Azure Container Apps, etc.):
- **Port:** Listens on the port defined by the `PORT` environment variable (default 8080).
- **Transport:** Uses `SSE` and `Streamable HTTP` automatically when `PORT` is present.

---

## 🏗 Architecture Documentation

### Core Components
- **TypeScript & ESM:** Built with modern ES Modules for high performance and compatibility.
- **McpServer SDK:** Utilizes the official `@modelcontextprotocol/sdk`.
- **Express Framework:** Used for the HTTP/SSE transport layer.
- **Zod:** Provides robust runtime type safety and auto-generated JSON schemas for all tools.

### Transport Mechanisms
1. **StdioTransport (Local):** Default mode for CLI-based interactions.
2. **SSEServerTransport (Standard):** Legacy SSE support via `/sse` and `/messages`.
3. **StreamableHTTPServerTransport (Unified):** Advanced, unified endpoint via `/mcp` that handles both stream initiation and message posting.

### Session Management
The server uses a **Singleton Pattern** for the `StreamableHTTPServerTransport` to handle multiple multiplexed sessions over HTTP efficiently. For standard SSE, it creates isolated `McpServer` instances per session to ensure state integrity.

---

## 🤖 AI Coding & Improvement Guide

This project is designed to be easily extended by AI coding tools (like Gemini, Cursor, or Windsurf).

### How to Add a New API Tool
1. **Define the DTO:** Add the interface to `src/types.ts`. Follow the `IDTO` naming convention.
2. **Register the Tool:** In `src/index.ts`, add a new `server.tool` call within the `registerTools` function.
3. **Pattern:**
   ```typescript
   server.tool(
     "Tool_Name",
     "Human-readable description",
     { /* Zod Schema */ },
     async (params) => {
       const url = `${config.baseUrl}/organization/${config.orgId}/path`;
       // Perform fetch and handle IApiErrorResponse
     }
   );
   ```

### Tips for AI Improvements
- **Keep it Surgical:** Edits to `src/index.ts` should be targeted. Use unique anchors like tool comments for `replace` operations.
- **DRY Logic:** Consider refactoring the `fetch` logic into a helper function if you are adding many similar GET/POST tools.
- **Validation First:** Always use `z.number().int()` for IDs or counts and `z.enum()` for fixed API values.

---

## 📋 Available APIs & Implementation Status

| API Name | Description | Resource Path | Implementation |
| :--- | :--- | :--- | :--- |
| **Address Book** | Manage address books and entries. | `/v1/address-book` | ✅ Complete (13 tools) |
| **Users** | Manage agents, supervisors, and profiles. | `/v2/user` | ✅ Complete (12 tools) |
| **Teams** | Manage groups and capacity. | `/v2/team` | ✅ Complete (9 tools) |
| **Skills** | Expertise-based routing configuration. | `/v1/skill` | ✅ Complete (11 tools) |
| **Contact Service Queues** | Inbound holding and distribution. | `/v3/contact-service-queue` | ✅ Complete (14 tools) |
| **Desktop Layout/Profile** | Agent desktop configurations. | `/v2/desktop-layout` | ✅ Complete (18 tools) |
| **Dial Plan/Number** | Routing and number mapping. | `/v3/dial-number` | ✅ Complete (18 tools) |
| **Multimedia Profile** | Multi-channel agent limits. | `/v2/multimedia-profile` | ✅ Complete (9 tools) |
| **Outdial ANI** | Outbound campaign settings. | `/v1/outdial-ani` | ✅ Complete (14 tools) |
| **Global Variables** | Cross-flow variable management. | `/v2/cad-variable` | ✅ Complete (10 tools) |
| **Business Hours** | Schedules and Overrides. | `/v1/business-hours` | ✅ Complete (22 tools) |

---

## 📚 API Reference
Detailed documentation for every implemented tool can be found in the `docs/` and `apireference/` folders. These files are derived from the [Official Webex Contact Center API Documentation](https://developer.webex.com/webex-contact-center).
