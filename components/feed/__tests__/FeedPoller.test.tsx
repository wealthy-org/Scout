import { test, describe } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { FeedPoller } from "@/components/feed/FeedPoller";

describe("FeedPoller Component (TICKET-49)", () => {
  test("renders FeedPoller status container", () => {
    const html = renderToString(
      <FeedPoller
        isLive={true}
        itemCount={42}
        onFetchNewLaunches={async () => []}
      />
    );
    assert.ok(html.includes("Live") || html.includes("polling") || html.includes("42"));
  });
});
