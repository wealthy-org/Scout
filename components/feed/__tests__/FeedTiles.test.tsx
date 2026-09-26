import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  FeedTiles,
  type FeedStatsData,
} from "@/components/feed/FeedTiles";

describe("Feed Summary Tiles Component (TICKET-50)", () => {
  const mockStats: FeedStatsData = {
    totalLaunches10m: 14,
    totalVolumeUsd: 1485000,
    uniqueWallets: 342,
    graduatedCount: 8,
    repeatDeployerPct: 42.5,
  };

  test("renders all 5 summary metric tiles with formatted values and labels", () => {
    const html = renderToString(<FeedTiles stats={mockStats} />);
    assert.ok(html.includes("Total Launches") || html.includes("Launches (10m)"));
    assert.ok(html.includes("14"));
    assert.ok(html.includes("24h Volume") || html.includes("Total Volume"));
    assert.ok(
      html.includes("$1,485,000") ||
        html.includes("1.49M") ||
        html.includes("1.5M") ||
        html.includes("1,485,000")
    );
    assert.ok(html.includes("Unique Wallets") || html.includes("Traders"));
    assert.ok(html.includes("342"));
    assert.ok(html.includes("Graduated"));
    assert.ok(html.includes("8"));
    assert.ok(html.includes("Repeat Deployers"));
    assert.ok(html.includes("42.5%"));
  });

  test("handles empty or default stats gracefully without crashing", () => {
    const html = renderToString(<FeedTiles />);
    assert.ok(html.includes("Launches"));
    assert.ok(html.includes("Volume"));
  });
});
