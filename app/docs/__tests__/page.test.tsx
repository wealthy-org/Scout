import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import DocsPage from "@/app/docs/page";

describe("Technical Documentation Page /docs (TICKET-79)", () => {
  it("renders Deployer Score mathematical specification, public API reference, and rate limits table", async () => {
    const pageJsx = await DocsPage();
    const html = renderToString(pageJsx);

    assert.ok(html.includes("Technical Documentation") || html.includes("API Reference"));
    assert.ok(html.includes("Deployer Score Formula"));
    assert.ok(html.includes("GET /api/deployer/:address") || html.includes("/api/deployer"));
    assert.ok(html.includes("GET /api/census") || html.includes("/api/census"));
    assert.ok(html.includes("Rate Limits") || html.includes("Quota Limits"));
    assert.ok(html.includes("On-Chain Risk Disclaimer") || html.includes("Disclaimer"));
  });
});
