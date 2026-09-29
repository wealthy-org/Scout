"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconTrophy, IconGraduation } from "@/components/icons/Vectors";

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
      className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col shadow-lg backdrop-blur-xl font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[rgba(153,246,228,0.18)] min-h-[26px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD166] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD166]" />
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#FFFDF7]">
            Graduation Stream
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#A7F3D0] h-5">
          <span
            className={`px-1.5 py-0.5 rounded-md bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-black text-[9px] uppercase leading-none transition-all duration-150 ${
              isPaused ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            PAUSED
          </span>
          <span className="font-mono text-[10px] text-[#A7F3D0]/80">{`${items.length} Graduated`}</span>
        </div>
      </div>

      <div className="max-h-[240px] overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar">
        {items.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-xs text-[#A7F3D0]/70 gap-1.5">
            <IconGraduation size={22} className="text-[#FFD166]/40" />
            <span className="text-[11px]">No recent graduations available.</span>
          </div>
        ) : (
          items.map((g) => {
            const bandBadge =
              g.deployerBand === "green"
                ? "bg-[#99F6E4] border border-[#042F2E] text-[#042F2E]"
                : g.deployerBand === "red"
                ? "bg-[#FF6B6B] border border-[#042F2E] text-[#042F2E]"
                : "bg-[#FFD166] border border-[#042F2E] text-[#042F2E]";

            return (
              <div
                key={g.id}
                onClick={() => onSelectGraduation?.(g)}
                className="p-2.5 bg-[#042F2E]/90 hover:bg-[#083835] rounded-xl border border-[rgba(153,246,228,0.15)] hover:border-[#FFD166]/40 transition-all flex items-center justify-between cursor-pointer group shadow-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4.5 h-4.5 rounded bg-[#FFD166]/20 border border-[#FFD166]/40 flex items-center justify-center text-[#FFD166]">
                      <IconTrophy size={10} />
                    </div>
                    <Link
                      href={`/d/${g.contractAddress}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-extrabold text-[#FFFDF7] group-hover:text-[#99F6E4] text-xs transition-colors"
                    >
                      {`$${g.symbol}`}
                    </Link>
                    {g.deployerBand && (
                      <span
                        className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${bandBadge}`}
                      >
                        {`${g.deployerScore ?? 50} Score`}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-[#A7F3D0]/80 flex items-center gap-1 font-mono">
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
                  <div className="text-[9px] text-[#A7F3D0]/70">
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
