import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { LibraryClient } from "../LibraryClient";
import { WatchlistClient } from "../../watchlist/WatchlistClient";

describe("Chroma Library & Watchlist Overhaul (TICKET-92)", () => {
  const mockDossiers = [
    {
      id: "dos_1",
      walletAddress: "0x1111111111111111111111111111111111111111",
      chainId: 4663,
      contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
      symbol: "SCOUT",
      name: "Scout Protocol",
      status: "Researching" as const,
      thesis: "High potential Robinhood chain telemetry intelligence",
      decisionReason: "Strong on-chain signals",
      notes: "Track daily",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  test("renders LibraryClient with animated category filter pills and glassmorphic cards", () => {
    const html = renderToString(<LibraryClient initialDossiers={mockDossiers} isAuthenticated={true} />);
    assert.ok(html.includes("Case Files Library"));
    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("Scout Protocol"));
    assert.ok(html.includes("All"));
    assert.ok(html.includes("Researching"));
    assert.ok(html.includes("Export All"));
  });

  test("renders WatchlistClient with glassmorphic cards and unwatch action", () => {
    const mockWatchlist = [
      {
        id: "watch_1",
        walletAddress: "0x1111111111111111111111111111111111111111",
        deployerAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        score: {
          score: 82,
          label: "repeat" as const,
          band: "green" as const,
          totalLaunches: 10,
          graduatedCount: 7,
        },
        newLaunchesCount: 2,
      },
    ];

    const html = renderToString(<WatchlistClient initialEntries={mockWatchlist} isAuthenticated={true} />);
    assert.ok(html.includes("Deployer Watchlist"));
    assert.ok(html.includes("0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"));
    assert.ok(html.includes("SCORE: 82"));
    assert.ok(html.includes("TRACKED"));
  });
});
