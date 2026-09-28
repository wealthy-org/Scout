import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import PublicDossierPage, { generateMetadata } from "../page";
import { PublicDossierClient } from "@/components/dossier/PublicDossierClient";

describe("Public Dossier Page /p/[slug] (TICKET-64)", () => {
  it("should generate appropriate metadata for a public dossier", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "test-slug" }),
    });
    assert.ok(meta.title);
    assert.ok(typeof meta.title === "string");
  });

  it("should trigger notFound for non-existent dossiers", async () => {
    await assert.rejects(
      async () => {
        await PublicDossierPage({
          params: Promise.resolve({ slug: "demo-slug" }),
        });
      },
      (err: unknown) => {
        const error = err as { digest?: string };
        return error?.digest === "NEXT_HTTP_ERROR_FALLBACK;404";
      }
    );
  });

  it("should render public dossier read-only layout", () => {
    const html = renderToString(
      <PublicDossierClient
        slug="demo-slug"
        authorHandle="analyst_1"
        revoked={false}
        payload={{
          symbol: "SCOUT",
          name: "Scout Intelligence",
          contractAddress: "0x1111111111111111111111111111111111111111",
          thesis: "Test research thesis content.",
        }}
      />
    );
    assert.ok(html.includes("Scout") || html.includes("SCOUT"));
    assert.ok(html.includes("Save a copy") || html.includes("Save Copy"));
  });
});

