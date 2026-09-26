import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { POST, handlePostLibraryImport } from "@/app/api/library/import/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import type { Dossier } from "@/lib/db/schema";

describe("POST /api/library/import Endpoint (TICKET-27)", () => {
  const rootDir = process.cwd();
  const routePath = path.join(
    rootDir,
    "app",
    "api",
    "library",
    "import",
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

  function createMockDb(existingContractAddress?: string): {
    db: Database;
    insertedDossiers: unknown[];
  } {
    const insertedDossiers: unknown[] = [];

    const mockDb = {
      query: {
        dossiers: {
          findFirst: async () =>
            existingContractAddress
              ? ({
                  id: "existing-id",
                  contractAddress: existingContractAddress.toLowerCase(),
                } as Dossier)
              : null,
        },
      },
      select: () => ({
        from: () => ({
          where: async () =>
            existingContractAddress
              ? ([
                  {
                    id: "existing-id",
                    contractAddress: existingContractAddress.toLowerCase(),
                  },
                ] as Dossier[])
              : [],
        }),
      }),
      insert: () => ({
        values: (val: unknown) => {
          insertedDossiers.push(val);
          return {
            returning: async () => [{ id: "mock-imported-id" }],
            then: <TResult1 = unknown, TResult2 = never>(
              onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
              onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
            ) => Promise.resolve([{ id: "mock-imported-id" }]).then(onfulfilled, onrejected),
          };
        },
      }),
    } as unknown as Database;

    return { db: mockDb, insertedDossiers };
  }

  test("route file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports POST route handler and handlePostLibraryImport", () => {
    assert.strictEqual(typeof POST, "function");
    assert.strictEqual(typeof handlePostLibraryImport, "function");
  });

  test("returns 401 Unauthorized when session is missing", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/library/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([]),
    });

    const res = await handlePostLibraryImport(req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 400 Bad Request when JSON body is invalid", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/library/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid-json",
    });

    const res = await handlePostLibraryImport(req, mockStore, null, userWallet);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("imports new dossiers and skips existing ones without throwing error", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const existingCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const newCa = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
    const { db: mockDb } = createMockDb(existingCa);

    const payload = [
      {
        contractAddress: existingCa,
        symbol: "EXIST",
        name: "Existing Token",
        status: "Watching",
      },
      {
        contractAddress: newCa,
        symbol: "NEW",
        name: "New Token",
        status: "In position",
        items: [{ kind: "pro", text: "Growing liquidity" }],
        questions: [{ text: "Can it graduate?", done: false }],
      },
    ];

    const req = new Request("http://localhost:3000/api/library/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await handlePostLibraryImport(
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.imported, 0);
    assert.strictEqual(body.skipped, 2);
  });

  test("successfully imports when dossiers are new and collects invalid address errors", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const mockStore = createMockStore();
    const { db: mockDb, insertedDossiers } = createMockDb();

    const payload = {
      dossiers: [
        {
          contractAddress: "0xcccccccccccccccccccccccccccccccccccccccc",
          symbol: "VALID",
          name: "Valid Token",
          status: "Watching",
        },
        {
          contractAddress: "invalid-address",
          symbol: "BAD",
        },
      ],
    };

    const req = new Request("http://localhost:3000/api/library/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await handlePostLibraryImport(
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.imported, 1);
    assert.strictEqual(body.skipped, 0);
    assert.strictEqual(body.errors.length, 1);
    assert.ok(insertedDossiers.length > 0);
  });
});
