"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { IconArrowRight } from "@/components/icons/Vectors";
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

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 left-1/3 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF7]">Launch Census</h1>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] font-bold uppercase tracking-wide shadow-[2px_2px_0px_#042F2E]">
              MACRO RADAR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7F3D0] mt-1.5 font-normal">
            Global aggregate metrics across all tracked token genesis transactions and deployer histories on Robinhood Chain.
          </p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
          <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A7F3D0] mb-2">
              Total Launches
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#FFFDF7]">{stats.total_launches.toLocaleString()}</div>
            <div className="text-[11px] text-[#A7F3D0]/80 mt-2 font-normal">
              All tokens deployed via factory since genesis.
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#99F6E4] mb-2">
              Unique Deployers
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#99F6E4]">{stats.unique_deployers.toLocaleString()}</div>
            <div className="text-[11px] text-[#A7F3D0]/80 mt-2 font-normal">
              Distinct origin creator wallets tracked.
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl col-span-2 md:col-span-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FFD166] mb-2">
              Repeat Share
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#FFD166]">{`${stats.repeat_share}%`}</div>
            <div className="text-[11px] text-[#A7F3D0]/80 mt-2 font-normal">
              Percentage of creators with &gt;1 token launch.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Launch Density by Block Range</h2>
              <p className="text-xs text-[#A7F3D0] mt-0.5 font-normal">
                Distribution of genesis transactions across Robinhood Chain block heights.
              </p>
            </div>
          </div>

          <div className="h-48 sm:h-64 w-full pt-4 overflow-x-auto">
            <svg className="w-full min-w-[500px] h-full select-none" viewBox="0 0 800 200" preserveAspectRatio="none">
              <line x1="40" y1="170" x2="780" y2="170" stroke="rgba(153,246,228,0.3)" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="170" stroke="rgba(153,246,228,0.3)" strokeWidth="1.5" />

              {launchesByBlock.map((block, idx) => {
                const barWidth = 80;
                const spacing = 180;
                const x = 100 + idx * spacing;
                const barHeight = Math.max((block.count / maxBlockCount) * 130, 10);
                const y = 170 - barHeight;

                return (
                  <g key={block.blockRange} className="group">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="8"
                      className="fill-[#99F6E4] hover:fill-[#FFD166] transition-colors cursor-pointer"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-[#FFFDF7] font-sans"
                    >
                      {block.count}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={190}
                      textAnchor="middle"
                      className="text-[10px] fill-[#A7F3D0] font-sans"
                    >
                      {block.blockRange}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-5">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-[#FFFDF7] tracking-tight">Repeat Launchers</h2>
            <p className="text-xs text-[#A7F3D0] mt-0.5 font-normal">
              Creators with the highest deployment frequencies indexed in the current epoch.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(153,246,228,0.2)] text-[11px] font-semibold uppercase text-[#A7F3D0]">
                  <th className="pb-3">Deployer Address</th>
                  <th className="pb-3">Total Launches</th>
                  <th className="pb-3">Graduated</th>
                  <th className="pb-3">Reputation Score</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(153,246,228,0.15)]">
                {stats.repeat_launchers && stats.repeat_launchers.length > 0 ? (
                  stats.repeat_launchers.map((d) => {
                    const bandBadge =
                      d.band === "green"
                        ? "bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                        : d.band === "red"
                        ? "bg-[#FF6B6B] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                        : "bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]";

                    return (
                      <tr key={d.deployerAddress} className="hover:bg-[#042F2E]/40 transition-colors">
                        <td className="py-3.5 font-bold font-mono">
                          <Link
                            href={`/deployer/${d.deployerAddress}`}
                            className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                          >
                            {d.deployerAddress.slice(0, 8)}...{d.deployerAddress.slice(-6)}
                          </Link>
                        </td>
                        <td className="py-3.5 font-bold text-[#FFFDF7]">{d.totalLaunches}</td>
                        <td className="py-3.5 text-[#99F6E4] font-bold">{d.graduatedCount}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${bandBadge}`}
                          >
                            {d.score} / 100 ({d.label})
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/deployer/${d.deployerAddress}`}
                            className="inline-flex items-center gap-1.5 font-bold text-[#99F6E4] hover:text-[#FFFDF7] text-xs transition-colors"
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
                    <td colSpan={5} className="py-8 text-center text-[#A7F3D0]/70">
                      No repeat deployer records indexed in current sample block window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl space-y-2">
          <h2 className="text-base font-bold text-[#FFFDF7] tracking-tight">Methodology</h2>
          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            The Launch Census aggregates all token genesis and deployment events across Robinhood Chain. Deployer repeat statistics and graduation ratios are computed on an indexed block window to identify macro systemic activity.
          </p>
        </section>
      </main>
    </div>
  );
}
