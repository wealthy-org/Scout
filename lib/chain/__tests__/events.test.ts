import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import {
  fetchTokenLaunched,
  fetchCurveBuy,
  fetchCurveSell,
  fetchPoolGraduated,
  type EventsClient,
} from '@/lib/chain/events';

describe('Pons V2 Event Logs Helpers with Range Splitting (TICKET-16)', () => {
  const rootDir = process.cwd();
  const eventsPath = path.join(rootDir, 'lib', 'chain', 'events.ts');

  test('lib/chain/events.ts file must exist', () => {
    assert.strictEqual(fs.existsSync(eventsPath), true, 'lib/chain/events.ts must exist');
  });

  test('exports all 4 event fetcher functions', () => {
    assert.strictEqual(typeof fetchTokenLaunched, 'function');
    assert.strictEqual(typeof fetchCurveBuy, 'function');
    assert.strictEqual(typeof fetchCurveSell, 'function');
    assert.strictEqual(typeof fetchPoolGraduated, 'function');
  });

  test('fetchTokenLaunched parses and returns events correctly on normal range', async () => {
    const mockToken = '0x1111111111111111111111111111111111111111';
    const mockDeployer = '0x2222222222222222222222222222222222222222';
    const mockTx = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    const mockClient = {
      getLogs: async () => {
        return [
          {
            args: {
              token: mockToken,
              deployer: mockDeployer,
              name: 'Scout Token',
              symbol: 'SCOUT',
              blockTimestamp: BigInt(1700000000),
            },
            blockNumber: BigInt(27027400),
            transactionHash: mockTx,
            logIndex: 0,
          },
        ];
      },
    } as unknown as EventsClient;

    const events = await fetchTokenLaunched({ fromBlock: BigInt(27027321), toBlock: BigInt(27027500) }, mockClient);

    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0].token, mockToken);
    assert.strictEqual(events[0].deployer, mockDeployer);
    assert.strictEqual(events[0].name, 'Scout Token');
    assert.strictEqual(events[0].symbol, 'SCOUT');
    assert.strictEqual(events[0].blockTimestamp, BigInt(1700000000));
    assert.strictEqual(events[0].blockNumber, BigInt(27027400));
    assert.strictEqual(events[0].transactionHash, mockTx);
    assert.strictEqual(events[0].logIndex, 0);
  });

  test('fetchCurveBuy and fetchCurveSell parse trade logs correctly', async () => {
    const mockToken = '0x1111111111111111111111111111111111111111';
    const mockBuyer = '0x3333333333333333333333333333333333333333';
    const mockSeller = '0x4444444444444444444444444444444444444444';

    const mockBuyClient = {
      getLogs: async () => [
        {
          args: {
            token: mockToken,
            buyer: mockBuyer,
            amountIn: BigInt('1000000000000000000'),
            amountOut: BigInt('50000000000000000000'),
            fee: BigInt('10000000000000000'),
          },
          blockNumber: BigInt(27027450),
          transactionHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          logIndex: 1,
        },
      ],
    } as unknown as EventsClient;

    const buyEvents = await fetchCurveBuy({ token: mockToken as `0x${string}` }, mockBuyClient);
    assert.strictEqual(buyEvents.length, 1);
    assert.strictEqual(buyEvents[0].buyer, mockBuyer);
    assert.strictEqual(buyEvents[0].amountIn, BigInt('1000000000000000000'));
    assert.strictEqual(buyEvents[0].amountOut, BigInt('50000000000000000000'));

    const mockSellClient = {
      getLogs: async () => [
        {
          args: {
            token: mockToken,
            seller: mockSeller,
            amountIn: BigInt('50000000000000000000'),
            amountOut: BigInt('950000000000000000'),
            fee: BigInt('10000000000000000'),
          },
          blockNumber: BigInt(27027460),
          transactionHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
          logIndex: 2,
        },
      ],
    } as unknown as EventsClient;

    const sellEvents = await fetchCurveSell({ token: mockToken as `0x${string}` }, mockSellClient);
    assert.strictEqual(sellEvents.length, 1);
    assert.strictEqual(sellEvents[0].seller, mockSeller);
    assert.strictEqual(sellEvents[0].amountIn, BigInt('50000000000000000000'));
    assert.strictEqual(sellEvents[0].amountOut, BigInt('950000000000000000'));
  });

  test('fetchPoolGraduated parses graduation logs correctly', async () => {
    const mockToken = '0x1111111111111111111111111111111111111111';
    const mockPool = '0x5555555555555555555555555555555555555555';

    const mockGradClient = {
      getLogs: async () => [
        {
          args: {
            token: mockToken,
            pool: mockPool,
            reserveToken: BigInt('200000000000000000000'),
            reserveEth: BigInt('4000000000000000000'),
          },
          blockNumber: BigInt(27027500),
          transactionHash: '0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
          logIndex: 0,
        },
      ],
    } as unknown as EventsClient;

    const gradEvents = await fetchPoolGraduated({ token: mockToken as `0x${string}` }, mockGradClient);
    assert.strictEqual(gradEvents.length, 1);
    assert.strictEqual(gradEvents[0].token, mockToken);
    assert.strictEqual(gradEvents[0].pool, mockPool);
    assert.strictEqual(gradEvents[0].reserveToken, BigInt('200000000000000000000'));
    assert.strictEqual(gradEvents[0].reserveEth, BigInt('4000000000000000000'));
  });

  test('automatically splits block range when RPC returns query limit exceeded and merges sorted logs', async () => {
    const mockToken = '0x1111111111111111111111111111111111111111';
    const mockDeployer = '0x2222222222222222222222222222222222222222';

    const callsMade: Array<{ fromBlock?: bigint; toBlock?: bigint }> = [];

    const mockSplittingClient = {
      getLogs: async (params: { fromBlock?: bigint; toBlock?: bigint }) => {
        callsMade.push({ fromBlock: params.fromBlock, toBlock: params.toBlock });

        if (params.fromBlock === BigInt(100) && params.toBlock === BigInt(200)) {
          throw new Error('query returned more than 10000 results (limit exceeded)');
        }

        if (params.fromBlock === BigInt(100) && params.toBlock === BigInt(150)) {
          return [
            {
              args: {
                token: mockToken,
                deployer: mockDeployer,
                name: 'Token 1',
                symbol: 'TK1',
                blockTimestamp: BigInt(1700000010),
              },
              blockNumber: BigInt(120),
              transactionHash: '0x1111',
              logIndex: 0,
            },
          ];
        }

        if (params.fromBlock === BigInt(151) && params.toBlock === BigInt(200)) {
          return [
            {
              args: {
                token: mockToken,
                deployer: mockDeployer,
                name: 'Token 2',
                symbol: 'TK2',
                blockTimestamp: BigInt(1700000020),
              },
              blockNumber: BigInt(180),
              transactionHash: '0x2222',
              logIndex: 0,
            },
          ];
        }

        return [];
      },
    } as unknown as EventsClient;

    const events = await fetchTokenLaunched(
      { fromBlock: BigInt(100), toBlock: BigInt(200) },
      mockSplittingClient
    );

    assert.strictEqual(events.length, 2);
    assert.strictEqual(events[0].name, 'Token 1');
    assert.strictEqual(events[1].name, 'Token 2');
    assert.strictEqual(callsMade.length, 3);
    assert.deepStrictEqual(callsMade[0], { fromBlock: BigInt(100), toBlock: BigInt(200) });
    assert.deepStrictEqual(callsMade[1], { fromBlock: BigInt(100), toBlock: BigInt(150) });
    assert.deepStrictEqual(callsMade[2], { fromBlock: BigInt(151), toBlock: BigInt(200) });
  });

  test('fails fast and throws error when range cannot be split further (single block failure)', async () => {
    const mockFailingClient = {
      getLogs: async () => {
        throw new Error('query returned more than 10000 results');
      },
    } as unknown as EventsClient;

    await assert.rejects(
      async () => {
        await fetchTokenLaunched({ fromBlock: BigInt(100), toBlock: BigInt(100) }, mockFailingClient);
      },
      /query returned more than 10000 results/
    );
  });
});
