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
      // Toggle watchlist network error
    } finally {
      setWatchlistLoading(false);
    }
  };

  const activeBars = Math.round((Math.max(0, Math.min(100, score)) / 100) * 10);

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-24">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border-primary pb-6">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-accent tracking-widest">
              Deployer Dossier // Intelligence Dossier
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight break-all">
                {address}
              </h1>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 bg-bg-secondary border border-border-primary text-xs font-bold hover:bg-canvas transition-colors shrink-0"
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
                className={`px-4 py-2 font-bold text-xs border-2 border-border-primary shadow-neo-xs hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 ${
                  inWatchlist
                    ? "bg-bg-secondary text-ink-primary"
                    : "bg-accent text-accent-fg"
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
                className="px-4 py-2 bg-bg-secondary border-2 border-border-primary text-xs font-bold shadow-neo-xs hover:bg-canvas transition-colors"
              >
                Connect to Watch
              </Link>
            )}
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-md flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
                Deployer Score & Band
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{score}</span>
                <span className="text-sm font-bold text-ink-tertiary">/ 100</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-ink-secondary">Reputation Gauge</span>
                <span className="uppercase text-accent">{`${label} launcher`}</span>
              </div>

              <div className="flex gap-1.5 h-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border border-border-primary ${
                      i < activeBars
                        ? band === "green"
                          ? "bg-status-success"
                          : band === "red"
                          ? "bg-status-danger"
                          : "bg-status-warning"
                        : "bg-canvas"
                    }`}
                  />
                ))}
              </div>

              <div>
                <span
                  className={`inline-block text-xs font-extrabold uppercase px-2.5 py-1 border ${
                    band === "green"
                      ? "bg-status-success/10 border-status-success text-status-success"
                      : band === "red"
                      ? "bg-status-danger/10 border-status-danger text-status-danger"
                      : "bg-status-warning/10 border-status-warning text-status-warning"
                  }`}
                >
                  {label.toUpperCase()} • {band.toUpperCase()} BAND
                </span>
              </div>
            </div>

            <p className="text-[11px] text-ink-tertiary leading-relaxed">
              Calculated via Laplace-smoothed graduation velocity, dead-on-arrival penalty, and burst frequency caps.
            </p>
          </div>

          <div className="lg:col-span-2 border-2 border-border-primary bg-bg-primary p-6 shadow-neo-md space-y-6">
            <div className="border-b-2 border-border-primary pb-3 flex items-center justify-between">
              <h2 className="text-base font-black uppercase">5 Core Score Signals</h2>
              <span className="text-xs font-bold text-ink-secondary">PRD ALGORITHM SPEC</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-canvas border border-border-secondary">
                <div className="text-[10px] uppercase font-bold text-ink-tertiary">Graduation Rate</div>
                <div className="text-xl font-black mt-1">
                  {`${(signals.grad_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-ink-secondary mt-1">Laplace smoothed</div>
              </div>

              <div className="p-4 bg-canvas border border-border-secondary">
                <div className="text-[10px] uppercase font-bold text-ink-tertiary">DOA Rate</div>
                <div className="text-xl font-black mt-1 text-status-danger">
                  {`${(signals.doa_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-ink-secondary mt-1">&lt;10m activity penalty</div>
              </div>

              <div className="p-4 bg-canvas border border-border-secondary">
                <div className="text-[10px] uppercase font-bold text-ink-tertiary">Burst Rate</div>
                <div className="text-xl font-black mt-1 text-status-warning">
                  {`${(signals.burst_rate * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-ink-secondary mt-1">&lt;30m cluster penalty</div>
              </div>

              <div className="p-4 bg-canvas border border-border-secondary">
                <div className="text-[10px] uppercase font-bold text-ink-tertiary">Total Launches</div>
                <div className="text-xl font-black mt-1">{signals.total_launches}</div>
                <div className="text-[10px] text-ink-secondary mt-1">Genesis token count</div>
              </div>

              <div className="p-4 bg-canvas border border-border-secondary">
                <div className="text-[10px] uppercase font-bold text-ink-tertiary">Graduated Count</div>
                <div className="text-xl font-black mt-1 text-status-success">
                  {signals.graduated_count}
                </div>
                <div className="text-[10px] text-ink-secondary mt-1">Pons curve completed</div>
              </div>

              <div className="p-4 bg-canvas border border-border-secondary">
                <div className="text-[10px] uppercase font-bold text-ink-tertiary">Penalty Multiplier</div>
                <div className="text-xl font-black mt-1">
                  {score <= 25 && signals.total_launches >= 6 && signals.graduated_count === 0
                    ? "SERIAL CAP"
                    : "NORMAL"}
                </div>
                <div className="text-[10px] text-ink-secondary mt-1">Rugger cap check</div>
              </div>
            </div>

            <div className="border border-border-secondary bg-canvas p-4">
              <button
                type="button"
                onClick={() => setWhyOpen(!whyOpen)}
                className="w-full flex items-center justify-between font-bold text-xs uppercase"
              >
                <span>Why this score? (Algorithmic Rationale)</span>
                <span>{whyOpen ? "▲" : "▼"}</span>
              </button>

              {whyOpen && (
                <div className="mt-4 pt-3 border-t border-border-secondary text-xs text-ink-secondary space-y-2 leading-relaxed">
                  <p>
                    <strong>1. Bayesian Graduation Prior:</strong> We use Laplace smoothing{" "}
                    <code>(graduated + 1) / (total + 2)</code> to prevent deceptive 100% scores on small sample sizes.
                  </p>
                  <p>
                    <strong>2. Serial Penalty Cap:</strong> Creators with ≥6 launches and 0 graduations are mathematically clamped to a maximum score of 25 (Red Band).
                  </p>
                  <p>
                    <strong>3. DOA & Burst Penalties:</strong> Tokens abandoned within 10 minutes or deployed in rapid succession subtract up to 30 points from base reputation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-md space-y-6">
          <div className="flex items-center justify-between border-b-2 border-border-primary pb-3">
            <div>
              <h2 className="text-lg font-black uppercase">Token Launch History</h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Last 40 genesis deployments indexed on Robinhood Chain.
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-bg-secondary border border-border-primary text-ink-secondary">
              {`${launches.length} TOKENS`}
            </span>
          </div>

          {launches.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-secondary border border-border-secondary bg-canvas">
              No recorded token deployments for this address.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b-2 border-border-primary bg-bg-secondary text-left">
                    <th className="p-3 uppercase">Token Contract</th>
                    <th className="p-3 uppercase">Block</th>
                    <th className="p-3 uppercase">Phase Status</th>
                    <th className="p-3 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {launches.map((l) => (
                    <tr
                      key={l.tokenAddress}
                      className="border-b border-border-secondary hover:bg-canvas transition-colors"
                    >
                      <td className="p-3 font-bold">
                        <Link
                          href={`/d/${l.tokenAddress}`}
                          className="hover:text-accent hover:underline"
                        >
                          {l.tokenAddress}
                        </Link>
                      </td>
                      <td className="p-3 text-ink-secondary">{`#${l.block.toLocaleString()}`}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border ${
                            l.phase === "graduated"
                              ? "bg-status-success/10 border-status-success text-status-success"
                              : l.phase === "swept"
                              ? "bg-status-warning/10 border-status-warning text-status-warning"
                              : "bg-status-danger/10 border-status-danger text-status-danger"
                          }`}
                        >
                          {l.phase}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/d/${l.tokenAddress}`}
                          className="text-xs font-bold text-accent hover:underline"
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
