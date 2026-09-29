"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconWhale, IconRadar } from "@/components/icons/Vectors";

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
      className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col shadow-lg backdrop-blur-xl font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[rgba(153,246,228,0.18)] min-h-[26px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#99F6E4] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#99F6E4]" />
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#FFFDF7]">
            Live Trade Tape
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
          <span className="font-mono text-[10px] text-[#A7F3D0]/80">{`${items.length} Recent`}</span>
        </div>
      </div>

      <div className="max-h-[240px] overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar">
        {items.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-xs text-[#A7F3D0]/70 gap-1.5">
            <IconRadar size={22} className="text-[#99F6E4]/40" />
            <span className="text-[11px]">No recent trades available.</span>
          </div>
        ) : (
          items.map((t) => {
            const isBuy = t.type === "buy";
            const isWhale = t.amountEth >= 2.0;

            return (
              <div
                key={t.id}
                onClick={() => onSelectTrade?.(t)}
                className="p-2.5 bg-[#042F2E]/90 hover:bg-[#083835] rounded-xl border border-[rgba(153,246,228,0.15)] hover:border-[#99F6E4]/40 transition-all flex items-center justify-between cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                      isBuy
                        ? "bg-[#99F6E4] text-[#042F2E] border-[#042F2E]"
                        : "bg-[#FF6B6B] text-[#042F2E] border-[#042F2E]"
                    }`}
                  >
                    {t.type}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/d/${t.contractAddress}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-extrabold text-[#FFFDF7] group-hover:text-[#99F6E4] text-xs transition-colors"
                      >
                        {`$${t.symbol}`}
                      </Link>
                      {isWhale && (
                        <span className="text-[8px] font-black px-1 py-0.5 rounded bg-[#FFD166] text-[#042F2E] border border-[#042F2E] flex items-center gap-0.5">
                          <IconWhale size={9} />
                          <span>Whale</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-[#A7F3D0]/70">
                      {truncateAddress(t.trader)}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div
                    className={`text-xs font-black ${
                      isBuy ? "text-[#99F6E4]" : "text-[#FF6B6B]"
                    }`}
                  >
                    {`${t.amountEth.toFixed(4)} ETH`}
                  </div>
                  <div className="text-[9px] text-[#A7F3D0]/70">
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
