import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { ResearchPanel } from "@/components/dossier/ResearchPanel";

describe("ResearchPanel Component (TICKET-39)", () => {
  const defaultProps = {
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    isAuthenticated: true,
    initialThesis: "High conviction meme play",
    initialStatus: "Researching" as const,
    initialReason: "Strong momentum",
    initialDecisionReason: "Awaiting next breakout",
    initialNotes: "## Research Notes\n- Verified liquidity",
    initialItems: [
      { kind: "pro" as const, text: "Strong dev team" },
      { kind: "con" as const, text: "Low initial volume" },
      { kind: "source" as const, text: "https://twitter.com/token" },
    ],
    initialQuestions: [{ text: "Is liquidity locked?", done: true }],
  };

  test("renders unauthenticated banner when user is not logged in", () => {
    const html = renderToString(
      <ResearchPanel
        contractAddress={defaultProps.contractAddress}
        isAuthenticated={false}
      />
    );
    assert.ok(html.includes("Connect Wallet") || html.includes("login"));
  });

  test("renders all 9 research sections when authenticated", () => {
    const html = renderToString(<ResearchPanel {...defaultProps} />);
    assert.ok(html.includes("Thesis"));
    assert.ok(html.includes("Status"));
    assert.ok(html.includes("Reason"));
    assert.ok(html.includes("For") || html.includes("Bull Case"));
    assert.ok(html.includes("Against") || html.includes("Bear Case"));
    assert.ok(html.includes("Open Questions"));
    assert.ok(html.includes("Decision Reason"));
    assert.ok(html.includes("Notes"));
    assert.ok(html.includes("Sources"));
  });

  test("renders initial data in form fields", () => {
    const html = renderToString(<ResearchPanel {...defaultProps} />);
    assert.ok(html.includes("High conviction meme play"));
    assert.ok(html.includes("Strong dev team"));
    assert.ok(html.includes("Low initial volume"));
    assert.ok(html.includes("Is liquidity locked?"));
    assert.ok(html.includes("https://twitter.com/token"));
  });

  test("displays auto-save indicator state", () => {
    const html = renderToString(<ResearchPanel {...defaultProps} />);
    assert.ok(html.includes("Saved") || html.includes("Auto-save"));
  });
});
