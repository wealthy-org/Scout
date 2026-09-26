export interface FeedLaunchItem {
  tokenAddress: string;
  symbol: string;
  name: string;
  deployerAddress: string;
  score: number;
  label: "fresh" | "repeat" | "serial";
  band: "green" | "yellow" | "red";
  progressPct: number;
  marketCapUsd: number;
  volume24hUsd: number;
  phase: "curve" | "graduated" | "swept" | string;
  block: number;
  timestamp: string | Date;
  isWatched?: boolean;
  hasDossier?: boolean;
}

export type FeedFilter = "all" | "active" | "graduated" | "watched";

export interface FeedState {
  items: FeedLaunchItem[];
  lastBlock: number;
  isPolling: boolean;
  filter: FeedFilter;
}

export type FeedAction =
  | { type: "FEED_INIT"; payload: FeedLaunchItem[] }
  | {
      type: "FEED_BATCH_NEW";
      payload: { newItems: FeedLaunchItem[]; latestBlock: number };
    }
  | {
      type: "FEED_UPDATE_ITEM";
      payload: { tokenAddress: string; updates: Partial<FeedLaunchItem> };
    }
  | { type: "FEED_SET_FILTER"; payload: FeedFilter }
  | { type: "FEED_SET_POLLING"; payload: boolean };

export function mergeFeedBatches(
  existing: FeedLaunchItem[],
  incoming: FeedLaunchItem[]
): FeedLaunchItem[] {
  const map = new Map<string, FeedLaunchItem>();

  for (const item of incoming) {
    map.set(item.tokenAddress.toLowerCase(), item);
  }

  for (const item of existing) {
    const key = item.tokenAddress.toLowerCase();
    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.block !== a.block) return b.block - a.block;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case "FEED_INIT": {
      const maxBlock = action.payload.reduce(
        (max, item) => Math.max(max, item.block),
        state.lastBlock
      );
      return {
        ...state,
        items: action.payload,
        lastBlock: maxBlock,
      };
    }

    case "FEED_BATCH_NEW": {
      const merged = mergeFeedBatches(state.items, action.payload.newItems);
      return {
        ...state,
        items: merged,
        lastBlock: Math.max(state.lastBlock, action.payload.latestBlock),
      };
    }

    case "FEED_UPDATE_ITEM": {
      const target = action.payload.tokenAddress.toLowerCase();
      const updated = state.items.map((item) => {
        if (item.tokenAddress.toLowerCase() === target) {
          return { ...item, ...action.payload.updates };
        }
        return item;
      });
      return {
        ...state,
        items: updated,
      };
    }

    case "FEED_SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    case "FEED_SET_POLLING":
      return {
        ...state,
        isPolling: action.payload,
      };

    default:
      return state;
  }
}
