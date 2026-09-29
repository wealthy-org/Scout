"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  IconFlame,
  IconGraduation,
  IconBolt,
  IconShield,
} from "@/components/icons/Vectors";

export interface TickerItemData {
  contractAddress: string;
  symbol: string;
  name?: string;
  marketCapUsd?: number | null;
  deltaPct?: number;
  volume10mUsd?: number | null;
  badge?: string;
  score?: number | null;
}

export interface TickerTapeProps {
  items?: TickerItemData[];
  onRefresh?: () => Promise<TickerItemData[] | void> | void;
  refreshIntervalMs?: number;
}

const DEFAULT_FALLBACK_ITEMS: TickerItemData[] = [
  {
    contractAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    symbol: "SCOUT",
    name: "Scout Terminal",
    marketCapUsd: 185000,
    deltaPct: 18.4,
    badge: "SURGE",
    score: 95,
  },
  {
    contractAddress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    symbol: "ROBIN",
    name: "Robinhood Pepe",
    marketCapUsd: 320000,
    deltaPct: 8.2,
    badge: "GRADUATED",
    score: 82,
  },
  {
    contractAddress: "0x4200000000000000000000000000000000000006",
    symbol: "ETH",
    name: "Ethereum",
    marketCapUsd: 318000000000,
    deltaPct: 2.8,
    badge: "FAST VOL",
  },
  {
    contractAddress: "0xcccccccccccccccccccccccccccccccccccccccc",
    symbol: "RUGPULL",
    name: "Fast Rug",
    marketCapUsd: 45000,
    deltaPct: -4.5,
    badge: "SCORE 15",
    score: 15,
  },
  {
    contractAddress: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
    symbol: "cbBTC",
    name: "Coinbase BTC",
    marketCapUsd: 1420000000,
    deltaPct: 1.4,
  },
  {
    contractAddress: "0x0000000000000000000000000000000000000000",
    symbol: "Pons V2",
    name: "Pons Core",
    marketCapUsd: 58400000,
    deltaPct: 14.2,
    badge: "HOT",
  },
];

export function TickerTape({
  items = [],
  onRefresh,
  refreshIntervalMs = 30000,
}: TickerTapeProps) {
  const [polledItems, setPolledItems] = useState<TickerItemData[] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      setIsPaused(document.hidden);
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    const interval = setInterval(async () => {
      if (isVisibleRef.current && onRefresh) {
        try {
          const res = await onRefresh();
          if (Array.isArray(res) && res.length > 0) {
            setPolledItems(res.slice(0, 10));
          }
        } catch {
        }
      }
    }, refreshIntervalMs);

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      clearInterval(interval);
    };
  }, [onRefresh, refreshIntervalMs]);

  const activeItems =
    polledItems && polledItems.length > 0
      ? polledItems
      : items.length > 0
      ? items
      : DEFAULT_FALLBACK_ITEMS;

  const loopedItems = [...activeItems, ...activeItems, ...activeItems, ...activeItems];

  const formatMC = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return "-";
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  };

  const formatDelta = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return "0.0%";
    const sign = val > 0 ? "+" : "";
    return `${sign}${val.toFixed(1)}%`;
  };

  return (
    <div
      className="w-full h-10 bg-[#064E4A]/90 border-b border-[rgba(153,246,228,0.2)] overflow-hidden font-mono text-xs select-none relative backdrop-blur-md z-20 group marquee-container flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (isVisibleRef.current) setIsPaused(false);
      }}
    >
      <div className="flex items-center w-full">
        <div className="hidden sm:flex items-center gap-2 pl-4 pr-3 py-0.5 border-r border-[rgba(153,246,228,0.2)] bg-[#042F2E] text-[10px] font-bold text-[#99F6E4] uppercase tracking-wider shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[#99F6E4] animate-pulse" />
          <span>Stream</span>
        </div>

        <div className="overflow-hidden w-full marquee-mask">
          <div
            className="flex items-center gap-3 whitespace-nowrap will-change-transform animate-marquee"
            style={{
              animationDuration: `${Math.max(activeItems.length * 5, 25)}s`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {loopedItems.map((item, idx) => {
              const delta = item.deltaPct ?? 0;
              const isPos = delta > 0;
              const isNeg = delta < 0;

              return (
                <Link
                  key={`${item.contractAddress}-${idx}`}
                  href={`/d/${item.contractAddress}`}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[#042F2E]/90 hover:bg-[#083835] border border-[rgba(153,246,228,0.2)] hover:border-[#99F6E4] rounded-full transition-all group shrink-0 shadow-sm hover:shadow-[0_0_12px_rgba(153,246,228,0.25)] hover:scale-[1.02]"
                >
                  <span className="font-extrabold text-[#FFFDF7] group-hover:text-[#99F6E4] transition-colors">
                    ${item.symbol}
                  </span>

                  {item.badge && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FFD166] text-[#042F2E] border border-[#042F2E]">
                      {item.badge.includes("SURGE") ? (
                        <IconFlame size={10} />
                      ) : item.badge.includes("GRAD") ? (
                        <IconGraduation size={10} />
                      ) : item.badge.includes("VOL") ? (
                        <IconBolt size={10} />
                      ) : item.badge.includes("SCORE") ? (
                        <IconShield size={10} />
                      ) : null}
                      <span>{item.badge}</span>
                    </span>
                  )}

                  <span className="text-[#A7F3D0] text-[11px] font-medium">
                    {formatMC(item.marketCapUsd)}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isPos
                        ? "bg-[#99F6E4]/20 text-[#99F6E4] border border-[#99F6E4]/30"
                        : isNeg
                        ? "bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30"
                        : "bg-[#0D746E] text-[#A7F3D0]"
                    }`}
                  >
                    {formatDelta(item.deltaPct)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
