import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { GET } from "@/app/api/block/route";
import { publicClient } from "@/lib/chain/client";

describe("GET /api/block Route (TICKET-144)", () => {
  test("route file does not contain hardcoded fallback block number 21845120", () => {
    const filePath = path.join(process.cwd(), "app/api/block/route.ts");
    const content = fs.readFileSync(filePath, "utf-8");
    assert.strictEqual(content.includes("21845120"), false);
  });

  test("returns block number and ok: true with status 200 when RPC succeeds", async () => {
    const originalGetBlockNumber = publicClient.getBlockNumber;
    try {
      publicClient.getBlockNumber = (async () => BigInt(28123456)) as unknown as typeof publicClient.getBlockNumber;
      const res = await GET();
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.ok, true);
      assert.strictEqual(body.blockNumber, 28123456);
      assert.strictEqual(body.source, "rpc");
      assert.strictEqual(typeof body.timestamp, "number");
    } finally {
      publicClient.getBlockNumber = originalGetBlockNumber;
    }
  });

  test("returns status 503 and ok: false with error message when RPC fails", async () => {
    const originalGetBlockNumber = publicClient.getBlockNumber;
    try {
      publicClient.getBlockNumber = async () => {
        throw new Error("RPC network connection timeout");
      };
      const res = await GET();
      assert.strictEqual(res.status, 503);
      const body = await res.json();
      assert.strictEqual(body.ok, false);
      assert.strictEqual(body.error, "RPC unavailable");
      assert.strictEqual(body.blockNumber, undefined);
    } finally {
      publicClient.getBlockNumber = originalGetBlockNumber;
    }
  });
});
