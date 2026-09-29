"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons/Vectors";

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
  marketCapUsd?: number | null;
  priceUsd?: number | null;
  deployerAddress?: string;
  score?: number | null;
  band?: "green" | "yellow" | "red" | string | null;
  label?: string | null;
  progressPct?: number | null;
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

function formatCurrency(val?: number | null): string {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
  return `$${val.toLocaleString()}`;
}

function formatPrice(val?: number | null): string {
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

  const bandBadge =
    token.band === "green"
      ? "bg-[#99F6E4] border-2 border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
      : token.band === "red"
      ? "bg-[#FF6B6B] border-2 border-[#042F2E] text-[#FFFDF7] shadow-[2px_2px_0px_#042F2E]"
      : "bg-[#FFD166] border-2 border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]";

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
        className="fixed inset-0 bg-[#042F2E]/80 backdrop-blur-sm transition-opacity"
      />

      <div
        data-testid="trade-inspector-panel"
        className="relative w-full max-w-md h-full bg-[#064E4A] border-l-2 border-[#042F2E] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-200"
      >
        <div className="p-5 border-b-2 border-[#042F2E] flex items-center justify-between bg-[#042F2E]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-[#FFFDF7] tracking-tight">
                {`$${token.symbol}`}
              </h2>
              {token.band && (
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${bandBadge}`}
                >
                  {`${token.score ?? 50} Score`}
                </span>
              )}
            </div>
            {token.name && (
              <p className="text-xs text-[#A7F3D0] mt-0.5 font-normal">{token.name}</p>
            )}
          </div>

          <button
            type="button"
            data-testid="close-inspector-btn"
            onClick={onClose}
            aria-label="Close Inspector"
            className="text-[#A7F3D0] hover:text-[#FFFDF7] p-2 rounded-xl bg-[#064E4A] hover:bg-[#083835] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] transition-all cursor-pointer"
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
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3 bg-[#042F2E] p-4 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E]">
            <div>
              <div className="text-[11px] text-[#A7F3D0] font-bold uppercase tracking-wider">Market Cap</div>
              <div className="text-base font-black text-[#FFFDF7]">
                {formatCurrency(token.marketCapUsd)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#A7F3D0] font-bold uppercase tracking-wider">Token Price</div>
              <div className="text-base font-black text-[#99F6E4] font-mono">
                {formatPrice(token.priceUsd)}
              </div>
            </div>
            {token.deployerAddress && (
              <div className="col-span-2 pt-3 border-t-2 border-[#042F2E]/80 flex items-center justify-between text-xs">
                <span className="text-[#A7F3D0] font-bold">Deployer:</span>
                <Link
                  href={`/deployer/${token.deployerAddress}`}
                  className="font-mono font-bold text-[#99F6E4] hover:text-[#FFD166] hover:underline"
                >
                  {truncateAddress(token.deployerAddress)}
                </Link>
              </div>
            )}
          </div>

          <div className="bg-[#042F2E] p-4 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#FFFDF7]">
                Price Sparkline
              </span>
              <span className="text-[10px] text-[#99F6E4] font-bold uppercase tracking-wider">Recent Activity</span>
            </div>
            <div className="w-full h-16 flex items-center justify-center">
              <svg
                data-testid="sparkline-chart"
                viewBox="0 0 100 40"
                className="w-full h-full stroke-[#99F6E4] fill-none"
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
              <h3 className="text-xs font-black uppercase tracking-wider text-[#A7F3D0]">
                Recent Trades (Last 10)
              </h3>
              <span className="text-[10px] text-[#A7F3D0] font-bold font-mono">
                {`${recentTrades.length} trades`}
              </span>
            </div>

            {recentTrades.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#A7F3D0]/70 bg-[#042F2E] rounded-2xl border-2 border-[#042F2E] font-bold">
                No recent trades recorded for this launch.
              </div>
            ) : (
              <div className="space-y-2">
                {recentTrades.map((trade) => {
                  const isBuy = trade.type === "buy";
                  return (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between p-3 bg-[#042F2E] hover:bg-[#083835] rounded-2xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] text-xs transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase border-2 border-[#042F2E] shadow-[1px_1px_0px_#042F2E] ${
                            isBuy
                              ? "bg-[#99F6E4] text-[#042F2E]"
                              : "bg-[#FF6B6B] text-[#FFFDF7]"
                          }`}
                        >
                          {trade.type}
                        </span>
                        <span className="font-mono font-bold text-[#FFFDF7]">
                          {truncateAddress(trade.trader)}
                        </span>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-black font-mono ${
                            isBuy ? "text-[#99F6E4]" : "text-[#FF6B6B]"
                          }`}
                        >
                          {`${trade.amountEth.toFixed(4)} ETH`}
                        </div>
                        <div className="text-[10px] text-[#A7F3D0]/80 font-mono font-semibold">
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

        <div className="p-4 border-t-2 border-[#042F2E] bg-[#042F2E]">
          <Link
            href={`/d/${token.contractAddress}`}
            data-testid="open-dossier-btn"
            className="w-full py-3 px-4 rounded-xl pop-btn-yellow font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_#042F2E]"
          >
            <span>Open Full Dossier</span>
            <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
