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
      accentColor: "text-cyan-300",
      icon: "⚡",
      dotColor: "bg-cyan-400",
    },
    {
      id: "tile-volume",
      title: "Total Volume",
      value: formatVolume(totalVolumeUsd),
      accentColor: "text-white",
      icon: "💎",
      dotColor: "bg-slate-300",
    },
    {
      id: "tile-wallets",
      title: "Unique Wallets",
      value: uniqueWallets.toLocaleString(),
      accentColor: "text-fuchsia-400",
      icon: "👥",
      dotColor: "bg-fuchsia-400",
    },
    {
      id: "tile-graduated",
      title: "Graduated (24h)",
      value: graduatedCount.toLocaleString(),
      accentColor: "text-emerald-400",
      icon: "🎓",
      dotColor: "bg-emerald-400",
    },
    {
      id: "tile-repeat",
      title: "Repeat Deployers",
      value: `${repeatDeployerPct.toFixed(1)}%`,
      accentColor:
        repeatDeployerPct > 50
          ? "text-rose-400"
          : repeatDeployerPct > 25
          ? "text-amber-400"
          : "text-emerald-400",
      icon: "🔄",
      dotColor:
        repeatDeployerPct > 50
          ? "bg-rose-400"
          : repeatDeployerPct > 25
          ? "bg-amber-400"
          : "bg-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 font-sans select-none">
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="chroma-card-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-lg"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
