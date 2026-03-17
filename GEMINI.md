# Project: Webex Contact Center Configuration MCP server

## General Instructions

- When you generate new TypeScript or Javascript code, follow the existing coding style.
- Ensure all new functions and classes have JSDoc comments.
- Prefer functional programming paradigms where appropriate.
- Use official Typescript MCP Server SDK https://github.com/modelcontextprotocol/typescript-sdk
- Use official Webex APIs from https://developer.webex.com

## Deployment

- The project is configured for Google Cloud Run deployment.
- Project ID: `clteccct-poc-0map`
- Region: `europe-southwest1`
- Deployment Script: `./deploy.sh [stable|dev]`
- CI/CD: GitHub Actions workflow in `.github/workflows/deploy.yml` (branches `main` and `dev`).
- Required Env Vars in Cloud Run:
  - `WEBEX_TOKEN`: API Token.
  - `WEBEX_ORG_ID`: Webex CC Org ID.
  - `WEBEX_BASE_URL`: Datacenter URL (e.g., `https://api.wxcc-us1.cisco.com/v1`).

## Coding Style

- Use 2 spaces for indentation.
- Prefix interface names with `I` (for example, `IUserService`).
- Always use strict equality (`===` and `!==`).