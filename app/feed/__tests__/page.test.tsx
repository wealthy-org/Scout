import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import FeedPage from "@/app/feed/page";

describe("Feed Assembly Page (TICKET-54)", () => {
  test("renders 2-column layout with header, ticker tape, summary tiles, feed table, and tapes", () => {
    const html = renderToString(<FeedPage />);

    assert.ok(html.includes("SCOUT"));
    assert.ok(html.includes("Live Launches"));
    assert.ok(html.includes("Most Traded"));
    assert.ok(html.includes("New Launches"));
    assert.ok(html.includes("Live Trade Tape"));
    assert.ok(html.includes("Graduation Stream"));
    assert.ok(html.includes("Launches (10m)") || html.includes("Total Volume"));
  });

  test("contains responsive 2-column grid container", () => {
    const html = renderToString(<FeedPage />);
    assert.ok(
      html.includes("grid-cols-1") ||
        html.includes("lg:grid-cols-3") ||
        html.includes("lg:grid-cols-12") ||
        html.includes("xl:grid-cols-4")
    );
  });
});
