import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { compareSnapshots } from "@/lib/diff/compare";
import {
  DIFF_FDV_PCT,
  DIFF_LIQUIDITY_PCT,
  DIFF_SCORE_POINTS,
  DIFF_MARKET_APPEARED,
  DIFF_CURVE_GRADUATED,
  DIFF_FEE_RECIPIENT_CHANGED,
  DIFF_NEW_REPO_COMMIT,
  DIFF_NEW_DEPLOYER_LAUNCH,
} from "@/config/diff";
import type { SnapshotData } from "@/types/diff";

describe("Snapshot Comparison Engine (TICKET-19)", () => {
  const rootDir = process.cwd();
  const comparePath = path.join(rootDir, "lib", "diff", "compare.ts");

  test("lib/diff/compare.ts file must exist", () => {
    assert.strictEqual(fs.existsSync(comparePath), true, "lib/diff/compare.ts must exist");
  });

  test("exports compareSnapshots function", () => {
    assert.strictEqual(typeof compareSnapshots, "function");
  });

  test("returns an empty array when snapshots are identical", () => {
    const prev: SnapshotData = {
      fdv: 1000000,
      liquidity: 200000,
      deployer_score: 50,
      hasPool: true,
      phase: "curve",
      feeRecipient: "0x1111111111111111111111111111111111111111",
      repoCommitSha: "abc1234",
      deployerLaunchesCount: 5,
    };
    const current: SnapshotData = { ...prev };

    const diffs = compareSnapshots(prev, current);
    assert.deepStrictEqual(diffs, []);
  });

  test("returns an empty array when both snapshots are null or undefined or empty", () => {
    assert.deepStrictEqual(compareSnapshots(null, null), []);
    assert.deepStrictEqual(compareSnapshots(undefined, undefined), []);
    assert.deepStrictEqual(compareSnapshots({}, {}), []);
  });

  describe("FDV threshold evaluation", () => {
    test("does not trigger when FDV delta is below DIFF_FDV_PCT (e.g. +5%)", () => {
      const prev: SnapshotData = { fdv: 100000 };
      const current: SnapshotData = { fdv: 105000 };

      const diffs = compareSnapshots(prev, current);
      assert.deepStrictEqual(diffs, []);
    });

    test("triggers when positive FDV delta reaches or exceeds DIFF_FDV_PCT (e.g. +10%)", () => {
      const prev: SnapshotData = { fdv: 100000 };
      const current: SnapshotData = { fdv: 110000 };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, "fdv");
      assert.strictEqual(item.oldVal, 100000);
      assert.strictEqual(item.newVal, 110000);
      assert.strictEqual(item.delta, 10000);
      assert.strictEqual(item.pctDelta, DIFF_FDV_PCT);
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, false);
    });

    test("triggers when negative FDV delta reaches or exceeds DIFF_FDV_PCT (e.g. -15%)", () => {
      const prev: SnapshotData = { fdv: 100000 };
      const current: SnapshotData = { fdv: 85000 };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, "fdv");
      assert.strictEqual(item.oldVal, 100000);
      assert.strictEqual(item.newVal, 85000);
      assert.strictEqual(item.delta, -15000);
      assert.strictEqual(item.pctDelta, -15);
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, false);
    });
  });

  describe("Liquidity threshold evaluation", () => {
    test("does not trigger when Liquidity delta is below DIFF_LIQUIDITY_PCT (e.g. +10%)", () => {
      const prev: SnapshotData = { liquidity: 50000 };
      const current: SnapshotData = { liquidity: 55000 };

      const diffs = compareSnapshots(prev, current);
      assert.deepStrictEqual(diffs, []);
    });

    test("triggers when positive Liquidity delta reaches or exceeds DIFF_LIQUIDITY_PCT (e.g. +15% and +20%)", () => {
      const prev: SnapshotData = { liquidity: 50000 };
      const currentExact: SnapshotData = {
        liquidity: 57500,
      };

      const diffsExact = compareSnapshots(prev, currentExact);
      assert.strictEqual(diffsExact.length, 1);
      const itemExact = diffsExact[0];
      assert.ok(itemExact);
      assert.strictEqual(itemExact.pctDelta, DIFF_LIQUIDITY_PCT);

      const current: SnapshotData = { liquidity: 60000 };
      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, "liquidity");
      assert.strictEqual(item.oldVal, 50000);
      assert.strictEqual(item.newVal, 60000);
      assert.strictEqual(item.delta, 10000);
      assert.strictEqual(item.pctDelta, 20);
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, false);
    });

    test("triggers when negative Liquidity delta reaches or exceeds DIFF_LIQUIDITY_PCT (e.g. -20%)", () => {
      const prev: SnapshotData = { liquidity: 50000 };
      const current: SnapshotData = { liquidity: 40000 };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, "liquidity");
      assert.strictEqual(item.oldVal, 50000);
      assert.strictEqual(item.newVal, 40000);
      assert.strictEqual(item.delta, -10000);
      assert.strictEqual(item.pctDelta, -20);
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, false);
    });
  });

  describe("Deployer Score threshold evaluation", () => {
    test("does not trigger when Deployer Score delta is below DIFF_SCORE_POINTS (e.g. +5 pts)", () => {
      const prev: SnapshotData = { deployer_score: 50 };
      const current: SnapshotData = { deployer_score: 55 };

      const diffs = compareSnapshots(prev, current);
      assert.deepStrictEqual(diffs, []);
    });

    test("triggers when Deployer Score delta reaches or exceeds DIFF_SCORE_POINTS (e.g. +8 pts)", () => {
      const prev: SnapshotData = { deployer_score: 50 };
      const current: SnapshotData = { deployer_score: 58 };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, "deployer_score");
      assert.strictEqual(item.oldVal, 50);
      assert.strictEqual(item.newVal, 58);
      assert.strictEqual(item.delta, DIFF_SCORE_POINTS);
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, false);
    });
  });

  describe("Boolean trigger evaluation", () => {
    test("triggers when market appears (hasPool: false -> true)", () => {
      const prev: SnapshotData = { hasPool: false };
      const current: SnapshotData = { hasPool: true };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, DIFF_MARKET_APPEARED);
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, true);
    });

    test("triggers when market appears via direct boolean flag", () => {
      const prev: SnapshotData = { market_appeared: false };
      const current: SnapshotData = { market_appeared: true };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, DIFF_MARKET_APPEARED);
    });

    test("triggers when curve graduates (phase: curve -> graduated)", () => {
      const prev: SnapshotData = { phase: "curve" };
      const current: SnapshotData = { phase: "graduated" };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, DIFF_CURVE_GRADUATED);
      assert.strictEqual(item.oldVal, "curve");
      assert.strictEqual(item.newVal, "graduated");
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, true);
    });

    test("triggers when curve graduates (phase: curve -> swept)", () => {
      const prev: SnapshotData = { phase: "curve" };
      const current: SnapshotData = { phase: "swept" };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, DIFF_CURVE_GRADUATED);
    });

    test("triggers when fee recipient address changes", () => {
      const prev: SnapshotData = {
        feeRecipient: "0x1111111111111111111111111111111111111111",
      };
      const current: SnapshotData = {
        feeRecipient: "0x2222222222222222222222222222222222222222",
      };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, DIFF_FEE_RECIPIENT_CHANGED);
      assert.strictEqual(item.oldVal, "0x1111111111111111111111111111111111111111");
      assert.strictEqual(item.newVal, "0x2222222222222222222222222222222222222222");
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, true);
    });

    test("triggers when new repo commit sha is detected", () => {
      const prev: SnapshotData = { repoCommitSha: "commit-1" };
      const current: SnapshotData = { repoCommitSha: "commit-2" };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, DIFF_NEW_REPO_COMMIT);
      assert.strictEqual(item.oldVal, "commit-1");
      assert.strictEqual(item.newVal, "commit-2");
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, true);
    });

    test("triggers when new deployer launch occurs", () => {
      const prev: SnapshotData = { deployerLaunchesCount: 3 };
      const current: SnapshotData = { deployerLaunchesCount: 4 };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 1);
      const item = diffs[0];
      assert.ok(item);
      assert.strictEqual(item.field, DIFF_NEW_DEPLOYER_LAUNCH);
      assert.strictEqual(item.oldVal, 3);
      assert.strictEqual(item.newVal, 4);
      assert.strictEqual(item.delta, 1);
      assert.strictEqual(item.exceeded, true);
      assert.strictEqual(item.isBooleanTrigger, true);
    });
  });

  describe("Multiple simultaneous exceeded triggers", () => {
    test("returns all triggered items in deterministic order", () => {
      const prev: SnapshotData = {
        fdv: 100000,
        liquidity: 50000,
        deployer_score: 50,
        hasPool: false,
        phase: "curve",
        feeRecipient: "0x1111111111111111111111111111111111111111",
        repoCommitSha: "v1.0.0",
        deployerLaunchesCount: 1,
      };

      const current: SnapshotData = {
        fdv: 130000,
        liquidity: 70000,
        deployer_score: 65,
        hasPool: true,
        phase: "graduated",
        feeRecipient: "0x2222222222222222222222222222222222222222",
        repoCommitSha: "v1.1.0",
        deployerLaunchesCount: 2,
      };

      const diffs = compareSnapshots(prev, current);
      assert.strictEqual(diffs.length, 8);
      const fields = diffs.map((d) => d.field);
      assert.deepStrictEqual(fields, [
        "fdv",
        "liquidity",
        "deployer_score",
        DIFF_MARKET_APPEARED,
        DIFF_CURVE_GRADUATED,
        DIFF_FEE_RECIPIENT_CHANGED,
        DIFF_NEW_REPO_COMMIT,
        DIFF_NEW_DEPLOYER_LAUNCH,
      ]);
    });
  });
});
