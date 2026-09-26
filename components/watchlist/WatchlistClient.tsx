"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export interface WatchlistItem {
  id: string;
  deployerAddress: string;
  createdAt: string;
  lastSeenAt: string;
  newLaunchesCount?: number;
  score?: {
    score: number;
    label: "fresh" | "repeat" | "serial";
    band: "green" | "yellow" | "red";
    totalLaunches: number;
    graduatedCount: number;
  } | null;
}

export interface WatchlistClientProps {
  initialEntries: WatchlistItem[];
  isAuthenticated: boolean;
  userAddress?: string;
}

export function WatchlistClient({
  initialEntries,
  isAuthenticated,
  userAddress,
}: WatchlistClientProps) {
  const [entries, setEntries] = useState<WatchlistItem[]>(initialEntries);
  const [newAddress, setNewAddress] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddDeployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    setAdding(true);
    setAddError(null);

    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deployer_address: newAddress.trim() }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        created?: boolean;
        deployer_address?: string;
        error?: string;
      };

      if (res.ok && data.ok) {
        setNewAddress("");
        const refreshed = await fetch("/api/watchlist");
        if (refreshed.ok) {
          const listData = (await refreshed.json()) as {
            ok: boolean;
            watchlist?: WatchlistItem[];
          };
          if (listData.watchlist) {
            setEntries(listData.watchlist);
          }
        }
      } else {
        setAddError(data.error || "Failed to add deployer to watchlist");
      }
    } catch {
      setAddError("Network error adding deployer");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveDeployer = async (address: string) => {
    setDeletingId(address);
    try {
      const res = await fetch(`/api/watchlist/${address}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEntries((prev) =>
          prev.filter((item) => item.deployerAddress.toLowerCase() !== address.toLowerCase())
        );
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-gradient-to-b from-[#FFB800]/10 via-[#00F0FF]/10 to-transparent blur-[130px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 relative z-10 space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Deployer Watchlist</h1>
              <span className="text-[11px] px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold tracking-wide">
                {`${entries.length} / 30 TRACKED`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
              Monitor repeat launchers, track token genesis events, and receive activity alerts.
            </p>
          </div>

          {isAuthenticated && (
            <form onSubmit={handleAddDeployer} className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <input
                type="text"
                placeholder="0x... deployer address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full sm:w-72 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500/60 transition-colors"
              />
              <button
                type="submit"
                disabled={adding || !newAddress.trim()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {adding ? "Adding..." : "+ Watch Deployer"}
              </button>
            </form>
          )}
        </div>

        {addError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {addError}
          </div>
        )}

        {!isAuthenticated ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-14 text-center space-y-4 shadow-2xl backdrop-blur-xl max-w-xl mx-auto my-8 sm:my-16">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Authentication Required</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Connect your Ethereum wallet via SIWE to save custom deployers to your watchlist, monitor launcher behavior, and track new tokens.
            </p>
            <div className="pt-3">
              <Link
                href="/"
                className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
              >
                Connect Wallet
              </Link>
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 sm:p-14 text-center space-y-2 backdrop-blur-xl">
            <h2 className="text-sm font-bold uppercase text-slate-300">Your Watchlist is Empty</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-normal">
              Add deployer addresses from token dossiers or use the search bar above to start monitoring serial creators.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {entries.map((item) => {
              const score = item.score?.score ?? 0;
              const band = item.score?.band ?? "yellow";
              const label = item.score?.label ?? "fresh";
              const totalLaunches = item.score?.totalLaunches ?? 0;
              const graduatedCount = item.score?.graduatedCount ?? 0;
              const newLaunches = item.newLaunchesCount ?? 0;

              const bandColor =
                band === "green"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(0,229,153,0.15)]"
                  : band === "red"
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(255,46,77,0.15)]"
                  : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(255,184,0,0.15)]";

              return (
                <div
                  key={item.id}
                  className="chroma-card-interactive rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${bandColor}`}
                      >
                        {label} • {band.toUpperCase()}
                      </span>

                      <span className="text-sm font-extrabold text-white tracking-wide">{`SCORE: ${score}`}</span>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                        Deployer Address
                      </div>
                      <Link
                        href={`/deployer/${item.deployerAddress}`}
                        className="text-xs font-semibold font-mono text-cyan-300 hover:text-white break-all transition-colors bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800/80 block"
                      >
                        {item.deployerAddress}
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs mb-3">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Total Launches</div>
                        <div className="font-extrabold text-base text-white mt-0.5">{totalLaunches}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Graduated</div>
                        <div className="font-extrabold text-base text-emerald-400 mt-0.5">{graduatedCount}</div>
                      </div>
                    </div>

                    {newLaunches > 0 && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>{`+${newLaunches} new launches since last check`}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <Link
                      href={`/deployer/${item.deployerAddress}`}
                      className="font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Profile</span>
                      <span>→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveDeployer(item.deployerAddress)}
                      disabled={deletingId === item.deployerAddress}
                      className="text-rose-400 hover:text-rose-300 text-xs font-semibold disabled:opacity-50 transition-colors px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20"
                    >
                      {deletingId === item.deployerAddress ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
