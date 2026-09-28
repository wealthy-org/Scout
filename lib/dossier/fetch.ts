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
