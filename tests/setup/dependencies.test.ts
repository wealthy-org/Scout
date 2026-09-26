import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';

describe('Project Core Dependencies Setup (TICKET-05)', () => {
  const rootDir = process.cwd();
  const packageJsonPath = path.join(rootDir, 'package.json');

  test('package.json exists and is valid JSON', () => {
    assert.strictEqual(fs.existsSync(packageJsonPath), true, 'package.json must exist');
    const raw = fs.readFileSync(packageJsonPath, 'utf8');
    assert.doesNotThrow(() => JSON.parse(raw), 'package.json must be valid JSON');
  });

  test('all required runtime dependencies are installed in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = pkg.dependencies || {};

    const requiredRuntime = [
      'wagmi',
      'viem',
      'siwe',
      'iron-session',
      'drizzle-orm',
      'pg',
      'zod',
      '@tanstack/react-query'
    ];

    for (const dep of requiredRuntime) {
      assert.ok(
        deps[dep],
        `Runtime dependency "${dep}" must be listed in package.json dependencies`
      );
    }
  });

  test('all required development dependencies are installed in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const devDeps = pkg.devDependencies || {};

    const requiredDev = [
      'drizzle-kit',
      '@types/pg',
      'vitest',
      '@vitejs/plugin-react'
    ];

    for (const dep of requiredDev) {
      assert.ok(
        devDeps[dep],
        `Development dependency "${dep}" must be listed in package.json devDependencies`
      );
    }
  });
});
