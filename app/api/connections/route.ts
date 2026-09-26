import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import { dossiers } from "@/lib/db/schema";
import {
  detectConnections,
  type ConnectionLink,
  type DossierWithSources,
} from "@/lib/connections/engine";
import type { CookieStoreLike } from "@/types/auth";

export interface DossierGraphNode {
  id: string;
  contractAddress: string;
  symbol: string;
  name?: string;
  status: string;
  deployerAddress?: string;
  feeRecipientAddress?: string;
}

export interface ConnectionsResponseBody {
  ok: boolean;
  nodes?: DossierGraphNode[];
  links?: ConnectionLink[];
  error?: string;
}

export async function handleGetConnections(
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<ConnectionsResponseBody>> {
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

    const nodes: DossierGraphNode[] = userDossiers.map((d) => ({
      id: d.id,
      contractAddress: d.contractAddress,
      symbol: d.symbol || "UNKNOWN",
      name: d.name || undefined,
      status: d.status || "active",
    }));

    const links = detectConnections(dossierInputs);

    return NextResponse.json(
      {
        ok: true,
        nodes,
        links,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error fetching connection graph data",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleGetConnections(req);
}
