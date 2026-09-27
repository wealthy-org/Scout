"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="relative min-h-screen bg-[#0D746E] text-[#FFFDF7] selection:bg-[#FFD166] selection:text-[#042F2E] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[600px] bg-gradient-to-r from-[#FFD166]/15 to-transparent blur-[160px] rounded-full" />
        <div className="absolute top-[60%] -right-40 w-[700px] h-[700px] bg-gradient-to-l from-[#C084FC]/15 via-[#14B8A6]/10 to-transparent blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(153,246,228,0.15)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Header walletAddress={userAddress} isAuthenticated={isAuthenticated} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16 sm:space-y-24">
        <section className="relative pt-6 sm:pt-12 pb-8 sm:pb-12 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#064E4A]/90 border border-[rgba(153,246,228,0.3)] text-[#99F6E4] text-xs font-semibold shadow-[0_0_25px_rgba(4,47,46,0.35)] backdrop-blur-md animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_10px_#4ADE80]" />
            <span>Surveillance Engine Active • Robinhood Chain 4663</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FFFDF7] tracking-tight leading-[1.08]">
              Every Deployer Has A History.{" "}
              <span className="bg-gradient-to-r from-[#FFD166] via-[#FF9F43] to-[#FF6B6B] bg-clip-text text-transparent">
                Scout Remembers.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-[#A7F3D0] max-w-2xl mx-auto leading-relaxed font-normal">
              Autonomous on-chain forensic terminal tracking Pons V2 token launches, deployer reputation scores, and cross-wallet origin graphs in real-time.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl sm:rounded-full bg-[#064E4A]/90 border border-[rgba(153,246,228,0.35)] group-hover:border-[#FFD166] focus-within:border-[#FFD166] focus-within:ring-2 focus-within:ring-[#FFD166]/30 shadow-[0_10px_35px_rgba(4,47,46,0.6)] backdrop-blur-2xl transition-all duration-300">
              <div className="flex items-center pl-4 text-[#A7F3D0]">
                <span className="text-lg">🔍</span>
              </div>
              <input
                type="text"
                value={caInput}
                onChange={(e) => setCaInput(e.target.value)}
                placeholder="Paste token contract address (0x...) to open dossier"
                className="flex-1 bg-transparent px-3 py-3 text-sm sm:text-base text-[#FFFDF7] placeholder-[#A7F3D0]/60 outline-none focus:outline-none focus-visible:outline-none border-none shadow-none font-mono"
              />
              <button
                type="submit"
                className="px-7 py-3 rounded-xl sm:rounded-full bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] border-[1.5px] border-[#042F2E] font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200 shrink-0"
              >
                Open Case File
              </button>
            </div>
            {inputError && (
              <p className="text-xs text-[#FB7185] mt-2 font-mono text-center">
                {inputError}
              </p>
            )}
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[#A7F3D0]">
            <span className="font-semibold text-[#FFFDF7]">Or inspect live telemetry:</span>
            <Link
              href="/feed"
              className="px-3.5 py-1.5 rounded-lg bg-[#064E4A] border border-[rgba(153,246,228,0.25)] hover:border-[#FFD166] text-[#FFD166] font-medium transition-all"
            >
              📡 Launch Radar Feed
            </Link>
            <Link
              href="/map"
              className="px-3.5 py-1.5 rounded-lg bg-[#064E4A] border border-[rgba(153,246,228,0.25)] hover:border-[#C084FC] text-[#C084FC] font-medium transition-all"
            >
              🕸️ Constellation Graph
            </Link>
            <Link
              href="/census"
              className="px-3.5 py-1.5 rounded-lg bg-[#064E4A] border border-[rgba(153,246,228,0.25)] hover:border-[#4ADE80] text-[#4ADE80] font-medium transition-all"
            >
              📊 Creator Census
            </Link>
          </div>
        </section>

        <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#064E4A] via-[#0D746E] to-[#14B8A6] border border-[rgba(153,246,228,0.3)] shadow-[0_10px_40px_rgba(4,47,46,0.4)] overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#042F2E] px-3 py-1 rounded-full bg-[#99F6E4] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                Pons V2 Historical Reality
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                43.9% of Launches Come From Repeat Wallets
              </h2>
              <p className="text-xs sm:text-sm text-[#A7F3D0] max-w-2xl">
                Serial creators redeploy token contracts rapidly. Scout fingerprinted every launch event on Chain ID 4663 to build permanent historical dossiers.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#99F6E4] border-[1.5px] border-[#042F2E] flex items-center justify-center text-2xl font-black text-[#042F2E] shadow-[3px_3px_0px_#042F2E]">
                  43.9%
                </div>
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFD166]/30 via-[#14B8A6]/25 to-[#C084FC]/30 blur-xl animate-pulse" />
                <div className="absolute w-12 h-12 rounded-2xl bg-[#064E4A] border border-[#99F6E4]/50 shadow-[0_0_20px_rgba(153,246,228,0.4)] flex items-center justify-center">
                  <span className="text-xl">📡</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="tosca-surface-deep rounded-3xl p-5 sm:p-6 space-y-3 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#4ADE80]">
              <span>Factory Launches</span>
              <div className="w-8 h-8 rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(74,222,128,0.3)]">
                🚀
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight">
              {stats.total_launches.toLocaleString()}
            </div>
            <p className="text-xs text-[#A7F3D0] font-normal leading-relaxed">
              Indexed genesis contract events from Robinhood factory.
            </p>
          </div>

          <div className="tosca-surface-deep rounded-3xl p-5 sm:p-6 space-y-3 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
              <span>Unique Creators</span>
              <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                👥
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#99F6E4] tracking-tight">
              {stats.unique_deployers.toLocaleString()}
            </div>
            <p className="text-xs text-[#A7F3D0] font-normal leading-relaxed">
              Distinct deployer wallets fingerprinted and scored.
            </p>
          </div>

          <div className="tosca-surface-deep rounded-3xl p-5 sm:p-6 space-y-3 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#FFD166]">
              <span>Repeat Share</span>
              <div className="w-8 h-8 rounded-xl bg-[#FFD166]/15 border border-[#FFD166]/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(255,209,102,0.3)]">
                🔄
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFD166] tracking-tight">
              {`${stats.repeat_share}%`}
            </div>
            <p className="text-xs text-[#A7F3D0] font-normal leading-relaxed">
              Proportion of creators launching multiple token contracts.
            </p>
          </div>

          <div className="tosca-surface-deep rounded-3xl p-5 sm:p-6 space-y-3 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#C084FC]">
              <span>Head Block</span>
              <div className="w-8 h-8 rounded-xl bg-[#C084FC]/15 border border-[#C084FC]/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(192,132,252,0.3)]">
                ⚡
              </div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#C084FC] tracking-tight">
              {stats.head_block ? stats.head_block.toLocaleString() : "27,189,020"}
            </div>
            <p className="text-xs text-[#A7F3D0] font-normal leading-relaxed">
              Synchronized on-chain block height with zero lag.
            </p>
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#99F6E4]/20 border border-[#99F6E4]/40 text-[#99F6E4]">
              Ecosystem Modules
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight">
              Built For Advanced On-Chain Surveillance
            </h2>
            <p className="text-sm sm:text-base text-[#A7F3D0]">
              State-of-the-art forensic tools designed to inspect bonding curves and creator reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Link
              href="/census"
              className="relative rounded-[36px] bg-gradient-to-b from-[#064E4A] via-[#083835] to-[#042F2E] border border-[rgba(153,246,228,0.25)] shadow-[0_20px_50px_rgba(4,47,46,0.6)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(6,78,74,0.6)] transition-all duration-300 group"
            >
              <div className="absolute inset-x-0 top-0 h-[72%] sm:h-[76%] overflow-hidden pointer-events-none select-none">
                <Image
                  src="/images/card-reputation-shield.jpg"
                  alt="Deployer Reputation Shield"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#042F2E]/80 via-45% to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-3 pt-44 sm:pt-48">
                <h3 className="text-2xl sm:text-[28px] font-bold text-[#FFFDF7] tracking-tight leading-tight group-hover:text-[#FFD166] transition-colors">
                  What Deployer Scoring Unlocks
                </h3>
                <p className="text-sm sm:text-[15px] text-[#A7F3D0] leading-relaxed font-normal">
                  Learn what deployer reputation scoring unlocks on Scout: Laplace graduation rates, automated DOA penalties, and real-time risk classification.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#99F6E4] font-medium">
                  <span>Getting Started</span>
                  <span className="text-[#A7F3D0]/60">•</span>
                  <span>September 27, 2026</span>
                </div>
              </div>
            </Link>

            <Link
              href="/feed"
              className="relative rounded-[36px] bg-gradient-to-b from-[#064E4A] via-[#083835] to-[#042F2E] border border-[rgba(153,246,228,0.25)] shadow-[0_20px_50px_rgba(4,47,46,0.6)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(6,78,74,0.6)] transition-all duration-300 group"
            >
              <div className="absolute inset-x-0 top-0 h-[72%] sm:h-[76%] overflow-hidden pointer-events-none select-none">
                <Image
                  src="/images/card-surveillance-radar.jpg"
                  alt="Sub-Second Surveillance Stream"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#042F2E]/80 via-45% to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-3 pt-44 sm:pt-48">
                <h3 className="text-2xl sm:text-[28px] font-bold text-[#FFFDF7] tracking-tight leading-tight group-hover:text-[#99F6E4] transition-colors">
                  Sub-Second Surveillance Stream
                </h3>
                <p className="text-sm sm:text-[15px] text-[#A7F3D0] leading-relaxed font-normal">
                  Inspect real-time bonding curve trade velocity, high-frequency buy surges, Robinhood factory genesis events, and instant graduation alerts.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#99F6E4] font-medium">
                  <span>Real-Time Feeds</span>
                  <span className="text-[#A7F3D0]/60">•</span>
                  <span>September 27, 2026</span>
                </div>
              </div>
            </Link>

            <Link
              href="/map"
              className="relative rounded-[36px] bg-gradient-to-b from-[#064E4A] via-[#083835] to-[#042F2E] border border-[rgba(153,246,228,0.25)] shadow-[0_20px_50px_rgba(4,47,46,0.6)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(6,78,74,0.6)] transition-all duration-300 group"
            >
              <div className="absolute inset-x-0 top-0 h-[72%] sm:h-[76%] overflow-hidden pointer-events-none select-none">
                <Image
                  src="/images/card-constellation-graph.jpg"
                  alt="Constellation Network Topology"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#042F2E]/80 via-45% to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 space-y-3 pt-44 sm:pt-48">
                <h3 className="text-2xl sm:text-[28px] font-bold text-[#FFFDF7] tracking-tight leading-tight group-hover:text-[#C084FC] transition-colors">
                  Constellation Network Topology
                </h3>
                <p className="text-sm sm:text-[15px] text-[#A7F3D0] leading-relaxed font-normal">
                  Trace multi-wallet funding origins, serial deployer co-launch patterns, and circular liquidity relationships across all token pools.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#99F6E4] font-medium">
                  <span>Neural Mapping</span>
                  <span className="text-[#A7F3D0]/60">•</span>
                  <span>September 27, 2026</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="relative rounded-[36px] sm:rounded-[44px] bg-gradient-to-r from-[#064E4A] via-[#0D746E] to-[#14B8A6] border border-[rgba(153,246,228,0.3)] p-8 sm:p-12 lg:p-14 shadow-[0_25px_70px_rgba(4,47,46,0.6)] overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#FFD166]/20 via-[#FF6B6B]/15 to-transparent blur-[120px] pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#99F6E4]/20 to-transparent blur-[140px] pointer-events-none -z-0" />
          <div className="absolute -right-20 -bottom-20 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#FFD166]/30 via-[#C084FC]/25 to-[#14B8A6]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="space-y-6 max-w-xl text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight leading-tight">
                SCOUT: Inspect, Score, Track
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#A7F3D0] leading-relaxed font-normal">
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
                  className="inline-flex items-center gap-3.5 px-7 py-3.5 rounded-full bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] border-[1.5px] border-[#042F2E] font-bold text-sm shadow-[4px_4px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200"
                >
                  <span>Launch Radar Terminal</span>
                  <span className="w-6 h-6 rounded-full bg-[#042F2E] text-[#FFD166] flex items-center justify-center font-bold text-xs">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD166]/20 via-[#C084FC]/25 to-[#99F6E4]/25 blur-3xl rounded-full pointer-events-none" />
              <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                <Image
                  src="/images/banner-intelligence-core.jpg"
                  alt="Scout Autonomous Forensic Intelligence Core"
                  width={380}
                  height={380}
                  className="w-full h-full object-contain rounded-3xl drop-shadow-[0_25px_50px_rgba(4,47,46,0.7)] select-none pointer-events-none border border-[rgba(153,246,228,0.25)]"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-[rgba(153,246,228,0.3)]">
            <div className="space-y-1">
              <div className="text-xs text-[#A7F3D0] font-medium">Scout Indexed Launches</div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                {stats.total_launches.toLocaleString()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-[#A7F3D0] font-medium">Tracked Creators</div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                {stats.unique_deployers.toLocaleString()} Wallets
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-[#A7F3D0] font-medium flex items-center gap-1.5">
                <span>Repeat Share Rate</span>
                <span className="text-[10px] text-[#FFD166] opacity-90" title="Proportion of deployers with multiple launches">ⓘ</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                {`${stats.repeat_share}%`} <span className="text-sm font-bold text-[#FFD166]">RATIO</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative rounded-3xl p-6 sm:p-10 bg-[#064E4A]/90 border border-[rgba(153,246,228,0.25)] shadow-[0_15px_50px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-6">
            <div>
              <span className="text-[10px] font-bold text-[#042F2E] uppercase tracking-widest bg-[#99F6E4] px-3 py-1 rounded-full border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                Surveillance Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight mt-2">Live Case File Preview</h2>
            </div>

            <Link
              href={`/d/${defaultFeatured.contractAddress}`}
              className="px-6 py-2.5 rounded-full bg-[#99F6E4] hover:bg-[#14B8A6] border border-[#042F2E] text-[#042F2E] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
            >
              Open Full Dossier →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-3.5">
                <span className="text-3xl sm:text-4xl font-black text-[#FFFDF7]">{`$${defaultFeatured.symbol}`}</span>
                <span className="text-base font-semibold text-[#A7F3D0]">{defaultFeatured.name}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#99F6E4]/20 border border-[#99F6E4]/40 text-[#99F6E4] font-semibold">
                  {defaultFeatured.status}
                </span>
              </div>

              <div className="text-xs text-[#A7F3D0] font-mono break-all bg-[#042F2E] p-3.5 rounded-2xl border border-[rgba(153,246,228,0.2)] shadow-inner">
                CA: {defaultFeatured.contractAddress}
              </div>

              <div className="p-5 rounded-2xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.2)] text-xs sm:text-sm text-[#FFFDF7] leading-relaxed">
                <span className="font-bold text-[#FFD166]">Active Thesis:</span> {defaultFeatured.thesis}
              </div>
            </div>

            <div className="rounded-3xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] p-6 flex flex-col justify-between gap-5 shadow-xl">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#A7F3D0] tracking-wider mb-2">
                  Deployer Reputation Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-[#FFFDF7]">{defaultFeatured.deployerScore}</span>
                  <span className="text-sm font-bold text-[#A7F3D0]/70">/ 100</span>
                </div>
              </div>

              <div>
                <span
                  className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-full border inline-flex items-center gap-2 ${
                    defaultFeatured.deployerBand === "green"
                      ? "bg-[#064E4A] border-[#86EFAC] text-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.25)]"
                      : defaultFeatured.deployerBand === "red"
                      ? "bg-[#881337] border-[#FFE4E6] text-[#FB7185] shadow-[0_0_15px_rgba(251,113,133,0.25)]"
                      : "bg-[#78350F] border-[#FCD34D] text-[#FFD166] shadow-[0_0_15px_rgba(255,209,102,0.25)]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  {defaultFeatured.deployerLabel} • {defaultFeatured.deployerBand.toUpperCase()} BAND
                </span>
              </div>

              <p className="text-xs text-[#A7F3D0]">
                Mathematical score calibrated from Laplace graduation rate, velocity, and DOA penalty.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8 sm:space-y-10">
          <div className="text-center space-y-3 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight">The 4-Step Intelligence Workflow</h2>
            <p className="text-sm sm:text-base text-[#A7F3D0] max-w-xl mx-auto">
              How researchers and on-chain traders leverage Scout Dossier.OS to outsmart serial ruggers.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="tosca-surface-deep rounded-3xl p-5 sm:p-7 space-y-4 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[#4ADE80]">01</span>
                <div className="w-9 h-9 rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80]">
                  🔍
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Investigate</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Scan bytecode facts, verify token mint parameters, inspect trading flow pressure, and audit DexScreener pricing pairs.
              </p>
            </div>

            <div className="tosca-surface-deep rounded-3xl p-5 sm:p-7 space-y-4 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[#38BDF8]">02</span>
                <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                  📊
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Score</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Calculate mathematical deployer scores (0–100) using Laplace-smoothed graduation rates and DOA penalties.
              </p>
            </div>

            <div className="tosca-surface-deep rounded-3xl p-5 sm:p-7 space-y-4 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[#FFD166]">03</span>
                <div className="w-9 h-9 rounded-xl bg-[#FFD166]/15 border border-[#FFD166]/30 flex items-center justify-center text-[#FFD166]">
                  🎯
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Track</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Snapshot case file metrics, monitor delta thresholds on FDV/Liquidity, and maintain custom deployer watchlists.
              </p>
            </div>

            <div className="tosca-surface-deep rounded-3xl p-5 sm:p-7 space-y-4 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[#C084FC]">04</span>
                <div className="w-9 h-9 rounded-xl bg-[#C084FC]/15 border border-[#C084FC]/30 flex items-center justify-center text-[#C084FC]">
                  🔗
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Publish</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Generate permanent, shareable case file snapshots with author attribution and instant link revocation.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-[rgba(153,246,228,0.25)] pt-10 sm:pt-14 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A7F3D0]">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-[#FFFDF7]">
                Scout // Dossier.OS
              </span>
            </div>
            <div className="text-[#A7F3D0]">Autonomous On-Chain Intelligence Architecture for Robinhood Chain.</div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-semibold uppercase text-xs">
            <Link href="/feed" className="hover:text-[#FFD166] transition-colors">
              Feed
            </Link>
            <Link href="/library" className="hover:text-[#FFD166] transition-colors">
              Library
            </Link>
            <Link href="/map" className="hover:text-[#FFD166] transition-colors">
              Map
            </Link>
            <Link href="/watchlist" className="hover:text-[#FFD166] transition-colors">
              Watchlist
            </Link>
            <Link href="/census" className="hover:text-[#FFD166] transition-colors">
              Census
            </Link>
            <Link href="/how" className="hover:text-[#FFD166] transition-colors">
              How
            </Link>
            <Link href="/docs" className="hover:text-[#FFD166] transition-colors">
              Docs
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
