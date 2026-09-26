import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { PublishDialog } from "@/components/dossier/PublishDialog";

describe("PublishDialog Component (TICKET-63 Dossier Suite)", () => {
  it("renders correctly when open with default props", () => {
    const html = renderToString(
      <PublishDialog
        isOpen={true}
        onClose={() => {}}
        contractAddress="0x1234567890123456789012345678901234567890"
      />
    );
    assert.ok(html.includes("Publish Dossier Snapshot"));
    assert.ok(html.includes("0x1234567890123456789012345678901234567890"));
  });
});
