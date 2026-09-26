"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#00E599]/15 via-[#00F0FF]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <header className="border-b border-white/10 bg-[#080D1A]/85 backdrop-blur-xl px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-sm tracking-tight text-white hover:text-cyan-300 uppercase transition-colors">
              Scout // Dossier.OS
            </Link>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
              Public Snapshot View
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!revoked && (
              <button
                type="button"
                onClick={handleSaveCopy}
                disabled={saving || saveStatus === "saved" || saveStatus === "already_exists"}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <span>Saving...</span>
                ) : saveStatus === "saved" ? (
                  <span>✓ Saved to Library</span>
                ) : saveStatus === "already_exists" ? (
                  <span>✓ In Your Library</span>
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
              className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 font-semibold text-xs transition-colors"
            >
              Open in Scout
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {revoked && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300">
            <div className="flex items-center gap-2 font-bold text-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>This case file has been revoked by its author.</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              The analyst who published this dossier snapshot has marked it inactive. Snapshot data may no longer reflect their current findings.
            </p>
          </div>
        )}

        {saveStatus === "unauthorized" && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-slate-200 flex items-center justify-between text-xs">
            <span>Please log in with your wallet to save a copy of this dossier to your private library.</span>
            <Link href="/" className="font-bold underline text-cyan-400 hover:text-cyan-300">
              Connect Wallet
            </Link>
          </div>
        )}

        {saveStatus === "error" && errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs">
            {errorMessage}
          </div>
        )}

        <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl mb-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{`$${symbol}`}</h1>
                <span className="text-sm font-semibold text-slate-400">{name}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1.5 font-mono break-all bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
                CA: {ca}
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-400">
                Published by <span className="font-bold text-white">@{displayAuthor}</span>
              </div>
              {payload.publishedAt && (
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {new Date(payload.publishedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                Analyst Thesis
              </h2>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {payload.thesis || "No thesis provided in this snapshot."}
              </div>
            </div>

            {payload.notes && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Included Research Notes
                </h2>
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
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
