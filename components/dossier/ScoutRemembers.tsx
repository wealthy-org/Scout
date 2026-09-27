"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { ConnectedDossierSummary } from "@/types/dossier";

export interface ScoutRemembersProps {
  deployerAddress?: string;
  dossiers?: ConnectedDossierSummary[];
  currentContractAddress?: string;
  isLoading?: boolean;
}

export function ScoutRemembers({
  deployerAddress,
  dossiers = [],
  currentContractAddress,
  isLoading = false,
}: ScoutRemembersProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDossiers = dossiers.filter(
    (d) =>
      !currentContractAddress ||
      d.contractAddress.toLowerCase() !== currentContractAddress.toLowerCase()
  );

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
    <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(153,246,228,0.2)] pb-3">
        <div className="flex items-center gap-2">
          <span className="font-sans font-bold uppercase tracking-wider text-[#FFFDF7]">
            Scout Remembers
          </span>
          <span className="text-[10px] text-[#A7F3D0]">
            ({filteredDossiers.length} prior case file
            {filteredDossiers.length === 1 ? "" : "s"})
          </span>
        </div>
        {deployerAddress && (
          <span className="text-[10px] text-[#A7F3D0]">
            Deployer: {deployerAddress.slice(0, 6)}...
            {deployerAddress.slice(-4)}
          </span>
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-[#A7F3D0]/70">
            Loading prior case memories...
          </div>
        ) : filteredDossiers.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#A7F3D0]/70 font-sans">
            Scout has no prior case files on this deployer. You are
            investigating this deployer for the first time.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredDossiers.map((dossier) => {
              const isExpanded = expandedIds[dossier.id] ?? false;
              const thesis = dossier.thesis || "No thesis recorded.";
              const shouldTruncate = thesis.length > 100;
              const displayThesis =
                shouldTruncate && !isExpanded
                  ? `${thesis.slice(0, 100)}...`
                  : thesis;

              let statusBadge = "bg-[#FFD166] text-[#042F2E]";
              if (dossier.status === "Passed") {
                statusBadge = "bg-[#99F6E4] text-[#042F2E]";
              } else if (dossier.status === "In position") {
                statusBadge = "bg-[#C084FC] text-[#042F2E]";
              }

              return (
                <div
                  key={dossier.id}
                  className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] p-4 transition-colors hover:border-[#99F6E4]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/d/${dossier.contractAddress}`}
                        className="font-bold text-[#FFFDF7] hover:text-[#99F6E4] hover:underline"
                      >
                        ${dossier.symbol || "UNKNOWN"}
                      </Link>
                      <span className="text-[10px] text-[#A7F3D0]">
                        {dossier.name}
                      </span>
                    </div>

                    <span
                      className={`border-[1.5px] border-[#042F2E] px-2 py-0.5 text-[9px] font-bold uppercase rounded-md shadow-[2px_2px_0px_#042F2E] ${statusBadge}`}
                    >
                      {dossier.status || "Watching"}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] leading-relaxed text-[#FFFDF7] font-sans">
                    {displayThesis}
                    {shouldTruncate && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(dossier.id)}
                        className="ml-1 font-bold text-[#99F6E4] hover:underline"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  {dossier.firstQuestion && (
                    <div className="mt-2 border-t border-[rgba(153,246,228,0.15)] pt-2 text-[10px] text-[#A7F3D0]">
                      <span className="font-bold text-[#FFFDF7]">Q1: </span>
                      {dossier.firstQuestion}
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between border-t border-[rgba(153,246,228,0.2)] pt-2 text-[10px] text-[#A7F3D0]">
                    <span>{formatDate(dossier.createdAt)}</span>
                    <Link
                      href={`/d/${dossier.contractAddress}`}
                      className="font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                    >
                      Open Case File &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
