import { db } from "@/lib/db";
import { snapshots } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export interface SnapshotDataInput {
  chainJson?: unknown;
  marketJson?: unknown;
  reposJson?: unknown;
  launchesJson?: unknown;
  launchTotal?: number | null;
  curveJson?: unknown;
}

export interface SnapshotRecordLike extends SnapshotDataInput {
  id: string;
  dossierId: string;
  at: Date | string;
}

export interface SaveSnapshotResult {
  saved: boolean;
  reason?: "identical" | "error";
  snapshot?: SnapshotRecordLike | null;
}

const DEFAULT_MAX_SNAPSHOTS = 30;

function stableStringify(obj: unknown): string {
  if (obj === null || obj === undefined) return "";
  if (typeof obj !== "object") return String(obj);
  if (Array.isArray(obj)) {
    return "[" + obj.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map((k) => `"${k}":${stableStringify((obj as Record<string, unknown>)[k])}`);
  return "{" + pairs.join(",") + "}";
}

export function isSnapshotIdentical(
  prev: SnapshotRecordLike | null | undefined,
  next: SnapshotDataInput
): boolean {
  if (!prev) return false;

  const chainEqual =
    stableStringify(prev.chainJson) === stableStringify(next.chainJson);
  const marketEqual =
    stableStringify(prev.marketJson) === stableStringify(next.marketJson);
  const reposEqual =
    stableStringify(prev.reposJson) === stableStringify(next.reposJson);
  const launchesEqual =
    stableStringify(prev.launchesJson) === stableStringify(next.launchesJson);
  const curveEqual =
    stableStringify(prev.curveJson) === stableStringify(next.curveJson);
  const launchTotalEqual = (prev.launchTotal ?? null) === (next.launchTotal ?? null);

  return (
    chainEqual &&
    marketEqual &&
    reposEqual &&
    launchesEqual &&
    curveEqual &&
    launchTotalEqual
  );
}

export async function pruneSnapshots(
  dossierId: string,
  maxSnapshots: number = DEFAULT_MAX_SNAPSHOTS,
  dbClient: typeof db = db
): Promise<number> {
  const allSnaps = await dbClient
    .select({ id: snapshots.id })
    .from(snapshots)
    .where(eq(snapshots.dossierId, dossierId))
    .orderBy(desc(snapshots.at));

  if (allSnaps.length <= maxSnapshots) {
    return 0;
  }

  const idsToDelete = allSnaps.slice(maxSnapshots).map((s) => s.id);
  if (idsToDelete.length === 0) return 0;

  await dbClient
    .delete(snapshots)
    .where(inArray(snapshots.id, idsToDelete));

  return idsToDelete.length;
}

export async function saveSnapshot(
  dossierId: string,
  data: SnapshotDataInput,
  options?: {
    maxSnapshots?: number;
    dbInstance?: unknown;
  }
): Promise<SaveSnapshotResult> {
  const activeDb = (options?.dbInstance as typeof db) || db;
  const maxRetention = options?.maxSnapshots ?? DEFAULT_MAX_SNAPSHOTS;

  try {
    const latestSnaps = await activeDb
      .select()
      .from(snapshots)
      .where(eq(snapshots.dossierId, dossierId))
      .orderBy(desc(snapshots.at))
      .limit(1);

    const prev = (latestSnaps[0] as unknown as SnapshotRecordLike) || null;

    if (prev && isSnapshotIdentical(prev, data)) {
      return {
        saved: false,
        reason: "identical",
        snapshot: prev,
      };
    }

    const inserted = await activeDb
      .insert(snapshots)
      .values({
        dossierId,
        chainJson: data.chainJson,
        marketJson: data.marketJson,
        reposJson: data.reposJson,
        launchesJson: data.launchesJson,
        launchTotal: data.launchTotal,
        curveJson: data.curveJson,
      })
      .returning();

    const newRecord = (inserted[0] as unknown as SnapshotRecordLike) || null;

    await pruneSnapshots(dossierId, maxRetention, activeDb);

    return {
      saved: true,
      snapshot: newRecord,
    };
  } catch {
    return {
      saved: false,
      reason: "error",
      snapshot: null,
    };
  }
}
