import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
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
import {
  fetchDossierPageData,
  type DossierPagePropsData,
} from "@/lib/dossier/fetch";

export type { DossierPagePropsData };

export function DossierPageView({ data }: { data: DossierPagePropsData }) {
  if (data.notPonsV2Token) {
    return (
      <main className="min-h-screen bg-[#0D746E] text-[#FFFDF7] p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 to-transparent blur-[140px] pointer-events-none -z-10" />

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
    );
  }

  return (
    <main className="min-h-screen bg-[#0D746E] text-[#FFFDF7] p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        <DossierHeader
          symbol={data.symbol || "UNKNOWN"}
          name={data.name || "Unknown Token"}
          phase="graduated"
          contractAddress={data.contractAddress}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MarketFlowBlock
              marketCapUsd={data.marketCapUsd}
              athUsd={data.athUsd}
              curveProgressPct={data.curveProgressPct}
              volume24hUsd={data.volume24hUsd}
              tradeCount={data.tradeCount}
              uniqueWallets={data.uniqueWallets}
            />

            <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
              <h2 className="text-xs font-bold text-[#FFFDF7] uppercase tracking-wider mb-4">
                Trade Flow Analytics
              </h2>
              <div className="space-y-4">
                <TradeFlowChart />
                <TradeFlowPanel data={data.tradeFlow} />
              </div>
            </div>

            <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl space-y-4">
              <h2 className="text-xs font-bold text-[#FFFDF7] uppercase tracking-wider">
                Holder Distribution &amp; Wallet Map
              </h2>
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

            <div className="space-y-6">
              <DeployerHistory
                deployerAddress={data.deployer?.address || ""}
                totalLaunches={data.deployer?.totalLaunches}
                launches={data.launches}
                currentContractAddress={data.contractAddress}
              />

              <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl">
                <h2 className="text-xs font-bold text-[#FFFDF7] uppercase tracking-wider mb-4">
                  Constellation Relationship Graph
                </h2>
                <ConstellationGraph
                  nodes={data.constellationNodes}
                  edges={data.constellationEdges}
                  currentContractAddress={data.contractAddress}
                />
              </div>

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

          <div className="space-y-6">
            <SinceLastCheck
              diffs={data.diffs}
              lastCheckedAt={data.lastSnapshotAt}
            />

            <ResearchPanel
              contractAddress={data.contractAddress}
              isAuthenticated={!data.isAnonymous}
              initialStatus={(data.status as "Watching" | "Researching" | "In position" | "Passed") || "Researching"}
              initialThesis={data.dossier?.thesis}
              initialReason={data.dossier?.reason}
              initialNotes={data.dossier?.notes}
              initialDecisionReason={data.dossier?.decisionReason}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function DossierPage(props: {
  params: Promise<{ ca: string }> | { ca: string };
}) {
  const resolvedParams = await props.params;
  const ca = resolvedParams.ca;

  const data = await fetchDossierPageData(ca);

  if (data.isDeployer) {
    redirect(`/deployer/${ca}`);
  }

  return <DossierPageView data={data} />;
}
