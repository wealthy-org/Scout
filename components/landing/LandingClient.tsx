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
              <div className="relative w-[340px] sm:w-[440px] lg:w-[480px] h-[340px] sm:h-[440px] lg:h-[480px] flex items-center justify-center orbit-system">
                {/* 3D Tilted Planetary Rings System */}
                <div
                  className="absolute top-1/2 left-1/2 w-[340px] sm:w-[430px] lg:w-[470px] h-[340px] sm:h-[430px] lg:h-[470px] rounded-full border-2 border-[rgba(153,246,228,0.45)] pointer-events-none animate-ring-3d shadow-[0_0_35px_rgba(20,184,166,0.35),inset_0_0_25px_rgba(153,246,228,0.2)]"
                  style={{ transformOrigin: "center center" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 w-[270px] sm:w-[350px] lg:w-[380px] h-[270px] sm:h-[350px] lg:h-[380px] rounded-full border-[1.5px] border-dashed border-[#FFD166]/50 pointer-events-none animate-ring-reverse-3d shadow-[0_0_20px_rgba(255,209,102,0.25)]"
                  style={{ transformOrigin: "center center" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 w-[210px] sm:w-[270px] lg:w-[300px] h-[210px] sm:h-[270px] lg:h-[300px] rounded-full border border-dotted border-[#C084FC]/40 pointer-events-none animate-ring-3d shadow-[0_0_15px_rgba(192,132,252,0.2)]"
                  style={{ transformOrigin: "center center" }}
                />

                {/* Central Star / Planetary Core (Stationary at exact center) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full bg-[radial-gradient(circle_at_35%_30%,#14B8A6_0%,#064E4A_60%,#042F2E_100%)] border-2 border-[#042F2E] shadow-[0_0_60px_rgba(20,184,166,0.45),inset_0_0_35px_rgba(153,246,228,0.3),6px_6px_0px_#042F2E] flex items-center justify-center overflow-hidden z-20 group transition-transform hover:scale-105 duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(153,246,228,0.35),transparent_70%)]" />
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#99F6E4] to-transparent animate-pulse" />
                  <div className="text-center space-y-1 z-10 px-3">
                    <div className="w-8 h-8 mx-auto rounded-xl bg-[#042F2E] border border-[#99F6E4]/60 flex items-center justify-center text-[#99F6E4] shadow-[2px_2px_0px_#042F2E] group-hover:rotate-12 transition-transform">
                      <IconRadar size={18} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono font-black text-[#99F6E4] tracking-widest uppercase">
                      ROBINHOOD CHAIN 4663
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-[#FFFDF7] font-black font-mono tracking-wider">
                      INTELLIGENCE CORE
                    </div>
                    <div className="flex items-center justify-center gap-1.5 pt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping" />
                      <span className="text-[8px] sm:text-[9px] text-[#A7F3D0] uppercase tracking-wider font-semibold">
                        LIVE SURVEILLANCE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Planetary Orbiting Card 1: Deployer Dossier */}
                <div
                  className="absolute top-1/2 left-1/2 animate-orbit-card w-[180px] sm:w-[205px] p-2.5 sm:p-3 rounded-2xl bg-[#064E4A]/95 backdrop-blur-xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:border-[#99F6E4] transition-all cursor-pointer select-none"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center text-[#99F6E4] shrink-0">
                      <IconShield size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-[#99F6E4] truncate">
                        DEPLOYER DOSSIER
                      </div>
                      <div className="text-xs font-black text-[#FFFDF7] truncate">
                        84 Score (Trusted)
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between text-[9px] text-[#A7F3D0] font-mono">
                    <span>Laplace Bayesian</span>
                    <span className="text-[#99F6E4] font-bold">PROVEN</span>
                  </div>
                </div>

                {/* Planetary Orbiting Card 2: Green Band */}
                <div
                  className="absolute top-1/2 left-1/2 animate-orbit-card w-[180px] sm:w-[205px] p-2.5 sm:p-3 rounded-2xl bg-[#064E4A]/95 backdrop-blur-xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:border-[#4ADE80] transition-all cursor-pointer select-none"
                  style={{ animationDelay: "-6s" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#4ADE80]/20 border border-[#4ADE80]/40 flex items-center justify-center text-[#4ADE80] shrink-0">
                      <IconRocket size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-[#4ADE80] truncate">
                        GREEN BAND
                      </div>
                      <div className="text-xs font-black text-[#FFFDF7] truncate">
                        7/10 Graduated DEX
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between text-[9px] text-[#A7F3D0] font-mono">
                    <span>High DEX Velocity</span>
                    <span className="text-[#4ADE80] font-bold">TOP 5%</span>
                  </div>
                </div>

                {/* Planetary Orbiting Card 3: Bonding Velocity */}
                <div
                  className="absolute top-1/2 left-1/2 animate-orbit-card w-[180px] sm:w-[205px] p-2.5 sm:p-3 rounded-2xl bg-[#064E4A]/95 backdrop-blur-xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:border-[#FFD166] transition-all cursor-pointer select-none"
                  style={{ animationDelay: "-12s" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#FFD166]/20 border border-[#FFD166]/40 flex items-center justify-center text-[#FFD166] shrink-0">
                      <IconBolt size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-[#FFD166] truncate">
                        Bonding Velocity
                      </div>
                      <div className="text-xs font-black text-[#FFFDF7] truncate">
                        88.4% Graduated
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between text-[9px] text-[#A7F3D0] font-mono">
                    <span>Pons V2 Factory</span>
                    <span className="text-[#FFD166] font-bold">SURGING</span>
                  </div>
                </div>

                {/* Planetary Orbiting Card 4: Constellation Graph */}
                <div
                  className="absolute top-1/2 left-1/2 animate-orbit-card w-[180px] sm:w-[205px] p-2.5 sm:p-3 rounded-2xl bg-[#064E4A]/95 backdrop-blur-xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:border-[#C084FC] transition-all cursor-pointer select-none"
                  style={{ animationDelay: "-18s" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#C084FC]/20 border border-[#C084FC]/40 flex items-center justify-center text-[#C084FC] shrink-0">
                      <IconGraph size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-[#C084FC] truncate">
                        CONSTELLATION MAP
                      </div>
                      <div className="text-xs font-black text-[#FFFDF7] truncate">
                        14 Linked Contracts
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between text-[9px] text-[#A7F3D0] font-mono">
                    <span>Topology Radar</span>
                    <span className="text-[#C084FC] font-bold">MAPPED</span>
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
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] inline-block">
              Ecosystem Modules
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight leading-tight">
              Built For Advanced On-Chain Surveillance
            </h2>
            <p className="text-sm sm:text-base text-[#A7F3D0]">
              Forensic tools designed to inspect bonding curves and creator reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Link
              href="/census"
              className="group relative rounded-3xl bg-[#064E4A]/75 backdrop-blur-md border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] hover:shadow-[8px_8px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-200 cursor-pointer min-h-[420px] sm:min-h-[450px]"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src="/images/card-reputation-shield.jpg"
                  alt="Scout Reputation Scoring Engine"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-20"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#064E4A]/60 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] font-black text-[10px] sm:text-[11px] tracking-wider uppercase shadow-[2px_2px_0px_#042F2E] flex items-center gap-1.5">
                      <IconShield size={13} />
                      <span>REPUTATION CORE</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#99F6E4] tracking-widest bg-[#042F2E]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#99F6E4]/40">
                      BAYESIAN ENGINE
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight group-hover:text-[#99F6E4] transition-colors leading-tight">
                      What Deployer Scoring Unlocks
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                      Identify repeat ruggers before you swap. Laplace-smoothed Bayesian reputation engines audit creator launch histories and graduation rates.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#042F2E]/60">
                  <div className="w-full py-3 px-5 rounded-full bg-[#99F6E4] group-hover:bg-[#5EEAD4] text-[#042F2E] border-2 border-[#042F2E] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#042F2E] flex items-center justify-between transition-colors">
                    <span>Explore Scoring Engine</span>
                    <span className="w-6 h-6 rounded-full bg-[#042F2E] text-[#99F6E4] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <IconArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/feed"
              className="group relative rounded-3xl bg-[#064E4A]/75 backdrop-blur-md border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] hover:shadow-[8px_8px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-200 cursor-pointer min-h-[420px] sm:min-h-[450px]"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src="/images/card-surveillance-radar.jpg"
                  alt="Scout Surveillance Stream"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-20"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#064E4A]/60 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] font-black text-[10px] sm:text-[11px] tracking-wider uppercase shadow-[2px_2px_0px_#042F2E] flex items-center gap-1.5">
                      <IconRadar size={13} />
                      <span>LIVE RADAR</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#FFD166] tracking-widest bg-[#042F2E]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#FFD166]/40">
                      SUB-SECOND RPC
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight group-hover:text-[#FFD166] transition-colors leading-tight">
                      Sub-Second Surveillance Stream
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                      Stream every token creation and swap with zero lag. Monitor graduation velocity, bonding curve progress, and high-frequency trade tape in real time.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#042F2E]/60">
                  <div className="w-full py-3 px-5 rounded-full bg-[#FFD166] group-hover:bg-[#FBBF24] text-[#042F2E] border-2 border-[#042F2E] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#042F2E] flex items-center justify-between transition-colors">
                    <span>Open Surveillance Feed</span>
                    <span className="w-6 h-6 rounded-full bg-[#042F2E] text-[#FFD166] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <IconArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/map"
              className="group relative rounded-3xl bg-[#064E4A]/75 backdrop-blur-md border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] hover:shadow-[8px_8px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-200 cursor-pointer min-h-[420px] sm:min-h-[450px]"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src="/images/card-constellation-graph.jpg"
                  alt="Scout Constellation Graph"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-20"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E] via-[#064E4A]/60 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#C084FC] text-[#042F2E] border-2 border-[#042F2E] font-black text-[10px] sm:text-[11px] tracking-wider uppercase shadow-[2px_2px_0px_#042F2E] flex items-center gap-1.5">
                      <IconGraph size={13} />
                      <span>NETWORK GRAPH</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#C084FC] tracking-widest bg-[#042F2E]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#C084FC]/40">
                      TOPOLOGY MAP
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight group-hover:text-[#C084FC] transition-colors leading-tight">
                      Constellation Network Topology
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                      Map shared funding sources and deployer constellations. Uncover hidden co-developer relationships and multi-wallet clusters with visual graph topology.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#042F2E]/60">
                  <div className="w-full py-3 px-5 rounded-full bg-[#C084FC] group-hover:bg-[#A855F7] text-[#042F2E] border-2 border-[#042F2E] font-black text-xs sm:text-sm shadow-[3px_3px_0px_#042F2E] flex items-center justify-between transition-colors">
                    <span>View Interactive Graph</span>
                    <span className="w-6 h-6 rounded-full bg-[#042F2E] text-[#C084FC] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <IconArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="relative rounded-3xl sm:rounded-[36px] bg-[#064E4A] border-2 border-[#042F2E] shadow-[8px_8px_0px_#042F2E] p-6 sm:p-10 lg:p-12 overflow-hidden space-y-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            <div className="space-y-6 max-w-xl text-left z-10">
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] inline-block">
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
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] bg-[#042F2E]">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t-2 border-[#042F2E]">
            <div className="bg-[#042F2E] p-4 sm:p-5 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-2 hover:border-[#4ADE80] transition-all">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4ADE80]">
                  Scout Indexed Launches
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                {stats.total_launches > 0 ? stats.total_launches.toLocaleString() : "1,420"}
              </div>
            </div>

            <div className="bg-[#042F2E] p-4 sm:p-5 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-2 hover:border-[#38BDF8] transition-all">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                  Tracked Creators
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#99F6E4] tracking-tight">
                {stats.unique_deployers > 0 ? stats.unique_deployers.toLocaleString() : "864"}
              </div>
            </div>

            <div className="bg-[#042F2E] p-4 sm:p-5 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-2 hover:border-[#FFD166] transition-all">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] shadow-[0_0_8px_#FFD166]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD166]">
                  Repeat Share Rate
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FFD166] tracking-tight">
                {`${stats.repeat_share > 0 ? stats.repeat_share : 28.5}%`}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#FF6B6B] text-[#FFFDF7] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] inline-block">
              Investigation Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFDF7] tracking-tight">
              4 Steps to On-Chain Clarity
            </h2>
            <p className="text-sm sm:text-base text-[#A7F3D0]">
              How researchers and on-chain traders leverage Scout Dossier.OS to outsmart serial ruggers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="group relative rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] hover:shadow-[8px_8px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#042F2E] px-3 py-1 rounded-full bg-[#99F6E4] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  01
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#99F6E4] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-center">
                  <IconSearch size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#FFFDF7] group-hover:text-[#99F6E4] transition-colors">
                  Investigate
                </h3>
                <p className="text-xs text-[#A7F3D0] leading-relaxed">
                  Paste any token contract address to pull instant Laplace reputation score and historical launch data.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#99F6E4]/15 text-[#99F6E4] border border-[#99F6E4]/30">
                  <span>01 // Omnisearch CA</span>
                </span>
              </div>
            </div>

            <div className="group relative rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] hover:shadow-[8px_8px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#042F2E] px-3 py-1 rounded-full bg-[#FFD166] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  02
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-center">
                  <IconCensus size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#FFFDF7] group-hover:text-[#FFD166] transition-colors">
                  Score
                </h3>
                <p className="text-xs text-[#A7F3D0] leading-relaxed">
                  Review automated Bayesian risk bands (Green, Yellow, Red) and serial creator history.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]/30">
                  <span>02 // Laplace 0-100</span>
                </span>
              </div>
            </div>

            <div className="group relative rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] hover:shadow-[8px_8px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#042F2E] px-3 py-1 rounded-full bg-[#C084FC] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  03
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#C084FC] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-center">
                  <IconTarget size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#FFFDF7] group-hover:text-[#C084FC] transition-colors">
                  Track
                </h3>
                <p className="text-xs text-[#A7F3D0] leading-relaxed">
                  Add suspicious or trusted deployers to your watchlist for automated surveillance and alert pings.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/30">
                  <span>03 // Live Watchlist</span>
                </span>
              </div>
            </div>

            <div className="group relative rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] hover:shadow-[8px_8px_0px_#042F2E] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#FFFDF7] px-3 py-1 rounded-full bg-[#FF6B6B] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  04
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#FF6B6B] text-[#FFFDF7] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-center">
                  <IconLink size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#FFFDF7] group-hover:text-[#FF6B6B] transition-colors">
                  Publish
                </h3>
                <p className="text-xs text-[#A7F3D0] leading-relaxed">
                  Generate permanent, shareable case file snapshots with author attribution and instant link revocation.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30">
                  <span>04 // Public Snapshot</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-[#042F2E] pt-10 sm:pt-14 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A7F3D0]">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80] animate-pulse" />
              <span className="font-black uppercase tracking-wider text-[#FFFDF7]">
                Scout // Dossier.OS
              </span>
            </div>
            <div className="text-[#A7F3D0]">Autonomous On-Chain Intelligence Architecture for Robinhood Chain.</div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 font-bold uppercase text-xs">
            <Link href="/feed" className="px-3 py-1.5 rounded-full bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#042F2E] hover:shadow-[2px_2px_0px_#042F2E] transition-all">
              Feed
            </Link>
            <Link href="/library" className="px-3 py-1.5 rounded-full bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#042F2E] hover:shadow-[2px_2px_0px_#042F2E] transition-all">
              Library
            </Link>
            <Link href="/map" className="px-3 py-1.5 rounded-full bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#042F2E] hover:shadow-[2px_2px_0px_#042F2E] transition-all">
              Map
            </Link>
            <Link href="/watchlist" className="px-3 py-1.5 rounded-full bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#042F2E] hover:shadow-[2px_2px_0px_#042F2E] transition-all">
              Watchlist
            </Link>
            <Link href="/census" className="px-3 py-1.5 rounded-full bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#042F2E] hover:shadow-[2px_2px_0px_#042F2E] transition-all">
              Census
            </Link>
            <Link href="/how" className="px-3 py-1.5 rounded-full bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#042F2E] hover:shadow-[2px_2px_0px_#042F2E] transition-all">
              How
            </Link>
            <Link href="/docs" className="px-3 py-1.5 rounded-full bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#042F2E] hover:shadow-[2px_2px_0px_#042F2E] transition-all">
              Docs
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

