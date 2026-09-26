import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { compareSnapshots } from "@/lib/diff/compare";
import {
  DIFF_FDV_PCT,
  DIFF_LIQUIDITY_PCT,
  DIFF_SCORE_POINTS,
  DIFF_CURVE_GRADUATED,
  DIFF_FEE_RECIPIENT_CHANGED,
} from "@/config/diff";
import { mockData } from "@/scripts/seed";
import type { SnapshotData } from "@/types/diff";

describe("Snapshot Comparison Engine Fixtures & Scenarios (TICKET-20)", () => {
  const rootDir = process.cwd();
  const fixturesTestPath = path.join(
    rootDir,
    "lib",
    "diff",
    "__tests__",
    "compare.fixtures.test.ts"
  );

  test("lib/diff/__tests__/compare.fixtures.test.ts file must exist", () => {
    assert.strictEqual(
      fs.existsSync(fixturesTestPath),
      true,
      "fixtures test file must exist"
    );
  });

  test("AC: snapshot identik -> compareSnapshots mengembalikan array kosong []", () => {
    const identicalSnapshot: SnapshotData = {
      fdv: 500000,
      liquidity: 80000,
      deployer_score: 72,
      phase: "curve",
      feeRecipient: "0x1111111111111111111111111111111111111111",
      repoCommitSha: "sha-root-01",
      deployerLaunchesCount: 5,
    };

    const result = compareSnapshots(identicalSnapshot, identicalSnapshot);
    assert.deepStrictEqual(result, []);
  });

  test("AC: Test case FDV +5% -> output kosong (tidak exceed)", () => {
    const prev: SnapshotData = { fdv: 100000 };
    const current: SnapshotData = { fdv: 105000 };

    const diffs = compareSnapshots(prev, current);
    assert.deepStrictEqual(diffs, []);
  });

  test("AC: Test case FDV +15% -> output berisi entry FDV dengan exceeded: true (threshold 10%)", () => {
    const prev: SnapshotData = { fdv: 100000 };
    const current: SnapshotData = { fdv: 115000 };

    const diffs = compareSnapshots(prev, current);
    assert.strictEqual(diffs.length, 1);
    assert.strictEqual(diffs[0].field, "fdv");
    assert.strictEqual(diffs[0].exceeded, true);
    assert.strictEqual(diffs[0].oldVal, 100000);
    assert.strictEqual(diffs[0].newVal, 115000);
    assert.strictEqual(diffs[0].delta, 15000);
    assert.strictEqual(diffs[0].pctDelta, 15);
    assert.strictEqual(diffs[0].isBooleanTrigger, false);
    assert.strictEqual(diffs[0].pctDelta >= DIFF_FDV_PCT, true);
  });

  test("AC: Test case Liquidity -20% -> output berisi entry Liquidity (threshold 15%)", () => {
    const prev: SnapshotData = { liquidity: 100000 };
    const current: SnapshotData = { liquidity: 80000 };

    const diffs = compareSnapshots(prev, current);
    assert.strictEqual(diffs.length, 1);
    assert.strictEqual(diffs[0].field, "liquidity");
    assert.strictEqual(diffs[0].exceeded, true);
    assert.strictEqual(diffs[0].oldVal, 100000);
    assert.strictEqual(diffs[0].newVal, 80000);
    assert.strictEqual(diffs[0].delta, -20000);
    assert.strictEqual(diffs[0].pctDelta, -20);
    assert.strictEqual(diffs[0].isBooleanTrigger, false);
    assert.strictEqual(Math.abs(diffs[0].pctDelta) >= DIFF_LIQUIDITY_PCT, true);
  });

  test("AC: Test case Score +3 poin -> output kosong; Score +10 poin -> output berisi entry Score", () => {
    const prev: SnapshotData = { deployer_score: 60 };
    const currentSubThreshold: SnapshotData = { deployer_score: 63 };

    const subDiffs = compareSnapshots(prev, currentSubThreshold);
    assert.deepStrictEqual(subDiffs, []);

    const currentExceeded: SnapshotData = { deployer_score: 70 };
    const exceededDiffs = compareSnapshots(prev, currentExceeded);
    assert.strictEqual(exceededDiffs.length, 1);
    assert.strictEqual(exceededDiffs[0].field, "deployer_score");
    assert.strictEqual(exceededDiffs[0].exceeded, true);
    assert.strictEqual(exceededDiffs[0].oldVal, 60);
    assert.strictEqual(exceededDiffs[0].newVal, 70);
    assert.strictEqual(exceededDiffs[0].delta, 10);
    assert.strictEqual(exceededDiffs[0].delta >= DIFF_SCORE_POINTS, true);
  });

  test("AC: Test case phase 'curve' -> 'graduated' -> output berisi entry boolean trigger", () => {
    const prev: SnapshotData = { phase: "curve" };
    const current: SnapshotData = { phase: "graduated" };

    const diffs = compareSnapshots(prev, current);
    assert.strictEqual(diffs.length, 1);
    assert.strictEqual(diffs[0].field, DIFF_CURVE_GRADUATED);
    assert.strictEqual(diffs[0].oldVal, "curve");
    assert.strictEqual(diffs[0].newVal, "graduated");
    assert.strictEqual(diffs[0].exceeded, true);
    assert.strictEqual(diffs[0].isBooleanTrigger, true);
  });

  test("AC: Test case fee recipient change -> output berisi entry boolean trigger", () => {
    const prev: SnapshotData = {
      feeRecipient: "0x1111111111111111111111111111111111111111",
    };
    const current: SnapshotData = {
      feeRecipient: "0x2222222222222222222222222222222222222222",
    };

    const diffs = compareSnapshots(prev, current);
    assert.strictEqual(diffs.length, 1);
    assert.strictEqual(diffs[0].field, DIFF_FEE_RECIPIENT_CHANGED);
    assert.strictEqual(diffs[0].oldVal, "0x1111111111111111111111111111111111111111");
    assert.strictEqual(diffs[0].newVal, "0x2222222222222222222222222222222222222222");
    assert.strictEqual(diffs[0].exceeded, true);
    assert.strictEqual(diffs[0].isBooleanTrigger, true);
  });

  test("Integration: evaluates seed.ts mockData snapshot transitions accurately", () => {
    assert.strictEqual(mockData.snapshots.length >= 2, true);

    const s1 = mockData.snapshots[0];
    const s2 = mockData.snapshots[1];

    const prev: SnapshotData = {
      fdv: s1.marketJson.fdv,
      liquidity: s1.marketJson.liquidity,
      phase: s1.chainJson.phase,
      deployerLaunchesCount: s1.launchTotal,
    };

    const current: SnapshotData = {
      fdv: s2.marketJson.fdv,
      liquidity: s2.marketJson.liquidity,
      phase: s2.chainJson.phase,
      deployerLaunchesCount: s2.launchTotal,
    };

    const diffs = compareSnapshots(prev, current);
    assert.strictEqual(diffs.length, 2);
    
    const fdvDiff = diffs.find((d) => d.field === "fdv");
    assert.ok(fdvDiff);
    assert.strictEqual(fdvDiff.oldVal, 500000);
    assert.strictEqual(fdvDiff.newVal, 750000);
    assert.strictEqual(fdvDiff.pctDelta, 50);
    assert.strictEqual(fdvDiff.exceeded, true);

    const liqDiff = diffs.find((d) => d.field === "liquidity");
    assert.ok(liqDiff);
    assert.strictEqual(liqDiff.oldVal, 80000);
    assert.strictEqual(liqDiff.newVal, 120000);
    assert.strictEqual(liqDiff.pctDelta, 50);
    assert.strictEqual(liqDiff.exceeded, true);
  });
});
