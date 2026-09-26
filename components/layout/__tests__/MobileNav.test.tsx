import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { Header } from "../Header";

describe("Mobile Navigation & Hamburger Menu Verification (TICKET-88)", () => {
  test("Header must render hamburger button visible on mobile (md:hidden)", () => {
    const html = renderToString(<Header />);
    assert.ok(html.includes("aria-label=\"Toggle Mobile Menu\"") || html.includes("aria-label=\"Toggle Menu\"") || html.includes("md:hidden"), "Header must include a mobile menu toggle button");
  });

  test("Header must contain mobile navigation links to all core routes", () => {
    const html = renderToString(<Header />);
    assert.ok(html.includes("href=\"/library\""), "Header must have link to Library");
    assert.ok(html.includes("href=\"/watchlist\""), "Header must have link to Watchlist");
    assert.ok(html.includes("href=\"/census\""), "Header must have link to Census");
    assert.ok(html.includes("href=\"/docs\""), "Header must have link to Docs");
  });
});
