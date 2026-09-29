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
    <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg font-sans select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-5 sm:gap-x-7">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#A7F3D0]/70">
            Market Cap
          </span>
          <span className="mt-1 text-lg sm:text-xl font-mono font-bold tracking-tight text-[#FFFDF7]">
            {formatCurrency(marketCapUsd)}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#A7F3D0]/70">
            All-Time High (ATH)
          </span>
          <span className="mt-1 text-lg sm:text-xl font-mono font-bold tracking-tight text-[#FFFDF7]">
            {formatCurrency(athUsd)}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#A7F3D0]/70">
            24h Volume
          </span>
          <span className="mt-1 text-lg sm:text-xl font-mono font-bold tracking-tight text-[#FFFDF7]">
            {formatCurrency(volume24hUsd)}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#A7F3D0]/70">
              Curve Progress
            </span>
            <span className="text-[10px] font-mono font-bold uppercase text-[#99F6E4]/80">
              {isCompleted ? "Graduated" : "Bonding"}
            </span>
          </div>
          <div className="mt-1 flex flex-col gap-1.5">
            <span className="text-lg sm:text-xl font-mono font-bold tracking-tight text-[#99F6E4]">
              {curveProgressPct !== null && curveProgressPct !== undefined
                ? `${curveProgressPct.toFixed(1)}%`
                : "N/A"}
            </span>
            <div className="h-1.5 w-full rounded-full bg-[#042F2E] overflow-hidden">
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

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#A7F3D0]/70">
            Total Trades
          </span>
          <span className="mt-1 text-lg sm:text-xl font-mono font-bold tracking-tight text-[#FFFDF7]">
            {formatNumber(tradeCount)}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#A7F3D0]/70">
            Unique Wallets
          </span>
          <span className="mt-1 text-lg sm:text-xl font-mono font-bold tracking-tight text-[#FFFDF7]">
            {formatNumber(uniqueWallets)}
          </span>
        </div>
      </div>
    </div>
  );
}
