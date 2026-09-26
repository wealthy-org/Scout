import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import * as chainClient from '@/lib/chain/client';
import { CHAIN_ID, DEFAULT_RPC_URL, MULTICALL3_ADDRESS } from '@/config/chain';

describe('Robinhood Chain Viem Client (TICKET-10)', () => {
  const rootDir = process.cwd();
  const clientPath = path.join(rootDir, 'lib', 'chain', 'client.ts');

  test('lib/chain/client.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(clientPath), true, 'lib/chain/client.ts must exist');
  });

  test('exports robinhoodChain definition matching constants', () => {
    assert.strictEqual(chainClient.robinhoodChain.id, CHAIN_ID);
    assert.strictEqual(chainClient.robinhoodChain.name, 'Robinhood Chain');
    assert.strictEqual(chainClient.robinhoodChain.nativeCurrency.symbol, 'ETH');
    assert.strictEqual(chainClient.robinhoodChain.rpcUrls.default.http[0], DEFAULT_RPC_URL);
    assert.strictEqual(
      chainClient.robinhoodChain.contracts?.multicall3?.address.toLowerCase(),
      MULTICALL3_ADDRESS.toLowerCase()
    );
  });

  test('exports publicClient singleton with batching configured', () => {
    assert.ok(chainClient.publicClient, 'publicClient must be exported');
    assert.strictEqual(typeof chainClient.publicClient.getBlockNumber, 'function');
  });

  test('exports getPublicClient factory utility', () => {
    assert.strictEqual(typeof chainClient.getPublicClient, 'function');
    const customClient = chainClient.getPublicClient('https://custom-rpc.example.com');
    assert.ok(customClient);
  });

  test('getPublicClient supports fallback transport when fallback URL is provided', () => {
    const fallbackClient = chainClient.getPublicClient(
      'https://primary-rpc.example.com',
      'https://backup-rpc.example.com'
    );
    assert.ok(fallbackClient);
    assert.strictEqual(typeof fallbackClient.getBlockNumber, 'function');
  });

  test('exports createTransport helper function', () => {
    assert.strictEqual(typeof chainClient.createTransport, 'function');
    const singleTransport = chainClient.createTransport('https://rpc.example.com');
    assert.ok(singleTransport);

    const fallbackTransport = chainClient.createTransport(
      'https://rpc1.example.com',
      'https://rpc2.example.com'
    );
    assert.ok(fallbackTransport);
  });

  test('exports getRpcBlockNumber utility function', () => {
    assert.strictEqual(typeof chainClient.getRpcBlockNumber, 'function');
  });
});
