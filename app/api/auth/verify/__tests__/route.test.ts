import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { SiweMessage, generateNonce } from 'siwe';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { POST, handleVerify } from '@/app/api/auth/verify/route';
import { getSession, type CookieStoreLike } from '@/lib/auth/session';
import type { Database } from '@/lib/db';

describe('SIWE Verify Endpoint (POST /api/auth/verify) (TICKET-13)', () => {
  const rootDir = process.cwd();
  const routePath = path.join(rootDir, 'app', 'api', 'auth', 'verify', 'route.ts');

  function createMockStore(options?: { throwOnSet?: boolean }): CookieStoreLike {
    const storeMap = new Map<string, string>();
    return {
      get(name: string) {
        const val = storeMap.get(name);
        return val ? { name, value: val } : undefined;
      },
      set(name: string, value: string) {
        if (options?.throwOnSet) {
          throw new Error('Cookie write failed');
        }
        storeMap.set(name, value);
      },
      delete(name: string) {
        storeMap.delete(name);
      },
    };
  }

  test('app/api/auth/verify/route.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(routePath), true, 'app/api/auth/verify/route.ts must exist');
  });

  test('exports POST route handler and handleVerify function', () => {
    assert.strictEqual(typeof POST, 'function', 'POST handler must be exported');
    assert.strictEqual(typeof handleVerify, 'function', 'handleVerify must be exported');
  });

  test('returns 400 for invalid JSON or missing parameters', async () => {
    const mockStore = createMockStore();
    const invalidRequest = new Request('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    });

    const response = await handleVerify(invalidRequest, mockStore);
    assert.strictEqual(response.status, 400);
    const body = await response.json();
    assert.ok(body.error);
  });

  test('returns 400 when body is not valid JSON string', async () => {
    const mockStore = createMockStore();
    const invalidRequest = new Request('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json-{',
    });

    const response = await handleVerify(invalidRequest, mockStore);
    assert.strictEqual(response.status, 400);
    const body = await response.json();
    assert.strictEqual(body.error, 'Invalid JSON body');
  });

  test('returns 422 when session nonce is missing', async () => {
    const mockStore = createMockStore();
    const request = new Request('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'dummy', signature: '0x123' }),
    });

    const response = await handleVerify(request, mockStore);
    assert.strictEqual(response.status, 422);
    const body = await response.json();
    assert.strictEqual(body.error, 'Session nonce missing or expired');
  });

  test('returns 400 when SIWE message format is malformed', async () => {
    const mockStore = createMockStore();
    const session = await getSession(mockStore);
    session.nonce = generateNonce();
    await session.save();

    const request = new Request('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'not-a-valid-siwe-message', signature: '0x123' }),
    });

    const response = await handleVerify(request, mockStore);
    assert.strictEqual(response.status, 400);
  });

  test('returns 422 when signature verification fails', async () => {
    const mockStore = createMockStore();
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const sessionNonce = generateNonce();
    const wrongNonce = generateNonce();

    const session = await getSession(mockStore);
    session.nonce = sessionNonce;
    await session.save();

    const siwe = new SiweMessage({
      domain: 'localhost',
      address: account.address,
      statement: 'Sign in to Scout',
      uri: 'http://localhost:3000',
      version: '1',
      chainId: 4663,
      nonce: wrongNonce,
    });
    const message = siwe.prepareMessage();
    const signature = await account.signMessage({ message });

    const request = new Request('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });

    const response = await handleVerify(request, mockStore);
    assert.strictEqual(response.status, 422);
    const body = await response.json();
    assert.ok(body.error);
  });

  test('returns 500 when session saving fails', async () => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const validNonce = generateNonce();

    const normalStore = createMockStore();
    const session = await getSession(normalStore);
    session.nonce = validNonce;
    await session.save();

    const cookieVal = normalStore.get('scout_session')?.value;
    assert.ok(cookieVal);

    const failingStore: CookieStoreLike = {
      get(name: string) {
        if (name === 'scout_session') return { name, value: cookieVal };
        return undefined;
      },
      set() {
        throw new Error('Session save storage failure');
      },
      delete() {},
    };

    const siwe = new SiweMessage({
      domain: 'localhost',
      address: account.address,
      statement: 'Sign in to Scout',
      uri: 'http://localhost:3000',
      version: '1',
      chainId: 4663,
      nonce: validNonce,
    });
    const message = siwe.prepareMessage();
    const signature = await account.signMessage({ message });

    const request = new Request('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });

    const response = await handleVerify(request, failingStore);
    assert.strictEqual(response.status, 500);
    const body = await response.json();
    assert.ok(body.error.includes('Session save storage failure'));
  });

  test('returns 500 when database client is unavailable or returns error', async () => {
    const mockStore = createMockStore();
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const validNonce = generateNonce();

    const session = await getSession(mockStore);
    session.nonce = validNonce;
    await session.save();

    const siwe = new SiweMessage({
      domain: 'localhost',
      address: account.address,
      statement: 'Sign in to Scout',
      uri: 'http://localhost:3000',
      version: '1',
      chainId: 4663,
      nonce: validNonce,
    });
    const message = siwe.prepareMessage();
    const signature = await account.signMessage({ message });

    const createReq = () =>
      new Request('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

    const responseNullDb = await handleVerify(createReq(), mockStore, null);
    assert.strictEqual(responseNullDb.status, 500);
    const bodyNullDb = await responseNullDb.json();
    assert.strictEqual(bodyNullDb.error, 'Database client is unavailable');

    const failingDb = {
      insert: () => ({
        values: () => ({
          onConflictDoNothing: async () => {
            throw new Error('Connection pool exhausted');
          },
        }),
      }),
    } as unknown as Database;

    session.nonce = validNonce;
    await session.save();

    const responseFailingDb = await handleVerify(createReq(), mockStore, failingDb);
    assert.strictEqual(responseFailingDb.status, 500);
    const bodyFailingDb = await responseFailingDb.json();
    assert.strictEqual(bodyFailingDb.error, 'Connection pool exhausted');
  });

  test('verifies valid signature, clears nonce, sets session wallet_address, and returns ok: true', async () => {
    const mockStore = createMockStore();
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const validNonce = generateNonce();

    const session = await getSession(mockStore);
    session.nonce = validNonce;
    await session.save();

    const siwe = new SiweMessage({
      domain: 'localhost',
      address: account.address,
      statement: 'Sign in to Scout',
      uri: 'http://localhost:3000',
      version: '1',
      chainId: 4663,
      nonce: validNonce,
    });
    const message = siwe.prepareMessage();
    const signature = await account.signMessage({ message });

    const request = new Request('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });

    const mockDb = {
      insert: () => ({
        values: () => ({
          onConflictDoNothing: async () => ({ rowCount: 1 }),
        }),
      }),
    } as unknown as Database;

    const response = await handleVerify(request, mockStore, mockDb);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.deepStrictEqual(body, { ok: true });

    const updatedSession = await getSession(mockStore);
    assert.strictEqual(updatedSession.nonce, undefined, 'Nonce must be cleared after verification');
    assert.strictEqual(updatedSession.wallet_address?.toLowerCase(), account.address.toLowerCase());
  });
});
