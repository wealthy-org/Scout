import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { POST, handleNonce } from '@/app/api/auth/nonce/route';
import { getSession, type CookieStoreLike } from '@/lib/auth/session';

describe('SIWE Nonce Endpoint (POST /api/auth/nonce) (TICKET-12)', () => {
  const rootDir = process.cwd();
  const routePath = path.join(rootDir, 'app', 'api', 'auth', 'nonce', 'route.ts');

  test('app/api/auth/nonce/route.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(routePath), true, 'app/api/auth/nonce/route.ts must exist');
  });

  test('exports POST route handler and handleNonce function', () => {
    assert.strictEqual(typeof POST, 'function', 'POST handler must be exported');
    assert.strictEqual(typeof handleNonce, 'function', 'handleNonce must be exported');
  });

  test('handleNonce returns 200 with generated nonce string and stores in session', async () => {
    const storeMap = new Map<string, string>();
    const mockCookieStore: CookieStoreLike = {
      get(name: string) {
        const val = storeMap.get(name);
        return val ? { name, value: val } : undefined;
      },
      set(name: string, value: string) {
        storeMap.set(name, value);
      },
      delete(name: string) {
        storeMap.delete(name);
      },
    };

    const response = await handleNonce(mockCookieStore);
    assert.strictEqual(response.status, 200);

    const body = (await response.json()) as { nonce: string };
    assert.ok(body.nonce, 'Response body must contain nonce string');
    assert.strictEqual(typeof body.nonce, 'string');
    assert.strictEqual(body.nonce.length >= 8, true);

    const session = await getSession(mockCookieStore);
    assert.strictEqual(session.nonce, body.nonce, 'Session nonce must match generated nonce');
  });
});
