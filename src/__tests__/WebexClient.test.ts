import test from "node:test";
import assert from "node:assert/strict";
import { WebexClient } from "../client/WebexClient.js";

test("WebexClient", async (t) => {
  const config = {
    webexToken: "fake-token",
    orgId: "fake-org",
    baseUrl: "https://api.fake.com/v1"
  };
  const client = new WebexClient(config);

  await t.test("getOrgId returns configured orgId", async () => {
    assert.strictEqual(client.getOrgId(), "fake-org");
  });

  // Native fetch cannot be easily mocked in node:test without globals intercept,
  // but we test basic properties initialized properly.
  await t.test("initializes correctly", async () => {
    assert.ok(client);
    assert.strictEqual(typeof client.get, "function");
    assert.strictEqual(typeof client.post, "function");
    assert.strictEqual(typeof client.put, "function");
    assert.strictEqual(typeof client.delete, "function");
  });
});
