import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import * as chainConfig from '@/config/chain';

describe('Robinhood Chain & Pons V2 On-Chain Configuration (TICKET-02)', () => {
  const rootDir = process.cwd();
  const chainConfigPath = path.join(rootDir, 'config', 'chain.ts');

  test('config/chain.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(chainConfigPath), true, 'config/chain.ts must exist');
  });

  test('config/chain.ts exports exact numerical and address constants', () => {
    assert.strictEqual(chainConfig.CHAIN_ID, 4663, 'CHAIN_ID must be 4663');
    assert.strictEqual(
      chainConfig.DEFAULT_RPC_URL,
      'https://rpc.mainnet.chain.robinhood.com',
      'DEFAULT_RPC_URL must match Robinhood Chain mainnet RPC'
    );
    assert.strictEqual(
      chainConfig.FACTORY_ADDRESS.toLowerCase(),
      '0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e',
      'FACTORY_ADDRESS must match Pons V2 Factory address'
    );
    assert.strictEqual(
      chainConfig.MULTICALL3_ADDRESS.toLowerCase(),
      '0xca11bde05977b3631167028862be2a173976ca11',
      'MULTICALL3_ADDRESS must match standard Multicall3 contract address'
    );
    assert.strictEqual(
      chainConfig.FIRST_BLOCK,
      27027321,
      'FIRST_BLOCK must be 27_027_321 (Pons V2 deployment block)'
    );
  });

  test('config/chain.ts exports valid ABI for TokenLaunched event', () => {
    assert.ok(chainConfig.TOKEN_LAUNCHED_ABI, 'TOKEN_LAUNCHED_ABI must be exported');
    assert.strictEqual(chainConfig.TOKEN_LAUNCHED_ABI.type, 'event');
    assert.strictEqual(chainConfig.TOKEN_LAUNCHED_ABI.name, 'TokenLaunched');
    assert.strictEqual(chainConfig.TOKEN_LAUNCHED_ABI.inputs.length, 5);
  });

  test('config/chain.ts exports valid ABI for CurveBuy event', () => {
    assert.ok(chainConfig.CURVE_BUY_ABI, 'CURVE_BUY_ABI must be exported');
    assert.strictEqual(chainConfig.CURVE_BUY_ABI.type, 'event');
    assert.strictEqual(chainConfig.CURVE_BUY_ABI.name, 'CurveBuy');
  });

  test('config/chain.ts exports valid ABI for CurveSell event', () => {
    assert.ok(chainConfig.CURVE_SELL_ABI, 'CURVE_SELL_ABI must be exported');
    assert.strictEqual(chainConfig.CURVE_SELL_ABI.type, 'event');
    assert.strictEqual(chainConfig.CURVE_SELL_ABI.name, 'CurveSell');
  });

  test('config/chain.ts exports valid ABI for PoolGraduated event', () => {
    assert.ok(chainConfig.POOL_GRADUATED_ABI, 'POOL_GRADUATED_ABI must be exported');
    assert.strictEqual(chainConfig.POOL_GRADUATED_ABI.type, 'event');
    assert.strictEqual(chainConfig.POOL_GRADUATED_ABI.name, 'PoolGraduated');
  });

  test('config/chain.ts exports valid ABI for getLaunchedToken function', () => {
    assert.ok(chainConfig.GET_LAUNCHED_TOKEN_ABI, 'GET_LAUNCHED_TOKEN_ABI must be exported');
    assert.strictEqual(chainConfig.GET_LAUNCHED_TOKEN_ABI.type, 'function');
    assert.strictEqual(chainConfig.GET_LAUNCHED_TOKEN_ABI.name, 'getLaunchedToken');
  });

  test('config/chain.ts exports aggregate PONS_FACTORY_ABI array', () => {
    assert.ok(Array.isArray(chainConfig.PONS_FACTORY_ABI), 'PONS_FACTORY_ABI must be an array');
    assert.ok(chainConfig.PONS_FACTORY_ABI.length >= 5, 'PONS_FACTORY_ABI must contain all events and functions');
  });
});
