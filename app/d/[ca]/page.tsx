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
      <main className="min-h-screen bg-[#07090E] text-slate-100 p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-[#FFB800]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-lg w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-[0_0_20px_rgba(255,184,0,0.2)]">
            !
          </div>
          <h1 className="text-2xl font-black text-white">
            Not a Pons V2 Token
          </h1>
          <p className="text-xs text-slate-400 font-mono break-all bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {data.contractAddress}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            The provided address is not recognized as a registered Pons V2 token contract. Scout only tracks tokens, bonding curves, and deployers active on Pons V2 protocol infrastructure.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
            >
              Back to Launch Feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090E] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-gradient-to-b from-[#00E599]/10 via-[#00F0FF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

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

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                Trade Flow Analytics
              </h2>
              <div className="space-y-4">
                <TradeFlowChart />
                <TradeFlowPanel data={data.tradeFlow} />
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
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

              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
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
