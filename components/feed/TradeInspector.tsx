"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export interface TradeItem {
  id: string;
  type: "buy" | "sell";
  amountEth: number;
  amountToken: number;
  trader: string;
  timestamp: string | number | Date;
  txHash?: string;
}

export interface InspectorToken {
  contractAddress: string;
  symbol: string;
  name?: string;
  marketCapUsd?: number;
  priceUsd?: number;
  deployerAddress?: string;
  score?: number;
  band?: "green" | "yellow" | "red" | string;
  label?: string;
  progressPct?: number;
}

export interface TradeInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  token?: InspectorToken | null;
  sparkline?: number[];
  trades?: TradeItem[];
}

function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr || "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatCurrency(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
  return `$${val.toLocaleString()}`;
}

function formatPrice(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "$0.00";
  if (val < 0.00001) return `$${val.toExponential(2)}`;
  if (val < 1) return `$${val.toFixed(6)}`;
  return `$${val.toFixed(2)}`;
}

function renderSparklineSvg(points: number[]): string {
  if (!points || points.length < 2) {
    return "M 0 20 L 100 20";
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 40;

  return points
    .map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 8) - 4;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function TradeInspector({
  isOpen,
  onClose,
  token,
  sparkline = [10, 15, 12, 18, 20, 25, 22, 28, 30],
  trades = [],
}: TradeInspectorProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !token) {
    return null;
  }

  const recentTrades = trades.slice(0, 10);
  const svgPath = renderSparklineSvg(sparkline);

  const bandColor =
    token.band === "green"
      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
      : token.band === "red"
      ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
      : "bg-amber-500/10 border-amber-500/40 text-amber-400";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Trade Inspector"
      className="fixed inset-0 z-50 flex justify-end font-sans"
    >
      <div
        data-testid="trade-inspector-overlay"
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div
        data-testid="trade-inspector-panel"
        className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-200"
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {`$${token.symbol}`}
              </h2>
              {token.band && (
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${bandColor}`}
                >
                  {`${token.score ?? 50} Score`}
                </span>
              )}
            </div>
            {token.name && (
              <p className="text-xs text-slate-400 mt-0.5 font-normal">{token.name}</p>
            )}
          </div>

          <button
            type="button"
            data-testid="close-inspector-btn"
            onClick={onClose}
            aria-label="Close Inspector"
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Market Cap</div>
              <div className="text-base font-extrabold text-white">
                {formatCurrency(token.marketCapUsd)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Token Price</div>
              <div className="text-base font-extrabold text-cyan-400 font-mono">
                {formatPrice(token.priceUsd)}
              </div>
            </div>
            {token.deployerAddress && (
              <div className="col-span-2 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Deployer:</span>
                <Link
                  href={`/deployer/${token.deployerAddress}`}
                  className="font-mono text-cyan-400 hover:underline"
                >
                  {truncateAddress(token.deployerAddress)}
                </Link>
              </div>
            )}
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Price Sparkline
              </span>
              <span className="text-[10px] text-cyan-400 font-medium">Recent Activity</span>
            </div>
            <div className="w-full h-16 flex items-center justify-center">
              <svg
                data-testid="sparkline-chart"
                viewBox="0 0 100 40"
                className="w-full h-full stroke-cyan-400 fill-none"
                preserveAspectRatio="none"
              >
                <path
                  d={svgPath}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Trades (Last 10)
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                {`${recentTrades.length} trades`}
              </span>
            </div>

            {recentTrades.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                No recent trades recorded for this launch.
              </div>
            ) : (
              <div className="space-y-2">
                {recentTrades.map((trade) => {
                  const isBuy = trade.type === "buy";
                  return (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-800/60 rounded-xl border border-slate-800/80 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isBuy
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {trade.type}
                        </span>
                        <span className="font-mono text-slate-300">
                          {truncateAddress(trade.trader)}
                        </span>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            isBuy ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {`${trade.amountEth.toFixed(4)} ETH`}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {`${trade.amountToken.toLocaleString()} $${token.symbol}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <Link
            href={`/d/${token.contractAddress}`}
            data-testid="open-dossier-btn"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <span>Open Full Dossier</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
