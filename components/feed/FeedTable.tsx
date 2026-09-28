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
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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

  const handleCopy = (e: React.MouseEvent, addr: string) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(addr);
      setCopiedAddress(addr);
      setTimeout(() => setCopiedAddress(null), 2000);
    }
  };

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

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr || "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(4,47,46,0.6)] backdrop-blur-2xl font-sans text-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-[rgba(153,246,228,0.15)] bg-[#042F2E]/80 p-4 sm:p-5 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("most_traded")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              activeTab === "most_traded"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/15 border border-[rgba(153,246,228,0.15)]"
            }`}
          >
            🔥 Most Traded
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new_launches")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              activeTab === "new_launches"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/15 border border-[rgba(153,246,228,0.15)]"
            }`}
          >
            ⚡ New Launches
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("near_graduation")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              activeTab === "near_graduation"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/15 border border-[rgba(153,246,228,0.15)]"
            }`}
          >
            🎓 Near Graduation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("repeat_deployers")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              activeTab === "repeat_deployers"
                ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E]/60 hover:bg-[#99F6E4]/15 border border-[rgba(153,246,228,0.15)]"
            }`}
          >
            ⚠️ Repeat Deployers
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <input
              id="feed-search-input"
              type="text"
              placeholder="Search by symbol, name, or CA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#042F2E]/90 border border-[rgba(153,246,228,0.25)] rounded-full pl-4 pr-9 py-2 text-xs text-[#FFFDF7] placeholder-[#A7F3D0]/50 focus:outline-hidden focus:border-[#99F6E4] focus:ring-1 focus:ring-[#99F6E4] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7F3D0] hover:text-[#FFFDF7] text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[rgba(153,246,228,0.2)] bg-[#042F2E]/90 text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
              <th className="px-5 py-4">Token & CA</th>
              <th className="px-5 py-4">Deployer Rep Score</th>
              <th className="px-5 py-4">Bonding Curve Progress</th>
              <th className="px-5 py-4">Market Cap</th>
              <th className="px-5 py-4">24h Volume</th>
              <th className="px-5 py-4">Age / Block</th>
              <th className="px-5 py-4 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(153,246,228,0.08)]">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center text-[#A7F3D0]/70 text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">📡</span>
                    <span className="font-medium">No launch items match the active filter or search criteria.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setActiveTab("most_traded");
                      }}
                      className="mt-2 px-3 py-1 bg-[#042F2E] border border-[rgba(153,246,228,0.3)] rounded-full text-[11px] text-[#99F6E4] hover:bg-[#083835]"
                    >
                      Reset filters
                    </button>
                  </div>
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
                    ? "bg-[#99F6E4]/20 text-[#99F6E4] border-[#99F6E4]/40"
                    : row.band === "red"
                    ? "bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/40"
                    : "bg-[#FFD166]/20 text-[#FFD166] border-[#FFD166]/40";

                const isCopied = copiedAddress === row.contractAddress;

                return (
                  <tr
                    key={row.contractAddress}
                    onClick={() => onRowClick?.(row)}
                    className="hover:bg-[#99F6E4]/10 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.3)] flex items-center justify-center text-sm font-black text-[#99F6E4] shadow-inner shrink-0 group-hover:scale-105 group-hover:border-[#99F6E4] transition-all">
                          {row.symbol.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 font-bold text-[#FFFDF7] text-sm">
                            <Link
                              href={`/d/${row.contractAddress}`}
                              className="group-hover:text-[#99F6E4] transition-colors"
                            >
                              {`$${row.symbol}`}
                            </Link>
                            {isWatched && (
                              <span className="px-2 py-0.5 text-[9px] bg-[#FFD166] text-[#042F2E] border border-[#042F2E] rounded-full font-black uppercase shadow-[1px_1px_0px_#042F2E]">
                                Watched
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {row.name && (
                              <span className="text-xs text-[#A7F3D0] font-normal truncate max-w-[120px]">
                                {row.name}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleCopy(e, row.contractAddress)}
                              className="text-[10px] font-mono text-[#A7F3D0]/70 hover:text-[#99F6E4] flex items-center gap-1 hover:underline"
                              title="Copy contract address"
                            >
                              <span>{truncateAddress(row.contractAddress)}</span>
                              <span>{isCopied ? "✓" : "📋"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/deployer/${row.deployerAddress}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 hover:scale-105 transition-transform"
                      >
                        <span
                          className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase border ${bandColor}`}
                        >
                          {row.score ?? 50} ({row.label ? row.label.charAt(0).toUpperCase() + row.label.slice(1) : "Fresh"})
                        </span>
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-36 space-y-1.5">
                        <div className="w-full h-2.5 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-full overflow-hidden p-[1px]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isGrad
                                ? "bg-gradient-to-r from-[#99F6E4] via-[#14B8A6] to-[#FFD166] shadow-[0_0_8px_#FFD166]"
                                : progress >= 80
                                ? "bg-gradient-to-r from-[#14B8A6] to-[#FFD166]"
                                : "bg-gradient-to-r from-[#0D746E] to-[#99F6E4]"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#A7F3D0] font-mono font-medium">
                            {isGrad ? "100% Graduated" : `${progress.toFixed(1)}%`}
                          </span>
                          {progress >= 80 && !isGrad && (
                            <span className="text-[9px] font-bold text-[#FFD166] uppercase animate-pulse">
                              Near Grad
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-extrabold text-[#FFFDF7] font-mono text-sm">
                      {formatCurrency(row.marketCapUsd)}
                    </td>

                    <td className="px-5 py-4 font-extrabold text-[#99F6E4] font-mono text-sm">
                      {formatCurrency(row.volume24hUsd)}
                    </td>

                    <td className="px-5 py-4 text-[#A7F3D0] text-xs font-mono">
                      <div>{formatTimeAgo(row.timestamp)}</div>
                      {row.block && (
                        <div className="text-[10px] text-[#A7F3D0]/60">#{row.block}</div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#99F6E4] hover:bg-[#14B8A6] border border-[#042F2E] text-[#042F2E] rounded-full text-xs font-bold shadow-[2px_2px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
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
