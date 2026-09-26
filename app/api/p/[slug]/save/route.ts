import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import { dossiers, publishedDossiers } from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";

export interface SaveDossierResponseBody {
  ok: boolean;
  created?: boolean;
  already_exists?: boolean;
  contract_address?: string;
  revoked?: boolean;
  error?: string;
}

export async function handleSavePublicDossier(
  slug: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<SaveDossierResponseBody>> {
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
          ok: false,
          error: "Database unavailable",
        },
        { status: 503 }
      );
    }

    const records = await customDb
      .select()
      .from(publishedDossiers)
      .where(eq(publishedDossiers.slug, slug));

    if (!records || records.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Published dossier not found",
        },
        { status: 404 }
      );
    }

    const targetRecord = records[0];

    if (targetRecord.revokedAt !== null) {
      return NextResponse.json(
        {
          ok: false,
          revoked: true,
          error: "This published dossier has been revoked by its author",
        },
        { status: 410 }
      );
    }

    const payload = (targetRecord.payloadJson as Record<string, unknown>) || {};
    const contractAddress = String(payload.contractAddress || "").toLowerCase();

    if (!contractAddress) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payload: missing contract address",
        },
        { status: 400 }
      );
    }

    const existing = await customDb
      .select()
      .from(dossiers)
      .where(
        and(
          eq(dossiers.walletAddress, wallet),
          eq(dossiers.contractAddress, contractAddress)
        )
      );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        {
          ok: true,
          already_exists: true,
          contract_address: contractAddress,
        },
        { status: 200 }
      );
    }

    const originAuthor =
      targetRecord.authorHandle ||
      (typeof payload.authorHandle === "string" ? payload.authorHandle : null) ||
      (typeof payload.authorWallet === "string" ? payload.authorWallet : null);

    const originAt =
      typeof payload.publishedAt === "string"
        ? new Date(payload.publishedAt)
        : new Date();

    await customDb.insert(dossiers).values({
      walletAddress: wallet,
      chainId: 8453,
      contractAddress,
      symbol: typeof payload.symbol === "string" ? payload.symbol : null,
      name: typeof payload.name === "string" ? payload.name : null,
      status: "Researching",
      thesis: typeof payload.thesis === "string" ? payload.thesis : null,
      notes: typeof payload.notes === "string" ? payload.notes : null,
      originAuthor,
      originAt,
    });

    return NextResponse.json(
      {
        ok: true,
        created: true,
        contract_address: contractAddress,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error saving public dossier copy",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  return handleSavePublicDossier(slug, req);
}
