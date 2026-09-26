import type { DossierStatus } from "@/lib/db/schema";

export interface DemoItem {
  id: string;
  kind: "pro" | "con" | "checked" | "source";
  text: string;
  order: number;
}

export interface DemoSnapshot {
  fdv_usd: number;
  liquidity_usd: number;
  pool_phase: "curve" | "graduated" | "swept";
  market_pairs_count: number;
  repo_commits_count: number;
  fee_recipient: string;
}

export interface DemoDossier {
  slug: string;
  contractAddress: string;
  symbol: string;
  name: string;
  status: DossierStatus;
  thesis: string;
  notes: string;
  deployerAddress: string;
  deployerScore: number;
  deployerBand: "green" | "yellow" | "red";
  deployerLabel: "fresh" | "repeat" | "serial";
  items: DemoItem[];
  snapshot: DemoSnapshot;
}

export const DEMO_DOSSIERS: Record<string, DemoDossier> = {
  active: {
    slug: "active",
    contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
    symbol: "SCOUT",
    name: "Scout Intelligence Protocol",
    status: "In position",
    thesis:
      "Primary on-chain surveillance node with continuous volume growth and transparent creator fee routing.",
    notes:
      "### Verification Notes\n- Verified contract bytecode matches factory standard\n- Creator wallet has 8 launches and 6 graduations\n- Zero DOA events in creator history.",
    deployerAddress: "0x1234567890123456789012345678901234567890",
    deployerScore: 88,
    deployerBand: "green",
    deployerLabel: "repeat",
    items: [
      { id: "1", kind: "pro", text: "High graduation velocity on Pons V2", order: 1 },
      { id: "2", kind: "pro", text: "Clean fee recipient address history", order: 2 },
      { id: "3", kind: "checked", text: "DEX liquidity pair confirmed on Uniswap V3", order: 3 },
      { id: "4", kind: "source", text: "https://github.com/scout-protocol/core", order: 4 },
    ],
    snapshot: {
      fdv_usd: 1450000,
      liquidity_usd: 320000,
      pool_phase: "graduated",
      market_pairs_count: 2,
      repo_commits_count: 42,
      fee_recipient: "0x1234567890123456789012345678901234567890",
    },
  },
  passed: {
    slug: "passed",
    contractAddress: "0x2222222222222222222222222222222222222222",
    symbol: "FORK",
    name: "Generic Meme Token",
    status: "Passed",
    thesis:
      "Derivative copycat token with no community backing or distinct value proposition. High risk of abandonment.",
    notes:
      "### Evaluation\n- Metadata copied from trending deployment\n- Deployer funded from tornado cash relayer\n- Passed without position.",
    deployerAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    deployerScore: 42,
    deployerBand: "yellow",
    deployerLabel: "fresh",
    items: [
      { id: "1", kind: "con", text: "Low unique holder diversity (<5 wallets hold 80%)", order: 1 },
      { id: "2", kind: "con", text: "Duplicate symbol name across multiple chains", order: 2 },
      { id: "3", kind: "checked", text: "Bytecode audit shows no malicious proxy", order: 3 },
    ],
    snapshot: {
      fdv_usd: 24000,
      liquidity_usd: 4800,
      pool_phase: "curve",
      market_pairs_count: 1,
      repo_commits_count: 0,
      fee_recipient: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
  },
  rugged: {
    slug: "rugged",
    contractAddress: "0x3333333333333333333333333333333333333333",
    symbol: "PUMP",
    name: "Quick Flip Velocity",
    status: "Passed",
    thesis:
      "Serial rugger deployment flagged by algorithm. 11 prior launches with 0 graduations triggering penalty cap.",
    notes:
      "### Forensic Findings\n- Deployer score clamped to 15 (Red Band)\n- Liquidity drained within 6 minutes of curve start\n- Creator created 3 new tokens in same 1-hour window.",
    deployerAddress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    deployerScore: 14,
    deployerBand: "red",
    deployerLabel: "serial",
    items: [
      { id: "1", kind: "con", text: "11 consecutive ungraduated genesis launches", order: 1 },
      { id: "2", kind: "con", text: "Rapid burst launch pattern (<15 min interval)", order: 2 },
      { id: "3", kind: "con", text: "Dead on Arrival (DOA) frequency > 80%", order: 3 },
    ],
    snapshot: {
      fdv_usd: 1200,
      liquidity_usd: 80,
      pool_phase: "curve",
      market_pairs_count: 1,
      repo_commits_count: 0,
      fee_recipient: "0x9999999999999999999999999999999999999999",
    },
  },
  hold: {
    slug: "hold",
    contractAddress: "0x4444444444444444444444444444444444444444",
    symbol: "DEEP",
    name: "Deep Protocol Research",
    status: "Researching",
    thesis:
      "Promising infrastructure deployment undergoing ongoing code audit. Awaiting liquidity migration milestone.",
    notes:
      "### In-Progress Research\n- Monitoring bonding curve progress (82% reached)\n- Tracking developer activity on public testnet repository.",
    deployerAddress: "0xcccccccccccccccccccccccccccccccccccccccc",
    deployerScore: 74,
    deployerBand: "green",
    deployerLabel: "fresh",
    items: [
      { id: "1", kind: "pro", text: "Active developer commit velocity on GitHub", order: 1 },
      { id: "2", kind: "pro", text: "Steady buy-side pressure with low sell slippage", order: 2 },
      { id: "3", kind: "checked", text: "82% bonding curve threshold reached", order: 3 },
    ],
    snapshot: {
      fdv_usd: 480000,
      liquidity_usd: 110000,
      pool_phase: "curve",
      market_pairs_count: 1,
      repo_commits_count: 18,
      fee_recipient: "0xcccccccccccccccccccccccccccccccccccccccc",
    },
  },
};

export const DEMO_SLUGS = Object.keys(DEMO_DOSSIERS);

export function getDemoDossier(slug: string): DemoDossier | null {
  return DEMO_DOSSIERS[slug.toLowerCase()] || null;
}
