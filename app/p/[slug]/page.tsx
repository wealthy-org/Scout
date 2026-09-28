import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  }

  return {
    title: "Public Case File Dossier | Scout",
    description: "Public on-chain research case file snapshot on Scout Dossier.OS",
  };
}

export default async function PublicDossierPage({ params }: PageProps) {
  const { slug } = await params;

  if (!db) {
    notFound();
  }

  let item;
  try {
    const records = await db
      .select()
      .from(publishedDossiers)
      .where(eq(publishedDossiers.slug, slug));

    if (!records || records.length === 0) {
      notFound();
    }
    item = records[0];
  } catch {
    notFound();
  }

  const authorHandle = item.authorHandle;
  const revoked = item.revokedAt !== null;
  const payload = item.payloadJson as PublicDossierPayload;

  return (
    <PublicDossierClient
      slug={slug}
      authorHandle={authorHandle}
      revoked={revoked}
      payload={payload}
    />
  );
}
