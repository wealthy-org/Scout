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
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6 font-sans select-none">
      <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#99F6E4]">
          Market Cap
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
          {formatCurrency(marketCapUsd)}
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C084FC]">
          All-Time High (ATH)
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
          {formatCurrency(athUsd)}
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#99F6E4]">
            Curve Progress
          </span>
          <span className="text-xs font-black text-[#99F6E4]">
            {curveProgressPct !== null && curveProgressPct !== undefined
              ? `${curveProgressPct.toFixed(1)}%`
              : "N/A"}
          </span>
        </div>
        <div className="mt-2.5 h-2 w-full rounded-full bg-[#042F2E] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? "bg-[#99F6E4] shadow-[0_0_8px_rgba(153,246,228,0.6)]"
                : "bg-gradient-to-r from-[#FFD166] to-[#FF9F43]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FFD166]">
          24h Volume
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
          {formatCurrency(volume24hUsd)}
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A7F3D0]">
          Total Trades
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
          {formatNumber(tradeCount)}
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A7F3D0]">
          Unique Wallets
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
          {formatNumber(uniqueWallets)}
        </div>
      </div>
    </div>
  );
}
