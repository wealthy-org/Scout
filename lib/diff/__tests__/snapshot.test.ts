import { test, describe } from "node:test";
import assert from "node:assert";
import {
  saveSnapshot,
  isSnapshotIdentical,
  type SnapshotDataInput,
  type SnapshotRecordLike,
} from "@/lib/diff/snapshot";

describe("Snapshot System Helper (TICKET-45)", () => {
  const mockPrevSnapshot: SnapshotRecordLike = {
    id: "snap-1",
    dossierId: "dos-1",
    at: new Date("2026-09-20T10:00:00Z"),
    chainJson: { phase: "curve", feeRecipient: "0x111" },
    marketJson: { fdv: 100000, liquidity: 20000 },
    reposJson: { commitSha: "abc" },
    launchesJson: { score: 50 },
    launchTotal: 2,
    curveJson: { progress: 45 },
  };

  test("isSnapshotIdentical returns true when all core metrics are identical", () => {
    const newData: SnapshotDataInput = {
      chainJson: { phase: "curve", feeRecipient: "0x111" },
      marketJson: { fdv: 100000, liquidity: 20000 },
      reposJson: { commitSha: "abc" },
      launchesJson: { score: 50 },
      launchTotal: 2,
      curveJson: { progress: 45 },
    };

    assert.strictEqual(isSnapshotIdentical(mockPrevSnapshot, newData), true);
  });

  test("isSnapshotIdentical returns false when any metric changes", () => {
    const changedData: SnapshotDataInput = {
      chainJson: { phase: "curve", feeRecipient: "0x111" },
      marketJson: { fdv: 120000, liquidity: 20000 },
      reposJson: { commitSha: "abc" },
      launchesJson: { score: 50 },
      launchTotal: 2,
      curveJson: { progress: 45 },
    };

    assert.strictEqual(isSnapshotIdentical(mockPrevSnapshot, changedData), false);
  });

  test("saveSnapshot skips insertion when new snapshot is identical to previous", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: async () => [mockPrevSnapshot],
            }),
          }),
        }),
      }),
    };

    const result = await saveSnapshot(
      "dos-1",
      {
        chainJson: { phase: "curve", feeRecipient: "0x111" },
        marketJson: { fdv: 100000, liquidity: 20000 },
        reposJson: { commitSha: "abc" },
        launchesJson: { score: 50 },
        launchTotal: 2,
        curveJson: { progress: 45 },
      },
      { dbInstance: mockDb }
    );

    assert.strictEqual(result.saved, false);
    assert.strictEqual(result.reason, "identical");
  });

  test("saveSnapshot inserts new record and enforces 30 snapshot retention limit", async () => {
    let inserted = false;
    let pruned = false;

    const mockDb = {
      select: () => ({
        from: () => ({
          where: () => {
            const snaps = new Array(35).fill(mockPrevSnapshot);
            const queryObj = Promise.resolve(snaps) as unknown as Promise<typeof mockPrevSnapshot[]> & {
              limit: (n: number) => Promise<typeof mockPrevSnapshot[]>;
            };
            queryObj.limit = async () => [mockPrevSnapshot];
            return {
              orderBy: () => queryObj,
            };
          },
        }),
      }),
      insert: () => ({
        values: (val: unknown) => ({
          returning: async () => {
            inserted = true;
            return [{ id: "snap-new", ...((val as object) || {}) }];
          },
        }),
      }),
      delete: () => ({
        where: async () => {
          pruned = true;
          return [];
        },
      }),
    };

    const result = await saveSnapshot(
      "dos-1",
      {
        marketJson: { fdv: 150000, liquidity: 30000 },
      },
      { dbInstance: mockDb, maxSnapshots: 30 }
    );

    assert.strictEqual(result.saved, true);
    assert.strictEqual(inserted, true);
    assert.strictEqual(pruned, true);
    assert.ok(result.snapshot);
  });
});
