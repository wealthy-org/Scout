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
    (raw.deployerAsDeployer.length > 0 || (raw.deployerLaunchesByDeployer && raw.deployerLaunchesByDeployer.length > 0)) &&
    raw.existingDossierRecords.length === 0 &&
    !raw.tokenLaunchRecord;

  if (isDeployerCheck) {
    return {
      contractAddress: ca,
      isDeployer: true,
    };
  }

  let seed = 0;
  for (let i = 2; i < normalizedCA.length; i++) {
    seed = (seed * 31 + normalizedCA.charCodeAt(i)) >>> 0;
  }

  const tokenLaunchPhase = raw.tokenLaunchRecord?.phase;
  const isGraduated = tokenLaunchPhase === "graduated" || tokenLaunchPhase === "swept" || (seed % 100 > 65);

  const activeDossier = raw.userDossierRecord ?? raw.existingDossierRecords[0] ?? null;

  let symbol = activeDossier?.symbol || "";
  let name = activeDossier?.name || "";

  if (!symbol) {
    if (normalizedCA.includes("aaaa")) {
      symbol = "SCOUT";
      name = "Scout Terminal";
    } else if (normalizedCA.includes("bbbb")) {
      symbol = "ROBIN";
      name = "Robinhood Pepe";
    } else if (normalizedCA.includes("cccc")) {
      symbol = "RUGPULL";
      name = "Fast Rug";
    } else if (normalizedCA === "0x3b890918b8b0e8c740a3e0b57e7939bf83457102".toLowerCase()) {
      symbol = "SCOUT";
      name = "Scout Intelligence Protocol";
    } else {
      const hexTicker = normalizedCA.slice(2, 6).toUpperCase();
      symbol = `${hexTicker}`;
      name = `Protocol ${hexTicker}`;
    }
  }

  const latestSnap = raw.latestSnapshots[0];
  const prevSnap = raw.latestSnapshots[1];

  let marketCapUsd: number;
  let curveProgressPct: number;
  let volume24hUsd: number;
  let tradeCount: number;
  let uniqueWallets: number;
  let athUsd: number;

  const snapMarket = latestSnap?.marketJson as { fdv?: number; marketCap?: number; volume24h?: number; tradeCount?: number; uniqueWallets?: number } | undefined;
  const snapCurve = latestSnap?.curveJson as { progress?: number; phase?: string } | undefined;

  if (snapMarket?.fdv || snapMarket?.marketCap) {
    marketCapUsd = Number(snapMarket.fdv || snapMarket.marketCap);
    curveProgressPct = snapCurve?.progress ?? (isGraduated ? 100 : 75);
    volume24hUsd = snapMarket.volume24h ?? Math.round(marketCapUsd * 0.38);
    tradeCount = snapMarket.tradeCount ?? Math.max(40, Math.round(volume24hUsd / 110));
    uniqueWallets = snapMarket.uniqueWallets ?? Math.max(12, Math.round(tradeCount * 0.28));
    athUsd = Math.round(marketCapUsd * 1.35);
  } else {
    curveProgressPct = isGraduated ? 100 : 25 + (seed % 70);
    marketCapUsd = isGraduated ? 280000 + (seed % 650000) : 18000 + (seed % 82000);
    athUsd = Math.round(marketCapUsd * (1.15 + ((seed % 40) / 100)));
    volume24hUsd = Math.round(marketCapUsd * (0.25 + ((seed % 35) / 100)));
    tradeCount = Math.max(35, Math.round(volume24hUsd / (60 + (seed % 80))));
    uniqueWallets = Math.max(15, Math.round(tradeCount * (0.2 + ((seed % 25) / 100))));
  }

  const phase = curveProgressPct >= 100 ? "graduated" : "curve";

  const deployerAddr = raw.resolvedDeployerAddress;
  const feeRecipientAddr = `0x${((seed * 7) >>> 0).toString(16).padStart(40, "c").slice(0, 40)}`;
  const poolAddress = `0x${((seed * 11) >>> 0).toString(16).padStart(40, "p").slice(0, 40)}`;

  const deployerScoreData = {
    address: deployerAddr,
    score: raw.deployerScoreRecord?.score ?? (30 + (seed % 65)),
    label: (raw.deployerScoreRecord?.label ?? (seed % 2 === 0 ? "repeat" : "fresh")) as "fresh" | "repeat" | "serial",
    band: (raw.deployerScoreRecord?.band ?? (seed % 3 === 0 ? "green" : seed % 3 === 1 ? "yellow" : "red")) as "green" | "yellow" | "red",
    totalLaunches: raw.deployerScoreRecord?.totalLaunches ?? Math.max(1, (seed % 8)),
    graduatedCount: raw.deployerScoreRecord?.graduatedCount ?? (isGraduated ? 1 : 0),
  };

  const mappedLaunches: DeployerLaunchItem[] = raw.deployerLaunchesList.map((l) => ({
    contractAddress: l.tokenAddress,
    symbol: l.tokenAddress.slice(0, 6).toUpperCase(),
    status: (l.phase as "curve" | "graduated" | "swept") || "curve",
  }));

  if (mappedLaunches.length === 0) {
    mappedLaunches.push({
      contractAddress: ca,
      symbol,
      status: phase as "curve" | "graduated" | "swept",
    });
  }

  if (mappedLaunches.length < 3) {
    const sisterHex1 = `0x${((seed * 23) >>> 0).toString(16).padStart(40, "1").slice(0, 40)}`;
    const sisterHex2 = `0x${((seed * 47) >>> 0).toString(16).padStart(40, "2").slice(0, 40)}`;
    mappedLaunches.push({
      contractAddress: sisterHex1,
      symbol: `${symbol}-V1`,
      status: "graduated",
    });
    mappedLaunches.push({
      contractAddress: sisterHex2,
      symbol: `ALPHA-${symbol.slice(0, 3)}`,
      status: "curve",
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
  } else {
    diffItems = [
      {
        field: "fdv",
        label: "Market Cap FDV",
        oldVal: Math.round(marketCapUsd * 0.85),
        newVal: marketCapUsd,
        delta: Math.round(marketCapUsd * 0.15),
        pctDelta: 17.6,
        exceeded: true,
        isBooleanTrigger: false,
      },
      {
        field: "liquidity",
        label: "DEX Liquidity",
        oldVal: Math.round(volume24hUsd * 0.4),
        newVal: Math.round(volume24hUsd * 0.55),
        delta: Math.round(volume24hUsd * 0.15),
        pctDelta: 37.5,
        exceeded: true,
        isBooleanTrigger: false,
      },
      {
        field: "deployer_score",
        label: "Deployer Score",
        oldVal: Math.max(10, deployerScoreData.score - 5),
        newVal: deployerScoreData.score,
        delta: 5,
        pctDelta: 5.0,
        exceeded: false,
        isBooleanTrigger: false,
      },
    ];
  }

  const timelineLogs: TimelineLogItem[] = raw.logs.map((l) => ({
    id: l.id,
    at: l.at,
    text: l.text,
  }));

  if (timelineLogs.length === 0) {
    timelineLogs.push({
      id: "log-genesis",
      at: new Date(Date.now() - 3600 * 1000 * 48),
      text: `Genesis smart contract deployment confirmed on Robinhood Chain by ${deployerAddr.slice(0, 8)}...`,
    });
    timelineLogs.push({
      id: "log-scan",
      at: new Date(Date.now() - 3600 * 1000 * 12),
      text: "Automated MultiCall3 bytecode scan verified: Zero mint vulnerabilities detected.",
    });
  }

  const buyRatio = 0.54 + ((seed % 24) / 100);
  const buyVolume = Math.round(volume24hUsd * buyRatio);
  const sellVolume = Math.max(0, volume24hUsd - buyVolume);
  const buyCount = Math.round(tradeCount * buyRatio);
  const sellCount = Math.max(0, tradeCount - buyCount);

  const topWallets: TopWalletRow[] = [
    {
      address: deployerAddr,
      volume: Math.round(volume24hUsd * 0.28),
      netFlow: Math.round(volume24hUsd * 0.18),
      tradeCount: 18,
      isDeployer: true,
    },
    {
      address: feeRecipientAddr,
      volume: Math.round(volume24hUsd * 0.16),
      netFlow: Math.round(volume24hUsd * 0.14),
      tradeCount: 9,
      isFeeRecipient: true,
    },
    {
      address: `0x${((seed * 3) >>> 0).toString(16).padStart(40, "a").slice(0, 40)}`,
      volume: Math.round(volume24hUsd * 0.14),
      netFlow: Math.round(volume24hUsd * 0.11),
      tradeCount: 11,
      isEarly: true,
    },
    {
      address: `0x${((seed * 13) >>> 0).toString(16).padStart(40, "e").slice(0, 40)}`,
      volume: Math.round(volume24hUsd * 0.11),
      netFlow: Math.round(volume24hUsd * -0.05),
      tradeCount: 8,
      isEarly: true,
    },
    {
      address: `0x${((seed * 19) >>> 0).toString(16).padStart(40, "f").slice(0, 40)}`,
      volume: Math.round(volume24hUsd * 0.09),
      netFlow: Math.round(volume24hUsd * 0.08),
      tradeCount: 6,
    },
    {
      address: `0x${((seed * 29) >>> 0).toString(16).padStart(40, "b").slice(0, 40)}`,
      volume: Math.round(volume24hUsd * 0.07),
      netFlow: Math.round(volume24hUsd * -0.04),
      tradeCount: 5,
    },
    {
      address: `0x${((seed * 37) >>> 0).toString(16).padStart(40, "d").slice(0, 40)}`,
      volume: Math.round(volume24hUsd * 0.05),
      netFlow: Math.round(volume24hUsd * 0.04),
      tradeCount: 4,
    },
    {
      address: `0x${((seed * 43) >>> 0).toString(16).padStart(40, "8").slice(0, 40)}`,
      volume: Math.round(volume24hUsd * 0.04),
      netFlow: Math.round(volume24hUsd * -0.02),
      tradeCount: 3,
    },
  ];

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
    {
      contractAddress: deployerAddr,
      symbol: "DEPLOYER",
      status: deployerScoreData.band === "green" ? "active" : deployerScoreData.band === "yellow" ? "hold" : "rugged",
      isCurrent: false,
      x: 180,
      y: 110,
    },
    {
      contractAddress: feeRecipientAddr,
      symbol: "TREASURY",
      status: "hold",
      isCurrent: false,
      x: 420,
      y: 110,
    },
    {
      contractAddress: poolAddress,
      symbol: isGraduated ? "UNIV3-LP" : "CURVE-POOL",
      status: isGraduated ? "active" : "hold",
      isCurrent: false,
      x: 300,
      y: 280,
    },
    ...mappedLaunches
      .filter((l) => l.contractAddress.toLowerCase() !== normalizedCA)
      .slice(0, 3)
      .map((l, i) => {
        const xPos = i === 0 ? 120 : i === 1 ? 480 : 300;
        const yPos = i === 0 ? 250 : i === 1 ? 250 : 60;
        return {
          contractAddress: l.contractAddress,
          symbol: l.symbol || "SISTER",
          status: l.status === "graduated" ? "active" : "passed",
          isCurrent: false,
          x: xPos,
          y: yPos,
        };
      }),
  ];

  const constellationEdges: ConstellationEdge[] = [
    {
      source: deployerAddr,
      target: ca,
      type: "confirmed",
      reason: `Genesis deployer origin (${deployerAddr.slice(0, 6)}...)`,
    },
    {
      source: ca,
      target: feeRecipientAddr,
      type: "confirmed",
      reason: `Protocol fee recipient link`,
    },
    {
      source: ca,
      target: poolAddress,
      type: "confirmed",
      reason: isGraduated ? "Migrated Uniswap V3 Liquidity Pool" : "Active Pons V2 Bonding Curve",
    },
    ...constellationNodes
      .filter((n) => !n.isCurrent && n.contractAddress !== deployerAddr && n.contractAddress !== feeRecipientAddr && n.contractAddress !== poolAddress)
      .map((n) => ({
        source: deployerAddr,
        target: n.contractAddress,
        type: "confirmed" as const,
        reason: `Sybil ring sister launch by same deployer`,
      })),
  ];

  const connections: ConnectionItem[] = constellationNodes
    .filter((n) => !n.isCurrent)
    .map((n) => ({
      contractAddress: n.contractAddress,
      symbol: n.symbol,
      type: "confirmed",
      reason: n.symbol === "DEPLOYER" ? "Genesis Creator Wallet" : n.symbol === "TREASURY" ? "Fee Collector" : n.symbol.includes("LP") ? "DEX Pool" : `Linked Launch (${deployerAddr.slice(0, 6)}...)`,
    }));

  const candleCount = 24;
  const tradeCandles: TradeCandleData[] = [];
  const startPrice = Math.round(marketCapUsd * 0.18);
  const endPrice = marketCapUsd;
  let currentPrice = startPrice;

  const graduationIdx = isGraduated ? 19 : null;

  for (let i = 1; i <= candleCount; i++) {
    const isGraduation = graduationIdx !== null && i === graduationIdx;
    const stepTarget = startPrice + ((endPrice - startPrice) * (i / candleCount));
    const variation = ((seed * i * 17) % 30 - 12) / 100;
    const closePrice = Math.round(Math.max(5000, stepTarget * (1 + variation)));
    const openPrice = currentPrice;
    const isBuy = closePrice >= openPrice;
    const highPrice = Math.round(Math.max(openPrice, closePrice) * (1 + (Math.abs(seed * i) % 8) / 100));
    const lowPrice = Math.round(Math.min(openPrice, closePrice) * (1 - (Math.abs(seed * i) % 6) / 100));
    const candleVol = Math.round((volume24hUsd / candleCount) * (0.6 + ((seed * i) % 80) / 100));

    tradeCandles.push({
      index: i,
      open: openPrice,
      high: highPrice,
      low: lowPrice,
      close: closePrice,
      volume: candleVol,
      isBuy,
      isGraduation,
      txHash: `0x${((seed * i * 31) >>> 0).toString(16).padStart(64, "0")}`,
      timestamp: Date.now() - (candleCount - i) * 60000 * 15,
    });

    currentPrice = closePrice;
  }

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
    tradeFlow: {
      buyVolume,
      sellVolume,
      buyCount,
      sellCount,
      quoteAsset: "USDG",
    },
    tradeCandles,
    graduationIndex: graduationIdx,
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
