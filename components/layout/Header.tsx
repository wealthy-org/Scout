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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090E]/85 backdrop-blur-2xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4D65FF] via-[#00F0FF] to-[#00E599] p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(0,229,153,0.5)] transition-all duration-300">
              <div className="w-full h-full bg-[#0E131F] rounded-[10px] flex items-center justify-center font-sans font-black text-xs text-white group-hover:text-cyan-300 transition-colors">
                S
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-base sm:text-lg font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-cyan-300 group-hover:to-emerald-400 transition-all">
                SCOUT
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full shadow-inner">
                Dossier.OS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-[#0D1322]/80 border border-white/10 rounded-full p-1 shadow-inner backdrop-blur-md">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    active
                      ? "text-slate-950 bg-gradient-to-r from-[#00E599] via-[#00F0FF] to-[#4D65FF] font-bold shadow-[0_0_20px_rgba(0,240,255,0.35)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
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
              className="w-40 md:w-52 lg:w-64 bg-[#0D1322]/90 border border-white/10 rounded-full pl-4 pr-9 py-1.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300 focus:w-72"
            />
            <button
              type="submit"
              className="absolute right-3 text-slate-400 hover:text-cyan-400 text-xs font-bold transition-colors"
            >
              &crarr;
            </button>
          </form>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#0D1322]/80 border border-white/10 rounded-full font-mono text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            <span className="text-slate-400">Block</span>
            <span className="font-bold text-white">#{blockHeight.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-[11px] sm:text-xs px-3 py-1.5 bg-[#0D1322] border border-cyan-500/30 text-cyan-300 rounded-full font-semibold truncate max-w-[110px] sm:max-w-none shadow-sm">
                  {truncatedAddress}
                </span>
                <button
                  type="button"
                  onClick={onDisconnect}
                  className="font-sans text-[11px] sm:text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full transition-colors border border-white/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onConnectWallet}
                className="group relative flex items-center gap-1.5 font-sans text-xs px-4 py-2 bg-gradient-to-r from-[#00E599] via-[#00F0FF] to-[#4D65FF] text-slate-950 font-extrabold rounded-full shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,229,153,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
              >
                <span>Connect Wallet</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
              </button>
            )}

            <button
              type="button"
              aria-label="Toggle Mobile Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white bg-[#0D1322] hover:bg-white/10 rounded-full border border-white/10 transition-colors focus:outline-none"
            >
              <svg
                className="w-4 h-4"
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
        <div className="md:hidden border-t border-white/10 mt-3 pt-3 pb-2 space-y-3 font-sans animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="flex sm:hidden items-center px-1">
            <input
              type="text"
              placeholder="Search Token CA (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1322] border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-[#00E599] to-[#00F0FF] text-slate-950 text-xs font-black rounded-full shrink-0"
            >
              Go
            </button>
          </form>

          <nav className="grid grid-cols-2 gap-2 px-1 text-xs">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-full text-center font-semibold border transition-all ${
                    active
                      ? "text-slate-950 bg-gradient-to-r from-[#00E599] via-[#00F0FF] to-[#4D65FF] border-transparent font-bold shadow-md shadow-cyan-500/20"
                      : "text-slate-300 bg-[#0D1322] border-white/5 hover:border-white/20 hover:text-white"
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
