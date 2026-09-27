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
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-full font-mono text-xs text-[#FFFDF7] select-none shadow-[2px_2px_0px_rgba(4,47,46,0.5)]">
      <span
        className={`w-2 h-2 rounded-full ${
          active
            ? "bg-[#99F6E4] animate-pulse shadow-[0_0_8px_#99F6E4]"
            : "bg-[#A7F3D0]/40"
        }`}
      />
      <span className={`font-semibold text-[11px] ${active ? "text-[#99F6E4]" : "text-[#A7F3D0]/60"}`}>
        {active ? "Live Polling" : "Paused"}
      </span>
      <span className="text-[#A7F3D0] font-normal">({itemCount} tokens)</span>
    </div>
  );
}
