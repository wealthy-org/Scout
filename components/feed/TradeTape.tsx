"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface TradeTapeItem {
  id: string;
  symbol: string;
  contractAddress: string;
  type: "buy" | "sell";
  amountEth: number;
  amountToken: number;
  trader: string;
  timestamp?: string | number | Date;
  txHash?: string;
}

export interface TradeTapeProps {
  trades?: TradeTapeItem[];
  maxItems?: number;
  onSelectTrade?: (trade: TradeTapeItem) => void;
}

function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr || "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTimeAgo(ts?: string | number | Date): string {
  if (!ts) return "now";
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

export function TradeTape({
  trades = [],
  maxItems = 40,
  onSelectTrade,
}: TradeTapeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const items = trades.slice(0, maxItems);

  return (
    <div
      className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 flex flex-col h-[480px] shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
            Live Trade Tape
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          {isPaused && (
            <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 font-semibold">
              PAUSED
            </span>
          )}
          <span>{`${items.length} Recent`}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-800">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            No recent trades available.
          </div>
        ) : (
          items.map((t) => {
            const isBuy = t.type === "buy";
            return (
              <div
                key={t.id}
                onClick={() => onSelectTrade?.(t)}
                className="p-2.5 bg-[#161c24] hover:bg-[#1f2834] rounded-lg border border-gray-800/60 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isBuy
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                        : "bg-red-950 text-red-400 border border-red-800/60"
                    }`}
                  >
                    {t.type}
                  </span>
                  <Link
                    href={`/d/${t.contractAddress}`}
                    className="font-bold text-white group-hover:text-cyan-400 text-xs transition-colors"
                  >
                    {`$${t.symbol}`}
                  </Link>
                  <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
                    {truncateAddress(t.trader)}
                  </span>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-bold ${
                      isBuy ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {`${t.amountEth.toFixed(4)} ETH`}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {formatTimeAgo(t.timestamp)}
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
