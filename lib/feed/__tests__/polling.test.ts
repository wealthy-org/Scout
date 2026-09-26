import { test, describe } from "node:test";
import assert from "node:assert";
import {
  feedReducer,
  type FeedState,
  type FeedAction,
  type FeedLaunchItem,
  mergeFeedBatches,
} from "@/lib/feed/polling";

describe("Launch Feed Polling Engine (TICKET-49)", () => {
  const mockItem1: FeedLaunchItem = {
    tokenAddress: "0x1111111111111111111111111111111111111111",
    symbol: "TOKEN1",
    name: "First Token",
    deployerAddress: "0xDeployer1",
    score: 80,
    label: "fresh",
    band: "green",
    progressPct: 45,
    marketCapUsd: 120000,
    volume24hUsd: 35000,
    phase: "curve",
    block: 1000,
    timestamp: "2026-09-26T10:00:00Z",
  };

  const mockItem2: FeedLaunchItem = {
    tokenAddress: "0x2222222222222222222222222222222222222222",
    symbol: "TOKEN2",
    name: "Second Token",
    deployerAddress: "0xDeployer2",
    score: 20,
    label: "serial",
    band: "red",
    progressPct: 100,
    marketCapUsd: 450000,
    volume24hUsd: 180000,
    phase: "graduated",
    block: 1005,
    timestamp: "2026-09-26T10:02:00Z",
  };

  const initialState: FeedState = {
    items: [mockItem1],
    lastBlock: 1000,
    isPolling: true,
    filter: "all",
  };

  test("FEED_BATCH_NEW prepends new launch items without duplicates", () => {
    const action: FeedAction = {
      type: "FEED_BATCH_NEW",
      payload: {
        newItems: [mockItem2],
        latestBlock: 1005,
      },
    };

    const nextState = feedReducer(initialState, action);
    assert.strictEqual(nextState.items.length, 2);
    assert.strictEqual(nextState.items[0].tokenAddress, mockItem2.tokenAddress);
    assert.strictEqual(nextState.lastBlock, 1005);
  });

  test("FEED_UPDATE_ITEM modifies properties of an existing feed item", () => {
    const action: FeedAction = {
      type: "FEED_UPDATE_ITEM",
      payload: {
        tokenAddress: "0x1111111111111111111111111111111111111111",
        updates: {
          progressPct: 85,
          marketCapUsd: 180000,
        },
      },
    };

    const nextState = feedReducer(initialState, action);
    assert.strictEqual(nextState.items[0].progressPct, 85);
    assert.strictEqual(nextState.items[0].marketCapUsd, 180000);
  });

  test("mergeFeedBatches merges new and existing items maintaining descending order by block", () => {
    const merged = mergeFeedBatches([mockItem1], [mockItem2]);
    assert.strictEqual(merged.length, 2);
    assert.strictEqual(merged[0].block, 1005);
    assert.strictEqual(merged[1].block, 1000);
  });

  test("FEED_SET_FILTER updates active filter state cleanly", () => {
    const action: FeedAction = {
      type: "FEED_SET_FILTER",
      payload: "graduated",
    };

    const nextState = feedReducer(initialState, action);
    assert.strictEqual(nextState.filter, "graduated");
  });
});
