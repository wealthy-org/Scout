import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handleSavePublicDossier } from "../route";
import type { Database } from "@/lib/db";

describe("POST /api/p/[slug]/save", () => {
  const dummyDb = {
    select: () => ({
      from: () => ({
        where: () => [],
      }),
    }),
    insert: () => ({
      values: () => Promise.resolve(),
    }),
  } as unknown as Database;

  it("should return 401 when not authenticated", async () => {
    const req = new Request("http://localhost/api/p/test-slug/save", { method: "POST" });
    const res = await handleSavePublicDossier("test-slug", req, undefined, dummyDb, undefined);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
  });

  it("should return 404 when published dossier does not exist", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () => [],
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/p/missing-slug/save", { method: "POST" });
    const res = await handleSavePublicDossier(
      "missing-slug",
      req,
      undefined,
      mockDb,
      "0x1111111111111111111111111111111111111111"
    );
    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
  });

  it("should return 410 when published dossier is revoked", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () => [
            {
              slug: "revoked-slug",
              revokedAt: new Date("2026-09-01T00:00:00Z"),
              payloadJson: {
                contractAddress: "0x1234567890123456789012345678901234567890",
                symbol: "REV",
              },
            },
          ],
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/p/revoked-slug/save", { method: "POST" });
    const res = await handleSavePublicDossier(
      "revoked-slug",
      req,
      undefined,
      mockDb,
      "0x1111111111111111111111111111111111111111"
    );
    assert.strictEqual(res.status, 410);
    const data = await res.json();
    assert.strictEqual(data.ok, false);
    assert.strictEqual(data.revoked, true);
  });

  it("should return 200 already_exists when user already owns dossier for contract", async () => {
    let callCount = 0;
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () => {
            callCount++;
            if (callCount === 1) {
              return [
                {
                  slug: "valid-slug",
                  authorHandle: "alphalead",
                  revokedAt: null,
                  payloadJson: {
                    contractAddress: "0x1234567890123456789012345678901234567890",
                    symbol: "EXIST",
                    name: "Existing Token",
                    thesis: "Original public thesis",
                  },
                },
              ];
            }
            return [
              {
                id: "existing-dossier-id",
                contractAddress: "0x1234567890123456789012345678901234567890",
                thesis: "My user thesis",
              },
            ];
          },
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/p/valid-slug/save", { method: "POST" });
    const res = await handleSavePublicDossier(
      "valid-slug",
      req,
      undefined,
      mockDb,
      "0x1111111111111111111111111111111111111111"
    );
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.already_exists, true);
    assert.strictEqual(data.contract_address, "0x1234567890123456789012345678901234567890");
  });

  it("should insert copy and return 201 when user does not have existing dossier", async () => {
    let callCount = 0;
    let insertedData: Record<string, unknown> | null = null;
    const mockDb = {
      select: () => ({
        from: () => ({
          where: async () => {
            callCount++;
            if (callCount === 1) {
              return [
                {
                  slug: "valid-slug",
                  authorHandle: "scoutmaster",
                  revokedAt: null,
                  payloadJson: {
                    contractAddress: "0x1234567890123456789012345678901234567890",
                    symbol: "NEW",
                    name: "New Token",
                    thesis: "Copied thesis",
                    publishedAt: "2026-09-20T10:00:00Z",
                  },
                },
              ];
            }
            return [];
          },
        }),
      }),
      insert: () => ({
        values: async (vals: Record<string, unknown>) => {
          insertedData = vals;
          return;
        },
      }),
    } as unknown as Database;

    const req = new Request("http://localhost/api/p/valid-slug/save", { method: "POST" });
    const res = await handleSavePublicDossier(
      "valid-slug",
      req,
      undefined,
      mockDb,
      "0x1111111111111111111111111111111111111111"
    );
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.created, true);
    assert.strictEqual(data.contract_address, "0x1234567890123456789012345678901234567890");
    assert.notStrictEqual(insertedData, null);
    assert.strictEqual(insertedData?.["originAuthor"], "scoutmaster");
  });
});
