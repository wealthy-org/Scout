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
    <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E]/90 p-3.5 sm:p-4 font-sans select-none backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-2.5 mb-3">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]">
          Key Protocol Metrics
        </span>
        <span className="font-mono text-[10px] text-[#99F6E4]">
          {isCompleted ? "GRADUATED" : "BONDING"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
        <div className="flex flex-col min-w-0 p-2 rounded-xl bg-[#064E4A]/40 border border-[rgba(153,246,228,0.1)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
            Market Cap
          </span>
          <span className="mt-0.5 text-sm sm:text-base font-mono font-bold tracking-tight text-[#FFFDF7] truncate">
            {formatCurrency(marketCapUsd)}
          </span>
        </div>

        <div className="flex flex-col min-w-0 p-2 rounded-xl bg-[#064E4A]/40 border border-[rgba(153,246,228,0.1)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
            All-Time High (ATH)
          </span>
          <span className="mt-0.5 text-sm sm:text-base font-mono font-bold tracking-tight text-[#FFFDF7] truncate">
            {formatCurrency(athUsd)}
          </span>
        </div>

        <div className="flex flex-col min-w-0 p-2 rounded-xl bg-[#064E4A]/40 border border-[rgba(153,246,228,0.1)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
            24h Volume
          </span>
          <span className="mt-0.5 text-sm sm:text-base font-mono font-bold tracking-tight text-[#FFFDF7] truncate">
            {formatCurrency(volume24hUsd)}
          </span>
        </div>

        <div className="flex flex-col min-w-0 p-2 rounded-xl bg-[#064E4A]/40 border border-[rgba(153,246,228,0.1)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
            Curve Progress
          </span>
          <div className="mt-0.5 flex flex-col gap-1">
            <span className="text-sm sm:text-base font-mono font-bold tracking-tight text-[#99F6E4]">
              {curveProgressPct !== null && curveProgressPct !== undefined
                ? `${curveProgressPct.toFixed(1)}%`
                : "N/A"}
            </span>
            <div className="h-1.5 w-full rounded-full bg-[#042F2E] overflow-hidden border border-[rgba(153,246,228,0.15)]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-[#99F6E4]"
                    : "bg-gradient-to-r from-[#FFD166] to-[#99F6E4]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col min-w-0 p-2 rounded-xl bg-[#064E4A]/40 border border-[rgba(153,246,228,0.1)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
            Total Trades
          </span>
          <span className="mt-0.5 text-sm sm:text-base font-mono font-bold tracking-tight text-[#FFFDF7] truncate">
            {formatNumber(tradeCount)}
          </span>
        </div>

        <div className="flex flex-col min-w-0 p-2 rounded-xl bg-[#064E4A]/40 border border-[rgba(153,246,228,0.1)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
            Unique Wallets
          </span>
          <span className="mt-0.5 text-sm sm:text-base font-mono font-bold tracking-tight text-[#FFFDF7] truncate">
            {formatNumber(uniqueWallets)}
          </span>
        </div>
      </div>
    </div>
  );
}
