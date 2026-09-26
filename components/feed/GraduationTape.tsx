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
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col h-[480px] shadow-xl backdrop-blur-xl font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Graduation Stream
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          {isPaused && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold text-[10px]">
              PAUSED
            </span>
          )}
          <span>{`${items.length} Graduated`}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No recent graduations available.
          </div>
        ) : (
          items.map((g) => {
            const bandColor =
              g.deployerBand === "green"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : g.deployerBand === "red"
                ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                : "bg-amber-500/10 border-amber-500/40 text-amber-400";

            return (
              <div
                key={g.id}
                onClick={() => onSelectGraduation?.(g)}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/60 rounded-2xl border border-slate-800/80 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/d/${g.contractAddress}`}
                      className="font-bold text-white group-hover:text-cyan-400 text-xs transition-colors"
                    >
                      {`$${g.symbol}`}
                    </Link>
                    {g.deployerBand && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${bandColor}`}
                      >
                        {`${g.deployerScore ?? 50} Score`}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                    <span>by</span>
                    <Link
                      href={`/deployer/${g.deployerAddress}`}
                      className="hover:text-cyan-400 hover:underline"
                    >
                      {truncateAddress(g.deployerAddress)}
                    </Link>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-cyan-400">
                    {formatCurrency(g.marketCapUsd)}
                  </div>
                  <div className="text-[10px] text-slate-500">
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
