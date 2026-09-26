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
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col h-[480px] shadow-xl backdrop-blur-xl font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Trade Tape
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          {isPaused && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold text-[10px]">
              PAUSED
            </span>
          )}
          <span>{`${items.length} Recent`}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No recent trades available.
          </div>
        ) : (
          items.map((t) => {
            const isBuy = t.type === "buy";
            return (
              <div
                key={t.id}
                onClick={() => onSelectTrade?.(t)}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/60 rounded-2xl border border-slate-800/80 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isBuy
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
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
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    {truncateAddress(t.trader)}
                  </span>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-bold ${
                      isBuy ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {`${t.amountEth.toFixed(4)} ETH`}
                  </div>
                  <div className="text-[10px] text-slate-500">
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
