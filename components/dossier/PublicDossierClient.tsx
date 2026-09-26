"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface PublicDossierPayload {
  contractAddress?: string;
  symbol?: string;
  name?: string;
  thesis?: string;
  notes?: string;
  publishedAt?: string;
  authorWallet?: string;
  authorHandle?: string;
}

export interface PublicDossierClientProps {
  slug: string;
  authorHandle?: string | null;
  revoked?: boolean;
  payload: PublicDossierPayload;
}

export function PublicDossierClient({
  slug,
  authorHandle,
  revoked = false,
  payload,
}: PublicDossierClientProps) {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "already_exists" | "error" | "unauthorized">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveCopy = async () => {
    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/p/${slug}/save`, {
        method: "POST",
      });

      if (res.status === 401) {
        setSaveStatus("unauthorized");
        return;
      }

      const data = (await res.json()) as {
        ok: boolean;
        created?: boolean;
        already_exists?: boolean;
        contract_address?: string;
        error?: string;
      };

      if (res.status === 201 && data.created) {
        setSaveStatus("saved");
      } else if (res.status === 200 && data.already_exists) {
        setSaveStatus("already_exists");
      } else {
        setSaveStatus("error");
        setErrorMessage(data.error || "Failed to save copy");
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
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-20">
      <header className="border-b-2 border-border-primary bg-bg-primary px-6 py-3 sticky top-0 z-30 shadow-neo-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-sm tracking-widest text-ink-primary hover:text-accent uppercase">
              Scout // Dossier.OS
            </Link>
            <span className="text-xs px-2 py-0.5 bg-bg-secondary border border-border-primary text-ink-secondary">
              Public Snapshot View
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!revoked && (
              <button
                type="button"
                onClick={handleSaveCopy}
                disabled={saving || saveStatus === "saved" || saveStatus === "already_exists"}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
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
              href={`/dossier/${ca}`}
              className="px-3 py-1.5 bg-bg-primary text-ink-primary font-bold text-xs border border-border-primary hover:bg-bg-secondary transition-colors"
            >
              Open in Scout
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8">
        {revoked && (
          <div className="mb-6 p-4 bg-status-danger/10 border-2 border-status-danger text-status-danger">
            <div className="flex items-center gap-2 font-bold text-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>This case file has been revoked by its author.</span>
            </div>
            <p className="text-xs text-ink-secondary mt-1">
              The analyst who published this dossier snapshot has marked it inactive. Snapshot data may no longer reflect their current findings.
            </p>
          </div>
        )}

        {saveStatus === "unauthorized" && (
          <div className="mb-6 p-4 bg-status-warning/10 border-2 border-status-warning text-ink-primary flex items-center justify-between text-xs">
            <span>Please log in with your wallet to save a copy of this dossier to your private library.</span>
            <Link href="/" className="font-bold underline text-accent">
              Connect Wallet
            </Link>
          </div>
        )}

        {saveStatus === "error" && errorMessage && (
          <div className="mb-6 p-3 bg-status-danger/10 border border-status-danger text-status-danger text-xs">
            {errorMessage}
          </div>
        )}

        <div className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-md mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-border-primary pb-4 mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">{`$${symbol}`}</h1>
                <span className="text-sm font-semibold text-ink-secondary">{name}</span>
              </div>
              <div className="text-xs text-ink-tertiary mt-1 font-mono break-all">
                CA: {ca}
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-ink-secondary">
                Published by <span className="font-bold text-ink-primary">@{displayAuthor}</span>
              </div>
              {payload.publishedAt && (
                <div className="text-[11px] text-ink-tertiary mt-0.5">
                  {new Date(payload.publishedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-2">
                Analyst Thesis
              </h2>
              <div className="p-4 bg-canvas border border-border-primary text-xs leading-relaxed whitespace-pre-wrap">
                {payload.thesis || "No thesis provided in this snapshot."}
              </div>
            </div>

            {payload.notes && (
              <div>
                <h2 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-2">
                  Included Research Notes
                </h2>
                <div className="p-4 bg-canvas border border-border-secondary text-xs leading-relaxed text-ink-secondary whitespace-pre-wrap">
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
