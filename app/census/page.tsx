import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { censusStats } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { computeCensusStats, type CensusPayload } from "@/lib/census/compute";
import { CensusView } from "@/components/census/CensusView";

export const metadata: Metadata = {
  title: "Robinhood Chain Launch Census | Scout",
  description:
    "Macro ecosystem intelligence, genesis deployer distribution, and bonding curve graduation velocity on Robinhood Chain.",
};

export default async function CensusPage() {
  let userAddress: string | undefined;
  let isAuthenticated = false;

  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      userAddress = session.wallet_address;
      isAuthenticated = true;
    }
  } catch {
  }

  let stats: CensusPayload | null = null;

  try {
    if (db) {
      const records = await db
        .select()
        .from(censusStats)
        .orderBy(desc(censusStats.computedAt))
        .limit(1);

      if (records && records.length > 0 && records[0].payloadJson) {
        stats = records[0].payloadJson as unknown as CensusPayload;
      }
    }
  } catch {
  }

  if (!stats) {
    stats = await computeCensusStats(db);
  }

  return (
    <CensusView
      stats={stats}
      userAddress={userAddress}
      isAuthenticated={isAuthenticated}
    />
  );
}
