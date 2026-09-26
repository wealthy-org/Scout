import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import * as schema from "../../lib/db/schema";

test("TICKET-M02: Production database migration dry-run and schema integrity", () => {
  const migrationsDir = path.resolve(process.cwd(), "drizzle/migrations");
  assert.ok(fs.existsSync(migrationsDir), "drizzle/migrations directory must exist");

  const journalPath = path.join(migrationsDir, "meta/_journal.json");
  assert.ok(fs.existsSync(journalPath), "_journal.json meta file must exist");

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
  assert.ok(journal.entries && journal.entries.length > 0, "Journal must contain migration entries");

  const expectedTableExports = [
    "users",
    "dossiers",
    "dossierItems",
    "dossierQuestions",
    "dossierLog",
    "snapshots",
    "publishedDossiers",
    "deployerWatchlist",
    "deployerScores",
    "deployerLaunches",
    "censusStats"
  ];

  for (const tableExport of expectedTableExports) {
    assert.ok(tableExport in schema, `Table export ${tableExport} must be defined in Drizzle schema`);
  }

  const expectedDbTables = [
    "users",
    "dossiers",
    "dossier_items",
    "dossier_questions",
    "dossier_log",
    "snapshots",
    "published_dossiers",
    "deployer_watchlist",
    "deployer_scores",
    "deployer_launches",
    "census_stats"
  ];

  const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
  assert.ok(migrationFiles.length > 0, "At least one SQL migration file must exist");

  const sqlContent = migrationFiles.map((f) => fs.readFileSync(path.join(migrationsDir, f), "utf-8")).join("\n");

  for (const table of expectedDbTables) {
    assert.ok(
      sqlContent.includes(`CREATE TABLE "${table}"`) ||
      sqlContent.includes(`CREATE TABLE IF NOT EXISTS "${table}"`) ||
      sqlContent.includes(`"${table}"`),
      `SQL migration must contain DDL for table ${table}`
    );
  }

  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  assert.equal(pkg.scripts["db:migrate"], "drizzle-kit migrate");
  assert.ok(!pkg.scripts["db:migrate"].includes("seed"), "db:migrate script must not execute seed data");
});
