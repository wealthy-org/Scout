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
            <Link
              href="/census"
              className="relative rounded-[36px] bg-gradient-to-b from-[#24359d] via-[#1a236d] to-[#121446] border border-white/10 shadow-[0_20px_50px_rgba(18,20,70,0.5)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(36,53,157,0.45)] transition-all duration-300 group"
            >
              <div className="absolute inset-x-0 top-0 h-[360px] flex items-center justify-center pointer-events-none select-none">
                <svg
                  viewBox="0 0 400 420"
                  className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 overflow-visible"
                  fill="none"
                >
                  <defs>
                    <radialGradient id="stackGlow1" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#121446" stopOpacity="0" />
                    </radialGradient>
                    <filter id="softRim1" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <circle cx="200" cy="190" r="160" fill="url(#stackGlow1)" />

                  <g opacity="0.35" transform="translate(0, 180)">
                    <ellipse cx="200" cy="130" rx="92" ry="38" fill="#14174a" stroke="rgba(167, 139, 250, 0.35)" strokeWidth="1.5" />
                    <ellipse cx="200" cy="130" rx="60" ry="24" fill="none" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
                  </g>

                  <g opacity="0.55" transform="translate(0, 125)">
                    <ellipse cx="200" cy="115" rx="98" ry="42" fill="#24155b" stroke="rgba(192, 132, 252, 0.45)" strokeWidth="1.5" />
                    <path d="M 102 115 A 98 42 0 0 0 298 115 L 298 123 A 98 42 0 0 1 102 123 Z" fill="#1b0f44" opacity="0.8" />
                    <line x1="200" y1="115" x2="270" y2="100" stroke="rgba(192, 132, 252, 0.35)" strokeWidth="1.5" />
                    <line x1="200" y1="115" x2="140" y2="135" stroke="rgba(192, 132, 252, 0.35)" strokeWidth="1.5" />
                    <line x1="200" y1="115" x2="200" y2="157" stroke="rgba(192, 132, 252, 0.35)" strokeWidth="1.5" />
                  </g>

                  <g opacity="0.8" transform="translate(0, 70)">
                    <ellipse cx="200" cy="100" rx="104" ry="45" fill="#35145b" stroke="rgba(232, 121, 249, 0.55)" strokeWidth="1.5" />
                    <path d="M 96 100 A 104 45 0 0 0 304 100 L 304 110 A 104 45 0 0 1 96 110 Z" fill="#250d42" />
                    <ellipse cx="200" cy="100" rx="72" ry="31" fill="#4c0519" opacity="0.6" stroke="rgba(251, 113, 133, 0.45)" strokeWidth="1" />
                  </g>

                  <g transform="translate(0, 15)">
                    <ellipse cx="200" cy="85" rx="110" ry="48" fill="#9a3412" stroke="#fdba74" strokeWidth="1.5" opacity="0.9" />
                    <path d="M 90 85 A 110 48 0 0 0 310 85 L 310 98 A 110 48 0 0 1 90 98 Z" fill="#7c2d12" />
                  </g>

                  <g transform="translate(200, 52) rotate(-18)">
                    <ellipse cx="0" cy="0" rx="100" ry="86" fill="#1e1b4b" stroke="#C4B5FD" strokeWidth="8" filter="url(#softRim1)" />
                    <ellipse cx="0" cy="0" rx="100" ry="86" fill="#1e1b4b" stroke="#EDE9FE" strokeWidth="4" />
                    
                    <path d="M 0 0 L 0 -86 A 100 86 0 0 1 50 -74 Z" fill="#818CF8" />
                    <path d="M 0 0 L 50 -74 A 100 86 0 0 1 86 -43 Z" fill="#6366F1" />
                    <path d="M 0 0 L 86 -43 A 100 86 0 0 1 100 0 Z" fill="#38BDF8" />
                    <path d="M 0 0 L 100 0 A 100 86 0 0 1 86 43 Z" fill="#06B6D4" />
                    <path d="M 0 0 L 86 43 A 100 86 0 0 1 50 74 Z" fill="#2DD4BF" />
                    <path d="M 0 0 L 50 74 A 100 86 0 0 1 0 86 Z" fill="#F43F5E" />
                    <path d="M 0 0 L 0 86 A 100 86 0 0 1 -50 74 Z" fill="#FB7185" />
                    <path d="M 0 0 L -50 74 A 100 86 0 0 1 -86 43 Z" fill="#FBBF24" />
                    <path d="M 0 0 L -86 43 A 100 86 0 0 1 -100 0 Z" fill="#FB923C" />
                    <path d="M 0 0 L -100 0 A 100 86 0 0 1 -86 -43 Z" fill="#C084FC" />
                    <path d="M 0 0 L -86 -43 A 100 86 0 0 1 -50 -74 Z" fill="#A855F7" />
                    <path d="M 0 0 L -50 -74 A 100 86 0 0 1 0 -86 Z" fill="#9333EA" />

                    <circle cx="0" cy="0" r="16" fill="#EDE9FE" opacity="0.95" />
                    <circle cx="0" cy="0" r="8" fill="#4338CA" />
                  </g>
                </svg>
              </div>

              <div className="relative z-10 space-y-3 pt-44 sm:pt-48">
                <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                  What Deployer Scoring Unlocks
                </h3>
                <p className="text-sm sm:text-[15px] text-[#b0c0e8] leading-relaxed font-normal">
                  Learn what deployer reputation scoring unlocks on Scout: Laplace graduation rates, automated DOA penalties, and real-time risk classification.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#8a9cc4] font-medium">
                  <span>Getting Started</span>
                  <span className="text-slate-500">•</span>
                  <span>September 26, 2026</span>
                </div>
              </div>
            </Link>

            <Link
              href="/feed"
              className="relative rounded-[36px] bg-gradient-to-b from-[#1b2b8e] via-[#141b60] to-[#0d1038] border border-white/10 shadow-[0_20px_50px_rgba(13,16,56,0.5)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(27,43,142,0.45)] transition-all duration-300 group"
            >
              <div className="absolute inset-x-0 top-0 h-[360px] flex items-center justify-center pointer-events-none select-none">
                <svg
                  viewBox="0 0 400 420"
                  className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 overflow-visible"
                  fill="none"
                >
                  <defs>
                    <radialGradient id="stackGlow2" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.3" />
                      <stop offset="60%" stopColor="#00E599" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0d1038" stopOpacity="0" />
                    </radialGradient>
                    <filter id="softRim2" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <circle cx="200" cy="190" r="160" fill="url(#stackGlow2)" />

                  <g opacity="0.35" transform="translate(0, 180)">
                    <ellipse cx="200" cy="130" rx="92" ry="38" fill="#082f49" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1.5" />
                    <ellipse cx="200" cy="130" rx="60" ry="24" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
                  </g>

                  <g opacity="0.55" transform="translate(0, 125)">
                    <ellipse cx="200" cy="115" rx="98" ry="42" fill="#064e3b" stroke="rgba(0, 229, 153, 0.45)" strokeWidth="1.5" />
                    <path d="M 102 115 A 98 42 0 0 0 298 115 L 298 123 A 98 42 0 0 1 102 123 Z" fill="#022c22" opacity="0.8" />
                    <line x1="200" y1="115" x2="270" y2="100" stroke="rgba(0, 229, 153, 0.35)" strokeWidth="1.5" />
                    <line x1="200" y1="115" x2="140" y2="135" stroke="rgba(0, 229, 153, 0.35)" strokeWidth="1.5" />
                    <line x1="200" y1="115" x2="200" y2="157" stroke="rgba(0, 229, 153, 0.35)" strokeWidth="1.5" />
                  </g>

                  <g opacity="0.8" transform="translate(0, 70)">
                    <ellipse cx="200" cy="100" rx="104" ry="45" fill="#0369a1" stroke="rgba(56, 189, 248, 0.55)" strokeWidth="1.5" />
                    <path d="M 96 100 A 104 45 0 0 0 304 100 L 304 110 A 104 45 0 0 1 96 110 Z" fill="#0c4a6e" />
                    <ellipse cx="200" cy="100" rx="72" ry="31" fill="#0e7490" opacity="0.6" stroke="rgba(6, 182, 212, 0.45)" strokeWidth="1" />
                  </g>

                  <g transform="translate(0, 15)">
                    <ellipse cx="200" cy="85" rx="110" ry="48" fill="#065f46" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.9" />
                    <path d="M 90 85 A 110 48 0 0 0 310 85 L 310 98 A 110 48 0 0 1 90 98 Z" fill="#044e3b" />
                  </g>

                  <g transform="translate(200, 52) rotate(-18)">
                    <ellipse cx="0" cy="0" rx="100" ry="86" fill="#082f49" stroke="#67E8F9" strokeWidth="8" filter="url(#softRim2)" />
                    <ellipse cx="0" cy="0" rx="100" ry="86" fill="#082f49" stroke="#CFFAFE" strokeWidth="4" />
                    
                    <path d="M 0 0 L 0 -86 A 100 86 0 0 1 50 -74 Z" fill="#00E599" />
                    <path d="M 0 0 L 50 -74 A 100 86 0 0 1 86 -43 Z" fill="#00F0FF" />
                    <path d="M 0 0 L 86 -43 A 100 86 0 0 1 100 0 Z" fill="#38BDF8" />
                    <path d="M 0 0 L 100 0 A 100 86 0 0 1 86 43 Z" fill="#818CF8" />
                    <path d="M 0 0 L 86 43 A 100 86 0 0 1 50 74 Z" fill="#A78BFA" />
                    <path d="M 0 0 L 50 74 A 100 86 0 0 1 0 86 Z" fill="#C084FC" />
                    <path d="M 0 0 L 0 86 A 100 86 0 0 1 -50 74 Z" fill="#E879F9" />
                    <path d="M 0 0 L -50 74 A 100 86 0 0 1 -86 43 Z" fill="#F472B6" />
                    <path d="M 0 0 L -86 43 A 100 86 0 0 1 -100 0 Z" fill="#FB7185" />
                    <path d="M 0 0 L -100 0 A 100 86 0 0 1 -86 -43 Z" fill="#FBBF24" />
                    <path d="M 0 0 L -86 -43 A 100 86 0 0 1 -50 -74 Z" fill="#34D399" />
                    <path d="M 0 0 L -50 -74 A 100 86 0 0 1 0 -86 Z" fill="#10B981" />

                    <circle cx="0" cy="0" r="16" fill="#CFFAFE" opacity="0.95" />
                    <circle cx="0" cy="0" r="8" fill="#0e7490" />
                  </g>
                </svg>
              </div>

              <div className="relative z-10 space-y-3 pt-44 sm:pt-48">
                <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
                  Sub-Second Surveillance Stream
                </h3>
                <p className="text-sm sm:text-[15px] text-[#b0c0e8] leading-relaxed font-normal">
                  Inspect real-time bonding curve trade velocity, high-frequency buy surges, Robinhood factory genesis events, and instant graduation alerts.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#8a9cc4] font-medium">
                  <span>Real-Time Feeds</span>
                  <span className="text-slate-500">•</span>
                  <span>September 26, 2026</span>
                </div>
              </div>
            </Link>

            <Link
              href="/map"
              className="relative rounded-[36px] bg-gradient-to-b from-[#252285] via-[#1a165a] to-[#0f0e34] border border-white/10 shadow-[0_20px_50px_rgba(15,14,52,0.5)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(37,34,133,0.45)] transition-all duration-300 group"
            >
              <div className="absolute inset-x-0 top-0 h-[360px] flex items-center justify-center pointer-events-none select-none">
                <svg
                  viewBox="0 0 400 420"
                  className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 overflow-visible"
                  fill="none"
                >
                  <defs>
                    <radialGradient id="stackGlow3" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#D946EF" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#818CF8" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0f0e34" stopOpacity="0" />
                    </radialGradient>
                    <filter id="softRim3" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <circle cx="200" cy="190" r="160" fill="url(#stackGlow3)" />

                  <g opacity="0.35" transform="translate(0, 180)">
                    <ellipse cx="200" cy="130" rx="92" ry="38" fill="#180b33" stroke="rgba(217, 70, 239, 0.35)" strokeWidth="1.5" />
                    <ellipse cx="200" cy="130" rx="60" ry="24" fill="none" stroke="rgba(217, 70, 239, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
                  </g>

                  <g opacity="0.55" transform="translate(0, 125)">
                    <ellipse cx="200" cy="115" rx="98" ry="42" fill="#3b0764" stroke="rgba(244, 114, 182, 0.45)" strokeWidth="1.5" />
                    <path d="M 102 115 A 98 42 0 0 0 298 115 L 298 123 A 98 42 0 0 1 102 123 Z" fill="#240442" opacity="0.8" />
                    <line x1="200" y1="115" x2="270" y2="100" stroke="rgba(244, 114, 182, 0.35)" strokeWidth="1.5" />
                    <line x1="200" y1="115" x2="140" y2="135" stroke="rgba(244, 114, 182, 0.35)" strokeWidth="1.5" />
                    <line x1="200" y1="115" x2="200" y2="157" stroke="rgba(244, 114, 182, 0.35)" strokeWidth="1.5" />
                  </g>

                  <g opacity="0.8" transform="translate(0, 70)">
                    <ellipse cx="200" cy="100" rx="104" ry="45" fill="#581c87" stroke="rgba(192, 132, 252, 0.55)" strokeWidth="1.5" />
                    <path d="M 96 100 A 104 45 0 0 0 304 100 L 304 110 A 104 45 0 0 1 96 110 Z" fill="#3b0764" />
                    <ellipse cx="200" cy="100" rx="72" ry="31" fill="#701a75" opacity="0.6" stroke="rgba(232, 121, 249, 0.45)" strokeWidth="1" />
                  </g>

                  <g transform="translate(0, 15)">
                    <ellipse cx="200" cy="85" rx="110" ry="48" fill="#831843" stroke="#f472b6" strokeWidth="1.5" opacity="0.9" />
                    <path d="M 90 85 A 110 48 0 0 0 310 85 L 310 98 A 110 48 0 0 1 90 98 Z" fill="#500724" />
                  </g>

                  <g transform="translate(200, 52) rotate(-18)">
                    <ellipse cx="0" cy="0" rx="100" ry="86" fill="#2e1065" stroke="#F0ABFC" strokeWidth="8" filter="url(#softRim3)" />
                    <ellipse cx="0" cy="0" rx="100" ry="86" fill="#2e1065" stroke="#FDF4FF" strokeWidth="4" />
                    
                    <path d="M 0 0 L 0 -86 A 100 86 0 0 1 50 -74 Z" fill="#D946EF" />
                    <path d="M 0 0 L 50 -74 A 100 86 0 0 1 86 -43 Z" fill="#C084FC" />
                    <path d="M 0 0 L 86 -43 A 100 86 0 0 1 100 0 Z" fill="#818CF8" />
                    <path d="M 0 0 L 100 0 A 100 86 0 0 1 86 43 Z" fill="#00F0FF" />
                    <path d="M 0 0 L 86 43 A 100 86 0 0 1 50 74 Z" fill="#00E599" />
                    <path d="M 0 0 L 50 74 A 100 86 0 0 1 0 86 Z" fill="#FBBF24" />
                    <path d="M 0 0 L 0 86 A 100 86 0 0 1 -50 74 Z" fill="#FB923C" />
                    <path d="M 0 0 L -50 74 A 100 86 0 0 1 -86 43 Z" fill="#F43F5E" />
                    <path d="M 0 0 L -86 43 A 100 86 0 0 1 -100 0 Z" fill="#E11D48" />
                    <path d="M 0 0 L -100 0 A 100 86 0 0 1 -86 -43 Z" fill="#A21CAF" />
                    <path d="M 0 0 L -86 -43 A 100 86 0 0 1 -50 -74 Z" fill="#7E22CE" />
                    <path d="M 0 0 L -50 -74 A 100 86 0 0 1 0 -86 Z" fill="#4C1D95" />

                    <circle cx="0" cy="0" r="16" fill="#FDF4FF" opacity="0.95" />
                    <circle cx="0" cy="0" r="8" fill="#701a75" />
                  </g>
                </svg>
              </div>

              <div className="relative z-10 space-y-3 pt-44 sm:pt-48">
                <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight group-hover:text-fuchsia-300 transition-colors">
                  Constellation Network Topology
                </h3>
                <p className="text-sm sm:text-[15px] text-[#b0c0e8] leading-relaxed font-normal">
                  Trace multi-wallet funding origins, serial deployer co-launch patterns, and circular liquidity relationships across all token pools.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#8a9cc4] font-medium">
                  <span>Neural Mapping</span>
                  <span className="text-slate-500">•</span>
                  <span>September 26, 2026</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="relative rounded-[36px] sm:rounded-[44px] bg-gradient-to-r from-[#4f3df5] via-[#432dd8] to-[#341eb5] border border-white/15 p-8 sm:p-12 lg:p-14 shadow-[0_25px_70px_rgba(79,61,245,0.4)] overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-transparent blur-[120px] pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#00F0FF]/15 to-transparent blur-[140px] pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="space-y-6 max-w-xl text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                SCOUT: Inspect, Score, Track
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-indigo-100/90 leading-relaxed font-normal">
                <p>
                  SCOUT is how you participate in autonomous on-chain intelligence on Robinhood Chain. It is the surveillance protocol where deployer reputations and risk metrics accrue programmatically.
                </p>
                <p>
                  Through Scout Dossier.OS, you can access real-time bonding curve telemetry, audit creator histories to detect serial ruggers, and publish forensic case files for collaborative research.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-3.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FF7243] via-[#FFA133] to-[#FFC433] text-slate-950 font-bold text-sm shadow-[0_10px_30px_rgba(255,114,67,0.4)] hover:shadow-[0_15px_40px_rgba(255,114,67,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>Access and explore SCOUT</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] shrink-0 flex items-center justify-center">
              <svg
                viewBox="0 0 340 340"
                className="w-full h-full animate-float-slow select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-visible"
                fill="none"
              >
                <defs>
                  <filter id="bannerGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="sunbeam" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path d="M 170 170 L -40 -40 L 40 -100 Z" fill="url(#sunbeam)" opacity="0.6" />
                <path d="M 170 170 L 380 380 L 320 420 Z" fill="url(#sunbeam)" opacity="0.4" />

                <g transform="translate(170, 170) rotate(-22)">
                  <ellipse cx="0" cy="0" rx="120" ry="104" fill="#311084" stroke="#F43F5E" strokeWidth="12" opacity="0.8" filter="url(#bannerGlow)" />
                  <ellipse cx="0" cy="0" rx="120" ry="104" fill="#311084" stroke="#FFFFFF" strokeWidth="10" />
                  <ellipse cx="0" cy="0" rx="116" ry="100" fill="#230a63" stroke="#FCE7F3" strokeWidth="3" />

                  <path d="M 0 0 L 0 -100 A 116 100 0 0 1 58 -86 Z" fill="#F43F5E" />
                  <path d="M 0 0 L 58 -86 A 116 100 0 0 1 100 -50 Z" fill="#00F0FF" />
                  <path d="M 0 0 L 100 -50 A 116 100 0 0 1 116 0 Z" fill="#818CF8" />
                  <path d="M 0 0 L 116 0 A 116 100 0 0 1 100 50 Z" fill="#C084FC" />
                  <path d="M 0 0 L 100 50 A 116 100 0 0 1 58 86 Z" fill="#FBBF24" />
                  <path d="M 0 0 L 58 86 A 116 100 0 0 1 0 100 Z" fill="#38BDF8" />
                  <path d="M 0 0 L 0 100 A 116 100 0 0 1 -58 86 Z" fill="#FB7185" />
                  <path d="M 0 0 L -58 86 A 116 100 0 0 1 -100 50 Z" fill="#F472B6" />
                  <path d="M 0 0 L -100 50 A 116 100 0 0 1 -116 0 Z" fill="#A855F7" />
                  <path d="M 0 0 L -116 0 A 116 100 0 0 1 -100 -50 Z" fill="#38BDF8" />
                  <path d="M 0 0 L -100 -50 A 116 100 0 0 1 -58 -86 Z" fill="#00E599" />
                  <path d="M 0 0 L -58 -86 A 116 100 0 0 1 0 -100 Z" fill="#FB923C" />

                  <circle cx="0" cy="0" r="18" fill="#FFFFFF" />
                  <circle cx="0" cy="0" r="10" fill="#4338CA" />
                </g>
              </svg>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/20">
            <div className="space-y-1">
              <div className="text-xs text-indigo-200/90 font-medium">Scout Indexed Launches</div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.total_launches.toLocaleString()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-indigo-200/90 font-medium">Tracked Creators</div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.unique_deployers.toLocaleString()} Wallets
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-indigo-200/90 font-medium flex items-center gap-1.5">
                <span>Repeat Share Rate</span>
                <span className="text-[10px] text-indigo-300 opacity-80" title="Proportion of deployers with multiple launches">ⓘ</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {`${stats.repeat_share}%`} <span className="text-sm font-bold text-indigo-200/80">RATIO</span>
              </div>
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
