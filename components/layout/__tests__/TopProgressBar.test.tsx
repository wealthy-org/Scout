import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { TopProgressBar } from "../TopProgressBar";

describe("TopProgressBar Component (TICKET-86)", () => {
  test("should render top progress bar container with fixed position and neon accent", () => {
    const html = renderToString(<TopProgressBar />);
    assert.ok(html.includes("top-0"), "Progress bar must be fixed at the top");
    assert.ok(html.includes("z-50"), "Progress bar must have high z-index");
    assert.ok(html.includes("bg-") || html.includes("gradient"), "Progress bar must use accent/gradient color");
  });

  test("should include subtle neon glow shadow styling", () => {
    const html = renderToString(<TopProgressBar />);
    assert.ok(html.includes("shadow-"), "Progress bar must include glowing shadow");
  });
});
