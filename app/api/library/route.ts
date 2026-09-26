import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import {
  dossiers,
  DOSSIER_STATUSES,
  type Dossier,
  type DossierStatus,
} from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";
import type { GetLibraryResponseBody, LibraryDossierSummary } from "@/types/dossier";

const querySchema = z.object({
  status: z.enum(DOSSIER_STATUSES).optional(),
  chain_id: z.coerce.number().int().positive().optional(),
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function handleGetLibrary(
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse<GetLibraryResponseBody>> {
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

    const url = new URL(req.url, "http://localhost:3000");
    const rawParams = {
      status: url.searchParams.get("status") || undefined,
      chain_id: url.searchParams.get("chain_id") || undefined,
      search: url.searchParams.get("search") || undefined,
      limit: url.searchParams.get("limit") || undefined,
      offset: url.searchParams.get("offset") || undefined,
    };

    const parsedQuery = querySchema.safeParse(rawParams);
    if (!parsedQuery.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid query parameters",
          details: parsedQuery.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { status, chain_id: chainId, search, limit, offset } = parsedQuery.data;
    const activeDb = customDb ?? db;

    let userDossiers: Dossier[] = [];
    let totalCount = 0;

    if (activeDb.query?.dossiers?.findMany) {
      const allDossiers =
        (await activeDb.query.dossiers.findMany({
          where: (table, { eq: eqClause, and: andClause }) => {
            const clauses = [eqClause(table.walletAddress, walletAddress)];
            if (status) {
              clauses.push(eqClause(table.status, status as DossierStatus));
            }
            if (chainId) {
              clauses.push(eqClause(table.chainId, chainId));
            }
            return andClause(...clauses);
          },
          orderBy: (table, { desc: descOrder }) => [descOrder(table.updatedAt)],
        })) ?? [];

      let filtered = allDossiers;
      if (search && search.trim().length > 0) {
        const q = search.trim().toLowerCase();
        filtered = allDossiers.filter(
          (d) =>
            d.symbol?.toLowerCase().includes(q) ||
            d.name?.toLowerCase().includes(q) ||
            d.contractAddress.toLowerCase().includes(q)
        );
      }

      totalCount = filtered.length;
      userDossiers = filtered.slice(offset, offset + limit);
    } else if (activeDb.select) {
      const conditions = [eq(dossiers.walletAddress, walletAddress)];
      if (status) {
        conditions.push(eq(dossiers.status, status as DossierStatus));
      }
      if (chainId) {
        conditions.push(eq(dossiers.chainId, chainId));
      }
      if (search && search.trim().length > 0) {
        const pattern = `%${search.trim()}%`;
        conditions.push(
          or(
            ilike(dossiers.symbol, pattern),
            ilike(dossiers.name, pattern),
            ilike(dossiers.contractAddress, pattern)
          )!
        );
      }

      const totalResult = await activeDb
        .select({ count: sql<number>`count(*)::int` })
        .from(dossiers)
        .where(and(...conditions));
      totalCount = Number(totalResult?.[0]?.count ?? 0);

      userDossiers = await activeDb
        .select()
        .from(dossiers)
        .where(and(...conditions))
        .orderBy(desc(dossiers.updatedAt))
        .limit(limit)
        .offset(offset);
    }

    const mappedDossiers: LibraryDossierSummary[] = userDossiers.map((d) => ({
      id: d.id,
      walletAddress: d.walletAddress,
      chainId: d.chainId,
      contractAddress: d.contractAddress,
      symbol: d.symbol,
      name: d.name,
      status: d.status,
      reason: d.reason,
      thesis: d.thesis,
      decisionReason: d.decisionReason,
      notes: d.notes,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      originAuthor: d.originAuthor,
      originAt: d.originAt,
    }));

    return NextResponse.json({
      ok: true,
      dossiers: mappedDossiers,
      total: totalCount,
      limit,
      offset,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: Request): Promise<NextResponse<GetLibraryResponseBody>> {
  return handleGetLibrary(req);
}
