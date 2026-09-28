"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { IconArrowRight } from "@/components/icons/Vectors";
import { useWallet } from "@/components/wallet/WalletContext";

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
  const { openModal } = useWallet();
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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[130px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 relative z-10 space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFFDF7] tracking-tight">Deployer Watchlist</h1>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] font-bold tracking-wide shadow-[2px_2px_0px_#042F2E]">
                {`${entries.length} / 30 TRACKED`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A7F3D0] mt-1.5 font-normal">
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
                className="w-full sm:w-72 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3.5 py-2 text-xs font-mono text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:outline-hidden focus:border-[#FFD166] transition-colors"
              />
              <button
                type="submit"
                disabled={adding || !newAddress.trim()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl pop-btn-yellow font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {adding ? "Adding..." : "+ Watch Deployer"}
              </button>
            </form>
          )}
        </div>

        {addError && (
          <div className="p-3 rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 text-[#FF6B6B] text-xs font-medium">
            {addError}
          </div>
        )}

        {!isAuthenticated ? (
          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-8 sm:p-14 text-center space-y-4 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl max-w-xl mx-auto my-8 sm:my-16">
            <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">Authentication Required</h2>
            <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
              Connect your Ethereum wallet via SIWE to save custom deployers to your watchlist, monitor launcher behavior, and track new tokens.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={openModal}
                className="inline-block px-5 py-2.5 rounded-xl pop-btn-yellow font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-10 sm:p-14 text-center space-y-2 backdrop-blur-xl shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)]">
            <h2 className="text-sm font-bold uppercase text-[#FFFDF7]">Your Watchlist is Empty</h2>
            <p className="text-xs text-[#A7F3D0] max-w-md mx-auto font-normal">
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

              const bandBadge =
                band === "green"
                  ? "bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                  : band === "red"
                  ? "bg-[#FF6B6B] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                  : "bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]";

              return (
                <div
                  key={item.id}
                  className="rounded-3xl p-5 sm:p-6 bg-[#064E4A] border border-[rgba(153,246,228,0.25)] shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-[rgba(153,246,228,0.2)] pb-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${bandBadge}`}
                      >
                        {label} • {band.toUpperCase()}
                      </span>

                      <span className="text-sm font-extrabold text-[#FFFDF7] tracking-wide">{`SCORE: ${score}`}</span>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] text-[#A7F3D0] uppercase tracking-wider mb-1">
                        Deployer Address
                      </div>
                      <Link
                        href={`/deployer/${item.deployerAddress}`}
                        className="text-xs font-semibold font-mono text-[#99F6E4] hover:text-[#FFFDF7] break-all transition-colors bg-[#042F2E] px-2.5 py-1 rounded-lg border border-[rgba(153,246,228,0.2)] block"
                      >
                        {item.deployerAddress}
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs mb-3">
                      <div>
                        <div className="text-[10px] text-[#A7F3D0] uppercase">Total Launches</div>
                        <div className="font-extrabold text-base text-[#FFFDF7] mt-0.5">{totalLaunches}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#A7F3D0] uppercase">Graduated</div>
                        <div className="font-extrabold text-base text-[#99F6E4] mt-0.5">{graduatedCount}</div>
                      </div>
                    </div>

                    {newLaunches > 0 && (
                      <div className="p-2.5 rounded-xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 text-[#99F6E4] text-xs font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#99F6E4] animate-ping" />
                        <span>{`+${newLaunches} new launches since last check`}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(153,246,228,0.2)] text-xs">
                    <Link
                      href={`/deployer/${item.deployerAddress}`}
                      className="font-bold text-[#99F6E4] hover:text-[#FFFDF7] flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Profile</span>
                      <IconArrowRight size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveDeployer(item.deployerAddress)}
                      disabled={deletingId === item.deployerAddress}
                      className="text-[#FF6B6B] hover:text-[#FA5252] text-xs font-semibold disabled:opacity-50 transition-colors px-3 py-1 rounded-lg bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/25"
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
