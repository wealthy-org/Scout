import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { TopWalletsTable, TopWalletRow } from "@/components/dossier/TopWalletsTable";

describe("TopWalletsTable Component (TICKET-36)", () => {
  const mockWallets: TopWalletRow[] = [
    {
      address: "0x1111111111111111111111111111111111111111",
      volume: 52000,
      netFlow: 45000,
      tradeCount: 14,
      isDeployer: true,
      firstTradeIndex: 0,
    },
    {
      address: "0x2222222222222222222222222222222222222222",
      volume: 38000,
      netFlow: -12000,
      tradeCount: 8,
      isFeeRecipient: true,
      firstTradeIndex: 5,
    },
    {
      address: "0x3333333333333333333333333333333333333333",
      volume: 24000,
      netFlow: 24000,
      tradeCount: 3,
      isEarly: true,
      firstTradeIndex: 8,
    },
  ];

  test("renders table headers correctly", () => {
    const html = renderToString(<TopWalletsTable wallets={mockWallets} />);
    assert.ok(html.includes("Top Wallets"));
    assert.ok(html.includes("Wallet"));
    assert.ok(html.includes("Tags") || html.includes("Badges"));
    assert.ok(html.includes("Net Flow"));
  });

  test("renders badges for Deployer, Fee Recipient, and Early Buyer", () => {
    const html = renderToString(<TopWalletsTable wallets={mockWallets} />);
    assert.ok(html.includes("Deployer"));
    assert.ok(html.includes("Fee Recipient"));
    assert.ok(html.includes("Early"));
  });

  test("renders deployer link to /deployer/[address]", () => {
    const html = renderToString(<TopWalletsTable wallets={mockWallets} />);
    assert.ok(html.includes("/deployer/0x1111111111111111111111111111111111111111"));
  });

  test("handles empty wallets list gracefully", () => {
    const html = renderToString(<TopWalletsTable wallets={[]} />);
    assert.ok(html.includes("No wallet records found") || html.includes("Top Wallets"));
  });
});
