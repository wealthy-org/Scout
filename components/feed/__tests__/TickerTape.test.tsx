import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  TickerTape,
  type TickerItemData,
} from "@/components/feed/TickerTape";

describe("Ticker Tape Marquee Component (TICKET-103)", () => {
  const mockItems: TickerItemData[] = [
    {
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "ALPHA",
      name: "Alpha Matrix",
      marketCapUsd: 150000,
      deltaPct: 15.4,
      badge: "SURGE",
      score: 92,
    },
    {
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "BETA",
      name: "Beta Doge",
      marketCapUsd: 85000,
      deltaPct: -6.2,
      badge: "GRADUATED",
    },
    {
      contractAddress: "0x3333333333333333333333333333333333333333",
      symbol: "GAMMA",
      marketCapUsd: 420000,
      deltaPct: 0.0,
      volume10mUsd: 8000,
    },
  ];

  test("renders continuous marquee ticker items with symbol, market cap, delta %, and status badges", () => {
    const html = renderToString(<TickerTape items={mockItems} />);
    assert.ok(html.includes("animate-marquee"));
    assert.ok(html.includes("marquee-mask"));
    assert.ok(html.includes("ALPHA"));
    assert.ok(html.includes("BETA"));
    assert.ok(html.includes("GAMMA"));
    assert.ok(html.includes("SURGE"));
    assert.ok(html.includes("GRADUATED"));
    assert.ok(html.includes("+15.4%"));
    assert.ok(html.includes("-6.2%"));
  });

  test("renders links to dossiers for each ticker token pill", () => {
    const html = renderToString(<TickerTape items={mockItems} />);
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("/d/0x2222222222222222222222222222222222222222"));
  });

  test("renders fallback items when items list is empty", () => {
    const html = renderToString(<TickerTape items={[]} />);
    assert.ok(html.includes("SCOUT") || html.includes("ETH") || html.includes("Pons V2"));
    assert.ok(html.includes("animate-marquee"));
  });
});
