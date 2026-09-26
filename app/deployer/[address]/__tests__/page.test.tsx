import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  DeployerProfileView,
  type DeployerProfileProps,
} from "@/components/deployer/DeployerProfileView";

describe("Public Deployer Profile Page (TICKET-76)", () => {
  const mockProps: DeployerProfileProps = {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    score: 82,
    label: "repeat",
    band: "green",
    signals: {
      grad_rate: 0.65,
      doa_rate: 0.05,
      burst_rate: 0.0,
      total_launches: 12,
      graduated_count: 7,
    },
    launches: [
      {
        tokenAddress: "0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2",
        block: 1042300,
        phase: "graduated",
      },
      {
        tokenAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        block: 1042100,
        phase: "curve",
      },
    ],
    isAuthenticated: true,
    isInWatchlist: false,
    userAddress: "0x9999999999999999999999999999999999999999",
  };

  it("renders deployer address, score 0-100, label, and band badge", () => {
    const html = renderToString(<DeployerProfileView {...mockProps} />);

    assert.ok(html.includes("0x1234...5678") || html.includes("0x1234567890abcdef1234567890abcdef12345678"));
    assert.ok(html.includes("82"));
    assert.ok(html.includes("REPEAT") || html.includes("repeat"));
    assert.ok(html.includes("GREEN") || html.includes("green"));
  });

  it("renders all 5 score signals (PRD AC #2)", () => {
    const html = renderToString(<DeployerProfileView {...mockProps} />);

    assert.ok(html.includes("Graduation Rate") || html.includes("grad_rate"));
    assert.ok(html.includes("DOA Rate") || html.includes("doa_rate"));
    assert.ok(html.includes("Burst Rate") || html.includes("burst_rate"));
    assert.ok(html.includes("Total Launches") || html.includes("total_launches"));
    assert.ok(html.includes("Graduated Count") || html.includes("graduated_count"));
  });

  it("renders 'Why this score?' breakdown accordion and token launch timeline", () => {
    const html = renderToString(<DeployerProfileView {...mockProps} />);

    assert.ok(html.includes("Why this score?"));
    assert.ok(html.includes("Launch History"));
    assert.ok(html.includes("0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"));
    assert.ok(html.includes("graduated"));
    assert.ok(html.includes("curve"));
  });

  it("renders 'Add to Watchlist' button for authenticated user", () => {
    const html = renderToString(<DeployerProfileView {...mockProps} />);

    assert.ok(html.includes("Watchlist") || html.includes("Add to Watchlist"));
  });

  it("renders watchlist CTA for unauthenticated user prompting wallet connection", () => {
    const html = renderToString(
      <DeployerProfileView {...mockProps} isAuthenticated={false} />
    );

    assert.ok(html.includes("Connect Wallet") || html.includes("Connect to Watch"));
  });
});
