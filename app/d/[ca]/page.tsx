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
      <main className="min-h-screen bg-[#0b0e14] text-gray-100 p-6 flex flex-col items-center justify-center">
        <div className="max-w-lg w-full bg-[#11161d] border border-amber-900/50 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-950/50 border border-amber-800 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Not a Pons V2 Token
          </h1>
          <p className="text-sm text-gray-400 font-mono break-all mb-4">
            {data.contractAddress}
          </p>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            The provided address is not recognized as a registered Pons V2 token contract. Scout only tracks tokens, bonding curves, and deployers active on Pons V2 protocol infrastructure.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/"
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg text-sm transition-colors"
            >
              Back to Launch Feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0e14] text-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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

            <div className="bg-[#11161d] border border-gray-800 rounded-xl p-5 shadow-lg">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                Trade Flow Analytics
              </h2>
              <div className="space-y-4">
                <TradeFlowChart />
                <TradeFlowPanel data={data.tradeFlow} />
              </div>
            </div>

            <div className="bg-[#11161d] border border-gray-800 rounded-xl p-5 shadow-lg space-y-4">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
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

              <div className="bg-[#11161d] border border-gray-800 rounded-xl p-5 shadow-lg">
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
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
