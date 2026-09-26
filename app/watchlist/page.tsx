import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { deployerWatchlist, deployerScores } from "@/lib/db/schema";
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
    // Session fallback
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

      initialEntries = rows.map((row) => ({
        id: row.id,
        deployerAddress: row.deployerAddress,
        createdAt: row.createdAt.toISOString(),
        lastSeenAt: row.lastSeenAt.toISOString(),
        newLaunchesCount: 0,
        score:
          typeof row.scoreValue === "number"
            ? {
                score: row.scoreValue,
                label: row.label || "fresh",
                band: row.band || "yellow",
                totalLaunches: row.totalLaunches || 0,
                graduatedCount: row.graduatedCount || 0,
              }
            : null,
      }));

      await db
        .update(deployerWatchlist)
        .set({ lastSeenAt: new Date() })
        .where(eq(deployerWatchlist.walletAddress, userAddress));
    } catch {
      // Database query fallback
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
