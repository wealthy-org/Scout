import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Tosca Canvas & Colorful Pop Design System Foundation (TICKET-98)", () => {
  const rootDir = process.cwd();
  const globalsCssPath = path.join(rootDir, "app", "globals.css");

  test("globals.css exists and defines Tosca Canvas System tokens", () => {
    assert.strictEqual(fs.existsSync(globalsCssPath), true, "app/globals.css must exist");
    const content = fs.readFileSync(globalsCssPath, "utf8");

    const requiredToscaTokens = [
      "--color-canvas-main",
      "--color-canvas-bright",
      "--color-surface-deep",
      "--color-surface-mint",
      "--color-surface-cream",
      "--color-pop-yellow",
      "--color-pop-coral",
      "--color-pop-tangerine",
      "--color-pop-lavender",
      "--color-pop-pink",
      "--color-ink-light",
      "--color-ink-muted",
      "--color-ink-dark",
      "--color-status-success",
      "--color-status-warning",
      "--color-status-danger",
      "--color-status-info",
      "--shadow-pop-soft",
      "--shadow-pop-hard",
    ];

    for (const token of requiredToscaTokens) {
      assert.ok(
        content.includes(token),
        `globals.css @theme block must include token "${token}"`
      );
    }
  });

  test("globals.css sets body background to Tosca Main #0D746E and text to Ink Light #FFFDF7", () => {
    const content = fs.readFileSync(globalsCssPath, "utf8");
    assert.ok(content.includes("#0D746E") || content.includes("#0d746e"));
    assert.ok(content.includes("#FFFDF7") || content.includes("#fffdf7"));
  });

  test("globals.css defines Tosca and Pop utility classes", () => {
    const content = fs.readFileSync(globalsCssPath, "utf8");
    assert.ok(content.includes(".tosca-surface-deep"));
    assert.ok(content.includes(".tosca-surface-mint"));
    assert.ok(content.includes(".tosca-surface-cream"));
    assert.ok(content.includes(".pop-btn-yellow"));
    assert.ok(content.includes(".pop-btn-coral"));
    assert.ok(content.includes(".pop-shadow-hard"));
  });
});
