import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { PUT, handlePutDossier } from "@/app/api/dossier/[ca]/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import type { PutDossierRequestBody } from "@/types/dossier";

describe("PUT /api/dossier/:ca Endpoint (TICKET-22)", () => {
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

  function createMockDb(): Database {
    const executedOperations: string[] = [];

    const txMock = {
      insert: () => ({
        values: () => {
          executedOperations.push("insert_values");
          return {
            onConflictDoUpdate: () => ({
              returning: async () => [{ id: "mock-dossier-id" }],
            }),
            then: <TResult1 = unknown, TResult2 = never>(
              onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
              onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
            ) => Promise.resolve([{ id: "mock-dossier-id" }]).then(onfulfilled, onrejected),
          };
        },
      }),
      delete: () => ({
        where: async () => {
          executedOperations.push("delete_items_or_questions");
        },
      }),
      select: () => ({
        from: () => ({
          where: async () => [{ id: "mock-dossier-id" }],
        }),
      }),
    };

    return {
      transaction: async <T>(cb: (tx: unknown) => Promise<T>) => {
        return cb(txMock);
      },
    } as unknown as Database;
  }

  test("app/api/dossier/[ca]/route.ts file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports PUT route handler and handlePutDossier function", () => {
    assert.strictEqual(typeof PUT, "function", "PUT handler must be exported");
    assert.strictEqual(
      typeof handlePutDossier,
      "function",
      "handlePutDossier must be exported"
    );
  });

  test("returns 400 Bad Request when contract address format is invalid", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/dossier/invalid-ca", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Watching" }),
    });

    const res = await handlePutDossier("invalid-ca", req, mockStore);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.includes("Invalid contract address"));
  });

  test("returns 401 Unauthorized when user has no active wallet session", async () => {
    const mockStore = createMockStore();
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Watching" }),
    });

    const res = await handlePutDossier(validCa, req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.toLowerCase().includes("unauthorized"));
  });

  test("returns 400 Bad Request when body is invalid JSON", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "invalid-json-{",
    });

    const res = await handlePutDossier(
      validCa,
      req,
      mockStore,
      null,
      userWallet
    );
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.strictEqual(body.error, "Invalid JSON body");
  });

  test("returns 400 Bad Request when status enum is invalid", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "InvalidStatusEnum" }),
    });

    const res = await handlePutDossier(
      validCa,
      req,
      mockStore,
      null,
      userWallet
    );
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 400 Bad Request when item kind is invalid", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ kind: "invalid_kind", text: "Valid text" }],
      }),
    });

    const res = await handlePutDossier(
      validCa,
      req,
      mockStore,
      null,
      userWallet
    );
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 400 Bad Request when text bounds are exceeded (e.g. notes > 20000 chars)", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const oversizedNotes = "a".repeat(20001);
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: oversizedNotes }),
    });

    const res = await handlePutDossier(
      validCa,
      req,
      mockStore,
      null,
      userWallet
    );
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 400 Bad Request when item text exceeds 500 characters", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const oversizedItemText = "x".repeat(501);
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ kind: "pro", text: oversizedItemText }],
      }),
    });

    const res = await handlePutDossier(
      validCa,
      req,
      mockStore,
      null,
      userWallet
    );
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 200 OK and executes atomic transaction on valid payload", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const mockDb = createMockDb();

    const validPayload: PutDossierRequestBody = {
      status: "In position",
      thesis: "Strong organic liquidity growth on Robinhood chain",
      reason: "Verified clean deployer bytecode",
      decision_reason: "Entry taken at 25% curve",
      notes: "# Investigation Notes\nVerified clean contract.",
      items: [
        { kind: "pro", text: "Top holders decentralized", position: 0 },
        { kind: "source", text: "https://github.com/scout/protocol", position: 1 },
      ],
      questions: [
        { text: "Will fee recipient remain constant?", done: false, position: 0 },
      ],
    };

    const req = new Request(`http://localhost:3000/api/dossier/${validCa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await handlePutDossier(
      validCa,
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
  });
});
