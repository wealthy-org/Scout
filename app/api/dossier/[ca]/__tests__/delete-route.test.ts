import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { DELETE, handleDeleteDossier } from "@/app/api/dossier/[ca]/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import type { Dossier } from "@/lib/db/schema";

describe("DELETE /api/dossier/:ca Endpoint (TICKET-23)", () => {
  const rootDir = process.cwd();
  const routePath = path.join(
    rootDir,
    "app",
    "api",
    "dossier",
    "[ca]",
    "route.ts"
  );

  function createMockStore(): CookieStoreLike {
    const storeMap = new Map<string, string>();
    return {
      get(name: string) {
        const val = storeMap.get(name);
        return val ? { name, value: val } : undefined;
      },
      set(name: string, value: string) {
        storeMap.set(name, value);
      },
      delete(name: string) {
        storeMap.delete(name);
      },
    };
  }

  function createMockDb(mockDossier: Dossier | null = null): {
    db: Database;
    deletedIds: string[];
  } {
    const deletedIds: string[] = [];

    const mockDb = {
      query: {
        dossiers: {
          findFirst: async () => mockDossier,
        },
      },
      select: () => ({
        from: () => ({
          where: async () => (mockDossier ? [mockDossier] : []),
        }),
      }),
      delete: () => ({
        where: async () => {
          if (mockDossier) {
            deletedIds.push(mockDossier.id);
          }
        },
      }),
    } as unknown as Database;

    return { db: mockDb, deletedIds };
  }

  test("app/api/dossier/[ca]/route.ts file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports DELETE route handler and handleDeleteDossier function", () => {
    assert.strictEqual(typeof DELETE, "function", "DELETE handler must be exported");
    assert.strictEqual(
      typeof handleDeleteDossier,
      "function",
      "handleDeleteDossier must be exported"
    );
  });

  test("returns 400 Bad Request when contract address format is invalid", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/dossier/invalid-ca-format", {
      method: "DELETE",
    });

    const res = await handleDeleteDossier("invalid-ca-format", req, mockStore);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.includes("Invalid contract address"));
  });

  test("returns 401 Unauthorized when user has no active wallet session", async () => {
    const mockStore = createMockStore();
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "DELETE",
    });

    const res = await handleDeleteDossier(validCa, req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.toLowerCase().includes("unauthorized"));
  });

  test("returns 404 Not Found when dossier record is not found for user", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const { db: mockDb } = createMockDb(null);

    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "DELETE",
    });

    const res = await handleDeleteDossier(
      validCa,
      req,
      mockStore,
      mockDb,
      userWallet
    );
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.strictEqual(body.error, "Dossier not found");
  });

  test("returns 200 OK and deletes dossier when record exists", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const mockDossier: Dossier = {
      id: "dossier-uuid-123",
      walletAddress: userWallet.toLowerCase(),
      chainId: 4663,
      contractAddress: validCa.toLowerCase(),
      symbol: "TEST",
      name: "Test Token",
      status: "Watching",
      reason: null,
      thesis: null,
      notes: null,
      decisionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      originAuthor: null,
      originAt: null,
    };
    const { db: mockDb, deletedIds } = createMockDb(mockDossier);

    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "DELETE",
    });

    const res = await handleDeleteDossier(
      validCa,
      req,
      mockStore,
      mockDb,
      userWallet
    );
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(deletedIds.length, 1);
    assert.strictEqual(deletedIds[0], "dossier-uuid-123");
  });

  test("handles route context params in exported DELETE handler", async () => {
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "DELETE",
    });

    const res = await DELETE(req, {
      params: Promise.resolve({ ca: validCa }),
    });
    assert.strictEqual(res.status, 401);
  });
});
