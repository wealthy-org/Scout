import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { GET, handleGetDeployer } from "@/app/api/deployer/[address]/route";
import { resetRateLimitStore } from "@/lib/security/ratelimit";
import type { Database } from "@/lib/db";
import type { DeployerScore, DeployerLaunch } from "@/lib/db/schema";

describe("GET /api/deployer/:address Endpoint (TICKET-24)", () => {
  const rootDir = process.cwd();
  const routePath = path.join(
    rootDir,
    "app",
    "api",
    "deployer",
    "[address]",
    "route.ts"
  );

  beforeEach(() => {
    resetRateLimitStore();
  });

  function createMockDb(
    mockScore: DeployerScore | null = null,
    mockLaunches: DeployerLaunch[] = []
  ): {
    db: Database;
    insertedScores: DeployerScore[];
  } {
    const insertedScores: DeployerScore[] = [];

    const mockDb = {
      query: {
        deployerScores: {
          findFirst: async () => mockScore,
        },
        deployerLaunches: {
          findMany: async () => mockLaunches,
        },
      },
      select: () => ({
        from: (table: unknown) => ({
          where: async () => {
            if (table && typeof table === "object" && "_" in table) {
              return mockScore ? [mockScore] : [];
            }
            return mockLaunches;
          },
        }),
      }),
      insert: () => ({
        values: (val: DeployerScore) => {
          insertedScores.push(val);
          return {
            onConflictDoUpdate: () => ({
              returning: async () => [val],
            }),
            then: <TResult1 = unknown, TResult2 = never>(
              onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
              onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
            ) => Promise.resolve([val]).then(onfulfilled, onrejected),
          };
        },
      }),
    } as unknown as Database;

    return { db: mockDb, insertedScores };
  }

  test("app/api/deployer/[address]/route.ts file must exist", () => {
    assert.strictEqual(fs.existsSync(routePath), true, "route file must exist");
  });

  test("exports GET route handler and handleGetDeployer function", () => {
    assert.strictEqual(typeof GET, "function", "GET handler must be exported");
    assert.strictEqual(
      typeof handleGetDeployer,
      "function",
      "handleGetDeployer must be exported"
    );
  });

  test("returns 400 Bad Request when deployer address format is invalid", async () => {
    const req = new Request("http://localhost:3000/api/deployer/invalid-address");
    const res = await handleGetDeployer("invalid-address", req);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.includes("Invalid"));
  });

  test("returns 429 Too Many Requests when rate limit (30 reqs/min) is exceeded", async () => {
    const validAddress = "0xd111111111111111111111111111111111111111";
    const clientIp = "192.168.1.100";
    const { db: mockDb } = createMockDb();

    for (let i = 0; i < 30; i++) {
      const req = new Request(`http://localhost:3000/api/deployer/${validAddress}`, {
        headers: { "x-forwarded-for": clientIp },
      });
      const res = await handleGetDeployer(validAddress, req, mockDb);
      assert.strictEqual(res.status, 200);
    }

    const blockedReq = new Request(`http://localhost:3000/api/deployer/${validAddress}`, {
      headers: { "x-forwarded-for": clientIp },
    });
    const blockedRes = await handleGetDeployer(validAddress, blockedReq, mockDb);
    assert.strictEqual(blockedRes.status, 429);
    assert.strictEqual(blockedRes.headers.get("Retry-After"), "60");
    const body = await blockedRes.json();
    assert.strictEqual(body.ok, false);
    assert.ok(body.error.includes("Rate limit"));
  });

  test("returns 200 OK with cached score and launches when score is fresh", async () => {
    const validAddress = "0xd111111111111111111111111111111111111111";
    const mockScore: DeployerScore = {
      deployerAddress: validAddress.toLowerCase(),
      totalLaunches: 5,
      graduatedCount: 4,
      deadOnArrivalCount: 0,
      burstLaunches: 0,
      feeRecipientReuse: 1,
      score: 85,
      label: "repeat",
      band: "green",
      updatedAt: new Date(),
    };
    const mockLaunches: DeployerLaunch[] = [
      {
        deployerAddress: validAddress.toLowerCase(),
        tokenAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        block: 27027350,
        phase: "graduated",
      },
    ];

    const { db: mockDb, insertedScores } = createMockDb(mockScore, mockLaunches);
    const req = new Request(`http://localhost:3000/api/deployer/${validAddress}`);
    const res = await handleGetDeployer(validAddress, req, mockDb);

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.deployer.score, 85);
    assert.strictEqual(body.deployer.label, "repeat");
    assert.strictEqual(body.deployer.band, "green");
    assert.strictEqual(body.launches.length, 1);
    assert.strictEqual(insertedScores.length, 0);
  });

  test("calculates score on-demand and saves to deployer_scores when record is missing", async () => {
    const validAddress = "0xd333333333333333333333333333333333333333";
    const mockLaunches: DeployerLaunch[] = [
      {
        deployerAddress: validAddress.toLowerCase(),
        tokenAddress: "0x1111111111111111111111111111111111111111",
        block: 100,
        phase: "curve",
      },
    ];

    const { db: mockDb, insertedScores } = createMockDb(null, mockLaunches);
    const req = new Request(`http://localhost:3000/api/deployer/${validAddress}`);
    const res = await handleGetDeployer(validAddress, req, mockDb);

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.deployer.totalLaunches, 1);
    assert.strictEqual(body.deployer.label, "fresh");
    assert.strictEqual(insertedScores.length, 1);
    assert.strictEqual(insertedScores[0].deployerAddress, validAddress.toLowerCase());
  });

  test("recalculates score when cached record is older than 1 hour", async () => {
    const validAddress = "0xd444444444444444444444444444444444444444";
    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);
    const staleScore: DeployerScore = {
      deployerAddress: validAddress.toLowerCase(),
      totalLaunches: 1,
      graduatedCount: 0,
      deadOnArrivalCount: 0,
      burstLaunches: 0,
      feeRecipientReuse: 0,
      score: 50,
      label: "fresh",
      band: "yellow",
      updatedAt: twoHoursAgo,
    };
    const mockLaunches: DeployerLaunch[] = [
      {
        deployerAddress: validAddress.toLowerCase(),
        tokenAddress: "0x1111111111111111111111111111111111111111",
        block: 100,
        phase: "graduated",
      },
      {
        deployerAddress: validAddress.toLowerCase(),
        tokenAddress: "0x2222222222222222222222222222222222222222",
        block: 200,
        phase: "graduated",
      },
    ];

    const { db: mockDb, insertedScores } = createMockDb(staleScore, mockLaunches);
    const req = new Request(`http://localhost:3000/api/deployer/${validAddress}`);
    const res = await handleGetDeployer(validAddress, req, mockDb);

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.deployer.totalLaunches, 2);
    assert.strictEqual(body.deployer.graduatedCount, 2);
    assert.strictEqual(insertedScores.length, 1);
  });

  test("handles route context params in exported GET handler", async () => {
    const invalidAddress = "invalid-address-hex";
    const req = new Request(`http://localhost:3000/api/deployer/${invalidAddress}`);

    const res = await GET(req, {
      params: Promise.resolve({ address: invalidAddress }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.ok, false);
  });
});
