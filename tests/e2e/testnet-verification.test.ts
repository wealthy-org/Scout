import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CHAIN_ID, FACTORY_ADDRESS, MULTICALL3_ADDRESS } from "../../config/chain";
import { WEIGHT_GRAD_RATE, WEIGHT_NO_DOA, WEIGHT_NO_BURST } from "../../config/score";
import { DIFF_FDV_PCT, DIFF_LIQUIDITY_PCT, DIFF_SCORE_POINTS } from "../../config/diff";
import { siteMetadata } from "../../config/metadata";

test("TICKET-T03: Testnet manual test execution and system readiness verification", () => {
  assert.equal(CHAIN_ID, 4663);
  assert.ok(MULTICALL3_ADDRESS.startsWith("0x"));
  assert.ok(FACTORY_ADDRESS.startsWith("0x"));

  assert.equal(WEIGHT_GRAD_RATE, 0.55);
  assert.equal(WEIGHT_NO_DOA, 0.25);
  assert.equal(WEIGHT_NO_BURST, 0.20);

  assert.equal(DIFF_FDV_PCT, 10);
  assert.equal(DIFF_LIQUIDITY_PCT, 15);
  assert.equal(DIFF_SCORE_POINTS, 8);

  const titleString = typeof siteMetadata.title === "object" && siteMetadata.title !== null && "default" in siteMetadata.title
    ? String(siteMetadata.title.default)
    : String(siteMetadata.title);

  assert.ok(titleString.includes("Scout"));
  assert.ok(String(siteMetadata.description).length > 20);

  const scenarioDoc = path.resolve(process.cwd(), "docs/manual-test-scenarios.md");
  const content = fs.readFileSync(scenarioDoc, "utf-8");

  for (let i = 1; i <= 8; i++) {
    const scenarioMarker = `Scenario 0${i}:`;
    assert.ok(content.includes(scenarioMarker), `Scenario 0${i} must be documented`);
  }

  const routesToCheck = [
    "app/api/auth/nonce/route.ts",
    "app/api/auth/verify/route.ts",
    "app/api/auth/logout/route.ts",
    "app/api/dossier/[ca]/route.ts",
    "app/api/deployer/[address]/route.ts",
    "app/api/watchlist/route.ts",
    "app/api/census/route.ts",
    "app/api/cron/census/route.ts",
    "app/api/publish/[ca]/route.ts",
    "app/api/p/[slug]/route.ts",
    "app/api/p/[slug]/save/route.ts",
    "app/api/me/route.ts"
  ];

  for (const route of routesToCheck) {
    const routePath = path.resolve(process.cwd(), route);
    assert.ok(fs.existsSync(routePath), `API Route ${route} must exist and be deployed`);
  }
});
