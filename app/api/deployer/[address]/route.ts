import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, type Database } from "@/lib/db";
import {
  deployerScores,
  deployerLaunches,
  type DeployerScore,
  type DeployerLaunch,
} from "@/lib/db/schema";
import { calculateScore } from "@/lib/score/calculate";
import { checkRateLimit } from "@/lib/security/ratelimit";
import type {
  GetDeployerResponseBody,
  DeployerProfileData,
  DeployerScoreSignals,
} from "@/types/score";

const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid address format");

const CACHE_TTL_MS = 60 * 60 * 1000;

export async function handleGetDeployer(
  address: string,
  req: Request,
  customDb: Database | null = db
): Promise<NextResponse<GetDeployerResponseBody>> {
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

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "127.0.0.1";

    const rateResult = checkRateLimit(clientIp, 30, 60000);
    if (rateResult.limited) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateResult.retryAfter),
          },
        }
      );
    }

    const activeDb = customDb ?? db;

    let scoreRecord: DeployerScore | null = null;
    if (activeDb.query?.deployerScores?.findFirst) {
      scoreRecord =
        (await activeDb.query.deployerScores.findFirst({
          where: (table, { eq: eqClause }) =>
            eqClause(table.deployerAddress, validatedAddress),
        })) ?? null;
    } else if (activeDb.select) {
      const records = await activeDb
        .select()
        .from(deployerScores)
        .where(eq(deployerScores.deployerAddress, validatedAddress));
      scoreRecord = records[0] ?? null;
    }

    let launches: DeployerLaunch[] = [];
    if (activeDb.query?.deployerLaunches?.findMany) {
      launches =
        (await activeDb.query.deployerLaunches.findMany({
          where: (table, { eq: eqClause }) =>
            eqClause(table.deployerAddress, validatedAddress),
        })) ?? [];
    } else if (activeDb.select) {
      launches = await activeDb
        .select()
        .from(deployerLaunches)
        .where(eq(deployerLaunches.deployerAddress, validatedAddress));
    }

    const isFresh =
      scoreRecord &&
      Date.now() - new Date(scoreRecord.updatedAt).getTime() < CACHE_TTL_MS;

    if (isFresh && scoreRecord) {
      const signals: DeployerScoreSignals = {
        grad_rate:
          (scoreRecord.graduatedCount + 1) / (scoreRecord.totalLaunches + 2),
        doa_rate:
          scoreRecord.deadOnArrivalCount /
          Math.max(scoreRecord.totalLaunches, 1),
        burst_rate:
          scoreRecord.burstLaunches / Math.max(scoreRecord.totalLaunches, 1),
        total_launches: scoreRecord.totalLaunches,
        graduated_count: scoreRecord.graduatedCount,
      };

      const deployerProfile: DeployerProfileData = {
        deployerAddress: scoreRecord.deployerAddress,
        totalLaunches: scoreRecord.totalLaunches,
        graduatedCount: scoreRecord.graduatedCount,
        deadOnArrivalCount: scoreRecord.deadOnArrivalCount,
        burstLaunches: scoreRecord.burstLaunches,
        feeRecipientReuse: scoreRecord.feeRecipientReuse,
        score: scoreRecord.score,
        label: scoreRecord.label,
        band: scoreRecord.band,
        updatedAt: scoreRecord.updatedAt,
      };

      return NextResponse.json({
        ok: true,
        deployer: deployerProfile,
        signals,
        launches: launches.map((l) => ({
          tokenAddress: l.tokenAddress,
          block: l.block,
          phase: l.phase,
        })),
      });
    }

    const launchInputs = launches.map((l) => ({
      token: l.tokenAddress,
      graduated: l.phase === "graduated",
      isDoa: false,
      isBurst: false,
    }));

    const calcResult = calculateScore(launchInputs);
    const now = new Date();

    const newProfile: DeployerScore = {
      deployerAddress: validatedAddress,
      totalLaunches: calcResult.signals.total_launches,
      graduatedCount: calcResult.signals.graduated_count,
      deadOnArrivalCount: Math.round(
        calcResult.signals.doa_rate * calcResult.signals.total_launches
      ),
      burstLaunches: Math.round(
        calcResult.signals.burst_rate * calcResult.signals.total_launches
      ),
      feeRecipientReuse: scoreRecord?.feeRecipientReuse ?? 0,
      score: calcResult.score,
      label: calcResult.label,
      band: calcResult.band,
      updatedAt: now,
    };

    if (activeDb.insert) {
      await activeDb
        .insert(deployerScores)
        .values(newProfile)
        .onConflictDoUpdate({
          target: [deployerScores.deployerAddress],
          set: {
            totalLaunches: newProfile.totalLaunches,
            graduatedCount: newProfile.graduatedCount,
            deadOnArrivalCount: newProfile.deadOnArrivalCount,
            burstLaunches: newProfile.burstLaunches,
            score: newProfile.score,
            label: newProfile.label,
            band: newProfile.band,
            updatedAt: newProfile.updatedAt,
          },
        });
    }

    return NextResponse.json({
      ok: true,
      deployer: newProfile,
      signals: calcResult.signals,
      launches: launches.map((l) => ({
        tokenAddress: l.tokenAddress,
        block: l.block,
        phase: l.phase,
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ address: string }> | { address: string } }
): Promise<NextResponse<GetDeployerResponseBody>> {
  const resolvedParams = await Promise.resolve(context?.params);
  return handleGetDeployer(resolvedParams?.address, req);
}
