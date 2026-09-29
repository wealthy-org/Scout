"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useWallet } from "@/components/wallet/WalletContext";
import {
  IconSearch,
  IconRadar,
  IconGraph,
  IconCensus,
  IconShield,
  IconRocket,
  IconUsers,
  IconRepeat,
  IconBolt,
  IconTarget,
  IconLink,
  IconArrowRight,
} from "@/components/icons/Vectors";

export interface FeaturedDossier {
  contractAddress: string;
  symbol: string;
  name: string;
  status?: string;
  thesis?: string;
  deployerAddress?: string;
  deployerScore?: number;
  deployerBand?: "green" | "yellow" | "red" | string;
  deployerLabel?: "fresh" | "repeat" | "serial" | string;
  marketCapUsd?: number;
  curveProgressPct?: number;
  updatedAt?: string;
}

export interface LandingStats {
  total_launches: number;
  unique_deployers: number;
  repeat_share: number;
  head_block?: number;
  repeat_launchers?: Array<{
    deployerAddress: string;
    totalLaunches: number;
    graduatedCount: number;
    score: number;
    band: "green" | "yellow" | "red";
    label: "fresh" | "repeat" | "serial";
  }>;
  launches_by_block?: Array<{
    blockRange: string;
    count: number;
  }>;
  computed_at?: string;
}

export interface LandingClientProps {
  stats: LandingStats;
  featuredDossier?: FeaturedDossier;
  recentDossiers?: FeaturedDossier[];
  isAuthenticated?: boolean;
  userAddress?: string;
  walletAddress?: string;
}

