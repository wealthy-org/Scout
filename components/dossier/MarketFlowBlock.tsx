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
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-sm backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
          Market Cap
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-white tracking-tight">
          {formatCurrency(marketCapUsd)}
        </div>
      </div>

      <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-sm backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-fuchsia-400">
          All-Time High (ATH)
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-white tracking-tight">
          {formatCurrency(athUsd)}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Curve Progress
          </span>
          <span className="text-xs font-black text-emerald-400">
            {curveProgressPct !== null && curveProgressPct !== undefined
              ? `${curveProgressPct.toFixed(1)}%`
              : "N/A"}
          </span>
        </div>
        <div className="mt-2.5 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_8px_rgba(0,229,153,0.6)]"
                : "bg-gradient-to-r from-cyan-400 to-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-sm backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
          24h Volume
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-white tracking-tight">
          {formatCurrency(volume24hUsd)}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-sm backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Total Trades
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-white tracking-tight">
          {formatNumber(tradeCount)}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-sm backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Unique Wallets
        </span>
        <div className="mt-1 text-lg sm:text-xl font-black text-white tracking-tight">
          {formatNumber(uniqueWallets)}
        </div>
      </div>
    </div>
  );
}
