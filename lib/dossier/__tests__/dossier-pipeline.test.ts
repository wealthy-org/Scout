import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { transformDossierPageData } from "@/lib/dossier/transform";
import { fetchDossierPageData } from "@/lib/dossier/fetch";

describe("Dossier Query & Transform Pipeline (REFACTOR-2 & SPEC-3)", () => {
  test("transformDossierPageData transforms raw query result into structured props with dynamic top wallets and bubbles", () => {
    const rawMock = {
      existingDossierRecords: [],
      userDossierRecord: null,
      deployerAsDeployer: [],
      deployerLaunchesByDeployer: [],
      tokenLaunchRecord: {
        deployerAddress: "0xdeployer1111111111111111111111111111111111",
        tokenAddress: "0xtoken1111111111111111111111111111111111111",
        block: 100,
        phase: "graduated",
      },
      deployerScoreRecord: {
        deployerAddress: "0xdeployer1111111111111111111111111111111111",
        totalLaunches: 5,
        graduatedCount: 4,
        deadOnArrivalCount: 0,
        burstLaunches: 0,
        feeRecipientReuse: 1,
        score: 85,
        label: "repeat" as const,
        band: "green" as const,
        updatedAt: new Date(),
      },
      deployerLaunchesList: [
        {
          deployerAddress: "0xdeployer1111111111111111111111111111111111",
          tokenAddress: "0xtoken1111111111111111111111111111111111111",
          block: 100,
          phase: "graduated",
        },
      ],
      latestSnapshots: [
        {
          id: "snap-1",
          dossierId: "d-1",
          at: new Date(),
          marketJson: {
            fdv: 120000,
            volume24h: 45000,
            tradeCount: 200,
            uniqueWallets: 60,
          },
          curveJson: {
            progress: 100,
            buyVolume: 25000,
            sellVolume: 20000,
            topWallets: [
              {
                address: "0xdeployer1111111111111111111111111111111111",
                volume: 15000,
                netFlow: 8000,
                tradeCount: 12,
                isDeployer: true,
              },
            ],
          },
          chainJson: {},
        } as any,
      ],
      logs: [],
      items: [],
      questions: [],
      resolvedDeployerAddress: "0xdeployer1111111111111111111111111111111111",
    };

    const transformed = transformDossierPageData(
      "0xtoken1111111111111111111111111111111111111",
      rawMock
    );

    assert.strictEqual(
      transformed.contractAddress,
      "0xtoken1111111111111111111111111111111111111"
    );
    assert.strictEqual(transformed.deployer?.score, 85);
    assert.strictEqual(transformed.deployer?.band, "green");
    assert.strictEqual(transformed.curveProgressPct, 100);
    assert.ok(Array.isArray(transformed.topWallets));
    assert.ok(transformed.topWallets!.length > 0);
    assert.strictEqual(
      transformed.topWallets![0].address,
      "0xdeployer1111111111111111111111111111111111"
    );
    assert.strictEqual(transformed.topWallets![0].isDeployer, true);
    assert.ok(Array.isArray(transformed.walletBubbles));
    assert.ok(transformed.walletBubbles!.length > 0);
    assert.strictEqual(typeof transformed.tradeFlow?.buyVolume, "number");
    assert.strictEqual(typeof transformed.tradeFlow?.sellVolume, "number");
  });

  test("fetchDossierPageData returns fallback structure on empty/unconnected address without crashing", async () => {
    const result = await fetchDossierPageData("0x0000000000000000000000000000000000000000");
    assert.ok(result);
    assert.strictEqual(result.contractAddress, "0x0000000000000000000000000000000000000000");
    assert.strictEqual(result.marketCapUsd, undefined);
  });
});
