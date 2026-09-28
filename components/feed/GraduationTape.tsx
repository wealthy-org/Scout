"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface GraduationTapeItem {
  id: string;
  contractAddress: string;
  symbol: string;
  name?: string;
  deployerAddress: string;
  deployerScore?: number;
  deployerBand?: "green" | "yellow" | "red" | string;
  marketCapUsd?: number;
  graduatedAt?: string | number | Date;
}

export interface GraduationTapeProps {
  graduations?: GraduationTapeItem[];
  maxItems?: number;
  onSelectGraduation?: (item: GraduationTapeItem) => void;
}

function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr || "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatCurrency(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
  return `$${val.toLocaleString()}`;
}

function formatTimeAgo(ts?: string | number | Date): string {
  if (!ts) return "recently";
  const now = typeof Date.now === "function" ? Date.now() : 0;
  const target = new Date(ts).getTime();
  const diffSec = Math.max(0, Math.floor((now - target) / 1000));

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function GraduationTape({
  graduations = [],
  maxItems = 30,
  onSelectGraduation,
}: GraduationTapeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const items = graduations.slice(0, maxItems);

  return (
    <div
      className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-3xl p-4 sm:p-5 flex flex-col h-[480px] shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[rgba(153,246,228,0.2)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD166]" />
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#FFFDF7]">
            Graduation Stream
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#A7F3D0]">
          {isPaused && (
            <span className="px-2 py-0.5 rounded-full bg-[#FFD166] text-[#042F2E] border-[1.5px] border-[#042F2E] font-black text-[9px] uppercase">
              PAUSED
            </span>
          )}
          <span className="font-mono">{`${items.length} Graduated`}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-xs text-[#A7F3D0]/70 gap-1.5">
            <span className="text-xl">🎓</span>
            <span>No recent graduations available.</span>
          </div>
        ) : (
          items.map((g) => {
            const bandBadge =
              g.deployerBand === "green"
                ? "bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E]"
                : g.deployerBand === "red"
                ? "bg-[#FF6B6B] border-[1.5px] border-[#042F2E] text-[#042F2E]"
                : "bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E]";

            return (
              <div
                key={g.id}
                onClick={() => onSelectGraduation?.(g)}
                className="p-3 bg-[#042F2E]/90 hover:bg-[#083835] rounded-2xl border border-[rgba(153,246,228,0.2)] hover:border-[#FFD166]/40 transition-all flex items-center justify-between cursor-pointer group shadow-sm hover:scale-[1.01]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏆</span>
                    <Link
                      href={`/d/${g.contractAddress}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-extrabold text-[#FFFDF7] group-hover:text-[#99F6E4] text-xs transition-colors"
                    >
                      {`$${g.symbol}`}
                    </Link>
                    {g.deployerBand && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${bandBadge}`}
                      >
                        {`${g.deployerScore ?? 50} Score`}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#A7F3D0] flex items-center gap-1.5 font-mono">
                    <span>by</span>
                    <Link
                      href={`/deployer/${g.deployerAddress}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#99F6E4] hover:underline"
                    >
                      {truncateAddress(g.deployerAddress)}
                    </Link>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-black text-[#FFD166]">
                    {formatCurrency(g.marketCapUsd)}
                  </div>
                  <div className="text-[10px] text-[#A7F3D0]/80">
                    {formatTimeAgo(g.graduatedAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
