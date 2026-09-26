"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export type FeedTableTab =
  | "most_traded"
  | "new_launches"
  | "near_graduation"
  | "repeat_deployers";

export interface FeedTableRowData {
  contractAddress: string;
  symbol: string;
  name?: string;
  deployerAddress: string;
  score?: number;
  label?: "fresh" | "repeat" | "serial" | string;
  band?: "green" | "yellow" | "red" | string;
  progressPct?: number;
  marketCapUsd?: number;
  volume24hUsd?: number;
  phase?: "curve" | "graduated" | "swept" | string;
  block?: number;
  timestamp?: string | Date;
}

export interface FeedTableProps {
  items?: FeedTableRowData[];
  defaultTab?: FeedTableTab;
  watchedDeployers?: string[] | Set<string>;
  onRowClick?: (row: FeedTableRowData) => void;
}

export function filterFeedItems(
  items: FeedTableRowData[] = [],
  tab: FeedTableTab = "most_traded",
  search: string = ""
): FeedTableRowData[] {
  let result = [...items];

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        item.contractAddress.toLowerCase().includes(q) ||
        item.deployerAddress.toLowerCase().includes(q)
    );
  }

  switch (tab) {
    case "most_traded":
      result.sort((a, b) => (b.volume24hUsd ?? 0) - (a.volume24hUsd ?? 0));
      break;
    case "new_launches":
      result.sort((a, b) => {
        if (b.block && a.block && b.block !== a.block) return b.block - a.block;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        return timeB - timeA;
      });
      break;
    case "near_graduation":
      result = result
        .filter((item) => (item.progressPct ?? 0) >= 80 && item.phase !== "graduated")
        .sort((a, b) => (b.progressPct ?? 0) - (a.progressPct ?? 0));
      break;
    case "repeat_deployers":
      result = result
        .filter(
          (item) =>
            item.label === "repeat" ||
            item.label === "serial" ||
            (item.score !== undefined && item.score <= 50)
        )
        .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
      break;
  }

  return result.slice(0, 60);
}

export function FeedTable({
  items = [],
  defaultTab = "most_traded",
  watchedDeployers,
  onRowClick,
}: FeedTableProps) {
  const [activeTab, setActiveTab] = useState<FeedTableTab>(defaultTab);
  const [search, setSearch] = useState("");

  const watchedSet = useMemo(() => {
    if (!watchedDeployers) return new Set<string>();
    if (Array.isArray(watchedDeployers)) {
      return new Set(watchedDeployers.map((d) => d.toLowerCase()));
    }
    const s = new Set<string>();
    watchedDeployers.forEach((d) => s.add(d.toLowerCase()));
    return s;
  }, [watchedDeployers]);

  const filteredItems = useMemo(() => {
    return filterFeedItems(items, activeTab, search);
  }, [items, activeTab, search]);

  const formatCurrency = (val?: number) => {
    if (val === undefined || isNaN(val)) return "-";
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toLocaleString()}`;
  };

  const formatTimeAgo = (timeVal?: string | Date) => {
    if (!timeVal) return "-";
    const date = typeof timeVal === "string" ? new Date(timeVal) : timeVal;
    if (isNaN(date.getTime())) return "-";
    return date.toISOString().replace("T", " ").substring(11, 19);
  };

  return (
    <div className="bg-[#11161d] border border-gray-800 rounded-xl overflow-hidden shadow-xl font-mono text-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-gray-800 bg-[#0e131a] px-4 py-2 gap-3">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("most_traded")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "most_traded"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            Most Traded
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new_launches")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "new_launches"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            New Launches
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("near_graduation")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "near_graduation"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            Near Graduation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("repeat_deployers")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "repeat_deployers"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            Repeat Deployers
          </button>
        </div>

        <div className="flex items-center">
          <input
            id="feed-search-input"
            type="text"
            placeholder="Search by symbol, name, or CA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-[#161c24] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-800 bg-[#0d1117]/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Deployer Score</th>
              <th className="px-4 py-3">Bonding Curve</th>
              <th className="px-4 py-3">Market Cap</th>
              <th className="px-4 py-3">24h Volume</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No launch items match the active filter or search criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((row) => {
                const isGrad =
                  row.phase === "graduated" || (row.progressPct ?? 0) >= 100;
                const progress = Math.min(row.progressPct ?? 0, 100);

                const isWatched = watchedSet.has(row.deployerAddress.toLowerCase());

                return (
                  <tr
                    key={row.contractAddress}
                    onClick={() => onRowClick?.(row)}
                    className="hover:bg-[#161c24]/70 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        className="block group-hover:text-cyan-300 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                          <span>{`$${row.symbol}`}</span>
                          {isWatched && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-purple-950 text-purple-300 border border-purple-800 rounded font-bold uppercase">
                              Watched
                            </span>
                          )}
                        </div>
                        {row.name && (
                          <div className="text-[11px] text-gray-400 font-normal">
                            {row.name}
                          </div>
                        )}
                      </Link>
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        href={`/deployer/${row.deployerAddress}`}
                        className="inline-flex items-center gap-1.5 hover:underline"
                      >
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded font-bold uppercase ${
                            row.band === "green"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : row.band === "red"
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {row.score ?? 50} ({row.label ? row.label.charAt(0).toUpperCase() + row.label.slice(1) : "Fresh"})
                        </span>
                      </Link>
                    </td>

                    <td className="px-4 py-3">
                      <div className="w-28 space-y-1">
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isGrad ? "bg-emerald-400" : "bg-cyan-400"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {isGrad ? "100% Graduated" : `${progress.toFixed(1)}%`}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-200">
                      {formatCurrency(row.marketCapUsd)}
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-300">
                      {formatCurrency(row.volume24hUsd)}
                    </td>

                    <td className="px-4 py-3 text-gray-400 text-[11px]">
                      {formatTimeAgo(row.timestamp)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 hover:text-white rounded text-[11px] font-bold transition-colors"
                      >
                        <span>Open</span>
                        <span>&rarr;</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
