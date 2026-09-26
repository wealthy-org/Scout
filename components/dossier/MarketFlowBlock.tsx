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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="border border-border bg-surface p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          Market Cap
        </span>
        <div className="mt-1 font-mono text-base font-bold text-ink">
          {formatCurrency(marketCapUsd)}
        </div>
      </div>

      <div className="border border-border bg-surface p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          All-Time High (ATH)
        </span>
        <div className="mt-1 font-mono text-base font-bold text-ink">
          {formatCurrency(athUsd)}
        </div>
      </div>

      <div className="border border-border bg-surface p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Curve Progress
          </span>
          <span className="font-mono text-xs font-bold text-ink">
            {curveProgressPct !== null && curveProgressPct !== undefined
              ? `${curveProgressPct.toFixed(1)}%`
              : "N/A"}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className={`h-full transition-all duration-300 ${
              isCompleted ? "bg-emerald-500" : "bg-cyan-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="border border-border bg-surface p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          24h Volume
        </span>
        <div className="mt-1 font-mono text-base font-bold text-ink">
          {formatCurrency(volume24hUsd)}
        </div>
      </div>

      <div className="border border-border bg-surface p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          Total Trades
        </span>
        <div className="mt-1 font-mono text-base font-bold text-ink">
          {formatNumber(tradeCount)}
        </div>
      </div>

      <div className="border border-border bg-surface p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          Unique Wallets
        </span>
        <div className="mt-1 font-mono text-base font-bold text-ink">
          {formatNumber(uniqueWallets)}
        </div>
      </div>
    </div>
  );
}
