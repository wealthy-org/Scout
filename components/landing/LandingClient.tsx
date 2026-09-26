"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import type { CensusPayload } from "@/lib/census/compute";

export interface FeaturedDossier {
  contractAddress: string;
  symbol: string;
  name: string;
  status: string;
  thesis: string;
  deployerScore: number;
  deployerBand: "green" | "yellow" | "red";
  deployerLabel: string;
}

export interface LandingClientProps {
  stats: CensusPayload;
  featuredDossier?: FeaturedDossier;
  userAddress?: string;
  isAuthenticated?: boolean;
}

export function LandingClient({
  stats,
  featuredDossier,
  userAddress,
  isAuthenticated = false,
}: LandingClientProps) {
  const [caInput, setCaInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = caInput.trim();
    if (!clean) return;

    if (!/^0x[0-9a-fA-F]{40}$/.test(clean)) {
      setInputError("Please enter a valid 42-character Ethereum contract address (0x...)");
      return;
    }

    setInputError(null);
    if (typeof window !== "undefined") {
      window.location.pathname = `/d/${clean}`;
    }
  };

  const defaultFeatured: FeaturedDossier = featuredDossier || {
    contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
    symbol: "SCOUT",
    name: "Scout Intelligence Protocol",
    status: "Researching",
    thesis: "Primary ecosystem surveillance node tracking repeat deployers and bonding curve liquidity events.",
    deployerScore: 84,
    deployerBand: "green",
    deployerLabel: "repeat",
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-20">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-16">
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-bg-primary border-2 border-border-primary shadow-neo-xs text-xs font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
            <span>Surveillance Engine Active // Robinhood Chain</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            On-Chain Intelligence & Case Files for Robinhood Chain
          </h1>

          <p className="text-sm md:text-base text-ink-secondary max-w-2xl mx-auto leading-relaxed">
            Forensic analysis, algorithmic deployer reputation scoring, bonding curve market flow, and collaborative research case files.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Enter Token Contract Address (0x...)"
                value={caInput}
                onChange={(e) => {
                  setCaInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                className="w-full bg-bg-primary border-2 border-border-primary px-4 py-3 text-xs font-mono text-ink-primary placeholder:text-ink-tertiary focus:outline-hidden focus:border-accent shadow-neo-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-6 py-3 bg-accent text-accent-fg font-black text-xs uppercase tracking-wider border-2 border-border-primary shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
              >
                Open Case File →
              </button>
            </div>
            {inputError && (
              <p className="text-xs text-status-danger mt-2 text-left font-bold">{inputError}</p>
            )}
          </form>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Total Factory Launches
            </div>
            <div className="text-3xl font-black">{stats.total_launches.toLocaleString()}</div>
            <p className="text-[11px] text-ink-tertiary mt-2">
              Indexed on-chain genesis events from Pons V2 factory.
            </p>
          </div>

          <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Unique Creators
            </div>
            <div className="text-3xl font-black text-accent">{stats.unique_deployers.toLocaleString()}</div>
            <p className="text-[11px] text-ink-tertiary mt-2">
              Distinct origin wallets tracked by reputation formula.
            </p>
          </div>

          <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Repeat Share
            </div>
            <div className="text-3xl font-black text-status-warning">{`${stats.repeat_share}%`}</div>
            <p className="text-[11px] text-ink-tertiary mt-2">
              Percentage of creators with multiple token deployments.
            </p>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-6 md:p-8 shadow-neo-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border-primary pb-4">
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                Surveillance Spotlight
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight">Live Case File Preview</h2>
            </div>

            <Link
              href={`/d/${defaultFeatured.contractAddress}`}
              className="px-4 py-2 bg-bg-secondary border border-border-primary font-bold text-xs hover:bg-canvas transition-colors"
            >
              Open Full Dossier →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black">{`$${defaultFeatured.symbol}`}</span>
                <span className="text-sm font-bold text-ink-secondary">{defaultFeatured.name}</span>
                <span className="text-xs px-2 py-0.5 bg-bg-secondary border border-border-primary text-ink-secondary">
                  {defaultFeatured.status}
                </span>
              </div>

              <div className="text-xs text-ink-tertiary font-mono break-all">
                CA: {defaultFeatured.contractAddress}
              </div>

              <div className="p-4 bg-canvas border border-border-primary text-xs leading-relaxed">
                <span className="font-bold text-accent">Active Thesis:</span> {defaultFeatured.thesis}
              </div>
            </div>

            <div className="border-2 border-border-secondary bg-canvas p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-ink-secondary mb-1">
                  Deployer Reputation Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{defaultFeatured.deployerScore}</span>
                  <span className="text-xs font-bold text-ink-tertiary">/ 100</span>
                </div>
              </div>

              <div>
                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-1 border ${
                    defaultFeatured.deployerBand === "green"
                      ? "bg-status-success/10 border-status-success text-status-success"
                      : defaultFeatured.deployerBand === "red"
                      ? "bg-status-danger/10 border-status-danger text-status-danger"
                      : "bg-status-warning/10 border-status-warning text-status-warning"
                  }`}
                >
                  {defaultFeatured.deployerLabel} • {defaultFeatured.deployerBand.toUpperCase()} BAND
                </span>
              </div>

              <p className="text-[11px] text-ink-tertiary">
                Algorithmic score evaluated from graduation velocity, DOA frequency, and fee recipient reuse.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">The 4-Step Intelligence Workflow</h2>
            <p className="text-xs text-ink-secondary max-w-lg mx-auto">
              How researchers and on-chain traders leverage Scout Dossier.OS to outsmart serial ruggers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm space-y-3">
              <div className="text-3xl font-black text-accent">01</div>
              <h3 className="text-base font-bold uppercase tracking-tight">Investigate</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Scan bytecode facts, verify token mint parameters, inspect trading flow pressure, and audit DexScreener pricing pairs in real-time.
              </p>
            </div>

            <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm space-y-3">
              <div className="text-3xl font-black text-accent">02</div>
              <h3 className="text-base font-bold uppercase tracking-tight">Score</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Calculate mathematical deployer scores (0–100) using Laplace-smoothed graduation rates, DOA penalties, and serial launcher caps.
              </p>
            </div>

            <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm space-y-3">
              <div className="text-3xl font-black text-accent">03</div>
              <h3 className="text-base font-bold uppercase tracking-tight">Track</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Snapshot case file metrics, monitor delta thresholds on FDV/Liquidity via Since Last Check, and maintain custom deployer watchlists.
              </p>
            </div>

            <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm space-y-3">
              <div className="text-3xl font-black text-accent">04</div>
              <h3 className="text-base font-bold uppercase tracking-tight">Publish</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Generate permanent, shareable case file snapshots with author attribution, one-click fork capability, and instant link revocation.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-border-primary pt-10 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-ink-secondary">
          <div className="space-y-1">
            <div className="font-extrabold uppercase text-ink-primary">
              Scout // Dossier.OS
            </div>
            <div>Decentralized On-Chain Intelligence Architecture for Robinhood Chain.</div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-bold uppercase">
            <Link href="/feed" className="hover:text-ink-primary hover:underline">
              Feed
            </Link>
            <Link href="/dossiers" className="hover:text-ink-primary hover:underline">
              Library
            </Link>
            <Link href="/map" className="hover:text-ink-primary hover:underline">
              Map
            </Link>
            <Link href="/watchlist" className="hover:text-ink-primary hover:underline">
              Watchlist
            </Link>
            <Link href="/census" className="hover:text-ink-primary hover:underline">
              Census
            </Link>
            <Link href="/how" className="hover:text-ink-primary hover:underline">
              How
            </Link>
            <Link href="/docs" className="hover:text-ink-primary hover:underline">
              Docs
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
