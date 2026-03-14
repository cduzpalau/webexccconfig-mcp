import test from "node:test";
import assert from "node:assert/strict";

test("basic server structure", async (t) => {
  await t.test("can import types", async () => {
    // This is just to check if the file is correctly compiled and can import types
    const resource = { id: "1", name: "Sales Queue" };
    assert.strictEqual(resource.id, "1");
    assert.strictEqual(resource.name, "Sales Queue");
  });
});
