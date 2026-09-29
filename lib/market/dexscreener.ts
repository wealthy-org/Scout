export interface QuoteAssetPrices {
  USDG: number;
  cbBTC: number;
  ETH: number;
}

export interface DexScreenerTokenData {
  chainId?: string;
  pairAddress?: string;
  priceUsd: number;
  fdv: number;
  liquidityUsd: number;
  volume24hUsd: number;
  priceChange24hPct: number;
}

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const CACHE_TTL_MS = 60 * 1000;
let quotePricesCache: CacheEntry<QuoteAssetPrices> | null = null;
const tokenDataCache = new Map<string, CacheEntry<DexScreenerTokenData | null>>();

const FALLBACK_QUOTE_PRICES: QuoteAssetPrices = {
  USDG: 1.0,
  cbBTC: 65000.0,
  ETH: 2600.0,
};

export function clearDexScreenerCache(): void {
  quotePricesCache = null;
  tokenDataCache.clear();
}

export async function getQuoteAssetPrices(): Promise<QuoteAssetPrices> {
  const now = Date.now();
  if (quotePricesCache && now - quotePricesCache.cachedAt < CACHE_TTL_MS) {
    return quotePricesCache.data;
  }

  try {
    const wethAddress = "0x4200000000000000000000000000000000000006";
    const cbBtcAddress = "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf";
    const url = `https://api.dexscreener.com/latest/dex/tokens/${wethAddress},${cbBtcAddress}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return FALLBACK_QUOTE_PRICES;
    }

    const payload = (await res.json()) as {
      pairs?: Array<{
        baseToken?: { symbol?: string };
        priceUsd?: string;
      }>;
    };

    let ethPrice = FALLBACK_QUOTE_PRICES.ETH;
    let cbBtcPrice = FALLBACK_QUOTE_PRICES.cbBTC;

    if (Array.isArray(payload.pairs)) {
      for (const pair of payload.pairs) {
        const symbol = pair.baseToken?.symbol?.toUpperCase();
        const price = parseFloat(pair.priceUsd || "0");
        if (price > 0) {
          if (symbol === "ETH" || symbol === "WETH") {
            ethPrice = price;
          } else if (symbol === "CBBTC" || symbol === "BTC") {
            cbBtcPrice = price;
          }
        }
      }
    }

    const result: QuoteAssetPrices = {
      USDG: 1.0,
      cbBTC: cbBtcPrice,
      ETH: ethPrice,
    };

    quotePricesCache = {
      data: result,
      cachedAt: now,
    };

    return result;
  } catch {
    return FALLBACK_QUOTE_PRICES;
  }
}

function parseMetricNumber(val: unknown, fallback = 0): number {
  if (typeof val === "number" && !Number.isNaN(val)) {
    return val;
  }
  if (typeof val === "string") {
    const num = parseFloat(val);
    if (!Number.isNaN(num)) return num;
  }
  return fallback;
}

export async function fetchDexScreenerTokenData(
  tokenAddress: string
): Promise<DexScreenerTokenData | null> {
  const normalized = tokenAddress.toLowerCase();
  const now = Date.now();
  const existing = tokenDataCache.get(normalized);

  if (existing && now - existing.cachedAt < CACHE_TTL_MS) {
    return existing.data;
  }

  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${normalized}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      tokenDataCache.set(normalized, { data: null, cachedAt: now });
      return null;
    }

    const payload = (await res.json()) as {
      pairs?: Array<{
        chainId?: string;
        pairAddress?: string;
        priceUsd?: string;
        fdv?: number;
        liquidity?: { usd?: number };
        volume?: { h24?: number };
        priceChange?: { h24?: number };
      }>;
    };

    if (!payload.pairs || payload.pairs.length === 0) {
      tokenDataCache.set(normalized, { data: null, cachedAt: now });
      return null;
    }

    const primaryPair = payload.pairs[0];
    const data: DexScreenerTokenData = {
      chainId: primaryPair.chainId,
      pairAddress: primaryPair.pairAddress,
      priceUsd: parseMetricNumber(primaryPair.priceUsd, 0),
      fdv: parseMetricNumber(primaryPair.fdv, 0),
      liquidityUsd: parseMetricNumber(primaryPair.liquidity?.usd, 0),
      volume24hUsd: parseMetricNumber(primaryPair.volume?.h24, 0),
      priceChange24hPct: parseMetricNumber(primaryPair.priceChange?.h24, 0),
    };

    tokenDataCache.set(normalized, { data, cachedAt: now });
    return data;
  } catch {
    return null;
  }
}
