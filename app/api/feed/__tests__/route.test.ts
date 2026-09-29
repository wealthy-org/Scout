import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { GET } from "@/app/api/feed/route";
import { db } from "@/lib/db";

describe("GET /api/feed Route Data Integrity (TICKET-141)", () => {
  test("route file does not contain fallbackItems, formula progress/mcap, or fake trade addresses", () => {
    const filePath = path.join(process.cwd(), "app/api/feed/route.ts");
    const content = fs.readFileSync(filePath, "utf-8");
    assert.strictEqual(content.includes("fallbackItems"), false);
    assert.strictEqual(content.includes("20 + ((idx * 17) % 75)"), false);
    assert.strictEqual(content.includes("280000 + ((idx * 12000)"), false);
    assert.strictEqual(content.includes("padStart(40, \"a\")"), false);
  });

  test("returns empty items and trades when no launches exist in database", async () => {
    const originalSelect = db?.select;
    if (db) {
      db.select = (() => ({
        from: () => ({
          orderBy: () => ({
            limit: async () => [],
          }),
          where: async () => [],
        }),
      })) as unknown as typeof db.select;
    }

    try {
      const res = await GET();
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.ok, true);
      assert.deepStrictEqual(body.items, []);
      assert.deepStrictEqual(body.trades, []);
      assert.deepStrictEqual(body.graduations, []);
      assert.strictEqual(body.stats.totalLaunches10m, 0);
      assert.strictEqual(body.stats.totalVolumeUsd, 0);
      assert.strictEqual(body.stats.uniqueWallets, 0);
      assert.strictEqual(body.stats.graduatedCount, 0);
      assert.strictEqual(body.stats.repeatDeployerPct, 0);
    } finally {
      if (db && originalSelect) {
        db.select = originalSelect;
      }
    }
  });

  test("maps real launch rows with null progress for curve and 100 for graduated without formula data", async () => {
    const originalSelect = db?.select;
    if (db) {
      db.select = (() => ({
        from: () => ({
          orderBy: () => ({
            limit: async () => [
              {
                deployerAddress: "0x1111111111111111111111111111111111111111",
                tokenAddress: "0x2222222222222222222222222222222222222222",
                block: 28000000,
                phase: "curve",
              },
              {
                deployerAddress: "0x3333333333333333333333333333333333333333",
                tokenAddress: "0x4444444444444444444444444444444444444444",
                block: 28000010,
                phase: "graduated",
              },
            ],
          }),
          where: async () => [],
        }),
      })) as unknown as typeof db.select;
    }

    try {
      const res = await GET();
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.items.length, 2);
      assert.strictEqual(body.trades.length, 0);

      const curveItem = body.items.find(
        (i: { contractAddress: string; progressPct: number | null; phase: string }) =>
          i.contractAddress === "0x2222222222222222222222222222222222222222"
      );
      assert.ok(curveItem);
      assert.strictEqual(curveItem.progressPct, null);
      assert.strictEqual(curveItem.phase, "curve");

      const gradItem = body.items.find(
        (i: { contractAddress: string; progressPct: number | null; phase: string }) =>
          i.contractAddress === "0x4444444444444444444444444444444444444444"
      );
      assert.ok(gradItem);
      assert.strictEqual(gradItem.progressPct, 100);
      assert.strictEqual(gradItem.phase, "graduated");

      assert.strictEqual(body.graduations.length, 1);
      assert.strictEqual(
        body.graduations[0].contractAddress,
        "0x4444444444444444444444444444444444444444"
      );
    } finally {
      if (db && originalSelect) {
        db.select = originalSelect;
      }
    }
  });
});
