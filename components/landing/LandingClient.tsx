"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-20 sm:pb-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1300px] h-[600px] bg-gradient-to-b from-[#00E599]/20 via-[#00F0FF]/15 to-transparent blur-[140px] pointer-events-none -z-10 animate-aura-drift" />
      <div className="absolute top-60 right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#D946EF]/20 via-[#4D65FF]/15 to-transparent blur-[160px] pointer-events-none -z-10 animate-float-reverse" />
      <div className="absolute top-[800px] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#00F0FF]/15 via-[#00E599]/10 to-transparent blur-[150px] pointer-events-none -z-10 animate-float-slow" />

      <Header isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 space-y-16 sm:space-y-24 md:space-y-28 relative z-10">
        <section className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0D1322]/90 border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_25px_rgba(0,229,153,0.25)] text-xs font-semibold tracking-wide text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Surveillance Engine Active // Robinhood Chain</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] px-2 text-white">
            Every Deployer Has A History.{" "}
            <span className="bg-gradient-to-r from-[#00E599] via-[#00F0FF] to-[#D946EF] bg-clip-text text-transparent">
              Put Intelligence To Work.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 font-normal">
            Algorithmic deployer reputation scoring, forensic bytecode audits, real-time liquidity streams, and collaborative research case files.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2 sm:pt-4 px-2">
            <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-full bg-[#0D1322]/95 border border-white/15 focus-within:border-cyan-400 focus-within:shadow-[0_0_35px_rgba(0,240,255,0.3)] shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300">
              <div className="pl-4 text-slate-500 hidden sm:block">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
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
                className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00E599] via-[#00F0FF] to-[#4D65FF] text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,153,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Open Case File →
              </button>
            </div>
            {inputError && (
              <p className="text-xs text-rose-400 mt-2.5 text-left font-medium px-4">{inputError}</p>
            )}
          </form>

          <div className="relative max-w-3xl mx-auto pt-6 sm:pt-10 flex items-center justify-center">
            <div className="w-full h-44 sm:h-56 relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0D1322]/80 to-[#07090E]/90 border border-white/10 backdrop-blur-2xl p-6 flex items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.5)]">
              <div className="relative z-10 text-left space-y-2 max-w-sm">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  Live Neural Telemetry
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Autonomous On-Chain Radar
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Continuous factory indexing &amp; Laplace-smoothed score calibration across all Robinhood Chain pools.
                </p>
              </div>

              <div className="relative w-36 sm:w-48 h-36 sm:h-48 flex items-center justify-center">
                <svg className="w-full h-full animate-spin [animation-duration:25s]" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(0, 229, 153, 0.25)" strokeWidth="2" />
                  <circle cx="100" cy="100" r="35" fill="none" stroke="rgba(217, 70, 239, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
                <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#00E599]/30 via-[#00F0FF]/20 to-[#D946EF]/30 blur-xl animate-pulse" />
                <div className="absolute w-12 h-12 rounded-2xl bg-[#0D1322] border border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center">
                  <span className="text-xl">📡</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="chroma-card-interactive rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span>Factory Launches</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(0,229,153,0.3)]">
                🚀
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {stats.total_launches.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Indexed genesis contract events from Robinhood factory.
            </p>
          </div>

          <div className="chroma-card-interactive rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-400">
              <span>Unique Creators</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                👥
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-cyan-300 tracking-tight">
              {stats.unique_deployers.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Distinct deployer wallets fingerprinted and scored.
            </p>
          </div>

          <div className="chroma-card-interactive rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400">
              <span>Repeat Share</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(255,184,0,0.3)]">
                🔄
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-400 tracking-tight">
              {`${stats.repeat_share}%`}
            </div>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Proportion of creators launching multiple token contracts.
            </p>
          </div>

          <div className="chroma-card-interactive rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-fuchsia-400">
              <span>Head Block</span>
              <div className="w-8 h-8 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(217,70,239,0.3)]">
                ⚡
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-fuchsia-400 tracking-tight">
              {stats.head_block ? stats.head_block.toLocaleString() : "27,189,020"}
            </div>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Synchronized on-chain block height with zero lag.
            </p>
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              Ecosystem Modules
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Built For Advanced On-Chain Surveillance
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              State-of-the-art forensic tools designed to inspect bonding curves and creator reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="chroma-card-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/20 p-4 flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-radial from-emerald-500/15 to-transparent blur-xl" />
                  <svg className="w-28 h-28 text-emerald-400 transform group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-spin [animation-duration:20s]" />
                    <circle cx="50" cy="50" r="28" fill="rgba(0, 229, 153, 0.15)" stroke="currentColor" strokeWidth="3" />
                    <path d="M50 25 V50 H75" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                  </svg>
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                    Laplace Score 98
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    Reputation Scoring Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Evaluates graduation velocity, DOA penalty, and repeat launch frequencies to calculate 0–100 risk bands.
                  </p>
                </div>
              </div>

              <Link
                href="/census"
                className="w-full py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-wider text-center transition-all duration-200"
              >
                Inspect Score Census →
              </Link>
            </div>

            <div className="chroma-card-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/20 p-4 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-radial from-cyan-500/15 to-transparent blur-xl" />
                  <svg className="w-28 h-28 text-cyan-400 transform group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="30" width="12" height="45" rx="3" fill="currentColor" opacity="0.7" />
                    <rect x="38" y="15" width="12" height="60" rx="3" fill="#00E599" />
                    <rect x="56" y="45" width="12" height="30" rx="3" fill="#FF2E4D" />
                    <rect x="74" y="25" width="12" height="50" rx="3" fill="currentColor" opacity="0.9" />
                    <path d="M15 75 Q 45 30, 85 20" stroke="#00F0FF" strokeWidth="2.5" strokeDasharray="3 3" />
                  </svg>
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                    Live Stream 50ms
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    Live Surveillance Tape
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Sub-second trade streaming, high volume spikes, graduation alerts, and interactive transaction inspector drawer.
                  </p>
                </div>
              </div>

              <Link
                href="/feed"
                className="w-full py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider text-center transition-all duration-200"
              >
                Open Live Trade Tape →
              </Link>
            </div>

            <div className="chroma-card-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-fuchsia-950/60 via-slate-900 to-slate-950 border border-fuchsia-500/20 p-4 flex items-center justify-center relative overflow-hidden group-hover:border-fuchsia-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-radial from-fuchsia-500/15 to-transparent blur-xl" />
                  <svg className="w-28 h-28 text-fuchsia-400 transform group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="10" fill="#D946EF" className="animate-pulse" />
                    <circle cx="25" cy="30" r="6" fill="#00F0FF" />
                    <circle cx="75" cy="35" r="7" fill="#00E599" />
                    <circle cx="30" cy="75" r="5" fill="#FFB800" />
                    <circle cx="75" cy="70" r="6" fill="#FF2E4D" />
                    <line x1="50" y1="50" x2="25" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                    <line x1="50" y1="50" x2="75" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                    <line x1="50" y1="50" x2="30" y2="75" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                    <line x1="50" y1="50" x2="75" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  </svg>
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300">
                    Cluster Graph V2
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-fuchsia-300 transition-colors">
                    Constellation Visualizer
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Interactive network topology tracing funding origins, deployer clusters, and token circulation relationships.
                  </p>
                </div>
              </div>

              <Link
                href="/map"
                className="w-full py-3 rounded-2xl bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 font-bold text-xs uppercase tracking-wider text-center transition-all duration-200"
              >
                Explore Neural Map →
              </Link>
            </div>
          </div>
        </section>

        <section className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#0D1322]/90 via-[#0B101D]/80 to-[#07090E]/95 border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                Surveillance Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">Live Case File Preview</h2>
            </div>

            <Link
              href={`/d/${defaultFeatured.contractAddress}`}
              className="px-6 py-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-100 font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all duration-200"
            >
              Open Full Dossier →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-3.5">
                <span className="text-3xl sm:text-4xl font-black text-white">{`$${defaultFeatured.symbol}`}</span>
                <span className="text-base font-semibold text-slate-300">{defaultFeatured.name}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
                  {defaultFeatured.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono break-all bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
                CA: {defaultFeatured.contractAddress}
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="font-bold text-cyan-400">Active Thesis:</span> {defaultFeatured.thesis}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-slate-950/95 to-[#0E131F]/95 border border-white/10 p-6 flex flex-col justify-between gap-5 shadow-xl">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Deployer Reputation Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-white">{defaultFeatured.deployerScore}</span>
                  <span className="text-sm font-bold text-slate-500">/ 100</span>
                </div>
              </div>

              <div>
                <span
                  className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-full border inline-flex items-center gap-2 ${
                    defaultFeatured.deployerBand === "green"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(0,229,153,0.25)]"
                      : defaultFeatured.deployerBand === "red"
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(255,46,77,0.25)]"
                      : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(255,184,0,0.25)]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  {defaultFeatured.deployerLabel} • {defaultFeatured.deployerBand.toUpperCase()} BAND
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Mathematical score calibrated from Laplace graduation rate, velocity, and DOA penalty.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8 sm:space-y-10">
          <div className="text-center space-y-3 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">The 4-Step Intelligence Workflow</h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              How researchers and on-chain traders leverage Scout Dossier.OS to outsmart serial ruggers.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="chroma-card-interactive rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400">01</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  🔍
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Investigate</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Scan bytecode facts, verify token mint parameters, inspect trading flow pressure, and audit DexScreener pricing pairs.
              </p>
            </div>

            <div className="chroma-card-interactive rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400">02</span>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  📊
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Calculate mathematical deployer scores (0–100) using Laplace-smoothed graduation rates and DOA penalties.
              </p>
            </div>

            <div className="chroma-card-interactive rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">03</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  🎯
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Track</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Snapshot case file metrics, monitor delta thresholds on FDV/Liquidity, and maintain custom deployer watchlists.
              </p>
            </div>

            <div className="chroma-card-interactive rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-fuchsia-400">04</span>
                <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300">
                  🔗
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Publish</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Generate permanent, shareable case file snapshots with author attribution and instant link revocation.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 pt-10 sm:pt-14 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-white">
                Scout // Dossier.OS
              </span>
            </div>
            <div className="text-slate-400">Autonomous On-Chain Intelligence Architecture for Robinhood Chain.</div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-semibold uppercase text-xs">
            <Link href="/feed" className="hover:text-cyan-300 transition-colors">
              Feed
            </Link>
            <Link href="/library" className="hover:text-cyan-300 transition-colors">
              Library
            </Link>
            <Link href="/map" className="hover:text-cyan-300 transition-colors">
              Map
            </Link>
            <Link href="/watchlist" className="hover:text-cyan-300 transition-colors">
              Watchlist
            </Link>
            <Link href="/census" className="hover:text-cyan-300 transition-colors">
              Census
            </Link>
            <Link href="/how" className="hover:text-cyan-300 transition-colors">
              How
            </Link>
            <Link href="/docs" className="hover:text-cyan-300 transition-colors">
              Docs
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
