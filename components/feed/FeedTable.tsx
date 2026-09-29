"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  IconFlame,
  IconBolt,
  IconGraduation,
  IconAlert,
  IconRadar,
  IconClipboard,
  IconCheck,
  IconClose,
  IconArrowRight,
} from "@/components/icons/Vectors";

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
  score?: number | null;
  label?: "fresh" | "repeat" | "serial" | string | null;
  band?: "green" | "yellow" | "red" | string | null;
  progressPct?: number | null;
  marketCapUsd?: number | null;
  volume24hUsd?: number | null;
  phase?: "curve" | "graduated" | "swept" | string | null;
  block?: number | null;
  timestamp?: string | Date | null;
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
      result.sort((a, b) => {
        const volB = typeof b.volume24hUsd === "number" ? b.volume24hUsd : 0;
        const volA = typeof a.volume24hUsd === "number" ? a.volume24hUsd : 0;
        return volB - volA;
      });
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
        .filter(
          (item) =>
            typeof item.progressPct === "number" &&
            item.progressPct >= 80 &&
            item.phase !== "graduated"
        )
        .sort((a, b) => {
          const progB = typeof b.progressPct === "number" ? b.progressPct : 0;
          const progA = typeof a.progressPct === "number" ? a.progressPct : 0;
          return progB - progA;
        });
      break;
    case "repeat_deployers":
      result = result
        .filter(
          (item) =>
            item.label === "repeat" ||
            item.label === "serial" ||
            (typeof item.score === "number" && item.score <= 50)
        )
        .sort((a, b) => {
          const scoreA = typeof a.score === "number" ? a.score : 50;
          const scoreB = typeof b.score === "number" ? b.score : 50;
          return scoreA - scoreB;
        });
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
    if (watchedDeployers instanceof Set) return watchedDeployers;
    return new Set(watchedDeployers.map((a) => a.toLowerCase()));
  }, [watchedDeployers]);

  const filteredItems = useMemo(() => {
    return filterFeedItems(items, activeTab, search);
  }, [items, activeTab, search]);

  const handleCopy = (e: React.MouseEvent, addr: string) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(addr);
      setCopiedAddress(addr);
      setTimeout(() => setCopiedAddress(null), 1500);
    }
  };

  const formatCurrency = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return "-";
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toLocaleString()}`;
  };

  const formatTimeAgo = (timeVal?: string | Date | null) => {
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
    <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl overflow-hidden shadow-[6px_6px_0px_#042F2E] font-sans text-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b-2 border-[#042F2E] bg-[#042F2E] p-3.5 sm:p-4 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("most_traded")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "most_traded"
                ? "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#064E4A] hover:bg-[#083835] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
            }`}
          >
            <IconFlame size={13} className={activeTab === "most_traded" ? "text-[#042F2E]" : "text-[#FFD166]"} />
            <span>Most Traded</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new_launches")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "new_launches"
                ? "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#064E4A] hover:bg-[#083835] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
            }`}
          >
            <IconBolt size={13} className={activeTab === "new_launches" ? "text-[#042F2E]" : "text-[#99F6E4]"} />
            <span>New Launches</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("near_graduation")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "near_graduation"
                ? "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#064E4A] hover:bg-[#083835] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
            }`}
          >
            <IconGraduation size={13} className={activeTab === "near_graduation" ? "text-[#042F2E]" : "text-[#FFD166]"} />
            <span>Near Graduation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("repeat_deployers")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "repeat_deployers"
                ? "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                : "text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#064E4A] hover:bg-[#083835] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
            }`}
          >
            <IconAlert size={13} className={activeTab === "repeat_deployers" ? "text-[#042F2E]" : "text-[#FF6B6B]"} />
            <span>Repeat Deployers</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-60">
            <input
              id="feed-search-input"
              type="text"
              placeholder="Search symbol, name, CA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#064E4A] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] rounded-full pl-4 pr-8 py-2 text-xs text-[#FFFDF7] placeholder-[#A7F3D0]/60 focus:outline-hidden focus:border-[#FFD166] transition-all font-mono"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A7F3D0] hover:text-[#FFFDF7] p-1 rounded-full transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <IconClose size={11} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-[#042F2E] bg-[#042F2E] text-[10px] sm:text-[11px] font-black text-[#A7F3D0] uppercase tracking-wider">
              <th className="px-4 py-3.5 min-w-[170px]">Token &amp; CA</th>
              <th className="px-4 py-3.5 min-w-[130px]">Deployer Rep Score</th>
              <th className="px-4 py-3.5 min-w-[135px]">Bonding Curve Progress</th>
              <th className="px-4 py-3.5 min-w-[85px]">Market Cap</th>
              <th className="px-4 py-3.5 min-w-[85px]">24h Volume</th>
              <th className="px-4 py-3.5 min-w-[85px]">Age / Block</th>
              <th className="px-4 py-3.5 text-right min-w-[70px]">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y border-b border-[#042F2E] divide-[#042F2E]/60 bg-[#064E4A]/80">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#A7F3D0]/70 text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-center text-[#99F6E4]">
                      <IconRadar size={22} />
                    </div>
                    <span className="font-bold text-[#FFFDF7]">No launch items match the active filter or search criteria.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setActiveTab("most_traded");
                      }}
                      className="mt-1 px-4 py-1.5 bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] rounded-full text-xs font-black hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((row) => {
                const isGrad =
                  row.phase === "graduated" ||
                  (typeof row.progressPct === "number" && row.progressPct >= 100);
                const progress =
                  typeof row.progressPct === "number"
                    ? Math.min(row.progressPct, 100)
                    : 0;
                const isWatched = watchedSet.has(row.deployerAddress.toLowerCase());

                const bandColor =
                  row.band === "green"
                    ? "bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                    : row.band === "red"
                    ? "bg-[#FF6B6B] text-[#FFFDF7] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                    : "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]";

                const isCopied = copiedAddress === row.contractAddress;

                return (
                  <tr
                    key={row.contractAddress}
                    onClick={() => onRowClick?.(row)}
                    className="hover:bg-[#042F2E]/60 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-center text-xs font-black text-[#99F6E4] shrink-0 group-hover:scale-105 group-hover:border-[#99F6E4] transition-all">
                          {row.symbol.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-black text-[#FFFDF7] text-xs">
                            <Link
                              href={`/d/${row.contractAddress}`}
                              className="group-hover:text-[#FFD166] transition-colors truncate max-w-[110px]"
                            >
                              {`$${row.symbol}`}
                            </Link>
                            {isWatched && (
                              <span className="px-2 py-0.5 text-[8px] bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[1px_1px_0px_#042F2E] rounded-full font-black uppercase">
                                Watched
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {row.name && (
                              <span className="text-[11px] text-[#A7F3D0] font-normal truncate max-w-[110px]">
                                {row.name}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleCopy(e, row.contractAddress)}
                              className="text-[9px] font-mono text-[#A7F3D0]/80 hover:text-[#99F6E4] flex items-center gap-0.5 hover:underline"
                              title="Copy contract address"
                            >
                              <span>{truncateAddress(row.contractAddress)}</span>
                              {isCopied ? (
                                <IconCheck size={10} className="text-[#4ADE80]" />
                              ) : (
                                <IconClipboard size={10} className="text-[#A7F3D0]/80" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <Link
                        href={`/deployer/${row.deployerAddress}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 hover:scale-105 transition-transform"
                      >
                        <span
                          className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase ${bandColor}`}
                        >
                          {row.score ?? 50} ({row.label ? row.label.charAt(0).toUpperCase() + row.label.slice(1) : "Fresh"})
                        </span>
                      </Link>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="w-32 space-y-1">
                        <div className="w-full h-2.5 bg-[#042F2E] border-2 border-[#042F2E] shadow-[1px_1px_0px_#042F2E] rounded-full overflow-hidden p-[1px]">
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
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-[#A7F3D0] font-mono font-bold">
                            {isGrad ? "100% Graduated" : `${progress.toFixed(1)}%`}
                          </span>
                          {progress >= 80 && !isGrad && (
                            <span className="text-[8px] font-black text-[#FFD166] uppercase animate-pulse">
                              Near Grad
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-black text-[#FFFDF7] font-mono text-xs">
                      {formatCurrency(row.marketCapUsd)}
                    </td>

                    <td className="px-4 py-3.5 font-black text-[#99F6E4] font-mono text-xs">
                      {formatCurrency(row.volume24hUsd)}
                    </td>

                    <td className="px-4 py-3.5 text-[#A7F3D0] text-[11px] font-mono">
                      <div className="font-bold">{formatTimeAgo(row.timestamp)}</div>
                      {row.block && (
                        <div className="text-[9px] text-[#A7F3D0]/70 font-semibold">#{row.block}</div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/d/${row.contractAddress}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#99F6E4] hover:bg-[#5EEAD4] border-2 border-[#042F2E] text-[#042F2E] rounded-full text-xs font-black shadow-[2px_2px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      >
                        <span>Open</span>
                        <IconArrowRight size={11} />
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

