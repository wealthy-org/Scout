import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import {
  dossiers,
  publishedDossiers,
} from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";

const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format");

const publishBodySchema = z.object({
  handle: z
    .string()
    .regex(/^[a-zA-Z0-9_]{1,30}$/, "Invalid handle format")
    .optional(),
  include_notes: z.boolean().optional(),
});

function generateSlug(length: number = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(length);
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += chars[bytes[i] % chars.length];
  }
  return slug;
}

export async function handlePublishDossier(
  ca: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<{ ok: boolean; slug?: string; url?: string; error?: string }>> {
  try {
    const addressParse = addressSchema.safeParse(ca);
    if (!addressParse.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid contract address format",
        },
        { status: 400 }
      );
    }

    let bodyData: z.infer<typeof publishBodySchema> = {};
    try {
      const json = await req.json();
      const bodyParse = publishBodySchema.safeParse(json);
      if (!bodyParse.success) {
        return NextResponse.json(
          {
            ok: false,
            error: "Invalid publish request body",
          },
          { status: 400 }
        );
      }
      bodyData = bodyParse.data;
    } catch {
      // Empty body is acceptable
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
      const slug = generateSlug();
      return NextResponse.json(
        {
          ok: true,
          slug,
          url: `/p/${slug}`,
        },
        { status: 201 }
      );
    }

    const matchedDossiers = await customDb
      .select()
      .from(dossiers)
      .where(
        and(
          eq(dossiers.walletAddress, wallet),
          eq(dossiers.contractAddress, ca.toLowerCase())
        )
      );

    if (!matchedDossiers || matchedDossiers.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Dossier not found or not owned by user",
        },
        { status: 404 }
      );
    }

    const targetDossier = matchedDossiers[0];
    const slug = generateSlug();

    const payload: Record<string, unknown> = {
      contractAddress: targetDossier.contractAddress,
      symbol: targetDossier.symbol,
      name: targetDossier.name,
      thesis: targetDossier.thesis,
      publishedAt: new Date().toISOString(),
      authorWallet: wallet,
      authorHandle: bodyData.handle || null,
    };

    if (bodyData.include_notes && targetDossier.notes) {
      payload.notes = targetDossier.notes;
    }

    await customDb.insert(publishedDossiers).values({
      slug,
      dossierId: targetDossier.id,
      authorHandle: bodyData.handle || null,
      payloadJson: payload,
    });

    return NextResponse.json(
      {
        ok: true,
        slug,
        url: `/p/${slug}`,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error while publishing dossier",
      },
      { status: 500 }
    );
  }
}

export async function handleRevokePublish(
  slugOrCa: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<{ ok: boolean; error?: string }>> {
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
        },
        { status: 200 }
      );
    }

    const records = await customDb
      .select()
      .from(publishedDossiers)
      .where(eq(publishedDossiers.slug, slugOrCa));

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
    const payload = targetRecord.payloadJson as Record<string, unknown> | null;
    const authorWallet = (payload?.authorWallet as string) || "";

    if (authorWallet && authorWallet.toLowerCase() !== wallet.toLowerCase()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Forbidden: Only the owner can revoke this published dossier",
        },
        { status: 403 }
      );
    }

    await customDb
      .update(publishedDossiers)
      .set({ revokedAt: new Date() })
      .where(eq(publishedDossiers.slug, slugOrCa));

    return NextResponse.json(
      {
        ok: true,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error while revoking published dossier",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ ca: string }> }
) {
  const { ca } = await props.params;
  return handlePublishDossier(ca, req);
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ ca: string }> }
) {
  const { ca } = await props.params;
  return handleRevokePublish(ca, req);
}

