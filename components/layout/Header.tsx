"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export interface HeaderProps {
  isAuthenticated?: boolean;
  walletAddress?: string | null;
  initialBlockHeight?: number;
  onConnectWallet?: () => void | Promise<void>;
  onDisconnect?: () => void | Promise<void>;
}

export function Header({
  isAuthenticated = false,
  walletAddress = null,
  initialBlockHeight = 21845120,
  onConnectWallet,
  onDisconnect,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [blockHeight, setBlockHeight] = useState(initialBlockHeight);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (typeof window !== "undefined") {
      window.location.pathname = `/d/${encodeURIComponent(query)}`;
    }
    setSearchQuery("");
  };

  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0b0e14]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-mono font-black text-black text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                SCOUT
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">
                Dossier.OS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            <Link
              href="/"
              className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-md transition-colors font-medium"
            >
              Launch Feed
            </Link>
            <Link
              href="/library"
              className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-md transition-colors"
            >
              Library
            </Link>
            <Link
              href="/map"
              className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-md transition-colors"
            >
              Map
            </Link>
            <Link
              href="/watchlist"
              className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-md transition-colors"
            >
              Watchlist
            </Link>
            <Link
              href="/census"
              className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-md transition-colors"
            >
              Census
            </Link>
            <Link
              href="/docs"
              className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-md transition-colors"
            >
              Docs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="relative hidden sm:flex items-center"
          >
            <input
              id="header-search-input"
              type="text"
              placeholder="Search CA (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 lg:w-64 bg-[#11161d] border border-gray-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all focus:w-72"
            />
            <button
              type="submit"
              className="absolute right-2 text-gray-400 hover:text-cyan-400 text-xs"
            >
              &crarr;
            </button>
          </form>

          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-[#11161d] border border-gray-800 rounded-lg font-mono text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Block #{blockHeight.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-1 bg-[#161c24] border border-cyan-800/60 text-cyan-300 rounded-lg font-semibold">
                  {truncatedAddress}
                </span>
                <button
                  type="button"
                  onClick={onDisconnect}
                  className="font-mono text-xs px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onConnectWallet}
                className="font-mono text-xs px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-lg transition-colors shadow-sm shadow-cyan-400/20"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
