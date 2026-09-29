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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-20">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8 relative z-10">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-mono font-bold text-[#99F6E4] tracking-widest">
                Deployer Dossier // Institutional Reputation Audit
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight break-all text-[#FFFDF7] font-mono">
                  {address}
                </h1>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-lg text-xs font-semibold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-colors shrink-0"
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-[#FFFDF7]">
                  {score}
                </span>
                <span className="text-xs font-bold font-mono text-[#A7F3D0]">/ 100</span>
              </div>

              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${bandBadge}`}>
                {label.toUpperCase()} • {band.toUpperCase()} BAND
              </span>

              <div className="hidden md:flex gap-1 h-2.5 w-32">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-xs border border-[rgba(153,246,228,0.2)] ${
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

            <div className="text-[11px] text-[#A7F3D0] font-mono">
              Bayesian Laplace velocity • Penalty capped
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#99F6E4]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                5 Core Score Signals
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#A7F3D0]/70">
              PRD ALGORITHM SPEC
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-y border-[rgba(153,246,228,0.2)] divide-y sm:divide-y-0 sm:divide-x divide-[rgba(153,246,228,0.15)] py-4">
            <div className="p-3 sm:px-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                Graduation Rate
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FFFDF7] mt-1">
                {`${(signals.grad_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Laplace smoothed</span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B6B]/80">
                DOA Rate
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FF6B6B] mt-1">
                {`${(signals.doa_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">&lt;10m activity</span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFD166]/80">
                Burst Rate
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FFD166] mt-1">
                {`${(signals.burst_rate * 100).toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">&lt;30m cluster</span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                Total Launches
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FFFDF7] mt-1">
                {signals.total_launches}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Genesis tokens</span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#99F6E4]/80">
                Graduated Count
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#99F6E4] mt-1">
                {signals.graduated_count}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Bonding completed</span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col justify-between min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7F3D0]/70">
                Penalty Multiplier
              </span>
              <span className="text-lg sm:text-xl font-black font-mono text-[#FFFDF7] mt-1">
                {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                  ? "SERIAL CAP"
                  : "NORMAL"}
              </span>
              <span className="text-[10px] text-[#A7F3D0]/60 mt-1">Rugger status</span>
            </div>
          </div>
        </div>

        <div className="border-b border-[rgba(153,246,228,0.15)] pb-4">
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

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD166]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                Launch History
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#A7F3D0]/70">
              {`${launches.length} GENESIS DEPLOYMENTS`}
            </span>
          </div>

          {launches.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#A7F3D0]/70 font-mono">
              No recorded token deployments for this address.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(153,246,228,0.2)] text-left text-[#A7F3D0] font-semibold uppercase text-[10px]">
                    <th className="py-3 px-2">Token Contract</th>
                    <th className="py-3 px-2">Block</th>
                    <th className="py-3 px-2">Phase Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(153,246,228,0.1)]">
                  {launches.map((l) => (
                    <tr
                      key={l.tokenAddress}
                      className="hover:bg-[#042F2E]/30 transition-colors"
                    >
                      <td className="py-3 px-2 font-bold">
                        <Link
                          href={`/d/${l.tokenAddress}`}
                          className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                        >
                          {l.tokenAddress}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-[#A7F3D0]">{`#${l.block.toLocaleString()}`}</td>
                      <td className="py-3 px-2">
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
                      <td className="py-3 px-2 text-right">
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
      </main>
    </div>
  );
}
