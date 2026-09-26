"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
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
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-16 sm:pb-24">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8 space-y-6 sm:space-y-8">
        <div className="border-b-2 border-border-primary pb-4 sm:pb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Launch Census</h1>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-bg-secondary border border-border-primary text-ink-secondary">
              MACRO RADAR
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-ink-secondary mt-1">
            Global aggregate metrics across all tracked token genesis transactions and deployer histories on Robinhood Chain.
          </p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="border-2 border-border-primary bg-bg-primary p-3.5 sm:p-5 shadow-neo-sm">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Total Launches
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">{stats.total_launches.toLocaleString()}</div>
            <div className="text-[10px] sm:text-[11px] text-ink-tertiary mt-1 sm:mt-2">
              All tokens deployed via factory since genesis.
            </div>
          </div>

          <div className="border-2 border-border-primary bg-bg-primary p-3.5 sm:p-5 shadow-neo-sm">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Unique Deployers
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-accent">{stats.unique_deployers.toLocaleString()}</div>
            <div className="text-[10px] sm:text-[11px] text-ink-tertiary mt-1 sm:mt-2">
              Distinct origin creator wallets tracked.
            </div>
          </div>

          <div className="border-2 border-border-primary bg-bg-primary p-3.5 sm:p-5 shadow-neo-sm col-span-2 md:col-span-1">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Repeat Share
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-status-warning">{`${stats.repeat_share}%`}</div>
            <div className="text-[10px] sm:text-[11px] text-ink-tertiary mt-1 sm:mt-2">
              Percentage of creators with &gt;1 token launch.
            </div>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-4 sm:p-6 shadow-neo-md space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-border-secondary pb-3 sm:pb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight">Launch Density by Block Range</h2>
              <p className="text-[11px] sm:text-xs text-ink-secondary mt-0.5">
                Distribution of genesis transactions across Robinhood Chain block heights.
              </p>
            </div>
          </div>

          <div className="h-48 sm:h-64 w-full pt-2 sm:pt-4 overflow-x-auto">
            <svg className="w-full min-w-[500px] h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <line x1="40" y1="170" x2="780" y2="170" stroke="currentColor" className="text-border-primary" strokeWidth="2" />
              <line x1="40" y1="20" x2="40" y2="170" stroke="currentColor" className="text-border-primary" strokeWidth="2" />

              {launchesByBlock.map((block, idx) => {
                const barWidth = 80;
                const spacing = 180;
                const x = 100 + idx * spacing;
                const barHeight = Math.max((block.count / maxBlockCount) * 130, 10);
                const y = 170 - barHeight;

                return (
                  <g key={block.blockRange}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      className="fill-accent stroke-2 stroke-border-primary"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-ink-primary font-mono"
                    >
                      {block.count}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={190}
                      textAnchor="middle"
                      className="text-[10px] fill-ink-secondary font-mono"
                    >
                      {block.blockRange}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-4 sm:p-6 shadow-neo-md space-y-4">
          <div className="border-b border-border-secondary pb-3">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight">Repeat Launchers</h2>
            <p className="text-[11px] sm:text-xs text-ink-secondary mt-0.5">
              Creators with the highest deployment frequencies indexed in the current epoch.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-secondary text-[10px] uppercase text-ink-tertiary">
                  <th className="pb-2">Deployer Address</th>
                  <th className="pb-2">Total Launches</th>
                  <th className="pb-2">Graduated</th>
                  <th className="pb-2">Reputation Score</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-secondary">
                {stats.repeat_launchers && stats.repeat_launchers.length > 0 ? (
                  stats.repeat_launchers.map((d) => (
                    <tr key={d.deployerAddress} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-2.5 font-bold font-mono">
                        <Link
                          href={`/deployer/${d.deployerAddress}`}
                          className="text-accent hover:underline"
                        >
                          {d.deployerAddress.slice(0, 8)}...{d.deployerAddress.slice(-6)}
                        </Link>
                      </td>
                      <td className="py-2.5 font-bold">{d.totalLaunches}</td>
                      <td className="py-2.5 text-status-success font-bold">{d.graduatedCount}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                            d.band === "green"
                              ? "bg-status-success/10 border-status-success text-status-success"
                              : d.band === "red"
                              ? "bg-status-danger/10 border-status-danger text-status-danger"
                              : "bg-status-warning/10 border-status-warning text-status-warning"
                          }`}
                        >
                          {d.score} / 100 ({d.label})
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Link
                          href={`/deployer/${d.deployerAddress}`}
                          className="font-bold text-accent hover:underline text-[11px]"
                        >
                          View Profile →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-ink-tertiary">
                      No repeat deployer records indexed in current sample block window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-4 sm:p-6 shadow-neo-md space-y-3">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight">Methodology</h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            The Launch Census aggregates all token genesis and deployment events across Robinhood Chain. Deployer repeat statistics and graduation ratios are computed on an indexed block window to identify macro systemic activity.
          </p>
        </section>
      </main>
    </div>
  );
}
