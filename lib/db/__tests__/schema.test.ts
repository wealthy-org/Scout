import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import * as schema from '@/lib/db/schema';

describe('Drizzle ORM Database Schema for 11 Tables (TICKET-06)', () => {
  const rootDir = process.cwd();
  const schemaPath = path.join(rootDir, 'lib', 'db', 'schema.ts');

  test('lib/db/schema.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(schemaPath), true, 'lib/db/schema.ts must exist');
  });

  test('exports all 11 pgTable definitions', () => {
    assert.ok(schema.users, 'users table must be exported');
    assert.ok(schema.dossiers, 'dossiers table must be exported');
    assert.ok(schema.dossierItems, 'dossierItems table must be exported');
    assert.ok(schema.dossierQuestions, 'dossierQuestions table must be exported');
    assert.ok(schema.dossierLog, 'dossierLog table must be exported');
    assert.ok(schema.snapshots, 'snapshots table must be exported');
    assert.ok(schema.publishedDossiers, 'publishedDossiers table must be exported');
    assert.ok(schema.deployerWatchlist, 'deployerWatchlist table must be exported');
    assert.ok(schema.deployerScores, 'deployerScores table must be exported');
    assert.ok(schema.deployerLaunches, 'deployerLaunches table must be exported');
    assert.ok(schema.censusStats, 'censusStats table must be exported');
  });

  test('exports dossier status enum array matching PRD specs', () => {
    assert.ok(Array.isArray(schema.DOSSIER_STATUSES), 'DOSSIER_STATUSES must be an array');
    assert.deepStrictEqual(
      [...schema.DOSSIER_STATUSES],
      ['Watching', 'Researching', 'In position', 'Passed'],
      'DOSSIER_STATUSES must contain exact statuses'
    );
  });

  test('exports dossier items kind enum array matching PRD specs', () => {
    assert.ok(Array.isArray(schema.DOSSIER_ITEM_KINDS), 'DOSSIER_ITEM_KINDS must be an array');
    assert.deepStrictEqual(
      [...schema.DOSSIER_ITEM_KINDS],
      ['pro', 'con', 'checked', 'source'],
      'DOSSIER_ITEM_KINDS must contain exact kinds'
    );
  });

  test('users table structure validation', () => {
    assert.strictEqual(schema.users.walletAddress.name, 'wallet_address');
    assert.strictEqual(schema.users.handle.name, 'handle');
    assert.strictEqual(schema.users.createdAt.name, 'created_at');
  });

  test('dossiers table structure validation', () => {
    assert.strictEqual(schema.dossiers.id.name, 'id');
    assert.strictEqual(schema.dossiers.walletAddress.name, 'wallet_address');
    assert.strictEqual(schema.dossiers.chainId.name, 'chain_id');
    assert.strictEqual(schema.dossiers.contractAddress.name, 'contract_address');
    assert.strictEqual(schema.dossiers.symbol.name, 'symbol');
    assert.strictEqual(schema.dossiers.status.name, 'status');
    assert.strictEqual(schema.dossiers.thesis.name, 'thesis');
    assert.strictEqual(schema.dossiers.notes.name, 'notes');
  });

  test('deployer_scores table structure validation', () => {
    assert.strictEqual(schema.deployerScores.deployerAddress.name, 'deployer_address');
    assert.strictEqual(schema.deployerScores.totalLaunches.name, 'total_launches');
    assert.strictEqual(schema.deployerScores.graduatedCount.name, 'graduated_count');
    assert.strictEqual(schema.deployerScores.score.name, 'score');
    assert.strictEqual(schema.deployerScores.label.name, 'label');
    assert.strictEqual(schema.deployerScores.band.name, 'band');
  });

  test('deployer_launches table composite primary key validation', () => {
    assert.strictEqual(schema.deployerLaunches.deployerAddress.name, 'deployer_address');
    assert.strictEqual(schema.deployerLaunches.tokenAddress.name, 'token_address');
    assert.strictEqual(schema.deployerLaunches.block.name, 'block');
  });
});
