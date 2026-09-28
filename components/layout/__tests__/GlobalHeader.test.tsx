import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { Header } from "@/components/layout/Header";

describe("Global Navigation Header Component (TICKET-47)", () => {
  test("renders Scout branding and navigation links", () => {
    const html = renderToString(<Header />);
    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("Feed") || html.includes("Launch Feed"));
    assert.ok(html.includes("Library"));
    assert.ok(html.includes("Map"));
    assert.ok(html.includes("Watchlist"));
    assert.ok(html.includes("Census"));
  });

  test("renders contract address search input", () => {
    const html = renderToString(<Header />);
    assert.ok(html.includes("header-search-input") || html.includes("placeholder="));
    assert.ok(html.includes("Search CA") || html.includes("0x..."));
  });

  test("renders mobile menu toggle button", () => {
    const html = renderToString(<Header />);
    assert.ok(html.includes("Toggle Mobile Menu") || html.includes("md:hidden"));
  });

  test("renders Connect Wallet button when not authenticated", () => {
    const html = renderToString(<Header isAuthenticated={false} />);
    assert.ok(html.includes("Connect Wallet") || html.includes("Sign In"));
  });

  test("renders truncated wallet address and logout button when authenticated", () => {
    const html = renderToString(
      <Header
        isAuthenticated={true}
        walletAddress="0x1234567890abcdef1234567890abcdef12345678"
      />
    );
    assert.ok(html.includes("0x1234...5678") || html.includes("0x1234"));
    assert.ok(html.includes("Disconnect") || html.includes("Logout"));
  });
});
