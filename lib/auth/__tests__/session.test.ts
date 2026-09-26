import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import * as authSession from '@/lib/auth/session';

describe('SIWE Iron-Session Configuration & Helpers (TICKET-12)', () => {
  const rootDir = process.cwd();
  const sessionPath = path.join(rootDir, 'lib', 'auth', 'session.ts');

  test('lib/auth/session.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(sessionPath), true, 'lib/auth/session.ts must exist');
  });

  test('exports sessionOptions with secure defaults', () => {
    assert.ok(authSession.sessionOptions, 'sessionOptions must be exported');
    assert.strictEqual(authSession.sessionOptions.cookieName, 'scout_session');
    assert.ok(authSession.sessionOptions.password, 'password must be defined');
    assert.strictEqual(authSession.sessionOptions.cookieOptions?.httpOnly, true);
    assert.strictEqual(authSession.sessionOptions.cookieOptions?.sameSite, 'strict');
  });

  test('exports getSession helper function and initializes session with store', async () => {
    assert.strictEqual(typeof authSession.getSession, 'function');

    const storeMap = new Map<string, string>();
    const mockCookieStore: authSession.CookieStoreLike = {
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

    const session = await authSession.getSession(mockCookieStore);
    assert.ok(session);
    assert.strictEqual(session.wallet_address, undefined);
    assert.strictEqual(session.nonce, undefined);

    session.nonce = 'test-nonce-12345';
    await session.save();

    const reloadedSession = await authSession.getSession(mockCookieStore);
    assert.strictEqual(reloadedSession.nonce, 'test-nonce-12345');
  });
});
