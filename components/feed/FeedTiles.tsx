"use client";

import React from "react";

export interface FeedStatsData {
  totalLaunches10m?: number;
  totalVolumeUsd?: number;
  uniqueWallets?: number;
  graduatedCount?: number;
  repeatDeployerPct?: number;
}

export interface FeedTilesProps {
  stats?: FeedStatsData;
}

export function FeedTiles({ stats }: FeedTilesProps) {
  const {
    totalLaunches10m = 0,
    totalVolumeUsd = 0,
    uniqueWallets = 0,
    graduatedCount = 0,
    repeatDeployerPct = 0,
  } = stats || {};

  const formatVolume = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  };

  const tiles = [
    {
      id: "tile-launches",
      title: "Launches (10m)",
      value: totalLaunches10m.toLocaleString(),
      accentColor: "text-[#99F6E4]",
      icon: "⚡",
      dotColor: "bg-[#99F6E4]",
    },
    {
      id: "tile-volume",
      title: "Total Volume",
      value: formatVolume(totalVolumeUsd),
      accentColor: "text-[#FFD166]",
      icon: "💎",
      dotColor: "bg-[#FFD166]",
    },
    {
      id: "tile-wallets",
      title: "Unique Wallets",
      value: uniqueWallets.toLocaleString(),
      accentColor: "text-[#C084FC]",
      icon: "👥",
      dotColor: "bg-[#C084FC]",
    },
    {
      id: "tile-graduated",
      title: "Graduated (24h)",
      value: graduatedCount.toLocaleString(),
      accentColor: "text-[#99F6E4]",
      icon: "🎓",
      dotColor: "bg-[#99F6E4]",
    },
    {
      id: "tile-repeat",
      title: "Repeat Deployers",
      value: `${repeatDeployerPct.toFixed(1)}%`,
      accentColor:
        repeatDeployerPct > 50
          ? "text-[#FF6B6B]"
          : repeatDeployerPct > 25
          ? "text-[#FFD166]"
          : "text-[#99F6E4]",
      icon: "🔄",
      dotColor:
        repeatDeployerPct > 50
          ? "bg-[#FF6B6B]"
          : repeatDeployerPct > 25
          ? "bg-[#FFD166]"
          : "bg-[#99F6E4]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 font-sans select-none">
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#A7F3D0] uppercase tracking-wider mb-2">
            <span>{tile.title}</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${tile.dotColor} animate-pulse`} />
              <span className="text-xs">{tile.icon}</span>
            </div>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black tracking-tight ${tile.accentColor}`}
          >
            {tile.value}
          </div>
        </div>
      ))}
    </div>
  );
}
