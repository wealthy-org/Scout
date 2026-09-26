import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import * as seedModule from '@/scripts/seed';

describe('Seed Dummy Data Script Verification (TICKET-09)', () => {
  const rootDir = process.cwd();
  const seedScriptPath = path.join(rootDir, 'scripts', 'seed.ts');
  const packageJsonPath = path.join(rootDir, 'package.json');

  test('scripts/seed.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(seedScriptPath), true, 'scripts/seed.ts must exist');
  });

  test('package.json must contain db:seed script', () => {
    assert.strictEqual(fs.existsSync(packageJsonPath), true, 'package.json must exist');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    assert.ok(pkg.scripts?.['db:seed'], 'package.json must contain db:seed script');
    assert.strictEqual(pkg.scripts['db:seed'], 'tsx scripts/seed.ts');
  });

  test('scripts/seed.ts exports mockData fixture with all required entities', () => {
    assert.ok(seedModule.mockData, 'scripts/seed.ts must export mockData');
    const { mockData } = seedModule;

    assert.ok(Array.isArray(mockData.users), 'mockData.users must be an array');
    assert.strictEqual(mockData.users.length, 2, 'mockData must have 2 users');

    assert.ok(Array.isArray(mockData.dossiers), 'mockData.dossiers must be an array');
    assert.strictEqual(mockData.dossiers.length, 3, 'mockData must have 3 dossiers');

    assert.ok(Array.isArray(mockData.dossierItems), 'mockData.dossierItems must be an array');
    assert.strictEqual(mockData.dossierItems.length >= 5, true, 'mockData must have at least 5 dossier items');

    assert.ok(Array.isArray(mockData.dossierQuestions), 'mockData.dossierQuestions must be an array');
    assert.strictEqual(mockData.dossierQuestions.length >= 3, true, 'mockData must have at least 3 dossier questions');

    assert.ok(Array.isArray(mockData.snapshots), 'mockData.snapshots must be an array');
    assert.strictEqual(mockData.snapshots.length >= 2, true, 'mockData must have at least 2 snapshots');

    assert.ok(Array.isArray(mockData.deployerScores), 'mockData.deployerScores must be an array');
    assert.strictEqual(mockData.deployerScores.length, 3, 'mockData must have 3 deployer scores');

    assert.ok(Array.isArray(mockData.deployerLaunches), 'mockData.deployerLaunches must be an array');
    assert.strictEqual(mockData.deployerLaunches.length >= 2, true, 'mockData must have at least 2 deployer launches');

    assert.ok(mockData.censusStats, 'mockData.censusStats must exist');
  });

  test('scripts/seed.ts exports executable seedDatabase function', () => {
    assert.strictEqual(typeof seedModule.seedDatabase, 'function', 'seedDatabase must be a function');
  });
});
