import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import * as scoreConfig from '@/config/score';

describe('Deployer Score Formula Configuration (TICKET-03)', () => {
  const rootDir = process.cwd();
  const scoreConfigPath = path.join(rootDir, 'config', 'score.ts');

  test('config/score.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(scoreConfigPath), true, 'config/score.ts must exist');
  });

  test('config/score.ts exports exact weight constants summing to 1.00', () => {
    assert.strictEqual(scoreConfig.WEIGHT_GRAD_RATE, 0.55, 'WEIGHT_GRAD_RATE must be 0.55');
    assert.strictEqual(scoreConfig.WEIGHT_NO_DOA, 0.25, 'WEIGHT_NO_DOA must be 0.25');
    assert.strictEqual(scoreConfig.WEIGHT_NO_BURST, 0.20, 'WEIGHT_NO_BURST must be 0.20');

    const totalWeight = scoreConfig.WEIGHT_GRAD_RATE + scoreConfig.WEIGHT_NO_DOA + scoreConfig.WEIGHT_NO_BURST;
    assert.strictEqual(Number(totalWeight.toFixed(2)), 1.00, 'Sum of weights must equal 1.00');
  });

  test('config/score.ts exports Laplace smoothing constants', () => {
    assert.strictEqual(scoreConfig.GRAD_NUMERATOR_ADD, 1, 'GRAD_NUMERATOR_ADD must be 1');
    assert.strictEqual(scoreConfig.GRAD_DENOMINATOR_ADD, 3, 'GRAD_DENOMINATOR_ADD must be 3');
  });

  test('config/score.ts exports serial zero-grad penalty constants', () => {
    assert.strictEqual(scoreConfig.SERIAL_ZERO_GRAD_CAP, 25, 'SERIAL_ZERO_GRAD_CAP must be 25');
    assert.strictEqual(scoreConfig.SERIAL_ZERO_GRAD_THRESHOLD, 6, 'SERIAL_ZERO_GRAD_THRESHOLD must be 6');
  });

  test('config/score.ts exports label volume thresholds', () => {
    assert.strictEqual(scoreConfig.LABEL_FRESH_MAX, 1, 'LABEL_FRESH_MAX must be 1');
    assert.strictEqual(scoreConfig.LABEL_REPEAT_MIN, 2, 'LABEL_REPEAT_MIN must be 2');
    assert.strictEqual(scoreConfig.LABEL_REPEAT_MAX, 5, 'LABEL_REPEAT_MAX must be 5');
    assert.strictEqual(scoreConfig.LABEL_SERIAL_MIN, 6, 'LABEL_SERIAL_MIN must be 6');
  });

  test('config/score.ts exports reputation band boundaries', () => {
    assert.strictEqual(scoreConfig.BAND_GREEN_MIN, 65, 'BAND_GREEN_MIN must be 65');
    assert.strictEqual(scoreConfig.BAND_YELLOW_MIN, 35, 'BAND_YELLOW_MIN must be 35');
  });

  test('config/score.ts exports score bounds', () => {
    assert.strictEqual(scoreConfig.SCORE_MIN, 0, 'SCORE_MIN must be 0');
    assert.strictEqual(scoreConfig.SCORE_MAX, 100, 'SCORE_MAX must be 100');
  });
});
