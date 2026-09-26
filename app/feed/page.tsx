"use client";

import React, { useState } from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { TickerTape } from "@/components/feed/TickerTape";
import { FeedTiles } from "@/components/feed/FeedTiles";
import { FeedPoller } from "@/components/feed/FeedPoller";
import { FeedTable, type FeedTableRowData } from "@/components/feed/FeedTable";
import { TradeTape, type TradeTapeItem } from "@/components/feed/TradeTape";
import { GraduationTape, type GraduationTapeItem } from "@/components/feed/GraduationTape";
import { TradeInspector, type InspectorToken } from "@/components/feed/TradeInspector";

const initialFeedItems: FeedTableRowData[] = [
  {
    contractAddress: "0x1111111111111111111111111111111111111111",
    symbol: "SCOUT",
    name: "Scout Intelligence",
    deployerAddress: "0x9999999999999999999999999999999999999999",
    score: 95,
    band: "green",
    label: "fresh",
    progressPct: 88.5,
    marketCapUsd: 185000,
    volume24hUsd: 94000,
    phase: "curve",
    block: 10050,
    timestamp: "2026-09-26T12:30:00Z",
  },
  {
    contractAddress: "0x2222222222222222222222222222222222222222",
    symbol: "CYBER",
    name: "Cyber Doge",
    deployerAddress: "0x8888888888888888888888888888888888888888",
    score: 82,
    band: "green",
    label: "repeat",
    progressPct: 100,
    marketCapUsd: 320000,
    volume24hUsd: 142000,
    phase: "graduated",
    block: 10045,
    timestamp: "2026-09-26T12:15:00Z",
  },
  {
    contractAddress: "0x3333333333333333333333333333333333333333",
    symbol: "ALPHA",
    name: "Alpha Matrix",
    deployerAddress: "0x7777777777777777777777777777777777777777",
    score: 45,
    band: "yellow",
    label: "repeat",
    progressPct: 62.0,
    marketCapUsd: 45000,
    volume24hUsd: 18000,
    phase: "curve",
    block: 10040,
    timestamp: "2026-09-26T12:00:00Z",
  },
  {
    contractAddress: "0x4444444444444444444444444444444444444444",
    symbol: "RUGME",
    name: "Serial Test",
    deployerAddress: "0x6666666666666666666666666666666666666666",
    score: 15,
    band: "red",
    label: "serial",
    progressPct: 12.0,
    marketCapUsd: 8500,
    volume24hUsd: 3200,
    phase: "curve",
    block: 10035,
    timestamp: "2026-09-26T11:45:00Z",
  },
];

const initialTrades: TradeTapeItem[] = [
  {
    id: "tx-1",
    symbol: "SCOUT",
    contractAddress: "0x1111111111111111111111111111111111111111",
    type: "buy",
    amountEth: 1.85,
    amountToken: 320000,
    trader: "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
    timestamp: "2026-09-26T12:35:00Z",
  },
  {
    id: "tx-2",
    symbol: "CYBER",
    contractAddress: "0x2222222222222222222222222222222222222222",
    type: "buy",
    amountEth: 3.2,
    amountToken: 850000,
    trader: "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
    timestamp: "2026-09-26T12:34:00Z",
  },
  {
    id: "tx-3",
    symbol: "ALPHA",
    contractAddress: "0x3333333333333333333333333333333333333333",
    type: "sell",
    amountEth: 0.75,
    amountToken: 120000,
    trader: "0xcccc3333cccc3333cccc3333cccc3333cccc3333",
    timestamp: "2026-09-26T12:33:00Z",
  },
];

const initialGraduations: GraduationTapeItem[] = [
  {
    id: "grad-1",
    contractAddress: "0x2222222222222222222222222222222222222222",
    symbol: "CYBER",
    name: "Cyber Doge",
    deployerAddress: "0x8888888888888888888888888888888888888888",
    deployerScore: 82,
    deployerBand: "green",
    marketCapUsd: 320000,
    graduatedAt: "2026-09-26T12:15:00Z",
  },
];

const watchedDeployers = ["0x9999999999999999999999999999999999999999"];

export default function FeedPage() {
  const [selectedToken, setSelectedToken] = useState<InspectorToken | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const handleRowClick = (row: FeedTableRowData) => {
    setSelectedToken({
      contractAddress: row.contractAddress,
      symbol: row.symbol,
      name: row.name,
      marketCapUsd: row.marketCapUsd,
      deployerAddress: row.deployerAddress,
      score: row.score,
      band: row.band,
      label: row.label,
      progressPct: row.progressPct,
    });
    setIsInspectorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080b0f] text-gray-100 flex flex-col font-sans">
      <GlobalHeader />
      <TickerTape />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
                Live Launches
              </h1>
              <FeedPoller isLive={true} pollingIntervalMs={2000} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Real-time bonding curve tracker, deployer reputation scoring, and high-frequency trade monitor.
            </p>
          </div>
        </div>

        <FeedTiles
          stats={{
            totalLaunches10m: 24,
            totalVolumeUsd: 1428000,
            uniqueWallets: 842,
            graduatedCount: 9,
            repeatDeployerPct: 34.5,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <FeedTable
              items={initialFeedItems}
              watchedDeployers={watchedDeployers}
              onRowClick={handleRowClick}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <TradeTape trades={initialTrades} onSelectTrade={(t) => {
              setSelectedToken({
                contractAddress: t.contractAddress,
                symbol: t.symbol,
              });
              setIsInspectorOpen(true);
            }} />
            <GraduationTape graduations={initialGraduations} onSelectGraduation={(g) => {
              setSelectedToken({
                contractAddress: g.contractAddress,
                symbol: g.symbol,
                name: g.name,
                marketCapUsd: g.marketCapUsd,
                deployerAddress: g.deployerAddress,
                score: g.deployerScore,
                band: g.deployerBand,
              });
              setIsInspectorOpen(true);
            }} />
          </div>
        </div>
      </main>

      <TradeInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        token={selectedToken}
      />
    </div>
  );
}
