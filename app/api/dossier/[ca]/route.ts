import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import {
  dossiers,
  dossierItems,
  dossierQuestions,
  dossierLog,
  snapshots,
  DOSSIER_STATUSES,
  DOSSIER_ITEM_KINDS,
  type Dossier,
  type DossierItem,
  type DossierQuestion,
  type DossierLog,
  type Snapshot,
} from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";
import type {
  GetDossierResponseBody,
  PutDossierRequestBody,
  PutDossierResponseBody,
  DeleteDossierResponseBody,
} from "@/types/dossier";

const contractAddressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid contract address format");

const putDossierSchema = z.object({
  status: z.enum(DOSSIER_STATUSES).nullable().optional(),
  reason: z.string().max(4000, "Reason must not exceed 4000 characters").nullable().optional(),
  thesis: z.string().max(4000, "Thesis must not exceed 4000 characters").nullable().optional(),
  decision_reason: z
    .string()
    .max(4000, "Decision reason must not exceed 4000 characters")
    .nullable()
    .optional(),
  notes: z.string().max(20000, "Notes must not exceed 20000 characters").nullable().optional(),
  items: z
    .array(
      z.object({
        kind: z.enum(DOSSIER_ITEM_KINDS),
        text: z.string().min(1).max(500, "Item text must not exceed 500 characters"),
        position: z.number().int().nonnegative().optional().default(0),
      })
    )
    .max(50, "Items list must not exceed 50 entries")
    .optional(),
  questions: z
    .array(
      z.object({
        text: z.string().min(1).max(500, "Question text must not exceed 500 characters"),
        done: z.boolean().optional().default(false),
        position: z.number().int().nonnegative().optional().default(0),
      })
    )
    .max(50, "Questions list must not exceed 50 entries")
    .optional(),
});

