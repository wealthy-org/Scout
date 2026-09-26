"use client";

import React from "react";
import Link from "next/link";

export interface DeployerLaunchItem {
  contractAddress: string;
  symbol: string;
  name?: string;
  status?: "graduated" | "bonding" | "curve" | "swept" | "dead" | string;
  launchedAt?: string | Date;
  hasDossier?: boolean;
  dossierStatus?: "active" | "passed" | "rugged" | "hold" | string;
}

export interface DeployerHistoryProps {
  launches?: DeployerLaunchItem[];
  totalLaunches?: number;
  deployerAddress?: string;
  currentContractAddress?: string;
}

export function DeployerHistory({
  launches = [],
  totalLaunches,
  deployerAddress,
  currentContractAddress,
}: DeployerHistoryProps) {
  const displayTotal = totalLaunches ?? launches.length;
  const items = launches.slice(0, 40);

  const formatDate = (val?: string | Date) => {
    if (!val) return "-";
    const d = typeof val === "string" ? new Date(val) : val;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Deployer History
          </span>
          <span className="font-mono text-[10px] text-ink-muted">
            ({items.length} of {displayTotal} launches)
          </span>
        </div>
        {deployerAddress && (
          <Link
            href={`/deployer/${deployerAddress}`}
            className="font-mono text-[11px] font-semibold text-cyan-600 underline underline-offset-2 hover:text-cyan-700 dark:text-cyan-400"
          >
            View Full Profile &rarr;
          </Link>
        )}
      </div>

      <div className="max-h-80 divide-y divide-border overflow-y-auto font-mono text-xs">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted">
            No launch history recorded
          </div>
        ) : (
          items.map((launch, idx) => {
            const isCurrent =
              currentContractAddress &&
              launch.contractAddress.toLowerCase() ===
                currentContractAddress.toLowerCase();
            const isGraduated =
              launch.status === "graduated" || launch.status === "swept";

            return (
              <div
                key={launch.contractAddress || idx}
                className={`flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/30 ${
                  launch.hasDossier
                    ? "border-l-2 border-cyan-500 bg-cyan-500/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-ink-muted text-[10px] w-5">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/d/${launch.contractAddress}`}
                        className="font-bold text-ink hover:underline"
                      >
                        ${launch.symbol || "UNKNOWN"}
                      </Link>

                      {isCurrent && (
                        <span className="rounded bg-neutral-200 px-1 py-0.2 text-[9px] text-ink-muted dark:bg-neutral-800">
                          Current
                        </span>
                      )}

                      {launch.hasDossier && (
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                            launch.dossierStatus === "active"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : launch.dossierStatus === "rugged"
                              ? "bg-red-500/20 text-red-600 dark:text-red-400"
                              : "bg-neutral-200 text-ink-muted dark:bg-neutral-800"
                          }`}
                        >
                          Dossier ({launch.dossierStatus || "saved"})
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-ink-muted">
                      {launch.name || (launch.contractAddress ? launch.contractAddress.slice(0, 10) : "")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                      isGraduated
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border border-neutral-300 bg-neutral-100 text-ink-muted dark:border-neutral-700 dark:bg-neutral-800"
                    }`}
                  >
                    {launch.status || "curve"}
                  </span>

                  <span className="text-[10px] text-ink-muted">
                    {formatDate(launch.launchedAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
