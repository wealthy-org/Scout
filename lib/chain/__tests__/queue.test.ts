import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { RequestQueue, rpcQueue } from '@/lib/chain/queue';

describe('2-Lane RPC Request Queue (TICKET-11)', () => {
  const rootDir = process.cwd();
  const queuePath = path.join(rootDir, 'lib', 'chain', 'queue.ts');

  test('lib/chain/queue.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(queuePath), true, 'lib/chain/queue.ts must exist');
  });

  test('exports RequestQueue class and rpcQueue singleton', () => {
    assert.strictEqual(typeof RequestQueue, 'function');
    assert.ok(rpcQueue instanceof RequestQueue);
  });

  test('successfully executes single task via enqueue', async () => {
    const queue = new RequestQueue({ intervalMs: 5 });
    const result = await queue.enqueue(async () => 42, 'foreground');
    assert.strictEqual(result, 42);
  });

  test('prioritizes foreground tasks over background tasks', async () => {
    const queue = new RequestQueue({ intervalMs: 20 });
    const executionOrder: string[] = [];

    const pBg1 = queue.enqueue(async () => {
      executionOrder.push('bg1');
      return 'bg1';
    }, 'background');

    const pBg2 = queue.enqueue(async () => {
      executionOrder.push('bg2');
      return 'bg2';
    }, 'background');

    const pFg1 = queue.enqueue(async () => {
      executionOrder.push('fg1');
      return 'fg1';
    }, 'foreground');

    const pFg2 = queue.enqueue(async () => {
      executionOrder.push('fg2');
      return 'fg2';
    }, 'foreground');

    await Promise.all([pBg1, pBg2, pFg1, pFg2]);

    assert.strictEqual(executionOrder[0], 'bg1');
    assert.strictEqual(executionOrder[1], 'fg1');
    assert.strictEqual(executionOrder[2], 'fg2');
    assert.strictEqual(executionOrder[3], 'bg2');
  });

  test('retries on 429 rate limit errors with exponential backoff up to maxRetries', async () => {
    const queue = new RequestQueue({ intervalMs: 5, maxRetries: 3 });
    let attempts = 0;

    const result = await queue.enqueue(async () => {
      attempts++;
      if (attempts < 3) {
        const error = new Error('Rate limit exceeded: 429 Too Many Requests');
        throw error;
      }
      return 'success after retries';
    }, 'foreground');

    assert.strictEqual(attempts, 3);
    assert.strictEqual(result, 'success after retries');
  });

  test('throws error if retries exceed maxRetries on 429', async () => {
    const queue = new RequestQueue({ intervalMs: 5, maxRetries: 2 });
    let attempts = 0;

    await assert.rejects(
      async () => {
        await queue.enqueue(async () => {
          attempts++;
          throw new Error('429 Too Many Requests');
        }, 'foreground');
      },
      /429/
    );

    assert.strictEqual(attempts, 3);
  });

  test('times out and rejects when request exceeds timeoutMs', async () => {
    const queue = new RequestQueue({ intervalMs: 5, timeoutMs: 50 });

    await assert.rejects(
      async () => {
        await queue.enqueue(
          () => new Promise((resolve) => setTimeout(() => resolve('too slow'), 200)),
          'foreground'
        );
      },
      /timeout/i
    );
  });
});
