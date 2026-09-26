process.env.SESSION_SECRET =
  process.env.SESSION_SECRET || "01234567890123456789012345678901";

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handlePostWatchlist } from "../route";
import type { Database } from "@/lib/db";

describe("POST /api/watchlist (TICKET-67)", () => {
  const dummyDb = {} as unknown as Database;

  it("should return 401 when not authenticated", async () => {
    const req = new Request("http://localhost/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deployer_address: "0x1111111111111111111111111111111111111111" }),
    });
    const res = await handlePostWatchlist(req, undefined, dummyDb, undefined);
    assert.strictEqual(res.status, 401);
  });

  it("should return 400 when deployer_address format is invalid", async () => {
    const req = new Request("http://localhost/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deployer_address: "0xinvalid" }),
    });
    const res = await handlePostWatchlist(
      req,
      undefined,
      dummyDb,
      "0x9999999999999999999999999999999999999999"
    );
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
  });

  it("should return 422 when watchlist quota exceeds 30 entries", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () =>
            Array.from({ length: 30 }, (_, i) => ({
              id: `w-${i}`,
              deployerAddress: `0x${i.toString().padStart(40, "0")}`,
            })),
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deployer_address: "0x1111111111111111111111111111111111111111" }),
    });
    const res = await handlePostWatchlist(
      req,
      undefined,
      mockDb,
      "0x9999999999999999999999999999999999999999"
    );
    assert.strictEqual(res.status, 422);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
    assert.ok(data.error?.includes("quota"));
  });

  it("should insert into watchlist and return 201 on success", async () => {
    let inserted: Record<string, unknown> | null = null;
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () => [],
        }),
      }),
      insert: () => ({
        values: async (vals: Record<string, unknown>) => {
          inserted = vals;
          return;
        },
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deployer_address: "0x1111111111111111111111111111111111111111" }),
    });
    const res = await handlePostWatchlist(
      req,
      undefined,
      mockDb,
      "0x9999999999999999999999999999999999999999"
    );
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.created, true);
    assert.strictEqual(data.deployer_address, "0x1111111111111111111111111111111111111111");
    assert.notStrictEqual(inserted, null);
  });
});
