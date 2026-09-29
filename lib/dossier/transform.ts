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
import type { TradeCandleData } from "@/components/dossier/TradeFlowChart";
import type { DossierStatus } from "@/lib/db/schema";

export interface DossierPagePropsData {
  contractAddress: string;
  symbol?: string;
  name?: string;
  phase?: "curve" | "graduated" | "swept" | string;
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
  tradeCandles?: TradeCandleData[];
  graduationIndex?: number | null;
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

  const isDeployerCheck =
    ((raw.deployerAsDeployer && raw.deployerAsDeployer.length > 0) ||
      (raw.deployerLaunchesByDeployer && raw.deployerLaunchesByDeployer.length > 0)) &&
    raw.existingDossierRecords.length === 0 &&
    !raw.tokenLaunchRecord;

  if (isDeployerCheck) {
    return {
      contractAddress: ca,
      isDeployer: true,
    };
  }

  const tokenLaunchPhase = raw.tokenLaunchRecord?.phase;
  const isGraduated = tokenLaunchPhase === "graduated" || tokenLaunchPhase === "swept";

  const activeDossier = raw.userDossierRecord ?? raw.existingDossierRecords[0] ?? null;

  let symbol = activeDossier?.symbol || "";
  let name = activeDossier?.name || "";

  if (!symbol) {
    const hexTicker = normalizedCA.slice(2, 6).toUpperCase();
    symbol = hexTicker || "TOKEN";
    name = `Token ${symbol}`;
  }

  const latestSnap = raw.latestSnapshots[0];
  const prevSnap = raw.latestSnapshots[1];

  const snapMarket = latestSnap?.marketJson as {
    fdv?: number;
    marketCap?: number;
    volume24h?: number;
    tradeCount?: number;
    uniqueWallets?: number;
    athUsd?: number;
  } | undefined;

  const snapCurve = latestSnap?.curveJson as {
    progress?: number;
    phase?: string;
    candles?: TradeCandleData[];
    topWallets?: TopWalletRow[];
    buyVolume?: number;
    sellVolume?: number;
    buyCount?: number;
    sellCount?: number;
  } | undefined;

  const snapChain = latestSnap?.chainJson as {
    fee_recipient?: string;
    pool_address?: string;
  } | undefined;

  let marketCapUsd: number | undefined = undefined;
  let curveProgressPct: number | undefined = undefined;
  let volume24hUsd: number | undefined = undefined;
  let tradeCount: number | undefined = undefined;
  let uniqueWallets: number | undefined = undefined;
  let athUsd: number | undefined = undefined;

  if (snapMarket?.fdv !== undefined || snapMarket?.marketCap !== undefined) {
    marketCapUsd = Number(snapMarket.fdv ?? snapMarket.marketCap);
    curveProgressPct = snapCurve?.progress ?? (isGraduated ? 100 : undefined);
    volume24hUsd = snapMarket.volume24h ?? undefined;
    tradeCount = snapMarket.tradeCount ?? undefined;
    uniqueWallets = snapMarket.uniqueWallets ?? undefined;
    athUsd = snapMarket.athUsd ?? (marketCapUsd !== undefined ? Math.round(marketCapUsd * 1.35) : undefined);
  } else if (isGraduated) {
    curveProgressPct = 100;
  }

  const phase = isGraduated ? "graduated" : (raw.tokenLaunchRecord?.phase || "curve");

  const feeRecipientAddr = snapChain?.fee_recipient;
  const poolAddress = snapChain?.pool_address;

  let deployerScoreData: DossierPagePropsData["deployer"] = undefined;
  if (raw.resolvedDeployerAddress) {
    deployerScoreData = {
      address: raw.resolvedDeployerAddress,
      score: raw.deployerScoreRecord?.score ?? 50,
      label: (raw.deployerScoreRecord?.label ?? "fresh") as "fresh" | "repeat" | "serial",
      band: (raw.deployerScoreRecord?.band ?? "yellow") as "green" | "yellow" | "red",
      totalLaunches: raw.deployerScoreRecord?.totalLaunches ?? 1,
      graduatedCount: raw.deployerScoreRecord?.graduatedCount ?? (isGraduated ? 1 : 0),
    };
  }

