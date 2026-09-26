import { createPublicClient, http, fallback, defineChain } from "viem";
import { CHAIN_ID, DEFAULT_RPC_URL, MULTICALL3_ADDRESS, FIRST_BLOCK } from "@/config/chain";

export const robinhoodChain = defineChain({
  id: CHAIN_ID,
  name: "Robinhood Chain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [DEFAULT_RPC_URL],
    },
    public: {
      http: [DEFAULT_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Explorer",
      url: "https://explorer.mainnet.chain.robinhood.com",
    },
  },
  contracts: {
    multicall3: {
      address: MULTICALL3_ADDRESS,
      blockCreated: FIRST_BLOCK,
    },
  },
});

export function createTransport(rpcUrl?: string, fallbackUrl?: string) {
  const primary = rpcUrl || process.env.RPC_URL || DEFAULT_RPC_URL;
  const secondary = fallbackUrl || process.env.RPC_URL_FALLBACK;

  if (secondary) {
    return fallback([
      http(primary, { retryCount: 3 }),
      http(secondary, { retryCount: 3 }),
    ]);
  }

  return http(primary, { retryCount: 3 });
}

export function getPublicClient(customRpcUrl?: string, customFallbackUrl?: string) {
  return createPublicClient({
    chain: robinhoodChain,
    transport: createTransport(customRpcUrl, customFallbackUrl),
    batch: {
      multicall: true,
    },
  });
}

export const publicClient = getPublicClient();

export async function getRpcBlockNumber(): Promise<bigint> {
  return publicClient.getBlockNumber();
}
