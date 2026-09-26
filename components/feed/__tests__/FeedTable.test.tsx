import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  FeedTable,
  filterFeedItems,
  type FeedTableRowData,
} from "@/components/feed/FeedTable";

describe("Feed Table Component with 4 Tab Filters (TICKET-51)", () => {
  const mockItems: FeedTableRowData[] = [
    {
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "ALPHA",
      name: "Alpha Token",
      deployerAddress: "0xDeployer1",
      score: 85,
      label: "fresh",
      band: "green",
      progressPct: 92,
      marketCapUsd: 250000,
      volume24hUsd: 120000,
      phase: "curve",
      block: 1000,
      timestamp: "2026-09-26T10:00:00Z",
    },
    {
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "BETA",
      name: "Beta Meme",
      deployerAddress: "0xDeployer2",
      score: 25,
      label: "serial",
      band: "red",
      progressPct: 45,
      marketCapUsd: 80000,
      volume24hUsd: 15000,
      phase: "curve",
      block: 1020,
      timestamp: "2026-09-26T10:15:00Z",
    },
  ];

  test("renders all 4 tabs and search input", () => {
    const html = renderToString(<FeedTable items={mockItems} />);
    assert.ok(html.includes("Most Traded"));
    assert.ok(html.includes("New Launches"));
    assert.ok(html.includes("Near Graduation"));
    assert.ok(html.includes("Repeat Deployers"));
    assert.ok(html.includes("feed-search-input") || html.includes("Search by symbol"));
  });

  test("renders token rows with score badges, bonding progress, and links to /d/[ca]", () => {
    const html = renderToString(<FeedTable items={mockItems} />);
    assert.ok(html.includes("ALPHA"));
    assert.ok(html.includes("BETA"));
    assert.ok(html.includes("85"));
    assert.ok(html.includes("Fresh"));
    assert.ok(html.includes("25"));
    assert.ok(html.includes("Serial"));
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("/d/0x2222222222222222222222222222222222222222"));
  });

  test("filterFeedItems correctly filters by Near Graduation (>= 80%)", () => {
    const filtered = filterFeedItems(mockItems, "near_graduation", "");
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].symbol, "ALPHA");
  });

  test("filterFeedItems correctly filters by Repeat Deployers", () => {
    const filtered = filterFeedItems(mockItems, "repeat_deployers", "");
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].symbol, "BETA");
  });

  test("filterFeedItems correctly filters by search query", () => {
    const filtered = filterFeedItems(mockItems, "most_traded", "BETA");
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].symbol, "BETA");
  });
});
