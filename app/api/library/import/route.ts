import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import {
  dossiers,
  dossierItems,
  dossierQuestions,
  dossierLog,
  DOSSIER_STATUSES,
  DOSSIER_ITEM_KINDS,
  type Dossier,
} from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";
import type { ImportLibraryResponseBody } from "@/types/dossier";

const singleImportItemSchema = z.object({
  contractAddress: z.string().optional(),
  contract_address: z.string().optional(),
  chainId: z.number().int().positive().optional(),
  chain_id: z.number().int().positive().optional(),
  symbol: z.string().max(50).nullable().optional(),
  name: z.string().max(100).nullable().optional(),
  status: z.enum(DOSSIER_STATUSES).nullable().optional(),
  reason: z.string().max(4000).nullable().optional(),
  thesis: z.string().max(4000).nullable().optional(),
  decisionReason: z.string().max(4000).nullable().optional(),
  decision_reason: z.string().max(4000).nullable().optional(),
  notes: z.string().max(20000).nullable().optional(),
  items: z
    .array(
      z.object({
        kind: z.enum(DOSSIER_ITEM_KINDS),
        text: z.string().min(1).max(500),
        position: z.number().int().nonnegative().optional().default(0),
      })
    )
    .max(50)
    .optional(),
  questions: z
    .array(
      z.object({
        text: z.string().min(1).max(500),
        done: z.boolean().optional().default(false),
        position: z.number().int().nonnegative().optional().default(0),
      })
    )
    .max(50)
    .optional(),
});

const importPayloadSchema = z.union([
  z.array(singleImportItemSchema).max(500),
  z.object({
    dossiers: z.array(singleImportItemSchema).max(500),
  }),
]);

const addressRegex = /^0x[0-9a-fA-F]{40}$/;

export async function handlePostLibraryImport(
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<ImportLibraryResponseBody>> {
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

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parseResult = importPayloadSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid import payload structure",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const itemsToProcess = Array.isArray(parseResult.data)
      ? parseResult.data
      : parseResult.data.dossiers;

    const activeDb = customDb ?? db;
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let index = 0; index < itemsToProcess.length; index++) {
      const item = itemsToProcess[index];
      const rawCa = item.contractAddress || item.contract_address;

      if (!rawCa || !addressRegex.test(rawCa)) {
        errors.push(`Item at index ${index} has invalid contract address`);
        continue;
      }

      const validatedCa = rawCa.toLowerCase();
      const chainId = item.chainId || item.chain_id || 4663;

      let existing: Dossier | null = null;
      if (activeDb.query?.dossiers?.findFirst) {
        existing =
          (await activeDb.query.dossiers.findFirst({
            where: (table, { eq: eqClause, and: andClause }) =>
              andClause(
                eqClause(table.walletAddress, walletAddress),
                eqClause(table.chainId, chainId),
                eqClause(table.contractAddress, validatedCa)
              ),
          })) ?? null;
      } else if (activeDb.select) {
        const records = await activeDb
          .select()
          .from(dossiers)
          .where(
            and(
              eq(dossiers.walletAddress, walletAddress),
              eq(dossiers.chainId, chainId),
              eq(dossiers.contractAddress, validatedCa)
            )
          );
        existing = records[0] ?? null;
      }

      if (existing) {
        skipped++;
        continue;
      }

      const decisionReason = item.decisionReason || item.decision_reason || null;

      if (activeDb.insert) {
        const insertResult = await activeDb
          .insert(dossiers)
          .values({
            walletAddress,
            chainId,
            contractAddress: validatedCa,
            symbol: item.symbol ?? null,
            name: item.name ?? null,
            status: item.status ?? null,
            reason: item.reason ?? null,
            thesis: item.thesis ?? null,
            notes: item.notes ?? null,
            decisionReason,
          })
          .returning({ id: dossiers.id });

        const newDossierId = insertResult?.[0]?.id;

        if (newDossierId) {
          if (item.items && item.items.length > 0) {
            await activeDb.insert(dossierItems).values(
              item.items.map((subItem, itemIdx) => ({
                dossierId: newDossierId,
                kind: subItem.kind,
                text: subItem.text,
                position: subItem.position ?? itemIdx,
              }))
            );
          }

          if (item.questions && item.questions.length > 0) {
            await activeDb.insert(dossierQuestions).values(
              item.questions.map((q, qIdx) => ({
                dossierId: newDossierId,
                text: q.text,
                done: q.done ?? false,
                position: q.position ?? qIdx,
              }))
            );
          }

          await activeDb.insert(dossierLog).values({
            dossierId: newDossierId,
            text: "Imported dossier into library",
          });
        }
      }

      imported++;
    }

    return NextResponse.json({
      ok: true,
      imported,
      skipped,
      errors,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(
  req: Request
): Promise<NextResponse<ImportLibraryResponseBody>> {
  return handlePostLibraryImport(req);
}
