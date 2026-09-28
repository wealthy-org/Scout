import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { GET } from "@/app/api/feed/route";

describe("GET /api/feed Route", () => {
  test("returns feed items, stats, trades, and graduations", async () => {
    const res = await GET();
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.ok(Array.isArray(body.items));
    assert.ok(body.items.length > 0);
    assert.strictEqual(typeof body.stats.totalLaunches10m, "number");
    assert.strictEqual(typeof body.stats.totalVolumeUsd, "number");
    assert.ok(Array.isArray(body.trades));
  });
});
