import { NextResponse } from "next/server";
import { desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  deployerLaunches,
  deployerScores,
  dossiers,
} from "@/lib/db/schema";
import { fetchDexScreenerTokenData, type DexScreenerTokenData } from "@/lib/market/dexscreener";
import type { FeedTableRowData } from "@/components/feed/FeedTable";
import type { GraduationTapeItem } from "@/components/feed/GraduationTape";

export async function GET() {
  try {
    let rows: {
      deployerAddress: string;
      tokenAddress: string;
      block: number | null;
      phase: string | null;
    }[] = [];

    if (db) {
      try {
        rows = await db
          .select()
          .from(deployerLaunches)
          .orderBy(desc(deployerLaunches.block))
          .limit(60);
      } catch {
      }
    }

    const deployerAddresses = Array.from(
      new Set(rows.map((r) => r.deployerAddress.toLowerCase()))
    );
    const tokenAddresses = Array.from(
      new Set(rows.map((r) => r.tokenAddress.toLowerCase()))
    );

    const scoreMap = new Map<
      string,
      {
        score: number;
        band: "green" | "yellow" | "red";
        label: "fresh" | "repeat" | "serial";
        totalLaunches: number;
      }
    >();

    const dossierMap = new Map<string, { symbol: string; name: string }>();
    const dexMap = new Map<string, DexScreenerTokenData | null>();

    if (db && deployerAddresses.length > 0) {
      try {
        const scores = await db
          .select()
          .from(deployerScores)
          .where(inArray(deployerScores.deployerAddress, deployerAddresses));

        for (const s of scores) {
          scoreMap.set(s.deployerAddress.toLowerCase(), {
            score: s.score,
            band: s.band,
            label: s.label,
            totalLaunches: s.totalLaunches,
          });
        }
      } catch {
      }
    }

    if (db && tokenAddresses.length > 0) {
      try {
        const dRecs = await db
          .select()
          .from(dossiers)
          .where(inArray(dossiers.contractAddress, tokenAddresses));

        for (const d of dRecs) {
          dossierMap.set(d.contractAddress.toLowerCase(), {
            symbol: d.symbol || "TOKEN",
            name: d.name || "Token",
          });
        }
      } catch {
      }
    }

    if (tokenAddresses.length > 0) {
      const dexResults = await Promise.allSettled(
        tokenAddresses.map((addr) => fetchDexScreenerTokenData(addr))
      );
      tokenAddresses.forEach((addr, idx) => {
        const res = dexResults[idx];
        if (res.status === "fulfilled" && res.value) {
          dexMap.set(addr, res.value);
        } else {
          dexMap.set(addr, null);
        }
      });
    }

    const items: FeedTableRowData[] = rows.map((r, idx) => {
      const deployerInfo = scoreMap.get(r.deployerAddress.toLowerCase());
      const dossierInfo = dossierMap.get(r.tokenAddress.toLowerCase());
      const dexInfo = dexMap.get(r.tokenAddress.toLowerCase());
      const isGrad = r.phase === "graduated" || r.phase === "swept";

      const symbol =
        dossierInfo?.symbol ||
        r.tokenAddress.slice(2, 6).toUpperCase() ||
        `TKN${idx + 1}`;
      const name = dossierInfo?.name || `Token ${symbol}`;
      const score = deployerInfo?.score ?? 50;
      const band = deployerInfo?.band ?? "yellow";
      const label = deployerInfo?.label ?? "fresh";
      const progressPct = isGrad ? 100 : null;
      const marketCapUsd = dexInfo?.fdv ?? null;
      const volume24hUsd = dexInfo?.volume24hUsd ?? null;

      return {
        contractAddress: r.tokenAddress,
        symbol,
        name,
        deployerAddress: r.deployerAddress,
        score,
        band,
        label,
        progressPct,
        marketCapUsd,
        volume24hUsd,
        phase: r.phase || "curve",
        block: r.block ?? null,
        timestamp: new Date(Date.now() - idx * 180000).toISOString(),
      };
    });

    const totalLaunches10m = items.length;
    const totalVolumeUsd = items.reduce((acc, curr) => acc + (curr.volume24hUsd ?? 0), 0);
    const uniqueWallets = new Set(items.map((i) => i.deployerAddress.toLowerCase())).size;
    const graduatedCount = items.filter((i) => i.phase === "graduated" || i.phase === "swept").length;
    const repeatCount = items.filter((i) => i.label !== "fresh").length;
    const repeatDeployerPct = totalLaunches10m > 0
      ? Number(((repeatCount / totalLaunches10m) * 100).toFixed(1))
      : 0;

    const graduations: GraduationTapeItem[] = items
      .filter((i) => i.phase === "graduated" || i.phase === "swept")
      .map((g, idx) => ({
        id: `grad-${idx}-${g.contractAddress.slice(2, 6)}`,
        contractAddress: g.contractAddress,
        symbol: g.symbol,
        name: g.name,
        deployerAddress: g.deployerAddress,
        deployerScore: g.score,
        deployerBand: g.band,
        marketCapUsd: g.marketCapUsd,
        graduatedAt: typeof g.timestamp === "string" ? g.timestamp : new Date().toISOString(),
      }));

    return NextResponse.json({
      ok: true,
      items,
      stats: {
        totalLaunches10m,
        totalVolumeUsd,
        uniqueWallets,
        graduatedCount,
        repeatDeployerPct,
      },
      trades: [],
      graduations,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load feed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
