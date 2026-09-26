import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import PublicDossierPage, { generateMetadata } from "../page";

describe("Public Dossier Page /p/[slug] (TICKET-64)", () => {
  it("should generate appropriate metadata for a public dossier", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "test-slug" }),
    });
    assert.ok(meta.title);
    assert.ok(typeof meta.title === "string");
  });

  it("should render public dossier read-only layout", async () => {
    const pageJsx = await PublicDossierPage({
      params: Promise.resolve({ slug: "demo-slug" }),
    });
    const html = renderToString(pageJsx);
    assert.ok(html.includes("Scout"));
    assert.ok(html.includes("Save a copy") || html.includes("Save Copy"));
  });
});
