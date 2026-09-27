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
    <div className="bg-[#0D1322]/90 border border-white/10 rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.6)] backdrop-blur-2xl font-sans text-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-white/10 bg-slate-950/60 p-3.5 sm:p-5 gap-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("most_traded")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "most_traded"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/10"
            }`}
          >
            Most Traded
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new_launches")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "new_launches"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/10"
            }`}
          >
            New Launches
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("near_graduation")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "near_graduation"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/10"
            }`}
          >
            Near Graduation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("repeat_deployers")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "repeat_deployers"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/10"
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
            className="w-full md:w-64 bg-[#042F2E]/80 border border-[rgba(153,246,228,0.25)] rounded-full px-4 py-2 text-xs text-[#FFFDF7] placeholder-[#A7F3D0]/50 focus:outline-hidden focus:border-[#FFD166] transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-4">Token</th>
              <th className="px-5 py-4">Deployer Score</th>
              <th className="px-5 py-4">Bonding Curve</th>
              <th className="px-5 py-4">Market Cap</th>
              <th className="px-5 py-4">24h Volume</th>
              <th className="px-5 py-4">Age</th>
              <th className="px-5 py-4 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500 text-xs">
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
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(0,229,153,0.15)]"
                    : row.band === "red"
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(255,46,77,0.15)]"
                    : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(255,184,0,0.15)]";

                return (
                  <tr
                    key={row.contractAddress}
                    onClick={() => onRowClick?.(row)}
                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        className="block group-hover:text-cyan-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <span className="group-hover:text-cyan-300 transition-colors">{`$${row.symbol}`}</span>
                          {isWatched && (
                            <span className="px-2.5 py-0.5 text-[10px] bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/40 rounded-full font-bold uppercase shadow-[0_0_8px_rgba(217,70,239,0.3)]">
                              Watched
                            </span>
                          )}
                        </div>
                        {row.name && (
                          <div className="text-xs text-slate-400 font-normal">
                            {row.name}
                          </div>
                        )}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/deployer/${row.deployerAddress}`}
                        className="inline-flex items-center gap-1.5 hover:underline"
                      >
                        <span
                          className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase border ${bandColor}`}
                        >
                          {row.score ?? 50} ({row.label ? row.label.charAt(0).toUpperCase() + row.label.slice(1) : "Fresh"})
                        </span>
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-32 space-y-1.5">
                        <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-[1px]">
                          <div
                            className={`h-full rounded-full ${
                              isGrad
                                ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_10px_rgba(0,229,153,0.6)]"
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

                    <td className="px-5 py-4 font-bold text-slate-200">
                      {formatCurrency(row.marketCapUsd)}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-300">
                      {formatCurrency(row.volume24hUsd)}
                    </td>

                    <td className="px-5 py-4 text-slate-400 text-xs font-mono">
                      {formatTimeAgo(row.timestamp)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-800/90 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400/50 text-cyan-300 hover:text-white rounded-full text-xs font-bold transition-all shadow-sm"
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
