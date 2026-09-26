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
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-gradient-to-b from-[#00E599]/10 via-[#00F0FF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader
        isAuthenticated={isAuthenticated}
        walletAddress={user?.walletAddress}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10">
        <div className="border-b border-slate-800/80 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Account Settings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
            Manage your researcher identity, handle alias, and account lifecycle.
          </p>
        </div>

        {!isAuthenticated || !user ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-xl max-w-xl mx-auto my-8 sm:my-16">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Authentication Required</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal my-4">
              Connect your Ethereum wallet to access account settings, configure research handles, and manage your intelligence profile.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
              >
                Connect Wallet
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-5">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Researcher Identity</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Connected Wallet</div>
                  <div className="text-xs font-bold font-mono text-cyan-400 break-all mt-1">{user.walletAddress}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Member Since</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateHandle} className="space-y-4 pt-2">
                <div>
                  <label htmlFor="handle-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Research Handle (Alias)
                  </label>
                  <input
                    id="handle-input"
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. onchain_sleuth"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500/60 transition-colors"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1.5 font-normal">
                    3–30 characters, alphanumeric and underscore only. Displayed on public published dossiers.
                  </span>
                </div>

                {handleError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                    {handleError}
                  </div>
                )}

                {handleSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                    {handleSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingHandle}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {savingHandle ? "Saving..." : "Save Handle"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-5">
              <div className="border-b border-slate-800/80 pb-4">
                <h2 className="text-base sm:text-lg font-bold text-rose-400 tracking-tight">Danger Zone</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  Permanent actions affecting your account and stored intelligence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-white">Delete Scout Account</div>
                  <p className="text-xs text-slate-400 max-w-md font-normal leading-relaxed">
                    Cascade delete all your saved case files, private notes, watchlist entries, and research sessions. This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-all shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        )}

        {isDeleteModalOpen && user && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-rose-400 tracking-tight">
                  Confirm Account Deletion
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteError(null);
                    setConfirmAddress("");
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                This will immediately purge your account and all associated dossiers from the database. Type your wallet address below to confirm:
              </p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 break-all">
                {user.walletAddress}
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <input
                  type="text"
                  placeholder="Paste wallet address to confirm"
                  value={confirmAddress}
                  onChange={(e) => setConfirmAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-hidden focus:border-rose-500"
                />

                {deleteError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
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
                    className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      deletingAccount ||
                      confirmAddress.trim().toLowerCase() !== user.walletAddress.toLowerCase()
                    }
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-500 disabled:opacity-50 transition-all"
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
