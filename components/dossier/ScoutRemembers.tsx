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
    <div className="border border-border bg-surface p-4 shadow-sm font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-ink">
            Scout Remembers
          </span>
          <span className="text-[10px] text-ink-muted">
            ({filteredDossiers.length} prior case file
            {filteredDossiers.length === 1 ? "" : "s"})
          </span>
        </div>
        {deployerAddress && (
          <span className="text-[10px] text-ink-muted">
            Deployer: {deployerAddress.slice(0, 6)}...
            {deployerAddress.slice(-4)}
          </span>
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-ink-muted">
            Loading prior case memories...
          </div>
        ) : filteredDossiers.length === 0 ? (
          <div className="py-6 text-center text-xs text-ink-muted">
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

              let statusColor = "text-cyan-600 border-cyan-500/30 bg-cyan-500/10";
              if (dossier.status === "Passed") {
                statusColor =
                  "text-emerald-600 border-emerald-500/30 bg-emerald-500/10";
              } else if (dossier.status === "In position") {
                statusColor =
                  "text-purple-600 border-purple-500/30 bg-purple-500/10";
              }

              return (
                <div
                  key={dossier.id}
                  className="border border-border bg-background p-3 transition-colors hover:border-ink"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/d/${dossier.contractAddress}`}
                        className="font-bold text-ink hover:underline"
                      >
                        ${dossier.symbol || "UNKNOWN"}
                      </Link>
                      <span className="text-[10px] text-ink-muted">
                        {dossier.name}
                      </span>
                    </div>

                    <span
                      className={`border px-1.5 py-0.5 text-[9px] font-bold uppercase ${statusColor}`}
                    >
                      {dossier.status || "Watching"}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] leading-relaxed text-ink">
                    {displayThesis}
                    {shouldTruncate && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(dossier.id)}
                        className="ml-1 font-bold text-cyan-600 hover:underline"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  {dossier.firstQuestion && (
                    <div className="mt-2 border-t border-border/50 pt-2 text-[10px] text-ink-muted">
                      <span className="font-bold text-ink">Q1: </span>
                      {dossier.firstQuestion}
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[10px] text-ink-muted">
                    <span>{formatDate(dossier.createdAt)}</span>
                    <Link
                      href={`/d/${dossier.contractAddress}`}
                      className="font-bold text-cyan-600 hover:underline"
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
