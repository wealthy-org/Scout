import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { dossiers, deployerLaunches, deployerScores } from "@/lib/db/schema";
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

      const launches = await db.select().from(deployerLaunches);
      const scores = await db.select().from(deployerScores);
      const scoreMap = new Map(scores.map((s) => [s.deployerAddress.toLowerCase(), s]));
      const launchMap = new Map(launches.map((l) => [l.tokenAddress.toLowerCase(), l.deployerAddress.toLowerCase()]));

      const dossierInputs: DossierWithSources[] = userDossiers.map((d) => {
        const depAddr = launchMap.get(d.contractAddress.toLowerCase());
        return {
          id: d.id,
          contractAddress: d.contractAddress,
          symbol: d.symbol || "UNKNOWN",
          name: d.name || undefined,
          deployerAddress: depAddr,
          thesis: d.thesis || undefined,
          notes: d.notes || undefined,
        };
      });

      initialNodes = userDossiers.map((d) => {
        let nodeStatus = (d.status || "active").toLowerCase();
        const depAddr = launchMap.get(d.contractAddress.toLowerCase());
        const depScore = depAddr ? scoreMap.get(depAddr) : null;
        if (depScore?.band === "red" || (d.notes && d.notes.toLowerCase().includes("rugged"))) {
          nodeStatus = "rugged";
        }
        return {
          contractAddress: d.contractAddress,
          symbol: d.symbol || "UNKNOWN",
          name: d.name || undefined,
          status: nodeStatus,
        };
      });

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

