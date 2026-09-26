import React from "react";
import type { DiffItem } from "@/types/diff";

export interface SinceLastCheckProps {
  diffs?: DiffItem[];
  lastCheckedAt?: string | Date | null;
}

export function SinceLastCheck({
  diffs = [],
  lastCheckedAt,
}: SinceLastCheckProps) {
  const activeDiffs = diffs.filter((d) => d.exceeded);

  const formatTimestamp = (val?: string | Date | null) => {
    if (!val) return "Initial snapshot";
    const d = typeof val === "string" ? new Date(val) : val;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatVal = (v: unknown) => {
    if (v === null || v === undefined) return "None";
    if (typeof v === "number") return `$${v.toLocaleString()}`;
    return String(v);
  };

  return (
    <div className="border border-border bg-surface p-4 shadow-sm font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-ink">
            Since Last Check
          </span>
          <span className="text-[10px] text-ink-muted">
            ({activeDiffs.length} trigger{activeDiffs.length === 1 ? "" : "s"})
          </span>
        </div>
        <div className="text-[10px] text-ink-muted">
          Last snapshot: {formatTimestamp(lastCheckedAt)}
        </div>
      </div>

      <div className="mt-3">
        {activeDiffs.length === 0 ? (
          <div className="flex items-center gap-2 py-3 text-xs text-ink-muted">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>No significant changes detected since your last check.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {activeDiffs.map((diff, idx) => {
              const isPositive = (diff.pctDelta ?? diff.delta ?? 0) >= 0;
              const hasPct = diff.pctDelta !== undefined;
              const hasDelta = diff.delta !== undefined;

              let badgeText = "TRIGGERED";
              if (hasPct && diff.pctDelta !== undefined) {
                badgeText = `${isPositive ? "+" : ""}${Math.round(diff.pctDelta)}%`;
              } else if (hasDelta && diff.delta !== undefined) {
                badgeText = `${isPositive ? "+" : ""}${Math.round(diff.delta)} pts`;
              }

              const isGreen =
                (diff.field === "fdv" || diff.field === "liquidity")
                  ? isPositive
                  : diff.field === "deployer_score"
                  ? isPositive
                  : false;

              return (
                <div
                  key={`${diff.field}-${idx}`}
                  className="border border-border bg-background p-3 transition-colors hover:border-ink"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-ink-muted">
                      {diff.label || diff.field}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        isGreen
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <span className="text-ink-muted truncate max-w-[80px]">
                      {formatVal(diff.oldVal)}
                    </span>
                    <span className="text-ink-muted">&rarr;</span>
                    <span className="font-bold text-ink truncate max-w-[90px]">
                      {formatVal(diff.newVal)}
                    </span>
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
