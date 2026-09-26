import { NextResponse } from "next/server";
import { eq, inArray, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import {
  dossiers,
  dossierItems,
  dossierQuestions,
  type Dossier,
  type DossierItem,
  type DossierQuestion,
} from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";

export async function handleGetLibraryExport(
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse> {
  try {
    let walletAddress = authenticatedWallet?.toLowerCase();
    if (!walletAddress) {
      try {
        const session = await getSession(customCookies);
        if (session.wallet_address) {
          walletAddress = session.wallet_address.toLowerCase();
        }
      } catch {
        return NextResponse.json(
          { ok: false, error: "Unauthorized: Wallet session required" },
          { status: 401 }
        );
      }
    }

    if (!walletAddress) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: Wallet session required" },
        { status: 401 }
      );
    }

    const activeDb = customDb ?? db;

    let userDossiers: Dossier[] = [];
    if (activeDb.query?.dossiers?.findMany) {
      userDossiers =
        (await activeDb.query.dossiers.findMany({
          where: (table, { eq: eqClause }) =>
            eqClause(table.walletAddress, walletAddress),
          orderBy: (table, { asc: ascOrder }) => [ascOrder(table.createdAt)],
        })) ?? [];
    } else if (activeDb.select) {
      userDossiers = await activeDb
        .select()
        .from(dossiers)
        .where(eq(dossiers.walletAddress, walletAddress))
        .orderBy(asc(dossiers.createdAt));
    }

    const dossierIds = userDossiers.map((d) => d.id);

    let allItems: DossierItem[] = [];
    let allQuestions: DossierQuestion[] = [];

    if (dossierIds.length > 0) {
      if (activeDb.query?.dossierItems?.findMany) {
        allItems =
          (await activeDb.query.dossierItems.findMany({
            where: (table, { inArray: inClause }) =>
              inClause(table.dossierId, dossierIds),
            orderBy: (table, { asc: ascOrder }) => [ascOrder(table.position)],
          })) ?? [];
      } else if (activeDb.select) {
        allItems = await activeDb
          .select()
          .from(dossierItems)
          .where(inArray(dossierItems.dossierId, dossierIds))
          .orderBy(asc(dossierItems.position));
      }

      if (activeDb.query?.dossierQuestions?.findMany) {
        allQuestions =
          (await activeDb.query.dossierQuestions.findMany({
            where: (table, { inArray: inClause }) =>
              inClause(table.dossierId, dossierIds),
            orderBy: (table, { asc: ascOrder }) => [ascOrder(table.position)],
          })) ?? [];
      } else if (activeDb.select) {
        allQuestions = await activeDb
          .select()
          .from(dossierQuestions)
          .where(inArray(dossierQuestions.dossierId, dossierIds))
          .orderBy(asc(dossierQuestions.position));
      }
    }

    const itemsByDossierId = new Map<string, typeof allItems>();
    for (const item of allItems) {
      const list = itemsByDossierId.get(item.dossierId) ?? [];
      list.push(item);
      itemsByDossierId.set(item.dossierId, list);
    }

    const questionsByDossierId = new Map<string, typeof allQuestions>();
    for (const q of allQuestions) {
      const list = questionsByDossierId.get(q.dossierId) ?? [];
      list.push(q);
      questionsByDossierId.set(q.dossierId, list);
    }

    const exportPayload = userDossiers.map((d) => ({
      contractAddress: d.contractAddress,
      chainId: d.chainId,
      symbol: d.symbol,
      name: d.name,
      status: d.status,
      reason: d.reason,
      thesis: d.thesis,
      decisionReason: d.decisionReason,
      notes: d.notes,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      items: (itemsByDossierId.get(d.id) ?? []).map((i) => ({
        kind: i.kind,
        text: i.text,
        position: i.position,
      })),
      questions: (questionsByDossierId.get(d.id) ?? []).map((q) => ({
        text: q.text,
        done: q.done,
        position: q.position,
      })),
    }));

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="scout-library-export.json"',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  return handleGetLibraryExport(req);
}
