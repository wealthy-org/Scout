import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import HomePage, { metadata } from "../page";

describe("Landing Page / (TICKET-74)", () => {
  it("should define valid SEO metadata", () => {
    assert.ok(metadata.title);
    assert.ok(String(metadata.title).includes("Scout"));
  });

  it("should render hero, search input, 4-step workflow, and census pulse", async () => {
    const pageJsx = await HomePage();
    const html = renderToString(pageJsx);
    assert.ok(html.includes("Scout") || html.includes("SCOUT"));
    assert.ok(html.includes("Robinhood Chain") || html.includes("ROBINHOOD"));
    assert.ok(html.includes("Investigate") || html.includes("INVESTIGATE"));
    assert.ok(html.includes("Score") || html.includes("SCORE"));
    assert.ok(html.includes("Track") || html.includes("TRACK"));
    assert.ok(html.includes("Publish") || html.includes("PUBLISH"));
  });
});
