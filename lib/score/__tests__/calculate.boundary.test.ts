import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { calculateScore } from '@/lib/score/calculate';
import type { DeployerLaunchInput } from '@/types/score';

describe('Deployer Score Formula Boundary & Edge Cases (TICKET-18)', () => {
  const rootDir = process.cwd();
  const testFilePath = path.join(rootDir, 'lib', 'score', '__tests__', 'calculate.boundary.test.ts');

  test('lib/score/__tests__/calculate.boundary.test.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(testFilePath), true, 'calculate.boundary.test.ts must exist');
  });

  test('PRD AC #3: fixture 10 launches without graduation must trigger penalty cap (score <= 25, band red, label serial)', () => {
    const tenFailedLaunches: DeployerLaunchInput[] = Array.from({ length: 10 }, (_, i) => ({
      token: `0xfailed_${i}`,
      graduated: false,
      isDoa: false,
      isBurst: false,
    }));

    const result = calculateScore(tenFailedLaunches);
    assert.strictEqual(result.label, 'serial');
    assert.strictEqual(result.band, 'red');
    assert.strictEqual(result.signals.total_launches, 10);
    assert.strictEqual(result.signals.graduated_count, 0);
    assert.ok(result.score <= 25, `Score must be <= 25, received ${result.score}`);
    assert.strictEqual(result.score, 25);
  });

  test('PRD AC #3: fixture 8 launches with 5 graduations produces consistent score and green band', () => {
    const eightLaunches: DeployerLaunchInput[] = [
      { token: '0x1', graduated: true, isDoa: false, isBurst: false },
      { token: '0x2', graduated: true, isDoa: false, isBurst: false },
      { token: '0x3', graduated: true, isDoa: false, isBurst: false },
      { token: '0x4', graduated: true, isDoa: false, isBurst: false },
      { token: '0x5', graduated: true, isDoa: false, isBurst: false },
      { token: '0x6', graduated: false, isDoa: false, isBurst: false },
      { token: '0x7', graduated: false, isDoa: false, isBurst: false },
      { token: '0x8', graduated: false, isDoa: false, isBurst: false },
    ];

    const result = calculateScore(eightLaunches);
    const expectedGradRate = (5 + 1) / (8 + 3);
    const expectedRaw = 100 * (0.55 * expectedGradRate + 0.25 * 1 + 0.20 * 1);
    const expectedScore = Math.round(expectedRaw);

    assert.strictEqual(result.label, 'serial');
    assert.strictEqual(result.band, 'green');
    assert.strictEqual(result.score, expectedScore);
    assert.strictEqual(result.score, 75);
    assert.strictEqual(result.signals.graduated_count, 5);
    assert.strictEqual(result.signals.total_launches, 8);
  });

  test('verifies precise label transition boundaries: 1 (fresh), 2 (repeat), 5 (repeat), 6 (serial)', () => {
    const createLaunches = (count: number): DeployerLaunchInput[] =>
      Array.from({ length: count }, (_, i) => ({
        token: `0x${i}`,
        graduated: true,
        isDoa: false,
        isBurst: false,
      }));

    assert.strictEqual(calculateScore(createLaunches(1)).label, 'fresh');
    assert.strictEqual(calculateScore(createLaunches(2)).label, 'repeat');
    assert.strictEqual(calculateScore(createLaunches(5)).label, 'repeat');
    assert.strictEqual(calculateScore(createLaunches(6)).label, 'serial');
    assert.strictEqual(calculateScore(createLaunches(50)).label, 'serial');
  });

  test('verifies DOA and burst rate penalties reduce raw score proportionally', () => {
    const cleanLaunches: DeployerLaunchInput[] = [
      { token: '0x1', graduated: false, isDoa: false, isBurst: false },
      { token: '0x2', graduated: false, isDoa: false, isBurst: false },
      { token: '0x3', graduated: false, isDoa: false, isBurst: false },
      { token: '0x4', graduated: false, isDoa: false, isBurst: false },
    ];

    const doaLaunches: DeployerLaunchInput[] = [
      { token: '0x1', graduated: false, isDoa: true, isBurst: false },
      { token: '0x2', graduated: false, isDoa: true, isBurst: false },
      { token: '0x3', graduated: false, isDoa: false, isBurst: false },
      { token: '0x4', graduated: false, isDoa: false, isBurst: false },
    ];

    const burstLaunches: DeployerLaunchInput[] = [
      { token: '0x1', graduated: false, isDoa: false, isBurst: true },
      { token: '0x2', graduated: false, isDoa: false, isBurst: true },
      { token: '0x3', graduated: false, isDoa: false, isBurst: false },
      { token: '0x4', graduated: false, isDoa: false, isBurst: false },
    ];

    const cleanScore = calculateScore(cleanLaunches).score;
    const doaScore = calculateScore(doaLaunches).score;
    const burstScore = calculateScore(burstLaunches).score;

    assert.ok(doaScore < cleanScore, 'DOA launches must penalize score');
    assert.ok(burstScore < cleanScore, 'Burst launches must penalize score');
    assert.strictEqual(cleanScore - doaScore, 13);
    assert.strictEqual(cleanScore - burstScore, 10);
  });

  test('verifies score clamping within 0 to 100 range under extreme cases', () => {
    const worstCase: DeployerLaunchInput[] = Array.from({ length: 20 }, (_, i) => ({
      token: `0xworst_${i}`,
      graduated: false,
      isDoa: true,
      isBurst: true,
    }));

    const worstResult = calculateScore(worstCase);
    assert.ok(worstResult.score >= 0, 'Score cannot be negative');
    assert.strictEqual(worstResult.band, 'red');

    const bestCase: DeployerLaunchInput[] = Array.from({ length: 100 }, (_, i) => ({
      token: `0xbest_${i}`,
      graduated: true,
      isDoa: false,
      isBurst: false,
    }));

    const bestResult = calculateScore(bestCase);
    assert.ok(bestResult.score <= 100, 'Score cannot exceed 100');
    assert.strictEqual(bestResult.band, 'green');
    assert.ok(bestResult.score >= 95);
  });
});
