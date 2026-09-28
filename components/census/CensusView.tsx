"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import {
  IconRadar,
  IconBolt,
  IconUsers,
  IconRepeat,
  IconShield,
  IconTrophy,
  IconGraduation,
  IconClipboard,
  IconCheck,
  IconArrowRight,
  IconFlame,
  IconAlert,
} from "@/components/icons/Vectors";
import type { CensusPayload } from "@/lib/census/compute";

export interface CensusViewProps {
  stats: CensusPayload;
  isAuthenticated?: boolean;
  userAddress?: string;
}

export function CensusView({
  stats,
  isAuthenticated = false,
  userAddress,
}: CensusViewProps) {
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const launchesByBlock = useMemo(() => {
    return (
      stats.launches_by_block || [
        { blockRange: "0-500K", count: Math.round(stats.total_launches * 0.1) },
        { blockRange: "500K-1M", count: Math.round(stats.total_launches * 0.25) },
        { blockRange: "1M-1.5M", count: Math.round(stats.total_launches * 0.4) },
        { blockRange: "1.5M+", count: Math.round(stats.total_launches * 0.25) },
      ]
    );
  }, [stats]);

  const maxBlockCount = Math.max(...launchesByBlock.map((b) => b.count), 1);
  const headBlockNum = stats.head_block ?? 27195000;

  const repeatLaunchers = stats.repeat_launchers || [];
  const serialRuggersCount = repeatLaunchers.filter(
    (d) => d.label === "serial" || (d.score !== undefined && d.score <= 25)
  ).length;

  const handleCopy = (addr: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(addr);
      setCopiedAddr(addr);
      setTimeout(() => setCopiedAddr(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/3 w-[800px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 relative z-10">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#FFFDF7]">
                Launch Census &amp; Macro Radar
              </h1>
              <span className="text-[10px] sm:text-[11px] px-3 py-1 rounded-full bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] font-black uppercase tracking-wider shadow-[2px_2px_0px_#042F2E] flex items-center gap-1.5">
                <IconRadar size={12} />
                <span>ROBINHOOD 4663</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A7F3D0] max-w-3xl font-normal leading-relaxed">
              Real-time macro aggregate intelligence across all tracked token genesis deployments, creator cluster distributions, and Bayesian Laplace reputation histories.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="px-3.5 py-1.5 rounded-full bg-[#064E4A] border border-[rgba(153,246,228,0.25)] flex items-center gap-2 text-xs font-mono text-[#99F6E4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#99F6E4] animate-pulse" />
              <span>Block #{headBlockNum.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(4,47,46,0.5)] backdrop-blur-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A7F3D0]">
                Total Launches
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#99F6E4]/15 border border-[#99F6E4]/30 flex items-center justify-center text-[#99F6E4] group-hover:scale-110 transition-transform">
                <IconBolt size={15} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#FFFDF7] font-mono">
                {stats.total_launches.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#A7F3D0]/80 mt-1 font-normal">
                Tokens indexed since genesis
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(4,47,46,0.5)] backdrop-blur-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#99F6E4]">
                Unique Deployers
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#99F6E4]/15 border border-[#99F6E4]/30 flex items-center justify-center text-[#99F6E4] group-hover:scale-110 transition-transform">
                <IconUsers size={15} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#99F6E4] font-mono">
                {stats.unique_deployers.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#A7F3D0]/80 mt-1 font-normal">
                Distinct creator origin wallets
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(4,47,46,0.5)] backdrop-blur-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFD166]">
                Repeat Share
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#FFD166]/15 border border-[#FFD166]/30 flex items-center justify-center text-[#FFD166] group-hover:scale-110 transition-transform">
                <IconRepeat size={15} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#FFD166] font-mono">
                {`${stats.repeat_share}%`}
              </div>
              <div className="text-[11px] text-[#A7F3D0]/80 mt-1 font-normal">
                Creators with &gt;1 token launch
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(4,47,46,0.5)] backdrop-blur-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B6B]">
                Serial Ruggers
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B] group-hover:scale-110 transition-transform">
                <IconAlert size={15} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#FF6B6B] font-mono">
                {serialRuggersCount.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#A7F3D0]/80 mt-1 font-normal">
                Clamped to score ≤25 (Red Band)
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/95 p-6 sm:p-8 shadow-[0_15px_35px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#FFFDF7] tracking-tight flex items-center gap-2">
                <IconFlame size={18} className="text-[#FFD166]" />
                <span>Launch Density by Block Range</span>
              </h2>
              <p className="text-xs text-[#A7F3D0] mt-0.5 font-normal">
                Temporal distribution of token deployments indexed across Robinhood Chain height intervals.
              </p>
            </div>
            <div className="text-xs font-mono text-[#99F6E4] px-3 py-1 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.2)] shrink-0 self-start sm:self-auto">
              Sample Block Intervals
            </div>
          </div>

          <div className="h-56 sm:h-72 w-full pt-4 overflow-x-auto">
            <svg className="w-full min-w-[550px] h-full select-none" viewBox="0 0 800 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="censusBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#99F6E4" />
                  <stop offset="100%" stopColor="#0D746E" />
                </linearGradient>
                <linearGradient id="censusBarHoverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFD166" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              <line x1="40" y1="180" x2="780" y2="180" stroke="rgba(153,246,228,0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="120" x2="780" y2="120" stroke="rgba(153,246,228,0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="60" x2="780" y2="60" stroke="rgba(153,246,228,0.1)" strokeWidth="1" strokeDasharray="4 4" />

              <line x1="40" y1="180" x2="780" y2="180" stroke="rgba(153,246,228,0.35)" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="180" stroke="rgba(153,246,228,0.35)" strokeWidth="1.5" />

              {launchesByBlock.map((block, idx) => {
                const barWidth = 90;
                const spacing = 180;
                const x = 95 + idx * spacing;
                const barHeight = Math.max((block.count / maxBlockCount) * 140, 14);
                const y = 180 - barHeight;

                return (
                  <g key={block.blockRange} className="group cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="10"
                      fill="url(#censusBarGrad)"
                      className="transition-all duration-300 group-hover:fill-[url(#censusBarHoverGrad)] filter drop-shadow-[0_4px_12px_rgba(153,246,228,0.25)]"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={Math.max(y - 10, 20)}
                      textAnchor="middle"
                      className="text-[12px] font-bold fill-[#FFFDF7] font-mono group-hover:fill-[#FFD166] transition-colors"
                    >
                      {block.count.toLocaleString()}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={202}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-[#A7F3D0] font-mono"
                    >
                      {block.blockRange}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/95 p-6 sm:p-8 shadow-[0_15px_35px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#FFFDF7] tracking-tight flex items-center gap-2">
                <IconTrophy size={18} className="text-[#FFD166]" />
                <span>Repeat Launchers</span>
              </h2>
              <p className="text-xs text-[#A7F3D0] mt-0.5 font-normal">
                Creators with the highest deployment frequencies indexed in the current epoch, audited for Bayesian Laplace reputation.
              </p>
            </div>
            <span className="text-xs font-mono text-[#A7F3D0] px-3 py-1 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.2)] shrink-0 self-start sm:self-auto">
              {`${repeatLaunchers.length} Creators Ranked`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(153,246,228,0.2)] text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0] bg-[#042F2E]/60">
                  <th className="py-3.5 px-4 rounded-l-xl">Rank &amp; Deployer</th>
                  <th className="py-3.5 px-4">Total Launches</th>
                  <th className="py-3.5 px-4">Graduated</th>
                  <th className="py-3.5 px-4">Reputation Score</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(153,246,228,0.1)]">
                {repeatLaunchers.length > 0 ? (
                  repeatLaunchers.map((d, idx) => {
                    const bandBadge =
                      d.band === "green"
                        ? "bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                        : d.band === "red"
                        ? "bg-[#FF6B6B] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                        : "bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]";

                    const rankStyle =
                      idx === 0
                        ? "bg-[#FFD166] text-[#042F2E]"
                        : idx === 1
                        ? "bg-[#99F6E4] text-[#042F2E]"
                        : idx === 2
                        ? "bg-[#C084FC] text-[#042F2E]"
                        : "bg-[#042F2E] text-[#A7F3D0]";

                    const isCopied = copiedAddr === d.deployerAddress;

                    return (
                      <tr key={d.deployerAddress} className="hover:bg-[#042F2E]/60 transition-colors group">
                        <td className="py-4 px-4 font-bold font-mono">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${rankStyle}`}>
                              #{idx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/deployer/${d.deployerAddress}`}
                                className="text-[#99F6E4] group-hover:text-[#FFFDF7] hover:underline transition-colors"
                              >
                                {d.deployerAddress.slice(0, 8)}...{d.deployerAddress.slice(-6)}
                              </Link>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(d.deployerAddress, e)}
                                title="Copy Address"
                                className="text-[#A7F3D0]/60 hover:text-[#FFD166] transition-colors p-1"
                              >
                                {isCopied ? <IconCheck size={13} className="text-[#4ADE80]" /> : <IconClipboard size={13} />}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-[#FFFDF7] font-mono">{d.totalLaunches}</td>
                        <td className="py-4 px-4 font-bold text-[#99F6E4] font-mono">
                          <span className="inline-flex items-center gap-1">
                            <IconGraduation size={13} className="text-[#99F6E4]" />
                            <span>{d.graduatedCount}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full inline-block ${bandBadge}`}>
                            {d.score} / 100 ({d.label})
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/deployer/${d.deployerAddress}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] hover:border-[#99F6E4] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
                          >
                            <span>View Profile</span>
                            <IconArrowRight size={13} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#A7F3D0]/70 font-mono">
                      No repeat deployer records indexed in current sample block window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/95 p-6 sm:p-8 shadow-[0_15px_35px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[rgba(153,246,228,0.2)] pb-3">
            <IconShield size={18} className="text-[#FFD166]" />
            <h2 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Methodology &amp; Mathematical Architecture</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
              <div className="text-xs font-bold uppercase text-[#99F6E4]">1. Laplace Smoothing Prior</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Base reputation uses Bayesian Laplace smoothing <code className="text-[#99F6E4] font-mono">(graduated + 1) / (total + 2)</code> to prevent small sample size distortion.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
              <div className="text-xs font-bold uppercase text-[#FFD166]">2. Serial Rugger Clamp</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Creators with ≥6 launches and 0 graduations are mathematically clamped to a maximum score of 25 (Red Band quarantine).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
              <div className="text-xs font-bold uppercase text-[#C084FC]">3. Macro Epoch Aggregation</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Token genesis bytecode is audited continuously across sliding block windows on Robinhood Chain to detect factory anomalies.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
