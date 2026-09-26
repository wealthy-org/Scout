import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import DemoDossierPage from "@/app/demo/[slug]/page";

describe("Demo Dossier Route /demo/[slug] (TICKET-80)", () => {
  it("renders demo mode banner, synthetic dossier data, and switcher for active fixture", async () => {
    const pageJsx = await DemoDossierPage({
      params: Promise.resolve({ slug: "active" }),
    });
    const html = renderToString(pageJsx);

    assert.ok(html.includes("DEMO MODE"));
    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("Scout Intelligence Protocol"));
    assert.ok(html.includes("88"));
  });

  it("renders rugged fixture with red band and serial label", async () => {
    const pageJsx = await DemoDossierPage({
      params: Promise.resolve({ slug: "rugged" }),
    });
    const html = renderToString(pageJsx);

    assert.ok(html.includes("PUMP"));
    assert.ok(html.includes("SERIAL") || html.includes("serial"));
    assert.ok(html.includes("RED") || html.includes("red"));
  });
});
