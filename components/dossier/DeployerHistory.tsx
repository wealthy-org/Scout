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
    <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)]">
      <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-4">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
            Deployer History
          </span>
          <span className="font-mono text-[10px] text-[#A7F3D0]">
            ({items.length} of {displayTotal} launches)
          </span>
        </div>
        {deployerAddress && (
          <Link
            href={`/deployer/${deployerAddress}`}
            className="font-mono text-[11px] font-semibold text-[#99F6E4] underline underline-offset-2 hover:text-[#FFFDF7]"
          >
            View Full Profile &rarr;
          </Link>
        )}
      </div>

      <div className="mt-3 max-h-80 divide-y divide-[rgba(153,246,228,0.15)] overflow-y-auto font-mono text-xs">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#A7F3D0]/70">
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
                className={`flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-[#042F2E]/50 ${
                  launch.hasDossier
                    ? "border-l-2 border-[#99F6E4] bg-[#042F2E]/30"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#A7F3D0] text-[10px] w-5">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/d/${launch.contractAddress}`}
                        className="font-bold text-[#FFFDF7] hover:text-[#99F6E4] hover:underline"
                      >
                        ${launch.symbol || "UNKNOWN"}
                      </Link>

                      {isCurrent && (
                        <span className="rounded bg-[#042F2E] px-1 py-0.2 text-[9px] text-[#A7F3D0] border border-[rgba(153,246,228,0.2)]">
                          Current
                        </span>
                      )}

                      {launch.hasDossier && (
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase border-[1.5px] border-[#042F2E] ${
                            launch.dossierStatus === "active"
                              ? "bg-[#99F6E4] text-[#042F2E]"
                              : launch.dossierStatus === "rugged"
                              ? "bg-[#FF6B6B] text-[#042F2E]"
                              : "bg-[#FFD166] text-[#042F2E]"
                          }`}
                        >
                          Dossier ({launch.dossierStatus || "saved"})
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-[#A7F3D0]">
                      {launch.name || (launch.contractAddress ? launch.contractAddress.slice(0, 10) : "")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded-md ${
                      isGraduated
                        ? "border-[1.5px] border-[#042F2E] bg-[#99F6E4] text-[#042F2E]"
                        : "border border-[rgba(153,246,228,0.2)] bg-[#042F2E] text-[#A7F3D0]"
                    }`}
                  >
                    {launch.status || "curve"}
                  </span>

                  <span className="text-[10px] text-[#A7F3D0]">
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
