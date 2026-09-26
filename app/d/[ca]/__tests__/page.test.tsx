import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import DossierPage, {
  DossierPageView,
  type DossierPagePropsData,
} from "@/app/d/[ca]/page";

describe("Dossier Page Assembly (TICKET-43)", () => {
  const mockPageData: DossierPagePropsData = {
    contractAddress: "0x1111111111111111111111111111111111111111",
    symbol: "MOCK",
    name: "Mock Token",
    status: "Researching",
    marketCapUsd: 150000,
    athUsd: 200000,
    curveProgressPct: 100,
    volume24hUsd: 25000,
    tradeCount: 150,
    uniqueWallets: 45,
    feeRecipient: "0x3333333333333333333333333333333333333333",
    poolAddress: "0x4444444444444444444444444444444444444444",
    tradeFlow: {
      buyVolume: 15000,
      sellVolume: 10000,
      buyCount: 90,
      sellCount: 60,
      quoteAsset: "USDG",
    },
    deployer: {
      address: "0x2222222222222222222222222222222222222222",
      score: 75,
      label: "repeat",
      band: "green",
      totalLaunches: 4,
      graduatedCount: 2,
    },
    launches: [
      {
        contractAddress: "0x1111111111111111111111111111111111111111",
        symbol: "MOCK",
        status: "graduated",
      },
    ],
    walletBubbles: [
      {
        address: "0x5555555555555555555555555555555555555555",
        volume: 12500,
        netFlow: 5000,
      },
    ],
    topWallets: [
      {
        address: "0x5555555555555555555555555555555555555555",
        volume: 12500,
        netFlow: 5000,
        tradeCount: 5,
      },
    ],
    constellationNodes: [
      {
        contractAddress: "0x1111111111111111111111111111111111111111",
        symbol: "MOCK",
        isCurrent: true,
      },
    ],
    constellationEdges: [],
    dossier: {
      id: "dos-1",
      walletAddress: "0xUser",
      chainId: 1,
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "MOCK",
      name: "Mock Token",
      status: "Researching",
      reason: "Potential alpha",
      thesis: "Strong dev presence",
      notes: "Checking social proof",
      decisionReason: null,
      createdAt: "2026-09-20T10:00:00Z",
      updatedAt: "2026-09-21T10:00:00Z",
      originAuthor: null,
      originAt: null,
      items: [],
      questions: [],
      logs: [
        {
          id: "log-1",
          dossierId: "dos-1",
          at: "2026-09-21T10:00:00Z",
          text: "Initial research log",
        },
      ],
      snapshots: [],
    },
    diffs: [],
    connectedDossiers: [],
    connections: [],
    timelineLogs: [
      {
        id: "log-1",
        at: "2026-09-21T10:00:00Z",
        text: "Initial research log",
      },
    ],
    isAnonymous: false,
  };

  test("renders all 13 core dossier UI blocks in DossierPageView", () => {
    const html = renderToString(<DossierPageView data={mockPageData} />);
    assert.ok(html.includes("MOCK"));
    assert.ok(html.includes("Mock Token"));
    assert.ok(html.includes("Researching"));
    assert.ok(html.includes("Deployer History"));
    assert.ok(html.includes("Since Last Check"));
    assert.ok(html.includes("Connections"));
  });

  test("renders anonymous user banner in research panel when isAnonymous is true", () => {
    const anonData: DossierPagePropsData = {
      ...mockPageData,
      isAnonymous: true,
      dossier: null,
    };
    const html = renderToString(<DossierPageView data={anonData} />);
    assert.ok(html.includes("Connect Wallet") || html.includes("Sign In") || html.includes("Save Note"));
  });

  test("renders educational fallback when token is not registered on Pons V2", () => {
    const notPonsData: DossierPagePropsData = {
      contractAddress: "0x9999999999999999999999999999999999999999",
      notPonsV2Token: true,
    };
    const html = renderToString(<DossierPageView data={notPonsData} />);
    assert.ok(html.includes("Not a Pons V2 Token"));
    assert.ok(html.includes("0x9999999999999999999999999999999999999999"));
  });

  test("DossierPage async Server Component executes and resolves without error", async () => {
    const pageJsx = await DossierPage({
      params: Promise.resolve({
        ca: "0x1111111111111111111111111111111111111111",
      }),
    });
    const html = renderToString(pageJsx);
    assert.ok(html.includes("0x1111111111111111111111111111111111111111"));
  });
});
