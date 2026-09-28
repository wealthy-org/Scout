"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCpu,
  IconCheck,
  IconClipboard,
  IconAlert,
} from "@/components/icons/Vectors";

interface DocsClientProps {
  isAuthenticated: boolean;
  userAddress?: string;
}

interface EndpointDoc {
  id: string;
  method: "GET" | "POST";
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
        description: "Contract address of the token to inspect on Robinhood Chain.",
      },
    ],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/dossier/0x3b890918b8b0e8c740a3e0b57e7939bf83457102" \\
  -H "Accept: application/json"`,
      typescript: `async function inspectTokenDossier(ca: string) {
  const res = await fetch(\`https://scout-five-xi.vercel.app/api/dossier/\${ca}\`);
  return await res.json();
}`,
      python: `import requests

resp = requests.get("https://scout-five-xi.vercel.app/api/dossier/0x3b890918b8b0e8c740a3e0b57e7939bf83457102")
dossier = resp.json()`,
    },
    sampleResponse: `{
  "contractAddress": "0x3b890918b8b0e8c740a3e0b57e7939bf83457102",
  "symbol": "SCOUT",
  "name": "Scout Intelligence",
  "deployer": "0x89e247413697b0d911b3327d78fa1b94541889b2",
  "phase": "Graduated",
  "curveProgress": 100.0,
  "marketCap": 2450000,
  "liquidity": 185000,
  "holderCount": 412,
  "topWalletsConcentration": 0.224,
  "isSwept": true
}`,
  },
  {
    id: "search-query",
    method: "GET",
    path: "/api/search?q=:query",
    title: "Global Intelligence Search",
    description:
      "Instantly resolves token contract addresses, ticker symbols, project names, and creator Ethereum addresses with sub-20ms latency.",
    authRequired: false,
    rateLimit: "60 req / min / IP",
    params: [
      {
        name: "q",
        type: "string",
        required: true,
        description: "Search keyword, token symbol, name, or 0x address prefix.",
      },
    ],
    exampleRequest: {
      curl: `curl -X GET "https://scout-five-xi.vercel.app/api/search?q=SCOUT" \\
  -H "Accept: application/json"`,
      typescript: `async function searchEntities(query: string) {
  const res = await fetch(\`https://scout-five-xi.vercel.app/api/search?q=\${encodeURIComponent(query)}\`);
  return await res.json();
}`,
      python: `import requests

resp = requests.get("https://scout-five-xi.vercel.app/api/search", params={"q": "SCOUT"})
results = resp.json()`,
    },
    sampleResponse: `{
  "query": "SCOUT",
  "results": [
    {
      "type": "token",
      "address": "0x3b890918b8b0e8c740a3e0b57e7939bf83457102",
      "symbol": "SCOUT",
      "name": "Scout Intelligence",
      "score": 84
    }
  ]
}`,
  },
  {
    id: "watchlist-manage",
    method: "POST",
    path: "/api/watchlist",
    title: "Manage Tracked Watchlist (SIWE Required)",
    description:
      "Adds or removes monitored creator addresses for the authenticated wallet. Subject to maximum quota of 30 addresses.",
    authRequired: true,
    rateLimit: "30 req / min / IP",
    params: [
      {
        name: "targetAddress",
        type: "string (0x...)",
        required: true,
        description: "Target Ethereum creator address to track or un-track.",
      },
      {
        name: "action",
        type: "'add' | 'remove'",
        required: true,
        description: "Watchlist modification operation.",
      },
    ],
    exampleRequest: {
      curl: `curl -X POST "https://scout-five-xi.vercel.app/api/watchlist" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: scout_session=ey..." \\
  -d '{"targetAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2", "action": "add"}'`,
      typescript: `async function toggleWatchlist(targetAddress: string, action: "add" | "remove") {
  const res = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetAddress, action })
  });
  return await res.json();
}`,
      python: `import requests

session_cookie = "scout_session=ey..."
resp = requests.post(
    "https://scout-five-xi.vercel.app/api/watchlist",
    headers={"Cookie": session_cookie},
    json={"targetAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2", "action": "add"}
)`,
    },
    sampleResponse: `{
  "success": true,
  "action": "add",
  "targetAddress": "0x89e247413697b0d911b3327d78fa1b94541889b2",
  "totalTracked": 4,
  "quotaRemaining": 26
}`,
  },
  {
    id: "publish-case-file",
    method: "POST",
    path: "/api/p",
    title: "Publish Case File Snapshot (SIWE Required)",
    description:
      "Freezes and permanently publishes an immutable investigation case file with cryptographic signature proof and creator attribution.",
    authRequired: true,
    rateLimit: "10 req / min / IP",
    params: [
      {
        name: "tokenAddress",
        type: "string (0x...)",
        required: true,
        description: "Target token address inspected in the case file.",
      },
      {
        name: "thesis",
        type: "string (max 4000 chars)",
        required: true,
        description: "Investigative thesis and findings summary.",
      },
      {
        name: "title",
        type: "string (max 100 chars)",
        required: true,
        description: "Title of the published case file.",
      },
    ],
    exampleRequest: {
      curl: `curl -X POST "https://scout-five-xi.vercel.app/api/p" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: scout_session=ey..." \\
  -d '{"tokenAddress": "0x3b890918b8b0e8c740a3e0b57e7939bf83457102", "title": "Audit #1", "thesis": "Clean deployer profile"}'`,
      typescript: `async function publishCaseFile(payload: { tokenAddress: string; title: string; thesis: string }) {
  const res = await fetch("/api/p", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
}`,
      python: `import requests

resp = requests.post(
    "https://scout-five-xi.vercel.app/api/p",
    headers={"Cookie": "scout_session=ey..."},
    json={"tokenAddress": "0x3b890918b8b0e8c740a3e0b57e7939bf83457102", "title": "Audit #1", "thesis": "Clean profile"}
)`,
    },
    sampleResponse: `{
  "success": true,
  "slug": "scout-protocol-dossier-4b82f1",
  "url": "https://scout-five-xi.vercel.app/p/scout-protocol-dossier-4b82f1",
  "digestHash": "0x7f2a8901bce4710283910293847102938471029384710293847102938471c89e"
}`,
  },
  {
    id: "auth-siwe",
    method: "POST",
    path: "/api/auth/verify",
    title: "EIP-4361 Sign-In with Ethereum",
    description:
      "Verifies an EIP-191 personal sign signature against an active session nonce, issuing an encrypted stateless HTTP-only session cookie.",
    authRequired: false,
    rateLimit: "15 req / min / IP",
    params: [
      {
        name: "message",
        type: "string",
        required: true,
        description: "Formatted EIP-4361 SIWE message string.",
      },
      {
        name: "signature",
        type: "string (0x...)",
        required: true,
        description: "65-byte cryptographic signature generated by user wallet.",
      },
    ],
    exampleRequest: {
      curl: `curl -X POST "https://scout-five-xi.vercel.app/api/auth/verify" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "scout.wealthypeople.org wants you to sign in...", "signature": "0x..."}'`,
      typescript: `async function verifySiwe(message: string, signature: string) {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature })
  });
  return await res.json();
}`,
      python: `import requests

resp = requests.post(
    "https://scout-five-xi.vercel.app/api/auth/verify",
    json={"message": "...", "signature": "0x..."}
)`,
    },
    sampleResponse: `{
  "authenticated": true,
  "address": "0x89e247413697b0d911b3327d78fa1b94541889b2",
  "chainId": 4663,
  "expiresAt": "2026-09-29T16:00:00.000Z"
}`,
  },
];

