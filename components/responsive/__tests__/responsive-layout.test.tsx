import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { LandingClient } from "../../landing/LandingClient";
import { LibraryClient } from "../../library/LibraryClient";

describe("Responsive Compact 2-Column Grid Layouts (TICKET-88)", () => {
  test("LandingClient must use 2-column compact grid on mobile for macro stats", () => {
    const mockStats = {
      total_launches: 120,
      unique_deployers: 45,
      repeat_share: 32.5,
      head_block: 27000000,
      repeat_launchers: [],
      launches_by_block: [],
      computed_at: new Date().toISOString(),
    };

    const html = renderToString(<LandingClient stats={mockStats} />);
    assert.ok(
      html.includes("grid-cols-2") || html.includes("sm:grid-cols-2"),
      "Landing page stats and workflow must support 2-column grid on mobile/tablet"
    );
  });

  test("LibraryClient must use compact responsive grid structure", () => {
    const mockDossiers = [
      {
        id: "d1",
        walletAddress: "0x1111111111111111111111111111111111111111",
        chainId: 4663,
        contractAddress: "0x2222222222222222222222222222222222222222",
        symbol: "TEST",
        name: "Test Token",
        status: "Watching" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const html = renderToString(
      <LibraryClient initialDossiers={mockDossiers} isAuthenticated={true} />
    );
    assert.ok(
      html.includes("grid-cols-1") && (html.includes("sm:grid-cols-2") || html.includes("grid-cols-2")),
      "Library dossier cards must render in 2-column compact grid on tablet/mobile viewports"
    );
  });

  test("LandingClient hero planet animation must use adaptive multi-breakpoint classes for mobile, tablet, and desktop", () => {
    const mockStats = {
      total_launches: 100,
      unique_deployers: 50,
      repeat_share: 25.0,
      head_block: 27000000,
      repeat_launchers: [],
      launches_by_block: [],
      computed_at: new Date().toISOString(),
    };

    const html = renderToString(<LandingClient stats={mockStats} />);
    assert.ok(
      html.includes("orbit-system") &&
      html.includes("w-[300px] sm:w-[410px] lg:w-[480px]") &&
      html.includes("h-[300px] sm:h-[410px] lg:h-[480px]"),
      "Hero orbit system container must scale across mobile (300px), tablet (410px), and desktop (480px)"
    );

    assert.ok(
      html.includes("w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48"),
      "Hero central planetary core must use proportional responsive dimensions"
    );

    assert.ok(
      html.includes("w-[136px] sm:w-[175px] lg:w-[205px]"),
      "Hero orbiting cards must use compact width to prevent horizontal clipping on mobile"
    );
  });
});
