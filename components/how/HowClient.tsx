"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import {
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
  IconCheck,
  IconClipboard,
  IconGraph,
} from "@/components/icons/Vectors";

interface HowClientProps {
  isAuthenticated: boolean;
  userAddress?: string;
}

interface GlossaryItem {
  id: string;
  term: string;
  category: "math" | "lifecycle" | "heuristics" | "auth";
  categoryLabel: string;
  formula?: string;
  definition: string;
  implication: string;
  badge: string;
}

const GLOSSARY_DATA: GlossaryItem[] = [
  {
    id: "bonding-curve",
    term: "Bonding Curve",
    category: "lifecycle",
    categoryLabel: "Protocol Lifecycle",
    formula: "P(x) = k · x^γ (Pons V2 Standard)",
    definition:
      "An algorithmic smart contract mechanism that determines token price dynamically as tokens are purchased or sold along a deterministic mathematical curve prior to DEX graduation.",
    implication:
      "Guarantees continuous on-chain liquidity from genesis without requiring pre-funded Uniswap pools.",
    badge: "Pons V2",
  },
  {
    id: "graduated-phase",
    term: "Graduated Phase",
    category: "lifecycle",
    categoryLabel: "Protocol Lifecycle",
    formula: "Curve_Progress == 100% → Pool_Migrate()",
    definition:
      "The milestone reached when 100% of a token's bonding curve threshold is reached, migrating liquidity and unlocking automated Uniswap V3 liquidity pool creation.",
    implication:
      "Transitions the token from factory bonding curve to free secondary market trading.",
    badge: "DEX Migration",
  },
  {
    id: "swept-phase",
    term: "Swept Phase",
    category: "lifecycle",
    categoryLabel: "Protocol Lifecycle",
    formula: "Treasury_Sweep(fees, recipient_addr)",
    definition:
      "State where fee recipient or factory treasury has swept collected bonding curve protocol fees into designated recipient addresses.",
    implication:
      "Triggers automated fee routing verification in Scout Constellation engine.",
    badge: "Treasury",
  },
  {
    id: "laplace-smoothing",
    term: "Laplace Smoothing",
    category: "math",
    categoryLabel: "Mathematical Models",
    formula: "P_prior = (Graduated + 1) / (Total + 2)",
    definition:
      "Bayesian probability technique defined as (Graduated + 1) / (Total + 2), preventing artificial 100% perfection scores on small sample sizes (e.g. 1/1 launches).",
    implication:
      "Ensures deployers with 1 launch cannot outrank established creators with dozens of proven graduations.",
    badge: "Bayesian Prior",
  },
  {
    id: "doa",
    term: "Dead on Arrival (DOA)",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "Loss > 95% ∧ Δt ≤ 600s",
    definition:
      "A token launch whose trading volume halts or loses >95% value within 10 minutes of genesis. High DOA frequency heavily penalizes creator score.",
    implication:
      "Docks deployer score by 8 to 15 points per abandoned deployment.",
    badge: "Penalty Signal",
  },
  {
    id: "burst-rate",
    term: "Burst Rate",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "Burst% = N(Δt_deploy ≤ 1800s) / N_total",
    definition:
      "The proportion of genesis deployments initiated within 30 minutes of a previous token by the same deployer, signaling automated token spam or rapid-fire rug activity.",
    implication:
      "Flags automated deployment bots and multi-contract pump-and-dump syndicates.",
    badge: "Velocity Clamp",
  },
  {
    id: "serial-penalty-cap",
    term: "Serial Penalty Cap",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "If (N_total ≥ 6 ∧ N_grad == 0) → Score ≤ 25",
    definition:
      "A strict mathematical ceiling clamping deployer reputation to a maximum of 25 (Red Band) whenever total launches >= 6 and graduated count equals 0.",
    implication:
      "Guarantees that serial deployers with 0 successful graduations are quarantined in the hostile zone.",
    badge: "Hard Quarantine",
  },
  {
    id: "siwe",
    term: "Sign-In with Ethereum (SIWE)",
    category: "auth",
    categoryLabel: "Network & Auth",
    formula: "EIP-4361 / EIP-191 Personal_Sign",
    definition:
      "EIP-4361 standard cryptographic authentication proving private key ownership via an EIP-191 personal sign message, establishing encrypted stateless sessions without passwords.",
    implication:
      "Secures private watchlists, dossier bookmarks, and case file publishing authority.",
    badge: "EIP-4361",
  },
  {
    id: "multicall3",
    term: "MultiCall3 Aggregation",
    category: "auth",
    categoryLabel: "Network & Auth",
    formula: "MultiCall3.aggregate3(call_payloads[50])",
    definition:
      "Batching up to 50 smart contract read operations into a single RPC JSON-RPC payload to achieve sub-100ms dossier hydration while avoiding RPC rate limit throttling.",
    implication:
      "Drastically reduces HTTP overhead and provides atomic on-chain state inspection.",
    badge: "Sub-100ms RPC",
  },
  {
    id: "sybil-cluster-ratio",
    term: "Sybil Cluster Ratio",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "S_ratio = Wallets_routed / Unique_Recipients",
    definition:
      "Heuristic metric calculating the degree of fund consolidation between supposedly independent deployers sharing downstream liquidity addresses.",
    implication:
      "Reveals stealth dev operations operating across multiple burner addresses.",
    badge: "Graph Topology",
  },
  {
    id: "bonding-velocity",
    term: "Bonding Curve Velocity",
    category: "math",
    categoryLabel: "Mathematical Models",
    formula: "V_bc = d(Curve%) / dt",
    definition:
      "First derivative of bonding curve progress with respect to time, measuring buy pressure acceleration and graduation trajectory.",
    implication:
      "Helps distinguish organic accumulation surges from wash-trading spikes.",
    badge: "Derivative Rate",
  },
  {
    id: "immutability-proof",
    term: "Immutability Proof",
    category: "auth",
    categoryLabel: "Network & Auth",
    formula: "Hash(State_t || Author_Addr || Nonce)",
    definition:
      "Cryptographic digest generated when a researcher publishes a public dossier case file, locking the thesis, notes, and delta metrics permanently.",
    implication:
      "Guarantees that public case files cannot be tampered with or retroactively falsified.",
    badge: "Cryptographic Hash",
  },
];

