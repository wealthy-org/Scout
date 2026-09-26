import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import nextConfig from "../../next.config";

test("TICKET-M03: Next.js production build configuration and smoke validation", () => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  assert.equal(pkg.scripts.build, "next build");
  assert.equal(pkg.scripts.start, "next start");
  assert.equal(pkg.scripts.lint, "eslint");

  assert.equal(nextConfig.reactStrictMode, true);
  assert.equal(nextConfig.poweredByHeader, false);

  const tsconfigPath = path.resolve(process.cwd(), "tsconfig.json");
  assert.ok(fs.existsSync(tsconfigPath), "tsconfig.json must exist");
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
  assert.equal(tsconfig.compilerOptions.strict, true);

  const eslintConfigPath = path.resolve(process.cwd(), "eslint.config.mjs");
  assert.ok(fs.existsSync(eslintConfigPath), "eslint.config.mjs must exist");
});
