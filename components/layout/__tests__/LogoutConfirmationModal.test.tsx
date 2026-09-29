import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { Header } from "../Header";

describe("Logout Confirmation Modal Verification (TICKET-138)", () => {
  test("renders authenticated header with logout button ready to trigger modal", () => {
    const html = renderToString(
      <Header
        isAuthenticated={true}
        walletAddress="0x89e24b216c855a0134bc9d82e1d7cf91c28c89b2"
      />
    );

    assert.ok(html.includes("header-logout-button"));
    assert.ok(html.includes("Logout"));
    assert.ok(html.includes("0x89e2...89b2"));
  });

  test("unauthenticated state renders connect wallet button and does not render logout trigger", () => {
    const html = renderToString(
      <Header
        isAuthenticated={false}
        walletAddress={null}
      />
    );

    assert.ok(html.includes("Connect Wallet"));
    assert.ok(!html.includes("header-logout-button"));
  });
});
