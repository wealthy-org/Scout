import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, type Database } from "@/lib/db";
import { publishedDossiers } from "@/lib/db/schema";

export interface PublicDossierResponseBody {
  ok: boolean;
  slug?: string;
  authorHandle?: string | null;
  payload?: Record<string, unknown>;
  revoked?: boolean;
  error?: string;
}

export async function handleGetPublicDossier(
  slug: string,
  req: Request,
  customDb: Database | null = db
): Promise<NextResponse<PublicDossierResponseBody>> {
  try {
    if (!slug || slug.trim().length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Slug parameter is required",
        },
        { status: 400 }
      );
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

    return NextResponse.json(
      {
        ok: true,
        slug: targetRecord.slug,
        authorHandle: targetRecord.authorHandle,
        payload: (targetRecord.payloadJson as Record<string, unknown>) || {},
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error fetching public dossier",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  return handleGetPublicDossier(slug, req);
}
