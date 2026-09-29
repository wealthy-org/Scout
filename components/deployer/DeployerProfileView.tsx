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
      ? "bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[1px_1px_0px_#042F2E]"
      : band === "red"
      ? "bg-[#FF6B6B] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[1px_1px_0px_#042F2E]"
      : "bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[1px_1px_0px_#042F2E]";

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-[1520px] mx-auto p-3 sm:p-5 lg:p-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <aside className="w-full lg:w-[360px] xl:w-[390px] shrink-0 space-y-4">
            <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-5 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#042F2E] bg-gradient-to-br from-[#FFD166] to-[#14B8A6] text-sm font-black text-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  DEP
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight text-[#FFFDF7]">
                      Deployer Dossier
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#A7F3D0] uppercase tracking-wider">
                    Robinhood Chain Genesis
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleCopy}
                  title={`Click to copy deployer address: ${address}`}
                  className="group w-full flex items-center justify-between rounded-xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] px-3 py-2 font-mono text-xs text-[#A7F3D0] hover:border-[#99F6E4] hover:text-[#FFFDF7] transition-all shadow-sm"
                >
                  <span className="truncate pr-2">
                    {address}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <svg
                      className="h-3.5 w-3.5 text-[#99F6E4] transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {copied ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      )}
                    </svg>
                    <span className="text-[10px] font-bold text-[#99F6E4]">
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </div>
                </button>
              </div>

              <div className="pt-2 border-t border-[rgba(153,246,228,0.15)]">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleToggleWatchlist}
                    disabled={watchlistLoading}
                    className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#042F2E] transition-all disabled:opacity-50 ${
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
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-xs font-semibold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-colors"
                  >
                    Connect to Watch
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-5 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
                  Reputation Score
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${bandBadge}`}
                >
                  {label.toUpperCase()} • {band.toUpperCase()} BAND
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-[#FFFDF7] tracking-tight">
                    {score}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#A7F3D0]">/ 100</span>
                </div>

                <div className="mt-3 flex gap-1 h-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm border border-[rgba(153,246,228,0.2)] ${
                        i < activeBars
                          ? band === "green"
                            ? "bg-[#99F6E4]"
                            : band === "red"
                            ? "bg-[#FF6B6B]"
                            : "bg-[#FFD166]"
                          : "bg-[#042F2E]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal pt-1">
                Calculated via Laplace-smoothed graduation velocity, dead-on-arrival penalty, and burst frequency caps.
              </p>

              <div className="pt-2 border-t border-[rgba(153,246,228,0.15)]">
                <button
                  type="button"
                  onClick={() => setWhyOpen(!whyOpen)}
                  className="w-full flex items-center justify-between font-mono font-bold text-xs uppercase text-[#FFFDF7] hover:text-[#99F6E4] py-1"
                >
                  <span>Why this score?</span>
                  {whyOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                </button>

                {whyOpen && (
                  <div className="mt-2.5 pt-2.5 border-t border-[rgba(153,246,228,0.15)] text-xs text-[#A7F3D0] space-y-2 leading-relaxed font-normal">
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
            </div>
          </aside>

          <section className="flex-1 min-w-0 w-full space-y-5">
            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
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

              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.15)] flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                      Graduation Rate
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#FFFDF7] mt-1">
                      {`${(signals.grad_rate * 100).toFixed(1)}%`}
                    </span>
                    <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Laplace smoothed</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#042F2E]/70 border border-[#FF6B6B]/30 flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B6B]/80">
                      DOA Rate
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#FF6B6B] mt-1">
                      {`${(signals.doa_rate * 100).toFixed(1)}%`}
                    </span>
                    <span className="text-[10px] text-[#A7F3D0]/60 mt-1">&lt;10m activity penalty</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#042F2E]/70 border border-[#FFD166]/30 flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFD166]/80">
                      Burst Rate
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#FFD166] mt-1">
                      {`${(signals.burst_rate * 100).toFixed(1)}%`}
                    </span>
                    <span className="text-[10px] text-[#A7F3D0]/60 mt-1">&lt;30m cluster penalty</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.15)] flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                      Total Launches
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#FFFDF7] mt-1">
                      {signals.total_launches}
                    </span>
                    <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Genesis token count</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#042F2E]/70 border border-[#99F6E4]/30 flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#99F6E4]/80">
                      Graduated Count
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#99F6E4] mt-1">
                      {signals.graduated_count}
                    </span>
                    <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Bonding completed</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.15)] flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                      Penalty Multiplier
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono text-[#FFFDF7] mt-1">
                      {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                        ? "SERIAL CAP"
                        : "NORMAL"}
                    </span>
                    <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Rugger status check</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FFD166]" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                    Token Launch History
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-[#A7F3D0]/70">
                  {`${launches.length} GENESIS DEPLOYMENTS`}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                {launches.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#A7F3D0] rounded-xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E]">
                    No recorded token deployments for this address.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono border-collapse">
                      <thead>
                        <tr className="border-b border-[rgba(153,246,228,0.2)] bg-[#042F2E] text-left text-[#A7F3D0] font-semibold uppercase text-[10px]">
                          <th className="p-3">Token Contract</th>
                          <th className="p-3">Block</th>
                          <th className="p-3">Phase Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(153,246,228,0.15)]">
                        {launches.map((l) => (
                          <tr
                            key={l.tokenAddress}
                            className="hover:bg-[#042F2E]/50 transition-colors"
                          >
                            <td className="p-3 font-bold">
                              <Link
                                href={`/d/${l.tokenAddress}`}
                                className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                              >
                                {l.tokenAddress}
                              </Link>
                            </td>
                            <td className="p-3 text-[#A7F3D0]">{`#${l.block.toLocaleString()}`}</td>
                            <td className="p-3">
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
                            <td className="p-3 text-right">
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
          </section>
        </div>
      </main>
    </div>
  );
}
