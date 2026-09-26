import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, type Database } from "@/lib/db";
import { censusStats } from "@/lib/db/schema";
import { computeCensusStats, type CensusPayload } from "@/lib/census/compute";

export interface GetCensusResponseBody {
  ok: boolean;
  stats: CensusPayload;
  error?: string;
}

export async function handleGetCensus(
  customDb: Database | null = db
): Promise<NextResponse<GetCensusResponseBody>> {
  try {
    if (customDb) {
      const records = await customDb
        .select()
        .from(censusStats)
        .orderBy(desc(censusStats.computedAt))
        .limit(1);

      if (records && records.length > 0 && records[0].payloadJson) {
        return NextResponse.json(
          {
            ok: true,
            stats: records[0].payloadJson as unknown as CensusPayload,
          },
          { status: 200 }
        );
      }
    }

    const fallbackStats = await computeCensusStats(customDb);
    return NextResponse.json(
      {
        ok: true,
        stats: fallbackStats,
      },
      { status: 200 }
    );
  } catch {
    const fallbackStats = await computeCensusStats(null);
    return NextResponse.json(
      {
        ok: true,
        stats: fallbackStats,
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return handleGetCensus();
}
