import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { POST, handleLogout } from '@/app/api/auth/logout/route';
import { getSession, type CookieStoreLike } from '@/lib/auth/session';

describe('SIWE Logout Endpoint (POST /api/auth/logout) (TICKET-14)', () => {
  const rootDir = process.cwd();
  const routePath = path.join(rootDir, 'app', 'api', 'auth', 'logout', 'route.ts');

  test('app/api/auth/logout/route.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(routePath), true, 'app/api/auth/logout/route.ts must exist');
  });

  test('exports POST route handler and handleLogout function', () => {
    assert.strictEqual(typeof POST, 'function', 'POST handler must be exported');
    assert.strictEqual(typeof handleLogout, 'function', 'handleLogout must be exported');
  });

  test('destroys active session and returns ok: true', async () => {
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

    const session = await getSession(mockCookieStore);
    session.wallet_address = '0x1234567890123456789012345678901234567890';
    await session.save();

    assert.ok(mockCookieStore.get('scout_session')?.value);

    const response = await handleLogout(mockCookieStore);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.deepStrictEqual(body, { ok: true });

    assert.strictEqual(mockCookieStore.get('scout_session')?.value, undefined);
  });
});
