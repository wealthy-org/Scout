import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { LandingClient } from "../LandingClient";

describe("Chroma Landing Page & Hero Macro Cards (TICKET-91)", () => {
  const mockStats = {
    total_launches: 1620,
    unique_deployers: 870,
    repeat_share: 33.8,
    head_block: 27195000,
    repeat_launchers: [],
    launches_by_block: [],
    computed_at: new Date().toISOString(),
  };

  test("renders Chroma ambient glow backdrop, pulse announcement pill, and display hero heading", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("radial-gradient") || html.includes("bg-[#07090E]") || html.includes("bg-[#0B0E17]"));
    assert.ok(html.includes("Surveillance Engine Active"));
    assert.ok(html.includes("Every Deployer Has A History"));
    assert.ok(html.includes("Open Case File"));
  });

  test("renders 4 high-chroma macro metric cards with distinct accent colors", () => {
    const html = renderToString(<LandingClient stats={mockStats} isAuthenticated={false} />);
    assert.ok(html.includes("1,620"));
    assert.ok(html.includes("870"));
    assert.ok(html.includes("33.8%"));
    assert.ok(html.includes("Factory Launches"));
    assert.ok(html.includes("Unique Creators"));
    assert.ok(html.includes("Repeat Share"));
    assert.ok(html.includes("Head Block"));
  });

  test("renders 4-step workflow cards with chromatic border styling", () => {
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
});
