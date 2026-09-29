"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconArrowRight,
} from "@/components/icons/Vectors";
import type { DeployerScoreSignals } from "@/types/score";

export interface DeployerLaunchItem {
  tokenAddress: string;
  block: number;
  phase: string;
  symbol?: string;
  name?: string;
}

export interface DeployerProfileProps {
  address: string;
  score: number;
  label: "fresh" | "repeat" | "serial" | string;
  band: "green" | "yellow" | "red" | string;
  signals: DeployerScoreSignals;
  launches: DeployerLaunchItem[];
  isAuthenticated: boolean;
  isInWatchlist?: boolean;
  userAddress?: string;
}

export function DeployerProfileView({
  address,
  score,
  label,
  band,
  signals,
  launches,
  isAuthenticated,
  isInWatchlist = false,
  userAddress,
}: DeployerProfileProps) {
  const [copied, setCopied] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!isAuthenticated) return;
    setWatchlistLoading(true);

    try {
      if (inWatchlist) {
        const res = await fetch(`/api/watchlist/${address}`, { method: "DELETE" });
        if (res.ok) setInWatchlist(false);
      } else {
        const res = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deployer_address: address }),
        });
        if (res.ok) setInWatchlist(true);
      }
    } catch {
    } finally {
      setWatchlistLoading(false);
    }
  };

  const activeBars = Math.round((Math.max(0, Math.min(100, score)) / 100) * 10);

  const bandBadge =
    band === "green"
      ? "bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
      : band === "red"
      ? "bg-[#FF6B6B] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
      : "bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]";

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="flex-1 min-h-0 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-col overflow-hidden relative z-10">
        <div className="w-full flex-1 min-h-0 flex flex-col rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] overflow-hidden shadow-[0_15px_35px_rgba(4,47,46,0.65)] backdrop-blur-2xl">
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#064E4A] via-[#042F2E] to-[#042F2E] border-b border-[rgba(153,246,228,0.2)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-8">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#99F6E4] uppercase tracking-widest bg-[#0D746E]/80 px-2.5 py-0.5 rounded-md border border-[rgba(153,246,228,0.3)] shadow-xs">
                    Deployer Dossier // On-Chain Reputation Audit
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                  <h1 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight break-all text-[#FFFDF7] font-mono select-all">
                    {address}
                  </h1>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-[#042F2E] border border-[rgba(153,246,228,0.35)] rounded-lg text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-all shrink-0 shadow-xs"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="pt-0.5 flex items-center gap-2.5">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleToggleWatchlist}
                      disabled={watchlistLoading}
                      className={`px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#042F2E] transition-all disabled:opacity-50 ${
                        inWatchlist
                          ? "bg-[#042F2E] text-[#99F6E4] border border-[#99F6E4]/40"
                          : "pop-btn-yellow"
                      }`}
                    >
                      {watchlistLoading ? (
                        "Updating..."
                      ) : inWatchlist ? (
                        <span className="inline-flex items-center gap-1.5">
                          <IconCheck size={14} />
                          <span>In Watchlist</span>
                        </span>
                      ) : (
                        "+ Add to Watchlist"
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/"
                      className="px-4 py-1.5 rounded-lg bg-[#042F2E] border border-[rgba(153,246,228,0.3)] text-xs font-bold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-colors shadow-xs"
                    >
                      Connect to Watch
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 lg:border-l border-[rgba(153,246,228,0.2)] pt-3 lg:pt-0 lg:pl-8 shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono text-[#FFFDF7] tracking-tight">
                      {score}
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-[#A7F3D0]">/ 100</span>
                  </div>

                  <span className={`text-[11px] sm:text-xs font-black uppercase px-3 py-1 rounded-md ${bandBadge}`}>
                    {label.toUpperCase()} • {band.toUpperCase()} BAND
                  </span>
                </div>

                <div className="space-y-1 w-full sm:w-auto">
                  <div className="flex gap-1.5 h-2.5 w-full sm:w-60">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-xs border border-[rgba(153,246,228,0.3)] ${
                          i < activeBars
                            ? band === "green"
                              ? "bg-[#99F6E4] shadow-[0_0_8px_rgba(153,246,228,0.7)]"
                              : band === "red"
                              ? "bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.7)]"
                              : "bg-[#FFD166] shadow-[0_0_8px_rgba(255,209,102,0.7)]"
                            : "bg-[#032221]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-[#A7F3D0]/80 font-mono text-right">
                    Bayesian Laplace velocity
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-2 bg-[#032221] border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6] shadow-[0_0_6px_#14B8A6]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                5 Core Score Signals
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#A7F3D0]/70 font-semibold">
              PRD ALGORITHM SPEC
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(153,246,228,0.15)] bg-[#042F2E] border-b border-[rgba(153,246,228,0.2)] shrink-0">
            <div className="p-2.5 sm:p-3 lg:p-3.5 flex flex-col justify-between min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#A7F3D0]/80">
                Graduation Rate
              </span>
              <span className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[#FFFDF7] mt-1">
                {`${(signals.grad_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#A7F3D0]/60 mt-0.5">Laplace smoothed</span>
            </div>

            <div className="p-2.5 sm:p-3 lg:p-3.5 flex flex-col justify-between min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#FF6B6B]/90">
                DOA Rate
              </span>
              <span className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[#FF6B6B] mt-1">
                {`${(signals.doa_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#A7F3D0]/60 mt-0.5">&lt;10m activity</span>
            </div>

            <div className="p-2.5 sm:p-3 lg:p-3.5 flex flex-col justify-between min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#FFD166]/90">
                Burst Rate
              </span>
              <span className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[#FFD166] mt-1">
                {`${(signals.burst_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#A7F3D0]/60 mt-0.5">&lt;30m cluster</span>
            </div>

            <div className="p-2.5 sm:p-3 lg:p-3.5 flex flex-col justify-between min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#A7F3D0]/80">
                Total Launches
              </span>
              <span className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[#FFFDF7] mt-1">
                {signals.total_launches}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#A7F3D0]/60 mt-0.5">Genesis tokens</span>
            </div>

            <div className="p-2.5 sm:p-3 lg:p-3.5 flex flex-col justify-between min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#99F6E4]/90">
                Graduated Count
              </span>
              <span className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[#99F6E4] mt-1">
                {signals.graduated_count}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#A7F3D0]/60 mt-0.5">Bonding completed</span>
            </div>

            <div className="p-2.5 sm:p-3 lg:p-3.5 flex flex-col justify-between min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#A7F3D0]/80">
                Penalty Multiplier
              </span>
              <span className="text-base sm:text-lg lg:text-xl font-black font-mono text-[#FFFDF7] mt-1">
                {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                  ? "SERIAL CAP"
                  : "NORMAL"}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#A7F3D0]/60 mt-0.5">Rugger status</span>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-1.5 bg-[#032221]/80 border-b border-[rgba(153,246,228,0.15)] shrink-0">
            <button
              type="button"
              onClick={() => setWhyOpen(!whyOpen)}
              className="flex items-center gap-1.5 font-mono font-bold text-[11px] sm:text-xs uppercase text-[#A7F3D0] hover:text-[#FFFDF7] transition-colors"
            >
              <span>Why this score?</span>
              {whyOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            </button>

            {whyOpen && (
              <div className="mt-2 pt-2 border-t border-[rgba(153,246,228,0.15)] text-[11px] sm:text-xs text-[#A7F3D0] space-y-1 leading-relaxed font-normal">
                <p>
                  <strong className="text-[#FFFDF7]">1. Bayesian Prior:</strong> Laplace smoothing{" "}
                  <code className="text-[#99F6E4] font-mono bg-[#032221] px-1.5 py-0.5 rounded border border-[rgba(153,246,228,0.2)] text-[10px]">(graduated + 1) / (total + 2)</code> prevents inflated scores on low launch volumes.
                </p>
                <p>
                  <strong className="text-[#FFFDF7]">2. Serial Penalty Cap:</strong> Creators with ≥6 launches and 0 graduations are clamped to max 25 score (Red Band).
                </p>
                <p>
                  <strong className="text-[#FFFDF7]">3. DOA &amp; Burst:</strong> Tokens abandoned &lt;10m or rapid clusters subtract up to 30 points.
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-2 bg-[#032221] border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FFD166] shadow-[0_0_6px_#FFD166]" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                  Launch History
                </h2>
              </div>
              <span className="font-mono text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-[#064E4A] text-[#99F6E4] font-bold border border-[rgba(153,246,228,0.25)]">
                {`${launches.length} GENESIS DEPLOYMENTS`}
              </span>
            </div>

            {launches.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#A7F3D0]/70 font-mono flex-1 flex items-center justify-center">
                No recorded token deployments for this address.
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
                <table className="w-full text-xs sm:text-[13px] font-mono border-collapse">
                  <thead className="sticky top-0 bg-[#032221] z-10 shadow-xs">
                    <tr className="border-b border-[rgba(153,246,228,0.15)] text-left text-[#A7F3D0] font-bold uppercase text-[10px] sm:text-[11px]">
                      <th className="py-2.5 px-4 sm:px-6 lg:px-8">#</th>
                      <th className="py-2.5 px-4 sm:px-6 lg:px-8">Token Contract</th>
                      <th className="py-2.5 px-4 sm:px-6 lg:px-8">Block</th>
                      <th className="py-2.5 px-4 sm:px-6 lg:px-8">Phase Status</th>
                      <th className="py-2.5 px-4 sm:px-6 lg:px-8 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(153,246,228,0.08)]">
                    {launches.map((l, idx) => (
                      <tr
                        key={l.tokenAddress}
                        className="hover:bg-[#064E4A]/40 transition-colors even:bg-[#032221]/20"
                      >
                        <td className="py-2.5 px-4 sm:px-6 lg:px-8 text-[#A7F3D0]/60">{idx + 1}</td>
                        <td className="py-2.5 px-4 sm:px-6 lg:px-8 font-bold">
                          <Link
                            href={`/d/${l.tokenAddress}`}
                            className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                          >
                            {l.tokenAddress}
                          </Link>
                        </td>
                        <td className="py-2.5 px-4 sm:px-6 lg:px-8 text-[#A7F3D0]">{`#${l.block.toLocaleString()}`}</td>
                        <td className="py-2.5 px-4 sm:px-6 lg:px-8">
                          <span
                            className={`text-[10px] sm:text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              l.phase === "graduated"
                                ? "bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E]"
                                : l.phase === "swept"
                                ? "bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E]"
                                : "bg-[#FF6B6B] border-[1.5px] border-[#042F2E] text-[#042F2E]"
                            }`}
                          >
                            {l.phase}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 sm:px-6 lg:px-8 text-right">
                          <Link
                            href={`/d/${l.tokenAddress}`}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-colors"
                          >
                            <span>Inspect Case File</span>
                            <IconArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
