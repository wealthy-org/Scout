import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { PublishDialog } from "@/components/dossier/PublishDialog";

describe("PublishDialog Component (TICKET-63)", () => {
  it("should not render modal contents when isOpen is false", () => {
    const html = renderToString(
      <PublishDialog
        isOpen={false}
        onClose={() => {}}
        contractAddress="0x1234567890123456789012345678901234567890"
      />
    );
    assert.strictEqual(html, "");
  });

  it("should render backdrop, input, toggle, and buttons when isOpen is true", () => {
    const html = renderToString(
      <PublishDialog
        isOpen={true}
        onClose={() => {}}
        contractAddress="0x1234567890123456789012345678901234567890"
        symbol="SCOUT"
        name="Scout Token"
        thesis="Bullish thesis for token analysis"
        hasNotes={true}
      />
    );
    assert.ok(html.includes("Publish Dossier"));
    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("Scout Token"));
    assert.ok(html.includes("Include private research notes"));
    assert.ok(html.includes("Analyst Handle"));
    assert.ok(html.includes("Publish Snapshot"));
  });

  it("should render published link and copy button when initialPublishedUrl is provided", () => {
    const html = renderToString(
      <PublishDialog
        isOpen={true}
        onClose={() => {}}
        contractAddress="0x1234567890123456789012345678901234567890"
        initialPublishedUrl="/p/abc123xyz"
      />
    );
    assert.ok(html.includes("/p/abc123xyz"));
    assert.ok(html.includes("Copy Link"));
  });
});
