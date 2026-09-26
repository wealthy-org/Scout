import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handleGetCensus } from "../route";
import type { Database } from "@/lib/db";

describe("GET /api/census (TICKET-71)", () => {
  it("should return latest census statistics publicly without authentication", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          orderBy: () => ({
            limit: async () => [
              {
                id: "c-1",
                headBlock: 27027500,
                totalLaunches: 1500,
                uniqueDeployers: 900,
                repeatShare: "25.0",
                payloadJson: {
                  total_launches: 1500,
                  unique_deployers: 900,
                  repeat_share: 25.0,
                  head_block: 27027500,
                },
                computedAt: new Date(),
              },
            ],
          }),
        }),
      }),
    } as unknown as Database;

    const res = await handleGetCensus(mockDb);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.stats.total_launches, 1500);
    assert.strictEqual(data.stats.unique_deployers, 900);
  });

  it("should return fallback data when no census records exist", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          orderBy: () => ({
            limit: async () => [],
          }),
        }),
      }),
    } as unknown as Database;

    const res = await handleGetCensus(mockDb);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(data.stats.total_launches > 0);
  });
});
