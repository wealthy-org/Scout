import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handleCronCensus } from "../route";
import type { Database } from "@/lib/db";

describe("POST /api/cron/census (TICKET-72)", () => {
  it("should return 401 when authorization header is missing or invalid", async () => {
    const req = new Request("http://localhost/api/cron/census", {
      method: "POST",
      headers: { Authorization: "Bearer invalid-secret" },
    });
    const res = await handleCronCensus(req, null, "expected-cron-secret");
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
  });

  it("should compute and save census snapshot when valid bearer token is provided", async () => {
    let insertedRecord: Record<string, unknown> | null = null;
    const mockDb = {
      select: () => ({
        from: async () => [
          { deployerAddress: "0x1111", tokenAddress: "0xaa1", block: 27027400, phase: "graduated" },
        ],
      }),
      insert: () => ({
        values: async (vals: Record<string, unknown>) => {
          insertedRecord = vals;
          return;
        },
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/cron/census", {
      method: "POST",
      headers: { Authorization: "Bearer test-secret-key" },
    });
    const res = await handleCronCensus(req, mockDb, "test-secret-key");
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.total_launches, 1);
    assert.notStrictEqual(insertedRecord, null);
  });
});
