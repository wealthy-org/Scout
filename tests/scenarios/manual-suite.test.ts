import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Manual Test Scenarios Documentation (TICKET-T01)", () => {
  const docPath = path.resolve(process.cwd(), "docs/manual-test-scenarios.md");

  it("ensures docs/manual-test-scenarios.md exists", () => {
    assert.ok(fs.existsSync(docPath), "docs/manual-test-scenarios.md must exist");
  });

  it("covers all core user flow scenarios in structured checklists", () => {
    const content = fs.readFileSync(docPath, "utf-8");

    assert.ok(content.includes("SIWE"));
    assert.ok(content.includes("Case File"));
    assert.ok(content.includes("Publish"));
    assert.ok(content.includes("Save a Copy") || content.includes("Fork"));
    assert.ok(content.includes("Watchlist"));
    assert.ok(content.includes("Launch Feed"));
    assert.ok(content.includes("Census"));
    assert.ok(content.includes("Export") && content.includes("Import"));
  });
});
