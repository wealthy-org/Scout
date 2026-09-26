import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { FeedTiles } from "../FeedTiles";
import { FeedTable } from "../FeedTable";
import { TradeTape } from "../TradeTape";
import { GraduationTape } from "../GraduationTape";
import { TradeInspector } from "../TradeInspector";

describe("Chroma Live Feed & Trade Inspector (TICKET-93)", () => {
  test("renders FeedTiles with 5 glowing metric tiles", () => {
    const html = renderToString(
      <FeedTiles
        stats={{
          totalLaunches10m: 14,
          totalVolumeUsd: 1250000,
          uniqueWallets: 420,
          graduatedCount: 6,
          repeatDeployerPct: 28.5,
        }}
      />
    );

    assert.ok(html.includes("Launches (10m)"));
    assert.ok(html.includes("14"));
    assert.ok(html.includes("$1.25M"));
    assert.ok(html.includes("420"));
    assert.ok(html.includes("6"));
    assert.ok(html.includes("28.5%"));
  });

  test("renders FeedTable with rounded pill tab navigation", () => {
    const html = renderToString(
      <FeedTable
        items={[
          {
            contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
            symbol: "SCOUT",
            name: "Scout Protocol",
            marketCapUsd: 250000,
            volume24hUsd: 45000,
            deployerAddress: "0x1111111111111111111111111111111111111111",
            score: 78,
            band: "green",
            progressPct: 88,
          },
        ]}
        defaultTab="most_traded"
      />
    );

    assert.ok(html.includes("Most Traded"));
    assert.ok(html.includes("New Launches"));
    assert.ok(html.includes("Near Graduation"));
    assert.ok(html.includes("Repeat Deployers"));
    assert.ok(html.includes("SCOUT"));
  });

  test("renders TradeTape, GraduationTape, and TradeInspector drawer", () => {
    const tradeTapeHtml = renderToString(<TradeTape trades={[]} />);
    assert.ok(tradeTapeHtml.includes("Live Trade Tape"));

    const gradTapeHtml = renderToString(<GraduationTape graduations={[]} />);
    assert.ok(gradTapeHtml.includes("Graduation Stream"));

    const inspectorHtml = renderToString(
      <TradeInspector
        isOpen={true}
        onClose={() => {}}
        token={{
          contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
          symbol: "SCOUT",
          name: "Scout Protocol",
          marketCapUsd: 250000,
          deployerAddress: "0x1111111111111111111111111111111111111111",
          score: 78,
          band: "green",
        }}
      />
    );
    assert.ok(inspectorHtml.includes("SCOUT"));
    assert.ok(inspectorHtml.includes("Trade Inspector"));
  });
});
