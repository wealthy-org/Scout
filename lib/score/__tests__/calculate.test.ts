import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { calculateScore } from '@/lib/score/calculate';
import type { DeployerLaunchInput } from '@/types/score';

describe('Deployer Score Calculation Formula (TICKET-17)', () => {
  const rootDir = process.cwd();
  const calculatePath = path.join(rootDir, 'lib', 'score', 'calculate.ts');

  test('lib/score/calculate.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(calculatePath), true, 'lib/score/calculate.ts must exist');
  });

  test('exports calculateScore function', () => {
    assert.strictEqual(typeof calculateScore, 'function');
  });

  test('calculates score for a fresh deployer with 0 or 1 launch correctly', () => {
    const emptyResult = calculateScore([]);
    assert.strictEqual(emptyResult.label, 'fresh');
    assert.strictEqual(emptyResult.band, 'yellow');
    assert.strictEqual(emptyResult.score, 63);
    assert.strictEqual(emptyResult.signals.total_launches, 0);
    assert.strictEqual(emptyResult.signals.graduated_count, 0);

    const singleLaunch: DeployerLaunchInput[] = [
      { token: '0x1111', graduated: false, isDoa: false, isBurst: false },
    ];
    const singleResult = calculateScore(singleLaunch);
    assert.strictEqual(singleResult.label, 'fresh');
    assert.strictEqual(singleResult.band, 'yellow');
    assert.strictEqual(singleResult.score, 59);
    assert.strictEqual(singleResult.signals.total_launches, 1);
  });

  test('assigns repeat label for 2 to 5 launches', () => {
    const threeLaunches: DeployerLaunchInput[] = [
      { token: '0x1', graduated: true, isDoa: false, isBurst: false },
      { token: '0x2', graduated: false, isDoa: false, isBurst: false },
      { token: '0x3', graduated: false, isDoa: false, isBurst: false },
    ];

    const result = calculateScore(threeLaunches);
    assert.strictEqual(result.label, 'repeat');
    assert.strictEqual(result.signals.total_launches, 3);
    assert.strictEqual(result.signals.graduated_count, 1);
    assert.ok(result.score >= 0 && result.score <= 100);
  });

  test('enforces serial rugger penalty cap (max 25) for >=6 launches with 0 graduations', () => {
    const tenFailedLaunches: DeployerLaunchInput[] = Array.from({ length: 10 }, (_, i) => ({
      token: `0x${i}`,
      graduated: false,
      isDoa: false,
      isBurst: false,
    }));

    const result = calculateScore(tenFailedLaunches);
    assert.strictEqual(result.label, 'serial');
    assert.strictEqual(result.band, 'red');
    assert.ok(result.score <= 25, `Score must be capped at 25, got ${result.score}`);
  });

  test('assigns green band and high score for trusted builder with high graduation rate', () => {
    const successfulLaunches: DeployerLaunchInput[] = [
      { token: '0x1', graduated: true, isDoa: false, isBurst: false },
      { token: '0x2', graduated: true, isDoa: false, isBurst: false },
      { token: '0x3', graduated: true, isDoa: false, isBurst: false },
      { token: '0x4', graduated: true, isDoa: false, isBurst: false },
      { token: '0x5', graduated: true, isDoa: false, isBurst: false },
      { token: '0x6', graduated: false, isDoa: false, isBurst: false },
      { token: '0x7', graduated: true, isDoa: false, isBurst: false },
      { token: '0x8', graduated: true, isDoa: false, isBurst: false },
    ];

    const result = calculateScore(successfulLaunches);
    assert.strictEqual(result.label, 'serial');
    assert.strictEqual(result.band, 'green');
    assert.ok(result.score >= 65, `Score must be >= 65 for trusted builder, got ${result.score}`);
  });

  test('marks smart contract deployers with isContract flag and score 0', () => {
    const launches: DeployerLaunchInput[] = [
      { token: '0x1', graduated: true, isDoa: false, isBurst: false },
    ];

    const result = calculateScore(launches, { isContract: true });
    assert.strictEqual(result.isContract, true);
    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.band, 'red');
  });
});
