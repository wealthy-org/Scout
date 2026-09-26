import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Chroma Theme Tokens & High-Chroma Design System Foundation (TICKET-89)", () => {
  const rootDir = process.cwd();
  const globalsCssPath = path.join(rootDir, "app", "globals.css");

  test("globals.css exists and defines Chroma colorful theme tokens", () => {
    assert.strictEqual(fs.existsSync(globalsCssPath), true, "app/globals.css must exist");
    const content = fs.readFileSync(globalsCssPath, "utf8");

    const requiredChromaColors = [
      "--color-chroma-mint",
      "--color-chroma-cyan",
      "--color-chroma-blue",
      "--color-chroma-amber",
      "--color-chroma-coral",
      "--color-chroma-orchid",
      "--color-chroma-bg",
      "--color-chroma-surface",
      "--color-chroma-card",
    ];

    for (const color of requiredChromaColors) {
      assert.ok(
        content.includes(color),
        `globals.css @theme block must include Chroma color token "${color}"`
      );
    }
  });

  test("globals.css defines ambient gradient aura and pulse glow keyframes", () => {
    const content = fs.readFileSync(globalsCssPath, "utf8");
    assert.ok(content.includes("@keyframes pulse-glow"));
    assert.ok(content.includes(".animate-pulse-glow"));
    assert.ok(content.includes(".chroma-glass"));
    assert.ok(content.includes(".chroma-glass-hover"));
    assert.ok(content.includes(".chroma-gradient-text-mint"));
    assert.ok(content.includes(".chroma-gradient-text-sunset"));
    assert.ok(content.includes(".chroma-gradient-text-cosmic"));
  });
});
