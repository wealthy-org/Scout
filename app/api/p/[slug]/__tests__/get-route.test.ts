import { test, describe } from "node:test";
import assert from "node:assert";
import { handleGetPublicDossier } from "@/app/api/p/[slug]/route";
import type { Database } from "@/lib/db";

describe("GET /api/p/:slug Endpoint (TICKET-61)", () => {
  const validSlug = "alpha99pub";
  const revokedSlug = "revoked123";

  const mockActiveRecord = {
    slug: validSlug,
    dossierId: "a0000000-0000-0000-0000-000000000001",
    authorHandle: "trader_alpha",
    payloadJson: {
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "ALPHA",
      thesis: "Bullish thesis on AI protocol",
    },
    revokedAt: null,
  };

  const mockRevokedRecord = {
    slug: revokedSlug,
    dossierId: "a0000000-0000-0000-0000-000000000002",
    authorHandle: "trader_beta",
    payloadJson: {
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "BETA",
    },
    revokedAt: new Date(),
  };

  test("returns 404 when slug does not exist", async () => {
    const emptyDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([]),
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost:3000/api/p/nonexistent");
    const res = await handleGetPublicDossier("nonexistent", req, emptyDb);
    assert.strictEqual(res.status, 404);

    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 410 Gone when published dossier has been revoked", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([mockRevokedRecord]),
        }),
      }),
    } as unknown as Database;

    const req = new Request(`http://localhost:3000/api/p/${revokedSlug}`);
    const res = await handleGetPublicDossier(revokedSlug, req, mockDb);
    assert.strictEqual(res.status, 410);

    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.strictEqual(body.revoked, true);
  });

  test("returns payload_json data publicly when dossier is active", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([mockActiveRecord]),
        }),
      }),
    } as unknown as Database;

    const req = new Request(`http://localhost:3000/api/p/${validSlug}`);
    const res = await handleGetPublicDossier(validSlug, req, mockDb);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.slug, validSlug);
    assert.strictEqual(body.authorHandle, "trader_alpha");
    assert.strictEqual(body.payload.symbol, "ALPHA");
  });
});
