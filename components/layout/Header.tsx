"use client";

import React, { useState } from "react";
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
  const [blockHeight] = useState(initialBlockHeight);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(153,246,228,0.25)] bg-[#064E4A]/95 backdrop-blur-2xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 shadow-[0_4px_20px_rgba(4,47,46,0.35)] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD166] via-[#14B8A6] to-[#4ADE80] p-[1.5px] shadow-[0_0_15px_rgba(20,184,166,0.4)] group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#042F2E] rounded-[10px] flex items-center justify-center font-sans font-black text-xs text-[#FFFDF7] group-hover:text-[#FFD166] transition-colors">
                S
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-base sm:text-lg font-black tracking-tight text-[#FFFDF7] group-hover:text-[#FFD166] transition-all">
                SCOUT
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-bold bg-[#99F6E4]/15 text-[#99F6E4] border border-[#99F6E4]/30 px-2 py-0.5 rounded-full shadow-inner">
                Dossier.OS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-[#042F2E]/70 border border-[rgba(153,246,228,0.25)] rounded-full p-1 shadow-inner backdrop-blur-md">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    active
                      ? "text-[#042F2E] bg-[#FFD166] border border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                      : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#99F6E4]/10"
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
              className="w-40 md:w-52 lg:w-64 bg-[#042F2E]/80 border border-[rgba(153,246,228,0.25)] rounded-full pl-4 pr-9 py-1.5 text-xs text-[#FFFDF7] font-mono placeholder-[#A7F3D0]/50 focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/40 transition-all duration-300 focus:w-72"
            />
            <button
              type="submit"
              className="absolute right-3 text-[#A7F3D0] hover:text-[#FFD166] text-xs font-bold transition-colors"
            >
              &crarr;
            </button>
          </form>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#042F2E]/80 border border-[rgba(153,246,228,0.25)] rounded-full font-mono text-[11px] text-[#A7F3D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]" />
            <span className="text-[#A7F3D0]/80">Block</span>
            <span className="font-bold text-[#FFFDF7]">#{blockHeight.toLocaleString()}</span>
            <span className="text-[9px] font-bold uppercase bg-[#FFD166]/20 text-[#FFD166] px-1.5 py-0.5 rounded border border-[#FFD166]/30">DEMO</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-[11px] sm:text-xs px-3 py-1.5 bg-[#042F2E] border border-[#99F6E4]/30 text-[#99F6E4] rounded-full font-semibold truncate max-w-[110px] sm:max-w-none shadow-sm">
                  {truncatedAddress}
                </span>
                <button
                  type="button"
                  onClick={onDisconnect}
                  className="font-sans text-[11px] sm:text-xs px-3 py-1.5 bg-[#FFFDF7]/10 hover:bg-[#FFFDF7]/20 text-[#A7F3D0] hover:text-[#FFFDF7] rounded-full transition-colors border border-[rgba(153,246,228,0.2)]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onConnectWallet}
                className="group relative flex items-center gap-1.5 font-sans text-xs px-4 py-2 bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] border-[1.5px] border-[#042F2E] font-extrabold rounded-full shadow-[3px_3px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200 whitespace-nowrap"
              >
                <span>Connect Wallet</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
              </button>
            )}

            <button
              type="button"
              aria-label="Toggle Mobile Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] hover:bg-[#99F6E4]/10 rounded-full border border-[rgba(153,246,228,0.25)] transition-colors focus:outline-none"
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
        <div className="md:hidden border-t border-[rgba(153,246,228,0.25)] mt-3 pt-3 pb-2 space-y-3 font-sans animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="flex sm:hidden items-center px-1">
            <input
              type="text"
              placeholder="Search Token CA (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-full px-4 py-2 text-xs text-[#FFFDF7] placeholder-[#A7F3D0]/60 focus:outline-none focus:border-[#FFD166] font-mono"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-[#FFD166] text-[#042F2E] text-xs font-black rounded-full border border-[#042F2E] shadow-[2px_2px_0px_#042F2E] shrink-0"
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
                      ? "text-[#042F2E] bg-[#FFD166] border-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]"
                      : "text-[#A7F3D0] bg-[#042F2E] border-[rgba(153,246,228,0.15)] hover:border-[#99F6E4]/40 hover:text-[#FFFDF7]"
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
