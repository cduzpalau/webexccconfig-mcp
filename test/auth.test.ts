import { inspect } from "node:util";
import { describe, expect, it } from "vitest";
import { AuthError, StaticTokenProvider } from "../src/auth.js";

const TOKEN = "fake-token-abc123";

describe("StaticTokenProvider", () => {
  it("returns the token from WEBEX_TOKEN", async () => {
    await expect(StaticTokenProvider.fromEnv({ WEBEX_TOKEN: ` ${TOKEN} ` }).getToken()).resolves.toBe(TOKEN);
  });

  it("errors when WEBEX_TOKEN is missing or blank", () => {
    expect(() => StaticTokenProvider.fromEnv({})).toThrow(AuthError);
    expect(() => StaticTokenProvider.fromEnv({ WEBEX_TOKEN: "  " })).toThrow(/not set/);
  });

  it("rejects a token with a Bearer prefix or whitespace, without echoing it", () => {
    for (const bad of [`Bearer ${TOKEN}`, `${TOKEN} extra`]) {
      try {
        StaticTokenProvider.fromEnv({ WEBEX_TOKEN: bad });
        expect.unreachable();
      } catch (err) {
        expect((err as Error).message).toMatch(/malformed/);
        expect((err as Error).message).not.toContain(TOKEN);
      }
    }
  });

  it("does not leak the token through JSON or inspect", () => {
    const p = new StaticTokenProvider(TOKEN);
    expect(JSON.stringify({ p })).not.toContain(TOKEN);
    expect(inspect(p)).not.toContain(TOKEN);
  });
});
