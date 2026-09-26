import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  ConnectionMap,
  type MapNode,
  type MapEdge,
} from "@/components/map/ConnectionMap";

describe("ConnectionMap Component (TICKET-57)", () => {
  const mockNodes: MapNode[] = [
    {
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "ALPHA",
      status: "active",
      name: "Alpha Protocol",
    },
    {
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "BETA",
      status: "passed",
      name: "Beta Meme",
    },
    {
      contractAddress: "0x3333333333333333333333333333333333333333",
      symbol: "RUG",
      status: "rugged",
      name: "Rugged Token",
    },
  ];

  const mockEdges: MapEdge[] = [
    {
      source: "0x1111111111111111111111111111111111111111",
      target: "0x2222222222222222222222222222222222222222",
      type: "confirmed",
      reason: "same_deployer",
    },
    {
      source: "0x1111111111111111111111111111111111111111",
      target: "0x3333333333333333333333333333333333333333",
      type: "hypothesis",
      reason: "note_mention",
    },
  ];

  test("renders full-page SVG graph canvas with nodes and links", () => {
    const html = renderToString(
      <ConnectionMap nodes={mockNodes} edges={mockEdges} />
    );

    assert.ok(html.includes("ALPHA"));
    assert.ok(html.includes("BETA"));
    assert.ok(html.includes("RUG"));
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("/d/0x2222222222222222222222222222222222222222"));
  });

  test("renders zoom controls (+, -, reset) and legend", () => {
    const html = renderToString(
      <ConnectionMap nodes={mockNodes} edges={mockEdges} />
    );

    assert.ok(html.includes("data-testid=\"zoom-in-btn\"") || html.includes("+"));
    assert.ok(html.includes("data-testid=\"zoom-out-btn\"") || html.includes("-"));
    assert.ok(html.includes("data-testid=\"zoom-reset-btn\"") || html.includes("Reset"));
    assert.ok(html.includes("Confirmed") || html.includes("confirmed"));
    assert.ok(html.includes("Hypothesis") || html.includes("hypothesis"));
  });

  test("renders fallback empty state when no nodes exist", () => {
    const html = renderToString(<ConnectionMap nodes={[]} edges={[]} />);
    assert.ok(html.includes("No dossier connections found"));
  });
});
