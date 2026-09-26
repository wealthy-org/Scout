import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("TICKET-M05: Vercel Cron Job configuration and census trigger verification", () => {
  const vercelJsonPath = path.resolve(process.cwd(), "vercel.json");
  assert.ok(fs.existsSync(vercelJsonPath), "vercel.json must exist");

  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, "utf-8"));
  assert.ok(Array.isArray(vercelConfig.crons), "vercel.json must define crons array");

  const censusCron = vercelConfig.crons.find((c: { path?: string }) => c.path === "/api/cron/census");
  assert.ok(censusCron, "Cron for /api/cron/census must be configured in vercel.json");
  assert.ok(typeof censusCron.schedule === "string" && censusCron.schedule.length > 0, "Cron schedule must be a valid cron expression");

  const cronRoutePath = path.resolve(process.cwd(), "app/api/cron/census/route.ts");
  assert.ok(fs.existsSync(cronRoutePath), "app/api/cron/census/route.ts endpoint must exist");

  const envExamplePath = path.resolve(process.cwd(), ".env.production.example");
  const envContent = fs.readFileSync(envExamplePath, "utf-8");
  assert.ok(envContent.includes("CRON_SECRET"), ".env.production.example must declare CRON_SECRET");
});