const DELTA_METRICS = [
  {
    code: "DELTA-01",
    name: "FDV Fluctuation",
    category: "VOLATILITY",
    condition: "|FDV_t - FDV_0| / FDV_0 ≥ 20%",
    status: "ACTIVE TRIGGER",
    statusColor: "bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
    rationale: "Triggers when market capitalization shifts by ±20% or more since previous inspection.",
  },
  {
    code: "DELTA-02",
    name: "Liquidity Shift",
    category: "RESERVES",
    condition: "|Liq_t - Liq_0| / Liq_0 ≥ 20%",
    status: "ACTIVE TRIGGER",
    statusColor: "bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
    rationale: "Monitors pool drainage or sudden liquidity injection on DEX pairs.",
  },
  {
    code: "DELTA-03",
    name: "Phase Progression",
    category: "MILESTONE",
    condition: "Phase_t ≠ Phase_0 (Curve → Graduated)",
    status: "CRITICAL EVENT",
    statusColor: "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
    rationale: "Triggers instantly upon graduation migration or protocol fee sweep events.",
  },
  {
    code: "DELTA-04",
    name: "Fee Recipient Routing",
    category: "FORENSIC",
    condition: "Recipient_addr_t ≠ Recipient_addr_0",
    status: "SYBIL ALERT",
    statusColor: "bg-[#FF6B6B] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
    rationale: "Flags any modification in the recipient address receiving creator trading fees.",
  },
  {
    code: "DELTA-05",
    name: "GitHub Activity",
    category: "CODEBASE",
    condition: "Commit_SHA_t ≠ Commit_SHA_0",
    status: "REPO UPDATE",
    statusColor: "bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
    rationale: "Alerts researcher when fresh code is pushed to associated public repositories.",
  },
  {
    code: "DELTA-06",
    name: "Deployer Genesis",
    category: "CREATOR",
    condition: "Total_Deployments_t > Total_0",
    status: "NEW LAUNCH",
    statusColor: "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
    rationale: "Notifies when creator wallet deploys a subsequent token elsewhere in the factory.",
  },
];

