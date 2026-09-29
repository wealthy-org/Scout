import { type Log, type AbiEvent } from "viem";
import {
  FACTORY_ADDRESS,
  FIRST_BLOCK,
  TOKEN_LAUNCHED_ABI,
  CURVE_BUY_ABI,
  CURVE_SELL_ABI,
  POOL_GRADUATED_ABI,
} from "@/config/chain";
import { publicClient } from "@/lib/chain/client";
import type {
  EventFilterParams,
  TokenLaunchedFilterParams,
  CurveBuyFilterParams,
  CurveSellFilterParams,
  PoolGraduatedFilterParams,
  TokenLaunchedEventData,
  CurveBuyEventData,
  CurveSellEventData,
  PoolGraduatedEventData,
  EventsClient,
} from "@/types/chain";

export type {
  EventFilterParams,
  TokenLaunchedFilterParams,
  CurveBuyFilterParams,
  CurveSellFilterParams,
  PoolGraduatedFilterParams,
  TokenLaunchedEventData,
  CurveBuyEventData,
  CurveSellEventData,
  PoolGraduatedEventData,
  EventsClient,
};

interface SplitLogParams {
  client: EventsClient;
  event: AbiEvent;
  args?: Record<string, unknown>;
  fromBlock: bigint;
  toBlock?: bigint;
}

function isRangeSplittableError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    msg.includes("limit") ||
    msg.includes("exceeded") ||
    msg.includes("too large") ||
    msg.includes("too many") ||
    msg.includes("timeout") ||
    msg.includes("range") ||
    msg.includes("413") ||
    msg.includes("block range") ||
    msg.includes("response size")
  );
}

export class ChainEventParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChainEventParseError";
  }
}

function parseRequiredBlockNumber(val: bigint | number | string | null | undefined, ctx: string): bigint {
  if (val === null || val === undefined) {
    throw new ChainEventParseError(`RPC log missing required blockNumber in context: ${ctx}`);
  }
  return BigInt(val);
}

function parseRequiredLogIndex(val: number | string | null | undefined, ctx: string): number {
  if (val === null || val === undefined) {
    throw new ChainEventParseError(`RPC log missing required logIndex in context: ${ctx}`);
  }
  return Number(val);
}

function parseRequiredTxHash(val: `0x${string}` | string | null | undefined, ctx: string): `0x${string}` {
  if (!val || typeof val !== "string" || !val.startsWith("0x")) {
    throw new ChainEventParseError(`RPC log missing required transactionHash in context: ${ctx}`);
  }
  return val as `0x${string}`;
}

