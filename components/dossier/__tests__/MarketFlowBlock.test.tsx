import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { MarketFlowBlock, formatCurrency, formatNumber } from "@/components/dossier/MarketFlowBlock";

describe("MarketFlowBlock Component (TICKET-32)", () => {
  const defaultProps = {
    marketCapUsd: 142500,
    athUsd: 280000,
    curveProgressPct: 84.5,
    volume24hUsd: 45200,
    tradeCount: 1420,
    uniqueWallets: 382,
  };

  test("formatCurrency formats numbers with dollar sign and commas or suffixes", () => {
    assert.strictEqual(formatCurrency(142500), "$142,500");
    assert.strictEqual(formatCurrency(0), "$0");
    assert.strictEqual(formatCurrency(null), "N/A");
  });

  test("formatNumber formats integers with thousands separator", () => {
    assert.strictEqual(formatNumber(1420), "1,420");
    assert.strictEqual(formatNumber(null), "N/A");
  });

  test("renders all 6 metric blocks accurately", () => {
    const html = renderToString(<MarketFlowBlock {...defaultProps} />);
    assert.ok(html.includes("Market Cap"));
    assert.ok(html.includes("$142,500"));
    assert.ok(html.includes("All-Time High") || html.includes("ATH"));
    assert.ok(html.includes("$280,000"));
    assert.ok(html.includes("Curve Progress"));
    assert.ok(html.includes("84.5%"));
    assert.ok(html.includes("24h Volume"));
    assert.ok(html.includes("$45,200"));
    assert.ok(html.includes("Total Trades"));
    assert.ok(html.includes("1,420"));
    assert.ok(html.includes("Unique Wallets"));
    assert.ok(html.includes("382"));
  });

  test("renders progress bar with correct width style", () => {
    const html = renderToString(<MarketFlowBlock {...defaultProps} />);
    assert.ok(html.includes("width:84.5%") || html.includes("width: 84.5%"));
  });

  test("handles null or undefined props gracefully", () => {
    const html = renderToString(<MarketFlowBlock />);
    assert.ok(html.includes("N/A"));
  });
});
