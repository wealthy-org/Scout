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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 font-sans select-none">
      <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[116px] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all group cursor-default">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Launches (10m)</span>
          <div className="w-6 h-6 rounded-lg bg-[#99F6E4]/20 border border-[#042F2E] flex items-center justify-center text-[#99F6E4] shadow-[1.5px_1.5px_0px_#042F2E]">
            <IconBolt size={13} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#99F6E4] drop-shadow-sm font-mono">
            {totalLaunches10m.toLocaleString()}
          </div>
          <div className="flex items-end gap-1 h-3.5 opacity-80">
            <div className="w-1 h-1.5 bg-[#99F6E4]/50 rounded-full" />
            <div className="w-1 h-2.5 bg-[#99F6E4]/80 rounded-full" />
            <div className="w-1 h-3.5 bg-[#99F6E4] rounded-full" />
          </div>
        </div>
        <div className="text-[10px] text-[#A7F3D0] font-mono flex items-center justify-between">
          <span>Velocity</span>
          <span className="text-[#99F6E4] font-bold uppercase">Active Surge</span>
        </div>
      </div>

      <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[116px] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all group cursor-default">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Total Volume</span>
          <div className="w-6 h-6 rounded-lg bg-[#FFD166]/20 border border-[#042F2E] flex items-center justify-center text-[#FFD166] shadow-[1.5px_1.5px_0px_#042F2E]">
            <IconDiamond size={13} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#FFD166] drop-shadow-sm font-mono">
            {formatVolume(totalVolumeUsd)}
          </div>
        </div>
        <div className="text-[10px] text-[#A7F3D0] font-mono flex items-center justify-between">
          <span>24h Liquidity</span>
          <span className="text-[#FFD166] font-bold uppercase">Bonding Flow</span>
        </div>
      </div>

      <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[116px] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all group cursor-default">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Unique Wallets</span>
          <div className="w-6 h-6 rounded-lg bg-[#C084FC]/20 border border-[#042F2E] flex items-center justify-center text-[#C084FC] shadow-[1.5px_1.5px_0px_#042F2E]">
            <IconUsers size={13} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#C084FC] drop-shadow-sm font-mono">
            {uniqueWallets.toLocaleString()}
          </div>
        </div>
        <div className="text-[10px] text-[#A7F3D0] font-mono flex items-center justify-between">
          <span>Traders</span>
          <span className="text-[#C084FC] font-bold uppercase">Verified</span>
        </div>
      </div>

      <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[116px] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all group cursor-default">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Graduated (24h)</span>
          <div className="w-6 h-6 rounded-lg bg-[#99F6E4]/20 border border-[#042F2E] flex items-center justify-center text-[#99F6E4] shadow-[1.5px_1.5px_0px_#042F2E]">
            <IconGraduation size={13} />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#99F6E4] drop-shadow-sm font-mono">
            {graduatedCount.toLocaleString()}
          </div>
          <span className="text-[10px] font-black text-[#042F2E] bg-[#FFD166] px-2 py-0.5 rounded-full border border-[#042F2E] shadow-[1px_1px_0px_#042F2E]">
            100% DEX
          </span>
        </div>
        <div className="text-[10px] text-[#A7F3D0] font-mono flex items-center justify-between">
          <span>Swept Curve</span>
          <span className="text-[#99F6E4] font-bold uppercase">DEX Ready</span>
        </div>
      </div>

      <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[116px] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all group cursor-default col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider">
          <span>Repeat Deployers</span>
          <div className="w-6 h-6 rounded-lg bg-[#FF6B6B]/20 border border-[#042F2E] flex items-center justify-center text-[#FF6B6B] shadow-[1.5px_1.5px_0px_#042F2E]">
            <IconRepeat size={13} />
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
        <div className="text-[10px] text-[#A7F3D0] font-mono flex items-center justify-between">
          <span>Toxicity Index</span>
          <span
            className={`font-bold uppercase ${
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