export async function getLogsWithSplitting(params: SplitLogParams): Promise<Log[]> {
  const { client, event, args, fromBlock, toBlock } = params;

  try {
    const rawLogs = await client.getLogs({
      address: FACTORY_ADDRESS,
      event,
      args: args as never,
      fromBlock,
      toBlock,
    } as never);
    return rawLogs as Log[];
  } catch (error: unknown) {
    if (toBlock !== undefined && fromBlock < toBlock && isRangeSplittableError(error)) {
      const mid = fromBlock + (toBlock - fromBlock) / BigInt(2);
      const leftLogs = await getLogsWithSplitting({
        client,
        event,
        args,
        fromBlock,
        toBlock: mid,
      });
      const rightLogs = await getLogsWithSplitting({
        client,
        event,
        args,
        fromBlock: mid + BigInt(1),
        toBlock,
      });

      const combined = [...leftLogs, ...rightLogs];
      combined.sort((a, b) => {
        const blockA = parseRequiredBlockNumber(a.blockNumber, "sort-a");
        const blockB = parseRequiredBlockNumber(b.blockNumber, "sort-b");
        if (blockA !== blockB) {
          return blockA < blockB ? -1 : 1;
        }
        const indexA = parseRequiredLogIndex(a.logIndex, "sort-a");
        const indexB = parseRequiredLogIndex(b.logIndex, "sort-b");
        return indexA - indexB;
      });

      return combined;
    }

    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function fetchTokenLaunched(
  params: TokenLaunchedFilterParams = {},
  client: EventsClient = publicClient
): Promise<TokenLaunchedEventData[]> {
  const args: Record<string, unknown> = {};
  if (params.token) args.token = params.token;
  if (params.deployer) args.deployer = params.deployer;

  const logs = await getLogsWithSplitting({
    client,
    event: TOKEN_LAUNCHED_ABI,
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock: params.fromBlock ?? BigInt(FIRST_BLOCK),
    toBlock: params.toBlock,
  });

  return logs.map((log) => {
    const logArgs = (log as unknown as {
      args: {
        token: `0x${string}`;
        deployer: `0x${string}`;
        name: string;
        symbol: string;
        blockTimestamp: bigint | number | string;
      };
    }).args;

    return {
      token: logArgs.token,
      deployer: logArgs.deployer,
      name: logArgs.name,
      symbol: logArgs.symbol,
      blockTimestamp: BigInt(logArgs.blockTimestamp),
      blockNumber: parseRequiredBlockNumber(log.blockNumber, "token-launched"),
      transactionHash: parseRequiredTxHash(log.transactionHash, "token-launched"),
      logIndex: parseRequiredLogIndex(log.logIndex, "token-launched"),
    };
  });
}

export async function fetchCurveBuy(
  params: CurveBuyFilterParams = {},
  client: EventsClient = publicClient
): Promise<CurveBuyEventData[]> {
  const args: Record<string, unknown> = {};
  if (params.token) args.token = params.token;
  if (params.buyer) args.buyer = params.buyer;

  const logs = await getLogsWithSplitting({
    client,
    event: CURVE_BUY_ABI,
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock: params.fromBlock ?? BigInt(FIRST_BLOCK),
    toBlock: params.toBlock,
  });

  return logs.map((log) => {
    const logArgs = (log as unknown as {
      args: {
        token: `0x${string}`;
        buyer: `0x${string}`;
        amountIn: bigint | number | string;
        amountOut: bigint | number | string;
        fee: bigint | number | string;
      };
    }).args;

    return {
      token: logArgs.token,
      buyer: logArgs.buyer,
      amountIn: BigInt(logArgs.amountIn),
      amountOut: BigInt(logArgs.amountOut),
      fee: BigInt(logArgs.fee),
      blockNumber: parseRequiredBlockNumber(log.blockNumber, "curve-buy"),
      transactionHash: parseRequiredTxHash(log.transactionHash, "curve-buy"),
      logIndex: parseRequiredLogIndex(log.logIndex, "curve-buy"),
    };
  });
}

export async function fetchCurveSell(
  params: CurveSellFilterParams = {},
  client: EventsClient = publicClient
): Promise<CurveSellEventData[]> {
  const args: Record<string, unknown> = {};
  if (params.token) args.token = params.token;
  if (params.seller) args.seller = params.seller;

  const logs = await getLogsWithSplitting({
    client,
    event: CURVE_SELL_ABI,
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock: params.fromBlock ?? BigInt(FIRST_BLOCK),
    toBlock: params.toBlock,
  });

  return logs.map((log) => {
    const logArgs = (log as unknown as {
      args: {
        token: `0x${string}`;
        seller: `0x${string}`;
        amountIn: bigint | number | string;
        amountOut: bigint | number | string;
        fee: bigint | number | string;
      };
    }).args;

    return {
      token: logArgs.token,
      seller: logArgs.seller,
      amountIn: BigInt(logArgs.amountIn),
      amountOut: BigInt(logArgs.amountOut),
      fee: BigInt(logArgs.fee),
      blockNumber: parseRequiredBlockNumber(log.blockNumber, "curve-sell"),
      transactionHash: parseRequiredTxHash(log.transactionHash, "curve-sell"),
      logIndex: parseRequiredLogIndex(log.logIndex, "curve-sell"),
    };
  });
}

export async function fetchPoolGraduated(
  params: PoolGraduatedFilterParams = {},
  client: EventsClient = publicClient
): Promise<PoolGraduatedEventData[]> {
  const args: Record<string, unknown> = {};
  if (params.token) args.token = params.token;
  if (params.pool) args.pool = params.pool;

  const logs = await getLogsWithSplitting({
    client,
    event: POOL_GRADUATED_ABI,
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock: params.fromBlock ?? BigInt(FIRST_BLOCK),
    toBlock: params.toBlock,
  });

  return logs.map((log) => {
    const logArgs = (log as unknown as {
      args: {
        token: `0x${string}`;
        pool: `0x${string}`;
        reserveToken: bigint | number | string;
        reserveEth: bigint | number | string;
      };
    }).args;

    return {
      token: logArgs.token,
      pool: logArgs.pool,
      reserveToken: BigInt(logArgs.reserveToken),
      reserveEth: BigInt(logArgs.reserveEth),
      blockNumber: parseRequiredBlockNumber(log.blockNumber, "pool-graduated"),
      transactionHash: parseRequiredTxHash(log.transactionHash, "pool-graduated"),
      logIndex: parseRequiredLogIndex(log.logIndex, "pool-graduated"),
    };
  });
}
