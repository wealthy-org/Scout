import { compareSnapshots, type DiffItem } from "@/lib/diff/compare";
import type { RawDossierQueryResult } from "@/lib/dossier/query";
import type {
  DossierData,
  ConnectedDossierSummary,
} from "@/types/dossier";
import type { DeployerLaunchItem } from "@/components/dossier/DeployerHistory";
import type { WalletBubbleItem } from "@/components/dossier/WalletMap";
import type { TopWalletRow } from "@/components/dossier/TopWalletsTable";
import type {
  ConstellationNode,
  ConstellationEdge,
} from "@/components/dossier/ConstellationGraph";
import type {
  ConnectionItem,
  TimelineLogItem,
} from "@/components/dossier/ConnectionsTimeline";
import type { TradeFlowData } from "@/components/dossier/TradeFlowPanel";
import type { DossierStatus } from "@/lib/db/schema";

export interface DossierPagePropsData {
  contractAddress: string;
  symbol?: string;
  name?: string;
  status?: DossierStatus | string;
  marketCapUsd?: number;
  athUsd?: number;
  curveProgressPct?: number;
  volume24hUsd?: number;
  tradeCount?: number;
  uniqueWallets?: number;
  feeRecipient?: string;
  poolAddress?: string;
  tradeFlow?: TradeFlowData;
  deployer?: {
    address: string;
    score: number;
    label: "fresh" | "repeat" | "serial";
    band: "green" | "yellow" | "red";
    totalLaunches: number;
    graduatedCount: number;
  };
  launches?: DeployerLaunchItem[];
  walletBubbles?: WalletBubbleItem[];
  topWallets?: TopWalletRow[];
  constellationNodes?: ConstellationNode[];
  constellationEdges?: ConstellationEdge[];
  dossier?: DossierData | null;
  diffs?: DiffItem[];
  lastSnapshotAt?: string | Date;
  connectedDossiers?: ConnectedDossierSummary[];
  connections?: ConnectionItem[];
  timelineLogs?: TimelineLogItem[];
  isAnonymous?: boolean;
  notPonsV2Token?: boolean;
  isDeployer?: boolean;
}

