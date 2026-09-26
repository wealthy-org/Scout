import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import * as diffConfig from '@/config/diff';

describe('Since Last Check Diff Configuration (TICKET-04)', () => {
  const rootDir = process.cwd();
  const diffConfigPath = path.join(rootDir, 'config', 'diff.ts');

  test('config/diff.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(diffConfigPath), true, 'config/diff.ts must exist');
  });

  test('config/diff.ts exports exact numerical threshold constants', () => {
    assert.strictEqual(diffConfig.DIFF_FDV_PCT, 10, 'DIFF_FDV_PCT must be 10');
    assert.strictEqual(diffConfig.DIFF_LIQUIDITY_PCT, 15, 'DIFF_LIQUIDITY_PCT must be 15');
    assert.strictEqual(diffConfig.DIFF_SCORE_POINTS, 8, 'DIFF_SCORE_POINTS must be 8');
  });

  test('config/diff.ts exports unified DIFF_THRESHOLDS object', () => {
    assert.deepStrictEqual(
      diffConfig.DIFF_THRESHOLDS,
      {
        fdv_pct: 10,
        liquidity_pct: 15,
        score_points: 8
      },
      'DIFF_THRESHOLDS must match individual threshold constants'
    );
  });

  test('config/diff.ts exports boolean trigger string constants', () => {
    assert.strictEqual(diffConfig.DIFF_MARKET_APPEARED, 'market_appeared');
    assert.strictEqual(diffConfig.DIFF_CURVE_GRADUATED, 'curve_graduated');
    assert.strictEqual(diffConfig.DIFF_FEE_RECIPIENT_CHANGED, 'fee_recipient_changed');
    assert.strictEqual(diffConfig.DIFF_NEW_REPO_COMMIT, 'new_repo_commit');
    assert.strictEqual(diffConfig.DIFF_NEW_DEPLOYER_LAUNCH, 'new_deployer_launch');
  });

  test('config/diff.ts exports DIFF_FIELD_KEYS containing exactly 8 monitored fields', () => {
    assert.ok(Array.isArray(diffConfig.DIFF_FIELD_KEYS), 'DIFF_FIELD_KEYS must be an array');
    assert.strictEqual(diffConfig.DIFF_FIELD_KEYS.length, 8, 'DIFF_FIELD_KEYS must contain 8 fields');

    const expectedKeys = [
      'fdv',
      'liquidity',
      'deployer_score',
      'market_appeared',
      'curve_graduated',
      'fee_recipient_changed',
      'new_repo_commit',
      'new_deployer_launch'
    ];

    for (const key of expectedKeys) {
      assert.ok(
        (diffConfig.DIFF_FIELD_KEYS as readonly string[]).includes(key),
        `DIFF_FIELD_KEYS must include "${key}"`
      );
    }
  });

  test('config/diff.ts exports DIFF_BOOLEAN_TRIGGERS containing exactly 5 boolean triggers', () => {
    assert.ok(Array.isArray(diffConfig.DIFF_BOOLEAN_TRIGGERS), 'DIFF_BOOLEAN_TRIGGERS must be an array');
    assert.strictEqual(
      diffConfig.DIFF_BOOLEAN_TRIGGERS.length,
      5,
      'DIFF_BOOLEAN_TRIGGERS must contain 5 triggers'
    );

    const expectedTriggers = [
      'market_appeared',
      'curve_graduated',
      'fee_recipient_changed',
      'new_repo_commit',
      'new_deployer_launch'
    ];

    for (const trigger of expectedTriggers) {
      assert.ok(
        (diffConfig.DIFF_BOOLEAN_TRIGGERS as readonly string[]).includes(trigger),
        `DIFF_BOOLEAN_TRIGGERS must include "${trigger}"`
      );
    }
  });
});
