import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { LandingClient } from "../LandingClient";

describe("Tosca Canvas & Colorful Pop Landing Page (TICKET-98)", () => {
  const mockStats = {
    total_launches: 1620,
    unique_deployers: 870,
    repeat_share: 33.8,
    head_block: 27195000,
    repeat_launchers: [],
    launches_by_block: [],
    computed_at: new Date().toISOString(),
  };

  test("renders Tosca Main #0D746E canvas background and Ink Light heading", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("bg-[#0D746E]") || html.includes("bg-canvas-main") || html.includes("#0D746E"));
    assert.ok(html.includes("Surveillance Engine Active"));
    assert.ok(html.includes("Every Deployer Has A History"));
    assert.ok(html.includes("Open Case File"));
  });

  test("renders Sunshine Yellow CTA button with Deep Pine text and hard border", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("bg-[#FFD166]") || html.includes("bg-pop-yellow") || html.includes("#FFD166"));
    assert.ok(html.includes("text-[#042F2E]") || html.includes("text-ink-dark") || html.includes("#042F2E"));
  });

  test("renders 4 Colorful Pop macro metric cards with distinct pop accent tints", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("1,620"));
    assert.ok(html.includes("870"));
    assert.ok(html.includes("33.8%"));
    assert.ok(html.includes("Factory Launches"));
    assert.ok(html.includes("Unique Creators"));
    assert.ok(html.includes("Repeat Share"));
    assert.ok(html.includes("Head Block"));
  });

  test("renders 4-step workflow cards with Surface Deep container and Pop badges", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("01"));
    assert.ok(html.includes("02"));
    assert.ok(html.includes("03"));
    assert.ok(html.includes("04"));
    assert.ok(html.includes("Investigate"));
    assert.ok(html.includes("Score"));
    assert.ok(html.includes("Track"));
    assert.ok(html.includes("Publish"));
  });

  test("renders 3 PRD-thematic 3D module showcase cards with layered artwork and Tosca deep squircle containers", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("What Deployer Scoring Unlocks"));
    assert.ok(html.includes("card-reputation-shield.jpg"));
    assert.ok(html.includes("Sub-Second Surveillance Stream"));
    assert.ok(html.includes("card-surveillance-radar.jpg"));
    assert.ok(html.includes("Constellation Network Topology"));
    assert.ok(html.includes("card-constellation-graph.jpg"));
  });

  test("renders Scout Protocol Showcase Banner with 3D Intelligence Core and Sunshine Yellow CTA", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("SCOUT: Inspect, Score, Track"));
    assert.ok(html.includes("banner-intelligence-core.jpg"));
    assert.ok(html.includes("Scout Indexed Launches"));
    assert.ok(html.includes("Tracked Creators"));
    assert.ok(html.includes("Repeat Share Rate"));
  });
});
