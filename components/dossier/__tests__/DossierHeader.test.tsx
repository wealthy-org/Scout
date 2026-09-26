import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { DossierHeader } from "@/components/dossier/DossierHeader";

describe("DossierHeader Component (TICKET-31)", () => {
  const defaultProps = {
    symbol: "PONK",
    name: "Ponk Inu",
    phase: "curve" as const,
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
  };

  test("renders symbol, name, and contract address correctly", () => {
    const html = renderToString(<DossierHeader {...defaultProps} />);
    assert.ok(html.includes("PONK"));
    assert.ok(html.includes("Ponk Inu"));
    assert.ok(html.includes("0x1234567890abcdef1234567890abcdef12345678"));
  });

  test("renders bonding curve phase badge for 'curve' phase", () => {
    const html = renderToString(<DossierHeader {...defaultProps} phase="curve" />);
    assert.ok(html.includes("Bonding Curve") || html.includes("BONDING"));
  });

  test("renders graduated phase badge for 'graduated' phase", () => {
    const html = renderToString(<DossierHeader {...defaultProps} phase="graduated" />);
    assert.ok(html.includes("Graduated") || html.includes("GRADUATED"));
  });

  test("renders action buttons: refresh, publish, export, delete", () => {
    const html = renderToString(<DossierHeader {...defaultProps} />);
    assert.ok(html.includes("Refresh"));
    assert.ok(html.includes("Publish"));
    assert.ok(html.includes("Export"));
    assert.ok(html.includes("Delete"));
  });

  test("renders export links for JSON and Markdown when export is open", () => {
    const html = renderToString(
      <DossierHeader {...defaultProps} defaultExportOpen={true} />
    );
    assert.ok(html.includes(`/api/dossier/${defaultProps.contractAddress}/export.md`));
    assert.ok(html.includes("/api/library/export"));
  });
});
