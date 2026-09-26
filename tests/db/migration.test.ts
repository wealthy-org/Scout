import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';

describe('Initial Database Migration Verification (TICKET-08)', () => {
  const rootDir = process.cwd();
  const migrationsDir = path.join(rootDir, 'drizzle', 'migrations');
  const journalPath = path.join(migrationsDir, 'meta', '_journal.json');

  test('drizzle/migrations directory and _journal.json must exist', () => {
    assert.strictEqual(fs.existsSync(migrationsDir), true, 'drizzle/migrations must exist');
    assert.strictEqual(fs.existsSync(journalPath), true, 'drizzle/migrations/meta/_journal.json must exist');

    const journalContent = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
    assert.ok(Array.isArray(journalContent.entries), 'journal entries must be an array');
    assert.ok(journalContent.entries.length >= 1, 'at least 1 migration entry must exist in journal');
  });

  test('SQL migration file exists and contains CREATE TABLE for all 11 tables', () => {
    assert.strictEqual(fs.existsSync(migrationsDir), true, 'drizzle/migrations directory must exist');
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
    assert.ok(files.length >= 1, 'at least one .sql migration file must exist');

    const allSql = files
      .map((f) => fs.readFileSync(path.join(migrationsDir, f), 'utf8'))
      .join('\n');

    const requiredTables = [
      'users',
      'dossiers',
      'dossier_items',
      'dossier_questions',
      'dossier_log',
      'snapshots',
      'published_dossiers',
      'deployer_watchlist',
      'deployer_scores',
      'deployer_launches',
      'census_stats'
    ];

    for (const table of requiredTables) {
      const regex = new RegExp(`CREATE TABLE (IF NOT EXISTS )?("${table}"|${table})\\s*\\(`, 'i');
      assert.ok(
        regex.test(allSql),
        `Migration SQL must contain CREATE TABLE statement for "${table}"`
      );
    }
  });

  test('SQL migration file contains search indexes and unique constraints', () => {
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
    const allSql = files
      .map((f) => fs.readFileSync(path.join(migrationsDir, f), 'utf8'))
      .join('\n');

    assert.match(allSql, /CREATE (UNIQUE )?INDEX/i, 'Migration SQL must create indexes');
    assert.ok(allSql.includes('wallet_address'), 'Indexes or foreign keys must include wallet_address');
    assert.ok(allSql.includes('contract_address'), 'Indexes must include contract_address');
    assert.ok(allSql.includes('deployer_address'), 'Indexes must include deployer_address');
  });
});
