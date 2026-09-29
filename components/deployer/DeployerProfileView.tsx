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

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(address);
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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-20">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 relative z-10">
        <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] overflow-hidden shadow-[0_15px_35px_-5px_rgba(4,47,46,0.6)] backdrop-blur-2xl">
          <div className="p-5 sm:p-7 bg-gradient-to-r from-[#064E4A] via-[#042F2E] to-[#042F2E] border-b border-[rgba(153,246,228,0.2)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-[#99F6E4] uppercase tracking-widest bg-[#0D746E]/60 px-2.5 py-1 rounded-md border border-[rgba(153,246,228,0.25)]">
                    Deployer Dossier // On-Chain Reputation Audit
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight break-all text-[#FFFDF7] font-mono select-all">
                    {address}
                  </h1>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1 bg-[#042F2E] border border-[rgba(153,246,228,0.3)] rounded-lg text-xs font-semibold text-[#99F6E4] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-all shrink-0 shadow-sm"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="pt-1 flex items-center gap-3">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleToggleWatchlist}
                      disabled={watchlistLoading}
                      className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#042F2E] transition-all disabled:opacity-50 ${
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
                      className="px-4 py-2 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-xs font-semibold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-colors"
                    >
                      Connect to Watch
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 lg:border-l border-[rgba(153,246,228,0.15)] pt-4 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-[#FFFDF7] tracking-tight">
                      {score}
                    </span>
                    <span className="text-sm font-bold font-mono text-[#A7F3D0]">/ 100</span>
                  </div>

                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-md ${bandBadge}`}>
                    {label.toUpperCase()} • {band.toUpperCase()} BAND
                  </span>
                </div>

                <div className="space-y-1 w-full sm:w-auto">
                  <div className="flex gap-1 h-3 w-full sm:w-48">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-xs border border-[rgba(153,246,228,0.25)] ${
                          i < activeBars
                            ? band === "green"
                              ? "bg-[#99F6E4] shadow-[0_0_6px_rgba(153,246,228,0.6)]"
                              : band === "red"
                              ? "bg-[#FF6B6B] shadow-[0_0_6px_rgba(255,107,107,0.6)]"
                              : "bg-[#FFD166] shadow-[0_0_6px_rgba(255,209,102,0.6)]"
                            : "bg-[#032221]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-[#A7F3D0]/70 font-mono text-right">
                    Bayesian Laplace velocity
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-7 py-3 bg-[#032221] border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                5 Core Score Signals
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#A7F3D0]/70">
              PRD ALGORITHM SPEC
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(153,246,228,0.15)] bg-[#042F2E] border-b border-[rgba(153,246,228,0.2)]">
            <div className="p-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                Graduation Rate
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FFFDF7] mt-1.5">
                {`${(signals.grad_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Laplace smoothed</span>
            </div>

            <div className="p-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B6B]/80">
                DOA Rate
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FF6B6B] mt-1.5">
                {`${(signals.doa_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">&lt;10m activity</span>
            </div>

            <div className="p-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFD166]/80">
                Burst Rate
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FFD166] mt-1.5">
                {`${(signals.burst_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">&lt;30m cluster</span>
            </div>

            <div className="p-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                Total Launches
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FFFDF7] mt-1.5">
                {signals.total_launches}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Genesis tokens</span>
            </div>

            <div className="p-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#99F6E4]/80">
                Graduated Count
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#99F6E4] mt-1.5">
                {signals.graduated_count}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Bonding completed</span>
            </div>

            <div className="p-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                Penalty Multiplier
              </span>
              <span className="text-lg sm:text-xl font-black font-mono text-[#FFFDF7] mt-1.5">
                {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                  ? "SERIAL CAP"
                  : "NORMAL"}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Rugger status</span>
            </div>
          </div>

          <div className="px-5 sm:px-7 py-3 bg-[#032221]/80 border-b border-[rgba(153,246,228,0.15)]">
            <button
              type="button"
              onClick={() => setWhyOpen(!whyOpen)}
              className="flex items-center gap-2 font-mono font-bold text-xs uppercase text-[#A7F3D0] hover:text-[#FFFDF7] transition-colors"
            >
              <span>Why this score?</span>
              {whyOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            </button>

            {whyOpen && (
              <div className="mt-3 pt-3 border-t border-[rgba(153,246,228,0.15)] text-xs text-[#A7F3D0] space-y-2 leading-relaxed font-normal">
                <p>
                  <strong className="text-[#FFFDF7]">1. Bayesian Prior:</strong> Laplace smoothing{" "}
                  <code className="text-[#99F6E4] font-mono">(graduated + 1) / (total + 2)</code> prevents inflated scores on low launch volumes.
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

          <div>
            <div className="px-5 sm:px-7 py-3.5 bg-[#032221] border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FFD166]" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                  Launch History
                </h2>
              </div>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#064E4A] text-[#99F6E4] font-bold border border-[rgba(153,246,228,0.2)]">
                {`${launches.length} GENESIS DEPLOYMENTS`}
              </span>
            </div>

            {launches.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#A7F3D0]/70 font-mono">
                No recorded token deployments for this address.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(153,246,228,0.15)] bg-[#032221]/50 text-left text-[#A7F3D0] font-semibold uppercase text-[10px]">
                      <th className="py-3 px-4 sm:px-6">#</th>
                      <th className="py-3 px-4">Token Contract</th>
                      <th className="py-3 px-4">Block</th>
                      <th className="py-3 px-4">Phase Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(153,246,228,0.08)]">
                    {launches.map((l, idx) => (
                      <tr
                        key={l.tokenAddress}
                        className="hover:bg-[#064E4A]/40 transition-colors even:bg-[#032221]/20"
                      >
                        <td className="py-3 px-4 sm:px-6 text-[#A7F3D0]/60">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold">
                          <Link
                            href={`/d/${l.tokenAddress}`}
                            className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                          >
                            {l.tokenAddress}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-[#A7F3D0]">{`#${l.block.toLocaleString()}`}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
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
                        <td className="py-3 px-4 sm:px-6 text-right">
                          <Link
                            href={`/d/${l.tokenAddress}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-colors"
                          >
                            <span>Inspect Case File</span>
                            <IconArrowRight size={13} />
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
