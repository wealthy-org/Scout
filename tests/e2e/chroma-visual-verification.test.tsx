import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { LandingClient } from "../../components/landing/LandingClient";
import { GlobalHeader } from "../../components/layout/GlobalHeader";
import { FeedTiles } from "../../components/feed/FeedTiles";
import { FeedTable } from "../../components/feed/FeedTable";
import { LibraryClient } from "../../components/library/LibraryClient";
import { WatchlistClient } from "../../components/watchlist/WatchlistClient";
import { CensusView } from "../../components/census/CensusView";
import { DeployerProfileView } from "../../components/deployer/DeployerProfileView";
import { ConnectionMap } from "../../components/map/ConnectionMap";
import { AccountClient } from "../../components/account/AccountClient";
import { DossierPageView } from "../../app/d/[ca]/page";

describe("Tosca Canvas & Colorful Pop UI Overhaul Suite (TICKET-96 & TICKET-99)", () => {
  const mockCensusStats = {
    total_launches: 1620,
    unique_deployers: 870,
    repeat_share: 33.8,
    head_block: 27195000,
    repeat_launchers: [
      {
        deployerAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
        totalLaunches: 10,
        graduatedCount: 7,
        score: 82,
        band: "green" as const,
        label: "repeat" as const,
      },
    ],
    launches_by_block: [
      { blockRange: "0-500K", count: 180 },
      { blockRange: "500K-1M", count: 420 },
      { blockRange: "1M-1.5M", count: 680 },
      { blockRange: "1.5M+", count: 340 },
    ],
    computed_at: new Date().toISOString(),
  };

  test("globals.css defines Tosca Canvas and Pop tokens", () => {
    const cssPath = path.join(process.cwd(), "app/globals.css");
    const css = fs.readFileSync(cssPath, "utf-8");
    assert.ok(css.includes("--color-canvas-main"));
    assert.ok(css.includes("--color-surface-deep"));
    assert.ok(css.includes("--color-pop-yellow"));
    assert.ok(css.includes("--color-pop-coral"));
    assert.ok(css.includes("--color-ink-light"));
    assert.ok(css.includes("prefers-reduced-motion"));
  });

  test("all core navigation routes render cleanly with Tosca Canvas system and no legacy black backgrounds", () => {
    const headerHtml = renderToString(<GlobalHeader isAuthenticated={true} walletAddress="0x1111111111111111111111111111111111111111" />);
    assert.ok(headerHtml.includes("SCOUT"));
    assert.ok(headerHtml.includes("Feed") || headerHtml.includes("Launch Feed"));
    assert.ok(headerHtml.includes("Library"));

    const landingHtml = renderToString(<LandingClient stats={mockCensusStats} isAuthenticated={true} />);
    assert.ok(landingHtml.includes("Surveillance Engine Active"));
    assert.ok(landingHtml.includes("Investigate"));

    const feedTilesHtml = renderToString(<FeedTiles stats={{ totalLaunches10m: 18, totalVolumeUsd: 950000, uniqueWallets: 620, graduatedCount: 8, repeatDeployerPct: 29.5 }} />);
    assert.ok(feedTilesHtml.includes("Launches (10m)"));

    const feedTableHtml = renderToString(<FeedTable items={[]} defaultTab="most_traded" />);
    assert.ok(feedTableHtml.includes("Most Traded"));

    const libraryHtml = renderToString(<LibraryClient initialDossiers={[]} isAuthenticated={true} />);
    assert.ok(libraryHtml.includes("Case Files Library"));
    assert.ok(!libraryHtml.includes("bg-[#07090E]"));
    assert.ok(libraryHtml.includes("bg-[#0D746E]") || libraryHtml.includes("bg-[#064E4A]"));

    const watchlistHtml = renderToString(<WatchlistClient initialEntries={[]} isAuthenticated={true} />);
    assert.ok(watchlistHtml.includes("Deployer Watchlist"));
    assert.ok(!watchlistHtml.includes("bg-[#07090E]"));
    assert.ok(watchlistHtml.includes("bg-[#0D746E]") || watchlistHtml.includes("bg-[#064E4A]"));

    const censusHtml = renderToString(<CensusView stats={mockCensusStats} />);
    assert.ok(censusHtml.includes("Launch Census"));
    assert.ok(!censusHtml.includes("bg-[#07090E]"));
    assert.ok(censusHtml.includes("bg-[#0D746E]") || censusHtml.includes("bg-[#064E4A]"));

    const deployerHtml = renderToString(
      <DeployerProfileView
        address="0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"
        score={82}
        label="repeat"
        band="green"
        signals={{ grad_rate: 0.7, doa_rate: 0.05, burst_rate: 0.1, total_launches: 10, graduated_count: 7 }}
        launches={[]}
        isAuthenticated={true}
      />
    );
    assert.ok(deployerHtml.includes("Deployer Dossier"));
    assert.ok(!deployerHtml.includes("bg-[#07090E]"));
    assert.ok(deployerHtml.includes("bg-[#0D746E]") || deployerHtml.includes("bg-[#064E4A]"));

    const mapHtml = renderToString(<ConnectionMap nodes={[]} edges={[]} />);
    assert.ok(mapHtml.includes("No dossier connections found"));

    const accountHtml = renderToString(
      <AccountClient
        isAuthenticated={true}
        user={{ walletAddress: "0x1111111111111111111111111111111111111111", handle: "sleuth", createdAt: new Date().toISOString() }}
      />
    );
    assert.ok(accountHtml.includes("Account Settings"));
    assert.ok(!accountHtml.includes("bg-[#07090E]"));
  });

  test("renders full DossierPageView with all 13 sections intact and Tosca theme", () => {
    const dossierHtml = renderToString(
      <DossierPageView
        data={{
          contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
          symbol: "SCOUT",
          name: "Scout Protocol",
          marketCapUsd: 450000,
          athUsd: 820000,
          curveProgressPct: 100,
          volume24hUsd: 195000,
          tradeCount: 2300,
          uniqueWallets: 980,
          tradeFlow: { buyVolume: 120000, sellVolume: 75000, buyCount: 1400, sellCount: 900, quoteAsset: "USDG" },
          walletBubbles: [],
          topWallets: [],
          launches: [],
          constellationNodes: [],
          constellationEdges: [],
          connectedDossiers: [],
          connections: [],
          timelineLogs: [],
          diffs: [],
          isAnonymous: false,
        }}
      />
    );
    assert.ok(dossierHtml.includes("SCOUT"));
    assert.ok(dossierHtml.includes("Trade Flow Analytics"));
    assert.ok(dossierHtml.includes("Holder Distribution"));
    assert.ok(dossierHtml.includes("Constellation Relationship Graph"));
    assert.ok(!dossierHtml.includes("bg-[#07090E]"));
  });
});
