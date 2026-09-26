import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import MapPage from "@/app/map/page";

describe("Map Page Assembly (TICKET-58)", () => {
  test("renders map page layout with header and connection canvas", () => {
    const html = renderToString(<MapPage />);

    assert.ok(html.includes("Connection Map") || html.includes("SCOUT"));
    assert.ok(html.includes("Status Legend") || html.includes("Connection Links") || html.includes("dossier"));
  });

  test("contains full-page canvas viewport container", () => {
    const html = renderToString(<MapPage />);
    assert.ok(html.includes("min-h-screen") || html.includes("h-full"));
  });
});
