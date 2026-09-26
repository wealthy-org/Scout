import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { Header } from "../Header";

describe("Chroma Header & Navigation Overhaul (TICKET-90)", () => {
  test("renders Chroma style brand logo, glowing badge, and live block telemetry", () => {
    const html = renderToString(
      <Header
        isAuthenticated={false}
        walletAddress={null}
        initialBlockHeight={21845120}
      />
    );

    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("Dossier.OS"));
    assert.ok(html.includes("Connect Wallet"));
    assert.ok(html.includes("Block"));
  });

  test("renders authenticated state with truncated wallet address and logout pill", () => {
    const html = renderToString(
      <Header
        isAuthenticated={true}
        walletAddress="0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"
      />
    );

    assert.ok(html.includes("0x89e2...89b2"));
    assert.ok(html.includes("Logout"));
  });

  test("contains rounded pill navigation items for all core routes", () => {
    const html = renderToString(<Header />);
    assert.ok(html.includes("Launch Feed"));
    assert.ok(html.includes("Library"));
    assert.ok(html.includes("Map"));
    assert.ok(html.includes("Watchlist"));
    assert.ok(html.includes("Census"));
  });
});
