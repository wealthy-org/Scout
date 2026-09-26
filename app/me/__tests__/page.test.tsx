import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  AccountClient,
  type AccountClientProps,
} from "@/components/account/AccountClient";

describe("Account Settings Page /me (TICKET-77)", () => {
  const mockProps: AccountClientProps = {
    isAuthenticated: true,
    user: {
      walletAddress: "0x1111111111111111111111111111111111111111",
      handle: "scout_operative",
      createdAt: "2026-03-01T00:00:00.000Z",
    },
  };

  it("renders auth required prompt when user is not authenticated", () => {
    const html = renderToString(
      <AccountClient isAuthenticated={false} user={null} />
    );

    assert.ok(html.includes("Authentication Required"));
    assert.ok(html.includes("Connect Wallet") || html.includes("Connect your Ethereum wallet"));
  });

  it("renders user profile info, handle update form, and danger zone when authenticated", () => {
    const html = renderToString(<AccountClient {...mockProps} />);

    assert.ok(html.includes("Account Settings"));
    assert.ok(html.includes("0x1111111111111111111111111111111111111111"));
    assert.ok(html.includes("scout_operative"));
    assert.ok(html.includes("Save Handle") || html.includes("Update Handle"));
    assert.ok(html.includes("Danger Zone") || html.includes("Delete Account"));
  });
});
