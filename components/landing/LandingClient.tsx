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
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[500px] bg-gradient-to-b from-[#00E599]/15 via-[#00F0FF]/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#D946EF]/15 via-[#4D65FF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 space-y-10 sm:space-y-16 md:space-y-20 relative z-10">
        <section className="text-center max-w-4xl mx-auto space-y-5 sm:space-y-7 pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,153,0.15)] text-[11px] sm:text-xs font-semibold tracking-wide text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Surveillance Engine Active // Robinhood Chain</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] px-2 text-white">
            Every Deployer Has A History.{" "}
            <span className="bg-gradient-to-r from-[#00E599] via-[#00F0FF] to-[#4D65FF] bg-clip-text text-transparent">
              Put Intelligence To Work.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-2 font-normal">
            Forensic analysis, algorithmic deployer reputation scoring, bonding curve market flow, and collaborative research case files.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2 sm:pt-4 px-2">
            <div className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300">
              <input
                type="text"
                placeholder="Enter Token Contract Address (0x...)"
                value={caInput}
                onChange={(e) => {
                  setCaInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                Open Case File →
              </button>
            </div>
            {inputError && (
              <p className="text-xs text-rose-400 mt-2 text-left font-medium px-2">{inputError}</p>
            )}
          </form>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          <div className="relative group rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_4px_24px_rgba(0,229,153,0.06)] backdrop-blur-xl transition-all duration-300">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              <span>Factory Launches</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {stats.total_launches.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-normal line-clamp-2">
              Indexed on-chain genesis events from factory.
            </p>
          </div>

          <div className="relative group rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/20 hover:border-cyan-500/40 shadow-[0_4px_24px_rgba(0,240,255,0.06)] backdrop-blur-xl transition-all duration-300">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <span>Unique Creators</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 tracking-tight">
              {stats.unique_deployers.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-normal line-clamp-2">
              Distinct origin wallets tracked by algorithm.
            </p>
          </div>

          <div className="relative group rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/20 hover:border-amber-500/40 shadow-[0_4px_24px_rgba(255,184,0,0.06)] backdrop-blur-xl transition-all duration-300">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <span>Repeat Share</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-400 tracking-tight">
              {`${stats.repeat_share}%`}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-normal line-clamp-2">
              Creators with multiple token launches.
            </p>
          </div>

          <div className="relative group rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-fuchsia-500/20 hover:border-fuchsia-500/40 shadow-[0_4px_24px_rgba(217,70,239,0.06)] backdrop-blur-xl transition-all duration-300">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-fuchsia-400 mb-2">
              <span>Head Block</span>
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-fuchsia-400 tracking-tight">
              {stats.head_block ? stats.head_block.toLocaleString() : "27,189,020"}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-normal line-clamp-2">
              Synchronized on-chain block height.
            </p>
          </div>
        </section>

        <section className="relative rounded-3xl p-5 sm:p-8 md:p-10 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 border border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                Surveillance Spotlight
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">Live Case File Preview</h2>
            </div>

            <Link
              href={`/d/${defaultFeatured.contractAddress}`}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs tracking-wide transition-all duration-200"
            >
              Open Full Dossier →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl sm:text-3xl font-black text-white">{`$${defaultFeatured.symbol}`}</span>
                <span className="text-sm font-semibold text-slate-300">{defaultFeatured.name}</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium">
                  {defaultFeatured.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono break-all bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                CA: {defaultFeatured.contractAddress}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="font-bold text-cyan-400">Active Thesis:</span> {defaultFeatured.thesis}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-slate-800 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Deployer Reputation Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">{defaultFeatured.deployerScore}</span>
                  <span className="text-sm font-bold text-slate-500">/ 100</span>
                </div>
              </div>

              <div>
                <span
                  className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                    defaultFeatured.deployerBand === "green"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(0,229,153,0.2)]"
                      : defaultFeatured.deployerBand === "red"
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(255,46,77,0.2)]"
                      : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(255,184,0,0.2)]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {defaultFeatured.deployerLabel} • {defaultFeatured.deployerBand.toUpperCase()} BAND
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Algorithmic score evaluated from graduation velocity and DOA penalty.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2 px-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">The 4-Step Intelligence Workflow</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              How researchers and on-chain traders leverage Scout Dossier.OS to outsmart serial ruggers.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-emerald-500/40 p-4 sm:p-6 shadow-md backdrop-blur-xl transition-all duration-300 space-y-3">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">01</div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Investigate</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Scan bytecode facts, verify token mint parameters, inspect trading flow pressure, and audit DexScreener pricing pairs.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-cyan-500/40 p-4 sm:p-6 shadow-md backdrop-blur-xl transition-all duration-300 space-y-3">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">02</div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Calculate mathematical deployer scores (0–100) using Laplace-smoothed graduation rates and DOA penalties.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-amber-500/40 p-4 sm:p-6 shadow-md backdrop-blur-xl transition-all duration-300 space-y-3">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">03</div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Track</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Snapshot case file metrics, monitor delta thresholds on FDV/Liquidity, and maintain custom deployer watchlists.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-fuchsia-500/40 p-4 sm:p-6 shadow-md backdrop-blur-xl transition-all duration-300 space-y-3">
              <div className="text-2xl sm:text-3xl font-black text-fuchsia-400">04</div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Publish</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Generate permanent, shareable case file snapshots with author attribution and instant link revocation.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800/80 pt-8 sm:pt-10 pb-6 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-400">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="font-bold uppercase tracking-wider text-white">
              Scout // Dossier.OS
            </div>
            <div className="text-slate-500">Decentralized On-Chain Intelligence Architecture for Robinhood Chain.</div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-semibold uppercase text-[11px] sm:text-xs">
            <Link href="/feed" className="hover:text-cyan-400 transition-colors">
              Feed
            </Link>
            <Link href="/library" className="hover:text-cyan-400 transition-colors">
              Library
            </Link>
            <Link href="/map" className="hover:text-cyan-400 transition-colors">
              Map
            </Link>
            <Link href="/watchlist" className="hover:text-cyan-400 transition-colors">
              Watchlist
            </Link>
            <Link href="/census" className="hover:text-cyan-400 transition-colors">
              Census
            </Link>
            <Link href="/how" className="hover:text-cyan-400 transition-colors">
              How
            </Link>
            <Link href="/docs" className="hover:text-cyan-400 transition-colors">
              Docs
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
