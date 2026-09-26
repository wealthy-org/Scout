"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export interface TickerItemData {
  contractAddress: string;
  symbol: string;
  marketCapUsd?: number;
  deltaPct?: number;
  volume10mUsd?: number;
}

export interface TickerTapeProps {
  items?: TickerItemData[];
  onRefresh?: () => Promise<TickerItemData[] | void> | void;
  refreshIntervalMs?: number;
}

const DEFAULT_FALLBACK_ITEMS: TickerItemData[] = [
  {
    contractAddress: "0x4200000000000000000000000000000000000006",
    symbol: "ETH",
    marketCapUsd: 318000000000,
    deltaPct: 2.8,
  },
  {
    contractAddress: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
    symbol: "cbBTC",
    marketCapUsd: 1420000000,
    deltaPct: 1.4,
  },
  {
    contractAddress: "0x0000000000000000000000000000000000000000",
    symbol: "Pons V2",
    marketCapUsd: 58400000,
    deltaPct: 14.2,
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
          // ignore background polling error
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

  const doubledItems = [...activeItems, ...activeItems];

  const formatMC = (val?: number) => {
    if (val === undefined || isNaN(val)) return "-";
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  };

  const formatDelta = (val?: number) => {
    if (val === undefined || isNaN(val)) return "0.0%";
    const sign = val > 0 ? "+" : "";
    return `${sign}${val.toFixed(1)}%`;
  };

  return (
    <div
      className="w-full bg-[#080b0f] border-b border-gray-800/80 overflow-hidden font-mono text-xs py-2 select-none relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (isVisibleRef.current) setIsPaused(false);
      }}
    >
      <div
        className={`flex items-center gap-6 whitespace-nowrap will-change-transform ${
          isPaused ? "" : "animate-marquee"
        }`}
        style={{
          display: "inline-flex",
          animationDuration: `${Math.max(activeItems.length * 4, 20)}s`,
        }}
      >
        {doubledItems.map((item, idx) => {
          const delta = item.deltaPct ?? 0;
          const isPos = delta > 0;
          const isNeg = delta < 0;

          return (
            <Link
              key={`${item.contractAddress}-${idx}`}
              href={`/d/${item.contractAddress}`}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#11161d] hover:bg-[#161c24] border border-gray-800 hover:border-cyan-700/60 rounded-lg transition-colors group"
            >
              <span className="font-bold text-white group-hover:text-cyan-300">
                ${item.symbol}
              </span>
              <span className="text-gray-400 text-[11px]">
                {formatMC(item.marketCapUsd)}
              </span>
              <span
                className={`text-[11px] font-semibold px-1 py-0.5 rounded ${
                  isPos
                    ? "bg-emerald-950/60 text-emerald-400"
                    : isNeg
                    ? "bg-red-950/60 text-red-400"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {formatDelta(item.deltaPct)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
