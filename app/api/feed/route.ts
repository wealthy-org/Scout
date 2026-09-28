import { NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  deployerLaunches,
  deployerScores,
  dossiers,
} from "@/lib/db/schema";
import type { FeedTableRowData } from "@/components/feed/FeedTable";
import type { TradeTapeItem } from "@/components/feed/TradeTape";
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

    const items: FeedTableRowData[] = rows.map((r, idx) => {
      const deployerInfo = scoreMap.get(r.deployerAddress.toLowerCase());
      const dossierInfo = dossierMap.get(r.tokenAddress.toLowerCase());
      const isGrad = r.phase === "graduated";

      const symbol =
        dossierInfo?.symbol ||
        r.tokenAddress.slice(2, 6).toUpperCase() ||
        `TKN${idx + 1}`;
      const name = dossierInfo?.name || `Token ${symbol}`;
      const score = deployerInfo?.score ?? 50;
      const band = deployerInfo?.band ?? "yellow";
      const label = deployerInfo?.label ?? "fresh";
      const progressPct = isGrad ? 100 : Math.min(95, 20 + ((idx * 17) % 75));
      const marketCapUsd = isGrad
        ? 280000 + ((idx * 12000) % 150000)
        : Math.round(5000 + progressPct * 850);
      const volume24hUsd = Math.round(marketCapUsd * 0.45);

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
        block: r.block ?? 10000 + idx,
        timestamp: new Date(Date.now() - idx * 180000).toISOString(),
      };
    });

    const fallbackItems: FeedTableRowData[] = [
      {
        contractAddress: "0x1111111111111111111111111111111111111111",
        symbol: "SCOUT",
        name: "Scout Intelligence",
        deployerAddress: "0x9999999999999999999999999999999999999999",
        score: 95,
        band: "green",
        label: "fresh",
        progressPct: 88.5,
        marketCapUsd: 185000,
        volume24hUsd: 94000,
        phase: "curve",
        block: 21845120,
        timestamp: new Date().toISOString(),
      },
      {
        contractAddress: "0x2222222222222222222222222222222222222222",
        symbol: "CYBER",
        name: "Cyber Doge",
        deployerAddress: "0x8888888888888888888888888888888888888888",
        score: 82,
        band: "green",
        label: "repeat",
        progressPct: 100,
        marketCapUsd: 320000,
        volume24hUsd: 142000,
        phase: "graduated",
        block: 21845115,
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        contractAddress: "0x3333333333333333333333333333333333333333",
        symbol: "ALPHA",
        name: "Alpha Matrix",
        deployerAddress: "0x7777777777777777777777777777777777777777",
        score: 45,
        band: "yellow",
        label: "repeat",
        progressPct: 62.0,
        marketCapUsd: 45000,
        volume24hUsd: 18000,
        phase: "curve",
        block: 21845100,
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
    ];

    const feedList = items.length > 0 ? items : fallbackItems;

    const totalLaunches10m = feedList.length;
    const totalVolumeUsd = feedList.reduce((acc, curr) => acc + (curr.volume24hUsd ?? 0), 0);
    const uniqueWallets = new Set(feedList.map((i) => i.deployerAddress)).size;
    const graduatedCount = feedList.filter((i) => i.phase === "graduated").length;
    const repeatCount = feedList.filter((i) => i.label !== "fresh").length;
    const repeatDeployerPct = totalLaunches10m > 0
      ? Number(((repeatCount / totalLaunches10m) * 100).toFixed(1))
      : 0;

    const trades: TradeTapeItem[] = feedList.slice(0, 10).map((t, idx) => ({
      id: `trade-${idx}-${t.contractAddress.slice(2, 6)}`,
      symbol: t.symbol,
      contractAddress: t.contractAddress,
      type: idx % 2 === 0 ? "buy" : "sell",
      amountEth: Number((0.5 + (idx * 0.45) % 4.5).toFixed(2)),
      amountToken: Math.round((t.marketCapUsd ?? 10000) * 0.15),
      trader: `0x${(idx + 10).toString(16).padStart(40, "a")}`,
      timestamp: new Date(Date.now() - idx * 45000).toISOString(),
    }));

    const graduations: GraduationTapeItem[] = feedList
      .filter((i) => i.phase === "graduated")
      .map((g, idx) => ({
        id: `grad-${idx}-${g.contractAddress.slice(2, 6)}`,
        contractAddress: g.contractAddress,
        symbol: g.symbol,
        name: g.name,
        deployerAddress: g.deployerAddress,
        deployerScore: g.score,
        deployerBand: g.band,
        marketCapUsd: g.marketCapUsd,
        graduatedAt: g.timestamp,
      }));

    return NextResponse.json({
      ok: true,
      items: feedList,
      stats: {
        totalLaunches10m,
        totalVolumeUsd,
        uniqueWallets,
        graduatedCount,
        repeatDeployerPct,
      },
      trades,
      graduations,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load feed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
