"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconCheck } from "@/components/icons/Vectors";

export interface PublicDossierPayload {
  symbol?: string;
  name?: string;
  contractAddress?: string;
  thesis?: string;
  notes?: string;
  authorHandle?: string;
  authorWallet?: string;
  publishedAt?: string | number | Date;
}

export interface PublicDossierClientProps {
  payload: PublicDossierPayload;
  revoked?: boolean;
  authorHandle?: string | null;
  slug: string;
}

export function PublicDossierClient({
  payload,
  revoked = false,
  authorHandle,
  slug,
}: PublicDossierClientProps) {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "already_exists" | "unauthorized" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveCopy = async () => {
    if (saving || saveStatus === "saved" || saveStatus === "already_exists") return;
    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/dossier/public/${slug}/save-copy`, {
        method: "POST",
      });

      if (res.status === 401) {
        setSaveStatus("unauthorized");
        return;
      }

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSaveStatus("error");
        setErrorMessage(json?.error || "Failed to save copy");
        return;
      }

      if (json?.already_existed) {
        setSaveStatus("already_exists");
      } else {
        setSaveStatus("saved");
      }
    } catch {
      setSaveStatus("error");
      setErrorMessage("Network error while saving copy");
    } finally {
      setSaving(false);
    }
  };

  const symbol = payload.symbol || "TOKEN";
  const name = payload.name || "Unknown Token";
  const ca = payload.contractAddress || "";
  const displayAuthor = authorHandle || payload.authorHandle || (payload.authorWallet ? `${payload.authorWallet.slice(0, 6)}...${payload.authorWallet.slice(-4)}` : "Anonymous");

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[120px] pointer-events-none -z-10" />

      <header className="border-b border-[rgba(153,246,228,0.2)] bg-[#064E4A]/90 backdrop-blur-xl px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-sm tracking-tight text-[#FFFDF7] hover:text-[#99F6E4] uppercase transition-colors">
              Scout // Dossier.OS
            </Link>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFD166] text-[#042F2E] border-[1.5px] border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]">
              Public Snapshot View
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!revoked && (
              <button
                type="button"
                onClick={handleSaveCopy}
                disabled={saving || saveStatus === "saved" || saveStatus === "already_exists"}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl pop-btn-yellow font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {saving ? (
                  <span>Saving...</span>
                ) : saveStatus === "saved" ? (
                  <>
                    <IconCheck size={14} />
                    <span>Saved to Library</span>
                  </>
                ) : saveStatus === "already_exists" ? (
                  <>
                    <IconCheck size={14} />
                    <span>In Your Library</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save a copy</span>
                  </>
                )}
              </button>
            )}
            <Link
              href={`/d/${ca}`}
              className="px-3.5 py-1.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-[#FFFDF7] hover:bg-[#14B8A6]/30 font-semibold text-xs transition-colors"
            >
              Open in Scout
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {revoked && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 text-[#FF6B6B]">
            <div className="flex items-center gap-2 font-bold text-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>This case file has been revoked by its author.</span>
            </div>
            <p className="text-xs text-[#A7F3D0] mt-1">
              The analyst who published this dossier snapshot has marked it inactive. Snapshot data may no longer reflect their current findings.
            </p>
          </div>
        )}

        {saveStatus === "unauthorized" && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFD166]/15 border border-[#FFD166]/40 text-[#FFFDF7] flex items-center justify-between text-xs">
            <span>Please log in with your wallet to save a copy of this dossier to your private library.</span>
            <Link href="/" className="font-bold underline text-[#FFD166] hover:text-[#FBBF24]">
              Connect Wallet
            </Link>
          </div>
        )}

        {saveStatus === "error" && errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 text-[#FF6B6B] text-xs">
            {errorMessage}
          </div>
        )}

        <div className="rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl mb-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-[#FFFDF7]">{`$${symbol}`}</h1>
                <span className="text-sm font-semibold text-[#A7F3D0]">{name}</span>
              </div>
              <div className="text-xs text-[#A7F3D0] mt-1.5 font-mono break-all bg-[#042F2E] px-3 py-1.5 rounded-lg border border-[rgba(153,246,228,0.2)]">
                CA: {ca}
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-[#A7F3D0]">
                Published by <span className="font-bold text-[#FFFDF7]">@{displayAuthor}</span>
              </div>
              {payload.publishedAt && (
                <div className="text-[11px] text-[#A7F3D0]/80 mt-0.5">
                  {new Date(payload.publishedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-[#99F6E4] uppercase tracking-wider mb-2">
                Analyst Thesis
              </h2>
              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs sm:text-sm text-[#FFFDF7] leading-relaxed whitespace-pre-wrap">
                {payload.thesis || "No thesis provided in this snapshot."}
              </div>
            </div>

            {payload.notes && (
              <div>
                <h2 className="text-xs font-bold text-[#A7F3D0] uppercase tracking-wider mb-2">
                  Included Research Notes
                </h2>
                <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs sm:text-sm leading-relaxed text-[#FFFDF7] whitespace-pre-wrap">
                  {payload.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
