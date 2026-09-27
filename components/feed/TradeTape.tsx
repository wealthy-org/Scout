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
      className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-4 sm:p-5 flex flex-col h-[480px] shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[rgba(153,246,228,0.2)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#99F6E4] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#99F6E4]" />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
            Live Trade Tape
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#A7F3D0]">
          {isPaused && (
            <span className="px-2 py-0.5 rounded-full bg-[#FFD166] text-[#042F2E] border-[1.5px] border-[#042F2E] font-bold text-[10px]">
              PAUSED
            </span>
          )}
          <span>{`${items.length} Recent`}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#A7F3D0]/70">
            No recent trades available.
          </div>
        ) : (
          items.map((t) => {
            const isBuy = t.type === "buy";
            return (
              <div
                key={t.id}
                onClick={() => onSelectTrade?.(t)}
                className="p-3 bg-[#042F2E] hover:bg-[#14B8A6]/20 rounded-2xl border border-[rgba(153,246,228,0.2)] transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border-[1.5px] border-[#042F2E] ${
                      isBuy
                        ? "bg-[#99F6E4] text-[#042F2E]"
                        : "bg-[#FF6B6B] text-[#042F2E]"
                    }`}
                  >
                    {t.type}
                  </span>
                  <Link
                    href={`/d/${t.contractAddress}`}
                    className="font-bold text-[#FFFDF7] group-hover:text-[#99F6E4] text-xs transition-colors"
                  >
                    {`$${t.symbol}`}
                  </Link>
                  <span className="text-[11px] font-mono text-[#A7F3D0] hidden sm:inline">
                    {truncateAddress(t.trader)}
                  </span>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-bold ${
                      isBuy ? "text-[#99F6E4]" : "text-[#FF6B6B]"
                    }`}
                  >
                    {`${t.amountEth.toFixed(4)} ETH`}
                  </div>
                  <div className="text-[10px] text-[#A7F3D0]/80">
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
