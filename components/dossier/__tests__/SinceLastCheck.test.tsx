import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { SinceLastCheck } from "@/components/dossier/SinceLastCheck";
import type { DiffItem } from "@/types/diff";

describe("SinceLastCheck Component (TICKET-40)", () => {
  const mockDiffs: DiffItem[] = [
    {
      field: "fdv",
      label: "FDV",
      oldVal: 100000,
      newVal: 120000,
      pctDelta: 20,
      exceeded: true,
      isBooleanTrigger: false,
    },
    {
      field: "liquidity",
      label: "Liquidity",
      oldVal: 50000,
      newVal: 38000,
      pctDelta: -24,
      exceeded: true,
      isBooleanTrigger: false,
    },
    {
      field: "curve_graduated",
      label: "Curve Graduated",
      oldVal: "curve",
      newVal: "graduated",
      exceeded: true,
      isBooleanTrigger: true,
    },
  ];

  test("renders header and last checked timestamp", () => {
    const html = renderToString(
      <SinceLastCheck
        diffs={mockDiffs}
        lastCheckedAt="2026-09-25T10:00:00Z"
      />
    );
    assert.ok(html.includes("Since Last Check"));
    assert.ok(html.includes("2026") || html.includes("Sep"));
  });

  test("renders alert cards for exceeded diffs with old and new values", () => {
    const html = renderToString(<SinceLastCheck diffs={mockDiffs} />);
    assert.ok(html.includes("FDV"));
    assert.ok(html.includes("+20%"));
    assert.ok(html.includes("Liquidity"));
    assert.ok(html.includes("-24%"));
    assert.ok(html.includes("Curve Graduated"));
    assert.ok(html.includes("graduated"));
  });

  test("renders 'No significant changes' when diffs array is empty", () => {
    const html = renderToString(<SinceLastCheck diffs={[]} />);
    assert.ok(
      html.includes("No significant changes") ||
        html.includes("No changes detected")
    );
  });
});
