"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { DossierHeader } from "@/components/dossier/DossierHeader";
import { MarketFlowBlock } from "@/components/dossier/MarketFlowBlock";
import { TradeFlowChart } from "@/components/dossier/TradeFlowChart";
import { TradeFlowPanel } from "@/components/dossier/TradeFlowPanel";
import { WalletMap } from "@/components/dossier/WalletMap";
import { TopWalletsTable } from "@/components/dossier/TopWalletsTable";
import { DeployerHistory } from "@/components/dossier/DeployerHistory";
import { ConstellationGraph } from "@/components/dossier/ConstellationGraph";
import { ResearchPanel } from "@/components/dossier/ResearchPanel";
import { SinceLastCheck } from "@/components/dossier/SinceLastCheck";
import { ScoutRemembers } from "@/components/dossier/ScoutRemembers";
import { ConnectionsTimeline } from "@/components/dossier/ConnectionsTimeline";
import { PublishDialog } from "@/components/dossier/PublishDialog";
import type { DossierPagePropsData } from "@/lib/dossier/fetch";

function useSafeRouter() {
  try {
    return useRouter();
  } catch {
    return {
      push: (url: string) => {
        if (typeof window !== "undefined") window.location.href = url;
      },
      refresh: () => {
        if (typeof window !== "undefined") window.location.reload();
      },
      replace: (url: string) => {
        if (typeof window !== "undefined") window.location.replace(url);
      },
    };
  }
}

export function DossierClientView({ data }: { data: DossierPagePropsData }) {
  const router = useSafeRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (data.notPonsV2Token) {
    return (
      <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden flex flex-col">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 to-transparent blur-[140px] pointer-events-none -z-10" />

        <GlobalHeader
          isAuthenticated={!data.isAnonymous}
          walletAddress={data.dossier?.walletAddress}
        />

        <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="max-w-lg w-full bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-8 text-center shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-4">
            <div className="w-16 h-16 bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black shadow-[3px_3px_0px_#042F2E]">
              !
            </div>
            <h1 className="text-2xl font-black text-[#FFFDF7]">
              Not a Pons V2 Token
            </h1>
            <p className="text-xs text-[#A7F3D0] font-mono break-all bg-[#042F2E] p-3 rounded-xl border border-[rgba(153,246,228,0.2)]">
              {data.contractAddress}
            </p>
            <p className="text-xs sm:text-sm text-[#FFFDF7] leading-relaxed font-normal">
              The provided address is not recognized as a registered Pons V2 token contract. Scout only tracks tokens, bonding curves, and deployers active on Pons V2 protocol infrastructure.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/"
                className="px-6 py-3 pop-btn-yellow font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Back to Launch Feed
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tokenPhase =
    data.phase ||
    (data.curveProgressPct && data.curveProgressPct >= 100
      ? "graduated"
      : "curve");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handlePublish = () => {
    setIsPublishOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/dossier/${data.contractAddress}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/library");
      }
    } catch (err) {
      console.error("Failed to delete dossier:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader
        isAuthenticated={!data.isAnonymous}
        walletAddress={data.dossier?.walletAddress}
      />

      <main className="max-w-[1520px] mx-auto p-3 sm:p-5 lg:p-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <aside className="w-full lg:w-[360px] xl:w-[390px] shrink-0 space-y-4 relative z-20">
            <DossierHeader
              symbol={data.symbol || "UNKNOWN"}
              name={data.name || "Unknown Token"}
              phase={tokenPhase}
              contractAddress={data.contractAddress}
              onRefresh={handleRefresh}
              onPublish={handlePublish}
              onDelete={handleDelete}
              isRefreshing={isRefreshing}
              isDeleting={isDeleting}
            />

            <MarketFlowBlock
              marketCapUsd={data.marketCapUsd}
              athUsd={data.athUsd}
              curveProgressPct={data.curveProgressPct}
              volume24hUsd={data.volume24hUsd}
              tradeCount={data.tradeCount}
              uniqueWallets={data.uniqueWallets}
            />
          </aside>

          <section className="flex-1 min-w-0 w-full space-y-5">
            <ResearchPanel
              contractAddress={data.contractAddress}
              isAuthenticated={!data.isAnonymous}
              initialStatus={
                (data.status as
                  | "Watching"
                  | "Researching"
                  | "In position"
                  | "Passed") || "Researching"
              }
              initialThesis={data.dossier?.thesis}
              initialReason={data.dossier?.reason}
              initialNotes={data.dossier?.notes}
              initialDecisionReason={data.dossier?.decisionReason}
            />

            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                    Trade Flow Analytics
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-[#A7F3D0]/70">
                  REAL-TIME CANDLESTICKS &amp; ORDER FLOW
                </span>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <TradeFlowChart
                  candles={data.tradeCandles}
                  graduationIndex={data.graduationIndex}
                  tokenSymbol={data.symbol}
                />
                <TradeFlowPanel data={data.tradeFlow} />
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FFD166]" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                    Holder Distribution &amp; Wallet Map
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-[#A7F3D0]/70">
                  ON-CHAIN CONCENTRATION &amp; NET FLOW
                </span>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <WalletMap
                  wallets={data.walletBubbles}
                  deployerAddress={data.deployer?.address}
                />
                <TopWalletsTable
                  wallets={data.topWallets}
                  deployerAddress={data.deployer?.address}
                  feeRecipientAddress={data.feeRecipient}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#99F6E4]" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
                    Constellation Relationship Graph
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-[#A7F3D0]/70">
                  INTER-CONTRACT TOPOLOGY
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <ConstellationGraph
                  nodes={data.constellationNodes}
                  edges={data.constellationEdges}
                  currentContractAddress={data.contractAddress}
                />
              </div>
            </div>

            <DeployerHistory
              deployerAddress={data.deployer?.address || ""}
              totalLaunches={data.deployer?.totalLaunches}
              launches={data.launches}
              currentContractAddress={data.contractAddress}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <SinceLastCheck
                diffs={data.diffs}
                lastCheckedAt={data.lastSnapshotAt}
              />

              <div className="space-y-5">
                <ScoutRemembers
                  deployerAddress={data.deployer?.address}
                  dossiers={data.connectedDossiers}
                />

                <ConnectionsTimeline
                  connections={data.connections}
                  timelineLogs={data.timelineLogs}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublishDialog
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        contractAddress={data.contractAddress}
        symbol={data.symbol}
        name={data.name}
        thesis={data.dossier?.thesis || undefined}
        hasNotes={Boolean(data.dossier?.notes)}
        onPublished={({ publicUrl }) => {
          router.push(publicUrl);
        }}
      />
    </div>
  );
}
