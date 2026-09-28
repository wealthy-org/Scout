"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithWallet,
  logoutWallet,
  type WalletType,
} from "@/lib/auth/wallet";
import { ConnectWalletModal } from "@/components/wallet/ConnectWalletModal";

export interface WalletContextValue {
  isAuthenticated: boolean;
  userAddress: string | null;
  isConnecting: boolean;
  connectingWallet: WalletType | null;
  progressStep: string | null;
  error: string | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  clearError: () => void;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export interface WalletProviderProps {
  children: React.ReactNode;
  initialAuthenticated?: boolean;
  initialUserAddress?: string | null;
}

export function WalletProvider({
  children,
  initialAuthenticated = false,
  initialUserAddress = null,
}: WalletProviderProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthenticated);
  const [userAddress, setUserAddress] = useState<string | null>(initialUserAddress);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const [progressStep, setProgressStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setError(null);
    setProgressStep(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (!isConnecting) {
      setIsModalOpen(false);
      setError(null);
      setProgressStep(null);
    }
  }, [isConnecting]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const connect = useCallback(
    async (walletType: WalletType) => {
      setIsConnecting(true);
      setConnectingWallet(walletType);
      setError(null);
      setProgressStep("Initializing connection...");

      try {
        const result = await signInWithWallet(walletType, (step) => {
          setProgressStep(step);
        });

        if (result.success) {
          setIsAuthenticated(true);
          setUserAddress(result.walletAddress);
          setIsModalOpen(false);
          router.refresh();
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
        setError(errorMessage);
      } finally {
        setIsConnecting(false);
        setConnectingWallet(null);
      }
    },
    [router]
  );

  const disconnect = useCallback(async () => {
    try {
      await logoutWallet();
    } catch {
    } finally {
      setIsAuthenticated(false);
      setUserAddress(null);
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    if (!initialAuthenticated) {
      fetch("/api/me")
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data?.ok && data?.user?.walletAddress) {
            setIsAuthenticated(true);
            setUserAddress(data.user.walletAddress);
          }
        })
        .catch(() => {});
    }
  }, [initialAuthenticated]);

  return (
    <WalletContext.Provider
      value={{
        isAuthenticated,
        userAddress,
        isConnecting,
        connectingWallet,
        progressStep,
        error,
        isModalOpen,
        openModal,
        closeModal,
        clearError,
        connect,
        disconnect,
      }}
    >
      {children}
      <ConnectWalletModal
        isOpen={isModalOpen}
        isConnecting={isConnecting}
        connectingWallet={connectingWallet}
        progressStep={progressStep}
        error={error}
        onClose={closeModal}
        onSelectWallet={connect}
        onClearError={clearError}
      />
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    return {
      isAuthenticated: false,
      userAddress: null,
      isConnecting: false,
      connectingWallet: null,
      progressStep: null,
      error: null,
      isModalOpen: false,
      openModal: () => {},
      closeModal: () => {},
      clearError: () => {},
      connect: async () => {},
      disconnect: async () => {},
    };
  }
  return context;
}
