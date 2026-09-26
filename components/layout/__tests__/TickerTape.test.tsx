import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  TickerTape,
  type TickerItemData,
} from "@/components/feed/TickerTape";

describe("Ticker Tape Component (TICKET-48)", () => {
  const mockItems: TickerItemData[] = [
    {
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "ALPHA",
      marketCapUsd: 150000,
      deltaPct: 15.4,
      volume10mUsd: 24000,
    },
    {
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "BETA",
      marketCapUsd: 85000,
      deltaPct: -6.2,
      volume10mUsd: 12500,
    },
    {
      contractAddress: "0x3333333333333333333333333333333333333333",
      symbol: "GAMMA",
      marketCapUsd: 420000,
      deltaPct: 0.0,
      volume10mUsd: 8000,
    },
  ];

  test("renders marquee ticker items with symbol, market cap, and delta %", () => {
    const html = renderToString(<TickerTape items={mockItems} />);
    assert.ok(html.includes("ALPHA"));
    assert.ok(html.includes("BETA"));
    assert.ok(html.includes("GAMMA"));
    assert.ok(html.includes("$150,000") || html.includes("150K") || html.includes("150"));
    assert.ok(html.includes("+15.4%"));
    assert.ok(html.includes("-6.2%"));
  });

  test("renders links to dossiers for each ticker token chip", () => {
    const html = renderToString(<TickerTape items={mockItems} />);
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("/d/0x2222222222222222222222222222222222222222"));
  });

  test("renders fallback items when items list is empty", () => {
    const html = renderToString(<TickerTape items={[]} />);
    assert.ok(html.includes("ETH") || html.includes("Pons V2") || html.includes("Scout"));
  });
});
