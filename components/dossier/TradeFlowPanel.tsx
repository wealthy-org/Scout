import React from "react";

export interface TradeFlowData {
  buyVolume: number;
  sellVolume: number;
  buyCount: number;
  sellCount: number;
  quoteAsset?: "USDG" | "cbBTC" | "ETH" | string;
}

export interface TradeFlowPanelProps {
  data?: TradeFlowData;
}

export function TradeFlowPanel({ data }: TradeFlowPanelProps) {
  if (!data) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs text-slate-500">
        No trade flow data available
      </div>
    );
  }

  const {
    buyVolume = 0,
    sellVolume = 0,
    buyCount = 0,
    sellCount = 0,
    quoteAsset = "USDG",
  } = data;

  const netFlow = buyVolume - sellVolume;
  const isNetPositive = netFlow >= 0;
  const totalTrades = buyCount + sellCount;
  const buyPct = totalTrades > 0 ? (buyCount / totalTrades) * 100 : 50;
  const sellPct = totalTrades > 0 ? (sellCount / totalTrades) * 100 : 50;

  const formattedBuyVol = `$${Math.round(buyVolume).toLocaleString()}`;
  const formattedSellVol = `$${Math.round(sellVolume).toLocaleString()}`;
  const formattedNetFlow = `${isNetPositive ? "+" : "-"}$${Math.abs(
    Math.round(netFlow)
  ).toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl md:grid-cols-2 font-sans">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Flow Section
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Quote: {quoteAsset}
          </span>
        </div>

        <div className="mt-3.5 grid grid-cols-3 gap-2 font-sans">
          <div className="rounded-xl border border-emerald-500/20 bg-slate-900/80 p-3">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Total Bought</span>
            <div className="mt-1 text-sm font-extrabold text-emerald-400">
              {formattedBuyVol}
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-slate-900/80 p-3">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Total Sold</span>
            <div className="mt-1 text-sm font-extrabold text-rose-400">
              {formattedSellVol}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Net Flow</span>
            <div
              className={`mt-1 text-sm font-extrabold ${
                isNetPositive
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {formattedNetFlow}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Order Pressure
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {totalTrades.toLocaleString()} Total Orders
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400">
              {`${buyCount.toLocaleString()} Buys (${buyPct.toFixed(1)}%)`}
            </span>
            <span className="font-bold text-rose-400">
              {`${sellCount.toLocaleString()} Sells (${sellPct.toFixed(1)}%)`}
            </span>
          </div>

          <div className="mt-2.5 flex h-3 w-full overflow-hidden rounded-full bg-slate-850">
            <div
              className="bg-emerald-400 shadow-[0_0_8px_rgba(0,229,153,0.4)] transition-all duration-300"
              style={{ width: `${buyPct}%` }}
            />
            <div
              className="bg-rose-500 shadow-[0_0_8px_rgba(255,46,77,0.4)] transition-all duration-300"
              style={{ width: `${sellPct}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[11px] text-slate-500">
            <span>Buying Pressure</span>
            <span>Selling Pressure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
