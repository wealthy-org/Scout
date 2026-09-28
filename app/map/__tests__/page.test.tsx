import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import MapPage from "@/app/map/page";
import { MapClient } from "@/components/map/MapClient";

describe("Map Page Assembly (TICKET-58)", () => {
  test("renders map page layout with header and connection canvas", async () => {
    const component = await MapPage();
    const html = renderToString(component);

    assert.ok(html.includes("Connection Map") || html.includes("SCOUT"));
    assert.ok(html.includes("Authentication Required") || html.includes("No Dossier Connections"));
  });

  test("contains full-page canvas viewport container", async () => {
    const component = await MapPage();
    const html = renderToString(component);
    assert.ok(html.includes("min-h-screen") || html.includes("h-full"));
  });

  test("renders interactive connection map when authenticated with nodes", () => {
    const html = renderToString(
      <MapClient
        isAuthenticated={true}
        userAddress="0x1234567890123456789012345678901234567890"
        initialNodes={[
          {
            contractAddress: "0x1111111111111111111111111111111111111111",
            symbol: "ALPHA",
            status: "active",
            name: "Alpha Protocol",
          },
        ]}
        initialEdges={[]}
      />
    );
    assert.ok(html.includes("ALPHA"));
    assert.ok(html.includes("1 Nodes"));
  });
});

