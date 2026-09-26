import { test, describe } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import {
  GET,
  handleGetDossierMarkdown,
  generateMarkdownDossier,
} from "@/app/api/dossier/[ca]/export.md/route";
import type { CookieStoreLike } from "@/types/auth";
import type { Database } from "@/lib/db";
import type { Dossier, DossierItem, DossierQuestion } from "@/lib/db/schema";

describe("GET /api/dossier/:ca/export.md Endpoint (TICKET-29)", () => {
  const rootDir = process.cwd();
  const routePath = path.join(
    rootDir,
    "app",
    "api",
    "dossier",
    "[ca]",
    "export.md",
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
    mockDossier: Dossier | null = null,
    mockItems: DossierItem[] = [],
    mockQuestions: DossierQuestion[] = []
  ): Database {
    return {
      query: {
        dossiers: {
          findFirst: async () => mockDossier,
        },
        dossierItems: {
          findMany: async () => mockItems,
        },
        dossierQuestions: {
          findMany: async () => mockQuestions,
        },
        snapshots: {
          findMany: async () => [],
        },
      },
      select: () => ({
        from: (table: unknown) => ({
          where: () => ({
            orderBy: () => ({
              limit: async () => {
                if (table && typeof table === "object" && "_" in table) {
                  return mockQuestions;
                }
                return mockDossier ? [mockDossier] : [];
              },
            }),
          }),
        }),
      }),
    } as unknown as Database;
  }

  const sampleDossier: Dossier = {
    id: "d-1",
    walletAddress: "0x1111111111111111111111111111111111111111",
    chainId: 4663,
    contractAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    symbol: "SCOUT",
    name: "Scout Terminal",
    status: "In position",
    reason: "High conviction token",
    thesis: "Verified clean contract code and active developers.",
    notes: "# Investigation Notes\nVerified clean contract.",
    decisionReason: "Position entered at 25% curve",
    createdAt: new Date("2026-09-20T10:00:00Z"),
    updatedAt: new Date("2026-09-21T10:00:00Z"),
    originAuthor: null,
    originAt: null,
  };

  const sampleItems: DossierItem[] = [
    {
      id: "i-1",
      dossierId: "d-1",
      kind: "pro",
      text: "High liquidity depth",
      position: 0,
    },
    {
      id: "i-2",
      dossierId: "d-1",
      kind: "con",
      text: "Concentrated top 5 holders",
      position: 1,
    },
  ];

  const sampleQuestions: DossierQuestion[] = [
    {
      id: "q-1",
      dossierId: "d-1",
      text: "Will deployer add more liquidity?",
      done: true,
      position: 0,
    },
    {
      id: "q-2",
      dossierId: "d-1",
      text: "Is multi-sig active?",
      done: false,
      position: 1,
    },
  ];

  test("route file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports GET and handleGetDossierMarkdown", () => {
    assert.strictEqual(typeof GET, "function");
    assert.strictEqual(typeof handleGetDossierMarkdown, "function");
  });

  test("generateMarkdownDossier produces valid frontmatter and sections", () => {
    const md = generateMarkdownDossier(
      sampleDossier,
      sampleItems,
      sampleQuestions
    );
    assert.ok(md.startsWith("---"));
    assert.ok(md.includes('symbol: "SCOUT"'));
    assert.ok(md.includes("## Research Thesis"));
    assert.ok(md.includes("## Arguments For (Pros)"));
    assert.ok(md.includes("- High liquidity depth"));
    assert.ok(md.includes("## Arguments Against (Cons)"));
    assert.ok(md.includes("- Concentrated top 5 holders"));
    assert.ok(md.includes("- [x] Will deployer add more liquidity?"));
    assert.ok(md.includes("- [ ] Is multi-sig active?"));
  });

  test("returns 400 Bad Request on invalid contract address format", async () => {
    const mockStore = createMockStore();
    const req = new Request("http://localhost:3000/api/dossier/invalid-ca/export.md");
    const res = await handleGetDossierMarkdown("invalid-ca", req, mockStore);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 401 Unauthorized when session is missing", async () => {
    const mockStore = createMockStore();
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const req = new Request(`http://localhost:3000/api/dossier/${validCa}/export.md`);
    const res = await handleGetDossierMarkdown(validCa, req, mockStore);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 404 Not Found when dossier does not exist for the user", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const mockDb = createMockDb(null);

    const req = new Request(`http://localhost:3000/api/dossier/${validCa}/export.md`);
    const res = await handleGetDossierMarkdown(
      validCa,
      req,
      mockStore,
      mockDb,
      userWallet
    );
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns 200 OK with markdown attachment for authorized owner", async () => {
    const userWallet = "0x1111111111111111111111111111111111111111";
    const validCa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const mockStore = createMockStore();
    const mockDb = createMockDb(sampleDossier, sampleItems, sampleQuestions);

    const req = new Request(`http://localhost:3000/api/dossier/${validCa}/export.md`);
    const res = await handleGetDossierMarkdown(
      validCa,
      req,
      mockStore,
      mockDb,
      userWallet
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(
      res.headers.get("Content-Type"),
      "text/markdown; charset=utf-8"
    );
    assert.strictEqual(
      res.headers.get("Content-Disposition"),
      'attachment; filename="dossier-scout.md"'
    );

    const text = await res.text();
    assert.ok(text.includes('symbol: "SCOUT"'));
    assert.ok(text.includes("## Research Thesis"));
    assert.ok(text.includes("Verified clean contract code"));
  });

  test("handles route context params in exported GET handler", async () => {
    const invalidCa = "invalid-hex-ca";
    const req = new Request(`http://localhost:3000/api/dossier/${invalidCa}/export.md`);

    const res = await GET(req, {
      params: Promise.resolve({ ca: invalidCa }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });
});
