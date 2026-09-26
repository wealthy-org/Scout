import type { Metadata } from "next";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dossiers } from "@/lib/db/schema";
import {
  LibraryClient,
  type LibraryDossierCard,
} from "@/components/library/LibraryClient";

export const metadata: Metadata = {
  title: "Case Files Library | Scout",
  description: "Manage your portfolio of researched token contracts, hypotheses, and on-chain intelligence.",
};

export default async function LibraryPage() {
  let userAddress: string | undefined;
  let isAuthenticated = false;
  let initialDossiers: LibraryDossierCard[] = [];

  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      userAddress = session.wallet_address.toLowerCase();
      isAuthenticated = true;
    }
  } catch {}

  if (isAuthenticated && userAddress && db) {
    try {
      const rows = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.walletAddress, userAddress))
        .orderBy(desc(dossiers.updatedAt))
        .limit(100);

      initialDossiers = rows.map((r) => ({
        id: r.id,
        walletAddress: r.walletAddress,
        chainId: r.chainId,
        contractAddress: r.contractAddress,
        symbol: r.symbol,
        name: r.name,
        status: r.status,
        reason: r.reason,
        thesis: r.thesis,
        decisionReason: r.decisionReason,
        notes: r.notes,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        originAuthor: r.originAuthor,
        originAt: r.originAt ? r.originAt.toISOString() : null,
      }));
    } catch {}
  }

  return (
    <LibraryClient
      initialDossiers={initialDossiers}
      isAuthenticated={isAuthenticated}
      userAddress={userAddress}
    />
  );
}
