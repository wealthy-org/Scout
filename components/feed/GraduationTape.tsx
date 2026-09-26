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
      className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 flex flex-col h-[480px] shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
            Graduation Stream
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          {isPaused && (
            <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 font-semibold">
              PAUSED
            </span>
          )}
          <span>{`${items.length} Graduated`}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-800">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            No recent graduations available.
          </div>
        ) : (
          items.map((g) => (
            <div
              key={g.id}
              onClick={() => onSelectGraduation?.(g)}
              className="p-2.5 bg-[#161c24] hover:bg-[#1f2834] rounded-lg border border-gray-800/60 transition-colors flex items-center justify-between cursor-pointer group"
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
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        g.deployerBand === "green"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                          : g.deployerBand === "red"
                          ? "bg-red-950 text-red-400 border border-red-800/60"
                          : "bg-amber-950 text-amber-400 border border-amber-800/60"
                      }`}
                    >
                      {`${g.deployerScore ?? 50} Score`}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1.5 font-mono">
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
                <div className="text-[10px] text-gray-500">
                  {formatTimeAgo(g.graduatedAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
