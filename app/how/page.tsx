import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { HowClient } from "@/components/how/HowClient";

export const metadata: Metadata = {
  title: "Methodology & Architecture | Scout",
  description: "Algorithmic formulas, delta trigger thresholds, graph relation heuristics, and glossary for Scout Dossier.OS.",
};

export default async function HowPage() {
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

  return <HowClient isAuthenticated={isAuthenticated} userAddress={userAddress} />;
}
