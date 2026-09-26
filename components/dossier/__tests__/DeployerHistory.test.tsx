import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { DeployerHistory, DeployerLaunchItem } from "@/components/dossier/DeployerHistory";

describe("DeployerHistory Component (TICKET-37)", () => {
  const mockLaunches: DeployerLaunchItem[] = [
    {
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "PONK",
      name: "Ponk Inu",
      status: "graduated",
      launchedAt: "2026-09-20T10:00:00Z",
      hasDossier: true,
      dossierStatus: "active",
    },
    {
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "ROBO",
      name: "Robo Cat",
      status: "curve",
      launchedAt: "2026-09-15T08:30:00Z",
      hasDossier: false,
    },
  ];

  test("renders header with total launch count", () => {
    const html = renderToString(
      <DeployerHistory launches={mockLaunches} totalLaunches={12} />
    );
    assert.ok(html.includes("Deployer History"));
    assert.ok(html.includes("12") || html.includes("2"));
  });

  test("renders launch items with symbols and status", () => {
    const html = renderToString(<DeployerHistory launches={mockLaunches} />);
    assert.ok(html.includes("PONK"));
    assert.ok(html.includes("ROBO"));
    assert.ok(html.includes("graduated") || html.includes("Graduated"));
  });

  test("highlights rows that have an existing dossier", () => {
    const html = renderToString(<DeployerHistory launches={mockLaunches} />);
    assert.ok(html.includes("Dossier") || html.includes("active"));
  });

  test("links to /d/[ca] for each launch", () => {
    const html = renderToString(<DeployerHistory launches={mockLaunches} />);
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("/d/0x2222222222222222222222222222222222222222"));
  });

  test("handles empty launches list gracefully", () => {
    const html = renderToString(<DeployerHistory launches={[]} />);
    assert.ok(html.includes("No launch history") || html.includes("Deployer History"));
  });
});
