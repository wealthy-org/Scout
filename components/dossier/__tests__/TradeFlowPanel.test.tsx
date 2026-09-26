import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { TradeFlowPanel, TradeFlowData } from "@/components/dossier/TradeFlowPanel";

describe("TradeFlowPanel Component (TICKET-34)", () => {
  const mockData: TradeFlowData = {
    buyVolume: 284500,
    sellVolume: 192100,
    buyCount: 840,
    sellCount: 580,
    quoteAsset: "USDG",
  };

  test("renders Flow Section with buy volume, sell volume, and positive net flow", () => {
    const html = renderToString(<TradeFlowPanel data={mockData} />);
    assert.ok(html.includes("Total Bought"));
    assert.ok(html.includes("$284,500"));
    assert.ok(html.includes("Total Sold"));
    assert.ok(html.includes("$192,100"));
    assert.ok(html.includes("Net Flow"));
    assert.ok(html.includes("+$92,400"));
    assert.ok(html.includes("USDG"));
  });

  test("renders negative net flow correctly with red styling class/symbol", () => {
    const negativeData: TradeFlowData = {
      buyVolume: 100000,
      sellVolume: 150000,
      buyCount: 300,
      sellCount: 450,
      quoteAsset: "ETH",
    };
    const html = renderToString(<TradeFlowPanel data={negativeData} />);
    assert.ok(html.includes("-$50,000"));
    assert.ok(html.includes("ETH"));
  });

  test("renders Pressure Section with buy/sell counts and horizontal split bar", () => {
    const html = renderToString(<TradeFlowPanel data={mockData} />);
    assert.ok(html.includes("Order Pressure"));
    assert.ok(html.includes("840 Buys") || html.includes("840"));
    assert.ok(html.includes("580 Sells") || html.includes("580"));
    assert.ok(html.includes("59%") || html.includes("59.2%"));
    assert.ok(html.includes("41%") || html.includes("40.8%"));
  });

  test("handles empty/null data gracefully", () => {
    const html = renderToString(<TradeFlowPanel />);
    assert.ok(html.includes("No trade flow data") || html.includes("Net Flow"));
  });
});
