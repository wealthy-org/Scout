"use client";

import React, { useState } from "react";

export interface PublishDialogProps {
  contractAddress: string;
  symbol?: string;
  name?: string;
  thesis?: string;
  hasNotes?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (data: { publicUrl: string; snapshotId: string }) => void;
  initialPublishedUrl?: string | null;
}

export function PublishDialog({
  contractAddress,
  symbol,
  name,
  thesis,
  hasNotes = false,
  isOpen,
  onClose,
  onPublished,
  initialPublishedUrl,
}: PublishDialogProps) {
  const [handle, setHandle] = useState("");
  const [includeNotes, setIncludeNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(initialPublishedUrl || null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePublishClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/dossier/${contractAddress}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorHandle: handle.trim() || undefined,
          includeNotes,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.error || "Failed to publish dossier snapshot");
        return;
      }

      const url = json?.publicUrl || `/p/${json?.snapshotId}`;
      setActiveUrl(url);
      if (onPublished) {
        onPublished({ publicUrl: url, snapshotId: json?.snapshotId });
      }
    } catch {
      setError("Network error while publishing snapshot");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!activeUrl) return;
    const fullUrl = typeof window !== "undefined"
      ? `${window.location.origin}${activeUrl}`
      : activeUrl;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Publish Dossier Snapshot"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0E131F]/95 p-6 sm:p-7 shadow-2xl text-slate-100 font-sans backdrop-blur-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E599] to-[#00F0FF] flex items-center justify-center text-slate-950 font-bold text-sm shadow-md">
            🚀
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Publish Dossier Snapshot
            </h2>
            <p className="text-xs text-slate-400">Create a permanent public case file link</p>
          </div>
        </div>

        {activeUrl ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
              <p className="font-bold mb-1">Dossier successfully published!</p>
              <p className="text-slate-300">
                Your snapshot is now publicly accessible via the permanent link below.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Public Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}${activeUrl}`
                      : activeUrl
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 select-all focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {copied ? (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-white">{symbol ? `$${symbol}` : "TOKEN"}</span>
                <span className="text-slate-400 font-normal text-[11px] truncate max-w-[200px]">
                  {contractAddress}
                </span>
              </div>
              {name && <div className="text-slate-400">{name}</div>}
              {thesis && (
                <div className="text-slate-300 text-[11px] mt-1 border-t border-slate-800 pt-1 line-clamp-2">
                  <span className="font-semibold text-cyan-400">Thesis:</span> {thesis}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Analyst Handle (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 0xresearcher"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={30}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">
                Alphanumeric attribution shown publicly with this snapshot.
              </p>
            </div>

            {hasNotes && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <input
                  type="checkbox"
                  id="include-notes-checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
                />
                <label
                  htmlFor="include-notes-checkbox"
                  className="text-xs text-slate-300 cursor-pointer select-none"
                >
                  <span className="font-bold text-white">Include private research notes</span>
                  <span className="block text-[11px] text-slate-400">
                    By default, raw personal notes are excluded from public snapshots.
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-400">
              <svg className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                Publishing creates an immutable snapshot accessible to anyone with the link. You can revoke it anytime.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishClick}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <span>{loading ? "Publishing..." : "Publish Snapshot"}</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
