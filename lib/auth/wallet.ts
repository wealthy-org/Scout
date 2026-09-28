import { SiweMessage } from "siwe";

export type WalletType = "phantom" | "metamask" | "injected";

export interface WalletAvailability {
  phantom: boolean;
  metamask: boolean;
  injected: boolean;
}

export function getEthereumProvider(type: WalletType) {
  if (typeof window === "undefined") return null;

  const w = window as unknown as {
    phantom?: { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } };
    ethereum?: {
      isPhantom?: boolean;
      isMetaMask?: boolean;
      providers?: Array<{
        isPhantom?: boolean;
        isMetaMask?: boolean;
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      }>;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  };

  if (type === "phantom") {
    if (w.phantom?.ethereum) {
      return w.phantom.ethereum;
    }
    if (w.ethereum?.isPhantom) {
      return w.ethereum;
    }
    if (Array.isArray(w.ethereum?.providers)) {
      const p = w.ethereum.providers.find((item) => item.isPhantom);
      if (p) return p;
    }
    return null;
  }

  if (type === "metamask") {
    if (Array.isArray(w.ethereum?.providers)) {
      const p = w.ethereum.providers.find((item) => item.isMetaMask && !item.isPhantom);
      if (p) return p;
    }
    if (w.ethereum?.isMetaMask && !w.ethereum?.isPhantom) {
      return w.ethereum;
    }
    if (w.ethereum) {
      return w.ethereum;
    }
    return null;
  }

  if (type === "injected") {
    return w.phantom?.ethereum || w.ethereum || null;
  }

  return null;
}

export function checkWalletAvailability(): WalletAvailability {
  if (typeof window === "undefined") {
    return { phantom: false, metamask: false, injected: false };
  }

  const w = window as unknown as {
    phantom?: { ethereum?: unknown };
    ethereum?: {
      isPhantom?: boolean;
      isMetaMask?: boolean;
      providers?: Array<{ isPhantom?: boolean; isMetaMask?: boolean }>;
    };
  };

  const hasPhantom = Boolean(
    w.phantom?.ethereum ||
      w.ethereum?.isPhantom ||
      (Array.isArray(w.ethereum?.providers) && w.ethereum.providers.some((p) => p.isPhantom))
  );

  const hasMetaMask = Boolean(
    (w.ethereum?.isMetaMask && !w.ethereum?.isPhantom) ||
      (Array.isArray(w.ethereum?.providers) &&
        w.ethereum.providers.some((p) => p.isMetaMask && !p.isPhantom))
  );

  const hasInjected = Boolean(w.ethereum || w.phantom?.ethereum);

  return {
    phantom: hasPhantom,
    metamask: hasMetaMask,
    injected: hasInjected,
  };
}

export async function signInWithWallet(
  walletType: WalletType,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; walletAddress: string }> {
  const provider = getEthereumProvider(walletType);

  if (!provider) {
    if (walletType === "phantom") {
      throw new Error(
        "Phantom wallet extension is not detected. Please install Phantom from https://phantom.app to continue."
      );
    }
    if (walletType === "metamask") {
      throw new Error(
        "MetaMask extension is not detected. Please install MetaMask to continue."
      );
    }
    throw new Error(
      "No EVM wallet detected in browser. Please install Phantom or another web3 wallet."
    );
  }

  onProgress?.("Connecting to wallet account...");
  let accounts: string[];
  try {
    accounts = (await provider.request({
      method: "eth_requestAccounts",
    })) as string[];
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error?.code === 4001 || error?.message?.includes("User rejected")) {
      throw new Error("Connection request was rejected by user in wallet.");
    }
    throw new Error(error?.message || "Failed to connect to wallet.");
  }

  if (!accounts || accounts.length === 0) {
    throw new Error("No account address returned from wallet.");
  }

  const account = accounts[0].toLowerCase();

  onProgress?.("Requesting cryptographic nonce...");
  const nonceRes = await fetch("/api/auth/nonce", { method: "POST" });
  if (!nonceRes.ok) {
    throw new Error("Failed to generate authentication challenge nonce from server.");
  }

  const nonceData = (await nonceRes.json()) as { nonce?: string; error?: string };
  if (!nonceData.nonce) {
    throw new Error(nonceData.error || "Missing nonce in authentication challenge.");
  }

  const domain = window.location.host;
  const origin = window.location.origin;

  const siweMessage = new SiweMessage({
    domain,
    address: account,
    statement: "Sign in with Ethereum to Scout",
    uri: origin,
    version: "1",
    chainId: 4663,
    nonce: nonceData.nonce,
  });

  const messageToSign = siweMessage.prepareMessage();

  onProgress?.("Please sign the message in your wallet...");
  let signature: string;
  try {
    signature = (await provider.request({
      method: "personal_sign",
      params: [messageToSign, account],
    })) as string;
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error?.code === 4001 || error?.message?.includes("User rejected")) {
      throw new Error("Signature request was cancelled by user.");
    }
    throw new Error(error?.message || "Failed to obtain signature from wallet.");
  }

  onProgress?.("Verifying signature on server...");
  const verifyRes = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: messageToSign, signature }),
  });

  const verifyData = (await verifyRes.json()) as { ok?: boolean; error?: string };
  if (!verifyRes.ok || !verifyData.ok) {
    throw new Error(verifyData.error || "Signature verification failed on server.");
  }

  return {
    success: true,
    walletAddress: account,
  };
}

export async function logoutWallet(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
