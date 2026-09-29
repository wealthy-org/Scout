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
      className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-4 sm:p-5 flex flex-col shadow-[6px_6px_0px_#042F2E] font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#042F2E] min-h-[28px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#99F6E4] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#99F6E4]" />
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#FFFDF7]">
            Live Trade Tape
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#A7F3D0] h-5">
          <span
            className={`px-2 py-0.5 rounded-md bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[1px_1px_0px_#042F2E] font-black text-[9px] uppercase leading-none transition-all duration-150 ${
              isPaused ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            PAUSED
          </span>
          <span className="font-mono text-[10px] font-bold text-[#A7F3D0]">{`${items.length} Recent`}</span>
        </div>
      </div>

      <div className="max-h-[250px] overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
        {items.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-xs text-[#A7F3D0]/70 gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#042F2E] border-2 border-[#042F2E] flex items-center justify-center text-[#99F6E4]">
              <IconRadar size={18} />
            </div>
            <span className="text-[11px] font-bold">No recent trades available.</span>
          </div>
        ) : (
          items.map((t) => {
            const isBuy = t.type === "buy";
            const isWhale = t.amountEth >= 2.0;

            return (
              <div
                key={t.id}
                onClick={() => onSelectTrade?.(t)}
                className="p-3 bg-[#042F2E] hover:bg-[#083835] rounded-2xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] hover:shadow-[4px_4px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border-2 border-[#042F2E] shadow-[1px_1px_0px_#042F2E] ${
                      isBuy
                        ? "bg-[#99F6E4] text-[#042F2E]"
                        : "bg-[#FF6B6B] text-[#FFFDF7]"
                    }`}
                  >
                    {t.type}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/d/${t.contractAddress}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-black text-[#FFFDF7] group-hover:text-[#FFD166] text-xs transition-colors"
                      >
                        {`$${t.symbol}`}
                      </Link>
                      {isWhale && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[1px_1px_0px_#042F2E] flex items-center gap-0.5">
                          <IconWhale size={9} />
                          <span>Whale</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-[#A7F3D0]/80">
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
                  <div className="text-[9px] font-semibold text-[#A7F3D0]/80">
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
