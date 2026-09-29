import React from "react";

export interface MarketStatsProps {
  marketCapUsd?: number | null;
  athUsd?: number | null;
  curveProgressPct?: number | null;
  volume24hUsd?: number | null;
  tradeCount?: number | null;
  uniqueWallets?: number | null;
}

export function formatCurrency(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return "N/A";
  return new Intl.NumberFormat("en-US").format(val);
}

export function MarketFlowBlock({
  marketCapUsd,
  athUsd,
  curveProgressPct,
  volume24hUsd,
  tradeCount,
  uniqueWallets,
}: MarketStatsProps) {
  const progress = Math.min(Math.max(curveProgressPct ?? 0, 0), 100);
  const isCompleted = (curveProgressPct ?? 0) >= 100;

  return (
    <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] shadow-[0_8px_24px_-6px_rgba(4,47,46,0.5)] backdrop-blur-xl font-sans select-none overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-[rgba(153,246,228,0.15)]">
        <div className="flex flex-col justify-center px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-[#042F2E]/40 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/75">
            Market Cap
          </span>
          <span className="mt-1 text-lg sm:text-xl font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(marketCapUsd)}
          </span>
        </div>

        <div className="flex flex-col justify-center px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-[#042F2E]/40 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/75">
            All-Time High (ATH)
          </span>
          <span className="mt-1 text-lg sm:text-xl font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(athUsd)}
          </span>
        </div>

        <div className="flex flex-col justify-center px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-[#042F2E]/40 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/75">
            Curve Progress
          </span>
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#99F6E4]">
                {curveProgressPct !== null && curveProgressPct !== undefined
                  ? `${curveProgressPct.toFixed(1)}%`
                  : "N/A"}
              </span>
              <span className="text-[10px] font-bold uppercase text-[#A7F3D0]/70">
                {isCompleted ? "Graduated" : "Bonding"}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#042F2E] overflow-hidden border border-[rgba(153,246,228,0.2)]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-[#99F6E4] shadow-[0_0_8px_rgba(153,246,228,0.7)]"
                    : "bg-gradient-to-r from-[#FFD166] to-[#99F6E4]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-[#042F2E]/40 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/75">
            24h Volume
          </span>
          <span className="mt-1 text-lg sm:text-xl font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(volume24hUsd)}
          </span>
        </div>

        <div className="flex flex-col justify-center px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-[#042F2E]/40 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/75">
            Total Trades
          </span>
          <span className="mt-1 text-lg sm:text-xl font-black tracking-tight text-[#FFFDF7]">
            {formatNumber(tradeCount)}
          </span>
        </div>

        <div className="flex flex-col justify-center px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-[#042F2E]/40 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/75">
            Unique Wallets
          </span>
          <span className="mt-1 text-lg sm:text-xl font-black tracking-tight text-[#FFFDF7]">
            {formatNumber(uniqueWallets)}
          </span>
        </div>
      </div>
    </div>
  );
}
