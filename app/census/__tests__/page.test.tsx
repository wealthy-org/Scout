import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import CensusPage, { metadata } from "../page";

describe("Census Page /census (TICKET-73)", () => {
  it("should have correct SEO metadata title", () => {
    assert.ok(metadata.title);
    assert.ok(String(metadata.title).includes("Census"));
  });

  it("should render macro metrics, SVG bar chart, repeat launchers table, and methodology", async () => {
    const pageJsx = await CensusPage();
    const html = renderToString(pageJsx);
    assert.ok(html.includes("LAUNCH CENSUS") || html.includes("Launch Census") || html.includes("CENSUS"));
    assert.ok(html.includes("Total Launches"));
    assert.ok(html.includes("Unique Deployers"));
    assert.ok(html.includes("Repeat Share"));
    assert.ok(html.includes("Repeat Launchers"));
    assert.ok(html.includes("Methodology"));
  });
});
