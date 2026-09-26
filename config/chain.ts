export const CHAIN_ID = 4663 as const;
export const DEFAULT_RPC_URL = "https://rpc.mainnet.chain.robinhood.com" as const;
export const FACTORY_ADDRESS = "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e" as const;
export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;
export const FIRST_BLOCK = 27_027_321 as const;

export const TOKEN_LAUNCHED_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "token", type: "address" },
    { indexed: true, name: "deployer", type: "address" },
    { indexed: false, name: "name", type: "string" },
    { indexed: false, name: "symbol", type: "string" },
    { indexed: false, name: "blockTimestamp", type: "uint256" },
  ],
  name: "TokenLaunched",
  type: "event",
} as const;

export const CURVE_BUY_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "token", type: "address" },
    { indexed: true, name: "buyer", type: "address" },
    { indexed: false, name: "amountIn", type: "uint256" },
    { indexed: false, name: "amountOut", type: "uint256" },
    { indexed: false, name: "fee", type: "uint256" },
  ],
  name: "CurveBuy",
  type: "event",
} as const;

export const CURVE_SELL_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "token", type: "address" },
    { indexed: true, name: "seller", type: "address" },
    { indexed: false, name: "amountIn", type: "uint256" },
    { indexed: false, name: "amountOut", type: "uint256" },
    { indexed: false, name: "fee", type: "uint256" },
  ],
  name: "CurveSell",
  type: "event",
} as const;

export const POOL_GRADUATED_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "token", type: "address" },
    { indexed: true, name: "pool", type: "address" },
    { indexed: false, name: "reserveToken", type: "uint256" },
    { indexed: false, name: "reserveEth", type: "uint256" },
  ],
  name: "PoolGraduated",
  type: "event",
} as const;

export const GET_LAUNCHED_TOKEN_ABI = {
  inputs: [{ name: "token", type: "address" }],
  name: "getLaunchedToken",
  outputs: [
    { name: "deployer", type: "address" },
    { name: "phase", type: "uint8" },
    { name: "totalVolume", type: "uint256" },
  ],
  stateMutability: "view",
  type: "function",
} as const;

export const PONS_FACTORY_ABI = [
  TOKEN_LAUNCHED_ABI,
  CURVE_BUY_ABI,
  CURVE_SELL_ABI,
  POOL_GRADUATED_ABI,
  GET_LAUNCHED_TOKEN_ABI,
] as const;

export const robinhoodChain = {
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
} as const;
