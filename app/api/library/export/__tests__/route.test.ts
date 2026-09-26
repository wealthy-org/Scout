import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { GET, handleGetLibraryExport } from "@/app/api/library/export/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import type { Dossier, DossierItem, DossierQuestion } from "@/lib/db/schema";

describe("GET /api/library/export Endpoint (TICKET-28)", () => {
  const rootDir = process.cwd();
  const routePath = path.join(
    rootDir,
    "app",
    "api",
    "library",
    "export",
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

  function createMockDb(
    mockDossiers: Dossier[] = [],
    mockItems: DossierItem[] = [],
    mockQuestions: DossierQuestion[] = []
  ): Database {
    return {
      query: {
        dossiers: {
          findMany: async () => mockDossiers,
        },
        dossierItems: {
          findMany: async () => mockItems,
        },
        dossierQuestions: {
          findMany: async () => mockQuestions,
        },
      },
      select: () => ({
        from: (table: unknown) => ({
          where: () => ({
            orderBy: async () => {
              if (table && typeof table === "object" && "_" in table) {
                return mockItems;
              }
              return mockDossiers;
            },
          }),
        }),
      }),
    } as unknown as Database;
  }

  test("route file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports GET route handler and handleGetLibraryExport", () => {
    assert.strictEqual(typeof GET, "function");
    assert.strictEqual(typeof handleGetLibraryExport, "function");
  });

  test("returns 401 Unauthorized when session is missing", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/library/export");
    const res = await handleGetLibraryExport(req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 200 OK with formatted downloadable JSON and Content-Disposition header", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();

    const sampleDossier: Dossier = {
      id: "d-1",
      walletAddress: userWallet.toLowerCase(),
      chainId: 4663,
      contractAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      symbol: "SCOUT",
      name: "Scout Terminal",
      status: "In position",
      reason: "High conviction",
      thesis: "Strong liquidity velocity",
      notes: "# Notes\nClean bytecode",
      decisionReason: "25% curve",
      createdAt: new Date("2026-09-20T10:00:00Z"),
      updatedAt: new Date("2026-09-21T10:00:00Z"),
      originAuthor: null,
      originAt: null,
    };

    const sampleItem: DossierItem = {
      id: "item-1",
      dossierId: "d-1",
      kind: "pro",
      text: "Growing organic liquidity",
      position: 0,
    };

    const sampleQuestion: DossierQuestion = {
      id: "q-1",
      dossierId: "d-1",
      text: "Is deployer verified?",
      done: true,
      position: 0,
    };

    const mockDb = createMockDb(
      [sampleDossier],
      [sampleItem],
      [sampleQuestion]
    );

    const req = new Request("http://localhost:3000/api/library/export");
    const res = await handleGetLibraryExport(
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(
      res.headers.get("Content-Type"),
      "application/json"
    );
    assert.strictEqual(
      res.headers.get("Content-Disposition"),
      'attachment; filename="scout-library-export.json"'
    );

    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.strictEqual(body.length, 1);
    assert.strictEqual(body[0].symbol, "SCOUT");
    assert.strictEqual(body[0].items.length, 1);
    assert.strictEqual(body[0].items[0].text, "Growing organic liquidity");
    assert.strictEqual(body[0].questions.length, 1);
    assert.strictEqual(body[0].questions[0].text, "Is deployer verified?");
  });
});
