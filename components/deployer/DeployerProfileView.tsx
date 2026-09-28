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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#99F6E4] tracking-widest">
              Deployer Dossier // Intelligence Dossier
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black tracking-tight break-all text-[#FFFDF7] font-mono">
                {address}
              </h1>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl text-xs font-semibold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-colors shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleToggleWatchlist}
                disabled={watchlistLoading}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#042F2E] transition-all disabled:opacity-50 ${
                  inWatchlist
                    ? "bg-[#042F2E] text-[#FFFDF7] border-[1.5px] border-[#042F2E]"
                    : "pop-btn-yellow"
                }`}
              >
                {watchlistLoading ? (
                  "Updating..."
                ) : inWatchlist ? (
                  <span className="inline-flex items-center gap-1">
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

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#A7F3D0] mb-2">
                Deployer Score &amp; Band
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#FFFDF7]">{score}</span>
                <span className="text-sm font-bold text-[#A7F3D0]">/ 100</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#A7F3D0]">Reputation Gauge</span>
                <span className="uppercase text-[#99F6E4] font-bold">{`${label} launcher`}</span>
              </div>

              <div className="flex gap-1.5 h-3.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm border border-[rgba(153,246,228,0.2)] ${
                      i < activeBars
                        ? band === "green"
                          ? "bg-[#99F6E4] shadow-[0_0_8px_rgba(153,246,228,0.5)]"
                          : band === "red"
                          ? "bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.5)]"
                          : "bg-[#FFD166] shadow-[0_0_8px_rgba(255,209,102,0.5)]"
                        : "bg-[#042F2E]"
                    }`}
                  />
                ))}
              </div>

              <div>
                <span
                  className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${bandBadge}`}
                >
                  {label.toUpperCase()} • {band.toUpperCase()} BAND
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
              Calculated via Laplace-smoothed graduation velocity, dead-on-arrival penalty, and burst frequency caps.
            </p>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
            <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">5 Core Score Signals</h2>
              <span className="text-xs font-semibold text-[#A7F3D0]">PRD ALGORITHM SPEC</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
                <div className="text-[10px] uppercase font-semibold text-[#A7F3D0]">Graduation Rate</div>
                <div className="text-2xl font-black mt-1 text-[#FFFDF7]">
                  {`${(signals.grad_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-[#A7F3D0]/70 mt-1">Laplace smoothed</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[#FF6B6B]/30">
                <div className="text-[10px] uppercase font-semibold text-[#FF6B6B]">DOA Rate</div>
                <div className="text-2xl font-black mt-1 text-[#FF6B6B]">
                  {`${(signals.doa_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-[#A7F3D0]/70 mt-1">&lt;10m activity penalty</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[#FFD166]/30">
                <div className="text-[10px] uppercase font-semibold text-[#FFD166]">Burst Rate</div>
                <div className="text-2xl font-black mt-1 text-[#FFD166]">
                  {`${(signals.burst_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-[#A7F3D0]/70 mt-1">&lt;30m cluster penalty</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
                <div className="text-[10px] uppercase font-semibold text-[#A7F3D0]">Total Launches</div>
                <div className="text-2xl font-black mt-1 text-[#FFFDF7]">{signals.total_launches}</div>
                <div className="text-[10px] text-[#A7F3D0]/70 mt-1">Genesis token count</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[#99F6E4]/30">
                <div className="text-[10px] uppercase font-semibold text-[#99F6E4]">Graduated Count</div>
                <div className="text-2xl font-black mt-1 text-[#99F6E4]">
                  {signals.graduated_count}
                </div>
                <div className="text-[10px] text-[#A7F3D0]/70 mt-1">Bonding curve completed</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
                <div className="text-[10px] uppercase font-semibold text-[#A7F3D0]">Penalty Multiplier</div>
                <div className="text-xl font-black mt-1 text-[#FFFDF7]">
                  {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                    ? "SERIAL CAP"
                    : "NORMAL"}
                </div>
                <div className="text-[10px] text-[#A7F3D0]/70 mt-1">Rugger cap check</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-4">
              <button
                type="button"
                onClick={() => setWhyOpen(!whyOpen)}
                className="w-full flex items-center justify-between font-bold text-xs uppercase text-[#FFFDF7] hover:text-[#99F6E4]"
              >
                <span>Why this score? (Algorithmic Rationale)</span>
                {whyOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </button>

              {whyOpen && (
                <div className="mt-4 pt-3 border-t border-[rgba(153,246,228,0.2)] text-xs text-[#A7F3D0] space-y-2 leading-relaxed font-normal">
                  <p>
                    <strong className="text-[#FFFDF7]">1. Bayesian Graduation Prior:</strong> We use Laplace smoothing{" "}
                    <code className="text-[#99F6E4] font-mono">(graduated + 1) / (total + 2)</code> to prevent deceptive 100% scores on small sample sizes.
                  </p>
                  <p>
                    <strong className="text-[#FFFDF7]">2. Serial Penalty Cap:</strong> Creators with ≥6 launches and 0 graduations are mathematically clamped to a maximum score of 25 (Red Band).
                  </p>
                  <p>
                    <strong className="text-[#FFFDF7]">3. DOA &amp; Burst Penalties:</strong> Tokens abandoned within 10 minutes or deployed in rapid succession subtract up to 30 points from base reputation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Token Launch History</h2>
              <p className="text-xs text-[#A7F3D0] mt-0.5 font-normal">
                Last 40 genesis deployments indexed on Robinhood Chain.
              </p>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-[#FFFDF7] font-semibold">
              {`${launches.length} TOKENS`}
            </span>
          </div>

          {launches.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A7F3D0] rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E]">
              No recorded token deployments for this address.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(153,246,228,0.2)] bg-[#042F2E] text-left text-[#A7F3D0] font-semibold uppercase">
                    <th className="p-3.5">Token Contract</th>
                    <th className="p-3.5">Block</th>
                    <th className="p-3.5">Phase Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(153,246,228,0.15)]">
                  {launches.map((l) => (
                    <tr
                      key={l.tokenAddress}
                      className="hover:bg-[#042F2E]/50 transition-colors"
                    >
                      <td className="p-3.5 font-bold">
                        <Link
                          href={`/d/${l.tokenAddress}`}
                          className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                        >
                          {l.tokenAddress}
                        </Link>
                      </td>
                      <td className="p-3.5 text-[#A7F3D0]">{`#${l.block.toLocaleString()}`}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
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
                      <td className="p-3.5 text-right">
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
        </section>
      </main>
    </div>
  );
}
