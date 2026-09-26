"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [blockHeight, setBlockHeight] = useState(initialBlockHeight);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (typeof window !== "undefined") {
      window.location.pathname = `/d/${encodeURIComponent(query)}`;
    }
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  const navLinks = [
    { href: "/", label: "Launch Feed" },
    { href: "/library", label: "Library" },
    { href: "/map", label: "Map" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/census", label: "Census" },
    { href: "/how", label: "How" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0b0e14]/95 backdrop-blur-md px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-mono font-black text-black text-xs sm:text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-base sm:text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                SCOUT
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">
                Dossier.OS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1.5 rounded-md transition-colors font-medium ${
                    active
                      ? "text-cyan-400 bg-cyan-950/40 border border-cyan-800/60"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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
              className="w-40 md:w-52 lg:w-64 bg-[#11161d] border border-gray-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all focus:w-72"
            />
            <button
              type="submit"
              className="absolute right-2 text-gray-400 hover:text-cyan-400 text-xs"
            >
              &crarr;
            </button>
          </form>

          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-[#11161d] border border-gray-800 rounded-lg font-mono text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Block #{blockHeight.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 bg-[#161c24] border border-cyan-800/60 text-cyan-300 rounded-lg font-semibold truncate max-w-[110px] sm:max-w-none">
                  {truncatedAddress}
                </span>
                <button
                  type="button"
                  onClick={onDisconnect}
                  className="font-mono text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onConnectWallet}
                className="font-mono text-xs px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-lg transition-colors shadow-sm shadow-cyan-400/20 whitespace-nowrap"
              >
                Connect Wallet
              </button>
            )}

            <button
              type="button"
              aria-label="Toggle Mobile Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 transition-colors focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 mt-2.5 pt-3 pb-2 space-y-3 font-mono animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearch} className="flex sm:hidden items-center px-1">
            <input
              type="text"
              placeholder="Search Token CA (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11161d] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg shrink-0"
            >
              Go
            </button>
          </form>

          <nav className="grid grid-cols-2 gap-1.5 px-1 text-xs">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-center font-medium border transition-colors ${
                    active
                      ? "text-cyan-300 bg-cyan-950/60 border-cyan-800"
                      : "text-gray-300 bg-[#11161d] border-gray-800 hover:border-gray-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
