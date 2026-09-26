import { type PublicClient } from "viem";

export interface TokenInfoResult {
  address: `0x${string}`;
  name?: string;
  symbol?: string;
  deployer?: `0x${string}`;
  phase?: number;
  totalVolume?: bigint;
  exists: boolean;
}

export type MulticallClient = Pick<PublicClient, "multicall">;

export interface EventFilterParams {
  fromBlock?: bigint;
  toBlock?: bigint;
}

export interface TokenLaunchedFilterParams extends EventFilterParams {
  token?: `0x${string}`;
  deployer?: `0x${string}`;
}

export interface CurveBuyFilterParams extends EventFilterParams {
  token?: `0x${string}`;
  buyer?: `0x${string}`;
}

export interface CurveSellFilterParams extends EventFilterParams {
  token?: `0x${string}`;
  seller?: `0x${string}`;
}

export interface PoolGraduatedFilterParams extends EventFilterParams {
  token?: `0x${string}`;
  pool?: `0x${string}`;
}

export interface TokenLaunchedEventData {
  token: `0x${string}`;
  deployer: `0x${string}`;
  name: string;
  symbol: string;
  blockTimestamp: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
}

export interface CurveBuyEventData {
  token: `0x${string}`;
  buyer: `0x${string}`;
  amountIn: bigint;
  amountOut: bigint;
  fee: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
}

export interface CurveSellEventData {
  token: `0x${string}`;
  seller: `0x${string}`;
  amountIn: bigint;
  amountOut: bigint;
  fee: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
}

export interface PoolGraduatedEventData {
  token: `0x${string}`;
  pool: `0x${string}`;
  reserveToken: bigint;
  reserveEth: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
}

export type EventsClient = Pick<PublicClient, "getLogs">;
