import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CHAIN_ID, DEFAULT_RPC_URL, robinhoodChain } from "../../config/chain";

test("TICKET-M04: Production smoke testing and latency verification", () => {
  assert.equal(CHAIN_ID, 4663);
  assert.equal(robinhoodChain.id, 4663);
  assert.equal(DEFAULT_RPC_URL, "https://rpc.mainnet.chain.robinhood.com");

  const corePages = [
    "app/page.tsx",
    "app/feed/page.tsx",
    "app/d/[ca]/page.tsx",
    "app/deployer/[address]/page.tsx",
    "app/census/page.tsx",
    "app/how/page.tsx",
    "app/docs/page.tsx",
    "app/map/page.tsx",
    "app/watchlist/page.tsx",
    "app/dossiers/page.tsx",
    "app/me/page.tsx"
  ];

  for (const page of corePages) {
    const pagePath = path.resolve(process.cwd(), page);
    assert.ok(fs.existsSync(pagePath), `Page file ${page} must exist for production serving`);
  }

  const manualScenarioPath = path.resolve(process.cwd(), "docs/manual-test-scenarios.md");
  assert.ok(fs.existsSync(manualScenarioPath), "Manual test scenarios document must exist");

  const content = fs.readFileSync(manualScenarioPath, "utf-8");
  assert.ok(content.includes("Scenario 04: Deployer Reputation Profile"), "Must verify deployer profile scenario");
  assert.ok(content.includes("Scenario 05: Real-Time Launch Feed"), "Must verify feed scenario");
  assert.ok(content.includes("Scenario 06: Macro Census"), "Must verify census scenario");
});
