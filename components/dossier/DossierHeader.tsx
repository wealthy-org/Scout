"use client";

import React, { useState } from "react";

export interface DossierHeaderProps {
  symbol: string;
  name: string;
  phase: "curve" | "graduated" | "swept" | string;
  contractAddress: string;
  onRefresh?: () => void | Promise<void>;
  onPublish?: () => void;
  onDelete?: () => void | Promise<void>;
  isRefreshing?: boolean;
  isPublishing?: boolean;
  isDeleting?: boolean;
  defaultExportOpen?: boolean;
}

export function DossierHeader({
  symbol,
  name,
  phase,
  contractAddress,
  onRefresh,
  onPublish,
  onDelete,
  isRefreshing = false,
  isPublishing = false,
  isDeleting = false,
  defaultExportOpen = false,
}: DossierHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(defaultExportOpen);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isGraduated = phase === "graduated" || phase === "swept";

  return (
    <header className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl font-sans">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF7]">
              ${symbol || "UNKNOWN"}
            </span>

            <div className="flex flex-col items-start gap-1">
              <span className="text-xs sm:text-sm font-semibold text-[#A7F3D0]">
                {name || "Unnamed Token"}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border-[1.5px] border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E] ${
                  isGraduated
                    ? "bg-[#99F6E4] text-[#042F2E]"
                    : "bg-[#FFD166] text-[#042F2E]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isGraduated ? "bg-[#042F2E] animate-pulse" : "bg-[#042F2E]"
                  }`}
                />
                {isGraduated ? "Graduated" : "Bonding Curve"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title="Click to copy contract address"
            className="group flex items-center gap-2 rounded-xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] px-3 py-1.5 font-mono text-xs text-[#A7F3D0] hover:border-[#99F6E4] hover:text-[#FFFDF7] transition-all duration-200"
          >
            <span className="truncate max-w-[200px] sm:max-w-none">{contractAddress}</span>
            <svg
              className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {copied ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              )}
            </svg>
            {copied && <span className="text-[#99F6E4] font-bold">Copied</span>}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] px-3.5 py-2 text-xs font-semibold text-[#FFFDF7] hover:bg-[#14B8A6]/30 disabled:opacity-50 transition-all"
          >
            <svg
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 rounded-xl pop-btn-yellow px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] px-3.5 py-2 text-xs font-semibold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-all"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Export</span>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExportOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-1.5 shadow-2xl space-y-1">
                <a
                  href={`/api/dossier/${contractAddress}/export.md`}
                  download={`dossier-${symbol.toLowerCase()}.md`}
                  onClick={() => setIsExportOpen(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#FFFDF7] hover:bg-[#064E4A] transition-colors"
                >
                  <span className="font-mono text-[#99F6E4] font-bold">.MD</span>
                  <span>Markdown File</span>
                </a>
                <a
                  href="/api/library/export"
                  download="scout-library-export.json"
                  onClick={() => setIsExportOpen(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#FFFDF7] hover:bg-[#064E4A] transition-colors"
                >
                  <span className="font-mono text-[#FFD166] font-bold">.JSON</span>
                  <span>Full Library JSON</span>
                </a>
              </div>
            )}
          </div>

          <div className="relative">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={async () => {
                    setShowDeleteConfirm(false);
                    if (onDelete) await onDelete();
                  }}
                  disabled={isDeleting}
                  className="rounded-xl border-[1.5px] border-[#042F2E] bg-[#FF6B6B] px-3 py-1.5 text-xs font-bold text-[#042F2E] hover:bg-[#FA5252] disabled:opacity-50 transition-all shadow-[2px_2px_0px_#042F2E]"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] px-3 py-1.5 text-xs text-[#A7F3D0] hover:text-[#FFFDF7]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#FF6B6B]/30 bg-[#FF6B6B]/15 px-3 py-2 text-xs font-semibold text-[#FF6B6B] hover:bg-[#FF6B6B]/25 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
