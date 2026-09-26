import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { ScoutRemembers } from "@/components/dossier/ScoutRemembers";
import type { ConnectedDossierSummary } from "@/types/dossier";

describe("ScoutRemembers Component (TICKET-41)", () => {
  const mockDossiers: ConnectedDossierSummary[] = [
    {
      id: "dossier-1",
      contractAddress: "0x1111111111111111111111111111111111111111",
      symbol: "OLDTOKEN",
      name: "Old Meme",
      status: "Passed",
      reason: "Honest liquidity",
      decisionReason: "Solid team",
      thesis:
        "This deployer launched a strong community token previously with honest liquidity locking and solid execution throughout the cycle.",
      firstQuestion: "Was the mint authority revoked?",
      createdAt: "2026-08-10T12:00:00Z",
      updatedAt: "2026-08-12T14:00:00Z",
    },
    {
      id: "dossier-2",
      contractAddress: "0x2222222222222222222222222222222222222222",
      symbol: "RUGTOKEN",
      name: "Rug Token",
      status: "Passed",
      reason: null,
      decisionReason: null,
      thesis: "Suspected honey pot",
      firstQuestion: null,
      createdAt: "2026-07-01T09:00:00Z",
      updatedAt: "2026-07-01T10:00:00Z",
    },
  ];

  test("renders header and memory cards for previous dossiers", () => {
    const html = renderToString(
      <ScoutRemembers
        deployerAddress="0x9999999999999999999999999999999999999999"
        dossiers={mockDossiers}
      />
    );
    assert.ok(html.includes("Scout Remembers"));
    assert.ok(html.includes("OLDTOKEN"));
    assert.ok(html.includes("RUGTOKEN"));
    assert.ok(html.includes("Passed"));
  });

  test("renders thesis snippet and first question", () => {
    const html = renderToString(
      <ScoutRemembers dossiers={mockDossiers} />
    );
    assert.ok(html.includes("This deployer launched"));
    assert.ok(html.includes("Was the mint authority revoked?"));
  });

  test("renders links to connected dossiers", () => {
    const html = renderToString(
      <ScoutRemembers dossiers={mockDossiers} />
    );
    assert.ok(html.includes("/d/0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("/d/0x2222222222222222222222222222222222222222"));
  });

  test("renders empty state when no prior dossiers exist", () => {
    const html = renderToString(<ScoutRemembers dossiers={[]} />);
    assert.ok(
      html.includes("no prior case files") ||
        html.includes("No prior investigations") ||
        html.includes("Scout Remembers")
    );
  });
});
