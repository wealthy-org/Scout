import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  deployerScores,
  deployerLaunches,
  deployerWatchlist,
} from "@/lib/db/schema";
import { calculateScore } from "@/lib/score/calculate";
import {
  DeployerProfileView,
  type DeployerLaunchItem,
} from "@/components/deployer/DeployerProfileView";
import type { DeployerScoreSignals } from "@/types/score";

interface PageProps {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;
  return {
    title: `Deployer ${address.slice(0, 6)}...${address.slice(-4)} | Scout`,
    description: `On-chain reputation score, launch history, and graduation metrics for deployer ${address} on Robinhood Chain.`,
  };
}

export default async function DeployerPage({ params }: PageProps) {
  const { address } = await params;
  const cleanAddress = address.toLowerCase();

  if (!/^0x[0-9a-fA-F]{40}$/.test(cleanAddress)) {
    notFound();
  }

  let userAddress: string | undefined;
  let isAuthenticated = false;
  let isInWatchlist = false;

  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      userAddress = session.wallet_address.toLowerCase();
      isAuthenticated = true;
    }
  } catch {
    // Session fallback
  }

  let score = 50;
  let label = "fresh";
  let band = "yellow";
  let signals: DeployerScoreSignals = {
    grad_rate: 0.5,
    doa_rate: 0.0,
    burst_rate: 0.0,
    total_launches: 0,
    graduated_count: 0,
  };
  let launches: DeployerLaunchItem[] = [];

  if (db) {
    try {
      if (isAuthenticated && userAddress) {
        const watchRow = await db
          .select()
          .from(deployerWatchlist)
          .where(
            and(
              eq(deployerWatchlist.walletAddress, userAddress),
              eq(deployerWatchlist.deployerAddress, cleanAddress)
            )
          )
          .limit(1);
        isInWatchlist = watchRow.length > 0;
      }

      const scoreRows = await db
        .select()
        .from(deployerScores)
        .where(eq(deployerScores.deployerAddress, cleanAddress))
        .limit(1);

      const launchRows = await db
        .select()
        .from(deployerLaunches)
        .where(eq(deployerLaunches.deployerAddress, cleanAddress))
        .limit(40);

      launches = launchRows.map((l) => ({
        tokenAddress: l.tokenAddress,
        block: l.block ?? 0,
        phase: l.phase ?? "curve",
      }));

      if (scoreRows.length > 0) {
        const row = scoreRows[0];
        score = row.score;
        label = row.label;
        band = row.band;
        signals = {
          grad_rate: (row.graduatedCount + 1) / (row.totalLaunches + 2),
          doa_rate: row.deadOnArrivalCount / Math.max(row.totalLaunches, 1),
          burst_rate: row.burstLaunches / Math.max(row.totalLaunches, 1),
          total_launches: row.totalLaunches,
          graduated_count: row.graduatedCount,
        };
      } else {
        const launchInputs = launches.map((l) => ({
          token: l.tokenAddress,
          graduated: l.phase === "graduated",
          isDoa: false,
          isBurst: false,
        }));
        const calculated = calculateScore(launchInputs);
        score = calculated.score;
        label = calculated.label;
        band = calculated.band;
        signals = calculated.signals;
      }
    } catch {
      // Database fallback
    }
  }

  return (
    <DeployerProfileView
      address={cleanAddress}
      score={score}
      label={label}
      band={band}
      signals={signals}
      launches={launches}
      isAuthenticated={isAuthenticated}
      isInWatchlist={isInWatchlist}
      userAddress={userAddress}
    />
  );
}
