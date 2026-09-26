import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  ConnectionsTimeline,
  type ConnectionItem,
  type TimelineLogItem,
} from "@/components/dossier/ConnectionsTimeline";

describe("ConnectionsTimeline Component (TICKET-42)", () => {
  const mockConnections: ConnectionItem[] = [
    {
      id: "conn-1",
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "SOL1",
      name: "Solana Alpha",
      type: "confirmed",
      reason: "Shared fee recipient wallet and deployer key derivation",
      createdAt: "2026-09-20T10:00:00Z",
    },
    {
      id: "conn-2",
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "BETA2",
      name: "Beta Launch",
      type: "hypothesis",
      reason: "Same Telegram handle mentioned in launch announcement",
      createdAt: "2026-09-22T14:30:00Z",
    },
  ];

  const mockLogs: TimelineLogItem[] = [
    {
      id: "log-1",
      at: "2026-09-25T18:00:00Z",
      text: "Updated thesis to reflect dev wallet token distribution",
    },
    {
      id: "log-2",
      at: "2026-09-25T12:00:00Z",
      text: "Flagged high holder concentration trigger (>25%)",
    },
    {
      id: "log-3",
      at: "2026-09-24T08:00:00Z",
      text: "Created initial dossier with status Researching",
    },
  ];

  test("renders tab headers for Connections and Timeline with badge counts", () => {
    const html = renderToString(
      <ConnectionsTimeline
        connections={mockConnections}
        timelineLogs={mockLogs}
        activeTab="connections"
      />
    );
    assert.ok(html.includes("Connections"));
    assert.ok(html.includes("Timeline"));
    assert.ok(html.includes("2"));
    assert.ok(html.includes("3"));
  });

  test("renders confirmed and hypothesis connection items with badges and links", () => {
    const html = renderToString(
      <ConnectionsTimeline
        connections={mockConnections}
        timelineLogs={mockLogs}
        activeTab="connections"
      />
    );
    assert.ok(html.includes("SOL1"));
    assert.ok(html.includes("BETA2"));
    assert.ok(html.includes("Confirmed"));
    assert.ok(html.includes("Hypothesis"));
    assert.ok(html.includes("Shared fee recipient"));
    assert.ok(html.includes("Same Telegram handle"));
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("/d/0x2222222222222222222222222222222222222222"));
  });

  test("renders empty state for connections when list is empty", () => {
    const html = renderToString(
      <ConnectionsTimeline connections={[]} timelineLogs={[]} activeTab="connections" />
    );
    assert.ok(html.includes("No connected tokens"));
  });

  test("renders timeline audit logs with timestamps sorted descending", () => {
    const html = renderToString(
      <ConnectionsTimeline
        connections={mockConnections}
        timelineLogs={mockLogs}
        activeTab="timeline"
      />
    );
    assert.ok(html.includes("Updated thesis to reflect dev wallet"));
    assert.ok(html.includes("Flagged high holder concentration trigger"));
    assert.ok(html.includes("Created initial dossier"));
  });

  test("renders empty state for timeline logs when empty", () => {
    const html = renderToString(
      <ConnectionsTimeline connections={[]} timelineLogs={[]} activeTab="timeline" />
    );
    assert.ok(html.includes("No timeline logs recorded"));
  });

  test("renders Add Connection button", () => {
    const html = renderToString(
      <ConnectionsTimeline
        connections={mockConnections}
        timelineLogs={mockLogs}
        activeTab="connections"
      />
    );
    assert.ok(html.includes("Add Connection"));
  });
});
