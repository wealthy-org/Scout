import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { ConnectWalletModal } from "../ConnectWalletModal";
import {
  getEthereumProvider,
  checkWalletAvailability,
  signInWithWallet,
} from "@/lib/auth/wallet";
import { getAddress } from "viem";

describe("Phantom & EVM Wallet Connection (TICKET-106)", () => {
  test("ConnectWalletModal returns null when closed", () => {
    const html = renderToString(
      <ConnectWalletModal
        isOpen={false}
        isConnecting={false}
        connectingWallet={null}
        progressStep={null}
        error={null}
        onClose={() => {}}
        onSelectWallet={() => {}}
        onClearError={() => {}}
      />
    );
    assert.equal(html, "");
  });

  test("ConnectWalletModal renders Phantom (recommended), MetaMask, and Injected options when open", () => {
    const html = renderToString(
      <ConnectWalletModal
        isOpen={true}
        isConnecting={false}
        connectingWallet={null}
        progressStep={null}
        error={null}
        onClose={() => {}}
        onSelectWallet={() => {}}
        onClearError={() => {}}
      />
    );
    assert.ok(html.includes("Connect Wallet"));
    assert.ok(html.includes("Phantom Wallet"));
    assert.ok(html.includes("RECOMMENDED"));
    assert.ok(html.includes("MetaMask"));
    assert.ok(html.includes("Browser Injected Wallet"));
    assert.ok(html.includes("Sign in with Ethereum (SIWE)"));
  });

  test("ConnectWalletModal renders connection progress and spinner when isConnecting is true", () => {
    const html = renderToString(
      <ConnectWalletModal
        isOpen={true}
        isConnecting={true}
        connectingWallet="phantom"
        progressStep="Please sign the message in your wallet..."
        error={null}
        onClose={() => {}}
        onSelectWallet={() => {}}
        onClearError={() => {}}
      />
    );
    assert.ok(html.includes("Connecting Phantom..."));
    assert.ok(html.includes("Please sign the message in your wallet..."));
    assert.ok(html.includes("Please check your wallet extension popup"));
  });

  test("ConnectWalletModal renders error message and dismiss action when error is provided", () => {
    const html = renderToString(
      <ConnectWalletModal
        isOpen={true}
        isConnecting={false}
        connectingWallet={null}
        progressStep={null}
        error="Signature request was cancelled by user."
        onClose={() => {}}
        onSelectWallet={() => {}}
        onClearError={() => {}}
      />
    );
    assert.ok(html.includes("Signature request was cancelled by user."));
    assert.ok(html.includes("Dismiss"));
  });

  test("getEthereumProvider detects phantom provider from window hierarchy", () => {
    const mockPhantomProvider = { request: async () => [] };
    const globalWithPhantom = global as unknown as {
      window: {
        phantom?: { ethereum?: typeof mockPhantomProvider };
        ethereum?: { isPhantom?: boolean };
      };
    };

    const previousWindow = globalWithPhantom.window;

    globalWithPhantom.window = {
      phantom: { ethereum: mockPhantomProvider },
    };
    assert.equal(getEthereumProvider("phantom"), mockPhantomProvider);

    const mockInjectedPhantom = { isPhantom: true, request: async () => [] };
    globalWithPhantom.window = {
      ethereum: mockInjectedPhantom,
    };
    assert.equal(getEthereumProvider("phantom"), mockInjectedPhantom);

    globalWithPhantom.window = {
      ethereum: { isPhantom: false },
    };
    assert.equal(getEthereumProvider("phantom"), null);

    globalWithPhantom.window = previousWindow;
  });

  test("checkWalletAvailability detects presence of phantom and metamask", () => {
    const globalWithWindow = global as unknown as {
      window: {
        phantom?: { ethereum?: { request: () => void } };
        ethereum?: { isMetaMask?: boolean };
      };
    };
    const previousWindow = globalWithWindow.window;

    globalWithWindow.window = {
      phantom: { ethereum: { request: () => {} } },
      ethereum: { isMetaMask: true },
    };

    const avail = checkWalletAvailability();
    assert.equal(avail.phantom, true);
    assert.equal(avail.metamask, true);
    assert.equal(avail.injected, true);

    globalWithWindow.window = previousWindow;
  });

  test("signInWithWallet converts lowercase wallet address to EIP-55 checksummed address for SIWE signature", async () => {
    const rawInputAddress = "0xc951b9b954e2bb8db3ba9bea3bdd266226faccac";
    const expectedChecksummedAddress = getAddress(rawInputAddress);

    let signedMessage = "";
    let signedAddress = "";

    const mockProvider = {
      request: async ({ method, params }: { method: string; params?: unknown[] }) => {
        if (method === "eth_requestAccounts") {
          return [rawInputAddress];
        }
        if (method === "personal_sign") {
          signedMessage = (params?.[0] as string) || "";
          signedAddress = (params?.[1] as string) || "";
          return "0xmock_signature";
        }
        return null;
      },
    };

    const globalObj = global as unknown as {
      window: {
        location: { host: string; origin: string };
        phantom: { ethereum: typeof mockProvider };
      };
      fetch: typeof fetch;
    };

    const prevWindow = globalObj.window;
    const prevFetch = globalObj.fetch;

    globalObj.window = {
      location: { host: "localhost:3000", origin: "http://localhost:3000" },
      phantom: { ethereum: mockProvider },
    };

    let verifyBody: { message?: string; signature?: string } = {};

    globalObj.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/auth/nonce") {
        return new Response(JSON.stringify({ nonce: "12345678" }), { status: 200 });
      }
      if (url === "/api/auth/verify") {
        verifyBody = JSON.parse(String(init?.body || "{}"));
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }
      return new Response("Not found", { status: 404 });
    }) as typeof fetch;

    try {
      const progressSteps: string[] = [];
      const result = await signInWithWallet("phantom", (step) => progressSteps.push(step));

      assert.equal(result.success, true);
      assert.equal(result.walletAddress, rawInputAddress);
      assert.equal(signedAddress, expectedChecksummedAddress);
      assert.ok(signedMessage.includes(expectedChecksummedAddress));
      assert.ok(!signedMessage.includes(rawInputAddress));
      assert.equal(verifyBody.signature, "0xmock_signature");
      assert.ok(progressSteps.length >= 3);
    } finally {
      globalObj.window = prevWindow;
      globalObj.fetch = prevFetch;
    }
  });
});