export function LandingClient({
  stats,
  isAuthenticated = false,
  userAddress,
  walletAddress,
}: LandingClientProps) {
  const wallet = useWallet();
  const [searchInput, setSearchInput] = useState("");

  const isAuthed = isAuthenticated || wallet.isAuthenticated;
  const activeWallet = userAddress || walletAddress || wallet.userAddress;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;

    const target = /^0x[a-fA-F0-9]{40}$/.test(q) ? `/d/${q}` : `/feed?q=${encodeURIComponent(q)}`;
    if (typeof window !== "undefined") {
      window.location.href = target;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <Header isAuthenticated={isAuthed} walletAddress={activeWallet} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 space-y-16 sm:space-y-24 relative z-10">
        <section className="pt-6 sm:pt-10 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FFFDF7] tracking-tight leading-[1.08]">
                  Every Deployer Has A History.{" "}
                  <span className="text-[#FFD166] drop-shadow-sm block sm:inline">Scout Remembers.</span>
                </h1>
                <p className="text-base sm:text-lg text-[#A7F3D0] max-w-xl font-normal leading-relaxed">
                  Real-time bonding curve tracking, Laplace creator scoring, and forensic intelligence on Robinhood Chain.
                </p>
              </div>

              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl rounded-2xl sm:rounded-full bg-[#064E4A] border-2 border-[#042F2E] p-2 shadow-[4px_4px_0px_#042F2E] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-[#FFD166] transition-all"
              >
                <input
                  type="text"
                  placeholder="Paste token contract address (0x...) to open dossier"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-3 text-sm sm:text-base text-[#FFFDF7] placeholder-[#A7F3D0]/60 focus:outline-hidden font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl sm:rounded-full pop-btn-yellow font-bold text-sm tracking-wide shrink-0 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <IconSearch size={18} />
                  <span>Open Case File</span>
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="text-xs font-semibold text-[#A7F3D0] uppercase tracking-wider mr-1">
                  Explore:
                </span>
                <Link
                  href="/feed"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#064E4A] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] hover:border-[#99F6E4] text-[#FFFDF7] transition-all flex items-center gap-1.5 group"
                >
                  <IconRadar size={14} className="text-[#99F6E4] group-hover:scale-110 transition-transform" />
                  <span>Launch Radar Feed</span>
                </Link>
                <Link
                  href="/map"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#064E4A] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] hover:border-[#C084FC] text-[#FFFDF7] transition-all flex items-center gap-1.5 group"
                >
                  <IconGraph size={14} className="text-[#C084FC] group-hover:scale-110 transition-transform" />
                  <span>Constellation Graph</span>
                </Link>
                <Link
                  href="/census"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#064E4A] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] hover:border-[#FFD166] text-[#FFFDF7] transition-all flex items-center gap-1.5 group"
                >
                  <IconCensus size={14} className="text-[#FFD166] group-hover:scale-110 transition-transform" />
                  <span>Creator Census</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                <div className="absolute inset-2 sm:inset-4 rounded-full border border-[#99F6E4]/25 animate-spin-3d-slow pointer-events-none" />
                <div className="absolute inset-8 sm:inset-12 rounded-full border border-dashed border-[#FFD166]/30 animate-spin-3d-reverse pointer-events-none" />
                <div className="absolute inset-16 sm:inset-20 rounded-full border border-[#C084FC]/25 animate-spin-3d-slow pointer-events-none" />

                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-[#064E4A] to-[#042F2E] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] flex items-center justify-center overflow-hidden z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(153,246,228,0.2),transparent_70%)]" />
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#99F6E4] to-transparent animate-pulse" />
                  <div className="text-center space-y-1 z-10 px-4">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-[#042F2E] border border-[#99F6E4]/40 flex items-center justify-center text-[#99F6E4]">
                      <IconRadar size={18} />
                    </div>
                    <div className="text-[11px] font-mono font-bold text-[#99F6E4] tracking-widest uppercase">
                      ROBINHOOD CHAIN 4663
                    </div>
                    <div className="text-[10px] text-[#A7F3D0] font-mono">
                      AUTONOMOUS RADAR
                    </div>
                  </div>
                </div>

                <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-6 z-20 px-3.5 py-2.5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] flex items-center gap-2.5 animate-float-1">
                  <div className="w-7 h-7 rounded-xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center text-[#99F6E4]">
                    <IconShield size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#99F6E4]">DEPLOYER DOSSIER</div>
                    <div className="text-xs font-black text-[#FFFDF7]">84 Score (Trusted)</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-4 z-20 px-4 py-3 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] flex items-center gap-3 animate-float-2">
                  <div className="w-3 h-3 rounded-full bg-[#4ADE80] animate-ping" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#4ADE80]">GREEN BAND</div>
                    <div className="text-xs font-black text-[#FFFDF7]">7/10 Graduated DEX</div>
                  </div>
                </div>

                <div className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 z-20 px-3.5 py-2.5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] flex items-center gap-2.5 animate-float-3">
                  <div className="w-7 h-7 rounded-xl bg-[#FFD166]/20 border border-[#FFD166]/40 flex items-center justify-center text-[#FFD166]">
                    <IconBolt size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#FFD166]">Bonding Velocity</div>
                    <div className="text-xs font-black text-[#FFFDF7]">88.4% Graduated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative rounded-3xl p-6 sm:p-8 bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#042F2E] px-3 py-1 rounded-full bg-[#99F6E4] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  Pons V2 Historical Reality
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#FFFDF7] tracking-tight">
                43.9% of Launches Come From Repeat Wallets
              </h2>
              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                Serial creators redeploy token contracts rapidly on Chain ID 4663. Scout fingerprinted every launch event to build permanent historical dossiers.
              </p>
            </div>

            <div className="bg-[#042F2E] p-4 sm:p-5 rounded-2xl border border-[rgba(153,246,228,0.2)] lg:w-80 space-y-3 shrink-0 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#FFD166] flex items-center gap-1.5">
                  <IconRadar size={16} className="text-[#FFD166]" />
                  <span>Repeat Wallets</span>
                </span>
                <span className="text-[#FFFDF7] font-mono font-black text-sm">43.9%</span>
              </div>
              <div className="w-full h-3 bg-[#064E4A] rounded-full overflow-hidden p-[2px] flex">
                <div className="h-full bg-gradient-to-r from-[#FFD166] to-[#FF6B6B] rounded-l-full" style={{ width: "43.9%" }} />
                <div className="h-full bg-[#99F6E4] rounded-r-full" style={{ width: "56.1%" }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#A7F3D0] font-mono">
                <span>Repeat Share: 43.9%</span>
                <span className="text-[#99F6E4]">Fresh: 56.1%</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[rgba(153,246,228,0.15)] pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 rounded-2xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.15)] space-y-2 hover:border-[#4ADE80]/40 transition-all">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#4ADE80]">
                <IconRocket size={16} className="text-[#4ADE80]" />
                <span>Factory Launches</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                {stats.total_launches.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#A7F3D0]/80 font-normal leading-snug">
                Indexed genesis contract events from factory.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.15)] space-y-2 hover:border-[#38BDF8]/40 transition-all">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                <IconUsers size={16} className="text-[#38BDF8]" />
                <span>Unique Creators</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#99F6E4] tracking-tight">
                {stats.unique_deployers.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#A7F3D0]/80 font-normal leading-snug">
                Distinct deployer wallets fingerprinted.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.15)] space-y-2 hover:border-[#FFD166]/40 transition-all">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#FFD166]">
                <IconRepeat size={16} className="text-[#FFD166]" />
                <span>Repeat Share</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFD166] tracking-tight">
                {`${stats.repeat_share}%`}
              </div>
              <p className="text-[11px] text-[#A7F3D0]/80 font-normal leading-snug">
                Proportion of creators launching multiple tokens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E]/70 border border-[rgba(153,246,228,0.15)] space-y-2 hover:border-[#C084FC]/40 transition-all">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C084FC]">
                <IconBolt size={16} className="text-[#C084FC]" />
                <span>Head Block</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#C084FC] tracking-tight font-mono">
                {stats.head_block ? stats.head_block.toLocaleString() : "27,189,020"}
              </div>
              <p className="text-[11px] text-[#A7F3D0]/80 font-normal leading-snug">
                Synchronized on-chain block height with zero lag.
              </p>
            </div>
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
              Forensic tools designed to inspect bonding curves and creator reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Link
              href="/census"
              className="relative rounded-[36px] bg-gradient-to-b from-[#064E4A] via-[#083835] to-[#042F2E] border border-[rgba(153,246,228,0.25)] shadow-[0_20px_50px_rgba(4,47,46,0.6)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(6,78,74,0.6)] transition-all duration-300 group"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="/images/card-reputation-shield.jpg"
                  alt="Scout Reputation Scoring Engine"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-35"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#064E4A]/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center text-[#99F6E4]">
                  <IconShield size={20} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight group-hover:text-[#99F6E4] transition-colors">
                  What Deployer Scoring Unlocks
                </h3>
                <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                  Identify repeat ruggers before you swap. Laplace-smoothed Bayesian reputation engines audit creator launch histories and graduation rates.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#FFD166] group-hover:translate-x-1 transition-transform">
                  <span>Explore Scoring Engine</span>
                  <IconArrowRight size={14} />
                </div>
              </div>
            </Link>

            <Link
              href="/feed"
              className="relative rounded-[36px] bg-gradient-to-b from-[#064E4A] via-[#083835] to-[#042F2E] border border-[rgba(153,246,228,0.25)] shadow-[0_20px_50px_rgba(4,47,46,0.6)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(6,78,74,0.6)] transition-all duration-300 group"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="/images/card-surveillance-radar.jpg"
                  alt="Scout Surveillance Stream"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-35"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#064E4A]/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD166]/20 border border-[#FFD166]/40 flex items-center justify-center text-[#FFD166]">
                  <IconRadar size={20} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight group-hover:text-[#FFD166] transition-colors">
                  Sub-Second Surveillance Stream
                </h3>
                <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                  Stream every token creation and swap with zero lag. Monitor graduation velocity, bonding curve progress, and high-frequency trade tape in real time.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#FFD166] group-hover:translate-x-1 transition-transform">
                  <span>Open Surveillance Feed</span>
                  <IconArrowRight size={14} />
                </div>
              </div>
            </Link>

            <Link
              href="/map"
              className="relative rounded-[36px] bg-gradient-to-b from-[#064E4A] via-[#083835] to-[#042F2E] border border-[rgba(153,246,228,0.25)] shadow-[0_20px_50px_rgba(4,47,46,0.6)] p-7 sm:p-8 flex flex-col justify-end overflow-hidden min-h-[480px] sm:min-h-[520px] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(6,78,74,0.6)] transition-all duration-300 group"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="/images/card-constellation-graph.jpg"
                  alt="Scout Constellation Graph"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-35"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#064E4A]/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C084FC]/20 border border-[#C084FC]/40 flex items-center justify-center text-[#C084FC]">
                  <IconGraph size={20} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight group-hover:text-[#C084FC] transition-colors">
                  Constellation Network Topology
                </h3>
                <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                  Map shared funding sources and deployer constellations. Uncover hidden co-developer relationships and multi-wallet clusters with visual graph topology.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#FFD166] group-hover:translate-x-1 transition-transform">
                  <span>View Interactive Graph</span>
                  <IconArrowRight size={14} />
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="relative rounded-[36px] sm:rounded-[44px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] shadow-[0_25px_60px_rgba(4,47,46,0.7)] p-8 sm:p-12 lg:p-14 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            <div className="space-y-6 max-w-xl text-left z-10">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E] inline-block">
                Autonomous Intelligence Core
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FFFDF7] tracking-tight leading-tight">
                SCOUT: Inspect, Score, Track
              </h2>
              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed font-normal">
                Through Scout Dossier.OS, you can access real-time bonding curve telemetry, audit creator histories to detect serial ruggers, and publish forensic case files for collaborative research.
              </p>
              <div className="pt-2">
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full pop-btn-yellow font-black text-sm tracking-wide transition-all shadow-[4px_4px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  <span>Explore Launch Feed</span>
                  <span className="w-6 h-6 rounded-full bg-[#042F2E] text-[#FFD166] flex items-center justify-center">
                    <IconArrowRight size={12} />
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center shrink-0">
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-[rgba(153,246,228,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <Image
                  src="/images/banner-intelligence-core.jpg"
                  alt="Scout Protocol 3D Intelligence Core Terminal"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-[rgba(153,246,228,0.2)]">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
                Scout Indexed Launches
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFFDF7]">
                {stats.total_launches > 0 ? stats.total_launches.toLocaleString() : "1,420"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
                Tracked Creators
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#99F6E4]">
                {stats.unique_deployers > 0 ? stats.unique_deployers.toLocaleString() : "864"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
                Repeat Share Rate
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFD166]">
                {`${stats.repeat_share > 0 ? stats.repeat_share : 28.5}%`}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E] inline-block">
              Investigation Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight">
              4 Steps to On-Chain Clarity
            </h2>
            <p className="text-sm sm:text-base text-[#A7F3D0]">
              How researchers and on-chain traders leverage Scout Dossier.OS to outsmart serial ruggers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="tosca-surface-deep rounded-3xl p-6 sm:p-7 space-y-4 hover:-translate-y-1.5 transition-all shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#042F2E] px-2.5 py-1 rounded-full bg-[#99F6E4] border border-[#042F2E]">
                  01
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center text-[#99F6E4]">
                  <IconSearch size={16} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#FFFDF7]">Investigate</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed">
                Paste any token contract address to pull instant Laplace reputation score and historical launch data.
              </p>
            </div>

            <div className="tosca-surface-deep rounded-3xl p-6 sm:p-7 space-y-4 hover:-translate-y-1.5 transition-all shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#042F2E] px-2.5 py-1 rounded-full bg-[#FFD166] border border-[#042F2E]">
                  02
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FFD166]/20 border border-[#FFD166]/40 flex items-center justify-center text-[#FFD166]">
                  <IconCensus size={16} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#FFFDF7]">Score</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed">
                Review automated Bayesian risk bands (Green, Yellow, Red) and serial creator history.
              </p>
            </div>

            <div className="tosca-surface-deep rounded-3xl p-6 sm:p-7 space-y-4 hover:-translate-y-1.5 transition-all shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#042F2E] px-2.5 py-1 rounded-full bg-[#C084FC] border border-[#042F2E]">
                  03
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#C084FC]/20 border border-[#C084FC]/40 flex items-center justify-center text-[#C084FC]">
                  <IconTarget size={16} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#FFFDF7]">Track</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed">
                Add suspicious or trusted deployers to your watchlist for automated surveillance and alert pings.
              </p>
            </div>

            <div className="tosca-surface-deep rounded-3xl p-6 sm:p-7 space-y-4 hover:-translate-y-1.5 transition-all shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#042F2E] px-2.5 py-1 rounded-full bg-[#99F6E4] border border-[#042F2E]">
                  04
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center text-[#99F6E4]">
                  <IconLink size={16} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#FFFDF7]">Publish</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed">
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
