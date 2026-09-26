import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import {
  getQuoteAssetPrices,
  fetchDexScreenerTokenData,
  clearDexScreenerCache,
} from "@/lib/market/dexscreener";

describe("DexScreener Quote Assets Price Fetcher (TICKET-44)", () => {
  beforeEach(() => {
    clearDexScreenerCache();
  });

  test("getQuoteAssetPrices returns fallback prices on network error or offline", async () => {
    const originalFetch = global.fetch;
    try {
      global.fetch = async () => {
        throw new Error("Network offline");
      };

      const prices = await getQuoteAssetPrices();
      assert.ok(prices);
      assert.strictEqual(typeof prices.USDG, "number");
      assert.strictEqual(typeof prices.cbBTC, "number");
      assert.strictEqual(typeof prices.ETH, "number");
      assert.strictEqual(prices.USDG, 1.0);
      assert.ok(prices.ETH > 0);
      assert.ok(prices.cbBTC > 0);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("getQuoteAssetPrices parses successful DexScreener responses accurately", async () => {
    const originalFetch = global.fetch;
    try {
      global.fetch = async (url) => {
        const urlStr = String(url);
        if (urlStr.includes("tokens")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              pairs: [
                {
                  baseToken: { symbol: "ETH" },
                  priceUsd: "3200.50",
                },
                {
                  baseToken: { symbol: "cbBTC" },
                  priceUsd: "68500.00",
                },
              ],
            }),
          } as unknown as Response;
        }
        return {
          ok: false,
          status: 404,
          json: async () => ({ pairs: [] }),
        } as unknown as Response;
      };

      const prices = await getQuoteAssetPrices();
      assert.strictEqual(prices.USDG, 1.0);
      assert.strictEqual(prices.ETH, 3200.5);
      assert.strictEqual(prices.cbBTC, 68500.0);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("caches quote asset prices within 60 second TTL window", async () => {
    const originalFetch = global.fetch;
    let callCount = 0;

    try {
      global.fetch = async () => {
        callCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            pairs: [
              { baseToken: { symbol: "ETH" }, priceUsd: "3000.00" },
              { baseToken: { symbol: "cbBTC" }, priceUsd: "60000.00" },
            ],
          }),
        } as unknown as Response;
      };

      const prices1 = await getQuoteAssetPrices();
      const prices2 = await getQuoteAssetPrices();

      assert.strictEqual(callCount, 1);
      assert.strictEqual(prices1.ETH, prices2.ETH);
      assert.strictEqual(prices1.cbBTC, prices2.cbBTC);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("fetchDexScreenerTokenData returns parsed pair data or null safely", async () => {
    const originalFetch = global.fetch;
    try {
      global.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          pairs: [
            {
              chainId: "base",
              pairAddress: "0xPairAddress123",
              priceUsd: "0.0042",
              fdv: 420000,
              liquidity: { usd: 84000 },
              volume: { h24: 125000 },
              priceChange: { h24: 15.4 },
            },
          ],
        }),
      } as unknown as Response);

      const data = await fetchDexScreenerTokenData("0xToken123");
      assert.ok(data);
      assert.strictEqual(data?.priceUsd, 0.0042);
      assert.strictEqual(data?.fdv, 420000);
      assert.strictEqual(data?.liquidityUsd, 84000);
      assert.strictEqual(data?.volume24hUsd, 125000);
      assert.strictEqual(data?.priceChange24hPct, 15.4);
    } finally {
      global.fetch = originalFetch;
    }
  });
});
