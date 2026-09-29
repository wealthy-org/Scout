import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { deployerWatchlist, deployerScores, deployerLaunches } from "@/lib/db/schema";
import { calculateScore } from "@/lib/score/calculate";
import {
  WatchlistClient,
  type WatchlistItem,
} from "@/components/watchlist/WatchlistClient";

export const metadata: Metadata = {
  title: "Deployer Watchlist | Scout",
  description: "Monitor repeat launchers, track token genesis events, and receive activity alerts.",
};

export default async function WatchlistPage() {
  let userAddress: string | undefined;
  let isAuthenticated = false;
  let initialEntries: WatchlistItem[] = [];

  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      userAddress = session.wallet_address;
      isAuthenticated = true;
    }
  } catch {
  }

  if (isAuthenticated && userAddress && db) {
    try {
      const rows = await db
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
        .where(eq(deployerWatchlist.walletAddress, userAddress))
        .orderBy(desc(deployerWatchlist.lastSeenAt));

      const launches = await db.select().from(deployerLaunches);
      const launchesByDeployer = new Map<string, { token: string; graduated: boolean }[]>();
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

      initialEntries = rows.map((row) => {
        let scoreData: WatchlistItem["score"] = null;
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
          createdAt: row.createdAt.toISOString(),
          lastSeenAt: row.lastSeenAt.toISOString(),
          newLaunchesCount: 0,
          score: scoreData,
        };
      });

      await db
        .update(deployerWatchlist)
        .set({ lastSeenAt: new Date() })
        .where(eq(deployerWatchlist.walletAddress, userAddress));
    } catch {
    }
  }

  return (
    <WatchlistClient
      initialEntries={initialEntries}
      isAuthenticated={isAuthenticated}
      userAddress={userAddress}
    />
  );
}
