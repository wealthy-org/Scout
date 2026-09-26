import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import HowPage from "@/app/how/page";

describe("Methodology & Glossary Page /how (TICKET-78)", () => {
  it("renders 4-step intelligence workflow, since last check diff methodology, and constellation graph rules", async () => {
    const pageJsx = await HowPage();
    const html = renderToString(pageJsx);

    assert.ok(html.includes("Methodology"));
    assert.ok(html.includes("01") && html.includes("Investigate"));
    assert.ok(html.includes("02") && html.includes("Score"));
    assert.ok(html.includes("03") && html.includes("Track"));
    assert.ok(html.includes("04") && html.includes("Publish"));
    assert.ok(html.includes("Since Last Check"));
    assert.ok(html.includes("Constellation Graph"));
  });

  it("renders comprehensive on-chain glossary terms", async () => {
    const pageJsx = await HowPage();
    const html = renderToString(pageJsx);

    assert.ok(html.includes("Bonding Curve"));
    assert.ok(html.includes("Laplace Smoothing"));
    assert.ok(html.includes("Dead on Arrival (DOA)"));
    assert.ok(html.includes("Burst Rate"));
    assert.ok(html.includes("Serial Penalty Cap"));
  });
});
