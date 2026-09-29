import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { computeCensusStats } from "@/lib/census/compute";
import type { Database } from "@/lib/db";

describe("Census Calculation & launches_by_block (TICKET-143)", () => {
  it("computes launches_by_block dynamically across multiple 100k block buckets", async () => {
    const mockLaunches = [
      { deployerAddress: "0x1111", tokenAddress: "0xaa1", block: 27027400, phase: "graduated" },
      { deployerAddress: "0x1111", tokenAddress: "0xaa2", block: 27080000, phase: "curve" },
      { deployerAddress: "0x2222", tokenAddress: "0xbb1", block: 27150000, phase: "curve" },
      { deployerAddress: "0x3333", tokenAddress: "0xcc1", block: 27250000, phase: "graduated" },
      { deployerAddress: "0x4444", tokenAddress: "0xdd1", block: 27280000, phase: "curve" },
      { deployerAddress: "0x5555", tokenAddress: "0xee1", block: null, phase: "curve" },
    ];

    const mockDb = {
      select: () => ({
        from: async () => mockLaunches,
      }),
    } as unknown as Database;

    const stats = await computeCensusStats(mockDb, [], 27300000);

    assert.strictEqual(stats.total_launches, 6);
    assert.strictEqual(stats.launches_by_block.length, 3);
    assert.deepStrictEqual(stats.launches_by_block, [
      { blockRange: "27.0M - 27.1M", count: 2 },
      { blockRange: "27.1M - 27.2M", count: 1 },
      { blockRange: "27.2M - 27.3M", count: 2 },
    ]);
  });

  it("returns empty launches_by_block when database contains 0 launches", async () => {
    const mockDb = {
      select: () => ({
        from: async () => [],
      }),
    } as unknown as Database;

    const stats = await computeCensusStats(mockDb, [], 27300000);
    assert.strictEqual(stats.total_launches, 0);
    assert.deepStrictEqual(stats.launches_by_block, []);
  });

  it("ensures source file does not permanently assign defaultPayload.launches_by_block", () => {
    const filePath = path.join(process.cwd(), "lib/census/compute.ts");
    const content = fs.readFileSync(filePath, "utf-8");
    assert.strictEqual(content.includes("launches_by_block: defaultPayload.launches_by_block"), false);
  });
});
