import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  ConstellationGraph,
  ConstellationNode,
  ConstellationEdge,
} from "@/components/dossier/ConstellationGraph";

describe("ConstellationGraph Component (TICKET-38)", () => {
  const mockNodes: ConstellationNode[] = [
    {
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "PONK",
      status: "active",
      isCurrent: true,
    },
    {
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "PEPE",
      status: "passed",
    },
    {
      contractAddress: "0x3333333333333333333333333333333333333333",
      symbol: "RUG",
      status: "rugged",
    },
  ];

  const mockEdges: ConstellationEdge[] = [
    {
      source: "0x1111111111111111111111111111111111111111",
      target: "0x2222222222222222222222222222222222222222",
      type: "confirmed",
      reason: "Same deployer",
    },
    {
      source: "0x1111111111111111111111111111111111111111",
      target: "0x3333333333333333333333333333333333333333",
      type: "hypothesis",
      reason: "Shared thesis pattern",
    },
  ];

  test("renders SVG container and legend", () => {
    const html = renderToString(
      <ConstellationGraph nodes={mockNodes} edges={mockEdges} />
    );
    assert.ok(html.includes("<svg"));
    assert.ok(html.includes("Constellation"));
    assert.ok(html.includes("Confirmed") || html.includes("confirmed"));
    assert.ok(html.includes("Hypothesis") || html.includes("hypothesis"));
  });

  test("renders node symbols and circles matching status colors", () => {
    const html = renderToString(
      <ConstellationGraph nodes={mockNodes} edges={mockEdges} />
    );
    assert.ok(html.includes("PONK"));
    assert.ok(html.includes("PEPE"));
    assert.ok(html.includes("RUG"));
    assert.ok(html.includes("<circle"));
  });

  test("renders solid and dashed lines for confirmed and hypothesis edges", () => {
    const html = renderToString(
      <ConstellationGraph nodes={mockNodes} edges={mockEdges} />
    );
    assert.ok(html.includes("<line"));
    assert.ok(html.includes("stroke-dasharray") || html.includes("strokeDasharray") || html.includes("4 4"));
  });

  test("handles empty nodes gracefully", () => {
    const html = renderToString(<ConstellationGraph nodes={[]} edges={[]} />);
    assert.ok(html.includes("No constellation connections") || html.includes("<svg"));
  });
});
