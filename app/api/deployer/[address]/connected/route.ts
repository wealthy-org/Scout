import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import { dossiers } from "@/lib/db/schema";
import {
  detectConnections,
  type DossierWithSources,
} from "@/lib/connections/engine";
import type { CookieStoreLike } from "@/types/auth";
import type { DossierGraphNode, ConnectionsResponseBody } from "@/app/api/connections/route";

const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format");

export async function handleGetDeployerConnected(
  address: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<ConnectionsResponseBody>> {
  try {
    const parseResult = addressSchema.safeParse(address);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid address format",
        },
        { status: 400 }
      );
    }

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
          nodes: [],
          links: [],
        },
        { status: 200 }
      );
    }

    const userDossiers = await customDb
      .select()
      .from(dossiers)
      .where(eq(dossiers.walletAddress, wallet));

    const dossierInputs: DossierWithSources[] = userDossiers.map((d) => ({
      id: d.id,
      contractAddress: d.contractAddress,
      symbol: d.symbol || "UNKNOWN",
      name: d.name || undefined,
      thesis: d.thesis || undefined,
      notes: d.notes || undefined,
    }));

    const allLinks = detectConnections(dossierInputs);
    const targetAddr = address.toLowerCase();

    const relatedLinks = allLinks.filter(
      (l) =>
        l.sourceAddress.toLowerCase() === targetAddr ||
        l.targetAddress.toLowerCase() === targetAddr ||
        l.metadata?.deployerAddress?.toLowerCase() === targetAddr ||
        l.metadata?.feeRecipientAddress?.toLowerCase() === targetAddr
    );

    const relatedCAs = new Set<string>();
    relatedCAs.add(targetAddr);
    relatedLinks.forEach((l) => {
      relatedCAs.add(l.sourceAddress.toLowerCase());
      relatedCAs.add(l.targetAddress.toLowerCase());
    });

    const filteredDossiers = userDossiers.filter((d) =>
      relatedCAs.has(d.contractAddress.toLowerCase())
    );

    const nodes: DossierGraphNode[] = filteredDossiers.map((d) => ({
      id: d.id,
      contractAddress: d.contractAddress,
      symbol: d.symbol || "UNKNOWN",
      name: d.name || undefined,
      status: d.status || "active",
    }));

    return NextResponse.json(
      {
        ok: true,
        nodes,
        links: relatedLinks,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error fetching deployer connections",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  props: { params: Promise<{ address: string }> }
) {
  const { address } = await props.params;
  return handleGetDeployerConnected(address, req);
}
