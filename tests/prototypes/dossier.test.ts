import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";

describe("Dossier Page Prototype (TICKET-30)", () => {
  const rootDir = process.cwd();
  const prototypePath = path.join(rootDir, "prototypes", "dossier.html");

  test("prototypes/dossier.html file must exist", () => {
    assert.strictEqual(
      fs.existsSync(prototypePath),
      true,
      "prototypes/dossier.html must exist"
    );
  });

  test("contains valid HTML structure and Dossier.OS visual styling", () => {
    const html = fs.readFileSync(prototypePath, "utf-8");
    assert.ok(html.includes("<!DOCTYPE html>"), "must have doctype");
    assert.ok(html.includes("<html"), "must have html tag");
    assert.ok(html.includes("Dossier.OS"), "must reference Dossier.OS theme or brand");
    assert.ok(html.includes("#F6F7F9") || html.includes("--bg-canvas"), "must use canvas background token");
    assert.ok(html.includes("#0D1117") || html.includes("--border-hard"), "must use border hard token");
  });

  test("contains all 13 core Dossier UI sections", () => {
    const html = fs.readFileSync(prototypePath, "utf-8");

    const requiredSections = [
      "dossier-header",
      "market-flow-block",
      "trade-flow-chart",
      "trade-flow-panel",
      "wallet-map",
      "top-wallets-table",
      "deployer-history",
      "constellation-graph",
      "research-panel",
      "since-last-check",
      "scout-remembers",
      "connections-timeline",
      "dossier-footer",
    ];

    for (const sectionId of requiredSections) {
      assert.ok(
        html.includes(`id="${sectionId}"`) || html.includes(`data-section="${sectionId}"`),
        `must contain section identifier for ${sectionId}`
      );
    }
  });

  test("strictly contains no external JavaScript scripts", () => {
    const html = fs.readFileSync(prototypePath, "utf-8");
    assert.strictEqual(
      /<script\b[^>]*src=/i.test(html),
      false,
      "must not include external JavaScript scripts"
    );
  });
});
