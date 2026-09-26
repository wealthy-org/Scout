import { test, describe } from "node:test";
import assert from "node:assert";
import { handleGetConnections } from "@/app/api/connections/route";
import type { Database } from "@/lib/db";
import type { CookieStoreLike } from "@/types/auth";

describe("API Connections Route (TICKET-56)", () => {
  const mockWallet = "0x1234567890123456789012345678901234567890";

  const mockDossiers = [
    {
      id: "doc-1",
      walletAddress: mockWallet,
      chainId: 8453,
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "ALPHA",
      name: "Alpha Protocol",
      status: "Watching",
      reason: null,
      thesis: "Main thesis mentioning $BETA",
      notes: "Research notes",
      decisionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      originAuthor: null,
      originAt: null,
    },
    {
      id: "doc-2",
      walletAddress: mockWallet,
      chainId: 8453,
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "BETA",
      name: "Beta Meme",
      status: "Passed",
      reason: null,
      thesis: "Second project",
      notes: "Referencing 0x1111111111111111111111111111111111111111",
      decisionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      originAuthor: null,
      originAt: null,
    },
  ];

  const mockDb = {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve(mockDossiers),
      }),
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

  test("returns 401 when user is not authenticated", async () => {
    const unauthCookies: CookieStoreLike = {
      get: () => undefined,
      set: () => {},
      delete: () => {},
    };

    const req = new Request("http://localhost:3000/api/connections");
    const res = await handleGetConnections(req, unauthCookies, mockDb);
    assert.strictEqual(res.status, 401);

    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns nodes and links graph data when authenticated", async () => {
    const req = new Request("http://localhost:3000/api/connections");
    const res = await handleGetConnections(
      req,
      mockCookies,
      mockDb,
      mockWallet
    );
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.nodes.length, 2);
    assert.ok(body.links.length >= 1);

    const hypothesisLink = body.links.find(
      (l: { reason: string }) => l.reason === "note_mention"
    );
    assert.ok(hypothesisLink);
  });

  test("handles empty user library gracefully", async () => {
    const emptyDb = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([]),
        }),
      }),
    } as unknown as Database;

    const req = new Request("http://localhost:3000/api/connections");
    const res = await handleGetConnections(
      req,
      mockCookies,
      emptyDb,
      mockWallet
    );
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.deepStrictEqual(body.nodes, []);
    assert.deepStrictEqual(body.links, []);
  });
});
