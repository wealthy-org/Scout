import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { CensusView } from "../CensusView";
import { DeployerProfileView } from "../../deployer/DeployerProfileView";
import { AccountClient } from "../../account/AccountClient";

describe("Chroma Census, Deployer Profile & Documentation (TICKET-95)", () => {
  const mockCensusStats = {
    total_launches: 1620,
    unique_deployers: 870,
    repeat_share: 33.8,
    head_block: 27195000,
    repeat_launchers: [
      {
        deployerAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
        totalLaunches: 10,
        graduatedCount: 7,
        score: 82,
        band: "green" as const,
        label: "repeat" as const,
      },
    ],
    launches_by_block: [
      { blockRange: "0-500K", count: 180 },
      { blockRange: "500K-1M", count: 420 },
      { blockRange: "1M-1.5M", count: 680 },
      { blockRange: "1.5M+", count: 340 },
    ],
    computed_at: new Date().toISOString(),
  };

  test("renders CensusView with macro metrics, density chart, and repeat launchers", () => {
    const html = renderToString(<CensusView stats={mockCensusStats} />);
    assert.ok(html.includes("Launch Census"));
    assert.ok(html.includes("1,620"));
    assert.ok(html.includes("870"));
    assert.ok(html.includes("33.8%"));
    assert.ok(html.includes("Launch Density by Block Range"));
    assert.ok(html.includes("Repeat Launchers"));
    assert.ok(html.includes("0x89e24b"));
    assert.ok(html.includes("Methodology &amp; Mathematical Architecture"));
    assert.ok(html.includes("Bayesian Model"));
    assert.ok(html.includes("Pipeline &amp; Epoch"));
    assert.ok(html.includes("Risk Matrix"));
    assert.ok(html.includes("Live Simulator"));
    assert.ok(html.includes("Laplace Smoothing Prior"));
    assert.ok(html.includes("Serial Rugger Hard-Clamp"));
  });

  test("renders DeployerProfileView with 10-bar scoring gauge and signals", () => {
    const html = renderToString(
      <DeployerProfileView
        address="0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"
        score={82}
        label="repeat"
        band="green"
        signals={{
          grad_rate: 0.7,
          doa_rate: 0.05,
          burst_rate: 0.1,
          total_launches: 10,
          graduated_count: 7,
        }}
        launches={[]}
        isAuthenticated={true}
      />
    );

    assert.ok(html.includes("Deployer Dossier"));
    assert.ok(html.includes("0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"));
    assert.ok(html.includes("82"));
    assert.ok(html.includes("Graduation Rate"));
    assert.ok(html.includes("DOA Rate"));
  });

  test("renders AccountClient settings and deletion danger zone", () => {
    const html = renderToString(
      <AccountClient
        isAuthenticated={true}
        user={{
          walletAddress: "0x1111111111111111111111111111111111111111",
          handle: "sleuth",
          createdAt: new Date().toISOString(),
        }}
      />
    );

    assert.ok(html.includes("Account Settings"));
    assert.ok(html.includes("0x1111...1111"));
    assert.ok(html.includes("sleuth"));
    assert.ok(html.includes("Danger Zone"));
  });
});
