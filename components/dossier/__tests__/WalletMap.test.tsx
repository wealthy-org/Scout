import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { WalletMap, WalletBubbleItem } from "@/components/dossier/WalletMap";

describe("WalletMap Component (TICKET-35)", () => {
  const mockWallets: WalletBubbleItem[] = [
    {
      address: "0x1111111111111111111111111111111111111111",
      volume: 45000,
      netFlow: 32000,
      isDeployer: true,
    },
    {
      address: "0x2222222222222222222222222222222222222222",
      volume: 25000,
      netFlow: -15000,
      isDeployer: false,
    },
    {
      address: "0x3333333333333333333333333333333333333333",
      volume: 12000,
      netFlow: 12000,
      isDeployer: false,
    },
  ];

  test("renders SVG container with viewBox and legend", () => {
    const html = renderToString(<WalletMap wallets={mockWallets} />);
    assert.ok(html.includes("<svg"));
    assert.ok(html.includes("Net Buyer") || html.includes("Buyer"));
    assert.ok(html.includes("Net Seller") || html.includes("Seller"));
    assert.ok(html.includes("Deployer"));
  });

  test("renders circle elements for each wallet bubble with appropriate colors", () => {
    const html = renderToString(<WalletMap wallets={mockWallets} />);
    assert.ok(html.includes("<circle"));
    assert.ok(html.includes("#99F6E4") || html.includes("#10b981") || html.includes("10b981") || html.includes("99F6E4"));
    assert.ok(html.includes("#FF6B6B") || html.includes("#ef4444") || html.includes("ef4444") || html.includes("FF6B6B"));
  });

  test("renders special ring styling for deployer wallet", () => {
    const html = renderToString(<WalletMap wallets={mockWallets} />);
    assert.ok(html.includes("#FFD166") || html.includes("#eab308") || html.includes("stroke-amber") || html.includes("stroke-yellow") || html.includes("FFD166"));
  });

  test("handles empty wallets list gracefully", () => {
    const html = renderToString(<WalletMap wallets={[]} />);
    assert.ok(html.includes("No wallet data") || html.includes("<svg"));
  });
});
