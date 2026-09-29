"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/components/wallet/WalletContext";
import { IconAlert, IconClose } from "@/components/icons/Vectors";

export interface HeaderProps {
  isAuthenticated?: boolean;
  walletAddress?: string | null;
  initialBlockHeight?: number;
  onConnectWallet?: () => void | Promise<void>;
  onDisconnect?: () => void | Promise<void>;
}

export function Header({
  isAuthenticated,
  walletAddress,
  onConnectWallet,
  onDisconnect,
}: HeaderProps) {
  const pathname = usePathname();
  const wallet = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isAuthed = isAuthenticated !== undefined ? isAuthenticated : wallet.isAuthenticated;
  const activeAddress = walletAddress !== undefined ? walletAddress : wallet.userAddress;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && logoutModalOpen && !isLoggingOut) {
        setLogoutModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [logoutModalOpen, isLoggingOut]);

  const handleConnect = () => {
    if (onConnectWallet) {
      onConnectWallet();
    } else {
      wallet.openModal();
    }
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (onDisconnect) {
        await onDisconnect();
      } else {
        await wallet.disconnect();
      }
    } finally {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

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

  const truncatedAddress = activeAddress
    ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
    : "";

  const navLinks = [
    { href: "/feed", label: "Launch Feed" },
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

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAuthed ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-[11px] sm:text-xs px-3 py-1.5 bg-[#042F2E] border border-[#99F6E4]/30 text-[#99F6E4] rounded-full font-semibold truncate max-w-[110px] sm:max-w-none shadow-sm">
                  {truncatedAddress}
                </span>
                <button
                  type="button"
                  id="header-logout-button"
                  onClick={() => setLogoutModalOpen(true)}
                  className="font-sans text-[11px] sm:text-xs px-3 py-1.5 bg-[#FFFDF7]/10 hover:bg-[#FFFDF7]/20 text-[#A7F3D0] hover:text-[#FFFDF7] rounded-full transition-colors border border-[rgba(153,246,228,0.2)] cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                className="group relative flex items-center gap-1.5 font-sans text-xs px-4 py-2 bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] border-[1.5px] border-[#042F2E] font-extrabold rounded-full shadow-[3px_3px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200 whitespace-nowrap cursor-pointer"
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

      {logoutModalOpen && mounted && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#042F2E]/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoggingOut) {
              setLogoutModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] p-6 sm:p-8 text-[#FFFDF7] shadow-[6px_6px_0px_#042F2E] space-y-6 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444]">
                  <IconAlert size={18} />
                </div>
                <div>
                  <h3 id="logout-modal-title" className="text-base sm:text-lg font-black tracking-tight text-[#FFFDF7]">
                    Konfirmasi Keluar
                  </h3>
                  <p className="text-[11px] text-[#A7F3D0]/80">
                    Akhiri sesi autentikasi dompet Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Tutup dialog"
                disabled={isLoggingOut}
                onClick={() => setLogoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.2)] flex items-center justify-center text-[#A7F3D0] hover:text-[#FFFDF7] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <IconClose size={14} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-2">
              <div className="text-xs text-[#A7F3D0]">
                Dompet aktif yang terhubung saat ini:
              </div>
              <div className="font-mono text-xs text-[#FFD166] break-all bg-[#064E4A]/80 p-2.5 rounded-xl border border-[rgba(153,246,228,0.15)] font-semibold">
                {activeAddress || "Alamat Dompet Tidak Dikenal"}
              </div>
              <p className="text-[11px] text-[#A7F3D0]/70 leading-relaxed pt-1">
                Sesi SIWE Anda akan dihapus dan akses ke fitur khusus otentikasi (Watchlist, Case File Editing) akan dinonaktifkan hingga Anda masuk kembali.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                id="cancel-logout-button"
                disabled={isLoggingOut}
                onClick={() => setLogoutModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] hover:bg-[#042F2E]/80 border border-[rgba(153,246,228,0.25)] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                id="confirm-logout-button"
                disabled={isLoggingOut}
                onClick={handleConfirmLogout}
                className="px-5 py-2 rounded-full text-xs font-black bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFDF7] border border-[#042F2E] shadow-[3px_3px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#FFFDF7] border-t-transparent rounded-full animate-spin" />
                    <span>Mengeluarkan...</span>
                  </>
                ) : (
                  <span>Ya, Keluar</span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

