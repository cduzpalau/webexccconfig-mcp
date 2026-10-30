/** Enforces CLAUDE.md hard rules that can be checked statically. */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? sourceFiles(join(dir, e.name)) : e.name.endsWith(".ts") ? [join(dir, e.name)] : [],
  );
}

describe("guardrails", () => {
  it("has no HTTP server dependencies", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    for (const banned of ["express", "cors", "fastify", "koa", "@types/express", "@types/cors"]) {
      expect(deps).not.toContain(banned);
    }
  });

  it("src has no HTTP/SSE transport code", () => {
    for (const file of sourceFiles(join(ROOT, "src"))) {
      const text = readFileSync(file, "utf8");
      expect(text, relative(ROOT, file)).not.toMatch(
        /from ["'](express|cors|node:http|node:https|http|https)["']|sse\.js|streamableHttp|createServer\(/,
      );
    }
  });

  it("only src/client.ts calls fetch", () => {
    for (const file of sourceFiles(join(ROOT, "src"))) {
      if (file.endsWith(join("src", "client.ts"))) continue;
      expect(readFileSync(file, "utf8"), relative(ROOT, file)).not.toMatch(/\bfetch\s*\(/);
    }
  });
});
