import { test, describe } from "node:test";
import assert from "node:assert";
import { handleRevokePublish } from "@/app/api/publish/[ca]/route";
import type { Database } from "@/lib/db";
import type { CookieStoreLike } from "@/types/auth";

describe("DELETE /api/publish/:slug (Revoke Link) Endpoint (TICKET-60)", () => {
  const mockWallet = "0x1234567890123456789012345678901234567890";
  const validSlug = "abc123xyz8";

  const mockPublished = {
    slug: validSlug,
    dossierId: "a0000000-0000-0000-0000-000000000001",
    authorHandle: "trader_1",
    payloadJson: {
      authorWallet: mockWallet,
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "ALPHA",
    },
    revokedAt: null,
  };

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

    const req = new Request(`http://localhost:3000/api/publish/${validSlug}`, {
      method: "DELETE",
    });

    const res = await handleRevokePublish(validSlug, req, unauthCookies, null);
    assert.strictEqual(res.status, 401);
  });

  test("returns 404 when published record does not exist", async () => {
    const emptyDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([]),
        }),
      }),
    } as unknown as Database;

    const req = new Request(`http://localhost:3000/api/publish/nonexistent`, {
      method: "DELETE",
    });

    const res = await handleRevokePublish("nonexistent", req, mockCookies, emptyDb, mockWallet);
    assert.strictEqual(res.status, 404);
  });

  test("revokes published link successfully when caller is owner", async () => {
    let updatedRevokedAt: Date | null = null;

    const capturingDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([mockPublished]),
        }),
      }),
      update: () => ({
        set: (data: { revokedAt: Date }) => {
          updatedRevokedAt = data.revokedAt;
          return {
            where: () => Promise.resolve(),
          };
        },
      }),
    } as unknown as Database;

    const req = new Request(`http://localhost:3000/api/publish/${validSlug}`, {
      method: "DELETE",
    });

    const res = await handleRevokePublish(validSlug, req, mockCookies, capturingDb, mockWallet);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.ok(updatedRevokedAt);
  });
});
