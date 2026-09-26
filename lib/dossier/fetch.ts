import { db } from "@/lib/db";
import {
  dossiers,
  deployerScores,
  deployerLaunches,
  snapshots,
  dossierLog,
  type DossierStatus,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { compareSnapshots, type DiffItem } from "@/lib/diff/compare";
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

export async function fetchDossierPageData(
  ca: string,
  userWalletAddress?: string
): Promise<DossierPagePropsData> {
  const normalizedCA = ca.toLowerCase();

  try {
    const existingDossierRecords = await db
      .select()
      .from(dossiers)
      .where(eq(dossiers.contractAddress, normalizedCA))
      .limit(10);

    const userDossierRecord = userWalletAddress
      ? existingDossierRecords.find(
          (d) => d.walletAddress.toLowerCase() === userWalletAddress.toLowerCase()
        )
      : existingDossierRecords[0];

    const deployerAsDeployer = await db
      .select()
      .from(deployerScores)
      .where(eq(deployerScores.deployerAddress, normalizedCA))
      .limit(1);

    if (
      deployerAsDeployer.length > 0 &&
      existingDossierRecords.length === 0
    ) {
      return {
        contractAddress: ca,
        isDeployer: true,
      };
    }

    const deployerAddr =
      userDossierRecord?.walletAddress ||
      "0x0000000000000000000000000000000000000001";

    let deployerScoreData: {
      address: string;
      score: number;
      label: "fresh" | "repeat" | "serial";
      band: "green" | "yellow" | "red";
      totalLaunches: number;
      graduatedCount: number;
    } = {
      address: deployerAddr,
      score: 50,
      label: "fresh",
      band: "yellow",
      totalLaunches: 1,
      graduatedCount: 0,
    };

    const dScore = await db
      .select()
      .from(deployerScores)
      .where(eq(deployerScores.deployerAddress, deployerAddr))
      .limit(1);

    if (dScore[0]) {
      deployerScoreData = {
        address: dScore[0].deployerAddress,
        score: dScore[0].score,
        label: dScore[0].label as "fresh" | "repeat" | "serial",
        band: dScore[0].band as "green" | "yellow" | "red",
        totalLaunches: dScore[0].totalLaunches,
        graduatedCount: dScore[0].graduatedCount,
      };
    }

    const dLaunches = await db
      .select()
      .from(deployerLaunches)
      .where(eq(deployerLaunches.deployerAddress, deployerAddr))
      .limit(40);

    const mappedLaunches: DeployerLaunchItem[] = dLaunches.map((l) => ({
      contractAddress: l.tokenAddress,
      symbol: l.tokenAddress.slice(0, 6).toUpperCase(),
      status: (l.phase as "curve" | "graduated" | "swept") || "curve",
    }));

    if (mappedLaunches.length === 0) {
      mappedLaunches.push({
        contractAddress: ca,
        symbol: userDossierRecord?.symbol || "TOKEN",
        status: "graduated",
      });
    }

    let diffItems: DiffItem[] = [];
    let lastSnapshotTime: Date | undefined;

    if (userDossierRecord) {
      const snapRecords = await db
        .select()
        .from(snapshots)
        .where(eq(snapshots.dossierId, userDossierRecord.id))
        .orderBy(desc(snapshots.at))
        .limit(2);

      if (snapRecords.length >= 2) {
        lastSnapshotTime = snapRecords[0].at;
        diffItems = compareSnapshots(
          snapRecords[1] as Parameters<typeof compareSnapshots>[0],
          snapRecords[0] as Parameters<typeof compareSnapshots>[1]
        );
      }
    }

    const logs = userDossierRecord
      ? await db
          .select()
          .from(dossierLog)
          .where(eq(dossierLog.dossierId, userDossierRecord.id))
          .orderBy(desc(dossierLog.at))
          .limit(200)
      : [];

    const timelineLogs: TimelineLogItem[] = logs.map((l) => ({
      id: l.id,
      at: l.at,
      text: l.text,
    }));

    const mockWalletBubbles: WalletBubbleItem[] = [
      {
        address: "0x1111111111111111111111111111111111111111",
        volume: 185000,
        netFlow: 120000,
        isDeployer: true,
      },
      {
        address: "0x2222222222222222222222222222222222222222",
        volume: 82000,
        netFlow: -45000,
        isEarly: true,
      },
      {
        address: "0x3333333333333333333333333333333333333333",
        volume: 54000,
        netFlow: 35000,
        isFeeRecipient: true,
      },
    ];

    const mockTopWallets: TopWalletRow[] = [
      {
        address: "0x1111111111111111111111111111111111111111",
        volume: 185000,
        netFlow: 120000,
        tradeCount: 24,
        isDeployer: true,
      },
      {
        address: "0x2222222222222222222222222222222222222222",
        volume: 82000,
        netFlow: -45000,
        tradeCount: 12,
        isEarly: true,
      },
      {
        address: "0x3333333333333333333333333333333333333333",
        volume: 54000,
        netFlow: 35000,
        tradeCount: 8,
        isFeeRecipient: true,
      },
    ];

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

    return {
      contractAddress: ca,
      symbol: userDossierRecord?.symbol || "SCOUT",
      name: userDossierRecord?.name || "Scout Protocol",
      status: userDossierRecord?.status || "Researching",
      marketCapUsd: 250000,
      athUsd: 350000,
      curveProgressPct: 100,
      volume24hUsd: 85000,
      tradeCount: 1420,
      uniqueWallets: 384,
      feeRecipient: "0xFeeRecipientAddress0000000000000000000001",
      poolAddress: "0xPoolAddress0000000000000000000000000000001",
      tradeFlow: {
        buyVolume: 51000,
        sellVolume: 34000,
        buyCount: 820,
        sellCount: 600,
        quoteAsset: "USDG",
      },
      deployer: deployerScoreData,
      launches: mappedLaunches,
      walletBubbles: mockWalletBubbles,
      topWallets: mockTopWallets,
      constellationNodes,
      constellationEdges,
      dossier: userDossierRecord
        ? {
            id: userDossierRecord.id,
            walletAddress: userDossierRecord.walletAddress,
            chainId: userDossierRecord.chainId,
            contractAddress: userDossierRecord.contractAddress,
            symbol: userDossierRecord.symbol,
            name: userDossierRecord.name,
            status: userDossierRecord.status,
            reason: userDossierRecord.reason,
            thesis: userDossierRecord.thesis,
            notes: userDossierRecord.notes,
            decisionReason: userDossierRecord.decisionReason,
            createdAt: userDossierRecord.createdAt,
            updatedAt: userDossierRecord.updatedAt,
            originAuthor: userDossierRecord.originAuthor,
            originAt: userDossierRecord.originAt,
            items: [],
            questions: [],
            logs: timelineLogs.map((tl) => ({
              id: tl.id,
              dossierId: userDossierRecord.id,
              at: tl.at,
              text: tl.text,
            })),
            snapshots: [],
          }
        : null,
      diffs: diffItems,
      lastSnapshotAt: lastSnapshotTime,
      connectedDossiers: [],
      connections,
      timelineLogs,
      isAnonymous: !userWalletAddress,
    };
  } catch {
    return {
      contractAddress: ca,
      symbol: "TOKEN",
      name: "Unverified Token",
      status: "Researching",
      marketCapUsd: 100000,
      athUsd: 120000,
      curveProgressPct: 50,
      volume24hUsd: 10000,
      tradeCount: 100,
      uniqueWallets: 50,
      feeRecipient: "0x0000000000000000000000000000000000000000",
      poolAddress: "0x0000000000000000000000000000000000000000",
      tradeFlow: {
        buyVolume: 6000,
        sellVolume: 4000,
        buyCount: 60,
        sellCount: 40,
        quoteAsset: "USDG",
      },
      deployer: {
        address: "0x0000000000000000000000000000000000000000",
        score: 50,
        label: "fresh",
        band: "yellow",
        totalLaunches: 1,
        graduatedCount: 0,
      },
      launches: [
        {
          contractAddress: ca,
          symbol: "TOKEN",
          status: "curve",
        },
      ],
      walletBubbles: [],
      topWallets: [],
      constellationNodes: [{ contractAddress: ca, symbol: "TOKEN", isCurrent: true }],
      constellationEdges: [],
      dossier: null,
      diffs: [],
      connectedDossiers: [],
      connections: [],
      timelineLogs: [],
      isAnonymous: !userWalletAddress,
    };
  }
}
