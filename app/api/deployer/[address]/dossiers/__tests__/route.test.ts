import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import {
  GET,
  handleGetDeployerDossiers,
} from "@/app/api/deployer/[address]/dossiers/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import type { Dossier, DossierQuestion } from "@/lib/db/schema";

describe("GET /api/deployer/:address/dossiers Endpoint (TICKET-25)", () => {
  const rootDir = process.cwd();
  const routePath = path.join(
    rootDir,
    "app",
    "api",
    "deployer",
    "[address]",
    "dossiers",
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
    mockLaunches: { tokenAddress: string }[] = [],
    mockDossiers: Dossier[] = [],
    mockQuestions: DossierQuestion[] = []
  ): Database {
    return {
      query: {
        deployerLaunches: {
          findMany: async () => mockLaunches,
        },
        dossiers: {
          findMany: async () => mockDossiers,
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
                return mockQuestions;
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

  test("exports GET and handleGetDeployerDossiers", () => {
    assert.strictEqual(typeof GET, "function");
    assert.strictEqual(typeof handleGetDeployerDossiers, "function");
  });

  test("returns 400 Bad Request when address format is invalid", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/deployer/invalid-addr/dossiers");
    const res = await handleGetDeployerDossiers("invalid-addr", req, mockStore);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 401 Unauthorized when session is missing", async () => {
    const mockStore = createMockStore();
    const validAddress = "0xd111111111111111111111111111111111111111";
    const req = new Request(`http://localhost:3000/api/deployer/${validAddress}/dossiers`);
    const res = await handleGetDeployerDossiers(validAddress, req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 200 OK with empty array when no token launches or user dossiers exist", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validAddress = "0xd111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const mockDb = createMockDb([], []);

    const req = new Request(`http://localhost:3000/api/deployer/${validAddress}/dossiers`);
    const res = await handleGetDeployerDossiers(
      validAddress,
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.deepStrictEqual(body.dossiers, []);
  });

  test("returns 200 OK with connected dossiers and first question for scout remembers", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validAddress = "0xd111111111111111111111111111111111111111";
    const mockToken = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();

    const mockDossier: Dossier = {
      id: "dossier-1",
      walletAddress: userWallet.toLowerCase(),
      chainId: 4663,
      contractAddress: mockToken.toLowerCase(),
      symbol: "SCOUT",
      name: "Scout Terminal",
      status: "In position",
      reason: "High conviction launch",
      thesis: "Strong organic liquidity growth on Robinhood chain",
      notes: "Clean bytecode",
      decisionReason: "Entered at 25% curve",
      createdAt: new Date("2026-09-20T10:00:00Z"),
      updatedAt: new Date("2026-09-20T12:00:00Z"),
      originAuthor: null,
      originAt: null,
    };

    const mockQuestion: DossierQuestion = {
      id: "q-1",
      dossierId: "dossier-1",
      text: "Will fee recipient remain static?",
      done: false,
      position: 0,
    };

    const mockDb = createMockDb(
      [{ tokenAddress: mockToken.toLowerCase() }],
      [mockDossier],
      [mockQuestion]
    );

    const req = new Request(`http://localhost:3000/api/deployer/${validAddress}/dossiers`);
    const res = await handleGetDeployerDossiers(
      validAddress,
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.dossiers.length, 1);
    assert.strictEqual(body.dossiers[0].symbol, "SCOUT");
    assert.strictEqual(body.dossiers[0].status, "In position");
    assert.strictEqual(body.dossiers[0].firstQuestion, "Will fee recipient remain static?");
  });

  test("handles route context params in exported GET handler", async () => {
    const invalidAddress = "invalid-address-hex";
    const req = new Request(`http://localhost:3000/api/deployer/${invalidAddress}/dossiers`);

    const res = await GET(req, {
      params: Promise.resolve({ address: invalidAddress }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });
});
