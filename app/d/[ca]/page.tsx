import React from "react";
import { redirect } from "next/navigation";
import { DossierClientView } from "@/components/dossier/DossierClientView";
import { getSession } from "@/lib/auth/session";
import {
  fetchDossierPageData,
  type DossierPagePropsData,
} from "@/lib/dossier/fetch";

export type { DossierPagePropsData };
export { DossierClientView as DossierPageView };

export default async function DossierPage(props: {
  params: Promise<{ ca: string }> | { ca: string };
}) {
  const resolvedParams = await props.params;
  const ca = resolvedParams.ca;

  let userWalletAddress: string | undefined;
  try {
    const session = await getSession();
    if (session && session.wallet_address) {
      userWalletAddress = session.wallet_address;
    }
  } catch {}

  const data = await fetchDossierPageData(ca, userWalletAddress);

  if (data.isDeployer) {
    redirect(`/deployer/${ca}`);
  }

  return <DossierClientView data={data} />;
}
