import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { LibraryClient, type LibraryDossierCard } from "@/components/library/LibraryClient";

describe("User Dossiers Library Page (TICKET-75)", () => {
  const mockDossiers: LibraryDossierCard[] = [
    {
      id: "dos-1",
      walletAddress: "0x1111111111111111111111111111111111111111",
      chainId: 42161,
      contractAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
      symbol: "SCOUT",
      name: "Scout Intelligence",
      status: "Researching",
      thesis: "High conviction surveillance token",
      createdAt: new Date("2026-03-01T00:00:00.000Z"),
      updatedAt: new Date("2026-03-15T00:00:00.000Z"),
    },
    {
      id: "dos-2",
      walletAddress: "0x1111111111111111111111111111111111111111",
      chainId: 42161,
      contractAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      symbol: "ALPHA",
      name: "Alpha Token",
      status: "In position",
      thesis: "Graduated token with strong liquidity",
      createdAt: new Date("2026-03-02T00:00:00.000Z"),
      updatedAt: new Date("2026-03-16T00:00:00.000Z"),
    },
  ];

  it("renders auth required prompt when unauthenticated", () => {
    const html = renderToString(
      <LibraryClient
        initialDossiers={[]}
        isAuthenticated={false}
      />
    );

    assert.ok(html.includes("Authentication Required"));
    assert.ok(html.includes("Connect Wallet") || html.includes("Connect your Ethereum wallet"));
  });

  it("renders library header, search bar, filter dropdowns, and import/export actions when authenticated", () => {
    const html = renderToString(
      <LibraryClient
        initialDossiers={mockDossiers}
        isAuthenticated={true}
        userAddress="0x1111111111111111111111111111111111111111"
      />
    );

    assert.ok(html.includes("Case Files Library"));
    assert.ok(html.includes("Import"));
    assert.ok(html.includes("Export All"));
    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("ALPHA"));
    assert.ok(html.includes("Researching"));
    assert.ok(html.includes("In position"));
  });

  it("renders empty state message when user has no saved case files", () => {
    const html = renderToString(
      <LibraryClient
        initialDossiers={[]}
        isAuthenticated={true}
        userAddress="0x1111111111111111111111111111111111111111"
      />
    );

    assert.ok(html.includes("No Case Files Found") || html.includes("Your Library is Empty"));
  });
});
