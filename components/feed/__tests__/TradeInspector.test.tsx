import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  TradeInspector,
  type TradeItem,
  type InspectorToken,
} from "@/components/feed/TradeInspector";

describe("TradeInspector Component (TICKET-52)", () => {
  const mockToken: InspectorToken = {
    contractAddress: "0x1111111111111111111111111111111111111111",
    symbol: "ALPHA",
    name: "Alpha Protocol",
    marketCapUsd: 125000,
    priceUsd: 0.00125,
    deployerAddress: "0x9999999999999999999999999999999999999999",
    score: 85,
    band: "green",
    label: "fresh",
    progressPct: 75.5,
  };

  const mockTrades: TradeItem[] = [
    {
      id: "tx-1",
      type: "buy",
      amountEth: 1.5,
      amountToken: 1200000,
      trader: "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
      timestamp: 1700000000000,
      txHash: "0xabc1",
    },
    {
      id: "tx-2",
      type: "sell",
      amountEth: 0.8,
      amountToken: 640000,
      trader: "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
      timestamp: 1700000050000,
      txHash: "0xabc2",
    },
  ];

  const mockSparkline = [10, 12, 11, 15, 14, 18, 22, 20, 25];

  test("does not render HTML when isOpen is false", () => {
    const html = renderToString(
      <TradeInspector
        isOpen={false}
        onClose={() => {}}
        token={mockToken}
      />
    );
    assert.strictEqual(html, "");
  });

  test("does not render HTML when token is null or undefined", () => {
    const html = renderToString(
      <TradeInspector
        isOpen={true}
        onClose={() => {}}
        token={null}
      />
    );
    assert.strictEqual(html, "");
  });

  test("renders drawer panel with token info and CTA link when open", () => {
    const html = renderToString(
      <TradeInspector
        isOpen={true}
        onClose={() => {}}
        token={mockToken}
        trades={mockTrades}
        sparkline={mockSparkline}
      />
    );

    assert.ok(html.includes("$ALPHA"));
    assert.ok(html.includes("Alpha Protocol"));
    assert.ok(html.includes("Open Full Dossier"));
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("85 Score"));
  });

  test("renders mini sparkline chart and trade history with buy/sell highlights", () => {
    const html = renderToString(
      <TradeInspector
        isOpen={true}
        onClose={() => {}}
        token={mockToken}
        trades={mockTrades}
        sparkline={mockSparkline}
      />
    );

    assert.ok(html.includes('data-testid="sparkline-chart"'));
    assert.ok(html.includes("buy"));
    assert.ok(html.includes("sell"));
    assert.ok(html.includes("1.5000 ETH"));
    assert.ok(html.includes("0.8000 ETH"));
    assert.ok(html.includes("1,200,000"));
  });

  test("handles empty trades array with fallback message", () => {
    const html = renderToString(
      <TradeInspector
        isOpen={true}
        onClose={() => {}}
        token={mockToken}
        trades={[]}
      />
    );

    assert.ok(html.includes("No recent trades recorded"));
  });
});
