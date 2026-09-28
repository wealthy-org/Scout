import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { DocsClient } from "@/components/docs/DocsClient";

export const metadata: Metadata = {
  title: "Technical Documentation & API Reference | Scout",
  description: "Mathematical specifications, REST API schemas, rate limits, and integration documentation for Scout Dossier.OS.",
};

export default async function DocsPage() {
  let userAddress: string | undefined;
  let isAuthenticated = false;

  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      userAddress = session.wallet_address;
      isAuthenticated = true;
    }
  } catch {
  }

  return <DocsClient isAuthenticated={isAuthenticated} userAddress={userAddress} />;
}
