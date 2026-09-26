import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, asc, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db, type Database } from "@/lib/db";
import {
  dossiers,
  dossierItems,
  dossierQuestions,
  snapshots,
  type Dossier,
  type DossierItem,
  type DossierQuestion,
  type Snapshot,
} from "@/lib/db/schema";
import type { CookieStoreLike } from "@/types/auth";

const contractAddressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid contract address format");

export function generateMarkdownDossier(
  dossier: Dossier,
  items: DossierItem[] = [],
  questions: DossierQuestion[] = [],
  latestSnapshot?: Snapshot | null
): string {
  const pros = items.filter((i) => i.kind === "pro");
  const cons = items.filter((i) => i.kind === "con");
  const checked = items.filter((i) => i.kind === "checked");
  const sources = items.filter((i) => i.kind === "source");

  const lines: string[] = [
    "---",
    `symbol: "${dossier.symbol ?? ""}"`,
    `name: "${dossier.name ?? ""}"`,
    `chain_id: ${dossier.chainId}`,
    `contract_address: "${dossier.contractAddress}"`,
    `status: "${dossier.status ?? ""}"`,
    `decision_reason: "${dossier.decisionReason ?? ""}"`,
    `updated_at: "${new Date(dossier.updatedAt).toISOString()}"`,
    "---",
    "",
    `# ${dossier.name ?? dossier.symbol ?? "Token Dossier"} (${dossier.symbol ?? ""})`,
    "",
    "## Research Thesis",
    dossier.thesis?.trim() ? dossier.thesis : "_No thesis provided._",
    "",
    "## Decision Reason",
    dossier.decisionReason?.trim()
      ? dossier.decisionReason
      : "_No decision reason provided._",
    "",
    "## Arguments For (Pros)",
    pros.length > 0
      ? pros.map((p) => `- ${p.text}`).join("\n")
      : "_None recorded._",
    "",
    "## Arguments Against (Cons)",
    cons.length > 0
      ? cons.map((c) => `- ${c.text}`).join("\n")
      : "_None recorded._",
    "",
    "## Checked Points",
    checked.length > 0
      ? checked.map((k) => `- [x] ${k.text}`).join("\n")
      : "_None recorded._",
    "",
    "## Sources",
    sources.length > 0
      ? sources.map((s) => `- ${s.text}`).join("\n")
      : "_None recorded._",
    "",
    "## Open Questions",
    questions.length > 0
      ? questions
          .map((q) => `- [${q.done ? "x" : " "}] ${q.text}`)
          .join("\n")
      : "_No questions recorded._",
    "",
    "## Notes",
    dossier.notes?.trim() ? dossier.notes : "_No additional notes._",
  ];

  if (latestSnapshot?.marketJson && typeof latestSnapshot.marketJson === "object") {
    lines.push(
      "",
      "## Latest Market Snapshot",
      "```json",
      JSON.stringify(latestSnapshot.marketJson, null, 2),
      "```"
    );
  }

  return lines.join("\n") + "\n";
}

export async function handleGetDossierMarkdown(
  ca: string,
  req: Request,
  customCookies?: CookieStoreLike,
  customDb: Database | null = db,
  authenticatedWallet?: string
): Promise<NextResponse> {
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
          where: (table, { eq: eqClause, and: andClause }) =>
            andClause(
              eqClause(table.walletAddress, walletAddress),
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
          where: (table, { eq: eqClause }) =>
            eqClause(table.dossierId, targetDossier.id),
          orderBy: (table, { asc: ascOrder }) => [ascOrder(table.position)],
        })) ?? [];
    } else if (activeDb.select) {
      items = await activeDb
        .select()
        .from(dossierItems)
        .where(eq(dossierItems.dossierId, targetDossier.id))
        .orderBy(asc(dossierItems.position));
    }

    let questions: DossierQuestion[] = [];
    if (activeDb.query?.dossierQuestions?.findMany) {
      questions =
        (await activeDb.query.dossierQuestions.findMany({
          where: (table, { eq: eqClause }) =>
            eqClause(table.dossierId, targetDossier.id),
          orderBy: (table, { asc: ascOrder }) => [ascOrder(table.position)],
        })) ?? [];
    } else if (activeDb.select) {
      questions = await activeDb
        .select()
        .from(dossierQuestions)
        .where(eq(dossierQuestions.dossierId, targetDossier.id))
        .orderBy(asc(dossierQuestions.position));
    }

    let snapshotList: Snapshot[] = [];
    if (activeDb.query?.snapshots?.findMany) {
      snapshotList =
        (await activeDb.query.snapshots.findMany({
          where: (table, { eq: eqClause }) =>
            eqClause(table.dossierId, targetDossier.id),
          orderBy: (table, { desc: descOrder }) => [descOrder(table.at)],
          limit: 1,
        })) ?? [];
    } else if (activeDb.select) {
      snapshotList = await activeDb
        .select()
        .from(snapshots)
        .where(eq(snapshots.dossierId, targetDossier.id))
        .orderBy(desc(snapshots.at))
        .limit(1);
    }

    const markdown = generateMarkdownDossier(
      targetDossier,
      items,
      questions,
      snapshotList[0] ?? null
    );

    const filename = `dossier-${targetDossier.symbol ? targetDossier.symbol.toLowerCase() : validatedCa.slice(0, 10)}.md`;

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ ca: string }> | { ca: string } }
): Promise<NextResponse> {
  const resolvedParams = await Promise.resolve(context?.params);
  return handleGetDossierMarkdown(resolvedParams?.ca, req);
}
