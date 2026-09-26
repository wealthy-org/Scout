import { NextResponse } from "next/server";
import { db, type Database } from "@/lib/db";
import { computeCensusStats, saveCensusSnapshot } from "@/lib/census/compute";

export interface CronCensusResponseBody {
  ok: boolean;
  computed_at?: string;
  total_launches?: number;
  error?: string;
}

export async function handleCronCensus(
  req: Request,
  customDb: Database | null = db,
  expectedSecret?: string
): Promise<NextResponse<CronCensusResponseBody>> {
  try {
    const cronSecret =
      expectedSecret ?? process.env.CRON_SECRET ?? "development_cron_secret";

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token || token !== cronSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized: Invalid cron secret",
        },
        { status: 401 }
      );
    }

    const stats = await computeCensusStats(customDb);
    await saveCensusSnapshot(stats, customDb);

    return NextResponse.json(
      {
        ok: true,
        computed_at: stats.computed_at,
        total_launches: stats.total_launches,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error computing census cron",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return handleCronCensus(req);
}
