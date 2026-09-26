"use client";

import React from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import type { CensusPayload } from "@/lib/census/compute";

export interface CensusViewProps {
  stats: CensusPayload;
  userAddress?: string;
  isAuthenticated?: boolean;
}

export function CensusView({
  stats,
  userAddress,
  isAuthenticated = false,
}: CensusViewProps) {
  const launchesByBlock = stats.launches_by_block || [];
  const maxBlockCount = Math.max(...launchesByBlock.map((b) => b.count), 100);

  const repeatLaunchers = stats.repeat_launchers || [];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-24">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        <div className="border-b-2 border-border-primary pb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black uppercase tracking-tight">Robinhood Chain Launch Census</h1>
              <span className="text-xs px-2.5 py-0.5 bg-status-success/10 border border-status-success text-status-success font-bold">
                LIVE ON-CHAIN
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-1">
              Macro ecosystem intelligence, genesis deployer distribution, and bonding curve graduation velocity.
            </p>
          </div>

          <div className="text-right text-xs">
            <div className="text-ink-secondary">
              Head Block: <span className="font-bold text-ink-primary font-mono">{stats.head_block}</span>
            </div>
            <div className="text-[11px] text-ink-tertiary mt-0.5">
              Snapshot: {new Date(stats.computed_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Total Launches
            </div>
            <div className="text-4xl font-black tracking-tight">{stats.total_launches.toLocaleString()}</div>
            <div className="text-[11px] text-ink-tertiary mt-2">
              All tokens deployed via Pons V2 factory since genesis.
            </div>
          </div>

          <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Unique Deployers
            </div>
            <div className="text-4xl font-black tracking-tight text-accent">{stats.unique_deployers.toLocaleString()}</div>
            <div className="text-[11px] text-ink-tertiary mt-2">
              Distinct origin wallets that originated &gt;= 1 token launch.
            </div>
          </div>

          <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1">
              Repeat Share
            </div>
            <div className="text-4xl font-black tracking-tight text-status-warning">{`${stats.repeat_share}%`}</div>
            <div className="text-[11px] text-ink-tertiary mt-2">
              Percentage of creators with more than 1 deployed token.
            </div>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-md space-y-6">
          <div className="flex items-center justify-between border-b border-border-secondary pb-4">
            <div>
              <h2 className="text-base font-bold uppercase tracking-tight">Launch Density by Block Range</h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Distribution of genesis transactions across Robinhood Chain block heights.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
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

        <section className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-md space-y-6">
          <div className="flex items-center justify-between border-b border-border-secondary pb-4">
            <div>
              <h2 className="text-base font-bold uppercase tracking-tight">Repeat Launchers</h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Prominent serial deployers in the 6–60 launch cohort sorted by activity and graduation performance.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-bg-secondary border border-border-primary font-bold">
              TOP 6 COHORT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-border-primary bg-canvas text-ink-secondary uppercase">
                  <th className="py-3 px-4 font-bold">Deployer Address</th>
                  <th className="py-3 px-4 font-bold">Total Launches</th>
                  <th className="py-3 px-4 font-bold">Graduated</th>
                  <th className="py-3 px-4 font-bold">Reputation Score</th>
                  <th className="py-3 px-4 font-bold">Band Status</th>
                  <th className="py-3 px-4 font-bold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-secondary">
                {repeatLaunchers.map((launcher) => {
                  return (
                    <tr key={launcher.deployerAddress} className="hover:bg-canvas/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-mono">
                        <Link
                          href={`/deployer/${launcher.deployerAddress}`}
                          className="hover:text-accent hover:underline"
                        >
                          {launcher.deployerAddress}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-bold">{launcher.totalLaunches}</td>
                      <td className="py-3.5 px-4 font-bold text-status-success">{launcher.graduatedCount}</td>
                      <td className="py-3.5 px-4 font-bold">{launcher.score}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border ${
                            launcher.band === "green"
                              ? "bg-status-success/10 border-status-success text-status-success"
                              : launcher.band === "red"
                              ? "bg-status-danger/10 border-status-danger text-status-danger"
                              : "bg-status-warning/10 border-status-warning text-status-warning"
                          }`}
                        >
                          {launcher.label} • {launcher.band.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/deployer/${launcher.deployerAddress}`}
                          className="font-bold text-accent hover:underline"
                        >
                          Profile →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm space-y-4">
          <div className="border-b border-border-secondary pb-3">
            <h2 className="text-base font-bold uppercase tracking-tight">Methodology & Mathematical Basis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-ink-secondary">
            <div className="space-y-2">
              <h3 className="font-bold text-ink-primary uppercase">Repeat Deployer Definition & Scope</h3>
              <p>
                A repeat deployer is defined as any unique on-chain wallet address that has called the Pons V2 Factory launch function two or more times on Robinhood Chain (Chain ID: 4663). Data indexing strictly encompasses all contract creation events starting from genesis block 27,027,321.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-ink-primary uppercase">Reputation Scoring & Laplace Smoothing</h3>
              <p>
                Deployer scores evaluate graduation velocity, dead-on-arrival (DOA) frequency, and burst launch clustering. We apply Laplace rule-of-succession smoothing to prevent small sample size bias while penalizing repeat rug patterns without successful liquidity migrations.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
