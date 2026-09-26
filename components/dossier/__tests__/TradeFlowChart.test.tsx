import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { TradeFlowChart, TradeCandleData } from "@/components/dossier/TradeFlowChart";

describe("TradeFlowChart Component (TICKET-33)", () => {
  const mockCandles: TradeCandleData[] = [
    { index: 1, open: 5000, high: 6200, low: 4800, close: 6000, volume: 1200, isBuy: true },
    { index: 2, open: 6000, high: 6500, low: 5800, close: 5900, volume: 800, isBuy: false },
    { index: 3, open: 5900, high: 8000, low: 5900, close: 7800, volume: 3400, isBuy: true, isGraduation: true },
    { index: 4, open: 7800, high: 9200, low: 7500, close: 9100, volume: 2200, isBuy: true },
  ];

  test("renders SVG container with viewBox", () => {
    const html = renderToString(<TradeFlowChart candles={mockCandles} />);
    assert.ok(html.includes("<svg"));
    assert.ok(html.includes("viewBox"));
  });

  test("renders candlestick elements and volume bars", () => {
    const html = renderToString(<TradeFlowChart candles={mockCandles} />);
    assert.ok(html.includes("<rect"));
    assert.ok(html.includes("<line"));
  });

  test("renders graduation marker line and label when graduation is present", () => {
    const html = renderToString(<TradeFlowChart candles={mockCandles} graduationIndex={3} />);
    assert.ok(html.includes("GRADUATED"));
    assert.ok(html.includes("stroke-dasharray") || html.includes("strokeDasharray") || html.includes("4 4"));
  });

  test("renders empty state gracefully when no candles are provided", () => {
    const html = renderToString(<TradeFlowChart candles={[]} />);
    assert.ok(html.includes("No trade flow data") || html.includes("<svg"));
  });
});
