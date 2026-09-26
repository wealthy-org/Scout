"use client";

import React, { useEffect, useRef, useState } from "react";
import type { FeedLaunchItem } from "@/lib/feed/polling";

export interface FeedPollerProps {
  isLive?: boolean;
  itemCount?: number;
  onFetchNewLaunches?: () => Promise<FeedLaunchItem[] | void>;
  pollingIntervalMs?: number;
}

export function FeedPoller({
  isLive = true,
  itemCount = 0,
  onFetchNewLaunches,
  pollingIntervalMs = 2000,
}: FeedPollerProps) {
  const [active, setActive] = useState(isLive);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      setActive(!document.hidden && isLive);
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    const interval = setInterval(async () => {
      if (isVisibleRef.current && isLive && onFetchNewLaunches) {
        try {
          await onFetchNewLaunches();
        } catch {
          // ignore background polling network errors
        }
      }
    }, pollingIntervalMs);

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      clearInterval(interval);
    };
  }, [isLive, onFetchNewLaunches, pollingIntervalMs]);

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#11161d] border border-gray-800 rounded-full font-mono text-xs text-gray-300 select-none">
      <span
        className={`w-2 h-2 rounded-full ${
          active
            ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"
            : "bg-gray-500"
        }`}
      />
      <span className="font-semibold text-[11px]">
        {active ? "Live Polling" : "Paused"}
      </span>
      <span className="text-gray-500 font-normal">({itemCount} tokens)</span>
    </div>
  );
}
