import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { GET } from "@/app/api/block/route";

describe("GET /api/block Route", () => {
  test("returns block number and ok status", async () => {
    const res = await GET();
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(typeof body.blockNumber, "number");
    assert.ok(body.blockNumber > 0);
  });
});