export function DocsClient({ isAuthenticated, userAddress }: DocsClientProps) {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("deployer-profile");
  const [activeCodeLang, setActiveCodeLang] = useState<"curl" | "typescript" | "python">("curl");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [sandboxAddress, setSandboxAddress] = useState<string>("0x89e247413697b0d911b3327d78fa1b94541889b2");
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeEndpoint = useMemo(() => {
    return ENDPOINTS.find((ep) => ep.id === selectedEndpointId) || ENDPOINTS[0];
  }, [selectedEndpointId]);

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
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-12 sm:space-y-16 relative z-10">
        <header className="border-b border-[rgba(153,246,228,0.2)] pb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#064E4A] border border-[rgba(153,246,228,0.3)] text-[#99F6E4]">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              DEVELOPER &amp; RESEARCHER SPECIFICATION // ROBINHOOD 4663
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#042F2E] text-[#FFD166] border border-[#FFD166]/30">
              REST &amp; ON-CHAIN RPC API v2.4
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#FFFDF7]">
            Technical Documentation &amp; API Reference
          </h1>
          <p className="text-sm sm:text-base text-[#A7F3D0] mt-3 leading-relaxed max-w-3xl font-normal">
            Mathematical scoring algorithms, public endpoints, rate limits, data schemas, and integration guidelines.
          </p>

          <nav aria-label="Docs Navigation" className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-[rgba(153,246,228,0.15)]">
            <a
              href="#formula"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              01 // Score Formula
            </a>
            <a
              href="#endpoints"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#FFD166] hover:text-[#FFFDF7] transition-all"
            >
              02 // Public API Reference
            </a>
            <a
              href="#sandbox"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              03 // Live Sandbox
            </a>
            <a
              href="#contracts"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              04 // Smart Contracts
            </a>
            <a
              href="#limits"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#FF6B6B] hover:text-[#FFFDF7] transition-all"
            >
              05 // Rate Limits &amp; Risk
            </a>
          </nav>
        </header>

        <section id="formula" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 01 // MATHEMATICAL ALGORITHMS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Deployer Score Formula
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#042F2E] border border-[#FFD166]/40 text-xs font-mono font-bold text-[#FFD166]">
              MATHEMATICAL SPEC
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            Deployer reputation scores are deterministically calculated based on historical launch performance on Robinhood Chain:
          </p>

          <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] font-mono text-xs text-[#99F6E4] space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-2">
              <span className="font-bold text-[#FFFDF7] font-sans text-sm">Score Formula Definition:</span>
              <button
                onClick={() =>
                  handleCopy(
                    `Base Score:  B = ((graduated + 1) / (total + 2)) * 100\nPenalties:   P_doa = doa_rate * 25\n             P_burst = burst_rate * 15\nRaw Score:   S_raw = clamp(B - P_doa - P_burst, 0, 100)\nSerial Cap:  If (total >= 6 AND graduated == 0) -> S = min(S_raw, 25)`,
                    "formula"
                  )
                }
                className="flex items-center gap-1 text-[11px] text-[#A7F3D0] hover:text-[#FFFDF7]"
              >
                {copiedKey === "formula" ? <IconCheck size={14} className="text-[#99F6E4]" /> : <IconClipboard size={14} />}
                <span>{copiedKey === "formula" ? "Copied" : "Copy Math"}</span>
              </button>
            </div>
            <div className="overflow-x-auto whitespace-pre leading-relaxed text-[#FFFDF7]">
              {`Base Score:  B = ((graduated + 1) / (total + 2)) * 100
Penalties:   P_doa = doa_rate * 25
             P_burst = burst_rate * 15
Raw Score:   S_raw = clamp(B - P_doa - P_burst, 0, 100)
Serial Cap:  If (total >= 6 AND graduated == 0) -> S = min(S_raw, 25)`}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-[rgba(153,246,228,0.2)] bg-[#042F2E] text-left text-[#A7F3D0] font-semibold uppercase">
                  <th className="p-3">Score Range</th>
                  <th className="p-3">Band</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(153,246,228,0.15)]">
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">65 – 100</td>
                  <td className="p-3 text-[#99F6E4] font-bold">GREEN</td>
                  <td className="p-3 text-[#FFFDF7]">Fresh / Repeat</td>
                  <td className="p-3 text-[#A7F3D0]">High graduation velocity; minimal DOA/burst penalties.</td>
                </tr>
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">35 – 64</td>
                  <td className="p-3 text-[#FFD166] font-bold">YELLOW</td>
                  <td className="p-3 text-[#FFFDF7]">Fresh / Repeat</td>
                  <td className="p-3 text-[#A7F3D0]">Average launch track record or unproven new deployer.</td>
                </tr>
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">0 – 34</td>
                  <td className="p-3 text-[#FF6B6B] font-bold">RED</td>
                  <td className="p-3 text-[#FFFDF7]">Serial / Repeat</td>
                  <td className="p-3 text-[#A7F3D0]">Serial launcher penalty or high frequency of rapid abandonments.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="endpoints" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 02 // REST INTERFACES
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Public API Reference
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#042F2E] border border-[#FFD166]/40 text-xs font-mono font-bold text-[#FFD166]">
              REST / JSON
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ENDPOINTS.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setSelectedEndpointId(ep.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedEndpointId === ep.id
                    ? "bg-[#FFD166] text-[#042F2E] shadow-sm"
                    : "bg-[#042F2E] text-[#A7F3D0] hover:text-[#FFFDF7] border border-[rgba(153,246,228,0.2)]"
                }`}
              >
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${ep.method === "GET" ? "bg-[#14B8A6]/30 text-[#99F6E4]" : "bg-[#FF9F43]/30 text-[#FFD166]"}`}>
                  {ep.method}
                </span>
                <span>{ep.path.split("?")[0]}</span>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.15)] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-[#99F6E4] text-[#042F2E] border-[1.5px] border-[#042F2E] font-bold text-xs rounded-md shadow-[2px_2px_0px_#042F2E]">
                    {activeEndpoint.method}
                  </span>
                  <span className="text-base font-black font-mono text-[#FFFDF7]">{activeEndpoint.path}</span>
                </div>
                <div className="text-sm font-bold text-[#FFD166]">{activeEndpoint.title}</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#064E4A] text-[#99F6E4] border border-[rgba(153,246,228,0.2)]">
                  {activeEndpoint.rateLimit}
                </span>
                {activeEndpoint.authRequired && (
                  <span className="px-2 py-0.5 rounded bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/40 font-bold">
                    SIWE AUTH
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
              {activeEndpoint.description}
            </p>

            {activeEndpoint.params.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#99F6E4]">Parameters:</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-[rgba(153,246,228,0.2)] bg-[#064E4A] text-left text-[#A7F3D0]">
                        <th className="p-2.5">Field</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Required</th>
                        <th className="p-2.5 font-sans">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(153,246,228,0.15)] text-[#FFFDF7]">
                      {activeEndpoint.params.map((p) => (
                        <tr key={p.name} className="hover:bg-[#064E4A]/50">
                          <td className="p-2.5 text-[#FFD166] font-bold">{p.name}</td>
                          <td className="p-2.5 text-[#99F6E4]">{p.type}</td>
                          <td className="p-2.5">{p.required ? <span className="text-[#FF6B6B] font-bold">YES</span> : <span className="text-[#A7F3D0]">NO</span>}</td>
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
                <div className="text-xs font-bold uppercase tracking-wider text-[#99F6E4]">Request Example:</div>
                <div className="flex items-center gap-1 bg-[#064E4A] p-1 rounded-xl border border-[rgba(153,246,228,0.2)] text-[11px] font-mono">
                  {(["curl", "typescript", "python"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveCodeLang(lang)}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                        activeCodeLang === lang ? "bg-[#FFD166] text-[#042F2E]" : "text-[#A7F3D0] hover:text-[#FFFDF7]"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.2)] font-mono text-xs text-[#99F6E4] relative group">
                <button
                  onClick={() => handleCopy(activeEndpoint.exampleRequest[activeCodeLang], `code-${activeEndpoint.id}`)}
                  className="absolute right-3 top-3 p-1.5 rounded-lg bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === `code-${activeEndpoint.id}` ? <IconCheck size={14} className="text-[#99F6E4]" /> : <IconClipboard size={14} />}
                  <span>{copiedKey === `code-${activeEndpoint.id}` ? "Copied" : "Copy"}</span>
                </button>
                <pre className="overflow-x-auto whitespace-pre text-[#FFFDF7] leading-relaxed">
                  {activeEndpoint.exampleRequest[activeCodeLang]}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FFD166]">Sample JSON Response:</div>
                <button
                  onClick={() => handleCopy(activeEndpoint.sampleResponse, `resp-${activeEndpoint.id}`)}
                  className="text-[11px] font-mono text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1"
                >
                  {copiedKey === `resp-${activeEndpoint.id}` ? <IconCheck size={14} className="text-[#99F6E4]" /> : <IconClipboard size={14} />}
                  <span>Copy Payload</span>
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.2)] font-mono text-xs text-[#99F6E4] max-h-72 overflow-y-auto">
                <pre className="overflow-x-auto whitespace-pre text-[#FFFDF7] leading-relaxed">
                  {activeEndpoint.sampleResponse}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="sandbox" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 03 // LIVE REST PLAYGROUND
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Interactive API Playground
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A7F3D0]">SIMULATED SANDBOX // 4663</span>
          </div>

          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            Test and inspect Scout REST endpoints directly in your browser with real-time response parsing:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-[#99F6E4]">Select Target Endpoint:</label>
                <select
                  value={selectedEndpointId}
                  onChange={(e) => {
                    setSelectedEndpointId(e.target.value);
                    setSandboxResponse(null);
                  }}
                  aria-label="Select Target Endpoint"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-xs font-mono text-[#FFFDF7] focus:outline-none focus:border-[#FFD166]"
                >
                  {ENDPOINTS.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      [{ep.method}] {ep.path}
                    </option>
                  ))}
                </select>
              </div>

              {activeEndpoint.params.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase font-bold text-[#FFD166]">
                    Parameter: {activeEndpoint.params[0].name}
                  </label>
                  <input
                    type="text"
                    value={sandboxAddress}
                    onChange={(e) => setSandboxAddress(e.target.value)}
                    placeholder="Enter input address or value..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-xs font-mono text-[#FFFDF7] focus:outline-none focus:border-[#FFD166]"
                  />
                </div>
              )}

              <button
                onClick={handleRunSandbox}
                disabled={isSimulating}
                className="w-full py-3 rounded-2xl bg-[#FFD166] hover:bg-[#FFD166]/90 text-[#042F2E] font-black text-xs font-mono tracking-wider uppercase transition-all shadow-[0_4px_14px_rgba(255,209,102,0.4)] disabled:opacity-50"
              >
                {isSimulating ? "Loading Preview..." : "Preview Sample Response"}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] flex flex-col justify-between space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-2 text-[11px]">
                <span className="text-[#99F6E4] font-bold">RESPONSE INSPECTOR</span>
                <span className="text-[#A7F3D0]">{sandboxResponse ? "SAMPLE PAYLOAD" : "Awaiting Preview"}</span>
              </div>

              <div className="flex-1 max-h-56 overflow-y-auto">
                {sandboxResponse ? (
                  <pre className="text-xs text-[#FFFDF7] leading-relaxed whitespace-pre">
                    {sandboxResponse}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A7F3D0]/60 space-y-2">
                    <IconCpu size={24} className="text-[#99F6E4]/40" />
                    <span>Click &quot;Preview Sample Response&quot; to inspect formatted sample JSON payload.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="contracts" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 04 // ON-CHAIN SMART CONTRACT REGISTRY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Robinhood Chain (4663) Deployments
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#FFD166]">VERIFIED RPC</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[#99F6E4] text-[11px] font-bold">
                <span>MULTICALL3 BATCHER</span>
                <span>AGGREGATE3</span>
              </div>
              <div className="text-[11px] text-[#FFFDF7] break-all font-bold">
                0xcA11bde05977b3631167028862bE2a173976CA11
              </div>
              <p className="text-[11px] font-sans text-[#A7F3D0]">
                Canonical multicall batch aggregator for low-latency atomic reads.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[#FFD166] text-[11px] font-bold">
                <span>PONS V2 FACTORY</span>
                <span>BONDING CURVES</span>
              </div>
              <div className="text-[11px] text-[#FFFDF7] break-all font-bold">
                0x4663000000000000000000000000000000000001
              </div>
              <p className="text-[11px] font-sans text-[#A7F3D0]">
                Factory smart contract orchestrating token genesis and curve progression.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[#C084FC] text-[11px] font-bold">
                <span>UNISWAP V3 MIGRATOR</span>
                <span>GRADUATION POOL</span>
              </div>
              <div className="text-[11px] text-[#FFFDF7] break-all font-bold">
                0x4663000000000000000000000000000000000002
              </div>
              <p className="text-[11px] font-sans text-[#A7F3D0]">
                Automated DEX liquidity migration pool for graduated tokens.
              </p>
            </div>
          </div>
        </section>

        <section id="limits" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">
              Section 03 // Rate Limits &amp; System Constraints
            </h2>
            <span className="text-xs font-mono text-[#A7F3D0]">ENFORCEMENT POLICIES</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-[rgba(153,246,228,0.2)] bg-[#042F2E] text-left text-[#A7F3D0] font-semibold uppercase">
                  <th className="p-3">Resource / Action</th>
                  <th className="p-3">Constraint Limit</th>
                  <th className="p-3">Enforcement Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(153,246,228,0.15)]">
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">Public API Endpoints</td>
                  <td className="p-3 text-[#A7F3D0]">30 requests / minute / IP</td>
                  <td className="p-3 text-[#FF6B6B]">HTTP 429 Too Many Requests (Retry-After)</td>
                </tr>
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">User Watchlist Quota</td>
                  <td className="p-3 text-[#A7F3D0]">30 deployer addresses max</td>
                  <td className="p-3 text-[#FF6B6B]">HTTP 422 Unprocessable Entity</td>
                </tr>
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">Dossier Items Limit</td>
                  <td className="p-3 text-[#A7F3D0]">50 items max per section</td>
                  <td className="p-3 text-[#FF6B6B]">Payload schema validation rejection</td>
                </tr>
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">Research Thesis Length</td>
                  <td className="p-3 text-[#A7F3D0]">4,000 characters max</td>
                  <td className="p-3 text-[#FF6B6B]">Zod schema string truncation / rejection</td>
                </tr>
                <tr className="hover:bg-[#042F2E]/40">
                  <td className="p-3 font-bold text-[#FFFDF7]">Historical Snapshots</td>
                  <td className="p-3 text-[#A7F3D0]">30 snapshots retention limit</td>
                  <td className="p-3 text-[#99F6E4]">Automated FIFO rotation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-[#FF6B6B]/40 bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-4">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex items-center justify-between">
            <h2 className="text-base font-bold uppercase text-[#FF6B6B] tracking-tight">
              Section 04 // On-Chain Risk Disclaimer
            </h2>
            <IconAlert size={18} className="text-[#FF6B6B]" />
          </div>

          <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
            Scout Dossier.OS is an open on-chain intelligence surveillance tool. Scores, metrics, and case files are computed algorithmically from public blockchain bytecode and RPC events. Nothing on this platform constitutes financial, investment, or legal advice. On-chain trading, bonding curves, and decentralized tokens carry extreme risks of total capital loss. Always perform independent verification before interacting with smart contracts.
          </p>
        </section>

        <footer className="border-t border-[rgba(153,246,228,0.2)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <Link href="/how" className="inline-flex items-center gap-2 font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:underline">
            <IconArrowLeft size={14} />
            <span>Explore Methodology &amp; Glossary</span>
          </Link>
          <Link href="/census" className="inline-flex items-center gap-2 font-bold text-[#FFD166] hover:text-[#FFFDF7] hover:underline">
            <span>Explore Ecosystem Census</span>
            <IconArrowRight size={14} />
          </Link>
        </footer>
      </main>
    </div>
  );
}
