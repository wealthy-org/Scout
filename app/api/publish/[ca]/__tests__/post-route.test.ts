import { test, describe } from "node:test";
import assert from "node:assert";
import { handlePublishDossier } from "@/app/api/publish/[ca]/route";
import type { Database } from "@/lib/db";
import type { CookieStoreLike } from "@/types/auth";

describe("POST /api/publish/:ca Endpoint (TICKET-59)", () => {
  const mockWallet = "0x1234567890123456789012345678901234567890";
  const validCA = "0x1111111111111111111111111111111111111111";

  const mockDossier = {
    id: "a0000000-0000-0000-0000-000000000001",
    walletAddress: mockWallet,
    chainId: 8453,
    contractAddress: validCA,
    symbol: "ALPHA",
    name: "Alpha Protocol",
    status: "In position",
    reason: "Private reason",
    decisionReason: "Private decision reason",
    thesis: "Public thesis content",
    notes: "Super secret notes",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDb = {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([mockDossier]),
      }),
    }),
    insert: () => ({
      values: () => Promise.resolve(),
    }),
  } as unknown as Database;

  const mockCookies: CookieStoreLike = {
    get: (name: string) => {
      if (name === "scout_session") {
        return { name, value: "valid_token" };
      }
      return undefined;
    },
    set: () => {},
    delete: () => {},
  };

  test("rejects unauthenticated requests with 401", async () => {
    const unauthCookies: CookieStoreLike = {
      get: () => undefined,
      set: () => {},
      delete: () => {},
    };

    const req = new Request(`http://localhost:3000/api/publish/${validCA}`, {
      method: "POST",
      body: JSON.stringify({ handle: "alpha_trader" }),
    });

    const res = await handlePublishDossier(validCA, req, unauthCookies, mockDb);
    assert.strictEqual(res.status, 401);
  });

  test("rejects invalid contract address with 400", async () => {
    const req = new Request("http://localhost:3000/api/publish/invalid", {
      method: "POST",
      body: JSON.stringify({ handle: "trader_1" }),
    });

    const res = await handlePublishDossier("invalid", req, mockCookies, mockDb, mockWallet);
    assert.strictEqual(res.status, 400);
  });

  test("rejects invalid handle format with 400", async () => {
    const req = new Request(`http://localhost:3000/api/publish/${validCA}`, {
      method: "POST",
      body: JSON.stringify({ handle: "invalid-handle-with-dashes!" }),
    });

    const res = await handlePublishDossier(validCA, req, mockCookies, mockDb, mockWallet);
    assert.strictEqual(res.status, 400);
  });

  test("publishes dossier snapshot without private notes by default", async () => {
    let insertedPayload: Record<string, unknown> | null = null;
    let insertedSlug: string | null = null;

    const capturingDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([mockDossier]),
        }),
      }),
      insert: () => ({
        values: (data: { slug: string; payloadJson: Record<string, unknown> }) => {
          insertedSlug = data.slug;
          insertedPayload = data.payloadJson;
          return Promise.resolve();
        },
      }),
    } as unknown as Database;

    const req = new Request(`http://localhost:3000/api/publish/${validCA}`, {
      method: "POST",
      body: JSON.stringify({ handle: "trader_99", include_notes: false }),
    });

    const res = await handlePublishDossier(validCA, req, mockCookies, capturingDb, mockWallet);
    assert.strictEqual(res.status, 201);

    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.ok(body.slug);
    assert.strictEqual(body.url, `/p/${body.slug}`);
    assert.ok(insertedSlug);

    // Verify private fields are excluded
    const payload = insertedPayload as Record<string, unknown> | null;
    assert.strictEqual(payload?.["thesis"], "Public thesis content");
    assert.strictEqual(payload?.["notes"], undefined);
    assert.strictEqual(payload?.["status"], undefined);
    assert.strictEqual(payload?.["reason"], undefined);
    assert.strictEqual(payload?.["decisionReason"], undefined);
  });

  test("includes notes in published payload when include_notes is true", async () => {
    let insertedPayload: Record<string, unknown> | null = null;

    const capturingDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([mockDossier]),
        }),
      }),
      insert: () => ({
        values: (data: { slug: string; payloadJson: Record<string, unknown> }) => {
          insertedPayload = data.payloadJson;
          return Promise.resolve();
        },
      }),
    } as unknown as Database;

    const req = new Request(`http://localhost:3000/api/publish/${validCA}`, {
      method: "POST",
      body: JSON.stringify({ handle: "trader_99", include_notes: true }),
    });

    const res = await handlePublishDossier(validCA, req, mockCookies, capturingDb, mockWallet);
    assert.strictEqual(res.status, 201);

    const payload = insertedPayload as Record<string, unknown> | null;
    assert.strictEqual(payload?.["notes"], "Super secret notes");
  });
});
