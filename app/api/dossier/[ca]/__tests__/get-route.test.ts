import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { GET, handleGetDossier } from "@/app/api/dossier/[ca]/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import {
  type Dossier,
  type DossierItem,
  type DossierQuestion,
  type DossierLog,
  type Snapshot,
} from "@/lib/db/schema";
import { mockData } from "@/scripts/seed";


describe("GET /api/dossier/:ca Endpoint (TICKET-21)", () => {
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

  interface FieldCondition {
    field: string;
    val: string;
  }

  function createMockDb(): Database {
    const storedDossiers: Dossier[] = [...mockData.dossiers] as Dossier[];
    const storedItems: DossierItem[] = [...mockData.dossierItems] as DossierItem[];
    const storedQuestions: DossierQuestion[] = [...mockData.dossierQuestions] as DossierQuestion[];
    const storedLogs: DossierLog[] = [...mockData.dossierLog] as DossierLog[];
    const storedSnapshots: Snapshot[] = [...mockData.snapshots] as Snapshot[];

    const queryMock = {
      dossiers: {
        findFirst: async (options?: {
          where?: (
            table: Record<string, string>,
            helpers: {
              eq: (field: string, val: string) => FieldCondition;
              and: (...clauses: FieldCondition[]) => FieldCondition[];
            }
          ) => FieldCondition[];
        }) => {
          if (options?.where && typeof options.where === "function") {
            const condition = options.where(
              { walletAddress: "walletAddress", contractAddress: "contractAddress" },
              {
                eq: (field: string, val: string) => ({ field, val }),
                and: (...clauses: FieldCondition[]) => clauses,
              }
            );
            const walletClause = condition.find((c) => c.field === "walletAddress");
            const contractClause = condition.find((c) => c.field === "contractAddress");

            return (
              storedDossiers.find(
                (d) =>
                  d.walletAddress.toLowerCase() === walletClause?.val?.toLowerCase() &&
                  d.contractAddress.toLowerCase() === contractClause?.val?.toLowerCase()
              ) ?? null
            );
          }
          return null;
        },
        findMany: async () => storedDossiers,
      },
      dossierItems: {
        findMany: async (options?: {
          where?: (
            table: Record<string, string>,
            helpers: { eq: (field: string, val: string) => FieldCondition }
          ) => FieldCondition;
        }) => {
          if (options?.where && typeof options.where === "function") {
            const condition = options.where(
              { dossierId: "dossierId" },
              { eq: (field: string, val: string) => ({ field, val }) }
            );
            return storedItems.filter((item) => item.dossierId === condition.val);
          }
          return storedItems;
        },
      },
      dossierQuestions: {
        findMany: async (options?: {
          where?: (
            table: Record<string, string>,
            helpers: { eq: (field: string, val: string) => FieldCondition }
          ) => FieldCondition;
        }) => {
          if (options?.where && typeof options.where === "function") {
            const condition = options.where(
              { dossierId: "dossierId" },
              { eq: (field: string, val: string) => ({ field, val }) }
            );
            return storedQuestions.filter((q) => q.dossierId === condition.val);
          }
          return storedQuestions;
        },
      },
      dossierLog: {
        findMany: async (options?: {
          where?: (
            table: Record<string, string>,
            helpers: { eq: (field: string, val: string) => FieldCondition }
          ) => FieldCondition;
        }) => {
          if (options?.where && typeof options.where === "function") {
            const condition = options.where(
              { dossierId: "dossierId" },
              { eq: (field: string, val: string) => ({ field, val }) }
            );
            return storedLogs.filter((log) => log.dossierId === condition.val);
          }
          return storedLogs;
        },
      },
      snapshots: {
        findMany: async (options?: {
          where?: (
            table: Record<string, string>,
            helpers: { eq: (field: string, val: string) => FieldCondition }
          ) => FieldCondition;
        }) => {
          if (options?.where && typeof options.where === "function") {
            const condition = options.where(
              { dossierId: "dossierId" },
              { eq: (field: string, val: string) => ({ field, val }) }
            );
            return storedSnapshots.filter((s) => s.dossierId === condition.val);
          }
          return storedSnapshots;
        },
      },
    };

    return {
      query: queryMock,
    } as unknown as Database;
  }

  test("app/api/dossier/[ca]/route.ts file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports GET route handler and handleGetDossier function", () => {
    assert.strictEqual(typeof GET, "function", "GET handler must be exported");
    assert.strictEqual(
      typeof handleGetDossier,
      "function",
      "handleGetDossier must be exported"
    );
  });

  test("returns 400 Bad Request when contract address format is invalid", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/dossier/invalid-address");

    const res = await handleGetDossier("invalid-address", req, mockStore);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.includes("Invalid contract address"));
  });

  test("returns 401 Unauthorized when user has no active wallet session", async () => {
    const mockStore = createMockStore();
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`);

    const res = await handleGetDossier(validCa, req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.toLowerCase().includes("unauthorized"));
  });

  test("returns 404 Not Found when dossier does not exist for the authenticated user", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const nonexistentCa = "0x9999999999999999999999999999999999999999";
    const mockStore = createMockStore();
    const mockDb = createMockDb();

    const req = new Request(`http://localhost:3000/api/dossier/${nonexistentCa}`);
    const res = await handleGetDossier(
      nonexistentCa,
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.toLowerCase().includes("not found"));
  });

  test("returns 200 OK with complete dossier structure for authorized owner", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const targetCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const mockDb = createMockDb();

    const req = new Request(`http://localhost:3000/api/dossier/${targetCa}`);
    const res = await handleGetDossier(
      targetCa,
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.ok(body.dossier);
    assert.strictEqual(body.dossier.contractAddress, targetCa);
    assert.strictEqual(body.dossier.symbol, "SCOUT");
    assert.strictEqual(body.dossier.status, "In position");
    assert.ok(Array.isArray(body.dossier.items));
    assert.ok(Array.isArray(body.dossier.questions));
    assert.ok(Array.isArray(body.dossier.logs));
    assert.ok(Array.isArray(body.dossier.snapshots));
  });

  test("enforces user privacy and isolation (User A cannot access User B's dossier)", async () => {
    const userAWallet = "0x1111111111111111111111111111111111111111";
    const userBOnlyCa = "0xcccccccccccccccccccccccccccccccccccccccc";
    const mockStore = createMockStore();
    const mockDb = createMockDb();

    const req = new Request(`http://localhost:3000/api/dossier/${userBOnlyCa}`);
    const res = await handleGetDossier(
      userBOnlyCa,
      req,
      mockStore,
      mockDb,
      userAWallet
    );

    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });
});
