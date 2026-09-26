import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { GET, handleGetLibrary } from "@/app/api/library/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import type { Dossier } from "@/lib/db/schema";

describe("GET /api/library Endpoint (TICKET-26)", () => {
  const rootDir = process.cwd();
  const routePath = path.join(rootDir, "app", "api", "library", "route.ts");

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

  function createMockDb(mockDossiers: Dossier[] = []): Database {
    return {
      query: {
        dossiers: {
          findMany: async () => mockDossiers,
        },
      },
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => ({
                offset: async () => mockDossiers,
              }),
            }),
          }),
        }),
      }),
    } as unknown as Database;
  }

  const sampleDossiers: Dossier[] = [
    {
      id: "d-1",
      walletAddress: "0x1111111111111111111111111111111111111111",
      chainId: 4663,
      contractAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      symbol: "SCOUT",
      name: "Scout Terminal",
      status: "In position",
      reason: "Conviction pick",
      thesis: "Strong liquidity velocity",
      notes: "Clean bytecode",
      decisionReason: "25% curve progress",
      createdAt: new Date("2026-09-20T10:00:00Z"),
      updatedAt: new Date("2026-09-21T10:00:00Z"),
      originAuthor: null,
      originAt: null,
    },
    {
      id: "d-2",
      walletAddress: "0x1111111111111111111111111111111111111111",
      chainId: 4663,
      contractAddress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      symbol: "ROBIN",
      name: "Robin Pepe",
      status: "Watching",
      reason: "Watching flow",
      thesis: "Early momentum",
      notes: "Scanning",
      decisionReason: null,
      createdAt: new Date("2026-09-22T10:00:00Z"),
      updatedAt: new Date("2026-09-22T12:00:00Z"),
      originAuthor: null,
      originAt: null,
    },
  ];

  test("route file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports GET route handler and handleGetLibrary", () => {
    assert.strictEqual(typeof GET, "function");
    assert.strictEqual(typeof handleGetLibrary, "function");
  });

  test("returns 401 Unauthorized when session is missing", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/library");
    const res = await handleGetLibrary(req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 400 Bad Request when status query param is invalid", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/library?status=InvalidStatus");
    const res = await handleGetLibrary(req, mockStore, null, userWallet);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 200 OK with all user dossiers when authenticated", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const mockDb = createMockDb(sampleDossiers);

    const req = new Request("http://localhost:3000/api/library");
    const res = await handleGetLibrary(req, mockStore, mockDb, userWallet);

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.dossiers.length, 2);
    assert.strictEqual(body.total, 2);
    assert.strictEqual(body.limit, 50);
    assert.strictEqual(body.offset, 0);
  });

  test("filters dossiers by search query", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const mockDb = createMockDb(sampleDossiers);

    const req = new Request("http://localhost:3000/api/library?search=ROBIN");
    const res = await handleGetLibrary(req, mockStore, mockDb, userWallet);

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.dossiers.length, 1);
    assert.strictEqual(body.dossiers[0].symbol, "ROBIN");
  });

  test("supports pagination with limit and offset", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const mockDb = createMockDb(sampleDossiers);

    const req = new Request("http://localhost:3000/api/library?limit=1&offset=1");
    const res = await handleGetLibrary(req, mockStore, mockDb, userWallet);

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.dossiers.length, 1);
    assert.strictEqual(body.total, 2);
    assert.strictEqual(body.limit, 1);
    assert.strictEqual(body.offset, 1);
  });
});