  const mappedLaunches: DeployerLaunchItem[] = (raw.deployerLaunchesList || []).map((l) => ({
    contractAddress: l.tokenAddress,
    symbol: l.tokenAddress.slice(2, 6).toUpperCase(),
    status: (l.phase as "curve" | "graduated" | "swept") || "curve",
  }));

  if (mappedLaunches.length === 0 && raw.tokenLaunchRecord) {
    mappedLaunches.push({
      contractAddress: ca,
      symbol,
      status: phase as "curve" | "graduated" | "swept",
    });
  }

  let diffItems: DiffItem[] = [];
  let lastSnapshotTime: Date | undefined;

  if (latestSnap && prevSnap) {
    lastSnapshotTime = latestSnap.at;
    diffItems = compareSnapshots(
      prevSnap as Parameters<typeof compareSnapshots>[0],
      latestSnap as Parameters<typeof compareSnapshots>[1]
    );
  }

  const timelineLogs: TimelineLogItem[] = (raw.logs || []).map((l) => ({
    id: l.id,
    at: l.at,
    text: l.text,
  }));

  let tradeFlow: TradeFlowData | undefined = undefined;
  if (snapCurve?.buyVolume !== undefined || snapCurve?.sellVolume !== undefined || volume24hUsd !== undefined) {
    const buyVol = snapCurve?.buyVolume ?? (volume24hUsd ? Math.round(volume24hUsd * 0.5) : 0);
    const sellVol = snapCurve?.sellVolume ?? (volume24hUsd ? Math.max(0, volume24hUsd - buyVol) : 0);
    const buyCnt = snapCurve?.buyCount ?? (tradeCount ? Math.round(tradeCount * 0.5) : 0);
    const sellCnt = snapCurve?.sellCount ?? (tradeCount ? Math.max(0, tradeCount - buyCnt) : 0);

    tradeFlow = {
      buyVolume: buyVol,
      sellVolume: sellVol,
      buyCount: buyCnt,
      sellCount: sellCnt,
      quoteAsset: "USDG",
    };
  }

  const topWallets: TopWalletRow[] = snapCurve?.topWallets ?? [];

  const walletBubbles: WalletBubbleItem[] = topWallets.map((w, idx) => {
    const totalCount = topWallets.length;
    const angle = (idx / totalCount) * 2 * Math.PI;
    const dist = idx === 0 ? 0 : idx < 3 ? 75 : 140;
    const x = 300 + Math.cos(angle) * dist;
    const y = 180 + Math.sin(angle) * dist;
    return {
      address: w.address,
      volume: w.volume,
      netFlow: w.netFlow,
      isDeployer: w.isDeployer,
      isEarly: w.isEarly,
      isFeeRecipient: w.isFeeRecipient,
      x,
      y,
    };
  });

  const constellationNodes: ConstellationNode[] = [
    {
      contractAddress: ca,
      symbol: symbol || "TARGET",
      status: "active",
      isCurrent: true,
      x: 300,
      y: 180,
    },
  ];

  if (raw.resolvedDeployerAddress) {
    constellationNodes.push({
      contractAddress: raw.resolvedDeployerAddress,
      symbol: "DEPLOYER",
      status: deployerScoreData?.band === "green" ? "active" : deployerScoreData?.band === "yellow" ? "hold" : "rugged",
      isCurrent: false,
      x: 180,
      y: 110,
    });
  }

  if (feeRecipientAddr) {
    constellationNodes.push({
      contractAddress: feeRecipientAddr,
      symbol: "TREASURY",
      status: "hold",
      isCurrent: false,
      x: 420,
      y: 110,
    });
  }

  if (poolAddress) {
    constellationNodes.push({
      contractAddress: poolAddress,
      symbol: isGraduated ? "UNIV3-LP" : "CURVE-POOL",
      status: isGraduated ? "active" : "hold",
      isCurrent: false,
      x: 300,
      y: 280,
    });
  }

