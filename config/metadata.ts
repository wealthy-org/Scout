import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://scout.wealthypeople.org"
  ),
  title: {
    default: "Scout // Dossier.OS: On-Chain Intelligence Terminal",
    template: "%s | Scout",
  },
  description:
    "On-chain intelligence and forensic case files for Robinhood Chain. Track deployer reputation scores, analyze bonding curve liquidity, map wallet clusters, and publish collaborative research.",
  keywords: [
    "Robinhood Chain",
    "On-Chain Intelligence",
    "Deployer Score",
    "Pons V2",
    "Bonding Curve",
    "Crypto Forensics",
    "Dossier.OS",
  ],
  authors: [{ name: "Wealthy People Org", url: "https://wealthypeople.org" }],
  creator: "Wealthy People Org",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scout.wealthypeople.org",
    siteName: "Scout Dossier.OS",
    title: "Scout // Dossier.OS: On-Chain Intelligence Terminal",
    description:
      "Forensic case files, Bayesian deployer scoring, and token surveillance for Robinhood Chain.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Scout Dossier.OS Intelligence Terminal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scout // Dossier.OS: On-Chain Intelligence Terminal",
    description:
      "Forensic case files, Bayesian deployer scoring, and token surveillance for Robinhood Chain.",
    images: ["/og-preview.png"],
    creator: "@wealthypeople",
  },
  robots: {
    index: true,
    follow: true,
  },
};
