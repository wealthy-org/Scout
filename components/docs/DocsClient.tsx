"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCpu,
  IconCheck,
  IconClipboard,
  IconAlert,
  IconCode,
  IconShield,
  IconDatabase,
} from "@/components/icons/Vectors";

interface DocsClientProps {
  isAuthenticated: boolean;
  userAddress?: string;
}

interface EndpointDoc {
  id: string;
  method: "GET" | "POST" | "DELETE";
  path: string;
  title: string;
  description: string;
  authRequired: boolean;
  rateLimit: string;
  params: { name: string; type: string; required: boolean; description: string }[];
  exampleRequest: {
    curl: string;
    typescript: string;
    python: string;
  };
  sampleResponse: string;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    id: "deployer-profile",
    method: "GET",
    path: "/api/deployer/:address",
    title: "Deployer Reputation & Launch History",
    description:
      "Calculates the Bayesian reputation score, 5 algorithmic risk signals, and retrieves up to 40 historical genesis launches for any Ethereum creator wallet on Robinhood Chain.",
    authRequired: false,
    rateLimit: "30 req / min / IP",
    params: [
      {
        name: "address",
        type: "string (0x...)",
        required: true,
        description: "20-byte hexadecimal Ethereum wallet address of the deployer.",
      },
    ],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/deployer/0x89e247413697b0d911b3327d78fa1b94541889b2" \\
  -H "Accept: application/json"`,
      typescript: `import { createPublicClient, http } from "viem";

async function fetchDeployerProfile(address: string) {
  const res = await fetch(\`https://scout-five-xi.vercel.app/api/deployer/\${address}\`);
  if (!res.ok) throw new Error(\`Failed: \${res.statusText}\`);
  const data = await res.json();
  return data;
}`,
      python: `import requests

def get_deployer_profile(address: str):
    url = f"https://scout-five-xi.vercel.app/api/deployer/{address}"
    resp = requests.get(url, headers={"Accept": "application/json"})
    resp.raise_for_status()
    return resp.json()`,
    },
    sampleResponse: `{
  "address": "0x89e247413697b0d911b3327d78fa1b94541889b2",
  "score": 84,
  "label": "Reliable",
  "band": "GREEN",
  "isContract": false,
  "metrics": {
    "totalLaunches": 12,
    "graduatedCount": 10,
    "graduationRate": 0.833,
    "doaRate": 0.083,
    "burstRate": 0.0
  },
  "signals": {
    "laplaceScore": 78.5,
    "doaPenalty": 2.1,
    "burstPenalty": 0.0,
    "serialPenaltyClamped": false
  },
  "launches": [
    {
      "tokenAddress": "0x3b890918b8b0e8c740a3e0b57e7939bf83457102",
      "symbol": "SCOUT",
      "name": "Scout Intelligence",
      "phase": "Graduated",
      "marketCap": 2450000,
      "blockNumber": 27189420
    }
  ]
}`,
  },
  {
    id: "census-macro",
    method: "GET",
    path: "/api/census",
    title: "Ecosystem Census & Macro Surveillance",
    description:
      "Returns macro ecosystem statistics across Robinhood Chain, including unique deployer count, repeat launcher ratio, 24-bucket block density distribution, and top 20 ranked creators.",
    authRequired: false,
    rateLimit: "30 req / min / IP",
    params: [],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/census" \\
  -H "Accept: application/json"`,
      typescript: `async function getEcosystemCensus() {
  const res = await fetch("https://scout-five-xi.vercel.app/api/census");
  return await res.json();
}`,
      python: `import requests

resp = requests.get("https://scout-five-xi.vercel.app/api/census")
census_data = resp.json()`,
    },
    sampleResponse: `{
  "totalLaunches": 40,
  "uniqueDeployers": 19,
  "repeatShare": 0.439,
  "quarantinedCount": 8,
  "headBlock": 27195420,
  "windowBlocks": 240000,
  "distribution": [
    { "bucket": 1, "blockSpan": "27.18M - 27.19M", "launches": 8 },
    { "bucket": 2, "blockSpan": "27.17M - 27.18M", "launches": 14 }
  ],
  "topLaunchers": [
    {
      "address": "0x742d35cc6634c0532925a3b844bc454e4438f44e",
      "launches": 8,
      "graduated": 7,
      "score": 88,
      "band": "GREEN"
    }
  ]
}`,
  },
  {
    id: "case-file-public",
    method: "GET",
    path: "/api/p/:slug",
    title: "Immutable Case File Snapshot",
    description:
      "Retrieves a frozen, cryptographically signed dossier snapshot by public slug. Returns HTTP 410 (Gone) if revoked by the original researcher.",
    authRequired: false,
    rateLimit: "30 req / min / IP",
    params: [
      {
        name: "slug",
        type: "string",
        required: true,
        description: "Unique URL slug identifying the published immutable case file.",
      },
    ],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/p/scout-protocol-dossier-4b82f1" \\
  -H "Accept: application/json"`,
      typescript: `async function fetchPublicCaseFile(slug: string) {
  const res = await fetch(\`https://scout-five-xi.vercel.app/api/p/\${slug}\`);
  if (res.status === 410) throw new Error("Case file has been revoked by author");
  return await res.json();
}`,
      python: `import requests

resp = requests.get("https://scout-five-xi.vercel.app/api/p/scout-protocol-dossier-4b82f1")
if resp.status_code == 410:
    print("Snapshot revoked")
else:
    case_file = resp.json()`,
    },
    sampleResponse: `{
  "slug": "scout-protocol-dossier-4b82f1",
  "title": "Autonomous Pons V2 Sybil Ring Audit",
  "authorAddress": "0x12a9471928374910283749102837491028374910",
  "createdAt": "2026-09-28T04:15:00.000Z",
  "tokenAddress": "0x3b890918b8b0e8c740a3e0b57e7939bf83457102",
  "digestHash": "0x7f2a8901bce4710283910293847102938471029384710293847102938471c89e",
  "thesis": "Deployer routes protocol fees across 4 secondary burner addresses.",
  "isRevoked": false,
  "forkCount": 3
}`,
  },
  {
    id: "dossier-ca",
    method: "GET",
    path: "/api/dossier/:ca",
    title: "Token Intelligence Dossier & State",
    description:
      "Performs real-time MultiCall3 aggregation of token bytecode, Pons V2 bonding curve status, DEX liquidity reserves, and deployer origin links.",
    authRequired: false,
    rateLimit: "30 req / min / IP",
    params: [
      {
        name: "ca",
        type: "string (0x...)",
        required: true,
        description: "20-byte hexadecimal Ethereum contract address of the target token.",
      },
    ],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/dossier/0x3b890918b8b0e8c740a3e0b57e7939bf83457102" \\
  -H "Accept: application/json"`,
      typescript: `async function fetchTokenDossier(tokenAddress: string) {
  const res = await fetch(\`https://scout-five-xi.vercel.app/api/dossier/\${tokenAddress}\`);
  return await res.json();
}`,
      python: `import requests

resp = requests.get("https://scout-five-xi.vercel.app/api/dossier/0x3b890918b8b0e8c740a3e0b57e7939bf83457102")
dossier = resp.json()`,
    },
    sampleResponse: `{
  "token": {
    "address": "0x3b890918b8b0e8c740a3e0b57e7939bf83457102",
    "name": "Scout Intelligence Protocol",
    "symbol": "SCOUT",
    "phase": "Pons V2 Curve",
    "marketCap": 854000,
    "liquidityUsd": 120500,
    "deployerAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2",
    "feeRecipient": "0x89e247413697b0d911b3327d78fa1b94541889b2"
  },
  "score": 84,
  "snapshots": [
    { "timestamp": "2026-09-28T02:00:00.000Z", "marketCap": 810000, "phase": "Pons V2 Curve" }
  ]
}`,
  },
  {
    id: "watchlist-get",
    method: "GET",
    path: "/api/watchlist",
    title: "User Watchlist Deployers",
    description:
      "Retrieves the authenticated researcher's monitored deployer addresses, including calculated Bayesian scores and last seen activity.",
    authRequired: true,
    rateLimit: "30 req / min / IP",
    params: [],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/watchlist" \\
  -H "Cookie: scout_session=YOUR_SESSION_JWT" \\
  -H "Accept: application/json"`,
      typescript: `async function getMyWatchlist() {
  const res = await fetch("https://scout-five-xi.vercel.app/api/watchlist", {
    credentials: "include",
  });
  return await res.json();
}`,
      python: `import requests

session = requests.Session()
session.cookies.set("scout_session", "YOUR_SESSION_JWT")
resp = session.get("https://scout-five-xi.vercel.app/api/watchlist")
watchlist = resp.json()`,
    },
    sampleResponse: `[
  {
    "deployerAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2",
    "score": 84,
    "label": "Reliable",
    "band": "GREEN",
    "launchesCount": 12,
    "addedAt": "2026-09-28T01:00:00.000Z"
  }
]`,
  },
  {
    id: "watchlist-post",
    method: "POST",
    path: "/api/watchlist",
    title: "Add Deployer to Watchlist",
    description:
      "Enrolls a deployer address into the researcher's active surveillance list. Subject to a quota of 30 addresses maximum.",
    authRequired: true,
    rateLimit: "30 req / min / IP",
    params: [
      {
        name: "deployerAddress",
        type: "string (0x...)",
        required: true,
        description: "20-byte hexadecimal Ethereum address of the deployer to monitor.",
      },
    ],
    exampleRequest: {
      curl: `curl -X POST "https://scout-five-xi.vercel.app/api/watchlist" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: scout_session=YOUR_SESSION_JWT" \\
  -d '{"deployerAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2"}'`,
      typescript: `async function addToWatchlist(address: string) {
  const res = await fetch("https://scout-five-xi.vercel.app/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deployerAddress: address }),
    credentials: "include",
  });
  return await res.json();
}`,
      python: `import requests

resp = requests.post(
    "https://scout-five-xi.vercel.app/api/watchlist",
    json={"deployerAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2"},
    cookies={"scout_session": "YOUR_SESSION_JWT"}
)
print(resp.json())`,
    },
    sampleResponse: `{
  "success": true,
  "deployerAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2",
  "currentCount": 7,
  "maxLimit": 30
}`,
  },
  {
    id: "watchlist-delete",
    method: "DELETE",
    path: "/api/watchlist/:address",
    title: "Remove Deployer from Watchlist",
    description:
      "Removes an enrolled deployer wallet from the authenticated researcher's surveillance watchlist.",
    authRequired: true,
    rateLimit: "30 req / min / IP",
    params: [
      {
        name: "address",
        type: "string (0x...)",
        required: true,
        description: "20-byte hexadecimal Ethereum address to remove from watchlist.",
      },
    ],
    exampleRequest: {
      curl: `curl -X DELETE "https://scout-five-xi.vercel.app/api/watchlist/0x89e247413697b0d911b3327d78fa1b94541889b2" \\
  -H "Cookie: scout_session=YOUR_SESSION_JWT"`,
      typescript: `async function removeFromWatchlist(address: string) {
  const res = await fetch(\`https://scout-five-xi.vercel.app/api/watchlist/\${address}\`, {
    method: "DELETE",
    credentials: "include",
  });
  return await res.json();
}`,
      python: `import requests

resp = requests.delete(
    "https://scout-five-xi.vercel.app/api/watchlist/0x89e247413697b0d911b3327d78fa1b94541889b2",
    cookies={"scout_session": "YOUR_SESSION_JWT"}
)
print(resp.status_code)`,
    },
    sampleResponse: `{
  "success": true,
  "removedAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2"
}`,
  },
  {
    id: "auth-me",
    method: "GET",
    path: "/api/auth/me",
    title: "Session Authentication Status",
    description:
      "Validates the SIWE session cookie and returns the active researcher's wallet address and session expiration timestamp.",
    authRequired: true,
    rateLimit: "60 req / min / IP",
    params: [],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/auth/me" \\
  -H "Cookie: scout_session=YOUR_SESSION_JWT" \\
  -H "Accept: application/json"`,
      typescript: `async function getAuthStatus() {
  const res = await fetch("https://scout-five-xi.vercel.app/api/auth/me", {
    credentials: "include",
  });
  return await res.json();
}`,
      python: `import requests

resp = requests.get(
    "https://scout-five-xi.vercel.app/api/auth/me",
    cookies={"scout_session": "YOUR_SESSION_JWT"}
)
print(resp.json())`,
    },
    sampleResponse: `{
  "authenticated": true,
  "address": "0x89e247413697b0d911b3327d78fa1b94541889b2",
  "chainId": 4663,
  "expiresAt": "2026-09-29T16:00:00.000Z"
}`,
  },
];

const NAV_GROUPS = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "architecture", label: "Architecture & MultiCall" },
    ],
  },
  {
    title: "Reputation Engine",
    items: [
      { id: "formula", label: "Deployer Score Formula" },
      { id: "scoring-bands", label: "Scoring Bands Matrix" },
    ],
  },
  {
    title: "REST API Endpoints",
    items: [
      { id: "endpoints", label: "Overview & Reference" },
      { id: "endpoint-deployer-profile", label: "GET /api/deployer/:address" },
      { id: "endpoint-census-macro", label: "GET /api/census" },
      { id: "endpoint-case-file-public", label: "GET /api/p/:slug" },
      { id: "endpoint-dossier-ca", label: "GET /api/dossier/:ca" },
      { id: "endpoint-watchlist", label: "/api/watchlist (CRUD)" },
      { id: "endpoint-auth-me", label: "GET /api/auth/me" },
    ],
  },
  {
    title: "Developer Tools",
    items: [
      { id: "sandbox", label: "Interactive API Playground" },
      { id: "contracts", label: "Verified Smart Contracts" },
    ],
  },
  {
    title: "Specifications & Policies",
    items: [
      { id: "limits", label: "Rate Limits & Quotas" },
      { id: "disclaimer", label: "On-Chain Risk Disclaimer" },
    ],
  },
];

const TOC_ITEMS = [
  { id: "introduction", label: "Introduction" },
  { id: "architecture", label: "Architecture" },
  { id: "formula", label: "Score Formula" },
  { id: "scoring-bands", label: "Scoring Bands" },
  { id: "endpoints", label: "REST Reference" },
  { id: "sandbox", label: "API Playground" },
  { id: "contracts", label: "Smart Contracts" },
  { id: "limits", label: "Rate Limits" },
  { id: "disclaimer", label: "Risk Disclaimer" },
];

export function DocsClient({ isAuthenticated, userAddress }: DocsClientProps) {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("deployer-profile");
  const [activeCodeLang, setActiveCodeLang] = useState<"curl" | "typescript" | "python">("curl");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("introduction");

  const [sandboxAddress, setSandboxAddress] = useState<string>("0x89e247413697b0d911b3327d78fa1b94541889b2");
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeEndpoint = useMemo(() => {
    return ENDPOINTS.find((ep) => ep.id === selectedEndpointId) || ENDPOINTS[0];
  }, [selectedEndpointId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const item = TOC_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunSandbox = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSandboxResponse(activeEndpoint.sampleResponse);
      setIsSimulating(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-20 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 items-start">
          
          <aside
            aria-label="Documentation Navigation"
            className="w-full lg:w-64 shrink-0 lg:sticky lg:top-28 self-start max-h-none lg:max-h-[calc(100vh-8rem)] overflow-y-visible lg:overflow-y-auto pb-6"
          >
            <div className="space-y-4">
              <div className="hidden lg:flex items-center justify-between p-3.5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E]">
                <span className="text-xs font-mono uppercase tracking-wider font-black text-[#99F6E4]">
                  DOCUMENTATION
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E]">
                  v2.4
                </span>
              </div>

              <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 no-scrollbar">
                {TOC_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border-2 border-[#042F2E] ${
                      activeSection === item.id
                        ? "bg-[#FFD166] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                        : "bg-[#064E4A] text-[#A7F3D0] hover:text-[#FFFDF7] shadow-[2px_2px_0px_#042F2E]"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="hidden lg:block space-y-4">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title} className="p-3.5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-2">
                    <h5 className="text-[10px] font-mono uppercase tracking-wider font-black text-[#FFD166] px-1">
                      {group.title}
                    </h5>
                    <ul className="space-y-1 text-xs font-medium">
                      {group.items.map((item) => {
                        const isNavActive =
                          activeSection === item.id ||
                          (item.id.startsWith("endpoint-") &&
                            selectedEndpointId === item.id.replace("endpoint-", "") &&
                            activeSection === "endpoints");
                        return (
                          <li key={item.id}>
                            <a
                              href={`#${item.id.startsWith("endpoint-") ? "endpoints" : item.id}`}
                              onClick={() => {
                                if (item.id.startsWith("endpoint-")) {
                                  setSelectedEndpointId(item.id.replace("endpoint-", ""));
                                }
                              }}
                              className={`block px-2.5 py-1.5 rounded-xl transition-all font-mono text-[11px] ${
                                isNavActive
                                  ? "bg-[#042F2E] text-[#FFD166] font-black border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                                  : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#042F2E]/40"
                              }`}
                            >
                              {item.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block p-3.5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] font-mono text-[10px] text-[#A7F3D0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>CHAIN ID:</span>
                  <span className="text-[#99F6E4] font-black">4663 (ROBINHOOD)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>RPC STATUS:</span>
                  <span className="text-[#99F6E4] font-black flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                    CONNECTED
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0 max-w-4xl space-y-10 pb-12">
            
            <header className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-4">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#99F6E4] font-bold">
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <span className="text-[#A7F3D0]">Docs</span>
                <span>/</span>
                <span className="text-[#FFD166]">API Reference</span>
              </nav>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFFDF7]">
                Technical Documentation &amp; API Reference
              </h1>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed max-w-3xl font-normal">
                Comprehensive technical specifications, Bayesian deployer scoring mathematics, public REST endpoints, rate quotas, and verified on-chain smart contract registries on Robinhood Chain.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#042F2E] border-2 border-[#042F2E] text-[#99F6E4] shadow-[2px_2px_0px_#042F2E]">
                  <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                  REST API v2.4
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  CHAIN 4663
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#A7F3D0] bg-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  MULTICALL3 BATCHING
                </span>
              </div>
            </header>

            <section id="introduction" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-5 scroll-mt-28">
              <div className="flex items-center justify-between border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  Introduction
                </h2>
                <span className="text-xs font-mono font-black text-[#99F6E4] bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">OVERVIEW</span>
              </div>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed font-normal">
                Scout Dossier.OS operates an on-chain surveillance and creator intelligence engine that indexes every transaction and smart contract deployment across Robinhood Chain. Our public and authenticated endpoints provide sub-second access to mathematical creator reputation profiles, macro ecosystem density census, real-time MultiCall3 aggregations, and immutable research case files.
              </p>

              <div className="border-l-4 border-l-[#99F6E4] bg-[#042F2E] rounded-r-2xl border-2 border-[#042F2E] p-5 space-y-2 shadow-[4px_4px_0px_#042F2E]">
                <div className="flex items-center gap-2 font-mono text-xs font-black text-[#99F6E4] uppercase tracking-wider">
                  <IconShield size={16} className="text-[#99F6E4]" />
                  <span>Public &amp; Authenticated Integration</span>
                </div>
                <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                  All public endpoints (`/api/deployer/:address`, `/api/census`, `/api/p/:slug`, `/api/dossier/:ca`) require no authentication and are rate-limited to 30 requests per minute per IP. Mutation and personal watchlist endpoints require Sign-In with Ethereum (SIWE) session cookies.
                </p>
              </div>
            </section>

            <section id="architecture" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-5 scroll-mt-28">
              <div className="flex items-center justify-between border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  Architecture &amp; On-Chain Indexing
                </h2>
                <span className="text-xs font-mono font-black text-[#FFD166] bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">INFRASTRUCTURE</span>
              </div>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed">
                Scout uses an autonomous 3-tier pipeline designed for high-concurrency Ethereum Layer-2 RPC feeds:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono font-black text-[#99F6E4] flex items-center gap-1.5">
                      <IconDatabase size={14} className="text-[#99F6E4]" />
                      <span>01 // MultiCall3</span>
                    </div>
                    <p className="text-xs text-[#A7F3D0] leading-relaxed">
                      Combines 10+ smart contract queries into a single atomic JSON-RPC request to Robinhood Chain Node.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono font-black text-[#FFD166] flex items-center gap-1.5">
                      <IconCpu size={14} className="text-[#FFD166]" />
                      <span>02 // Bayesian Pipeline</span>
                    </div>
                    <p className="text-xs text-[#A7F3D0] leading-relaxed">
                      Computes Laplace smoothed success distributions, DOA decay curves, and serial deployer clamps.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono font-black text-[#C084FC] flex items-center gap-1.5">
                      <IconCode size={14} className="text-[#C084FC]" />
                      <span>03 // Edge Serving</span>
                    </div>
                    <p className="text-xs text-[#A7F3D0] leading-relaxed">
                      Zero-latency responses cached with strict TTL headers for high-frequency algorithmic consumers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="formula" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-5 scroll-mt-28">
              <div className="flex items-center justify-between border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  Deployer Score Formula
                </h2>
                <span className="text-xs font-mono text-[#FFD166] font-black bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">MATHEMATICAL SPEC</span>
              </div>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed">
                Creator wallets are evaluated using deterministic Bayesian Laplace smoothing combined with non-linear penalties for dead-on-arrival (DOA) tokens, burst genesis velocity, and serial failure caps:
              </p>

              <div className="rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] p-4 sm:p-5 font-mono text-xs sm:text-sm text-[#99F6E4] shadow-[4px_4px_0px_#042F2E] space-y-3">
                <div className="flex items-center justify-between border-b border-[#064E4A] pb-2">
                  <span className="font-bold text-[#FFFDF7] font-sans text-xs">Algorithmic Formulation:</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Base Score:  B = ((graduated + 1) / (total + 2)) * 100\nPenalties:   P_doa = doa_rate * 25\n             P_burst = burst_rate * 15\nRaw Score:   S_raw = clamp(B - P_doa - P_burst, 0, 100)\nSerial Cap:  If (total >= 6 AND graduated == 0) -> S = min(S_raw, 25)`,
                        "formula-math"
                      )
                    }
                    className="flex items-center gap-1.5 text-xs text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#064E4A] border border-[#042F2E] px-2.5 py-1 rounded-xl shadow-[1.5px_1.5px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                  >
                    {copiedKey === "formula-math" ? <IconCheck size={14} className="text-[#99F6E4]" /> : <IconClipboard size={14} />}
                    <span>{copiedKey === "formula-math" ? "Copied" : "Copy Math"}</span>
                  </button>
                </div>
                <div className="overflow-x-auto whitespace-pre leading-relaxed text-[#FFFDF7] font-mono">
{`Base Score:  B = ((graduated + 1) / (total + 2)) * 100
Penalties:   P_doa = doa_rate * 25, P_burst = burst_rate * 15
Raw Score:   S_raw = clamp(B - P_doa - P_burst, 0, 100)
Serial Cap:  If (total >= 6 AND graduated == 0) -> S = min(S_raw, 25)`}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#99F6E4]">
                  Variables &amp; Operational Definitions:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#A7F3D0] list-disc list-inside">
                  <li><strong className="text-[#FFFDF7] font-mono">graduated:</strong> Tokens that successfully completed the Pons V2 bonding curve and migrated liquidity to Uniswap V3.</li>
                  <li><strong className="text-[#FFFDF7] font-mono">total:</strong> Total count of smart contract genesis launches triggered by the creator address.</li>
                  <li><strong className="text-[#FFFDF7] font-mono">doa_rate:</strong> Ratio of tokens with under 5 transactions or less than 0.1 ETH total trading volume within 24h.</li>
                  <li><strong className="text-[#FFFDF7] font-mono">burst_rate:</strong> Frequency of launching more than 3 contracts within a rolling 60-minute window.</li>
                </ul>
              </div>
            </section>

            <section id="scoring-bands" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-5 scroll-mt-28">
              <div className="flex items-center justify-between border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  Scoring Bands &amp; Severity Matrix
                </h2>
                <span className="text-xs font-mono font-black text-[#99F6E4] bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">THRESHOLDS</span>
              </div>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed">
                Calculated scores are segmented into 3 standardized risk bands indicating creator credibility and historical migration success:
              </p>

              <div className="overflow-x-auto border-2 border-[#042F2E] rounded-2xl shadow-[4px_4px_0px_#042F2E]">
                <table className="w-full text-xs sm:text-sm font-sans border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#042F2E] bg-[#042F2E] text-left text-[#A7F3D0] font-black uppercase text-[11px] font-mono">
                      <th className="p-3.5">Score Range</th>
                      <th className="p-3.5">Risk Band</th>
                      <th className="p-3.5">Classification</th>
                      <th className="p-3.5">System Behavior &amp; Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#042F2E] bg-[#064E4A]/80">
                    <tr className="hover:bg-[#042F2E]/60 transition-colors">
                      <td className="p-3.5 font-mono font-black text-[#99F6E4]">65 – 100</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E]">
                          GREEN
                        </span>
                      </td>
                      <td className="p-3.5 text-[#FFFDF7] font-bold">Reliable / Proven</td>
                      <td className="p-3.5 text-[#A7F3D0]">High graduation velocity; minimal DOA penalties; low burst frequency.</td>
                    </tr>
                    <tr className="hover:bg-[#042F2E]/60 transition-colors">
                      <td className="p-3.5 font-mono font-black text-[#FFD166]">35 – 64</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E]">
                          YELLOW
                        </span>
                      </td>
                      <td className="p-3.5 text-[#FFFDF7] font-bold">Moderate / Unproven</td>
                      <td className="p-3.5 text-[#A7F3D0]">Average launch track record, fresh deployer wallet, or intermediate success rate.</td>
                    </tr>
                    <tr className="hover:bg-[#042F2E]/60 transition-colors">
                      <td className="p-3.5 font-mono font-black text-[#FF6B6B]">0 – 34</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#FF6B6B] text-[#042F2E] border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E]">
                          RED
                        </span>
                      </td>
                      <td className="p-3.5 text-[#FF6B6B] font-bold">High Risk / Serial</td>
                      <td className="p-3.5 text-[#A7F3D0]">Serial launcher penalty applied, high DOA abandonment, or persistent zero graduation.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="endpoints" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-6 scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  REST API Reference
                </h2>
                <span className="text-xs font-mono text-[#99F6E4] font-black bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">6 PUBLIC &amp; AUTH ENDPOINTS</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {ENDPOINTS.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpointId(ep.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border-2 border-[#042F2E] active:translate-x-[1px] active:translate-y-[1px] ${
                      selectedEndpointId === ep.id
                        ? "bg-[#FFD166] text-[#042F2E] shadow-[3px_3px_0px_#042F2E]"
                        : "bg-[#042F2E] text-[#A7F3D0] hover:text-[#FFFDF7] shadow-[2px_2px_0px_#042F2E]"
                    }`}
                  >
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded border border-[#042F2E] ${
                        ep.method === "GET"
                          ? "bg-[#99F6E4] text-[#042F2E]"
                          : ep.method === "POST"
                          ? "bg-[#FFD166] text-[#042F2E]"
                          : "bg-[#FF6B6B] text-[#042F2E]"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span>{ep.path}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6 pt-2 bg-[#042F2E] rounded-2xl border-2 border-[#042F2E] p-5 shadow-[4px_4px_0px_#042F2E]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#064E4A] pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#99F6E4] text-[#042F2E] font-black font-mono text-xs rounded-lg border border-[#042F2E]">
                        {activeEndpoint.method}
                      </span>
                      <h3 className="text-lg sm:text-xl font-mono font-black text-[#FFFDF7]">
                        {activeEndpoint.path}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-[#FFD166]">
                      {activeEndpoint.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-xl bg-[#064E4A] border-2 border-[#042F2E] text-[#99F6E4] font-bold shadow-[2px_2px_0px_#042F2E]">
                      {activeEndpoint.rateLimit}
                    </span>
                    {activeEndpoint.authRequired ? (
                      <span className="px-2.5 py-1 rounded-xl bg-[#FF6B6B] text-[#042F2E] border-2 border-[#042F2E] font-black shadow-[2px_2px_0px_#042F2E]">
                        SIWE AUTH
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] font-black shadow-[2px_2px_0px_#042F2E]">
                        PUBLIC
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#A7F3D0] leading-relaxed">
                  {activeEndpoint.description}
                </p>

                {activeEndpoint.params.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#99F6E4]">
                      URL &amp; Query Parameters:
                    </h4>
                    <div className="overflow-x-auto border-2 border-[#042F2E] rounded-xl shadow-[3px_3px_0px_#042F2E]">
                      <table className="w-full text-xs font-mono border-collapse">
                        <thead>
                          <tr className="border-b-2 border-[#042F2E] bg-[#064E4A] text-left text-[#A7F3D0]">
                            <th className="p-2.5">Parameter</th>
                            <th className="p-2.5">Type</th>
                            <th className="p-2.5">Required</th>
                            <th className="p-2.5 font-sans">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#042F2E] bg-[#042F2E] text-[#FFFDF7]">
                          {activeEndpoint.params.map((p) => (
                            <tr key={p.name} className="hover:bg-[#064E4A]/50">
                              <td className="p-2.5 text-[#FFD166] font-black">{p.name}</td>
                              <td className="p-2.5 text-[#99F6E4]">{p.type}</td>
                              <td className="p-2.5">
                                {p.required ? (
                                  <span className="text-[#FF6B6B] font-black">YES</span>
                                ) : (
                                  <span className="text-[#A7F3D0]">NO</span>
                                )}
                              </td>
                              <td className="p-2.5 font-sans text-[#A7F3D0]">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#99F6E4]">
                      Code Request Example:
                    </h4>
                    <div className="flex items-center gap-1 bg-[#064E4A] p-1 rounded-xl text-xs font-mono border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                      {(["curl", "typescript", "python"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setActiveCodeLang(lang)}
                          className={`px-2.5 py-0.5 rounded-lg font-black transition-all cursor-pointer ${
                            activeCodeLang === lang
                              ? "bg-[#FFD166] text-[#042F2E] shadow-sm"
                              : "text-[#A7F3D0] hover:text-[#FFFDF7]"
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#031E1D] border-2 border-[#042F2E] p-4 font-mono text-xs text-[#99F6E4] relative group shadow-[4px_4px_0px_#042F2E]">
                    <button
                      onClick={() => handleCopy(activeEndpoint.exampleRequest[activeCodeLang], `code-${activeEndpoint.id}`)}
                      className="absolute right-3 top-3 px-3 py-1 rounded-xl bg-[#064E4A] hover:bg-[#064E4A]/80 text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      {copiedKey === `code-${activeEndpoint.id}` ? (
                        <IconCheck size={14} className="text-[#99F6E4]" />
                      ) : (
                        <IconClipboard size={14} />
                      )}
                      <span>{copiedKey === `code-${activeEndpoint.id}` ? "Copied" : "Copy Code"}</span>
                    </button>
                    <pre className="overflow-x-auto whitespace-pre text-[#FFFDF7] leading-relaxed pt-2">
                      {activeEndpoint.exampleRequest[activeCodeLang]}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#FFD166]">
                      Sample JSON Response:
                    </h4>
                    <button
                      onClick={() => handleCopy(activeEndpoint.sampleResponse, `resp-${activeEndpoint.id}`)}
                      className="text-xs font-mono font-bold text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1.5 cursor-pointer bg-[#064E4A] px-2.5 py-1 rounded-xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      {copiedKey === `resp-${activeEndpoint.id}` ? (
                        <IconCheck size={14} className="text-[#99F6E4]" />
                      ) : (
                        <IconClipboard size={14} />
                      )}
                      <span>{copiedKey === `resp-${activeEndpoint.id}` ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <div className="rounded-2xl bg-[#031E1D] border-2 border-[#042F2E] p-4 font-mono text-xs text-[#99F6E4] max-h-72 overflow-y-auto shadow-[4px_4px_0px_#042F2E]">
                    <pre className="overflow-x-auto whitespace-pre text-[#FFFDF7] leading-relaxed">
                      {activeEndpoint.sampleResponse}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section id="sandbox" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-5 scroll-mt-28">
              <div className="flex items-center justify-between border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  Interactive API Playground
                </h2>
                <span className="text-xs font-mono font-black text-[#FFD166] bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">LIVE CONSOLE</span>
              </div>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed">
                Test API schemas and inspect real-time payload returns directly in your browser:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-4 p-5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E]">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase font-black text-[#99F6E4]">Target Endpoint:</label>
                    <select
                      value={selectedEndpointId}
                      onChange={(e) => {
                        setSelectedEndpointId(e.target.value);
                        setSandboxResponse(null);
                      }}
                      aria-label="Select Target Endpoint"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] text-xs font-mono text-[#FFFDF7] focus:outline-none"
                    >
                      {ENDPOINTS.map((ep) => (
                        <option key={ep.id} value={ep.id}>
                          [{ep.method}] {ep.path}
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeEndpoint.params.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase font-black text-[#FFD166]">
                        Param: {activeEndpoint.params[0].name}
                      </label>
                      <input
                        type="text"
                        value={sandboxAddress}
                        onChange={(e) => setSandboxAddress(e.target.value)}
                        placeholder="Enter parameter input..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] text-xs font-mono text-[#FFFDF7] focus:outline-none"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleRunSandbox}
                    disabled={isSimulating}
                    className="w-full py-3 rounded-xl bg-[#FFD166] hover:bg-[#FFD166]/90 text-[#042F2E] font-black text-xs font-mono uppercase transition-all disabled:opacity-50 cursor-pointer border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    {isSimulating ? "Simulating Execution..." : "Execute Query Simulation"}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] flex flex-col justify-between space-y-3 font-mono text-xs min-h-[220px]">
                  <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 text-[11px]">
                    <span className="text-[#99F6E4] font-black">RESPONSE INSPECTOR</span>
                    <span className="text-[#A7F3D0] font-bold">{sandboxResponse ? "HTTP 200 OK" : "Awaiting Execution"}</span>
                  </div>

                  <div className="flex-1 max-h-52 overflow-y-auto">
                    {sandboxResponse ? (
                      <pre className="text-xs text-[#FFFDF7] leading-relaxed whitespace-pre font-mono">
                        {sandboxResponse}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A7F3D0]/60 space-y-2">
                        <IconCpu size={28} className="text-[#99F6E4]/40" />
                        <span className="text-xs font-bold">Click &quot;Execute Query Simulation&quot; to inspect response schema.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="contracts" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-5 scroll-mt-28">
              <div className="flex items-center justify-between border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  Verified Smart Contracts Registry
                </h2>
                <span className="text-xs font-mono text-[#FFD166] font-black bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">CHAIN 4663</span>
              </div>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed">
                Core protocol deployments on Robinhood Chain (4663). All contracts are byte-verified and accessible via public RPC:
              </p>

              <div className="overflow-x-auto border-2 border-[#042F2E] rounded-2xl shadow-[4px_4px_0px_#042F2E]">
                <table className="w-full text-xs sm:text-sm font-sans border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#042F2E] bg-[#042F2E] text-left text-[#A7F3D0] font-black uppercase text-[11px] font-mono">
                      <th className="p-3.5">Protocol Contract</th>
                      <th className="p-3.5">Contract Address</th>
                      <th className="p-3.5">Purpose &amp; Interface</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#042F2E] bg-[#064E4A]/80 font-mono">
                    <tr className="hover:bg-[#042F2E]/60 transition-colors">
                      <td className="p-3.5 font-black text-[#99F6E4]">MultiCall3</td>
                      <td className="p-3.5 text-[#FFFDF7] break-all">0xcA11bde05977b3631167028862bE2a173976CA11</td>
                      <td className="p-3.5 font-sans text-xs text-[#A7F3D0]">Batch aggregator for atomic multi-contract reads.</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleCopy("0xcA11bde05977b3631167028862bE2a173976CA11", "contract-multicall")}
                          className="px-2.5 py-1 rounded-xl bg-[#042F2E] hover:bg-[#042F2E]/80 text-[#A7F3D0] hover:text-[#FFFDF7] text-xs font-bold cursor-pointer inline-flex items-center gap-1 border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px]"
                        >
                          {copiedKey === "contract-multicall" ? <IconCheck size={12} className="text-[#99F6E4]" /> : <IconClipboard size={12} />}
                          <span>{copiedKey === "contract-multicall" ? "Copied" : "Copy"}</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#042F2E]/60 transition-colors">
                      <td className="p-3.5 font-black text-[#FFD166]">Pons V2 Factory</td>
                      <td className="p-3.5 text-[#FFFDF7] break-all">0x4663000000000000000000000000000000000001</td>
                      <td className="p-3.5 font-sans text-xs text-[#A7F3D0]">Orchestrates token genesis and curve lifecycle events.</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleCopy("0x4663000000000000000000000000000000000001", "contract-pons")}
                          className="px-2.5 py-1 rounded-xl bg-[#042F2E] hover:bg-[#042F2E]/80 text-[#A7F3D0] hover:text-[#FFFDF7] text-xs font-bold cursor-pointer inline-flex items-center gap-1 border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px]"
                        >
                          {copiedKey === "contract-pons" ? <IconCheck size={12} className="text-[#99F6E4]" /> : <IconClipboard size={12} />}
                          <span>{copiedKey === "contract-pons" ? "Copied" : "Copy"}</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#042F2E]/60 transition-colors">
                      <td className="p-3.5 font-black text-[#C084FC]">Uniswap V3 Migrator</td>
                      <td className="p-3.5 text-[#FFFDF7] break-all">0x4663000000000000000000000000000000000002</td>
                      <td className="p-3.5 font-sans text-xs text-[#A7F3D0]">Executes automated DEX pool seed migration for graduated tokens.</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleCopy("0x4663000000000000000000000000000000000002", "contract-migrator")}
                          className="px-2.5 py-1 rounded-xl bg-[#042F2E] hover:bg-[#042F2E]/80 text-[#A7F3D0] hover:text-[#FFFDF7] text-xs font-bold cursor-pointer inline-flex items-center gap-1 border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px]"
                        >
                          {copiedKey === "contract-migrator" ? <IconCheck size={12} className="text-[#99F6E4]" /> : <IconClipboard size={12} />}
                          <span>{copiedKey === "contract-migrator" ? "Copied" : "Copy"}</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="limits" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-5 scroll-mt-28">
              <div className="flex items-center justify-between border-b-2 border-[#042F2E] pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                  Rate Limits &amp; System Constraints
                </h2>
                <span className="text-xs font-mono font-black text-[#99F6E4] bg-[#042F2E] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">POLICIES</span>
              </div>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed">
                To guarantee high availability and protect RPC indexers from denial-of-service degradation, the following limits are enforced across endpoints:
              </p>

              <div className="overflow-x-auto border-2 border-[#042F2E] rounded-2xl shadow-[4px_4px_0px_#042F2E]">
                <table className="w-full text-xs sm:text-sm font-sans border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#042F2E] bg-[#042F2E] text-left text-[#A7F3D0] font-black uppercase text-[11px] font-mono">
                      <th className="p-3.5">Resource / Scope</th>
                      <th className="p-3.5">Policy Constraint</th>
                      <th className="p-3.5">HTTP Enforcement Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#042F2E] bg-[#064E4A]/80">
                    <tr className="hover:bg-[#042F2E]/60">
                      <td className="p-3.5 font-bold text-[#FFFDF7]">Public API Endpoints</td>
                      <td className="p-3.5 text-[#A7F3D0] font-mono font-bold">30 req / min / IP</td>
                      <td className="p-3.5 text-[#FF6B6B] font-mono font-black">HTTP 429 (Too Many Requests)</td>
                    </tr>
                    <tr className="hover:bg-[#042F2E]/60">
                      <td className="p-3.5 font-bold text-[#FFFDF7]">Watchlist Quota</td>
                      <td className="p-3.5 text-[#A7F3D0] font-mono font-bold">30 creator addresses max</td>
                      <td className="p-3.5 text-[#FF6B6B] font-mono font-black">HTTP 422 (Unprocessable Content)</td>
                    </tr>
                    <tr className="hover:bg-[#042F2E]/60">
                      <td className="p-3.5 font-bold text-[#FFFDF7]">Case File Thesis Length</td>
                      <td className="p-3.5 text-[#A7F3D0] font-mono font-bold">4,000 characters max</td>
                      <td className="p-3.5 text-[#FF6B6B] font-mono font-black">HTTP 400 (Zod Validation Error)</td>
                    </tr>
                    <tr className="hover:bg-[#042F2E]/60">
                      <td className="p-3.5 font-bold text-[#FFFDF7]">Dossier Snapshots Retention</td>
                      <td className="p-3.5 text-[#A7F3D0] font-mono font-bold">30 historical records</td>
                      <td className="p-3.5 text-[#99F6E4] font-mono font-black">Automated FIFO rotation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="disclaimer" className="space-y-3 scroll-mt-28">
              <div className="border-l-4 border-l-[#FF6B6B] bg-[#042F2E] rounded-r-2xl border-2 border-[#042F2E] p-6 space-y-2.5 shadow-[6px_6px_0px_#042F2E]">
                <div className="flex items-center gap-2 font-mono text-xs font-black text-[#FF6B6B] uppercase tracking-wider">
                  <IconAlert size={18} className="text-[#FF6B6B]" />
                  <h2 className="text-sm sm:text-base font-black uppercase text-[#FF6B6B] tracking-tight">
                    On-Chain Risk Disclaimer
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                  Scout Dossier.OS is an open-source decentralized intelligence surveillance framework. Reputation scores, metrics, and case files are computed strictly algorithmically from public blockchain bytecode, transaction histories, and event logs. Nothing on this website or in our API documentation constitutes financial, investment, or legal advice. On-chain trading, bonding curves, and early-stage token deployments carry inherent risks of total capital loss.
                </p>
              </div>
            </section>

            <footer className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <Link
                href="/how"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-2xl bg-[#064E4A] text-[#99F6E4] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <IconArrowLeft size={16} />
                <span>Previous: Research Field Manual</span>
              </Link>
              <Link
                href="/census"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-2xl bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <span>Next: Ecosystem Census</span>
                <IconArrowRight size={16} />
              </Link>
            </footer>
          </main>

          <aside
            aria-label="Table of Contents"
            className="hidden xl:block w-48 shrink-0 sticky top-28 self-start space-y-3 p-4 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] text-xs"
          >
            <div className="font-mono text-[11px] font-black uppercase tracking-wider text-[#99F6E4] pb-2 border-b border-[#042F2E]">
              On This Page
            </div>
            <ul className="space-y-2 font-medium font-mono text-[11px]">
              {TOC_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block transition-colors ${
                      activeSection === item.id
                        ? "text-[#FFD166] font-black"
                        : "text-[#A7F3D0] hover:text-[#FFFDF7]"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
