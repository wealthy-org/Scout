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
      // Network error handling
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-24">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border-primary pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight">Deployer Watchlist</h1>
              <span className="text-xs px-2 py-0.5 bg-bg-secondary border border-border-primary text-ink-secondary">
                {`${entries.length} / 30 TRACKED`}
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-1">
              Monitor repeat launchers, track token genesis events, and receive activity alerts.
            </p>
          </div>

          {isAuthenticated && (
            <form onSubmit={handleAddDeployer} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="0x... deployer address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="bg-bg-primary border-2 border-border-primary px-3 py-2 text-xs font-mono text-ink-primary placeholder:text-ink-tertiary focus:outline-hidden focus:border-accent w-72"
              />
              <button
                type="submit"
                disabled={adding || !newAddress.trim()}
                className="px-4 py-2 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {adding ? "Adding..." : "+ Watch Deployer"}
              </button>
            </form>
          )}
        </div>

        {addError && (
          <div className="mb-6 p-3 bg-status-danger/10 border-2 border-status-danger text-status-danger text-xs">
            {addError}
          </div>
        )}

        {!isAuthenticated ? (
          <div className="border-2 border-border-primary bg-bg-primary p-12 text-center shadow-neo-md max-w-xl mx-auto my-12">
            <h2 className="text-base font-bold uppercase mb-2">Authentication Required</h2>
            <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
              Connect your Ethereum wallet via SIWE to save custom deployers to your watchlist, monitor launcher behavior, and track new tokens.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-accent text-accent-fg font-bold text-xs border-2 border-border-primary shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
            >
              Connect Wallet
            </Link>
          </div>
        ) : entries.length === 0 ? (
          <div className="border-2 border-border-primary bg-bg-primary p-12 text-center shadow-neo-md">
            <h2 className="text-sm font-bold uppercase mb-1">Your Watchlist is Empty</h2>
            <p className="text-xs text-ink-secondary max-w-md mx-auto">
              Add deployer addresses from token dossiers or use the search bar above to start monitoring serial creators.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((item) => {
              const score = item.score?.score ?? 0;
              const band = item.score?.band ?? "yellow";
              const label = item.score?.label ?? "fresh";
              const totalLaunches = item.score?.totalLaunches ?? 0;
              const graduatedCount = item.score?.graduatedCount ?? 0;
              const newLaunches = item.newLaunchesCount ?? 0;

              return (
                <div
                  key={item.id}
                  className="border-2 border-border-primary bg-bg-primary p-5 shadow-neo-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-border-secondary pb-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border ${
                          band === "green"
                            ? "bg-status-success/10 border-status-success text-status-success"
                            : band === "red"
                            ? "bg-status-danger/10 border-status-danger text-status-danger"
                            : "bg-status-warning/10 border-status-warning text-status-warning"
                        }`}
                      >
                        {label} • {band.toUpperCase()}
                      </span>

                      <span className="text-sm font-black">{`SCORE: ${score}`}</span>
                    </div>

                    <div className="mb-4">
                      <div className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-0.5">
                        Deployer Address
                      </div>
                      <Link
                        href={`/deployer/${item.deployerAddress}`}
                        className="text-xs font-bold font-mono text-ink-primary hover:text-accent hover:underline break-all"
                      >
                        {item.deployerAddress}
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-canvas border border-border-secondary text-xs mb-4">
                      <div>
                        <div className="text-[10px] text-ink-tertiary uppercase">Total Launches</div>
                        <div className="font-bold text-sm">{totalLaunches}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-ink-tertiary uppercase">Graduated</div>
                        <div className="font-bold text-sm text-status-success">{graduatedCount}</div>
                      </div>
                    </div>

                    {newLaunches > 0 && (
                      <div className="mb-4 p-2 bg-status-success/10 border border-status-success text-status-success text-[11px] font-bold">
                        {`+${newLaunches} new launches since last check`}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border-secondary text-xs">
                    <Link
                      href={`/deployer/${item.deployerAddress}`}
                      className="font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <span>→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveDeployer(item.deployerAddress)}
                      disabled={deletingId === item.deployerAddress}
                      className="text-status-danger hover:underline text-[11px] font-bold disabled:opacity-50"
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
