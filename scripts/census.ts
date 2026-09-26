import { computeCensusStats, saveCensusSnapshot } from "@/lib/census/compute";
import { db } from "@/lib/db";

export async function runCensus(): Promise<void> {
  const stats = await computeCensusStats(db);
  await saveCensusSnapshot(stats, db);
  process.stdout.write(
    `[Census] Aggregation complete. Total launches: ${stats.total_launches}, Unique: ${stats.unique_deployers}, Repeat share: ${stats.repeat_share}%\n`
  );
}

if (process.env.NODE_ENV !== "test") {
  runCensus()
    .then(() => process.exit(0))
    .catch((err) => {
      process.stderr.write(`[Census Error] ${String(err)}\n`);
      process.exit(1);
    });
}
