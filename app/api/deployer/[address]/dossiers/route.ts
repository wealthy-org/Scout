import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, inArray, and, desc, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import {
  dossiers,
  dossierQuestions,
  deployerLaunches,
  type Dossier,
  type DossierQuestion,
} from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";
import type {
  GetDeployerDossiersResponseBody,
  ConnectedDossierSummary,
} from "@/types/dossier";

const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format");

export async function handleGetDeployerDossiers(
  address: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<GetDeployerDossiersResponseBody>> {
  try {
    const parseResult = addressSchema.safeParse(address);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid address format",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validatedAddress = parseResult.data.toLowerCase();

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

    let launches: { tokenAddress: string }[] = [];
    if (activeDb.query?.deployerLaunches?.findMany) {
      launches =
        (await activeDb.query.deployerLaunches.findMany({
          where: (table, { eq: eqClause }) =>
            eqClause(table.deployerAddress, validatedAddress),
        })) ?? [];
    } else if (activeDb.select) {
      launches = await activeDb
        .select({ tokenAddress: deployerLaunches.tokenAddress })
        .from(deployerLaunches)
        .where(eq(deployerLaunches.deployerAddress, validatedAddress));
    }

    const tokenAddresses = launches.map((l) => l.tokenAddress.toLowerCase());

    if (tokenAddresses.length === 0) {
      return NextResponse.json({ ok: true, dossiers: [] });
    }

    let userDossiers: Dossier[] = [];
    if (activeDb.query?.dossiers?.findMany) {
      userDossiers =
        (await activeDb.query.dossiers.findMany({
          where: (table, { eq: eqClause, and: andClause, inArray: inClause }) =>
            andClause(
              eqClause(table.walletAddress, walletAddress),
              inClause(table.contractAddress, tokenAddresses)
            ),
          orderBy: (table, { desc: descOrder }) => [descOrder(table.createdAt)],
        })) ?? [];
    } else if (activeDb.select) {
      userDossiers = await activeDb
        .select()
        .from(dossiers)
        .where(
          and(
            eq(dossiers.walletAddress, walletAddress),
            inArray(dossiers.contractAddress, tokenAddresses)
          )
        )
        .orderBy(desc(dossiers.createdAt));
    }

    if (userDossiers.length === 0) {
      return NextResponse.json({ ok: true, dossiers: [] });
    }

    const dossierIds = userDossiers.map((d) => d.id);
    let questionsList: DossierQuestion[] = [];
    if (activeDb.query?.dossierQuestions?.findMany) {
      questionsList =
        (await activeDb.query.dossierQuestions.findMany({
          where: (table, { inArray: inClause }) =>
            inClause(table.dossierId, dossierIds),
          orderBy: (table, { asc: ascOrder }) => [ascOrder(table.position)],
        })) ?? [];
    } else if (activeDb.select) {
      questionsList = await activeDb
        .select()
        .from(dossierQuestions)
        .where(inArray(dossierQuestions.dossierId, dossierIds))
        .orderBy(asc(dossierQuestions.position));
    }

    const firstQuestionByDossierId = new Map<string, string>();
    for (const q of questionsList) {
      if (!firstQuestionByDossierId.has(q.dossierId)) {
        firstQuestionByDossierId.set(q.dossierId, q.text);
      }
    }

    const mappedDossiers: ConnectedDossierSummary[] = userDossiers.map((d) => ({
      id: d.id,
      contractAddress: d.contractAddress,
      symbol: d.symbol,
      name: d.name,
      status: d.status,
      reason: d.reason,
      decisionReason: d.decisionReason,
      thesis: d.thesis,
      firstQuestion: firstQuestionByDossierId.get(d.id) ?? null,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));

    return NextResponse.json({ ok: true, dossiers: mappedDossiers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ address: string }> | { address: string } }
): Promise<NextResponse<GetDeployerDossiersResponseBody>> {
  const resolvedParams = await Promise.resolve(context?.params);
  return handleGetDeployerDossiers(resolvedParams?.address, req);
}
