import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import { deployerWatchlist, deployerScores, deployerLaunches } from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";
import { ethAddressSchema } from "@/lib/validation/sanitize";
import { calculateScore } from "@/lib/score/calculate";

export interface WatchlistEntryResult {
  id: string;
  deployerAddress: string;
  createdAt: Date;
  lastSeenAt: Date;
  score?: {
    score: number;
    label: "fresh" | "repeat" | "serial";
    band: "green" | "yellow" | "red";
    totalLaunches: number;
    graduatedCount: number;
  } | null;
}

export interface GetWatchlistResponseBody {
  ok: boolean;
  watchlist?: WatchlistEntryResult[];
  error?: string;
}

export interface PostWatchlistResponseBody {
  ok: boolean;
  created?: boolean;
  deployer_address?: string;
  error?: string;
}

const postWatchlistSchema = z.object({
  deployer_address: ethAddressSchema.optional(),
  deployerAddress: ethAddressSchema.optional(),
});

export async function handleGetWatchlist(
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<GetWatchlistResponseBody>> {
  try {
    let wallet = authenticatedWallet;

    if (!wallet) {
      try {
        const session = await getSession(customCookies);
        if (session && session.wallet_address) {
          wallet = session.wallet_address;
        }
      } catch {
        wallet = undefined;
      }

      if (!wallet) {
        return NextResponse.json(
          {
            ok: false,
            error: "Authentication required",
          },
          { status: 401 }
        );
      }
    }

    if (!customDb) {
      return NextResponse.json(
        {
          ok: true,
          watchlist: [],
        },
        { status: 200 }
      );
    }

    const rows = await customDb
      .select({
        id: deployerWatchlist.id,
        deployerAddress: deployerWatchlist.deployerAddress,
        createdAt: deployerWatchlist.createdAt,
        lastSeenAt: deployerWatchlist.lastSeenAt,
        scoreValue: deployerScores.score,
        label: deployerScores.label,
        band: deployerScores.band,
        totalLaunches: deployerScores.totalLaunches,
        graduatedCount: deployerScores.graduatedCount,
      })
      .from(deployerWatchlist)
      .leftJoin(
        deployerScores,
        eq(deployerWatchlist.deployerAddress, deployerScores.deployerAddress)
      )
      .where(eq(deployerWatchlist.walletAddress, wallet))
      .orderBy(desc(deployerWatchlist.lastSeenAt));

    let launchesByDeployer: Map<string, { token: string; graduated: boolean }[]> = new Map();
    try {
      const launches = await customDb.select().from(deployerLaunches);
      if (Array.isArray(launches)) {
        launches.forEach((l) => {
          const dep = l.deployerAddress.toLowerCase();
          if (!launchesByDeployer.has(dep)) {
            launchesByDeployer.set(dep, []);
          }
          const isGraduated = l.phase === "graduated" || l.phase === "swept";
          launchesByDeployer.get(dep)!.push({
            token: l.tokenAddress,
            graduated: isGraduated,
          });
        });
      }
    } catch {}

    const result: WatchlistEntryResult[] = rows.map((row) => {
      let scoreData = null;
      if (typeof row.scoreValue === "number") {
        scoreData = {
          score: row.scoreValue,
          label: (row.label || "fresh") as "fresh" | "repeat" | "serial",
          band: (row.band || "yellow") as "green" | "yellow" | "red",
          totalLaunches: typeof row.totalLaunches === "number" ? row.totalLaunches : 0,
          graduatedCount: typeof row.graduatedCount === "number" ? row.graduatedCount : 0,
        };
      } else {
        const dLaunches = launchesByDeployer.get(row.deployerAddress.toLowerCase()) || [];
        const calculated = calculateScore(
          dLaunches.map((l) => ({
            token: l.token,
            graduated: l.graduated,
            isDoa: false,
            isBurst: false,
          }))
        );
        scoreData = {
          score: calculated.score,
          label: calculated.label,
          band: calculated.band,
          totalLaunches: calculated.signals.total_launches,
          graduatedCount: calculated.signals.graduated_count,
        };
      }

      return {
        id: row.id,
        deployerAddress: row.deployerAddress,
        createdAt: row.createdAt,
        lastSeenAt: row.lastSeenAt,
        score: scoreData,
      };
    });

    return NextResponse.json(
      {
        ok: true,
        watchlist: result,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error fetching watchlist",
      },
      { status: 500 }
    );
  }
}

export async function handlePostWatchlist(
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<PostWatchlistResponseBody>> {
  try {
    let wallet = authenticatedWallet;

    if (!wallet) {
      try {
        const session = await getSession(customCookies);
        if (session && session.wallet_address) {
          wallet = session.wallet_address;
        }
      } catch {
        wallet = undefined;
      }

      if (!wallet) {
        return NextResponse.json(
          {
            ok: false,
            error: "Authentication required",
          },
          { status: 401 }
        );
      }
    }

    let bodyData: z.infer<typeof postWatchlistSchema>;
    try {
      const json = await req.json();
      const parsed = postWatchlistSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json(
          {
            ok: false,
            error: "Invalid deployer address format",
          },
          { status: 400 }
        );
      }
      bodyData = parsed.data;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid JSON request body",
        },
        { status: 400 }
      );
    }

    const deployerAddress = (
      bodyData.deployer_address || bodyData.deployerAddress
    )?.toLowerCase();

    if (!deployerAddress) {
      return NextResponse.json(
        {
          ok: false,
          error: "deployer_address parameter is required",
        },
        { status: 400 }
      );
    }

    if (!customDb) {
      return NextResponse.json(
        {
          ok: true,
          created: true,
          deployer_address: deployerAddress,
        },
        { status: 201 }
      );
    }

    let resolvedAddress = deployerAddress;
    try {
      const tokenMatch = await customDb
        .select({ deployerAddress: deployerLaunches.deployerAddress })
        .from(deployerLaunches)
        .where(eq(deployerLaunches.tokenAddress, deployerAddress))
        .limit(1);
      if (tokenMatch.length > 0 && tokenMatch[0]?.deployerAddress) {
        resolvedAddress = tokenMatch[0].deployerAddress.toLowerCase();
      }
    } catch {}

    const currentEntries = await customDb
      .select({ id: deployerWatchlist.id, deployerAddress: deployerWatchlist.deployerAddress })
      .from(deployerWatchlist)
      .where(eq(deployerWatchlist.walletAddress, wallet));

    const existingMatch = currentEntries.find(
      (e) => e.deployerAddress.toLowerCase() === resolvedAddress
    );

    if (existingMatch) {
      return NextResponse.json(
        {
          ok: true,
          created: false,
          deployer_address: resolvedAddress,
        },
        { status: 200 }
      );
    }

    if (currentEntries.length >= 30) {
      return NextResponse.json(
        {
          ok: false,
          error: "Maximum watchlist quota reached (30 entries allowed per user)",
        },
        { status: 422 }
      );
    }

    await customDb.insert(deployerWatchlist).values({
      walletAddress: wallet,
      deployerAddress: resolvedAddress,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    });

    return NextResponse.json(
      {
        ok: true,
        created: true,
        deployer_address: resolvedAddress,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error adding deployer to watchlist",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleGetWatchlist(req);
}

export async function POST(req: Request) {
  return handlePostWatchlist(req);
}