  mappedLaunches
    .filter((l) => l.contractAddress.toLowerCase() !== normalizedCA)
    .slice(0, 3)
    .forEach((l, i) => {
      const xPos = i === 0 ? 120 : i === 1 ? 480 : 300;
      const yPos = i === 0 ? 250 : i === 1 ? 250 : 60;
      constellationNodes.push({
        contractAddress: l.contractAddress,
        symbol: l.symbol || "SISTER",
        status: l.status === "graduated" ? "active" : "passed",
        isCurrent: false,
        x: xPos,
        y: yPos,
      });
    });

  const constellationEdges: ConstellationEdge[] = [];

  if (raw.resolvedDeployerAddress) {
    constellationEdges.push({
      source: raw.resolvedDeployerAddress,
      target: ca,
      type: "confirmed",
      reason: `Genesis deployer origin (${raw.resolvedDeployerAddress.slice(0, 6)}...)`,
    });
  }

  if (feeRecipientAddr) {
    constellationEdges.push({
      source: ca,
      target: feeRecipientAddr,
      type: "confirmed",
      reason: `Protocol fee recipient link`,
    });
  }

  if (poolAddress) {
    constellationEdges.push({
      source: ca,
      target: poolAddress,
      type: "confirmed",
      reason: isGraduated ? "Migrated Uniswap V3 Liquidity Pool" : "Active Pons V2 Bonding Curve",
    });
  }

  if (raw.resolvedDeployerAddress) {
    const deployerAddr = raw.resolvedDeployerAddress;
    constellationNodes
      .filter((n) => !n.isCurrent && n.contractAddress !== deployerAddr && n.contractAddress !== feeRecipientAddr && n.contractAddress !== poolAddress)
      .forEach((n) => {
        constellationEdges.push({
          source: deployerAddr,
          target: n.contractAddress,
          type: "confirmed",
          reason: `Sybil ring sister launch by same deployer`,
        });
      });
  }

  const connections: ConnectionItem[] = constellationNodes
    .filter((n) => !n.isCurrent)
    .map((n) => ({
      contractAddress: n.contractAddress,
      symbol: n.symbol,
      type: "confirmed",
      reason: n.symbol === "DEPLOYER" ? "Genesis Creator Wallet" : n.symbol === "TREASURY" ? "Fee Collector" : n.symbol.includes("LP") ? "DEX Pool" : `Linked Launch (${n.contractAddress.slice(0, 6)}...)`,
    }));

  const tradeCandles: TradeCandleData[] = snapCurve?.candles ?? [];
  const graduationIdx = isGraduated ? tradeCandles.findIndex((c) => c.isGraduation) : null;
  const resolvedGraduationIdx = graduationIdx !== null && graduationIdx >= 0 ? graduationIdx : null;

  const dossierData: DossierData | null = activeDossier
    ? {
        id: activeDossier.id,
        walletAddress: activeDossier.walletAddress,
        chainId: activeDossier.chainId,
        contractAddress: activeDossier.contractAddress,
        symbol: activeDossier.symbol,
        name: activeDossier.name,
        status: activeDossier.status,
        reason: activeDossier.reason,
        thesis: activeDossier.thesis,
        notes: activeDossier.notes,
        decisionReason: activeDossier.decisionReason,
        createdAt: activeDossier.createdAt,
        updatedAt: activeDossier.updatedAt,
        originAuthor: activeDossier.originAuthor,
        originAt: activeDossier.originAt,
        items: (raw.items || []).map((it) => ({
          id: it.id,
          dossierId: it.dossierId,
          kind: it.kind,
          text: it.text,
          position: it.position,
        })),
        questions: (raw.questions || []).map((q) => ({
          id: q.id,
          dossierId: q.dossierId,
          text: q.text,
          done: q.done,
          position: q.position,
        })),
        logs: timelineLogs.map((tl) => ({
          id: tl.id,
          dossierId: activeDossier.id,
          at: tl.at,
          text: tl.text,
        })),
        snapshots: [],
      }
    : null;

  return {
    contractAddress: ca,
    symbol: symbol || undefined,
    name: name || undefined,
    phase,
    status: activeDossier?.status || "Researching",
    marketCapUsd,
    athUsd,
    curveProgressPct,
    volume24hUsd,
    tradeCount,
    uniqueWallets,
    feeRecipient: feeRecipientAddr,
    poolAddress,
    tradeFlow,
    tradeCandles,
    graduationIndex: resolvedGraduationIdx,
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
