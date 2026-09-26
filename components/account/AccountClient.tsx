"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export interface UserProfileData {
  walletAddress: string;
  handle: string | null;
  createdAt: string;
}

export interface AccountClientProps {
  isAuthenticated: boolean;
  user: UserProfileData | null;
}

export function AccountClient({ isAuthenticated, user }: AccountClientProps) {
  const [handle, setHandle] = useState(user?.handle || "");
  const [savingHandle, setSavingHandle] = useState(false);
  const [handleError, setHandleError] = useState<string | null>(null);
  const [handleSuccess, setHandleSuccess] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmAddress, setConfirmAddress] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleUpdateHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim();
    if (!clean) {
      setHandleError("Handle cannot be blank.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(clean)) {
      setHandleError("Handle must be 3-30 characters and alphanumeric or underscores only.");
      return;
    }

    setSavingHandle(true);
    setHandleError(null);
    setHandleSuccess(null);

    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: clean }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setHandleSuccess("Handle updated successfully.");
      } else {
        setHandleError(data.error || "Failed to update handle.");
      }
    } catch {
      setHandleError("Network error while updating handle.");
    } finally {
      setSavingHandle(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (confirmAddress.trim().toLowerCase() !== user.walletAddress.toLowerCase()) {
      setDeleteError("Typed address does not match your wallet address.");
      return;
    }

    setDeletingAccount(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm_address: confirmAddress.trim() }),
      });

      if (res.ok) {
        if (typeof window !== "undefined") {
          window.location.pathname = "/";
        }
      } else {
        const data = (await res.json()) as { error?: string };
        setDeleteError(data.error || "Failed to delete account.");
      }
    } catch {
      setDeleteError("Network error during account deletion.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-24">
      <GlobalHeader
        isAuthenticated={isAuthenticated}
        walletAddress={user?.walletAddress}
      />

      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-8">
        <div className="border-b-2 border-border-primary pb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight">Account Settings</h1>
          <p className="text-xs text-ink-secondary mt-1">
            Manage your researcher identity, handle alias, and account lifecycle.
          </p>
        </div>

        {!isAuthenticated || !user ? (
          <div className="border-2 border-border-primary bg-bg-primary p-12 text-center shadow-neo-md max-w-xl mx-auto my-12">
            <h2 className="text-base font-bold uppercase mb-2">Authentication Required</h2>
            <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
              Connect your Ethereum wallet to access account settings, configure research handles, and manage your intelligence profile.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
            >
              Connect Wallet
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="border-2 border-border-primary bg-bg-primary p-6 shadow-neo-sm space-y-4">
              <h2 className="text-base font-black uppercase">Researcher Identity</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-canvas border border-border-secondary">
                  <div className="text-[10px] uppercase font-bold text-ink-tertiary">Connected Wallet</div>
                  <div className="text-xs font-bold break-all mt-1">{user.walletAddress}</div>
                </div>

                <div className="p-3 bg-canvas border border-border-secondary">
                  <div className="text-[10px] uppercase font-bold text-ink-tertiary">Member Since</div>
                  <div className="text-xs font-bold mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateHandle} className="space-y-4 pt-2">
                <div>
                  <label htmlFor="handle-input" className="block text-xs font-bold uppercase mb-1">
                    Research Handle (Alias)
                  </label>
                  <input
                    id="handle-input"
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. onchain_sleuth"
                    className="w-full bg-canvas border-2 border-border-primary px-3 py-2 text-xs font-mono text-ink-primary focus:outline-hidden focus:border-accent"
                  />
                  <span className="text-[10px] text-ink-tertiary block mt-1">
                    3–30 characters, alphanumeric and underscore only. Displayed on public published dossiers.
                  </span>
                </div>

                {handleError && (
                  <div className="p-3 bg-status-danger/10 border border-status-danger text-status-danger text-xs">
                    {handleError}
                  </div>
                )}

                {handleSuccess && (
                  <div className="p-3 bg-status-success/10 border border-status-success text-status-success text-xs">
                    {handleSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingHandle}
                  className="px-5 py-2.5 bg-accent text-accent-fg font-bold text-xs uppercase tracking-wider border-2 border-border-primary shadow-neo-xs hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {savingHandle ? "Saving..." : "Save Handle"}
                </button>
              </form>
            </section>

            <section className="border-2 border-status-danger bg-bg-primary p-6 shadow-neo-sm space-y-4">
              <div className="border-b border-border-secondary pb-3">
                <h2 className="text-base font-black uppercase text-status-danger">Danger Zone</h2>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Permanent actions affecting your account and stored intelligence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase">Delete Scout Account</div>
                  <p className="text-xs text-ink-secondary max-w-md">
                    Cascade delete all your saved case files, private notes, watchlist entries, and research sessions. This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 bg-status-danger text-white font-bold text-xs uppercase border-2 border-border-primary shadow-neo-xs hover:opacity-90 transition-opacity shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        )}

        {isDeleteModalOpen && user && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-bg-primary border-2 border-status-danger p-6 max-w-md w-full shadow-neo-lg space-y-4">
              <div className="flex items-center justify-between border-b border-border-secondary pb-3">
                <h3 className="text-base font-black uppercase text-status-danger">
                  Confirm Account Deletion
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteError(null);
                    setConfirmAddress("");
                  }}
                  className="text-xs font-bold text-ink-secondary hover:text-ink-primary"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-ink-secondary leading-relaxed">
                This will immediately purge your account and all associated dossiers from the database. Type your wallet address below to confirm:
              </p>

              <div className="p-2.5 bg-canvas border border-border-secondary text-xs font-bold font-mono break-all">
                {user.walletAddress}
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <input
                  type="text"
                  placeholder="Paste wallet address to confirm"
                  value={confirmAddress}
                  onChange={(e) => setConfirmAddress(e.target.value)}
                  className="w-full bg-canvas border-2 border-border-primary px-3 py-2 text-xs font-mono text-ink-primary focus:outline-hidden focus:border-status-danger"
                />

                {deleteError && (
                  <div className="p-2.5 bg-status-danger/10 border border-status-danger text-status-danger text-xs">
                    {deleteError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteError(null);
                      setConfirmAddress("");
                    }}
                    className="px-4 py-2 bg-bg-secondary border border-border-primary text-xs font-bold hover:bg-canvas"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      deletingAccount ||
                      confirmAddress.trim().toLowerCase() !== user.walletAddress.toLowerCase()
                    }
                    className="px-4 py-2 bg-status-danger text-white text-xs font-bold border-2 border-border-primary shadow-neo-xs hover:opacity-90 disabled:opacity-50"
                  >
                    {deletingAccount ? "Deleting..." : "Permanently Delete"}
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
