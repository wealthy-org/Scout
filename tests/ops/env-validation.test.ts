import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("TICKET-M01: Production environment variables validation", () => {
  const envExamplePath = path.resolve(process.cwd(), ".env.production.example");
  assert.ok(fs.existsSync(envExamplePath), ".env.production.example must exist");

  const envContent = fs.readFileSync(envExamplePath, "utf-8");
  const envLines = envContent.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));

  const envMap: Record<string, string> = {};
  for (const line of envLines) {
    const [k, ...v] = line.split("=");
    envMap[k.trim()] = v.join("=").trim();
  }

  assert.ok("DATABASE_URL" in envMap, "DATABASE_URL must be defined");
  assert.ok("SESSION_SECRET" in envMap, "SESSION_SECRET must be defined");
  assert.ok("CRON_SECRET" in envMap, "CRON_SECRET must be defined");
  assert.ok("RPC_URL" in envMap, "RPC_URL must be defined");
  assert.ok("NEXT_PUBLIC_CHAIN_ID" in envMap, "NEXT_PUBLIC_CHAIN_ID must be defined");

  assert.ok(
    envMap.DATABASE_URL.includes("sslmode=require") || envMap.DATABASE_URL.includes("sslmode=no-verify"),
    "DATABASE_URL must require SSL in production"
  );

  assert.ok(!("SESSION_SECRET" in Object.keys(envMap).filter((k) => k.startsWith("NEXT_PUBLIC_"))));
  assert.ok(!("CRON_SECRET" in Object.keys(envMap).filter((k) => k.startsWith("NEXT_PUBLIC_"))));
  assert.ok(!("DATABASE_URL" in Object.keys(envMap).filter((k) => k.startsWith("NEXT_PUBLIC_"))));
});
