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
    <div className="min-h-screen flex flex-col bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[160px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 lg:py-12 flex flex-col justify-center relative z-10">
        <div className="w-full flex-1 min-h-[750px] lg:min-h-[820px] flex flex-col rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] overflow-hidden shadow-[0_25px_60px_rgba(4,47,46,0.75)] backdrop-blur-2xl my-auto">
          <div className="p-6 sm:p-10 lg:p-12 xl:p-14 bg-gradient-to-r from-[#064E4A] via-[#042F2E] to-[#042F2E] border-b border-[rgba(153,246,228,0.2)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
              <div className="space-y-4 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#99F6E4] uppercase tracking-widest bg-[#0D746E]/80 px-3.5 py-1.5 rounded-lg border border-[rgba(153,246,228,0.3)] shadow-sm">
                    Deployer Dossier // On-Chain Reputation Audit
                  </span>
                </div>

                <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
                  <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight break-all text-[#FFFDF7] font-mono select-all">
                    {address}
                  </h1>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-4 py-2 bg-[#042F2E] border border-[rgba(153,246,228,0.35)] rounded-xl text-xs sm:text-sm font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-all shrink-0 shadow-sm"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleToggleWatchlist}
                      disabled={watchlistLoading}
                      className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[2px_2px_0px_#042F2E] transition-all disabled:opacity-50 ${
                        inWatchlist
                          ? "bg-[#042F2E] text-[#99F6E4] border border-[#99F6E4]/40"
                          : "pop-btn-yellow"
                      }`}
                    >
                      {watchlistLoading ? (
                        "Updating..."
                      ) : inWatchlist ? (
                        <span className="inline-flex items-center gap-2">
                          <IconCheck size={16} />
                          <span>In Watchlist</span>
                        </span>
                      ) : (
                        "+ Add to Watchlist"
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.3)] text-xs sm:text-sm font-bold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-colors shadow-sm"
                    >
                      Connect to Watch
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-5 border-t lg:border-t-0 lg:border-l border-[rgba(153,246,228,0.2)] pt-6 lg:pt-0 lg:pl-12 shrink-0">
                <div className="flex items-center gap-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono text-[#FFFDF7] tracking-tight">
                      {score}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#A7F3D0]">/ 100</span>
                  </div>

                  <span className={`text-xs sm:text-sm font-black uppercase px-4 py-2 rounded-lg ${bandBadge}`}>
                    {label.toUpperCase()} • {band.toUpperCase()} BAND
                  </span>
                </div>

                <div className="space-y-2 w-full sm:w-auto">
                  <div className="flex gap-2 h-4 w-full sm:w-72">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm border border-[rgba(153,246,228,0.3)] ${
                          i < activeBars
                            ? band === "green"
                              ? "bg-[#99F6E4] shadow-[0_0_10px_rgba(153,246,228,0.7)]"
                              : band === "red"
                              ? "bg-[#FF6B6B] shadow-[0_0_10px_rgba(255,107,107,0.7)]"
                              : "bg-[#FFD166] shadow-[0_0_10px_rgba(255,209,102,0.7)]"
                            : "bg-[#032221]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-[#A7F3D0]/80 font-mono text-right">
                    Bayesian Laplace velocity
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-10 lg:px-12 py-4 bg-[#032221] border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]" />
              <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDF7]">
                5 Core Score Signals
              </h2>
            </div>
            <span className="font-mono text-[10px] sm:text-xs text-[#A7F3D0]/70 font-semibold">
              PRD ALGORITHM SPEC
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(153,246,228,0.15)] bg-[#042F2E] border-b border-[rgba(153,246,228,0.2)]">
            <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0 min-h-[140px] sm:min-h-[160px]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A7F3D0]/80">
                Graduation Rate
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#FFFDF7] mt-3">
                {`${(signals.grad_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-xs text-[#A7F3D0]/60 mt-2">Laplace smoothed</span>
            </div>

            <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0 min-h-[140px] sm:min-h-[160px]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF6B6B]/90">
                DOA Rate
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#FF6B6B] mt-3">
                {`${(signals.doa_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-xs text-[#A7F3D0]/60 mt-2">&lt;10m activity</span>
            </div>

            <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0 min-h-[140px] sm:min-h-[160px]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FFD166]/90">
                Burst Rate
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#FFD166] mt-3">
                {`${(signals.burst_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-xs text-[#A7F3D0]/60 mt-2">&lt;30m cluster</span>
            </div>

            <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0 min-h-[140px] sm:min-h-[160px]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A7F3D0]/80">
                Total Launches
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#FFFDF7] mt-3">
                {signals.total_launches}
              </span>
              <span className="text-xs text-[#A7F3D0]/60 mt-2">Genesis tokens</span>
            </div>

            <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0 min-h-[140px] sm:min-h-[160px]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#99F6E4]/90">
                Graduated Count
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#99F6E4] mt-3">
                {signals.graduated_count}
              </span>
              <span className="text-xs text-[#A7F3D0]/60 mt-2">Bonding completed</span>
            </div>

            <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0 min-h-[140px] sm:min-h-[160px]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A7F3D0]/80">
                Penalty Multiplier
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-[#FFFDF7] mt-3">
                {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                  ? "SERIAL CAP"
                  : "NORMAL"}
              </span>
              <span className="text-xs text-[#A7F3D0]/60 mt-2">Rugger status</span>
            </div>
          </div>

          <div className="px-6 sm:px-10 lg:px-12 py-4 bg-[#032221]/80 border-b border-[rgba(153,246,228,0.15)]">
            <button
              type="button"
              onClick={() => setWhyOpen(!whyOpen)}
              className="flex items-center gap-2 font-mono font-bold text-xs sm:text-sm uppercase text-[#A7F3D0] hover:text-[#FFFDF7] transition-colors"
            >
              <span>Why this score?</span>
              {whyOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </button>

            {whyOpen && (
              <div className="mt-4 pt-4 border-t border-[rgba(153,246,228,0.15)] text-xs sm:text-sm text-[#A7F3D0] space-y-3 leading-relaxed font-normal">
                <p>
                  <strong className="text-[#FFFDF7]">1. Bayesian Prior:</strong> Laplace smoothing{" "}
                  <code className="text-[#99F6E4] font-mono bg-[#032221] px-2 py-0.5 rounded border border-[rgba(153,246,228,0.2)]">(graduated + 1) / (total + 2)</code> prevents inflated scores on low launch volumes.
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

          <div className="flex-1 flex flex-col min-h-[360px]">
            <div className="px-6 sm:px-10 lg:px-12 py-4.5 bg-[#032221] border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD166] shadow-[0_0_8px_#FFD166]" />
                <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDF7]">
                  Launch History
                </h2>
              </div>
              <span className="font-mono text-xs px-3.5 py-1 rounded-full bg-[#064E4A] text-[#99F6E4] font-bold border border-[rgba(153,246,228,0.25)]">
                {`${launches.length} GENESIS DEPLOYMENTS`}
              </span>
            </div>

            {launches.length === 0 ? (
              <div className="p-16 text-center text-sm text-[#A7F3D0]/70 font-mono flex-1 flex items-center justify-center">
                No recorded token deployments for this address.
              </div>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs sm:text-sm font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(153,246,228,0.15)] bg-[#032221]/60 text-left text-[#A7F3D0] font-bold uppercase text-[11px] sm:text-xs">
                      <th className="py-4 px-6 sm:px-10 lg:px-12">#</th>
                      <th className="py-4 px-6 sm:px-10 lg:px-12">Token Contract</th>
                      <th className="py-4 px-6 sm:px-10 lg:px-12">Block</th>
                      <th className="py-4 px-6 sm:px-10 lg:px-12">Phase Status</th>
                      <th className="py-4 px-6 sm:px-10 lg:px-12 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(153,246,228,0.08)]">
                    {launches.map((l, idx) => (
                      <tr
                        key={l.tokenAddress}
                        className="hover:bg-[#064E4A]/40 transition-colors even:bg-[#032221]/20"
                      >
                        <td className="py-4 px-6 sm:px-10 lg:px-12 text-[#A7F3D0]/60">{idx + 1}</td>
                        <td className="py-4 px-6 sm:px-10 lg:px-12 font-bold">
                          <Link
                            href={`/d/${l.tokenAddress}`}
                            className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                          >
                            {l.tokenAddress}
                          </Link>
                        </td>
                        <td className="py-4 px-6 sm:px-10 lg:px-12 text-[#A7F3D0]">{`#${l.block.toLocaleString()}`}</td>
                        <td className="py-4 px-6 sm:px-10 lg:px-12">
                          <span
                            className={`text-[11px] sm:text-xs font-bold uppercase px-3 py-1 rounded-full ${
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
                        <td className="py-4 px-6 sm:px-10 lg:px-12 text-right">
                          <Link
                            href={`/d/${l.tokenAddress}`}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-colors"
                          >
                            <span>Inspect Case File</span>
                            <IconArrowRight size={16} />
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
