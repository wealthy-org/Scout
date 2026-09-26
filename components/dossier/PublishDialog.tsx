"use client";

import React, { useState, useEffect, useCallback } from "react";

export interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
  symbol?: string;
  name?: string;
  thesis?: string;
  hasNotes?: boolean;
  initialPublishedUrl?: string;
  onPublish?: (
    handle?: string,
    includeNotes?: boolean
  ) => Promise<{ ok: boolean; slug?: string; url?: string; error?: string }>;
}

export function PublishDialog({
  isOpen,
  onClose,
  contractAddress,
  symbol,
  name,
  thesis,
  hasNotes = false,
  initialPublishedUrl,
  onPublish,
}: PublishDialogProps) {
  const [handle, setHandle] = useState("");
  const [includeNotes, setIncludeNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeUrl = publishedUrl || initialPublishedUrl || null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  const handlePublishClick = async () => {
    setLoading(true);
    setError(null);

    try {
      if (onPublish) {
        const res = await onPublish(handle || undefined, includeNotes);
        if (res.ok && res.url) {
          setPublishedUrl(res.url);
        } else {
          setError(res.error || "Failed to publish dossier");
        }
      } else {
        const res = await fetch(`/api/publish/${contractAddress}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            handle: handle.trim() || undefined,
            include_notes: includeNotes,
          }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          slug?: string;
          url?: string;
          error?: string;
        };
        if (data.ok && data.url) {
          setPublishedUrl(data.url);
        } else {
          setError(data.error || "Failed to publish dossier");
        }
      }
    } catch {
      setError("Network or server error while publishing");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!activeUrl) return;
    try {
      const fullUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${activeUrl}`
          : activeUrl;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-none border-2 border-border-primary bg-bg-primary p-6 shadow-neo-lg text-ink-primary font-mono">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ink-tertiary hover:text-ink-primary hover:bg-canvas transition-colors border border-border-secondary"
          aria-label="Close dialog"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-border-secondary pb-3">
          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <h2 className="text-base font-bold tracking-tight uppercase">
            Publish Dossier Snapshot
          </h2>
        </div>

        {activeUrl ? (
          <div className="space-y-4">
            <div className="p-4 bg-status-success/10 border-2 border-status-success text-status-success text-xs">
              <p className="font-bold mb-1">Dossier successfully published!</p>
              <p className="text-ink-secondary">
                Your snapshot is now publicly accessible via the permanent link below.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-ink-secondary uppercase">
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
                  className="flex-1 bg-canvas border border-border-primary px-3 py-2 text-xs font-mono text-ink-primary select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary hover:translate-x-0.5 hover:-translate-y-0.5 shadow-neo-sm transition-transform"
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
                className="px-4 py-2 bg-bg-secondary text-ink-primary font-bold text-xs border border-border-primary hover:bg-canvas transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-canvas border border-border-secondary text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>{symbol ? `$${symbol}` : "TOKEN"}</span>
                <span className="text-ink-secondary font-normal text-[11px] truncate max-w-[200px]">
                  {contractAddress}
                </span>
              </div>
              {name && <div className="text-ink-secondary">{name}</div>}
              {thesis && (
                <div className="text-ink-primary text-[11px] mt-1 border-t border-border-secondary pt-1 line-clamp-2">
                  <span className="font-semibold text-accent">Thesis:</span> {thesis}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-ink-secondary uppercase">
                Analyst Handle (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 0xresearcher"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={30}
                className="w-full bg-canvas border border-border-primary px-3 py-2 text-xs font-mono text-ink-primary placeholder:text-ink-tertiary focus:outline-hidden focus:border-accent"
              />
              <p className="text-[10px] text-ink-tertiary">
                Alphanumeric attribution shown publicly with this snapshot.
              </p>
            </div>

            {hasNotes && (
              <div className="flex items-start gap-2 p-3 bg-canvas border border-border-secondary">
                <input
                  type="checkbox"
                  id="include-notes-checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="mt-0.5 rounded-none border-border-primary text-accent focus:ring-0"
                />
                <label
                  htmlFor="include-notes-checkbox"
                  className="text-xs text-ink-primary cursor-pointer select-none"
                >
                  <span className="font-bold">Include private research notes</span>
                  <span className="block text-[11px] text-ink-secondary">
                    By default, raw personal notes are excluded from public snapshots.
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-2 bg-status-danger/10 border border-status-danger text-status-danger text-xs">
                {error}
              </div>
            )}

            <div className="p-3 bg-canvas/60 border border-border-secondary flex items-start gap-2 text-[11px] text-ink-secondary">
              <svg className="h-4 w-4 text-ink-tertiary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                Publishing creates an immutable snapshot accessible to anyone with the link. You can revoke it anytime.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-secondary">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-bg-secondary text-ink-primary font-bold text-xs border border-border-primary hover:bg-canvas transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishClick}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary hover:translate-x-0.5 hover:-translate-y-0.5 shadow-neo-sm transition-all disabled:opacity-50"
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
