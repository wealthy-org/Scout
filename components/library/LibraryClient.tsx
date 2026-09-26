"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { DOSSIER_STATUSES, type DossierStatus } from "@/lib/db/schema";

export interface LibraryDossierCard {
  id: string;
  walletAddress: string;
  chainId: number;
  contractAddress: string;
  symbol: string | null;
  name: string | null;
  status: DossierStatus | null;
  reason?: string | null;
  thesis?: string | null;
  decisionReason?: string | null;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  originAuthor?: string | null;
  originAt?: Date | string | null;
}

export interface LibraryClientProps {
  initialDossiers: LibraryDossierCard[];
  isAuthenticated: boolean;
  userAddress?: string;
}

export function LibraryClient({
  initialDossiers,
  isAuthenticated,
  userAddress,
}: LibraryClientProps) {
  const [dossiers, setDossiers] = useState<LibraryDossierCard[]>(initialDossiers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDossiers = useMemo(() => {
    return dossiers.filter((item) => {
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const symbolMatch = item.symbol?.toLowerCase().includes(q) ?? false;
        const nameMatch = item.name?.toLowerCase().includes(q) ?? false;
        const caMatch = item.contractAddress.toLowerCase().includes(q);
        const thesisMatch = item.thesis?.toLowerCase().includes(q) ?? false;
        return symbolMatch || nameMatch || caMatch || thesisMatch;
      }
      return true;
    });
  }, [dossiers, selectedStatus, searchQuery]);

  const statsCount = useMemo(() => {
    return {
      watching: dossiers.filter((d) => d.status === "Watching").length,
      researching: dossiers.filter((d) => d.status === "Researching").length,
      inPosition: dossiers.filter((d) => d.status === "In position").length,
      passed: dossiers.filter((d) => d.status === "Passed").length,
    };
  }, [dossiers]);

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      setImportError("Please select a valid JSON export file to import.");
      return;
    }

    const file = files[0];
    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as {
        dossiers?: LibraryDossierCard[];
      };

      const res = await fetch("/api/library/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = (await res.json()) as {
        ok: boolean;
        importedCount?: number;
        skippedCount?: number;
        error?: string;
      };

      if (res.ok && data.ok) {
        setImportSuccess(
          `Successfully imported ${data.importedCount ?? 0} case files (${data.skippedCount ?? 0} skipped/existing).`
        );
        const refreshed = await fetch("/api/library");
        if (refreshed.ok) {
          const refData = (await refreshed.json()) as {
            ok: boolean;
            dossiers?: LibraryDossierCard[];
          };
          if (refData.dossiers) {
            setDossiers(refData.dossiers);
          }
        }
      } else {
        setImportError(data.error || "Failed to import library file.");
      }
    } catch {
      setImportError("Invalid JSON structure or import error.");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#00F0FF]/10 via-[#4D65FF]/10 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#00E599]/10 via-[#D946EF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 relative z-10 space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Case Files Library</h1>
              <span className="text-[11px] px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold tracking-wide">
                {`${filteredDossiers.length} of ${dossiers.length} CASE FILES`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
              Your personal repository of analyzed token contracts, hypotheses, and on-chain intelligence.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900/90 text-slate-200 font-semibold text-xs border border-slate-700/80 hover:bg-slate-800 transition-all duration-200"
              >
                Import JSON
              </button>

              <a
                href="/api/library/export"
                download
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                Export All
              </a>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-14 text-center space-y-4 shadow-2xl backdrop-blur-xl max-w-xl mx-auto my-8 sm:my-16">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-2xl font-bold text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              🔒
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Authentication Required</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Connect your Ethereum wallet using Sign-In with Ethereum (SIWE) to access, manage, and research private case files in your personal library.
            </p>
            <div className="pt-3">
              <Link
                href="/feed"
                className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider transition-all"
              >
                Browse Public Launch Feed →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-amber-500/20 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Watching</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{statsCount.watching}</div>
              </div>
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-cyan-500/20 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">Researching</div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400">{statsCount.researching}</div>
              </div>
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-emerald-500/20 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">In Position</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{statsCount.inPosition}</div>
              </div>
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-rose-500/20 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider mb-1">Passed</div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400">{statsCount.passed}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-md backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("ALL")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedStatus === "ALL"
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold"
                      : "bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:text-white"
                  }`}
                >
                  All ({dossiers.length})
                </button>

                {DOSSIER_STATUSES.map((st) => {
                  const isActive = selectedStatus === st;
                  const colorClass =
                    st === "Watching"
                      ? "text-amber-400 border-amber-500/30"
                      : st === "Researching"
                      ? "text-cyan-400 border-cyan-500/30"
                      : st === "In position"
                      ? "text-emerald-400 border-emerald-500/30"
                      : "text-rose-400 border-rose-500/30";

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-slate-700 text-white border border-slate-500 shadow-sm font-bold"
                          : `bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-200 ${colorClass}`
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Filter symbol, name, CA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500/60 transition-colors"
                />
              </div>
            </div>

            {filteredDossiers.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center space-y-3 backdrop-blur-xl">
                <div className="text-sm font-bold uppercase text-slate-400">No Case Files Found</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {searchQuery || selectedStatus !== "ALL"
                    ? "No dossier matches your search filter criteria. Try selecting another status or clearing the search text."
                    : "You haven't opened any research dossiers yet. Search a token contract address above to open your first case file."}
                </p>
                {dossiers.length === 0 && (
                  <Link
                    href="/feed"
                    className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
                  >
                    Browse Launch Feed →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredDossiers.map((item) => {
                  const updatedStr =
                    typeof item.updatedAt === "string"
                      ? item.updatedAt.slice(0, 10)
                      : item.updatedAt.toISOString().slice(0, 10);

                  const statusColor =
                    item.status === "In position"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(0,229,153,0.2)]"
                      : item.status === "Passed"
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(255,46,77,0.2)]"
                      : item.status === "Researching"
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(255,184,0,0.2)]";

                  return (
                    <div
                      key={item.id}
                      className="chroma-card-interactive rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E599] to-[#00F0FF] flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-md">
                              {(item.symbol || "T")[0]}
                            </div>
                            <span className="text-base font-extrabold text-white">{`$${item.symbol || "UNKNOWN"}`}</span>
                            <span className="text-xs font-semibold text-slate-400 truncate max-w-[100px]">
                              {item.name || "Token"}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border shrink-0 ${statusColor}`}
                          >
                            {item.status || "Draft"}
                          </span>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Contract Address</div>
                          <div className="text-xs font-mono font-medium text-slate-300 truncate bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800/80 mt-1">
                            {item.contractAddress}
                          </div>
                        </div>

                        {item.thesis && (
                          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                            <span className="font-bold text-cyan-400">Thesis: </span>
                            {item.thesis}
                          </div>
                        )}

                        <div className="text-[10px] text-slate-500 font-mono">
                          Last Updated: {updatedStr}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                        <Link
                          href={`/d/${item.contractAddress}`}
                          className="font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                        >
                          <span>Open Dossier</span>
                          <span>→</span>
                        </Link>

                        <a
                          href={`/api/dossier/${item.contractAddress}/export`}
                          download
                          className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                        >
                          Export MD
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">Import Dossiers Library</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportError(null);
                    setImportSuccess(null);
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Upload a Scout intelligence JSON export file to restore or merge saved case files into your personal library.
              </p>

              <form onSubmit={handleImportSubmit} className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-700 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                />

                {importError && (
                  <p className="text-xs text-rose-400 font-medium">{importError}</p>
                )}

                {importSuccess && (
                  <p className="text-xs text-emerald-400 font-medium">{importSuccess}</p>
                )}

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      setImportError(null);
                      setImportSuccess(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={importLoading}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    {importLoading ? "Importing..." : "Run Import"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
