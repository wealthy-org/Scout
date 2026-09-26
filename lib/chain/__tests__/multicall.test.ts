import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { zeroAddress } from 'viem';
import { batchGetTokenInfo, ERC20_NAME_ABI, ERC20_SYMBOL_ABI, type MulticallClient } from '@/lib/chain/multicall';

describe('Multicall3 Batch Token Info Helper (TICKET-15)', () => {
  const rootDir = process.cwd();
  const multicallPath = path.join(rootDir, 'lib', 'chain', 'multicall.ts');

  test('lib/chain/multicall.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(multicallPath), true, 'lib/chain/multicall.ts must exist');
  });

  test('exports batchGetTokenInfo, ERC20_NAME_ABI, and ERC20_SYMBOL_ABI', () => {
    assert.strictEqual(typeof batchGetTokenInfo, 'function');
    assert.strictEqual(ERC20_NAME_ABI.name, 'name');
    assert.strictEqual(ERC20_SYMBOL_ABI.name, 'symbol');
  });

  test('returns empty array when addresses list is empty or invalid', async () => {
    const emptyResult = await batchGetTokenInfo([]);
    assert.deepStrictEqual(emptyResult, []);

    const invalidAddressResult = await batchGetTokenInfo(['not-an-address', '123']);
    assert.deepStrictEqual(invalidAddressResult, []);
  });

  test('constructs multicall query and formats results accurately on success', async () => {
    const token1 = '0x1111111111111111111111111111111111111111';
    const token2 = '0x2222222222222222222222222222222222222222';
    const deployer1 = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    const mockClient = {
      multicall: async (args: { contracts: readonly unknown[]; allowFailure?: boolean }) => {
        assert.strictEqual(args.allowFailure, true);
        assert.strictEqual(args.contracts.length, 6);

        return [
          { status: 'success' as const, result: [deployer1, 1, BigInt('5000000000000000000')] },
          { status: 'success' as const, result: 'Alpha Token' },
          { status: 'success' as const, result: 'ALPHA' },
          { status: 'success' as const, result: [zeroAddress, 0, BigInt(0)] },
          { status: 'success' as const, result: 'Beta Token' },
          { status: 'success' as const, result: 'BETA' },
        ];
      },
    } as unknown as MulticallClient;

    const results = await batchGetTokenInfo([token1, token2], mockClient);

    assert.strictEqual(results.length, 2);

    assert.strictEqual(results[0].address.toLowerCase(), token1.toLowerCase());
    assert.strictEqual(results[0].name, 'Alpha Token');
    assert.strictEqual(results[0].symbol, 'ALPHA');
    assert.strictEqual(results[0].deployer?.toLowerCase(), deployer1.toLowerCase());
    assert.strictEqual(results[0].phase, 1);
    assert.strictEqual(results[0].totalVolume, BigInt('5000000000000000000'));
    assert.strictEqual(results[0].exists, true);

    assert.strictEqual(results[1].address.toLowerCase(), token2.toLowerCase());
    assert.strictEqual(results[1].name, 'Beta Token');
    assert.strictEqual(results[1].symbol, 'BETA');
    assert.strictEqual(results[1].deployer, undefined);
    assert.strictEqual(results[1].exists, false);
  });

  test('gracefully handles partial call reverts without failing the entire batch', async () => {
    const token1 = '0x3333333333333333333333333333333333333333';
    const deployer1 = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

    const mockClient = {
      multicall: async () => {
        return [
          { status: 'success' as const, result: { deployer: deployer1, phase: 2, totalVolume: BigInt(1000) } },
          { status: 'failure' as const, error: new Error('Execution reverted') },
          { status: 'success' as const, result: 'REV' },
        ];
      },
    } as unknown as MulticallClient;

    const results = await batchGetTokenInfo([token1], mockClient);

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].address.toLowerCase(), token1.toLowerCase());
    assert.strictEqual(results[0].name, undefined);
    assert.strictEqual(results[0].symbol, 'REV');
    assert.strictEqual(results[0].deployer?.toLowerCase(), deployer1.toLowerCase());
    assert.strictEqual(results[0].phase, 2);
    assert.strictEqual(results[0].totalVolume, BigInt(1000));
    assert.strictEqual(results[0].exists, true);
  });
});
