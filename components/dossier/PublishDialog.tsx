"use client";

import React, { useState } from "react";
import { IconRocket } from "@/components/icons/Vectors";

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
  const [activeUrl, setActiveUrl] = useState<string | null>(initialPublishedUrl ?? null);
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

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        publicUrl?: string;
        snapshotId?: string;
      };

      if (!res.ok || !json.ok) {
        setError(json?.error || "Failed to publish dossier snapshot to registry");
        return;
      }

      const url = json?.publicUrl || `/p/${json?.snapshotId}`;
      setActiveUrl(url);
      if (onPublished && json?.snapshotId) {
        onPublished({ publicUrl: url, snapshotId: json.snapshotId });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network communication error while publishing snapshot"
      );
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#042F2E]/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-[rgba(153,246,228,0.3)] bg-[#064E4A] p-6 sm:p-7 shadow-2xl text-[#FFFDF7] font-sans backdrop-blur-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#14B8A6]/20 transition-colors"
          aria-label="Close dialog"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-[rgba(153,246,228,0.2)] pb-4">
          <div className="w-8 h-8 rounded-xl bg-[#FFD166] text-[#042F2E] border-[1.5px] border-[#042F2E] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#042F2E]">
            <IconRocket size={16} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#FFFDF7]">
              Publish Dossier Snapshot
            </h2>
            <p className="text-xs text-[#A7F3D0]">Create a permanent public case file link</p>
          </div>
        </div>

        {activeUrl ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 text-[#99F6E4] text-xs leading-relaxed">
              <p className="font-bold mb-1">Dossier successfully published!</p>
              <p className="text-[#FFFDF7]">
                Your snapshot is now publicly accessible via the permanent link below.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#A7F3D0] uppercase tracking-wider">
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
                  className="flex-1 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#FFFDF7] select-all focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl pop-btn-yellow font-bold text-xs transition-all"
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
                className="px-5 py-2 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] hover:bg-[#14B8A6]/30 text-[#FFFDF7] font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#FFFDF7]">{symbol ? `$${symbol}` : "TOKEN"}</span>
                <span className="text-[#A7F3D0] font-normal text-[11px] truncate max-w-[200px]">
                  {contractAddress}
                </span>
              </div>
              {name && <div className="text-[#A7F3D0]">{name}</div>}
              {thesis && (
                <div className="text-[#FFFDF7] text-[11px] mt-1 border-t border-[rgba(153,246,228,0.15)] pt-1 line-clamp-2">
                  <span className="font-semibold text-[#99F6E4]">Thesis:</span> {thesis}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#A7F3D0] uppercase tracking-wider">
                Analyst Handle (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 0xresearcher"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={30}
                className="w-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:outline-hidden focus:border-[#FFD166]"
              />
              <p className="text-[10px] text-[#A7F3D0]/80">
                Alphanumeric attribution shown publicly with this snapshot.
              </p>
            </div>

            {hasNotes && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
                <input
                  type="checkbox"
                  id="include-notes-checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="mt-0.5 rounded border-[#A7F3D0] bg-[#042F2E] text-[#FFD166] focus:ring-0"
                />
                <label
                  htmlFor="include-notes-checkbox"
                  className="text-xs text-[#A7F3D0] cursor-pointer select-none"
                >
                  <span className="font-bold text-[#FFFDF7]">Include private research notes</span>
                  <span className="block text-[11px] text-[#A7F3D0]/80">
                    By default, raw personal notes are excluded from public snapshots.
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 text-[#FF6B6B] text-xs">
                {error}
              </div>
            )}

            <div className="p-3 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] flex items-start gap-2 text-[11px] text-[#A7F3D0]">
              <svg className="h-4 w-4 text-[#A7F3D0] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                Publishing creates an immutable snapshot accessible to anyone with the link. You can revoke it anytime.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[rgba(153,246,228,0.2)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/30 text-[#A7F3D0] font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishClick}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl pop-btn-yellow font-bold text-xs transition-all disabled:opacity-50"
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
