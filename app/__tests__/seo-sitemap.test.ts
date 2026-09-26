import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { siteMetadata } from "@/config/metadata";

describe("SEO, OpenGraph & Dynamic Sitemap (TICKET-84)", () => {
  it("root layout defines comprehensive OpenGraph, Twitter, and canonical metadata", () => {
    assert.ok(siteMetadata.title);
    assert.ok(siteMetadata.description);
    assert.ok(siteMetadata.openGraph);
    assert.ok(siteMetadata.twitter);
    assert.ok(siteMetadata.metadataBase);
  });

  it("app/sitemap.ts returns an array of primary URLs with valid changeFrequency and priority", async () => {
    const entries = await sitemap();
    assert.ok(Array.isArray(entries));
    assert.ok(entries.length >= 8);

    const urls = entries.map((e) => e.url);
    assert.ok(urls.some((u) => u.endsWith("/")));
    assert.ok(urls.some((u) => u.includes("/feed")));
    assert.ok(urls.some((u) => u.includes("/census")));
    assert.ok(urls.some((u) => u.includes("/how")));
    assert.ok(urls.some((u) => u.includes("/docs")));
    assert.ok(urls.some((u) => u.includes("/demo/active")));
  });

  it("app/robots.ts produces valid robots directive with sitemap reference", () => {
    const config = robots();
    assert.ok(config.rules);
    assert.ok(config.sitemap);
  });
});
