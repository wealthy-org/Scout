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
    <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A] p-2.5 sm:p-3 shadow-[0_8px_24px_-6px_rgba(4,47,46,0.5)] backdrop-blur-xl font-sans select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all min-w-0">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80 min-w-0">
            <span className="truncate">Market Cap</span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#99F6E4] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7] truncate">
            {formatCurrency(marketCapUsd)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all min-w-0">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80 min-w-0">
            <span className="truncate">All-Time High (ATH)</span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C084FC] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7] truncate">
            {formatCurrency(athUsd)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all min-w-0">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80 min-w-0">
            <span className="truncate">Curve Progress</span>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                isCompleted ? "bg-[#99F6E4] animate-pulse" : "bg-[#FFD166]"
              }`}
            />
          </div>
          <div className="mt-1 flex flex-col gap-1.5 min-w-0">
            <div className="flex items-baseline justify-between gap-1">
              <div className="text-base sm:text-lg font-black tracking-tight text-[#99F6E4] truncate">
                {curveProgressPct !== null && curveProgressPct !== undefined
                  ? `${curveProgressPct.toFixed(1)}%`
                  : "N/A"}
              </div>
              {isCompleted && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#99F6E4]/80 shrink-0">
                  Graduated
                </span>
              )}
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#064E4A] overflow-hidden border border-[rgba(153,246,228,0.15)]">
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

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all min-w-0">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80 min-w-0">
            <span className="truncate">24h Volume</span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD166] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7] truncate">
            {formatCurrency(volume24hUsd)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all min-w-0">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80 min-w-0">
            <span className="truncate">Total Trades</span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#99F6E4] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7] truncate">
            {formatNumber(tradeCount)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all min-w-0">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80 min-w-0">
            <span className="truncate">Unique Wallets</span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#A7F3D0] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7] truncate">
            {formatNumber(uniqueWallets)}
          </div>
        </div>
      </div>
    </div>
  );
}
