import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { publishedDossiers } from "@/lib/db/schema";
import {
  PublicDossierClient,
  type PublicDossierPayload,
} from "@/components/dossier/PublicDossierClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    if (db) {
      const records = await db
        .select()
        .from(publishedDossiers)
        .where(eq(publishedDossiers.slug, slug));

      if (records && records.length > 0) {
        const item = records[0];
        const payload = (item.payloadJson as Record<string, unknown>) || {};
        const symbol = String(payload.symbol || "TOKEN");
        return {
          title: `$${symbol} Case File Dossier | Scout`,
          description:
            typeof payload.thesis === "string"
              ? payload.thesis.slice(0, 160)
              : `Public on-chain research case file for $${symbol}`,
        };
      }
    }
  } catch {
    // DB fallback
  }

  return {
    title: "Public Case File Dossier | Scout",
    description: "Public on-chain research case file snapshot on Scout Dossier.OS",
  };
}

export default async function PublicDossierPage({ params }: PageProps) {
  const { slug } = await params;

  let authorHandle: string | null = null;
  let revoked = false;
  let payload: PublicDossierPayload = {
    symbol: "TOKEN",
    name: "Sample Public Dossier",
    contractAddress: "0x0000000000000000000000000000000000000000",
    thesis: "Public research case file loaded on Scout.",
  };

  try {
    if (db) {
      const records = await db
        .select()
        .from(publishedDossiers)
        .where(eq(publishedDossiers.slug, slug));

      if (records && records.length > 0) {
        const item = records[0];
        authorHandle = item.authorHandle;
        revoked = item.revokedAt !== null;
        payload = (item.payloadJson as PublicDossierPayload) || payload;
      }
    }
  } catch {
    // Database query fallback for test environments
  }

  return (
    <PublicDossierClient
      slug={slug}
      authorHandle={authorHandle}
      revoked={revoked}
      payload={payload}
    />
  );
}
