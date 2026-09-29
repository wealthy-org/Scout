import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { censusStats, dossiers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { computeCensusStats, type CensusPayload } from "@/lib/census/compute";
import {
  LandingClient,
  type FeaturedDossier,
} from "@/components/landing/LandingClient";

export const metadata: Metadata = {
  title: "Scout // Dossier.OS: On-Chain Intelligence for Robinhood Chain",
  description:
    "Real-time surveillance, deployer scoring, forensic case files, and bonding curve market analysis on Robinhood Chain.",
};

export default async function HomePage() {
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
  let featuredDossier: FeaturedDossier | undefined;

  try {
    if (db) {
      const records = await db
        .select()
        .from(censusStats)
        .orderBy(desc(censusStats.computedAt))
        .limit(1);

      if (records && records.length > 0 && records[0].payloadJson) {
        const raw = records[0].payloadJson as Record<string, unknown>;
        if (typeof raw?.total_launches === "number" && typeof raw?.unique_deployers === "number") {
          stats = raw as unknown as CensusPayload;
        }
      }

      const latestDossiers = await db
        .select()
        .from(dossiers)
        .orderBy(desc(dossiers.updatedAt))
        .limit(1);

      if (latestDossiers && latestDossiers.length > 0) {
        const item = latestDossiers[0];
        featuredDossier = {
          contractAddress: item.contractAddress,
          symbol: item.symbol || "TOKEN",
          name: item.name || "Tracked Token",
          status: item.status || "Watching",
          thesis: item.thesis || "Active research file under surveillance.",
          deployerScore: 78,
          deployerBand: "green",
          deployerLabel: "repeat",
        };
      }
    }
  } catch {
  }

  if (!stats) {
    stats = await computeCensusStats(db);
  }

  return (
    <LandingClient
      stats={stats}
      featuredDossier={featuredDossier}
      userAddress={userAddress}
      isAuthenticated={isAuthenticated}
    />
  );
}
