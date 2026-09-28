"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { ConnectionMap, type MapNode, type MapEdge } from "@/components/map/ConnectionMap";
import { IconLock, IconArrowRight, IconGraph, IconWallet } from "@/components/icons/Vectors";
import { useWallet } from "@/components/wallet/WalletContext";

export interface MapClientProps {
  isAuthenticated?: boolean;
  userAddress?: string;
  initialNodes?: MapNode[];
  initialEdges?: MapEdge[];
}

export function MapClient({
  isAuthenticated = false,
  userAddress,
  initialNodes = [],
  initialEdges = [],
}: MapClientProps) {
  const { openModal } = useWallet();
  const [nodes] = useState<MapNode[]>(initialNodes);
  const [edges] = useState<MapEdge[]>(initialEdges);

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] flex flex-col font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col space-y-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF7]">
              Connection Map
            </h1>
            <p className="text-xs sm:text-sm text-[#A7F3D0] mt-1 font-normal">
              Global relational constellation linking dossiers by deployer, fee routing, repositories, and thesis mentions.
            </p>
          </div>

          {isAuthenticated && nodes.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]">
                {`${nodes.length} Nodes`}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]">
                {`${edges.length} Links`}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-[600px] w-full">
          {!isAuthenticated ? (
            <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-8 sm:p-14 text-center space-y-4 shadow-[0_20px_50px_rgba(4,47,46,0.5)] max-w-xl mx-auto my-8 sm:my-16">
              <div className="w-14 h-14 rounded-2xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center mx-auto text-[#99F6E4] shadow-[0_0_20px_rgba(153,246,228,0.3)]">
                <IconLock size={26} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">Authentication Required</h2>
              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Connect your Ethereum wallet using Sign-In with Ethereum (SIWE) to generate and explore your relational constellation map across researched token dossiers.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FFD166] hover:bg-[#FBBF24] text-[#042F2E] border border-[#042F2E] font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#042F2E] transition-all cursor-pointer"
                >
                  <IconWallet size={14} />
                  <span>Connect Wallet</span>
                </button>
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 text-[#99F6E4] hover:text-[#FFFDF7] border border-[rgba(153,246,228,0.25)] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Browse Public Launch Feed</span>
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : nodes.length === 0 ? (
            <div className="w-full h-[650px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#99F6E4]/20 border border-[#99F6E4]/40 flex items-center justify-center mx-auto text-[#99F6E4]">
                <IconGraph size={24} />
              </div>
              <div className="text-sm font-bold text-[#FFFDF7]">
                No Dossier Connections Found
              </div>
              <div className="text-xs text-[#A7F3D0] max-w-md">
                Add dossiers to your library or link tokens through deployer investigations to generate graph nodes.
              </div>
            </div>
          ) : (
            <ConnectionMap nodes={nodes} edges={edges} />
          )}
        </div>
      </main>
    </div>
  );
}