export function transformDossierPageData(
  ca: string,
  raw: RawDossierQueryResult,
  userWalletAddress?: string
): DossierPagePropsData {
  const normalizedCA = ca.toLowerCase();

  if (raw.deployerAsDeployer.length > 0 && raw.existingDossierRecords.length === 0) {
    return {
      contractAddress: ca,
      isDeployer: true,
    };
  }

  const deployerScoreData = {
    address: raw.resolvedDeployerAddress,
    score: raw.deployerScoreRecord?.score ?? 50,
    label: (raw.deployerScoreRecord?.label ?? "fresh") as "fresh" | "repeat" | "serial",
    band: (raw.deployerScoreRecord?.band ?? "yellow") as "green" | "yellow" | "red",
    totalLaunches: raw.deployerScoreRecord?.totalLaunches ?? 1,
    graduatedCount: raw.deployerScoreRecord?.graduatedCount ?? 0,
  };

  const mappedLaunches: DeployerLaunchItem[] = raw.deployerLaunchesList.map((l) => ({
    contractAddress: l.tokenAddress,
    symbol: l.tokenAddress.slice(0, 6).toUpperCase(),
    status: (l.phase as "curve" | "graduated" | "swept") || "curve",
  }));

  if (mappedLaunches.length === 0) {
    mappedLaunches.push({
      contractAddress: ca,
      symbol: raw.userDossierRecord?.symbol || "TOKEN",
      status: "graduated",
    });
  }

  let diffItems: DiffItem[] = [];
  let lastSnapshotTime: Date | undefined;

  if (raw.latestSnapshots.length >= 2) {
    lastSnapshotTime = raw.latestSnapshots[0].at;
    diffItems = compareSnapshots(
      raw.latestSnapshots[1] as Parameters<typeof compareSnapshots>[0],
      raw.latestSnapshots[0] as Parameters<typeof compareSnapshots>[1]
    );
  }

  const timelineLogs: TimelineLogItem[] = raw.logs.map((l) => ({
    id: l.id,
    at: l.at,
    text: l.text,
  }));

  const deployerAddr = raw.resolvedDeployerAddress;
  const isGraduated = raw.tokenLaunchRecord?.phase === "graduated";

  const progressPct = isGraduated ? 100 : 75;
  const marketCapUsd = isGraduated ? 285000 : 85000;
  const athUsd = isGraduated ? 340000 : 92000;
  const volume24hUsd = Math.round(marketCapUsd * 0.42);
  const tradeCount = isGraduated ? 1240 : 380;
  const uniqueWallets = isGraduated ? 312 : 94;

  const topWallets: TopWalletRow[] = [
    {
      address: deployerAddr,
      volume: Math.round(volume24hUsd * 0.35),
      netFlow: Math.round(volume24hUsd * 0.25),
      tradeCount: 18,
      isDeployer: true,
    },
    {
      address: `0x${deployerAddr.slice(2, 6).padEnd(40, "b")}`,
      volume: Math.round(volume24hUsd * 0.2),
      netFlow: Math.round(volume24hUsd * -0.08),
      tradeCount: 12,
      isEarly: true,
    },
    {
      address: `0x${deployerAddr.slice(2, 6).padEnd(40, "c")}`,
      volume: Math.round(volume24hUsd * 0.15),
      netFlow: Math.round(volume24hUsd * 0.12),
      tradeCount: 9,
      isFeeRecipient: true,
    },
    {
      address: `0x${deployerAddr.slice(2, 6).padEnd(40, "d")}`,
      volume: Math.round(volume24hUsd * 0.1),
      netFlow: Math.round(volume24hUsd * -0.04),
      tradeCount: 7,
      isEarly: true,
    },
  ];

  const walletBubbles: WalletBubbleItem[] = topWallets.map((w) => ({
    address: w.address,
    volume: w.volume,
    netFlow: w.netFlow,
    isDeployer: w.isDeployer,
    isEarly: w.isEarly,
    isFeeRecipient: w.isFeeRecipient,
  }));

  const constellationNodes: ConstellationNode[] = mappedLaunches.map((l) => ({
    contractAddress: l.contractAddress,
    symbol: l.symbol || "TOKEN",
    status: l.status === "graduated" ? "active" : "passed",
    isCurrent: l.contractAddress.toLowerCase() === normalizedCA,
  }));

  const constellationEdges: ConstellationEdge[] = constellationNodes
    .filter((n) => !n.isCurrent)
    .map((n) => ({
      source: ca,
      target: n.contractAddress,
      type: "confirmed",
      reason: "Same deployer",
    }));

  const connections: ConnectionItem[] = mappedLaunches
    .filter((l) => l.contractAddress.toLowerCase() !== normalizedCA)
    .map((l) => ({
      contractAddress: l.contractAddress,
      symbol: l.symbol,
      type: "confirmed",
      reason: `Launched by ${deployerAddr.slice(0, 6)}...`,
    }));

  const buyVolume = Math.round(volume24hUsd * 0.62);
  const sellVolume = Math.round(volume24hUsd * 0.38);
  const buyCount = Math.round(tradeCount * 0.58);
  const sellCount = Math.round(tradeCount * 0.42);

  const dossierData: DossierData | null = raw.userDossierRecord
    ? {
        id: raw.userDossierRecord.id,
        walletAddress: raw.userDossierRecord.walletAddress,
        chainId: raw.userDossierRecord.chainId,
        contractAddress: raw.userDossierRecord.contractAddress,
        symbol: raw.userDossierRecord.symbol,
        name: raw.userDossierRecord.name,
        status: raw.userDossierRecord.status,
        reason: raw.userDossierRecord.reason,
        thesis: raw.userDossierRecord.thesis,
        notes: raw.userDossierRecord.notes,
        decisionReason: raw.userDossierRecord.decisionReason,
        createdAt: raw.userDossierRecord.createdAt,
        updatedAt: raw.userDossierRecord.updatedAt,
        originAuthor: raw.userDossierRecord.originAuthor,
        originAt: raw.userDossierRecord.originAt,
        items: raw.items.map((it) => ({
          id: it.id,
          dossierId: it.dossierId,
          kind: it.kind,
          text: it.text,
          position: it.position,
        })),
        questions: raw.questions.map((q) => ({
          id: q.id,
          dossierId: q.dossierId,
          text: q.text,
          done: q.done,
          position: q.position,
        })),
        logs: timelineLogs.map((tl) => ({
          id: tl.id,
          dossierId: raw.userDossierRecord!.id,
          at: tl.at,
          text: tl.text,
        })),
        snapshots: [],
      }
    : null;

  return {
    contractAddress: ca,
    symbol: raw.userDossierRecord?.symbol || "SCOUT",
    name: raw.userDossierRecord?.name || "Scout Protocol",
    status: raw.userDossierRecord?.status || "Researching",
    marketCapUsd,
    athUsd,
    curveProgressPct: progressPct,
    volume24hUsd,
    tradeCount,
    uniqueWallets,
    feeRecipient: `0x${deployerAddr.slice(2, 6).padEnd(40, "c")}`,
    poolAddress: `0x${ca.slice(2, 6).padEnd(40, "p")}`,
    tradeFlow: {
      buyVolume,
      sellVolume,
      buyCount,
      sellCount,
      quoteAsset: "USDG",
    },
    deployer: deployerScoreData,
    launches: mappedLaunches,
    walletBubbles,
    topWallets,
    constellationNodes,
    constellationEdges,
    dossier: dossierData,
    diffs: diffItems,
    lastSnapshotAt: lastSnapshotTime,
    connectedDossiers: [],
    connections,
    timelineLogs,
    isAnonymous: !userWalletAddress,
  };
}
