import { queryDossierRawData } from "@/lib/dossier/query";
import {
  transformDossierPageData,
  type DossierPagePropsData,
} from "@/lib/dossier/transform";

export type { DossierPagePropsData };

export async function fetchDossierPageData(
  ca: string,
  userWalletAddress?: string
): Promise<DossierPagePropsData> {
  try {
    const rawData = await queryDossierRawData(ca, userWalletAddress);
    return transformDossierPageData(ca, rawData, userWalletAddress);
  } catch {
    return {
      contractAddress: ca,
      symbol: undefined,
      name: undefined,
      status: "Researching",
      marketCapUsd: undefined,
      athUsd: undefined,
      curveProgressPct: undefined,
      volume24hUsd: undefined,
      tradeCount: undefined,
      uniqueWallets: undefined,
      feeRecipient: undefined,
      poolAddress: undefined,
      tradeFlow: undefined,
      tradeCandles: [],
      graduationIndex: null,
      deployer: undefined,
      launches: [],
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
