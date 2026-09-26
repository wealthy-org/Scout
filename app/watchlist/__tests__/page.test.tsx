import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import WatchlistPage from "../page";

describe("Watchlist Page /watchlist (TICKET-69)", () => {
  it("should render watchlist layout and title", async () => {
    const pageJsx = await WatchlistPage();
    const html = renderToString(pageJsx);
    assert.ok(html.includes("Watchlist") || html.includes("WATCHLIST"));
    assert.ok(html.includes("Deployer"));
  });
});
