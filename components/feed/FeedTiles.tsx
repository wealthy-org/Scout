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
      borderColor: "border-cyan-900/40",
    },
    {
      id: "tile-volume",
      title: "Total Volume",
      value: formatVolume(totalVolumeUsd),
      accentColor: "text-white",
      borderColor: "border-gray-800",
    },
    {
      id: "tile-wallets",
      title: "Unique Wallets",
      value: uniqueWallets.toLocaleString(),
      accentColor: "text-purple-400",
      borderColor: "border-purple-900/40",
    },
    {
      id: "tile-graduated",
      title: "Graduated (24h)",
      value: graduatedCount.toLocaleString(),
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-900/40",
    },
    {
      id: "tile-repeat",
      title: "Repeat Deployers",
      value: `${repeatDeployerPct.toFixed(1)}%`,
      accentColor:
        repeatDeployerPct > 50
          ? "text-red-400"
          : repeatDeployerPct > 25
          ? "text-amber-400"
          : "text-emerald-400",
      borderColor: "border-gray-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 font-mono select-none">
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className={`bg-[#11161d] border ${tile.borderColor} rounded-xl p-4 flex flex-col justify-between shadow-md hover:border-gray-700 transition-all`}
        >
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {tile.title}
          </div>
          <div
            className={`text-xl sm:text-2xl font-black tracking-tight ${tile.accentColor} transition-all`}
          >
            {tile.value}
          </div>
        </div>
      ))}
    </div>
  );
}
