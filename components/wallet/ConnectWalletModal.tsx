"use client";

import React, { useEffect, useMemo } from "react";
import {
  IconPhantom,
  IconMetaMask,
  IconWallet,
  IconClose,
  IconAlert,
  IconCheck,
  IconExternalLink,
} from "@/components/icons/Vectors";
import {
  checkWalletAvailability,
  type WalletType,
  type WalletAvailability,
} from "@/lib/auth/wallet";

export interface ConnectWalletModalProps {
  isOpen: boolean;
  isConnecting: boolean;
  connectingWallet: WalletType | null;
  progressStep: string | null;
  error: string | null;
  onClose: () => void;
  onSelectWallet: (type: WalletType) => void;
  onClearError: () => void;
}

export function ConnectWalletModal({
  isOpen,
  isConnecting,
  connectingWallet,
  progressStep,
  error,
  onClose,
  onSelectWallet,
  onClearError,
}: ConnectWalletModalProps) {
  const availability: WalletAvailability = useMemo(() => {
    if (!isOpen || typeof window === "undefined") {
      return { phantom: false, metamask: false, injected: false };
    }
    return checkWalletAvailability();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isConnecting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isConnecting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-wallet-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#042F2E]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isConnecting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] p-6 sm:p-8 text-[#FFFDF7] shadow-[6px_6px_0px_#042F2E] space-y-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.3)] flex items-center justify-center text-[#FFD166]">
              <IconWallet size={18} />
            </div>
            <div>
              <h3 id="connect-wallet-title" className="text-base sm:text-lg font-black tracking-tight text-[#FFFDF7]">
                Connect Wallet
              </h3>
              <p className="text-[11px] text-[#A7F3D0]/80">
                Sign in with Ethereum (SIWE) on Robinhood Chain
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            disabled={isConnecting}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.2)] flex items-center justify-center text-[#A7F3D0] hover:text-[#FFFDF7] transition-colors disabled:opacity-50"
          >
            <IconClose size={14} />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#EF4444]/20 border border-[#EF4444]/50 text-xs text-[#FCA5A5] space-y-2">
            <div className="flex items-start gap-2">
              <IconAlert size={16} className="text-[#EF4444] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{error}</div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onClearError}
                className="text-[11px] font-bold text-[#FFD166] hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {isConnecting ? (
          <div className="py-8 px-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD166]/20 border border-[#FFD166]/40 flex items-center justify-center mx-auto text-[#FFD166] animate-spin">
              <IconWallet size={24} />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-[#FFFDF7]">
                {connectingWallet === "phantom"
                  ? "Connecting Phantom..."
                  : connectingWallet === "metamask"
                  ? "Connecting MetaMask..."
                  : "Connecting Wallet..."}
              </div>
              <div className="text-xs text-[#A7F3D0] font-mono leading-relaxed">
                {progressStep || "Waiting for user action in wallet..."}
              </div>
            </div>
            <div className="text-[10px] text-[#A7F3D0]/70">
              Please check your wallet extension popup to confirm the connection and sign the challenge.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative group">
              <button
                type="button"
                onClick={() => onSelectWallet("phantom")}
                className="w-full p-4 rounded-2xl bg-[#042F2E] hover:bg-[#064E4A] border-2 border-[rgba(153,246,228,0.3)] hover:border-[#FFD166] transition-all flex items-center justify-between text-left group shadow-[3px_3px_0px_#042F2E]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#AB9FF2]/20 border border-[#AB9FF2]/40 flex items-center justify-center text-[#AB9FF2] shrink-0 group-hover:scale-105 transition-transform">
                    <IconPhantom size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#FFFDF7]">Phantom Wallet</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFD166] text-[#042F2E] border border-[#042F2E]">
                        RECOMMENDED
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A7F3D0]/80 mt-0.5">
                      {availability.phantom ? "Extension detected in browser" : "Click to connect or install"}
                    </div>
                  </div>
                </div>

                <div>
                  {availability.phantom ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4ADE80] bg-[#4ADE80]/15 px-2 py-0.5 rounded-full border border-[#4ADE80]/30">
                      <IconCheck size={10} />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <a
                      href="https://phantom.app/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FFD166] hover:underline bg-[#FFD166]/10 px-2 py-0.5 rounded-full border border-[#FFD166]/30"
                    >
                      <span>Get</span>
                      <IconExternalLink size={10} />
                    </a>
                  )}
                </div>
              </button>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => onSelectWallet("metamask")}
                className="w-full p-4 rounded-2xl bg-[#042F2E] hover:bg-[#064E4A] border-2 border-[rgba(153,246,228,0.2)] hover:border-[#99F6E4] transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center text-[#F97316] shrink-0 group-hover:scale-105 transition-transform">
                    <IconMetaMask size={22} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#FFFDF7]">MetaMask</div>
                    <div className="text-[11px] text-[#A7F3D0]/80 mt-0.5">
                      {availability.metamask ? "Extension detected in browser" : "Connect with MetaMask"}
                    </div>
                  </div>
                </div>

                <div>
                  {availability.metamask && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4ADE80] bg-[#4ADE80]/15 px-2 py-0.5 rounded-full border border-[#4ADE80]/30">
                      <IconCheck size={10} />
                      <span>Ready</span>
                    </span>
                  )}
                </div>
              </button>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={() => onSelectWallet("injected")}
                className="w-full p-4 rounded-2xl bg-[#042F2E] hover:bg-[#064E4A] border-2 border-[rgba(153,246,228,0.2)] hover:border-[#99F6E4] transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/20 border border-[#14B8A6]/40 flex items-center justify-center text-[#99F6E4] shrink-0 group-hover:scale-105 transition-transform">
                    <IconWallet size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#FFFDF7]">Browser Injected Wallet</div>
                    <div className="text-[11px] text-[#A7F3D0]/80 mt-0.5">
                      Coinbase Wallet, Rabby, OKX, or other EIP-1193 provider
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[rgba(153,246,228,0.15)] text-[10px] text-[#A7F3D0]/70 text-center leading-relaxed">
          Authentication is verified off-chain with EIP-4361 SIWE cryptographic signatures. No gas fees or on-chain transaction approvals are required.
        </div>
      </div>
    </div>
  );
}