export function HowClient({ isAuthenticated, userAddress }: HowClientProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<number>(0);

  const [simGraduated, setSimGraduated] = useState<number>(4);
  const [simTotal, setSimTotal] = useState<number>(10);
  const [simDoa, setSimDoa] = useState<number>(1);
  const [simBurst, setSimBurst] = useState<number>(20);

  const calculatedScore = useMemo(() => {
    if (simTotal >= 6 && simGraduated === 0) {
      return 25;
    }
    const laplace = (simGraduated + 1) / (simTotal + 2);
    const base = laplace * 100;
    const doaPenalty = simDoa * 8;
    const burstPenalty = (simBurst / 100) * 15;
    const score = Math.max(5, Math.min(100, Math.round(base - doaPenalty - burstPenalty)));
    return score;
  }, [simGraduated, simTotal, simDoa, simBurst]);

  const scoreBand = useMemo(() => {
    if (calculatedScore >= 70)
      return {
        label: "RELIABLE (GREEN)",
        color: "text-[#042F2E] bg-[#99F6E4] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
        desc: "Low risk. Organic graduation track record.",
      };
    if (calculatedScore >= 40)
      return {
        label: "CAUTION (YELLOW)",
        color: "text-[#042F2E] bg-[#FFD166] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
        desc: "Moderate risk. Unproven liquidity survival.",
      };
    return {
      label: "HOSTILE (RED)",
      color: "text-[#042F2E] bg-[#FF6B6B] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]",
      desc: "Severe risk. Serial abandonment detected.",
    };
  }, [calculatedScore]);

  const baseScoreVal = useMemo(() => {
    return Number((((simGraduated + 1) / (simTotal + 2)) * 100).toFixed(1));
  }, [simGraduated, simTotal]);

  const doaDeductionVal = useMemo(() => {
    return Math.min(simDoa * 8, 30);
  }, [simDoa]);

  const burstDeductionVal = useMemo(() => {
    return Math.min(Number(((simBurst / 100) * 15).toFixed(1)), 20);
  }, [simBurst]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query) ||
        (item.formula && item.formula.toLowerCase().includes(query)) ||
        item.categoryLabel.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-10 space-y-10 sm:space-y-14 relative z-10">
        <header className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#042F2E] relative space-y-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-black tracking-wider uppercase bg-[#042F2E] border-2 border-[#042F2E] text-[#99F6E4] shadow-[2px_2px_0px_#042F2E]">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              RESEARCH FIELD MANUAL // METHODOLOGY
            </span>
            <span className="px-3 py-1 rounded-xl text-[11px] font-mono font-black bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
              DOSSIER.OS v2.4
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFFDF7] leading-tight">
            Methodology &amp; Risk Architecture
          </h1>
          <p className="text-xs sm:text-base text-[#A7F3D0] leading-relaxed max-w-3xl font-normal">
            The mathematical foundation, Bayesian reputation models, on-chain delta triggers, and relational graph topology powering real-time token investigations.
          </p>

          <div className="pt-4 border-t-2 border-[#042F2E] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E]">
              <div className="text-[10px] text-[#A7F3D0] uppercase font-bold tracking-wider">Bayesian Core</div>
              <div className="text-xs sm:text-sm font-black text-[#99F6E4] mt-1">Laplace (α=1, β=2)</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E]">
              <div className="text-[10px] text-[#A7F3D0] uppercase font-bold tracking-wider">Surveillance</div>
              <div className="text-xs sm:text-sm font-black text-[#FFD166] mt-1">6 Delta Triggers</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E]">
              <div className="text-[10px] text-[#A7F3D0] uppercase font-bold tracking-wider">Topology</div>
              <div className="text-xs sm:text-sm font-black text-[#FF9F43] mt-1">3 Edge Weights</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E]">
              <div className="text-[10px] text-[#A7F3D0] uppercase font-bold tracking-wider">RPC Speed</div>
              <div className="text-xs sm:text-sm font-black text-[#C084FC] mt-1">MultiCall3 &lt;85ms</div>
            </div>
          </div>
        </header>

        <section id="workflow" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                PROTOCOL PIPELINE // 4 STAGES
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                The 4-Step Intelligence Workflow
              </h2>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#042F2E] p-1.5 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E]">
              {["01. Investigate", "02. Score", "03. Track", "04. Publish"].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => setActiveWorkflowTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeWorkflowTab === idx
                      ? "bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                      : "text-[#A7F3D0] hover:text-[#FFFDF7]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-5 sm:p-6 rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] transition-all ${activeWorkflowTab === 0 ? "ring-2 ring-[#99F6E4]" : "opacity-90"}`}>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] flex items-center justify-center text-xs font-mono font-black text-[#99F6E4] shadow-[2px_2px_0px_#042F2E] shrink-0">
                  01
                </span>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
                      01. Investigate // Bytecode &amp; Liquidity Audit
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                      MULTICALL3 BATCH
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                    When a token contract is inspected, Scout concurrently batches factory state, token metadata, liquidity balances, and pricing pairs in a sub-100ms atomic call.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] font-mono text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#A7F3D0]">
                    <div>
                      <span className="text-[10px] text-[#99F6E4] font-bold">Factory.getPool()</span>
                      <div className="text-[#FFFDF7] font-black truncate text-sm mt-0.5">0x90a2...b41</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#FFD166] font-bold">totalSupply()</span>
                      <div className="text-[#FFFDF7] font-black text-sm mt-0.5">1,000,000,000</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#99F6E4] font-bold">getReserves()</span>
                      <div className="text-[#FFFDF7] font-black text-sm mt-0.5">42.5 ETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-5 sm:p-6 rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] transition-all ${activeWorkflowTab === 1 ? "ring-2 ring-[#FFD166]" : "opacity-90"}`}>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] flex items-center justify-center text-xs font-mono font-black text-[#FFD166] shadow-[2px_2px_0px_#042F2E] shrink-0">
                  02
                </span>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
                      02. Score // Bayesian Probability Model
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                      LAPLACE PRIOR
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                    Deployer origin wallets are scored between 0–100 using Laplace-smoothed graduation rates, DOA penalties, burst rate dampeners, and hard serial penalty clamps.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] font-mono text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#A7F3D0]">
                    <div>
                      <span className="text-[10px] text-[#FFD166] font-bold">Laplace Formula</span>
                      <div className="text-[#FFFDF7] font-black truncate text-sm mt-0.5">((k+1)/(n+2))×100</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#FF6B6B] font-bold">DOA Penalty</span>
                      <div className="text-[#FF6B6B] font-black text-sm mt-0.5">-8 pts/event</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#FF6B6B] font-bold">Serial Clamp</span>
                      <div className="text-[#FFFDF7] font-black text-sm mt-0.5">Max 25 (n≥6, k=0)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-5 sm:p-6 rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] transition-all ${activeWorkflowTab === 2 ? "ring-2 ring-[#FF9F43]" : "opacity-90"}`}>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] flex items-center justify-center text-xs font-mono font-black text-[#FF9F43] shadow-[2px_2px_0px_#042F2E] shrink-0">
                  03
                </span>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
                      03. Track // State Delta Comparison
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#FF9F43] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                      SINCE LAST CHECK
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                    Every inspection records a snapshot. When revisited, Scout computes metric differences across FDV, liquidity, phase shifts, git commits, and fee recipients.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] font-mono text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#A7F3D0]">
                    <div className="flex items-center justify-between bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[11px] font-bold">Market Cap Δ:</span>
                      <span className="font-black text-[#99F6E4]">+28.4% Exceeded</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[11px] font-bold">Curve Phase:</span>
                      <span className="font-black text-[#FFD166]">Graduated UniV3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-5 sm:p-6 rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] transition-all ${activeWorkflowTab === 3 ? "ring-2 ring-[#C084FC]" : "opacity-90"}`}>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] flex items-center justify-center text-xs font-mono font-black text-[#C084FC] shadow-[2px_2px_0px_#042F2E] shrink-0">
                  04
                </span>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#FFFDF7] tracking-tight">
                      04. Publish // Immutable Forensic Dossier
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#C084FC] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                      EIP-191 SIGNATURE
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                    Freeze research thesis and findings into permanent case files with cryptographic author attribution, fork capability, and instant revocation controls.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] font-mono text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#A7F3D0]">
                    <div>
                      <span className="text-[10px] text-[#C084FC] font-bold">Digest Hash</span>
                      <div className="text-[#FFFDF7] font-black truncate text-sm mt-0.5">0x7f2a...c89e</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#99F6E4] font-bold">Author Proof</span>
                      <div className="text-[#FFFDF7] font-black text-sm mt-0.5">EIP-191 Sign</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#FFD166] font-bold">State Access</span>
                      <div className="text-[#FFFDF7] font-black text-sm mt-0.5">Immutable</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="bayesian-math" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-5 sm:p-8 shadow-[6px_6px_0px_#042F2E] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#042F2E] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD166] font-bold">
                SECTION 02 // MATHEMATICAL WORKBENCH
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Bayesian Mathematical Formulation &amp; Sandbox
              </h2>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#042F2E] border-2 border-[#042F2E] text-xs font-mono font-black text-[#FFD166] shadow-[2px_2px_0px_#042F2E] self-start sm:self-auto">
              SPEC v2.4
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 bg-[#042F2E] rounded-2xl border-2 border-[#042F2E] p-4 sm:p-5 shadow-[4px_4px_0px_#042F2E] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#064E4A] pb-2">
                  <span className="text-xs font-mono font-black text-[#99F6E4] uppercase tracking-wider">
                    MATHEMATICAL POSTULATES
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#A7F3D0] bg-[#064E4A] px-2 py-0.5 rounded-md">4 FORMULATIONS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-xl p-3 shadow-[3px_3px_0px_#042F2E] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FFD166] font-black uppercase">1.1 // BASE LAPLACE</span>
                      <button
                        onClick={() => handleCopy("S_base = ((k + 1) / (n + 2)) * 100", "p1")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p1" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#FFD166]">((k + 1) / (n + 2)) × 100</div>
                    <p className="font-sans text-[11px] text-[#A7F3D0]">k = Graduated, n = Total launches</p>
                  </div>

                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-xl p-3 shadow-[3px_3px_0px_#042F2E] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FF6B6B] font-black uppercase">1.2 // DOA DEDUCTION</span>
                      <button
                        onClick={() => handleCopy("P_doa = min(8 * d, 30)", "p2")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p2" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#FF6B6B]">min(8 × d, 30)</div>
                    <p className="font-sans text-[11px] text-[#A7F3D0]">-8 pts per abandoned token (&lt;10m)</p>
                  </div>

                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-xl p-3 shadow-[3px_3px_0px_#042F2E] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FF9F43] font-black uppercase">1.3 // BURST DAMPENER</span>
                      <button
                        onClick={() => handleCopy("P_burst = min((b / 100) * 15, 20)", "p3")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p3" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#FF9F43]">min((b/100) × 15, 20)</div>
                    <p className="font-sans text-[11px] text-[#A7F3D0]">Dampens &lt;30m automated launches</p>
                  </div>

                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-xl p-3 shadow-[3px_3px_0px_#042F2E] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#C084FC] font-black uppercase">1.4 // SERIAL CLAMP</span>
                      <button
                        onClick={() => handleCopy("If (n >= 6 && k == 0) -> S_final <= 25", "p4")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p4" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#C084FC]">If n≥6 ∧ k=0 → ≤25</div>
                    <p className="font-sans text-[11px] text-[#A7F3D0]">Hard Red Band quarantine ceiling</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] text-xs font-mono text-[#FFFDF7] flex flex-wrap items-center justify-between gap-1">
                <span className="text-[#99F6E4] font-black">MASTER FORMULA:</span>
                <span className="text-[#FFD166] font-black">S = clamp(S_base - P_doa - P_burst, 0, 100)</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#042F2E] rounded-2xl border-2 border-[#042F2E] p-4 sm:p-5 shadow-[4px_4px_0px_#042F2E] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#064E4A] pb-2">
                  <span className="text-xs font-mono font-black text-[#FFD166] uppercase">SIMULATOR INSTRUMENT</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black ${scoreBand.color}`}>
                    {scoreBand.label}
                  </span>
                </div>

                <div className="text-center py-3 sm:py-4 bg-[#064E4A] rounded-2xl border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E]">
                  <div className="text-3xl sm:text-5xl font-black text-[#FFFDF7] tracking-tight">{calculatedScore}</div>
                  <div className="text-[10px] font-mono text-[#A7F3D0] mt-0.5 font-bold">CALCULATED SCORE / 100</div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1 text-[11px]">
                      <span>Launches (n):</span>
                      <span className="font-black text-[#FFFDF7]">{simTotal}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={simTotal}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSimTotal(val);
                        if (simGraduated > val) setSimGraduated(val);
                      }}
                      className="w-full accent-[#FFD166] h-2 bg-[#064E4A] rounded-lg cursor-pointer border border-[#042F2E]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1 text-[11px]">
                      <span>Grads (k):</span>
                      <span className="font-black text-[#99F6E4]">{simGraduated}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={simTotal}
                      value={simGraduated}
                      onChange={(e) => setSimGraduated(Number(e.target.value))}
                      className="w-full accent-[#99F6E4] h-2 bg-[#064E4A] rounded-lg cursor-pointer border border-[#042F2E]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1 text-[11px]">
                      <span>DOA (d):</span>
                      <span className="font-black text-[#FF6B6B]">{simDoa}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={simDoa}
                      onChange={(e) => setSimDoa(Number(e.target.value))}
                      className="w-full accent-[#FF6B6B] h-2 bg-[#064E4A] rounded-lg cursor-pointer border border-[#042F2E]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1 text-[11px]">
                      <span>Burst (b):</span>
                      <span className="font-black text-[#FF9F43]">{simBurst}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={simBurst}
                      onChange={(e) => setSimBurst(Number(e.target.value))}
                      className="w-full accent-[#FF9F43] h-2 bg-[#064E4A] rounded-lg cursor-pointer border border-[#042F2E]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#064E4A] text-xs font-mono text-[#A7F3D0] flex items-center justify-between">
                <span>Base: <strong className="text-[#FFD166]">{baseScoreVal}</strong></span>
                <span>DOA: <strong className="text-[#FF6B6B]">-{doaDeductionVal}</strong></span>
                <span>Burst: <strong className="text-[#FF9F43]">-{burstDeductionVal}</strong></span>
              </div>
            </div>
          </div>
        </section>

        <section id="delta-engine" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 03 // REAL-TIME SURVEILLANCE
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Since Last Check Delta Methodology
              </h2>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#042F2E] border-2 border-[#042F2E] text-xs font-mono font-black text-[#99F6E4] shadow-[2px_2px_0px_#042F2E] self-start sm:self-auto">
              30 SNAPSHOT BUFFER
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DELTA_METRICS.map((item) => (
              <div
                key={item.code}
                className="p-4 sm:p-5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#042F2E] text-[#FFD166] border border-[#042F2E]">
                      {item.code}
                    </span>
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-[#FFFDF7]">{item.name}</div>
                  <p className="text-xs text-[#A7F3D0] leading-snug font-normal">{item.rationale}</p>
                </div>
                <div className="pt-2.5 border-t border-[#042F2E] text-xs font-mono text-[#99F6E4] truncate bg-[#042F2E] p-2 rounded-xl border border-[#042F2E]">
                  {item.condition}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="graph-topology" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 04 // SYBIL DETECTION ENGINE
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Constellation Graph Relational Logic
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFD166] self-start sm:self-auto bg-[#042F2E] px-3 py-1 rounded-xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
              <IconGraph size={14} />
              <span>3-TIER SCHEMATIC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] inline-block">
                  TIER 1 // 1.00 WEIGHT
                </span>
                <div className="text-sm sm:text-base font-black text-[#FFFDF7]">01. Deployer Origin Link</div>
                <p className="text-xs text-[#A7F3D0] leading-snug font-normal">
                  Connects all tokens deployed by the exact same Ethereum origin wallet.
                </p>
              </div>
              <div className="text-xs font-mono text-[#99F6E4] font-black pt-2 border-t border-[#042F2E] bg-[#042F2E] p-2 rounded-xl">
                E_origin(T_i, T_j) = 1.00
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] inline-block">
                  TIER 2 // 0.85 WEIGHT
                </span>
                <div className="text-sm sm:text-base font-black text-[#FFFDF7]">02. Shared Fee Sink</div>
                <p className="text-xs text-[#A7F3D0] leading-snug font-normal">
                  Detects Sybil rings routing creator trading fees to a common destination sink.
                </p>
              </div>
              <div className="text-xs font-mono text-[#FFD166] font-black pt-2 border-t border-[#042F2E] bg-[#042F2E] p-2 rounded-xl">
                E_fee(D_a, D_b) = 0.85
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#C084FC] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] inline-block">
                  TIER 3 // 0.70 WEIGHT
                </span>
                <div className="text-sm sm:text-base font-black text-[#FFFDF7]">03. Upstream Dev Funder</div>
                <p className="text-xs text-[#A7F3D0] leading-snug font-normal">
                  Traces burner deployers funded by common upstream CEX deposit addresses.
                </p>
              </div>
              <div className="text-xs font-mono text-[#C084FC] font-black pt-2 border-t border-[#042F2E] bg-[#042F2E] p-2 rounded-xl">
                E_funder(W_1, W_2) = 0.70
              </div>
            </div>
          </div>
        </section>

        <section id="glossary-math" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 05 // RESEARCH LEXICON
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                On-Chain Glossary &amp; Taxonomy
              </h2>
            </div>
            <div className="text-xs font-mono font-black text-[#A7F3D0] bg-[#042F2E] px-3 py-1 rounded-xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
              {filteredGlossary.length} OF {GLOSSARY_DATA.length} TERMS
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <IconSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99F6E4]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terms, formulas, or keywords..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] text-xs text-[#FFFDF7] placeholder-[#A7F3D0]/60 focus:outline-none focus:shadow-[6px_6px_0px_#042F2E]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: "all", label: "All" },
                { id: "math", label: "Math Models" },
                { id: "lifecycle", label: "Lifecycle" },
                { id: "heuristics", label: "Heuristics" },
                { id: "auth", label: "Network/Auth" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-mono whitespace-nowrap transition-all cursor-pointer border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] ${
                    selectedCategory === cat.id
                      ? "bg-[#FFD166] text-[#042F2E]"
                      : "bg-[#064E4A] text-[#A7F3D0] hover:text-[#FFFDF7]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredGlossary.map((item) => (
              <div
                key={item.term}
                className="p-4 sm:p-5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#042F2E] text-[#99F6E4] border border-[#042F2E]">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#A7F3D0] uppercase truncate">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#FFFDF7] tracking-tight">
                    {item.term}
                  </h3>

                  {item.formula && (
                    <div className="p-2 rounded-xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-between text-xs font-mono text-[#FFD166]">
                      <span className="truncate">{item.formula}</span>
                      <button
                        onClick={() => handleCopy(item.formula!, item.id)}
                        className="p-1 hover:text-[#FFFDF7] text-[#99F6E4] transition-colors cursor-pointer shrink-0 ml-1 bg-[#064E4A] rounded-md border border-[#042F2E]"
                        title="Copy formula"
                      >
                        {copiedKey === item.id ? <IconCheck size={12} /> : <IconClipboard size={12} />}
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                    {item.definition}
                  </p>
                </div>

                <div className="text-xs text-[#99F6E4] font-mono flex items-center gap-1.5 pt-2 border-t border-[#042F2E]">
                  <span className="font-black text-[#FFD166]">IMPLICATION:</span>
                  <span className="text-[#A7F3D0] truncate">{item.implication}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <Link
            href="/docs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-2xl bg-[#064E4A] text-[#99F6E4] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <IconArrowLeft size={16} />
            <span>Read Developer Documentation</span>
          </Link>

          <Link
            href="/census"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-2xl bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <span>Explore Ecosystem Census</span>
            <IconArrowRight size={16} />
          </Link>
        </footer>
      </main>
    </div>
  );
}
