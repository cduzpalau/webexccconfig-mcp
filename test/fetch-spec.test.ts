import { describe, expect, it } from "vitest";
import { collectOperations, extractInitialState, shareResponses } from "../scripts/fetch-spec.js";

const ERR = { description: "Unauthorized" };

function leaf(method: string, path: string, extra: Record<string, unknown> = {}) {
  return {
    displayText: `${method} ${path}`,
    url: `/docs/api/v1/x/${method.toLowerCase()}`,
    versions: [
      {
        version: 1,
        spec: JSON.stringify({
          type: "api",
          title: "t",
          meta: { info: { title: "Team", description: "<p>Teams</p>" }, servers: [{ url: "https://internal" }] },
          spec: { method: method.toLowerCase(), path, operationId: "op", responses: { "200": { description: "OK" }, "401": ERR }, ...extra },
        }),
      },
    ],
  };
}

function page(state: unknown): string {
  return `<html><script nonce="n">window.__INITIAL_STATE__ = ${JSON.stringify(state)};</script><script>other()</script></html>`;
}

function state(configGroups: unknown[]) {
  return {
    sideNavigation: {
      sideNavigationData: {
        subMenu: [
          { title: "Guides" },
          {
            title: "API Reference (Contact Center)",
            subMenu: [
              { title: "Webex Contact Center: AI", subMenu: [{ title: "AI: x", subMenu: [leaf("GET", "/organization/{orgid}/ai")] }] },
              { title: "Webex Contact Center: Configuration", subMenu: configGroups },
            ],
          },
        ],
      },
    },
  };
}

describe("extractInitialState", () => {
  it("parses the embedded state", () => {
    expect(extractInitialState(page({ a: 1 }))).toEqual({ a: 1 });
  });
  it("fails clearly when the portal structure changes", () => {
    expect(() => extractInitialState("<html></html>")).toThrow(/no window.__INITIAL_STATE__/);
  });
});

describe("collectOperations", () => {
  it("collects only the Configuration section, keyed by METHOD path, sorted", () => {
    const { operations, apis } = collectOperations(
      state([
        {
          title: "Configuration: Team",
          subMenu: [leaf("PUT", "/organization/{orgid}/team/{id}"), leaf("GET", "/organization/{orgid}/v2/team")],
        },
      ]),
    );
    expect(Object.keys(operations)).toEqual(["GET /organization/{orgid}/v2/team", "PUT /organization/{orgid}/team/{id}"]);
    const op = operations["PUT /organization/{orgid}/team/{id}"]!;
    expect(op.group).toBe("Team");
    expect(op.apiTitle).toBe("Team");
    expect(op.operation.method).toBe("PUT");
    expect(JSON.stringify(op)).not.toContain("internal"); // servers are dropped
    expect(apis).toEqual({ Team: "<p>Teams</p>" });
  });

  it("rejects invalid or duplicate operations", () => {
    expect(() =>
      collectOperations(state([{ title: "Configuration: Bad", subMenu: [leaf("GET", "/v1/people/me")] }])),
    ).toThrow(/invalid operations/);
    expect(() =>
      collectOperations(
        state([{ title: "Configuration: Dup", subMenu: [leaf("GET", "/organization/{orgid}/a"), leaf("GET", "/organization/{orgid}/a")] }]),
      ),
    ).toThrow(/duplicate operation/);
    expect(() => collectOperations({ sideNavigation: { sideNavigationData: { subMenu: [] } } })).toThrow(/not found/);
  });
});

describe("shareResponses", () => {
  it("moves repeated responses into a shared table and leaves unique ones inline", () => {
    const { operations } = collectOperations(
      state([{ title: "Configuration: Team", subMenu: [leaf("GET", "/organization/{orgid}/a"), leaf("GET", "/organization/{orgid}/b")] }]),
    );
    operations["GET /organization/{orgid}/b"]!.operation.responses["200"] = { description: "unique" };
    const { operations: out, sharedResponses } = shareResponses(operations);
    const ids = Object.keys(sharedResponses);
    expect(ids).toHaveLength(1);
    expect(sharedResponses[ids[0]!]).toEqual(ERR);
    expect(out["GET /organization/{orgid}/a"]!.operation.responses["401"]).toEqual({ $shared: ids[0] });
    expect(out["GET /organization/{orgid}/b"]!.operation.responses["200"]).toEqual({ description: "unique" });
  });
});
