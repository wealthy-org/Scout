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
        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Market Cap</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#99F6E4] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(marketCapUsd)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>All-Time High (ATH)</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(athUsd)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Curve Progress</span>
            <span className="text-[10px] font-extrabold text-[#99F6E4]">
              {isCompleted ? "Graduated" : `${progress.toFixed(0)}%`}
            </span>
          </div>
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="text-base sm:text-lg font-black tracking-tight text-[#99F6E4]">
              {curveProgressPct !== null && curveProgressPct !== undefined
                ? `${curveProgressPct.toFixed(1)}%`
                : "N/A"}
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

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>24h Volume</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD166] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(volume24hUsd)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Total Trades</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#99F6E4] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7]">
            {formatNumber(tradeCount)}
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.12)] bg-[#042F2E]/60 p-2.5 sm:p-3 hover:border-[rgba(153,246,228,0.3)] hover:bg-[#042F2E]/90 transition-all">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Unique Wallets</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#A7F3D0] opacity-60 group-hover:opacity-100" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-black tracking-tight text-[#FFFDF7]">
            {formatNumber(uniqueWallets)}
          </div>
        </div>
      </div>
    </div>
  );
}
