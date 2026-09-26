import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import fs from "node:fs";
import path from "node:path";
import LibraryPage, { metadata } from "../page";

describe("Library Page /library Route Verification (TICKET-87)", () => {
  test("app/library/page.tsx file must exist and define valid SEO metadata", () => {
    const pagePath = path.resolve(process.cwd(), "app/library/page.tsx");
    assert.ok(fs.existsSync(pagePath), "app/library/page.tsx must exist");
    assert.ok(metadata.title, "Library metadata title must be defined");
    assert.ok(
      String(metadata.title).includes("Library") || String(metadata.title).includes("Case Files"),
      "Metadata title must mention Library or Case Files"
    );
  });

  test("LibraryPage server component must render without throwing", async () => {
    const component = await LibraryPage();
    assert.ok(React.isValidElement(component), "LibraryPage must return a valid React element");
  });

  test("app/dossiers/page.tsx must redirect or render Library seamlessly", () => {
    const dossiersPath = path.resolve(process.cwd(), "app/dossiers/page.tsx");
    assert.ok(fs.existsSync(dossiersPath), "app/dossiers/page.tsx must exist");
    const content = fs.readFileSync(dossiersPath, "utf-8");
    assert.ok(
      content.includes("redirect('/library')") || content.includes('redirect("/library")') || content.includes("LibraryClient") || content.includes("LibraryPage"),
      "app/dossiers/page.tsx must redirect or render Library"
    );
  });
});
