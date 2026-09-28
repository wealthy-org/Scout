import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dossiers } from "@/lib/db/schema";
import {
  detectConnections,
  type DossierWithSources,
} from "@/lib/connections/engine";
import { MapClient } from "@/components/map/MapClient";
import type { MapNode, MapEdge } from "@/components/map/ConnectionMap";

export const metadata: Metadata = {
  title: "Connection Map | Scout",
  description:
    "Global relational constellation linking dossiers by deployer, fee routing, repositories, and thesis mentions.",
};

export default async function MapPage() {
  let userAddress: string | undefined;
  let isAuthenticated = false;
  let initialNodes: MapNode[] = [];
  let initialEdges: MapEdge[] = [];

  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      userAddress = session.wallet_address.toLowerCase();
      isAuthenticated = true;
    }
  } catch {}

  if (isAuthenticated && userAddress && db) {
    try {
      const userDossiers = await db
        .select()
        .from(dossiers)
        .where(eq(dossiers.walletAddress, userAddress));

      const dossierInputs: DossierWithSources[] = userDossiers.map((d) => ({
        id: d.id,
        contractAddress: d.contractAddress,
        symbol: d.symbol || "UNKNOWN",
        name: d.name || undefined,
        thesis: d.thesis || undefined,
        notes: d.notes || undefined,
      }));

      initialNodes = userDossiers.map((d) => ({
        contractAddress: d.contractAddress,
        symbol: d.symbol || "UNKNOWN",
        name: d.name || undefined,
        status: d.status || "active",
      }));

      const links = detectConnections(dossierInputs);
      initialEdges = links.map((l) => ({
        source: l.sourceAddress,
        target: l.targetAddress,
        type: l.type,
        reason: l.reason,
      }));
    } catch {}
  }

  return (
    <MapClient
      isAuthenticated={isAuthenticated}
      userAddress={userAddress}
      initialNodes={initialNodes}
      initialEdges={initialEdges}
    />
  );
}

