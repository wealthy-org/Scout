import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { transformDossierPageData } from "@/lib/dossier/transform";
import type { RawDossierQueryResult } from "@/lib/dossier/query";
import type { Snapshot } from "@/lib/db/schema";

describe("Dossier Transform Data Integrity & Zero Fabrication (TICKET-142)", () => {
  it("ensures transform.ts does not contain seed calculations, sisterHex, synthetic logs, or fake tickers", () => {
    const filePath = path.join(process.cwd(), "lib/dossier/transform.ts");
    const content = fs.readFileSync(filePath, "utf-8");
    assert.strictEqual(content.includes("let seed = 0"), false);
    assert.strictEqual(content.includes("sisterHex"), false);
    assert.strictEqual(content.includes("Zero mint vulnerabilities detected"), false);
    assert.strictEqual(content.includes("normalizedCA.includes(\"aaaa\")"), false);
  });

  it("returns honest empty/undefined states when no snapshots or historical records exist", () => {
    const ca = "0x1234567890abcdef1234567890abcdef12345678";
    const rawMock: RawDossierQueryResult = {
      existingDossierRecords: [],
      userDossierRecord: null,
      deployerAsDeployer: [],
      deployerLaunchesByDeployer: [],
      tokenLaunchRecord: null,
      deployerScoreRecord: null,
      deployerLaunchesList: [],
      latestSnapshots: [],
      logs: [],
      items: [],
      questions: [],
      resolvedDeployerAddress: null,
    };

    const transformed = transformDossierPageData(ca, rawMock);

    assert.strictEqual(transformed.contractAddress, ca);
    assert.strictEqual(transformed.marketCapUsd, undefined);
    assert.strictEqual(transformed.athUsd, undefined);
    assert.strictEqual(transformed.volume24hUsd, undefined);
    assert.strictEqual(transformed.curveProgressPct, undefined);
    assert.strictEqual(transformed.tradeCount, undefined);
    assert.strictEqual(transformed.uniqueWallets, undefined);
    assert.deepStrictEqual(transformed.topWallets, []);
    assert.deepStrictEqual(transformed.walletBubbles, []);
    assert.deepStrictEqual(transformed.tradeCandles, []);
    assert.deepStrictEqual(transformed.diffs, []);
    assert.deepStrictEqual(transformed.timelineLogs, []);
  });

  it("populates real market metrics, top wallets, and candles when present in snapshot", () => {
    const ca = "0x1234567890abcdef1234567890abcdef12345678";
    const rawMock: RawDossierQueryResult = {
      existingDossierRecords: [],
      userDossierRecord: null,
      deployerAsDeployer: [],
      deployerLaunchesByDeployer: [],
      tokenLaunchRecord: {
        deployerAddress: "0xdeployer",
        tokenAddress: ca,
        block: 28000000,
        phase: "curve",
      },
      deployerScoreRecord: {
        deployerAddress: "0xdeployer",
        totalLaunches: 3,
        graduatedCount: 1,
        deadOnArrivalCount: 0,
        burstLaunches: 0,
        feeRecipientReuse: 0,
        score: 72,
        label: "repeat",
        band: "yellow",
        updatedAt: new Date(),
      },
      deployerLaunchesList: [
        {
          deployerAddress: "0xdeployer",
          tokenAddress: ca,
          block: 28000000,
          phase: "curve",
        },
      ],
      latestSnapshots: [
        {
          id: "snap-1",
          dossierId: "d-1",
          at: new Date(),
          marketJson: {
            fdv: 85000,
            volume24h: 32000,
            tradeCount: 150,
            uniqueWallets: 45,
          },
          curveJson: {
            progress: 68.5,
            topWallets: [
              {
                address: "0xdeployer",
                volume: 12000,
                netFlow: 5000,
                tradeCount: 10,
                isDeployer: true,
              },
            ],
            candles: [
              {
                index: 1,
                open: 100,
                high: 110,
                low: 95,
                close: 105,
                volume: 500,
                isBuy: true,
                isGraduation: false,
                txHash: "0xtx1",
                timestamp: Date.now(),
              },
            ],
          },
          chainJson: {
            fee_recipient: "0xfee111",
            pool_address: "0xpool111",
          },
        } as unknown as Snapshot,
      ],
      logs: [
        {
          id: "log-1",
          dossierId: "d-1",
          at: new Date(),
          text: "Real log entry from researcher",
        },
      ],
      items: [],
      questions: [],
      resolvedDeployerAddress: "0xdeployer",
    };

    const transformed = transformDossierPageData(ca, rawMock);

    assert.strictEqual(transformed.marketCapUsd, 85000);
    assert.strictEqual(transformed.volume24hUsd, 32000);
    assert.strictEqual(transformed.tradeCount, 150);
    assert.strictEqual(transformed.uniqueWallets, 45);
    assert.strictEqual(transformed.curveProgressPct, 68.5);
    assert.strictEqual(transformed.feeRecipient, "0xfee111");
    assert.strictEqual(transformed.poolAddress, "0xpool111");
    assert.strictEqual(transformed.topWallets?.length, 1);
    assert.strictEqual(transformed.tradeCandles?.length, 1);
    assert.strictEqual(transformed.timelineLogs?.length, 1);
    assert.strictEqual(transformed.timelineLogs?.[0].text, "Real log entry from researcher");
  });
});
