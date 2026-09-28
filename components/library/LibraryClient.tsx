"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { DOSSIER_STATUSES, type DossierStatus } from "@/lib/db/schema";
import { IconLock, IconClose, IconArrowRight, IconWallet } from "@/components/icons/Vectors";
import { useWallet } from "@/components/wallet/WalletContext";

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
  const { openModal } = useWallet();
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
      };

      if (res.ok && data.ok) {
        setImportSuccess(`Successfully imported ${data.importedCount ?? 0} dossiers.`);
        if (parsed.dossiers && Array.isArray(parsed.dossiers)) {
          setDossiers((prev) => [...parsed.dossiers!, ...prev]);
        }
      } else {
        setImportError("Import failed. Please verify the JSON schema format.");
      }
    } catch {
      setImportError("Invalid JSON structure or import error.");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#FFD166]/15 via-[#C084FC]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 relative z-10 space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.25)] pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFFDF7] tracking-tight">Case Files Library</h1>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#99F6E4]/20 border border-[#99F6E4]/40 text-[#99F6E4] font-semibold tracking-wide">
                {`${filteredDossiers.length} of ${dossiers.length} CASE FILES`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A7F3D0] mt-1.5 font-normal">
              Your personal repository of analyzed token contracts, hypotheses, and on-chain intelligence.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#064E4A] text-[#FFFDF7] font-semibold text-xs border border-[rgba(153,246,228,0.25)] hover:bg-[#083835] transition-all duration-200"
              >
                Import JSON
              </button>

              <a
                href="/api/library/export"
                download
                className="px-4 py-2 rounded-xl bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] font-bold text-xs uppercase tracking-wider border-[1.5px] border-[#042F2E] shadow-[3px_3px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200"
              >
                Export All
              </a>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-8 sm:p-14 text-center space-y-4 shadow-[0_20px_50px_rgba(4,47,46,0.5)] backdrop-blur-xl max-w-xl mx-auto my-8 sm:my-16">
            <div className="w-14 h-14 rounded-2xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center mx-auto text-[#99F6E4] shadow-[0_0_20px_rgba(153,246,228,0.3)]">
              <IconLock size={26} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">Authentication Required</h2>
            <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
              Connect your Ethereum wallet using Sign-In with Ethereum (SIWE) to access, manage, and research private case files in your personal library.
            </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] border border-[#042F2E] font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#042F2E] transition-all cursor-pointer"
                >
                  <IconWallet size={14} />
                  <span>Connect Wallet</span>
                </button>
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 text-[#99F6E4] hover:text-[#FFFDF7] border border-[rgba(153,246,228,0.25)] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Browse Public Launch Feed</span>
                  <IconArrowRight size={14} />
                </Link>
              </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              <div className="rounded-2xl p-4 sm:p-5 bg-[#064E4A] border border-[#FFD166]/30 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-[#FFD166] uppercase tracking-wider mb-1">Watching</div>
                <div className="text-2xl sm:text-3xl font-black text-[#FFD166]">{statsCount.watching}</div>
              </div>
              <div className="rounded-2xl p-4 sm:p-5 bg-[#064E4A] border border-[#38BDF8]/30 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-[#38BDF8] uppercase tracking-wider mb-1">Researching</div>
                <div className="text-2xl sm:text-3xl font-black text-[#99F6E4]">{statsCount.researching}</div>
              </div>
              <div className="rounded-2xl p-4 sm:p-5 bg-[#064E4A] border border-[#4ADE80]/30 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-[#4ADE80] uppercase tracking-wider mb-1">In Position</div>
                <div className="text-2xl sm:text-3xl font-black text-[#4ADE80]">{statsCount.inPosition}</div>
              </div>
              <div className="rounded-2xl p-4 sm:p-5 bg-[#064E4A] border border-[#FB7185]/30 shadow-sm backdrop-blur-xl">
                <div className="text-[11px] font-semibold text-[#FB7185] uppercase tracking-wider mb-1">Passed</div>
                <div className="text-2xl sm:text-3xl font-black text-[#FB7185]">{statsCount.passed}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-3 sm:p-4 rounded-2xl shadow-md backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("ALL")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedStatus === "ALL"
                      ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                      : "bg-[#042F2E]/60 text-[#A7F3D0] border border-[rgba(153,246,228,0.2)] hover:text-[#FFFDF7]"
                  }`}
                >
                  All ({dossiers.length})
                </button>

                {DOSSIER_STATUSES.map((st) => {
                  const isActive = selectedStatus === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                          : "bg-[#042F2E]/60 text-[#A7F3D0] border border-[rgba(153,246,228,0.2)] hover:text-[#FFFDF7]"
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
                  className="w-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#FFFDF7] placeholder-[#A7F3D0]/50 focus:outline-hidden focus:border-[#FFD166] transition-colors"
                />
              </div>
            </div>

            {filteredDossiers.length === 0 ? (
              <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/80 p-8 sm:p-12 text-center space-y-3 backdrop-blur-xl">
                <div className="text-sm font-bold uppercase text-[#A7F3D0]">No Case Files Found</div>
                <p className="text-xs text-[#A7F3D0]/80 max-w-md mx-auto">
                  {searchQuery || selectedStatus !== "ALL"
                    ? "No dossier matches your search filter criteria. Try selecting another status or clearing the search text."
                    : "You haven't opened any research dossiers yet. Search a token contract address above to open your first case file."}
                </p>
                {dossiers.length === 0 && (
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD166] text-[#042F2E] border border-[#042F2E] font-bold text-xs shadow-[2px_2px_0px_#042F2E] hover:translate-x-[-1px] transition-all"
                  >
                    <span>Browse Launch Feed</span>
                    <IconArrowRight size={13} />
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
                      ? "bg-[#064E4A] border-[#86EFAC] text-[#4ADE80]"
                      : item.status === "Passed"
                      ? "bg-[#881337] border-[#FFE4E6] text-[#FB7185]"
                      : item.status === "Researching"
                      ? "bg-[#0C4A6E] border-[#7DD3FC] text-[#38BDF8]"
                      : "bg-[#78350F] border-[#FCD34D] text-[#FFD166]";

                  return (
                    <div
                      key={item.id}
                      className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-3">
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-8 h-8 rounded-xl bg-[#FFD166] flex items-center justify-center text-[#042F2E] border border-[#042F2E] font-black text-xs shrink-0 shadow-md">
                              {(item.symbol || "T")[0]}
                            </div>
                            <span className="text-base font-extrabold text-[#FFFDF7]">{`$${item.symbol || "UNKNOWN"}`}</span>
                            <span className="text-xs font-semibold text-[#A7F3D0] truncate max-w-[100px]">
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
                          <div className="text-[10px] text-[#A7F3D0] uppercase tracking-wider">Contract Address</div>
                          <div className="text-xs font-mono font-medium text-[#FFFDF7] truncate bg-[#042F2E] px-2.5 py-1 rounded-lg border border-[rgba(153,246,228,0.2)] mt-1">
                            {item.contractAddress}
                          </div>
                        </div>

                        {item.thesis && (
                          <div className="p-3.5 rounded-2xl bg-[#042F2E]/80 border border-[rgba(153,246,228,0.2)] text-xs text-[#FFFDF7] line-clamp-2 leading-relaxed font-normal">
                            <span className="font-bold text-[#FFD166]">Thesis: </span>
                            {item.thesis}
                          </div>
                        )}

                        <div className="text-[10px] text-[#A7F3D0] font-mono">
                          Last Updated: {updatedStr}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[rgba(153,246,228,0.2)] text-xs">
                        <Link
                          href={`/d/${item.contractAddress}`}
                          className="font-bold text-[#FFD166] hover:text-[#FFFDF7] flex items-center gap-1.5 text-xs transition-colors"
                        >
                          <span>Open Dossier</span>
                          <IconArrowRight size={13} />
                        </Link>

                        <a
                          href={`/api/dossier/${item.contractAddress}/export`}
                          download
                          className="text-[11px] font-semibold text-[#A7F3D0] hover:text-[#FFFDF7] transition-colors px-2.5 py-1 rounded-lg bg-[#042F2E] border border-[rgba(153,246,228,0.2)]"
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
          <div className="fixed inset-0 z-50 bg-[#042F2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.3)] rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.25)] pb-3">
                <h3 className="text-base font-bold text-[#FFFDF7] tracking-tight">Import Dossiers Library</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportError(null);
                    setImportSuccess(null);
                  }}
                  className="text-xs font-semibold text-[#A7F3D0] hover:text-[#FFFDF7] p-1 rounded-full hover:bg-[#14B8A6]/20 transition-colors"
                  aria-label="Close modal"
                >
                  <IconClose size={14} />
                </button>
              </div>

              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Upload a Scout intelligence JSON export file to restore or merge saved case files into your personal library.
              </p>

              <form onSubmit={handleImportSubmit} className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="w-full text-xs font-mono text-[#FFFDF7] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-[rgba(153,246,228,0.3)] file:text-xs file:font-semibold file:bg-[#042F2E] file:text-[#FFFDF7] hover:file:bg-[#083835]"
                />

                {importError && (
                  <p className="text-xs text-[#FB7185] font-medium">{importError}</p>
                )}

                {importSuccess && (
                  <p className="text-xs text-[#4ADE80] font-medium">{importSuccess}</p>
                )}

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[rgba(153,246,228,0.25)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      setImportError(null);
                      setImportSuccess(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-[rgba(153,246,228,0.25)] text-[#A7F3D0] text-xs font-semibold hover:bg-[#042F2E] transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={importLoading}
                    className="px-5 py-2 rounded-xl bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] border border-[#042F2E] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#042F2E] disabled:opacity-50 transition-all"
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
