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
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
      glowColor: "shadow-[0_4px_20px_rgba(0,240,255,0.06)]",
      dotColor: "bg-cyan-400",
    },
    {
      id: "tile-volume",
      title: "Total Volume",
      value: formatVolume(totalVolumeUsd),
      accentColor: "text-white",
      borderColor: "border-slate-800 hover:border-slate-700",
      glowColor: "shadow-[0_4px_20px_rgba(255,255,255,0.04)]",
      dotColor: "bg-slate-300",
    },
    {
      id: "tile-wallets",
      title: "Unique Wallets",
      value: uniqueWallets.toLocaleString(),
      accentColor: "text-fuchsia-400",
      borderColor: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
      glowColor: "shadow-[0_4px_20px_rgba(217,70,239,0.06)]",
      dotColor: "bg-fuchsia-400",
    },
    {
      id: "tile-graduated",
      title: "Graduated (24h)",
      value: graduatedCount.toLocaleString(),
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
      glowColor: "shadow-[0_4px_20px_rgba(0,229,153,0.06)]",
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
      borderColor:
        repeatDeployerPct > 50
          ? "border-rose-500/20 hover:border-rose-500/40"
          : repeatDeployerPct > 25
          ? "border-amber-500/20 hover:border-amber-500/40"
          : "border-emerald-500/20 hover:border-emerald-500/40",
      glowColor: "shadow-[0_4px_20px_rgba(255,184,0,0.06)]",
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
          className={`bg-gradient-to-b from-slate-900/90 to-slate-950/90 border ${tile.borderColor} rounded-2xl p-4 sm:p-5 flex flex-col justify-between ${tile.glowColor} backdrop-blur-xl transition-all duration-200`}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>{tile.title}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${tile.dotColor}`} />
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black tracking-tight ${tile.accentColor} font-sans`}
          >
            {tile.value}
          </div>
        </div>
      ))}
    </div>
  );
}
