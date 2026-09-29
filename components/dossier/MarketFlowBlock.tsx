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
    <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-5 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl font-sans select-none">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.15)] bg-[#042F2E]/70 p-3.5 sm:p-4 hover:border-[#99F6E4]/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Market Cap</span>
            <span className="h-2 w-2 rounded-full bg-[#99F6E4]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(marketCapUsd)}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.15)] bg-[#042F2E]/70 p-3.5 sm:p-4 hover:border-[#99F6E4]/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>All-Time High (ATH)</span>
            <span className="h-2 w-2 rounded-full bg-[#C084FC]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(athUsd)}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.15)] bg-[#042F2E]/70 p-3.5 sm:p-4 hover:border-[#99F6E4]/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>24h Volume</span>
            <span className="h-2 w-2 rounded-full bg-[#FFD166]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF7]">
            {formatCurrency(volume24hUsd)}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.15)] bg-[#042F2E]/70 p-3.5 sm:p-4 hover:border-[#99F6E4]/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Curve Progress</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                isCompleted
                  ? "bg-[#99F6E4]/20 text-[#99F6E4] border-[#99F6E4]/40"
                  : "bg-[#FFD166]/20 text-[#FFD166] border-[#FFD166]/40"
              }`}
            >
              {isCompleted ? "Graduated" : "Bonding"}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-[#99F6E4]">
              {curveProgressPct !== null && curveProgressPct !== undefined
                ? `${curveProgressPct.toFixed(1)}%`
                : "N/A"}
            </div>
            <div className="h-2 w-full rounded-full bg-[#042F2E] overflow-hidden border border-[rgba(153,246,228,0.2)]">
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

        <div className="flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.15)] bg-[#042F2E]/70 p-3.5 sm:p-4 hover:border-[#99F6E4]/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Total Trades</span>
            <span className="h-2 w-2 rounded-full bg-[#99F6E4]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF7]">
            {formatNumber(tradeCount)}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[rgba(153,246,228,0.15)] bg-[#042F2E]/70 p-3.5 sm:p-4 hover:border-[#99F6E4]/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A7F3D0]/80">
            <span>Unique Wallets</span>
            <span className="h-2 w-2 rounded-full bg-[#A7F3D0]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF7]">
            {formatNumber(uniqueWallets)}
          </div>
        </div>
      </div>
    </div>
  );
}
