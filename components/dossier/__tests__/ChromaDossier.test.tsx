import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { DossierHeader } from "../DossierHeader";
import { MarketFlowBlock } from "../MarketFlowBlock";
import { TradeFlowChart } from "../TradeFlowChart";
import { TradeFlowPanel } from "../TradeFlowPanel";
import { WalletMap } from "../WalletMap";
import { ConstellationGraph } from "../ConstellationGraph";
import { ResearchPanel } from "../ResearchPanel";
import { ConnectionMap } from "../../map/ConnectionMap";

describe("Chroma Dossier Page, Trade Flow & Constellation Overhaul (TICKET-94)", () => {
  test("renders DossierHeader with dynamic status chip and copy action", () => {
    const html = renderToString(
      <DossierHeader
        contractAddress="0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"
        symbol="SCOUT"
        name="Scout Protocol"
        phase="graduated"
      />
    );

    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("Scout Protocol"));
    assert.ok(html.includes("0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"));
    assert.ok(html.includes("Graduated"));
  });

  test("renders MarketFlowBlock with 6 key macro metrics", () => {
    const html = renderToString(
      <MarketFlowBlock
        marketCapUsd={350000}
        athUsd={520000}
        curveProgressPct={100}
        volume24hUsd={89000}
        tradeCount={1420}
        uniqueWallets={640}
      />
    );

    assert.ok(html.includes("$350,000"));
    assert.ok(html.includes("$520,000"));
    assert.ok(html.includes("100%"));
    assert.ok(html.includes("$89,000"));
    assert.ok(html.includes("1,420"));
    assert.ok(html.includes("640"));
  });

  test("renders TradeFlowChart, TradeFlowPanel, WalletMap, ConstellationGraph, ResearchPanel, and ConnectionMap", () => {
    const chartHtml = renderToString(<TradeFlowChart candles={[]} />);
    assert.ok(chartHtml.includes("No trade flow data available"));

    const panelHtml = renderToString(
      <TradeFlowPanel
        data={{
          buyVolume: 120000,
          sellVolume: 80000,
          buyCount: 450,
          sellCount: 230,
          quoteAsset: "USDG",
        }}
      />
    );
    assert.ok(panelHtml.includes("Flow Section"));
    assert.ok(panelHtml.includes("Total Bought"));

    const walletHtml = renderToString(
      <WalletMap
        wallets={[
          { address: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2", volume: 50000, netFlow: 25000, isDeployer: true },
        ]}
      />
    );
    assert.ok(walletHtml.includes("Wallet Map"));
    assert.ok(walletHtml.includes("Net Buyer"));

    const graphHtml = renderToString(
      <ConstellationGraph
        nodes={[
          { contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2", symbol: "SCOUT", isCurrent: true },
        ]}
        edges={[]}
      />
    );
    assert.ok(graphHtml.includes("Constellation Graph"));

    const researchHtml = renderToString(
      <ResearchPanel
        contractAddress="0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"
        initialThesis="High-conviction surveillance target."
        initialDecisionReason="Clean contract, solid liquidity"
        initialItems={[]}
        initialQuestions={[]}
        initialNotes="Monitor next bonding stage."
        isAuthenticated={true}
      />
    );
    assert.ok(researchHtml.includes("Case File Research"));

    const mapHtml = renderToString(<ConnectionMap nodes={[]} edges={[]} />);
    assert.ok(mapHtml.includes("No dossier connections found"));
  });
});
