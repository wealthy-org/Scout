"use client";

import React from "react";
import {
  IconBolt,
  IconDiamond,
  IconUsers,
  IconGraduation,
  IconRepeat,
} from "@/components/icons/Vectors";

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

  const isToxicityHigh = repeatDeployerPct > 50;
  const isToxicityMed = repeatDeployerPct > 25;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 font-sans select-none">
      <div className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[112px] shadow-[0_8px_20px_-4px_rgba(4,47,46,0.5)] hover:-translate-y-0.5 hover:border-[#99F6E4]/50 transition-all group backdrop-blur-md">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Launches (10m)</span>
          <div className="w-5 h-5 rounded-md bg-[#99F6E4]/15 border border-[#99F6E4]/30 flex items-center justify-center text-[#99F6E4]">
            <IconBolt size={12} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#99F6E4] drop-shadow-sm font-mono">
            {totalLaunches10m.toLocaleString()}
          </div>
          <div className="flex items-end gap-0.5 h-3.5 opacity-75">
            <div className="w-1 h-1.5 bg-[#99F6E4]/40 rounded-full" />
            <div className="w-1 h-2.5 bg-[#99F6E4]/70 rounded-full" />
            <div className="w-1 h-3.5 bg-[#99F6E4] rounded-full" />
          </div>
        </div>
        <div className="text-[10px] text-[#A7F3D0]/70 font-mono flex items-center justify-between">
          <span>Velocity</span>
          <span className="text-[#99F6E4] font-semibold">Active Surge</span>
        </div>
      </div>

      <div className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[112px] shadow-[0_8px_20px_-4px_rgba(4,47,46,0.5)] hover:-translate-y-0.5 hover:border-[#FFD166]/50 transition-all group backdrop-blur-md">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Total Volume</span>
          <div className="w-5 h-5 rounded-md bg-[#FFD166]/15 border border-[#FFD166]/30 flex items-center justify-center text-[#FFD166]">
            <IconDiamond size={12} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#FFD166] drop-shadow-sm font-mono">
            {formatVolume(totalVolumeUsd)}
          </div>
        </div>
        <div className="text-[10px] text-[#A7F3D0]/70 font-mono flex items-center justify-between">
          <span>24h Liquidity</span>
          <span className="text-[#FFD166] font-semibold">Bonding Flow</span>
        </div>
      </div>

      <div className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[112px] shadow-[0_8px_20px_-4px_rgba(4,47,46,0.5)] hover:-translate-y-0.5 hover:border-[#C084FC]/50 transition-all group backdrop-blur-md">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Unique Wallets</span>
          <div className="w-5 h-5 rounded-md bg-[#C084FC]/15 border border-[#C084FC]/30 flex items-center justify-center text-[#C084FC]">
            <IconUsers size={12} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#C084FC] drop-shadow-sm font-mono">
            {uniqueWallets.toLocaleString()}
          </div>
        </div>
        <div className="text-[10px] text-[#A7F3D0]/70 font-mono flex items-center justify-between">
          <span>Traders</span>
          <span className="text-[#C084FC] font-semibold">Verified</span>
        </div>
      </div>

      <div className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[112px] shadow-[0_8px_20px_-4px_rgba(4,47,46,0.5)] hover:-translate-y-0.5 hover:border-[#99F6E4]/50 transition-all group backdrop-blur-md">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Graduated (24h)</span>
          <div className="w-5 h-5 rounded-md bg-[#99F6E4]/15 border border-[#99F6E4]/30 flex items-center justify-center text-[#99F6E4]">
            <IconGraduation size={12} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#99F6E4] drop-shadow-sm font-mono">
            {graduatedCount.toLocaleString()}
          </div>
          <span className="text-[10px] font-bold text-[#FFD166] bg-[#042F2E] px-1.5 py-0.5 rounded border border-[#042F2E]">
            100% DEX
          </span>
        </div>
        <div className="text-[10px] text-[#A7F3D0]/70 font-mono flex items-center justify-between">
          <span>Swept Curve</span>
          <span className="text-[#99F6E4] font-semibold">DEX Ready</span>
        </div>
      </div>

      <div className="bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[112px] shadow-[0_8px_20px_-4px_rgba(4,47,46,0.5)] hover:-translate-y-0.5 transition-all group backdrop-blur-md col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Repeat Deployers</span>
          <div className="w-5 h-5 rounded-md bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B]">
            <IconRepeat size={12} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div
            className={`text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm font-mono ${
              isToxicityHigh
                ? "text-[#FF6B6B]"
                : isToxicityMed
                ? "text-[#FFD166]"
                : "text-[#99F6E4]"
            }`}
          >
            {`${repeatDeployerPct.toFixed(1)}%`}
          </div>
        </div>
        <div className="text-[10px] text-[#A7F3D0]/70 font-mono flex items-center justify-between">
          <span>Toxicity Index</span>
          <span
            className={`font-semibold ${
              isToxicityHigh
                ? "text-[#FF6B6B]"
                : isToxicityMed
                ? "text-[#FFD166]"
                : "text-[#99F6E4]"
            }`}
          >
            {isToxicityHigh ? "High Alert" : isToxicityMed ? "Elevated" : "Nominal"}
          </span>
        </div>
      </div>
    </div>
  );
}
