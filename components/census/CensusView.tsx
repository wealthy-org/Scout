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
  IconCpu,
  IconGraph,
  IconTarget,
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
  const [methodologyTab, setMethodologyTab] = useState<"laplace" | "epoch" | "matrix" | "simulator">("laplace");
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const [simLaunches, setSimLaunches] = useState<number>(8);
  const [simGraduated, setSimGraduated] = useState<number>(3);
  const [simDoa, setSimDoa] = useState<number>(1);
  const [simBurst, setSimBurst] = useState<number>(2);

  const safeSimGraduated = Math.min(simGraduated, simLaunches);
  const safeSimDoa = Math.min(simDoa, simLaunches);
  const safeSimBurst = Math.min(simBurst, simLaunches);

  const simRawLaplace = Math.round(((safeSimGraduated + 1) / (simLaunches + 2)) * 100);
  const simDoaRate = safeSimDoa / Math.max(simLaunches, 1);
  const simBurstRate = safeSimBurst / Math.max(simLaunches, 1);
  const simDoaPenalty = Math.round(Math.min(20 * simDoaRate, 30));
  const simBurstPenalty = Math.round(Math.min(15 * simBurstRate, 20));
  const simInterScore = Math.max(0, Math.min(100, simRawLaplace - simDoaPenalty - simBurstPenalty));
  const isSerialClamp = simLaunches >= 6 && safeSimGraduated === 0;
  const simFinalScore = isSerialClamp ? Math.min(simInterScore, 25) : simInterScore;

  const simLabel = simLaunches <= 1 ? "fresh" : simLaunches <= 5 ? "repeat" : "serial";
  const simBand = simFinalScore >= 65 ? "green" : simFinalScore >= 35 ? "yellow" : "red";

  const handleCopyFormula = (formula: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(formula);
      setCopiedFormula(key);
      setTimeout(() => setCopiedFormula(null), 2000);
    }
  };

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

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/95 p-6 sm:p-8 shadow-[0_15px_35px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.3)] flex items-center justify-center text-[#FFD166]">
                <IconShield size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">
                  Methodology &amp; Mathematical Architecture
                </h2>
                <p className="text-[11px] sm:text-xs text-[#A7F3D0]/80">
                  Bayesian inference parameters, empirical risk matrices, and statistical pipeline proofs
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#042F2E] rounded-2xl border border-[rgba(153,246,228,0.25)]" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={methodologyTab === "laplace"}
                onClick={() => setMethodologyTab("laplace")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  methodologyTab === "laplace"
                    ? "bg-[#99F6E4] text-[#042F2E] shadow-[2px_2px_0px_#042F2E] border border-[#042F2E]"
                    : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/20"
                }`}
              >
                <IconCpu size={13} />
                <span>Bayesian Model</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={methodologyTab === "epoch"}
                onClick={() => setMethodologyTab("epoch")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  methodologyTab === "epoch"
                    ? "bg-[#99F6E4] text-[#042F2E] shadow-[2px_2px_0px_#042F2E] border border-[#042F2E]"
                    : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/20"
                }`}
              >
                <IconGraph size={13} />
                <span>Pipeline &amp; Epoch</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={methodologyTab === "matrix"}
                onClick={() => setMethodologyTab("matrix")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  methodologyTab === "matrix"
                    ? "bg-[#99F6E4] text-[#042F2E] shadow-[2px_2px_0px_#042F2E] border border-[#042F2E]"
                    : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/20"
                }`}
              >
                <IconAlert size={13} />
                <span>Risk Matrix</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={methodologyTab === "simulator"}
                onClick={() => setMethodologyTab("simulator")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  methodologyTab === "simulator"
                    ? "bg-[#FFD166] text-[#042F2E] shadow-[2px_2px_0px_#042F2E] border border-[#042F2E]"
                    : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/20"
                }`}
              >
                <IconTarget size={13} />
                <span>Live Simulator</span>
              </button>
            </div>
          </div>

          {methodologyTab === "laplace" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#99F6E4]">
                      1. Laplace Smoothing Prior
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyFormula("S_Laplace(k, n) = ((k + 1) / (n + 2)) * 100", "laplace")}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[10px] font-mono text-[#99F6E4] border border-[rgba(153,246,228,0.2)] transition-colors"
                      title="Copy formula"
                    >
                      {copiedFormula === "laplace" ? <IconCheck size={11} className="text-[#4ADE80]" /> : <IconClipboard size={11} />}
                      <span>{copiedFormula === "laplace" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#064E4A]/80 border border-[rgba(153,246,228,0.15)] font-mono text-xs sm:text-sm text-[#FFFDF7] text-center">
                    S<sub>Laplace</sub>(k, n) = [(k + 1) / (n + 2)] × 100
                  </div>
                  <p className="text-xs text-[#A7F3D0] leading-relaxed">
                    Under a uniform Beta(1, 1) Bayesian prior, unobserved creators start at exactly 50.0 (maximum entropy). A creator with 1 launch and 1 graduation yields 66.7 score rather than a biased 100.0, eliminating small sample distortion.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFD166]">
                      2. Serial Rugger Hard-Clamp
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyFormula("n >= 6 && k == 0 => S_final <= 25", "clamp")}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[10px] font-mono text-[#FFD166] border border-[rgba(153,246,228,0.2)] transition-colors"
                      title="Copy formula"
                    >
                      {copiedFormula === "clamp" ? <IconCheck size={11} className="text-[#4ADE80]" /> : <IconClipboard size={11} />}
                      <span>{copiedFormula === "clamp" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#064E4A]/80 border border-[rgba(153,246,228,0.15)] font-mono text-xs sm:text-sm text-[#FFD166] text-center">
                    ∀ n ≥ 6 ∧ k = 0 ⟹ S<sub>final</sub> ≤ 25 (Red Band)
                  </div>
                  <p className="text-xs text-[#A7F3D0] leading-relaxed">
                    Creators deploying 6 or more contracts without achieving a single AMM migration trigger an empirical quarantine rule, overriding posterior smoothing and locking reputation to the high-hazard Red Band.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F87171]">
                      3. Dead-On-Arrival (DOA) Penalty
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyFormula("P_DOA = min(20 * (d / n), 30)", "doa")}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[10px] font-mono text-[#F87171] border border-[rgba(153,246,228,0.2)] transition-colors"
                      title="Copy formula"
                    >
                      {copiedFormula === "doa" ? <IconCheck size={11} className="text-[#4ADE80]" /> : <IconClipboard size={11} />}
                      <span>{copiedFormula === "doa" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#064E4A]/80 border border-[rgba(153,246,228,0.15)] font-mono text-xs sm:text-sm text-[#F87171] text-center">
                    P<sub>DOA</sub> = min(20 × [d / n], 30)
                  </div>
                  <p className="text-xs text-[#A7F3D0] leading-relaxed">
                    Tokens abandoned within 30 minutes of deployment with near-zero volume or liquidity draining impose a progressive subtraction of up to 30 penalty points against the creator base score.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C084FC]">
                      4. Rapid-Fire Burst Penalty
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyFormula("P_Burst = min(15 * (b / n), 20)", "burst")}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[10px] font-mono text-[#C084FC] border border-[rgba(153,246,228,0.2)] transition-colors"
                      title="Copy formula"
                    >
                      {copiedFormula === "burst" ? <IconCheck size={11} className="text-[#4ADE80]" /> : <IconClipboard size={11} />}
                      <span>{copiedFormula === "burst" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#064E4A]/80 border border-[rgba(153,246,228,0.15)] font-mono text-xs sm:text-sm text-[#C084FC] text-center">
                    P<sub>Burst</sub> = min(15 × [b / n], 20)
                  </div>
                  <p className="text-xs text-[#A7F3D0] leading-relaxed">
                    Spam genesis deployments occurring within &lt;15 blocks of a previous token launch signal automated factory bots, deducting up to 20 penalty points to disincentivize sybil clustering.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <IconShield size={16} className="text-[#99F6E4]" />
                  <span className="text-xs font-bold text-[#FFFDF7]">Final Reputation Formulation:</span>
                  <code className="text-xs font-mono text-[#99F6E4] bg-[#064E4A] px-2 py-0.5 rounded border border-[rgba(153,246,228,0.2)]">
                    S_final = clamp[0, 100]( S_Laplace - P_DOA - P_Burst )
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => setMethodologyTab("simulator")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FFD166] hover:underline"
                >
                  <span>Test with live simulator</span>
                  <IconArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {methodologyTab === "epoch" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-[#064E4A] border border-[rgba(153,246,228,0.2)] flex items-center justify-center text-xs font-black text-[#99F6E4]">
                    01
                  </div>
                  <div className="text-xs font-bold uppercase text-[#FFFDF7]">Bytecode Ingestion</div>
                  <p className="text-[11px] text-[#A7F3D0] leading-relaxed">
                    Continuously scans token creation traces and log topics across the 2,000,000 block Robinhood chain sliding window.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-[#064E4A] border border-[rgba(153,246,228,0.2)] flex items-center justify-center text-xs font-black text-[#FFD166]">
                    02
                  </div>
                  <div className="text-xs font-bold uppercase text-[#FFFDF7]">Creator Graphing</div>
                  <p className="text-[11px] text-[#A7F3D0] leading-relaxed">
                    Aggregates deployer addresses by nonce sequence, origin funding tree roots, and contract factory proxy patterns.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-[#064E4A] border border-[rgba(153,246,228,0.2)] flex items-center justify-center text-xs font-black text-[#4ADE80]">
                    03
                  </div>
                  <div className="text-xs font-bold uppercase text-[#FFFDF7]">AMM Migration Audit</div>
                  <p className="text-[11px] text-[#A7F3D0] leading-relaxed">
                    Listens for pool creation and liquidity lock events to certify genuine graduation onto Robinhood Swap AMM.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-[#064E4A] border border-[rgba(153,246,228,0.2)] flex items-center justify-center text-xs font-black text-[#F87171]">
                    04
                  </div>
                  <div className="text-xs font-bold uppercase text-[#FFFDF7]">Macro Aggregation</div>
                  <p className="text-[11px] text-[#A7F3D0] leading-relaxed">
                    Computes global metrics: Repeat deployer share, serial rugger density, and real-time network survival percentages.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#99F6E4]">
                    Repeat Launcher Share Metric Formulation
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyFormula("RepeatShare = (Sum(Launches from Repeat Deployers) / Total Launches) * 100", "repeatshare")}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[10px] font-mono text-[#99F6E4] border border-[rgba(153,246,228,0.2)] transition-colors self-start sm:self-auto"
                  >
                    {copiedFormula === "repeatshare" ? <IconCheck size={11} className="text-[#4ADE80]" /> : <IconClipboard size={11} />}
                    <span>{copiedFormula === "repeatshare" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-[#064E4A]/80 border border-[rgba(153,246,228,0.15)] font-mono text-xs sm:text-sm text-[#FFFDF7] text-center">
                  Repeat Share (%) = [ ∑<sub>i ∈ Repeat</sub> (Total Launches<sub>i</sub>) / Total Network Launches ] × 100
                </div>
                <p className="text-xs text-[#A7F3D0] leading-relaxed">
                  Repeat launchers are defined as any wallet address with ≥2 token creation transactions indexed within the sliding census window. A high repeat share (&gt;50%) indicates heavy concentration of speculative factory activity among few entities.
                </p>
              </div>
            </div>
          )}

          {methodologyTab === "matrix" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="overflow-x-auto rounded-2xl border border-[rgba(153,246,228,0.25)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#042F2E] text-[#99F6E4] uppercase tracking-wider font-bold border-b border-[rgba(153,246,228,0.2)]">
                    <tr>
                      <th className="py-3 px-4">Risk Band</th>
                      <th className="py-3 px-4">Score Range</th>
                      <th className="py-3 px-4">Cohort Label</th>
                      <th className="py-3 px-4">Mathematical Conditions</th>
                      <th className="py-3 px-4">Action / Protocol Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(153,246,228,0.1)] bg-[#042F2E]/60">
                    <tr className="hover:bg-[#064E4A]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#4ADE80] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                        <span>Green Band</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#FFFDF7]">65 – 100</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#4ADE80]/20 text-[#4ADE80] font-mono text-[10px] font-bold">
                          repeat / fresh
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#A7F3D0] font-mono text-[11px]">
                        k / n ≥ 0.5 ∧ P_DOA = 0
                      </td>
                      <td className="py-3.5 px-4 text-[#C3F8E3]">
                        Verified track record. Low hazard classification.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#064E4A]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#FBBF24] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                        <span>Yellow Band</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#FFFDF7]">35 – 64</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#FBBF24]/20 text-[#FBBF24] font-mono text-[10px] font-bold">
                          fresh / repeat
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#A7F3D0] font-mono text-[11px]">
                        n ≤ 5 ∨ (k / n &lt; 0.5 ∧ k &gt; 0)
                      </td>
                      <td className="py-3.5 px-4 text-[#C3F8E3]">
                        Inconclusive sample size or mixed graduation history.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#064E4A]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F87171] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                        <span>Red Band</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#FFFDF7]">0 – 34</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#F87171]/20 text-[#F87171] font-mono text-[10px] font-bold">
                          serial
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#F87171] font-mono text-[11px]">
                        (n ≥ 6 ∧ k = 0) ∨ P_DOA ≥ 20
                      </td>
                      <td className="py-3.5 px-4 text-[#FCA5A5] font-semibold">
                        Quarantine active. High rug probability warning flag.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-1.5">
                  <div className="text-xs font-bold uppercase text-[#99F6E4]">Fresh Deployers (n ≤ 1)</div>
                  <p className="text-xs text-[#A7F3D0] leading-relaxed">
                    First-time creators with no historical record. Bayesian score initializes at 50.0 prior to eliminate false-negative penalties.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-1.5">
                  <div className="text-xs font-bold uppercase text-[#FFD166]">Repeat Deployers (2 ≤ n ≤ 5)</div>
                  <p className="text-xs text-[#A7F3D0] leading-relaxed">
                    Intermediate creators accumulating empirical record. Prior weighting gradually diminishes as n increases.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-1.5">
                  <div className="text-xs font-bold uppercase text-[#F87171]">Serial Deployers (n ≥ 6)</div>
                  <p className="text-xs text-[#A7F3D0] leading-relaxed">
                    High-volume deployers. If graduation count remains 0, the hard-clamp restricts reputation to &le;25 unconditionally.
                  </p>
                </div>
              </div>
            </div>
          )}

          {methodologyTab === "simulator" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-5">
                  <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-3">
                    <div className="flex items-center gap-2">
                      <IconTarget size={16} className="text-[#FFD166]" />
                      <span className="text-xs font-bold text-[#FFFDF7] uppercase tracking-wider">
                        Interactive Parameter Controls
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSimLaunches(8);
                        setSimGraduated(3);
                        setSimDoa(1);
                        setSimBurst(2);
                      }}
                      className="text-[10px] font-mono text-[#99F6E4] hover:text-[#FFD166] transition-colors"
                    >
                      Reset Defaults
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#C3F8E3]">Total Deployments (n):</span>
                        <span className="font-mono font-bold text-[#FFD166]">{simLaunches}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={simLaunches}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSimLaunches(val);
                          if (simGraduated > val) setSimGraduated(val);
                          if (simDoa > val) setSimDoa(val);
                          if (simBurst > val) setSimBurst(val);
                        }}
                        className="w-full accent-[#FFD166] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#C3F8E3]">Graduated to AMM (k):</span>
                        <span className="font-mono font-bold text-[#4ADE80]">{safeSimGraduated}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={simLaunches}
                        value={safeSimGraduated}
                        onChange={(e) => setSimGraduated(Number(e.target.value))}
                        className="w-full accent-[#4ADE80] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#C3F8E3]">Dead-On-Arrival Drains (d):</span>
                        <span className="font-mono font-bold text-[#F87171]">{safeSimDoa}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={simLaunches}
                        value={safeSimDoa}
                        onChange={(e) => setSimDoa(Number(e.target.value))}
                        className="w-full accent-[#F87171] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#C3F8E3]">Rapid-Fire Spams (b):</span>
                        <span className="font-mono font-bold text-[#C084FC]">{safeSimBurst}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={simLaunches}
                        value={safeSimBurst}
                        onChange={(e) => setSimBurst(Number(e.target.value))}
                        className="w-full accent-[#C084FC] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#99F6E4]">
                        Simulated Output
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full ${
                          simBand === "green"
                            ? "bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/40"
                            : simBand === "yellow"
                            ? "bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40"
                            : "bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40"
                        }`}
                      >
                        {simBand.toUpperCase()} BAND
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#064E4A] border border-[rgba(153,246,228,0.2)] text-center space-y-1">
                      <div className="text-[10px] uppercase font-bold text-[#A7F3D0] tracking-wider">
                        Final Bayesian Score
                      </div>
                      <div
                        className={`text-4xl font-black font-mono ${
                          simBand === "green"
                            ? "text-[#4ADE80]"
                            : simBand === "yellow"
                            ? "text-[#FFD166]"
                            : "text-[#F87171]"
                        }`}
                      >
                        {simFinalScore} <span className="text-base font-normal text-[#A7F3D0]/60">/ 100</span>
                      </div>
                      <div className="text-xs font-bold text-[#C3F8E3] capitalize">
                        Classification: <span className="text-[#FFD166]">{simLabel}</span>
                      </div>
                    </div>

                    {isSerialClamp && (
                      <div className="p-2.5 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/50 flex items-center gap-2 text-xs text-[#FCA5A5] font-bold animate-pulse">
                        <IconAlert size={14} className="text-[#EF4444] shrink-0" />
                        <span>Serial Rugger Hard-Clamp Active (Clamped &le; 25)</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-[#064E4A]/60 border border-[rgba(153,246,228,0.15)] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#A7F3D0]">
                      <span>Raw Laplace:</span>
                      <span className="font-mono font-bold text-[#FFFDF7]">{simRawLaplace} pts</span>
                    </div>
                    <div className="flex justify-between text-[#F87171]">
                      <span>DOA Penalty:</span>
                      <span className="font-mono font-bold">-{simDoaPenalty} pts</span>
                    </div>
                    <div className="flex justify-between text-[#C084FC]">
                      <span>Burst Penalty:</span>
                      <span className="font-mono font-bold">-{simBurstPenalty} pts</span>
                    </div>
                    <div className="border-t border-[rgba(153,246,228,0.15)] pt-1.5 flex justify-between font-bold text-[#99F6E4]">
                      <span>Computed Score:</span>
                      <span className="font-mono">{simFinalScore} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
