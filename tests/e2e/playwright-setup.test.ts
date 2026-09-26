import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("TICKET-T02: Playwright E2E evaluation and testnet verification strategy", () => {
  const manualScenarioPath = path.resolve(process.cwd(), "docs/manual-test-scenarios.md");
  assert.ok(fs.existsSync(manualScenarioPath), "Manual test scenarios document must exist");

  const content = fs.readFileSync(manualScenarioPath, "utf-8");
  assert.ok(content.includes("Scenario 01: Sign-In with Ethereum (SIWE)"), "Must cover SIWE login");
  assert.ok(content.includes("Scenario 02: Token Case File Investigation & Auto-Save"), "Must cover Dossier investigation");
  assert.ok(content.includes("Scenario 03: Public Case File Snapshot Publishing & Forking"), "Must cover Publish & Save copy");

  const decisionDocPath = path.resolve(process.cwd(), "docs/testing-strategy.md");
  assert.ok(fs.existsSync(decisionDocPath), "Testing strategy decision document must exist");

  const strategyContent = fs.readFileSync(decisionDocPath, "utf-8");
  assert.ok(strategyContent.includes("E2E Testing Strategy Decision"), "Strategy decision title must exist");
  assert.ok(strategyContent.includes("Manual QA Protocol"), "Strategy must formalize QA protocol");
  assert.ok(strategyContent.includes("Critical Scenarios"), "Strategy must document critical scenarios");
});
