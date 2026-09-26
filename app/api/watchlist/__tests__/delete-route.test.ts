import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handleDeleteWatchlist } from "../[address]/route";
import type { Database } from "@/lib/db";

describe("DELETE /api/watchlist/[address] (TICKET-68)", () => {
  const dummyDb = {} as unknown as Database;

  it("should return 401 when not authenticated", async () => {
    const req = new Request("http://localhost/api/watchlist/0x1111111111111111111111111111111111111111", {
      method: "DELETE",
    });
    const res = await handleDeleteWatchlist(
      "0x1111111111111111111111111111111111111111",
      req,
      undefined,
      dummyDb,
      undefined
    );
    assert.strictEqual(res.status, 401);
  });

  it("should return 400 when address format is invalid", async () => {
    const req = new Request("http://localhost/api/watchlist/0xinvalid", {
      method: "DELETE",
    });
    const res = await handleDeleteWatchlist(
      "0xinvalid",
      req,
      undefined,
      dummyDb,
      "0x9999999999999999999999999999999999999999"
    );
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
  });

  it("should return 404 when deployer address is not in user watchlist", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () => [],
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/watchlist/0x1111111111111111111111111111111111111111", {
      method: "DELETE",
    });
    const res = await handleDeleteWatchlist(
      "0x1111111111111111111111111111111111111111",
      req,
      undefined,
      mockDb,
      "0x9999999999999999999999999999999999999999"
    );
    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
  });

  it("should delete entry and return 200 on success", async () => {
    let deleted = false;
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () => [{ id: "w-1" }],
        }),
      }),
      delete: () => ({
        where: async () => {
          deleted = true;
        },
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/watchlist/0x1111111111111111111111111111111111111111", {
      method: "DELETE",
    });
    const res = await handleDeleteWatchlist(
      "0x1111111111111111111111111111111111111111",
      req,
      undefined,
      mockDb,
      "0x9999999999999999999999999999999999999999"
    );
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(deleted, true);
  });
});
