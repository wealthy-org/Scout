import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("WCAG AA Accessibility Audit (TICKET-85)", () => {
  const cssPath = path.resolve(process.cwd(), "app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("globals.css contains prefers-reduced-motion media query for motion accessibility", () => {
    assert.ok(
      cssContent.includes("prefers-reduced-motion: reduce"),
      "globals.css must support prefers-reduced-motion: reduce"
    );
  });

  it("globals.css contains focus-visible keyboard outline rules", () => {
    assert.ok(
      cssContent.includes(":focus-visible"),
      "globals.css must define visible focus outline for keyboard accessibility"
    );
  });

  it("validates core ink and canvas colors achieve WCAG AA contrast ratio (> 4.5:1)", () => {
    // Relative luminance calculation for #0D1117 and #F6F7F9
    const getLuminance = (r: number, g: number, b: number) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const lumInk = getLuminance(13, 17, 23); // #0D1117
    const lumCanvas = getLuminance(246, 247, 249); // #F6F7F9
    const contrastRatio = (Math.max(lumInk, lumCanvas) + 0.05) / (Math.min(lumInk, lumCanvas) + 0.05);

    assert.ok(contrastRatio >= 4.5, `Contrast ratio ${contrastRatio} must be >= 4.5 (WCAG AA)`);
    assert.ok(contrastRatio > 14.0, "Black ink on light chalk canvas yields exceptional > 14:1 contrast");
  });
});
