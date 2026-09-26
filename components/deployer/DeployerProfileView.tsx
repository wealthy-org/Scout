"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
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

  const bandColor =
    band === "green"
      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
      : band === "red"
      ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
      : "bg-amber-500/10 border-amber-500/40 text-amber-400";

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#FFB800]/10 via-[#00F0FF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">
              Deployer Dossier // Intelligence Dossier
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black tracking-tight break-all text-white font-mono">
                {address}
              </h1>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors shrink-0"
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
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 ${
                  inWatchlist
                    ? "bg-slate-800 text-slate-200 border border-slate-700"
                    : "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950"
                }`}
              >
                {watchlistLoading
                  ? "Updating..."
                  : inWatchlist
                  ? "✓ In Watchlist"
                  : "+ Add to Watchlist"}
              </button>
            ) : (
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Connect to Watch
              </Link>
            )}
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Deployer Score &amp; Band
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-sm font-bold text-slate-500">/ 100</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Reputation Gauge</span>
                <span className="uppercase text-cyan-400 font-bold">{`${label} launcher`}</span>
              </div>

              <div className="flex gap-1.5 h-3.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm border border-slate-800 ${
                      i < activeBars
                        ? band === "green"
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(0,229,153,0.5)]"
                          : band === "red"
                          ? "bg-rose-500 shadow-[0_0_8px_rgba(255,46,77,0.5)]"
                          : "bg-amber-400 shadow-[0_0_8px_rgba(255,184,0,0.5)]"
                        : "bg-slate-950"
                    }`}
                  />
                ))}
              </div>

              <div>
                <span
                  className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full border ${bandColor}`}
                >
                  {label.toUpperCase()} • {band.toUpperCase()} BAND
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Calculated via Laplace-smoothed graduation velocity, dead-on-arrival penalty, and burst frequency caps.
            </p>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">5 Core Score Signals</h2>
              <span className="text-xs font-semibold text-slate-400">PRD ALGORITHM SPEC</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Graduation Rate</div>
                <div className="text-2xl font-black mt-1 text-white">
                  {`${(signals.grad_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Laplace smoothed</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20">
                <div className="text-[10px] uppercase font-semibold text-slate-400">DOA Rate</div>
                <div className="text-2xl font-black mt-1 text-rose-400">
                  {`${(signals.doa_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">&lt;10m activity penalty</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Burst Rate</div>
                <div className="text-2xl font-black mt-1 text-amber-400">
                  {`${(signals.burst_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">&lt;30m cluster penalty</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Total Launches</div>
                <div className="text-2xl font-black mt-1 text-white">{signals.total_launches}</div>
                <div className="text-[10px] text-slate-500 mt-1">Genesis token count</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Graduated Count</div>
                <div className="text-2xl font-black mt-1 text-emerald-400">
                  {signals.graduated_count}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Pons curve completed</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Penalty Multiplier</div>
                <div className="text-xl font-black mt-1 text-white">
                  {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                    ? "SERIAL CAP"
                    : "NORMAL"}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Rugger cap check</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <button
                type="button"
                onClick={() => setWhyOpen(!whyOpen)}
                className="w-full flex items-center justify-between font-bold text-xs uppercase text-slate-300 hover:text-white"
              >
                <span>Why this score? (Algorithmic Rationale)</span>
                <span>{whyOpen ? "▲" : "▼"}</span>
              </button>

              {whyOpen && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-2 leading-relaxed font-normal">
                  <p>
                    <strong className="text-slate-200">1. Bayesian Graduation Prior:</strong> We use Laplace smoothing{" "}
                    <code className="text-cyan-400 font-mono">(graduated + 1) / (total + 2)</code> to prevent deceptive 100% scores on small sample sizes.
                  </p>
                  <p>
                    <strong className="text-slate-200">2. Serial Penalty Cap:</strong> Creators with ≥6 launches and 0 graduations are mathematically clamped to a maximum score of 25 (Red Band).
                  </p>
                  <p>
                    <strong className="text-slate-200">3. DOA &amp; Burst Penalties:</strong> Tokens abandoned within 10 minutes or deployed in rapid succession subtract up to 30 points from base reputation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Token Launch History</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Last 40 genesis deployments indexed on Robinhood Chain.
              </p>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {`${launches.length} TOKENS`}
            </span>
          </div>

          {launches.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 rounded-2xl border border-slate-800 bg-slate-950/40">
              No recorded token deployments for this address.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-left text-slate-400 font-semibold uppercase">
                    <th className="p-3.5">Token Contract</th>
                    <th className="p-3.5">Block</th>
                    <th className="p-3.5">Phase Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {launches.map((l) => (
                    <tr
                      key={l.tokenAddress}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-bold">
                        <Link
                          href={`/d/${l.tokenAddress}`}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          {l.tokenAddress}
                        </Link>
                      </td>
                      <td className="p-3.5 text-slate-400">{`#${l.block.toLocaleString()}`}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            l.phase === "graduated"
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                              : l.phase === "swept"
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                              : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                          }`}
                        >
                          {l.phase}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/d/${l.tokenAddress}`}
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                        >
                          Inspect Case File →
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
