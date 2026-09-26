import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { TradeTape, type TradeTapeItem } from "@/components/feed/TradeTape";
import {
  GraduationTape,
  type GraduationTapeItem,
} from "@/components/feed/GraduationTape";

describe("Feed Tapes Components (TICKET-53)", () => {
  describe("TradeTape", () => {
    const mockTrades: TradeTapeItem[] = [
      {
        id: "trade-1",
        symbol: "SCOUT",
        contractAddress: "0x1111111111111111111111111111111111111111",
        type: "buy",
        amountEth: 2.5,
        amountToken: 500000,
        trader: "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
        timestamp: "2026-09-26T10:00:00Z",
      },
      {
        id: "trade-2",
        symbol: "PEPE",
        contractAddress: "0x2222222222222222222222222222222222222222",
        type: "sell",
        amountEth: 1.2,
        amountToken: 300000,
        trader: "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
        timestamp: "2026-09-26T10:01:00Z",
      },
    ];

    test("renders trade stream items with buy and sell direction indicators", () => {
      const html = renderToString(<TradeTape trades={mockTrades} />);
      assert.ok(html.includes("$SCOUT"));
      assert.ok(html.includes("$PEPE"));
      assert.ok(html.includes("buy"));
      assert.ok(html.includes("sell"));
      assert.ok(html.includes("2.5000 ETH"));
      assert.ok(html.includes("1.2000 ETH"));
      assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    });

    test("limits displayed items to maxItems (default 40)", () => {
      const manyTrades: TradeTapeItem[] = Array.from({ length: 50 }, (_, i) => ({
        id: `trade-${i}`,
        symbol: `TK${i}`,
        contractAddress: `0x${i.toString().padStart(40, "0")}`,
        type: i % 2 === 0 ? "buy" : "sell",
        amountEth: 0.1 * (i + 1),
        amountToken: 1000 * (i + 1),
        trader: `0xtrader${i}`,
        timestamp: Date.now(),
      }));

      const html = renderToString(<TradeTape trades={manyTrades} />);
      assert.ok(html.includes("$TK0"));
      assert.ok(html.includes("$TK39"));
      assert.strictEqual(html.includes("$TK40"), false);
    });

    test("renders fallback empty message when trades are empty", () => {
      const html = renderToString(<TradeTape trades={[]} />);
      assert.ok(html.includes("No recent trades"));
    });
  });

  describe("GraduationTape", () => {
    const mockGraduations: GraduationTapeItem[] = [
      {
        id: "grad-1",
        contractAddress: "0x3333333333333333333333333333333333333333",
        symbol: "MOON",
        name: "Moonshot Protocol",
        deployerAddress: "0xdeployer3",
        deployerScore: 92,
        deployerBand: "green",
        marketCapUsd: 145000,
        graduatedAt: "2026-09-26T09:30:00Z",
      },
      {
        id: "grad-2",
        contractAddress: "0x4444444444444444444444444444444444444444",
        symbol: "ROCKET",
        name: "Rocket Finance",
        deployerAddress: "0xdeployer4",
        deployerScore: 35,
        deployerBand: "red",
        marketCapUsd: 95000,
        graduatedAt: "2026-09-26T08:00:00Z",
      },
    ];

    test("renders graduation event items with MC and deployer band", () => {
      const html = renderToString(
        <GraduationTape graduations={mockGraduations} />
      );
      assert.ok(html.includes("$MOON"));
      assert.ok(html.includes("$ROCKET"));
      assert.ok(html.includes("$145.0k"));
      assert.ok(html.includes("92"));
      assert.ok(html.includes("/d/0x3333333333333333333333333333333333333333"));
    });

    test("limits displayed items to maxItems (default 30)", () => {
      const manyGrads: GraduationTapeItem[] = Array.from(
        { length: 45 },
        (_, i) => ({
          id: `grad-${i}`,
          contractAddress: `0x${i.toString().padStart(40, "0")}`,
          symbol: `GD${i}`,
          deployerAddress: `0xdeployer${i}`,
          deployerScore: 70,
          deployerBand: "green",
          marketCapUsd: 100000 + i * 1000,
          graduatedAt: Date.now(),
        })
      );

      const html = renderToString(<GraduationTape graduations={manyGrads} />);
      assert.ok(html.includes("$GD0"));
      assert.ok(html.includes("$GD29"));
      assert.strictEqual(html.includes("$GD30"), false);
    });

    test("renders fallback empty message when graduations are empty", () => {
      const html = renderToString(<GraduationTape graduations={[]} />);
      assert.ok(html.includes("No recent graduations"));
    });
  });
});
