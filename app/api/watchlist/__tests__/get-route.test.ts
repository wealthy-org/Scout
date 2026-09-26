process.env.SESSION_SECRET =
  process.env.SESSION_SECRET || "01234567890123456789012345678901";

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handleGetWatchlist } from "../route";
import type { Database } from "@/lib/db";

describe("GET /api/watchlist (TICKET-66)", () => {
  const dummyDb = {
    select: () => ({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: () => [],
          }),
        }),
      }),
    }),
  } as unknown as Database;

  it("should return 401 when user is not authenticated", async () => {
    const req = new Request("http://localhost/api/watchlist");
    const res = await handleGetWatchlist(req, undefined, dummyDb, undefined);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
  });

  it("should return list of watchlist entries with scores sorted by last_seen_at descending", async () => {
    const mockWatchlist = [
      {
        id: "w1",
        deployerAddress: "0x1111111111111111111111111111111111111111",
        createdAt: new Date("2026-09-01T00:00:00Z"),
        lastSeenAt: new Date("2026-09-20T00:00:00Z"),
        scoreValue: 85,
        label: "repeat",
        band: "green",
        totalLaunches: 4,
        graduatedCount: 3,
      },
      {
        id: "w2",
        deployerAddress: "0x2222222222222222222222222222222222222222",
        createdAt: new Date("2026-08-01T00:00:00Z"),
        lastSeenAt: new Date("2026-09-10T00:00:00Z"),
        scoreValue: 15,
        label: "serial",
        band: "red",
        totalLaunches: 12,
        graduatedCount: 0,
      },
    ];

    const mockDb = {
      select: () => ({
        from: () => ({
          leftJoin: () => ({
            where: () => ({
              orderBy: async () => mockWatchlist,
            }),
          }),
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/watchlist");
    const res = await handleGetWatchlist(
      req,
      undefined,
      mockDb,
      "0x9999999999999999999999999999999999999999"
    );

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(Array.isArray(data.watchlist), true);
    assert.strictEqual(data.watchlist.length, 2);
    assert.strictEqual(data.watchlist[0].deployerAddress, "0x1111111111111111111111111111111111111111");
  });
});
