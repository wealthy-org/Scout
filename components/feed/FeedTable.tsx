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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl font-sans text-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-800/80 bg-slate-950/60 p-3 sm:p-4 gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("most_traded")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "most_traded"
                ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                : "text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800"
            }`}
          >
            Most Traded
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new_launches")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "new_launches"
                ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                : "text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800"
            }`}
          >
            New Launches
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("near_graduation")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "near_graduation"
                ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                : "text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800"
            }`}
          >
            Near Graduation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("repeat_deployers")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "repeat_deployers"
                ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                : "text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800"
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
            className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500/60 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-4 py-3.5">Token</th>
              <th className="px-4 py-3.5">Deployer Score</th>
              <th className="px-4 py-3.5">Bonding Curve</th>
              <th className="px-4 py-3.5">Market Cap</th>
              <th className="px-4 py-3.5">24h Volume</th>
              <th className="px-4 py-3.5">Age</th>
              <th className="px-4 py-3.5 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500 text-xs">
                  No launch items match the active filter or search criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((row) => {
                const isGrad =
                  row.phase === "graduated" || (row.progressPct ?? 0) >= 100;
                const progress = Math.min(row.progressPct ?? 0, 100);
                const isWatched = watchedSet.has(row.deployerAddress.toLowerCase());

                const bandColor =
                  row.band === "green"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : row.band === "red"
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                    : "bg-amber-500/10 border-amber-500/40 text-amber-400";

                return (
                  <tr
                    key={row.contractAddress}
                    onClick={() => onRowClick?.(row)}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        className="block group-hover:text-cyan-400 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <span>{`$${row.symbol}`}</span>
                          {isWatched && (
                            <span className="px-2 py-0.5 text-[10px] bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 rounded-full font-bold uppercase">
                              Watched
                            </span>
                          )}
                        </div>
                        {row.name && (
                          <div className="text-[11px] text-slate-400 font-normal">
                            {row.name}
                          </div>
                        )}
                      </Link>
                    </td>

                    <td className="px-4 py-3.5">
                      <Link
                        href={`/deployer/${row.deployerAddress}`}
                        className="inline-flex items-center gap-1.5 hover:underline"
                      >
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${bandColor}`}
                        >
                          {row.score ?? 50} ({row.label ? row.label.charAt(0).toUpperCase() + row.label.slice(1) : "Fresh"})
                        </span>
                      </Link>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="w-28 space-y-1.5">
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isGrad
                                ? "bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_8px_rgba(0,229,153,0.5)]"
                                : "bg-gradient-to-r from-cyan-400 to-blue-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {isGrad ? "100% Graduated" : `${progress.toFixed(1)}%`}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-slate-200">
                      {formatCurrency(row.marketCapUsd)}
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-slate-300">
                      {formatCurrency(row.volume24hUsd)}
                    </td>

                    <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                      {formatTimeAgo(row.timestamp)}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 hover:text-white rounded-xl text-[11px] font-bold transition-all"
                      >
                        <span>Open</span>
                        <span>→</span>
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
