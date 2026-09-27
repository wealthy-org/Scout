import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { LandingClient } from "../LandingClient";

describe("Tosca Canvas & Colorful Pop Clean Hero Landing Page (TICKET-101)", () => {
  const mockStats = {
    total_launches: 1620,
    unique_deployers: 870,
    repeat_share: 33.8,
    head_block: 27195000,
    repeat_launchers: [],
    launches_by_block: [],
    computed_at: new Date().toISOString(),
  };

  test("renders Tosca Main #0D746E canvas background and 2-column hero layout", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("bg-[#0D746E]") || html.includes("#0D746E"));
    assert.ok(html.includes("Surveillance Engine Active"));
    assert.ok(html.includes("Every Deployer Has A History"));
    assert.ok(html.includes("lg:grid-cols-12") || html.includes("grid-cols-1 lg:grid-cols-2") || html.includes("lg:grid-cols-7"));
  });

  test("preserves search bar with Open Case File button and focus-within container", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("Open Case File"));
    assert.ok(html.includes("Paste token contract address"));
    assert.ok(html.includes("focus-within:border-[#FFD166]"));
    assert.ok(html.includes("bg-[#FFD166]") || html.includes("#FFD166"));
  });

  test("renders right-column animated on-chain surveillance core and floating telemetry cards", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("SURVEILLANCE RADAR") || html.includes("LIVE RADAR"));
    assert.ok(html.includes("TOP REPUTATION DEPLOYER") || html.includes("TOP DEPLOYER"));
    assert.ok(html.includes("84 / 100") || html.includes("84"));
    assert.ok(html.includes("GREEN BAND"));
  });

  test("renders quick telemetry link pills for Feed, Map, and Census", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("Launch Radar Feed") || html.includes("Launch Feed"));
    assert.ok(html.includes("Constellation Graph") || html.includes("Constellation Map"));
    assert.ok(html.includes("Creator Census"));
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

  test("renders 3 PRD-thematic 3D module showcase cards with clean Tosca-toned artwork", () => {
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