export async function handleGetDossier(
  ca: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<GetDossierResponseBody>> {
  try {
    const parseResult = contractAddressSchema.safeParse(ca);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid contract address format",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validatedCa = parseResult.data.toLowerCase();

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

    let targetDossier: Dossier | null = null;

    if (activeDb.query?.dossiers?.findFirst) {
      targetDossier =
        (await activeDb.query.dossiers.findFirst({
          where: (dossierTable, { eq: eqOp, and: andOp }) =>
            andOp(
              eqOp(dossierTable.walletAddress, walletAddress),
              eqOp(dossierTable.contractAddress, validatedCa)
            ),
        })) ?? null;
    }

    if (!targetDossier && activeDb.select) {
      const records = await activeDb
        .select()
        .from(dossiers)
        .where(
          and(
            eq(dossiers.walletAddress, walletAddress),
            eq(dossiers.contractAddress, validatedCa)
          )
        );
      targetDossier = records[0] ?? null;
    }

    if (!targetDossier) {
      return NextResponse.json(
        { ok: false, error: "Dossier not found" },
        { status: 404 }
      );
    }

    let items: DossierItem[] = [];
    if (activeDb.query?.dossierItems?.findMany) {
      items =
        (await activeDb.query.dossierItems.findMany({
          where: (item, { eq: eqClause }) =>
            eqClause(item.dossierId, targetDossier.id),
        })) ?? [];
    } else if (activeDb.select) {
      items = await activeDb
        .select()
        .from(dossierItems)
        .where(eq(dossierItems.dossierId, targetDossier.id));
    }

    let questions: DossierQuestion[] = [];
    if (activeDb.query?.dossierQuestions?.findMany) {
      questions =
        (await activeDb.query.dossierQuestions.findMany({
          where: (q, { eq: eqClause }) =>
            eqClause(q.dossierId, targetDossier.id),
        })) ?? [];
    } else if (activeDb.select) {
      questions = await activeDb
        .select()
        .from(dossierQuestions)
        .where(eq(dossierQuestions.dossierId, targetDossier.id));
    }

    let logs: DossierLog[] = [];
    if (activeDb.query?.dossierLog?.findMany) {
      logs =
        (await activeDb.query.dossierLog.findMany({
          where: (log, { eq: eqClause }) =>
            eqClause(log.dossierId, targetDossier.id),
        })) ?? [];
    } else if (activeDb.select) {
      logs = await activeDb
        .select()
        .from(dossierLog)
        .where(eq(dossierLog.dossierId, targetDossier.id))
        .orderBy(desc(dossierLog.at))
        .limit(200);
    }

    let snapshotList: Snapshot[] = [];
    if (activeDb.query?.snapshots?.findMany) {
      snapshotList =
        (await activeDb.query.snapshots.findMany({
          where: (s, { eq: eqClause }) =>
            eqClause(s.dossierId, targetDossier.id),
        })) ?? [];
    } else if (activeDb.select) {
      snapshotList = await activeDb
        .select()
        .from(snapshots)
        .where(eq(snapshots.dossierId, targetDossier.id))
        .orderBy(desc(snapshots.at))
        .limit(30);
    }

    const latestSnapshot = snapshotList[0] ?? null;
    const chainPayload =
      latestSnapshot?.chainJson && typeof latestSnapshot.chainJson === "object"
        ? (latestSnapshot.chainJson as Record<string, unknown>)
        : null;
    const marketPayload =
      latestSnapshot?.marketJson && typeof latestSnapshot.marketJson === "object"
        ? (latestSnapshot.marketJson as Record<string, unknown>)
        : null;

    return NextResponse.json({
      ok: true,
      dossier: {
        id: targetDossier.id,
        walletAddress: targetDossier.walletAddress,
        chainId: targetDossier.chainId,
        contractAddress: targetDossier.contractAddress,
        symbol: targetDossier.symbol,
        name: targetDossier.name,
        status: targetDossier.status,
        reason: targetDossier.reason,
        thesis: targetDossier.thesis,
        notes: targetDossier.notes,
        decisionReason: targetDossier.decisionReason,
        createdAt: targetDossier.createdAt,
        updatedAt: targetDossier.updatedAt,
        originAuthor: targetDossier.originAuthor,
        originAt: targetDossier.originAt,
        items,
        questions,
        logs,
        snapshots: snapshotList,
      },
      chain: {
        phase: (chainPayload?.phase as string) ?? "curve",
        symbol: targetDossier.symbol,
        name: targetDossier.name,
      },
      market: marketPayload,
      research: {
        thesis: targetDossier.thesis,
        reason: targetDossier.reason,
        notes: targetDossier.notes,
        items,
        questions,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function handlePutDossier(
  ca: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<PutDossierResponseBody>> {
  try {
    const parseResult = contractAddressSchema.safeParse(ca);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid contract address format",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validatedCa = parseResult.data.toLowerCase();

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

    let bodyData: unknown;
    try {
      bodyData = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const bodyParseResult = putDossierSchema.safeParse(bodyData);
    if (!bodyParseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid request payload",
          details: bodyParseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const payload: PutDossierRequestBody = bodyParseResult.data;
    const activeDb = customDb ?? db;
    const chainId = 4663;

    type DbExecutor = {
      insert: Database["insert"];
      delete: Database["delete"];
      select: Database["select"];
    };

    const executeOperation = async (executor: DbExecutor) => {
      let dossierRecordId: string | null = null;

      const upsertResult = await executor
        .insert(dossiers)
        .values({
          walletAddress,
          chainId,
          contractAddress: validatedCa,
          status: payload.status ?? null,
          reason: payload.reason ?? null,
          thesis: payload.thesis ?? null,
          notes: payload.notes ?? null,
          decisionReason: payload.decision_reason ?? null,
        })
        .onConflictDoUpdate({
          target: [dossiers.walletAddress, dossiers.chainId, dossiers.contractAddress],
          set: {
            ...(payload.status !== undefined ? { status: payload.status } : {}),
            ...(payload.reason !== undefined ? { reason: payload.reason } : {}),
            ...(payload.thesis !== undefined ? { thesis: payload.thesis } : {}),
            ...(payload.decision_reason !== undefined
              ? { decisionReason: payload.decision_reason }
              : {}),
            ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
            updatedAt: new Date(),
          },
        })
        .returning({ id: dossiers.id });

      dossierRecordId = upsertResult?.[0]?.id ?? null;

      if (!dossierRecordId) {
        const found = await executor
          .select({ id: dossiers.id })
          .from(dossiers)
          .where(
            and(
              eq(dossiers.walletAddress, walletAddress),
              eq(dossiers.contractAddress, validatedCa)
            )
          );
        dossierRecordId = found[0]?.id ?? null;
      }

      if (dossierRecordId) {
        if (payload.items !== undefined) {
          await executor
            .delete(dossierItems)
            .where(eq(dossierItems.dossierId, dossierRecordId));

          if (payload.items.length > 0) {
            await executor.insert(dossierItems).values(
              payload.items.map((item, index) => ({
                dossierId: dossierRecordId as string,
                kind: item.kind,
                text: item.text,
                position: item.position ?? index,
              }))
            );
          }
        }

        if (payload.questions !== undefined) {
          await executor
            .delete(dossierQuestions)
            .where(eq(dossierQuestions.dossierId, dossierRecordId));

          if (payload.questions.length > 0) {
            await executor.insert(dossierQuestions).values(
              payload.questions.map((q, index) => ({
                dossierId: dossierRecordId as string,
                text: q.text,
                done: q.done ?? false,
                position: q.position ?? index,
              }))
            );
          }
        }

        await executor.insert(dossierLog).values({
          dossierId: dossierRecordId,
          text: "Updated research dossier via auto-save",
        });
      }
    };

    if (activeDb.transaction) {
      await activeDb.transaction(async (tx) => {
        await executeOperation(tx);
      });
    } else {
      await executeOperation(activeDb);
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function handleDeleteDossier(
  ca: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<DeleteDossierResponseBody>> {
  try {
    const parseResult = contractAddressSchema.safeParse(ca);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid contract address format",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validatedCa = parseResult.data.toLowerCase();

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

    let targetDossier: Dossier | null = null;

    if (activeDb.query?.dossiers?.findFirst) {
      targetDossier =
        (await activeDb.query.dossiers.findFirst({
          where: (dossierTable, { eq: eqOp, and: andOp }) =>
            andOp(
              eqOp(dossierTable.walletAddress, walletAddress),
              eqOp(dossierTable.contractAddress, validatedCa)
            ),
        })) ?? null;
    }

    if (!targetDossier && activeDb.select) {
      const records = await activeDb
        .select()
        .from(dossiers)
        .where(
          and(
            eq(dossiers.walletAddress, walletAddress),
            eq(dossiers.contractAddress, validatedCa)
          )
        );
      targetDossier = records[0] ?? null;
    }

    if (!targetDossier) {
      return NextResponse.json(
        { ok: false, error: "Dossier not found" },
        { status: 404 }
      );
    }

    if (activeDb.delete) {
      await activeDb
        .delete(dossiers)
        .where(
          and(
            eq(dossiers.walletAddress, walletAddress),
            eq(dossiers.contractAddress, validatedCa)
          )
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ ca: string }> | { ca: string } }
): Promise<NextResponse<GetDossierResponseBody>> {
  const resolvedParams = await Promise.resolve(context?.params);
  return handleGetDossier(resolvedParams?.ca, req);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ ca: string }> | { ca: string } }
): Promise<NextResponse<PutDossierResponseBody>> {
  const resolvedParams = await Promise.resolve(context?.params);
  return handlePutDossier(resolvedParams?.ca, req);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ ca: string }> | { ca: string } }
): Promise<NextResponse<DeleteDossierResponseBody>> {
  const resolvedParams = await Promise.resolve(context?.params);
  return handleDeleteDossier(resolvedParams?.ca, req);
}
