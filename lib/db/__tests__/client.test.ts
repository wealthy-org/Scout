import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';

describe('Drizzle Database Client & Configuration Setup (TICKET-07)', () => {
  const rootDir = process.cwd();
  const dbIndexPath = path.join(rootDir, 'lib', 'db', 'index.ts');
  const drizzleConfigPath = path.join(rootDir, 'drizzle.config.ts');
  const packageJsonPath = path.join(rootDir, 'package.json');

  test('lib/db/index.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(dbIndexPath), true, 'lib/db/index.ts must exist');
  });

  test('drizzle.config.ts file must exist and contain schema & migrations configuration', () => {
    assert.strictEqual(fs.existsSync(drizzleConfigPath), true, 'drizzle.config.ts must exist');
    const content = fs.readFileSync(drizzleConfigPath, 'utf8');
    assert.match(content, /schema.*lib\/db\/schema\.ts/, 'drizzle.config.ts must target lib/db/schema.ts');
    assert.match(content, /out.*drizzle\/migrations/, 'drizzle.config.ts must target drizzle/migrations');
    assert.match(content, /dialect.*postgresql/, 'drizzle.config.ts must set postgresql dialect');
  });

  test('package.json must contain db:generate, db:migrate, and db:studio scripts', () => {
    assert.strictEqual(fs.existsSync(packageJsonPath), true, 'package.json must exist');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = pkg.scripts || {};

    assert.ok(scripts['db:generate'], 'package.json must contain db:generate script');
    assert.strictEqual(scripts['db:generate'], 'drizzle-kit generate');

    assert.ok(scripts['db:migrate'], 'package.json must contain db:migrate script');
    assert.strictEqual(scripts['db:migrate'], 'drizzle-kit migrate');

    assert.ok(scripts['db:studio'], 'package.json must contain db:studio script');
    assert.strictEqual(scripts['db:studio'], 'drizzle-kit studio');
  });

  test('lib/db/index.ts exports db instance and pool singleton', async () => {
    const dbModule = await import('../index');
    assert.ok(dbModule.db, 'lib/db must export db instance');
    assert.ok(dbModule.pool, 'lib/db must export pool instance');
  });
});
