"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { TickerTape } from "@/components/feed/TickerTape";
import { FeedTiles, type FeedStatsData } from "@/components/feed/FeedTiles";
import { FeedPoller } from "@/components/feed/FeedPoller";
import { FeedTable, type FeedTableRowData } from "@/components/feed/FeedTable";
import { TradeTape, type TradeTapeItem } from "@/components/feed/TradeTape";
import { GraduationTape, type GraduationTapeItem } from "@/components/feed/GraduationTape";
import { TradeInspector, type InspectorToken } from "@/components/feed/TradeInspector";

const initialFeedItems: FeedTableRowData[] = [
  {
    contractAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    symbol: "SCOUT",
    name: "Scout Intelligence",
    deployerAddress: "0xd111111111111111111111111111111111111111",
    score: 95,
    band: "green",
    label: "fresh",
    progressPct: 88.5,
    marketCapUsd: 185000,
    volume24hUsd: 94000,
    phase: "curve",
    block: 27027350,
    timestamp: new Date().toISOString(),
  },
  {
    contractAddress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    symbol: "ROBIN",
    name: "Robinhood Pepe",
    deployerAddress: "0xd222222222222222222222222222222222222222",
    score: 82,
    band: "green",
    label: "repeat",
    progressPct: 100,
    marketCapUsd: 320000,
    volume24hUsd: 142000,
    phase: "graduated",
    block: 27028100,
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    contractAddress: "0xcccccccccccccccccccccccccccccccccccccccc",
    symbol: "RUGPULL",
    name: "Fast Rug",
    deployerAddress: "0xd333333333333333333333333333333333333333",
    score: 15,
    band: "red",
    label: "serial",
    progressPct: 12.0,
    marketCapUsd: 8500,
    volume24hUsd: 3200,
    phase: "curve",
    block: 27027000,
    timestamp: new Date(Date.now() - 900000).toISOString(),
  },
];

const initialTrades: TradeTapeItem[] = [
  {
    id: "tx-1",
    symbol: "SCOUT",
    contractAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    type: "buy",
    amountEth: 2.85,
    amountToken: 320000,
    trader: "0x1111111111111111111111111111111111111111",
    timestamp: new Date().toISOString(),
  },
  {
    id: "tx-2",
    symbol: "ROBIN",
    contractAddress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    type: "buy",
    amountEth: 3.2,
    amountToken: 850000,
    trader: "0x2222222222222222222222222222222222222222",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

const initialGraduations: GraduationTapeItem[] = [
  {
    id: "grad-1",
    contractAddress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    symbol: "ROBIN",
    name: "Robinhood Pepe",
    deployerAddress: "0xd222222222222222222222222222222222222222",
    deployerScore: 82,
    deployerBand: "green",
    marketCapUsd: 320000,
    graduatedAt: new Date(Date.now() - 300000).toISOString(),
  },
];

const watchedDeployers = ["0xd111111111111111111111111111111111111111"];

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedTableRowData[]>(initialFeedItems);
  const [stats, setStats] = useState<FeedStatsData>({
    totalLaunches10m: 24,
    totalVolumeUsd: 1428000,
    uniqueWallets: 842,
    graduatedCount: 9,
    repeatDeployerPct: 34.5,
  });
  const [trades, setTrades] = useState<TradeTapeItem[]>(initialTrades);
  const [graduations, setGraduations] = useState<GraduationTapeItem[]>(initialGraduations);
  const [selectedToken, setSelectedToken] = useState<InspectorToken | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const fetchFeedData = useCallback(async () => {
    try {
      const res = await fetch("/api/feed");
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && Array.isArray(data.items) && data.items.length > 0) {
        setFeedItems(data.items);
        if (data.stats) {
          setStats(data.stats);
        }
        if (Array.isArray(data.trades) && data.trades.length > 0) {
          setTrades(data.trades);
        }
        if (Array.isArray(data.graduations) && data.graduations.length > 0) {
          setGraduations(data.graduations);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    async function loadFeed() {
      try {
        const res = await fetch("/api/feed");
        if (!res.ok || !isSubscribed) return;
        const data = await res.json();
        if (!isSubscribed) return;
        if (data.ok && Array.isArray(data.items) && data.items.length > 0) {
          setFeedItems(data.items);
          if (data.stats) {
            setStats(data.stats);
          }
          if (Array.isArray(data.trades) && data.trades.length > 0) {
            setTrades(data.trades);
          }
          if (Array.isArray(data.graduations) && data.graduations.length > 0) {
            setGraduations(data.graduations);
          }
        }
      } catch {
        // ignore fetch error
      }
    }
    void loadFeed();
    return () => {
      isSubscribed = false;
    };
  }, []);

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

  const tickerItems = (feedItems || []).map((item) => ({
    contractAddress: item.contractAddress,
    symbol: item.symbol,
    name: item.name,
    marketCapUsd: item.marketCapUsd,
    deltaPct: 0,
    badge:
      item.phase === "graduated"
        ? "GRADUATED"
        : item.progressPct && item.progressPct > 80
        ? "SURGE"
        : undefined,
    score: item.score,
  }));

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] flex flex-col font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-10 w-[700px] h-[400px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader />
      <TickerTape items={tickerItems} onRefresh={fetchFeedData} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-5 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF7]">
                Live Launches
              </h1>
              <FeedPoller
                isLive={true}
                itemCount={feedItems.length}
                onFetchNewLaunches={fetchFeedData}
                pollingIntervalMs={2000}
              />
            </div>
            <p className="text-[11px] sm:text-xs text-[#A7F3D0] mt-0.5 font-normal">
              Sub-second live streaming launch radar, bonding curve telemetries, and deployer Bayesian reputation tracking.
            </p>
          </div>
        </div>

        <FeedTiles stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          <div className="lg:col-span-8 space-y-4">
            <FeedTable
              items={feedItems}
              watchedDeployers={watchedDeployers}
              onRowClick={handleRowClick}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <TradeTape
              trades={trades}
              onSelectTrade={(t) => {
                setSelectedToken({
                  contractAddress: t.contractAddress,
                  symbol: t.symbol,
                });
                setIsInspectorOpen(true);
              }}
            />
            <GraduationTape
              graduations={graduations}
              onSelectGraduation={(g) => {
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
              }}
            />
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
