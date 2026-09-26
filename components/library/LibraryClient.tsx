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

  const handleExportAll = async () => {
    try {
      const res = await fetch("/api/library/export");
      if (!res.ok) return;
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scout-library-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      // Export error handling
    }
  };

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
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-24">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border-primary pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight">Case Files Library</h1>
              <span className="text-xs px-2 py-0.5 bg-bg-secondary border border-border-primary text-ink-secondary">
                {`${filteredDossiers.length} of ${dossiers.length} CASE FILES`}
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-1">
              Your personal repository of analyzed token contracts, hypotheses, and on-chain intelligence.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-bg-primary text-ink-primary font-bold text-xs border-2 border-border-primary shadow-neo-xs hover:bg-bg-secondary transition-colors"
              >
                + Import
              </button>
              <button
                type="button"
                onClick={handleExportAll}
                className="px-4 py-2 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-xs hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Export All
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="border-2 border-border-primary bg-bg-primary p-12 text-center shadow-neo-md max-w-xl mx-auto my-12">
            <h2 className="text-base font-bold uppercase mb-2">Authentication Required</h2>
            <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
              Connect your Ethereum wallet to access your saved case files, manage research theses, and export structured intelligence.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
            >
              Connect Wallet
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-sm">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Filter by Symbol, Name, CA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-canvas border-2 border-border-primary px-3 py-2 text-xs font-mono text-ink-primary placeholder:text-ink-tertiary focus:outline-hidden focus:border-accent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-ink-secondary uppercase">Status:</span>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("ALL")}
                  className={`text-xs px-2.5 py-1 border transition-colors ${
                    selectedStatus === "ALL"
                      ? "bg-accent text-accent-fg border-border-primary font-bold shadow-neo-xs"
                      : "bg-canvas border-border-secondary text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  ALL
                </button>
                {DOSSIER_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`text-xs px-2.5 py-1 border transition-colors ${
                      selectedStatus === st
                        ? "bg-accent text-accent-fg border-border-primary font-bold shadow-neo-xs"
                        : "bg-canvas border-border-secondary text-ink-secondary hover:text-ink-primary"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredDossiers.length === 0 ? (
              <div className="border-2 border-border-primary bg-bg-primary p-12 text-center shadow-neo-md">
                <h2 className="text-sm font-bold uppercase mb-1">
                  {dossiers.length === 0 ? "Your Library is Empty" : "No Case Files Found"}
                </h2>
                <p className="text-xs text-ink-secondary max-w-md mx-auto mb-6">
                  {dossiers.length === 0
                    ? "Start researching tokens from the Launch Feed or search bar to build your intelligence portfolio."
                    : "No case files matched your active search query or status filter."}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDossiers.map((item) => {
                  const updatedStr =
                    typeof item.updatedAt === "string"
                      ? item.updatedAt.slice(0, 10)
                      : item.updatedAt.toISOString().slice(0, 10);

                  return (
                    <div
                      key={item.id}
                      className="border-2 border-border-primary bg-bg-primary p-5 shadow-neo-sm flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-border-secondary pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black">{`$${item.symbol || "UNKNOWN"}`}</span>
                            <span className="text-xs font-bold text-ink-secondary truncate max-w-[120px]">
                              {item.name || "Token"}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border ${
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
                          <div className="text-[10px] text-ink-tertiary uppercase">Contract Address</div>
                          <div className="text-xs font-bold font-mono text-ink-primary truncate">
                            {item.contractAddress}
                          </div>
                        </div>

                        {item.thesis && (
                          <div className="p-3 bg-canvas border border-border-secondary text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                            <span className="font-bold text-accent">Thesis: </span>
                            {item.thesis}
                          </div>
                        )}

                        <div className="text-[10px] text-ink-tertiary">
                          Last Updated: {updatedStr}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border-secondary text-xs">
                        <Link
                          href={`/d/${item.contractAddress}`}
                          className="font-bold text-accent hover:underline flex items-center gap-1"
                        >
                          <span>Open Dossier</span>
                          <span>→</span>
                        </Link>

                        <a
                          href={`/api/dossier/${item.contractAddress}/export`}
                          download
                          className="text-[11px] font-bold text-ink-secondary hover:text-ink-primary hover:underline"
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
            <div className="bg-bg-primary border-2 border-border-primary p-6 max-w-lg w-full shadow-neo-lg space-y-4">
              <div className="flex items-center justify-between border-b-2 border-border-primary pb-3">
                <h3 className="text-base font-black uppercase">Import Dossiers Library</h3>
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
                  className="w-full text-xs font-mono p-2 bg-canvas border-2 border-border-primary"
                />

                {importError && (
                  <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger text-xs">
                    {importError}
                  </div>
                )}

                {importSuccess && (
                  <div className="p-3 bg-status-success/10 border border-status-success text-status-success text-xs">
                    {importSuccess}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      setImportError(null);
                      setImportSuccess(null);
                    }}
                    className="px-4 py-2 bg-bg-secondary border border-border-primary text-xs font-bold hover:bg-canvas"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={importLoading}
                    className="px-4 py-2 bg-accent text-accent-fg text-xs font-bold border-2 border-border-primary shadow-neo-xs hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
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
