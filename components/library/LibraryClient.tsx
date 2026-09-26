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
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-16 sm:pb-24">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b-2 border-border-primary pb-4 sm:pb-6 mb-5 sm:mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Case Files Library</h1>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-bg-secondary border border-border-primary text-ink-secondary">
                {`${filteredDossiers.length} of ${dossiers.length} CASE FILES`}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-ink-secondary mt-1">
              Your personal repository of analyzed token contracts, hypotheses, and on-chain intelligence.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-bg-primary text-ink-primary font-bold text-xs border-2 border-border-primary shadow-neo-xs hover:bg-bg-secondary transition-colors"
              >
                Import JSON
              </button>

              <a
                href="/api/library/export"
                download
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-xs hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
              >
                Export All
              </a>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="border-2 border-border-primary bg-bg-primary p-6 sm:p-12 text-center space-y-4 shadow-neo-md max-w-xl mx-auto my-6 sm:my-12">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-border-primary flex items-center justify-center mx-auto text-xl font-bold text-accent">
              🔒
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase">Authentication Required</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Connect your Ethereum wallet using Sign-In with Ethereum (SIWE) to access, manage, and research private case files in your personal library.
            </p>
            <div className="pt-2">
              <Link
                href="/feed"
                className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-bg-secondary border-2 border-border-primary font-bold text-xs uppercase tracking-wider hover:bg-canvas transition-colors shadow-neo-sm"
              >
                Browse Public Launch Feed →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="p-3 sm:p-4 bg-bg-primary border-2 border-border-primary shadow-neo-xs">
                <div className="text-[10px] sm:text-xs text-ink-secondary uppercase font-bold">Watching</div>
                <div className="text-xl sm:text-2xl font-black text-status-warning">{statsCount.watching}</div>
              </div>
              <div className="p-3 sm:p-4 bg-bg-primary border-2 border-border-primary shadow-neo-xs">
                <div className="text-[10px] sm:text-xs text-ink-secondary uppercase font-bold">Researching</div>
                <div className="text-xl sm:text-2xl font-black text-accent">{statsCount.researching}</div>
              </div>
              <div className="p-3 sm:p-4 bg-bg-primary border-2 border-border-primary shadow-neo-xs">
                <div className="text-[10px] sm:text-xs text-ink-secondary uppercase font-bold">In Position</div>
                <div className="text-xl sm:text-2xl font-black text-status-success">{statsCount.inPosition}</div>
              </div>
              <div className="p-3 sm:p-4 bg-bg-primary border-2 border-border-primary shadow-neo-xs">
                <div className="text-[10px] sm:text-xs text-ink-secondary uppercase font-bold">Passed</div>
                <div className="text-xl sm:text-2xl font-black text-status-danger">{statsCount.passed}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bg-primary border-2 border-border-primary p-3 sm:p-4 shadow-neo-xs">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("ALL")}
                  className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold border transition-colors ${
                    selectedStatus === "ALL"
                      ? "bg-accent text-accent-fg border-border-primary"
                      : "bg-bg-secondary text-ink-secondary border-border-secondary hover:text-ink-primary"
                  }`}
                >
                  All ({dossiers.length})
                </button>

                {DOSSIER_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold border transition-colors ${
                      selectedStatus === st
                        ? "bg-accent text-accent-fg border-border-primary"
                        : "bg-bg-secondary text-ink-secondary border-border-secondary hover:text-ink-primary"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter symbol, name, CA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-canvas border border-border-primary px-3 py-1.5 text-xs text-ink-primary placeholder:text-ink-tertiary focus:outline-hidden focus:border-accent"
                />
              </div>
            </div>

            {filteredDossiers.length === 0 ? (
              <div className="border-2 border-border-primary bg-bg-primary p-8 sm:p-12 text-center space-y-3 shadow-neo-sm">
                <div className="text-sm font-bold uppercase text-ink-secondary">No Case Files Found</div>
                <p className="text-xs text-ink-tertiary max-w-md mx-auto">
                  {searchQuery || selectedStatus !== "ALL"
                    ? "No dossier matches your search filter criteria. Try selecting another status or clearing the search text."
                    : "You haven't opened any research dossiers yet. Search a token contract address above to open your first case file."}
                </p>
                {dossiers.length === 0 && (
                  <Link
                    href="/feed"
                    className="inline-block px-4 py-2 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
                  >
                    Browse Launch Feed →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {filteredDossiers.map((item) => {
                  const updatedStr =
                    typeof item.updatedAt === "string"
                      ? item.updatedAt.slice(0, 10)
                      : item.updatedAt.toISOString().slice(0, 10);

                  return (
                    <div
                      key={item.id}
                      className="border-2 border-border-primary bg-bg-primary p-3.5 sm:p-5 shadow-neo-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-border-secondary pb-2.5">
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-sm sm:text-base font-black">{`$${item.symbol || "UNKNOWN"}`}</span>
                            <span className="text-xs font-bold text-ink-secondary truncate max-w-[100px] sm:max-w-[120px]">
                              {item.name || "Token"}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2 py-0.5 border shrink-0 ${
                              item.status === "In position"
                                ? "bg-status-success/10 border-status-success text-status-success"
                                : item.status === "Passed"
                                ? "bg-status-danger/10 border-status-danger text-status-danger"
                                : "bg-status-warning/10 border-status-warning text-status-warning"
                            }`}
                          >
                            {item.status || "Draft"}
                          </span>
                        </div>

                        <div>
                          <div className="text-[9px] sm:text-[10px] text-ink-tertiary uppercase">Contract Address</div>
                          <div className="text-[11px] sm:text-xs font-bold font-mono text-ink-primary truncate">
                            {item.contractAddress}
                          </div>
                        </div>

                        {item.thesis && (
                          <div className="p-2.5 sm:p-3 bg-canvas border border-border-secondary text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                            <span className="font-bold text-accent">Thesis: </span>
                            {item.thesis}
                          </div>
                        )}

                        <div className="text-[10px] text-ink-tertiary">
                          Last Updated: {updatedStr}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border-secondary text-xs">
                        <Link
                          href={`/d/${item.contractAddress}`}
                          className="font-bold text-accent hover:underline flex items-center gap-1 text-[11px] sm:text-xs"
                        >
                          <span>Open Dossier</span>
                          <span>→</span>
                        </Link>

                        <a
                          href={`/api/dossier/${item.contractAddress}/export`}
                          download
                          className="text-[10px] sm:text-[11px] font-bold text-ink-secondary hover:text-ink-primary hover:underline"
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
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-bg-primary border-2 border-border-primary p-4 sm:p-6 max-w-lg w-full shadow-neo-lg space-y-4">
              <div className="flex items-center justify-between border-b-2 border-border-primary pb-3">
                <h3 className="text-sm sm:text-base font-black uppercase">Import Dossiers Library</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportError(null);
                    setImportSuccess(null);
                  }}
                  className="text-xs font-bold text-ink-secondary hover:text-ink-primary"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-ink-secondary leading-relaxed">
                Upload a Scout intelligence JSON export file to restore or merge saved case files into your personal library.
              </p>

              <form onSubmit={handleImportSubmit} className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:border-2 file:border-border-primary file:text-xs file:font-bold file:bg-bg-secondary file:text-ink-primary hover:file:bg-canvas"
                />

                {importError && (
                  <p className="text-xs text-status-danger font-bold">{importError}</p>
                )}

                {importSuccess && (
                  <p className="text-xs text-status-success font-bold">{importSuccess}</p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-border-secondary">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      setImportError(null);
                      setImportSuccess(null);
                    }}
                    className="px-4 py-2 border border-border-primary text-xs font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={importLoading}
                    className="px-5 py-2 bg-accent text-accent-fg font-black text-xs uppercase border-2 border-border-primary shadow-neo-xs disabled:opacity-50"
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
