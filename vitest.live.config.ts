import { defineConfig } from "vitest/config";

// Opt-in smoke tests against a SANDBOX tenant (phase 5). Skipped unless WXCC_LIVE=1.
export default defineConfig({
  test: {
    include: ["test/live/**/*.test.ts"],
    passWithNoTests: true,
    testTimeout: 60_000,
  },
});
