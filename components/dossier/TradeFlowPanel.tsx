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
      <div className="flex h-32 w-full items-center justify-center border border-border bg-surface p-4 font-mono text-xs text-ink-muted">
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
    <div className="grid grid-cols-1 gap-4 border border-border bg-surface p-4 shadow-sm md:grid-cols-2">
      <div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Flow Section
          </span>
          <span className="font-mono text-[10px] font-semibold text-ink-muted">
            Quote: {quoteAsset}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 font-mono">
          <div className="border border-border bg-background p-2.5">
            <span className="text-[10px] uppercase text-ink-muted">Total Bought</span>
            <div className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {formattedBuyVol}
            </div>
          </div>

          <div className="border border-border bg-background p-2.5">
            <span className="text-[10px] uppercase text-ink-muted">Total Sold</span>
            <div className="mt-1 text-xs font-bold text-red-600 dark:text-red-400">
              {formattedSellVol}
            </div>
          </div>

          <div className="border border-border bg-background p-2.5">
            <span className="text-[10px] uppercase text-ink-muted">Net Flow</span>
            <div
              className={`mt-1 text-xs font-bold ${
                isNetPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formattedNetFlow}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Order Pressure
          </span>
          <span className="font-mono text-[10px] text-ink-muted">
            {totalTrades.toLocaleString()} Total Orders
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {`${buyCount.toLocaleString()} Buys (${buyPct.toFixed(1)}%)`}
            </span>
            <span className="font-bold text-red-600 dark:text-red-400">
              {`${sellCount.toLocaleString()} Sells (${sellPct.toFixed(1)}%)`}
            </span>
          </div>

          <div className="mt-2 flex h-3 w-full overflow-hidden border border-border bg-background">
            <div
              className="bg-emerald-500 transition-all duration-300"
              style={{ width: `${buyPct}%` }}
            />
            <div
              className="bg-red-500 transition-all duration-300"
              style={{ width: `${sellPct}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-muted">
            <span>Buying Pressure</span>
            <span>Selling Pressure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
