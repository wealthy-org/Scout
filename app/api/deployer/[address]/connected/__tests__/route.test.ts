import { test, describe } from "node:test";
import assert from "node:assert";
import { handleGetDeployerConnected } from "@/app/api/deployer/[address]/connected/route";
import type { Database } from "@/lib/db";
import type { CookieStoreLike } from "@/types/auth";

describe("API Deployer Connected Route (TICKET-56)", () => {
  const mockWallet = "0x1234567890123456789012345678901234567890";
  const mockDeployer = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

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
      thesis: "Main thesis",
      notes: "Research notes",
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

  test("rejects invalid deployer address with 400", async () => {
    const req = new Request("http://localhost:3000/api/deployer/invalid/connected");
    const res = await handleGetDeployerConnected("invalid", req, mockCookies, mockDb, mockWallet);
    assert.strictEqual(res.status, 400);

    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });

  test("returns connected dossiers and links for valid deployer", async () => {
    const req = new Request(`http://localhost:3000/api/deployer/${mockDeployer}/connected`);
    const res = await handleGetDeployerConnected(mockDeployer, req, mockCookies, mockDb, mockWallet);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.ok, true);
  });
});
