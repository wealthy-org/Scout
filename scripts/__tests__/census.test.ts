import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeCensusStats } from "@/lib/census/compute";
import type { Database } from "@/lib/db";

describe("Census Aggregation & Runner (TICKET-70)", () => {
  it("should compute accurate census metrics from mock database rows", async () => {
    const mockLaunches = [
      { deployerAddress: "0x1111", tokenAddress: "0xaa1", block: 27027400, phase: "graduated" },
      { deployerAddress: "0x1111", tokenAddress: "0xaa2", block: 27027500, phase: "curve" },
      { deployerAddress: "0x2222", tokenAddress: "0xbb1", block: 27027600, phase: "curve" },
      { deployerAddress: "0x3333", tokenAddress: "0xcc1", block: 27027700, phase: "graduated" },
    ];

    const mockScores = [
      {
        deployerAddress: "0x1111",
        totalLaunches: 2,
        graduatedCount: 1,
        score: 75,
        label: "repeat" as const,
        band: "yellow" as const,
      },
      {
        deployerAddress: "0x2222",
        totalLaunches: 1,
        graduatedCount: 0,
        score: 60,
        label: "fresh" as const,
        band: "yellow" as const,
      },
      {
        deployerAddress: "0x3333",
        totalLaunches: 1,
        graduatedCount: 1,
        score: 90,
        label: "fresh" as const,
        band: "green" as const,
      },
    ];

    const mockDb = {
      select: () => ({
        from: async () => mockLaunches,
      }),
    } as unknown as Database;

    const stats = await computeCensusStats(mockDb, mockScores, 27028000);

    assert.strictEqual(stats.total_launches, 4);
    assert.strictEqual(stats.unique_deployers, 3);
    assert.strictEqual(stats.head_block, 27028000);
    assert.strictEqual(typeof stats.repeat_share, "number");
    assert.strictEqual(Array.isArray(stats.repeat_launchers), true);
  });
});
