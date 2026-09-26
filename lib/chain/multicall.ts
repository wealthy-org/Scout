import { getAddress, isAddress, zeroAddress } from "viem";
import { FACTORY_ADDRESS, GET_LAUNCHED_TOKEN_ABI } from "@/config/chain";
import { publicClient } from "@/lib/chain/client";
import type { TokenInfoResult, MulticallClient } from "@/types/chain";

export type { TokenInfoResult, MulticallClient };

export const ERC20_NAME_ABI = {
  inputs: [],
  name: "name",
  outputs: [{ name: "", type: "string" }],
  stateMutability: "view",
  type: "function",
} as const;

export const ERC20_SYMBOL_ABI = {
  inputs: [],
  name: "symbol",
  outputs: [{ name: "", type: "string" }],
  stateMutability: "view",
  type: "function",
} as const;

export async function batchGetTokenInfo(
  addresses: string[],
  client: MulticallClient = publicClient
): Promise<TokenInfoResult[]> {
  if (!addresses || addresses.length === 0) {
    return [];
  }

  const validAddresses: `0x${string}`[] = [];
  for (const addr of addresses) {
    if (isAddress(addr)) {
      validAddresses.push(getAddress(addr));
    }
  }

  if (validAddresses.length === 0) {
    return [];
  }

  const contracts = validAddresses.flatMap((tokenAddr) => [
    {
      address: FACTORY_ADDRESS,
      abi: [GET_LAUNCHED_TOKEN_ABI],
      functionName: "getLaunchedToken" as const,
      args: [tokenAddr] as const,
    },
    {
      address: tokenAddr,
      abi: [ERC20_NAME_ABI],
      functionName: "name" as const,
    },
    {
      address: tokenAddr,
      abi: [ERC20_SYMBOL_ABI],
      functionName: "symbol" as const,
    },
  ]);

  const results = await client.multicall({
    contracts,
    allowFailure: true,
  });

  const tokenInfoResults: TokenInfoResult[] = [];

  for (let i = 0; i < validAddresses.length; i++) {
    const tokenAddr = validAddresses[i];
    const launchedCall = results[i * 3];
    const nameCall = results[i * 3 + 1];
    const symbolCall = results[i * 3 + 2];

    let name: string | undefined;
    let symbol: string | undefined;
    let deployer: `0x${string}` | undefined;
    let phase: number | undefined;
    let totalVolume: bigint | undefined;
    let exists = false;

    if (nameCall && nameCall.status === "success" && typeof nameCall.result === "string") {
      name = nameCall.result;
    }

    if (symbolCall && symbolCall.status === "success" && typeof symbolCall.result === "string") {
      symbol = symbolCall.result;
    }

    if (launchedCall && launchedCall.status === "success" && launchedCall.result) {
      const data = launchedCall.result as
        | [string, number, bigint]
        | { deployer: string; phase: number; totalVolume: bigint };
      let dep: string;
      let ph: number;
      let vol: bigint;

      if (Array.isArray(data)) {
        dep = data[0];
        ph = Number(data[1]);
        vol = BigInt(data[2]);
      } else {
        dep = data.deployer;
        ph = Number(data.phase);
        vol = BigInt(data.totalVolume);
      }

      if (dep && dep.toLowerCase() !== zeroAddress.toLowerCase()) {
        deployer = getAddress(dep);
        phase = ph;
        totalVolume = vol;
        exists = true;
      }
    }

    tokenInfoResults.push({
      address: tokenAddr,
      name,
      symbol,
      deployer,
      phase,
      totalVolume,
      exists,
    });
  }

  return tokenInfoResults;
}
