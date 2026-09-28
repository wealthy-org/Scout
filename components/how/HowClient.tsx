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
    statusColor: "bg-[#99F6E4]/20 text-[#99F6E4] border-[#99F6E4]/40",
    rationale: "Triggers when market capitalization shifts by ±20% or more since previous inspection.",
  },
  {
    code: "DELTA-02",
    name: "Liquidity Shift",
    category: "RESERVES",
    condition: "|Liq_t - Liq_0| / Liq_0 ≥ 20%",
    status: "ACTIVE TRIGGER",
    statusColor: "bg-[#99F6E4]/20 text-[#99F6E4] border-[#99F6E4]/40",
    rationale: "Monitors pool drainage or sudden liquidity injection on DEX pairs.",
  },
  {
    code: "DELTA-03",
    name: "Phase Progression",
    category: "MILESTONE",
    condition: "Phase_t ≠ Phase_0 (Curve → Graduated UniV3)",
    status: "CRITICAL EVENT",
    statusColor: "bg-[#FFD166]/20 text-[#FFD166] border-[#FFD166]/40",
    rationale: "Triggers instantly upon graduation migration or protocol fee sweep events.",
  },
  {
    code: "DELTA-04",
    name: "Fee Recipient Routing",
    category: "FORENSIC",
    condition: "Recipient_addr_t ≠ Recipient_addr_0",
    status: "SYBIL ALERT",
    statusColor: "bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/40",
    rationale: "Flags any modification in the recipient address receiving creator trading fees.",
  },
  {
    code: "DELTA-05",
    name: "GitHub Activity",
    category: "CODEBASE",
    condition: "Commit_SHA_t ≠ Commit_SHA_0",
    status: "REPO UPDATE",
    statusColor: "bg-[#99F6E4]/20 text-[#99F6E4] border-[#99F6E4]/40",
    rationale: "Alerts researcher when fresh code is pushed to associated public repositories.",
  },
  {
    code: "DELTA-06",
    name: "Deployer Genesis",
    category: "CREATOR",
    condition: "Total_Deployments_t > Total_0",
    status: "NEW LAUNCH",
    statusColor: "bg-[#FFD166]/20 text-[#FFD166] border-[#FFD166]/40",
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
        label: "RELIABLE (GREEN BAND)",
        color: "text-[#99F6E4] bg-[#14B8A6]/20 border-[#99F6E4]/40",
        desc: "Low-risk creator with proven organic graduation track record.",
      };
    if (calculatedScore >= 40)
      return {
        label: "CAUTION (YELLOW BAND)",
        color: "text-[#FFD166] bg-[#FFD166]/20 border-[#FFD166]/40",
        desc: "Moderate risk. High launch frequency with unproven liquidity survival.",
      };
    return {
      label: "HOSTILE (RED BAND)",
      color: "text-[#FF6B6B] bg-[#FF6B6B]/20 border-[#FF6B6B]/40",
      desc: "Severe risk. Serial abandonment or automated burst-launch bot detected.",
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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-20 sm:pb-28 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[850px] h-[550px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-r from-[#FFD166]/10 via-[#14B8A6]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-16 sm:space-y-24 relative z-10">
        <header className="border-b border-[rgba(153,246,228,0.25)] pb-10 sm:pb-12 relative">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#042F2E] border border-[rgba(153,246,228,0.35)] text-[#99F6E4] shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse" />
              RESEARCH FIELD MANUAL // METHODOLOGY &amp; HEURISTICS
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#FFD166] text-[#042F2E] border border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
              BAYESIAN DOSSIER.OS v2.4
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#FFFDF7] leading-[1.1]">
            Methodology &amp; Risk Architecture
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#A7F3D0] mt-4 leading-relaxed max-w-3xl font-normal">
            The mathematical foundation, Bayesian reputation models, on-chain delta triggers, and relational graph topology powering real-time token investigations.
          </p>

          <div className="mt-8 pt-6 border-t border-[rgba(153,246,228,0.15)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-6 text-[#A7F3D0]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#99F6E4]" />
                <span className="text-[#FFFDF7] font-bold">Bayesian Core:</span>
                <span>Laplace (α=1, β=2)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFD166]" />
                <span className="text-[#FFFDF7] font-bold">Surveillance:</span>
                <span>6 Delta Triggers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF9F43]" />
                <span className="text-[#FFFDF7] font-bold">Topology:</span>
                <span>3 Edge Weights</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
                <span className="text-[#FFFDF7] font-bold">Speed:</span>
                <span>MultiCall3 &lt;85ms</span>
              </div>
            </div>
            <div className="text-[11px] px-3 py-1 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-[#99F6E4]">
              ROBINHOOD CHAIN // 4663
            </div>
          </div>
        </header>

        <section id="workflow" className="space-y-8">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                PROTOCOL PIPELINE // 4 STAGES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight mt-1">
                The 4-Step Intelligence Workflow
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-[#042F2E] p-1.5 rounded-2xl border border-[rgba(153,246,228,0.2)]">
              {["01. Investigate", "02. Score", "03. Track", "04. Publish"].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => setActiveWorkflowTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeWorkflowTab === idx
                      ? "bg-[#FFD166] text-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                      : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#064E4A]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative space-y-12 sm:space-y-16">
            <div className="absolute left-4 sm:left-5 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#99F6E4] via-[#FFD166] via-[#FF9F43] to-[#C084FC] pointer-events-none" />

            <div className={`relative pl-12 sm:pl-16 transition-all duration-300 ${activeWorkflowTab === 0 ? "opacity-100" : "opacity-85 hover:opacity-100"}`}>
              <span className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#042F2E] border-2 border-[#99F6E4] flex items-center justify-center text-xs font-mono font-black text-[#99F6E4] shadow-[0_0_14px_rgba(153,246,228,0.6)] z-10">
                01
              </span>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                    01. Investigate // Bytecode &amp; Liquidity Audit
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#042F2E] text-[#99F6E4] border border-[#99F6E4]/30">
                    MULTICALL3 ATOMIC READ
                  </span>
                </div>

                <p className="text-sm text-[#A7F3D0] leading-relaxed max-w-4xl font-normal">
                  When a token contract address is inspected, Scout concurrently batches factory state, token metadata, liquidity balances, and DexScreener pricing pairs into a single atomic payload without rate limits.
                </p>

                <div className="p-4 rounded-2xl bg-[#042F2E]/90 border border-[rgba(153,246,228,0.2)] font-mono text-xs space-y-2 max-w-3xl">
                  <div className="flex items-center justify-between text-[#99F6E4] text-[10px] pb-1.5 border-b border-[rgba(153,246,228,0.15)] font-bold">
                    <span>MULTICALL3 BATCH RUNNER // RPC TELEMETRY</span>
                    <span className="text-[#A7F3D0]">4663 RPC</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1 text-[#A7F3D0]">
                    <div>
                      <span className="text-[#99F6E4]">Factory.getPool(ca)</span>
                      <div className="text-[#FFFDF7] font-bold">0x90a2...b41</div>
                    </div>
                    <div>
                      <span className="text-[#FFD166]">ERC20.totalSupply()</span>
                      <div className="text-[#FFFDF7] font-bold">1,000,000,000</div>
                    </div>
                    <div>
                      <span className="text-[#99F6E4]">PonsV2.getReserves()</span>
                      <div className="text-[#FFFDF7] font-bold">42.5 ETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative pl-12 sm:pl-16 transition-all duration-300 ${activeWorkflowTab === 1 ? "opacity-100" : "opacity-85 hover:opacity-100"}`}>
              <span className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#042F2E] border-2 border-[#FFD166] flex items-center justify-center text-xs font-mono font-black text-[#FFD166] shadow-[0_0_14px_rgba(255,209,102,0.6)] z-10">
                02
              </span>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                    02. Score // Bayesian Probability Formulation
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#042F2E] text-[#FFD166] border border-[#FFD166]/30">
                    LAPLACE PRIOR &amp; PENALTIES
                  </span>
                </div>

                <p className="text-sm text-[#A7F3D0] leading-relaxed max-w-4xl font-normal">
                  Deployer origin wallets are scored between 0–100 using Laplace-smoothed graduation rates, DOA penalties, burst rate dampeners, and hard serial penalty clamps.
                </p>

                <div className="p-4 rounded-2xl bg-[#042F2E]/90 border border-[rgba(153,246,228,0.2)] font-mono text-xs space-y-2 max-w-3xl">
                  <div className="flex items-center justify-between text-[#FFD166] text-[10px] pb-1.5 border-b border-[rgba(153,246,228,0.15)] font-bold">
                    <span>BAYESIAN WEIGHT MATRIX</span>
                    <span className="text-[#A7F3D0]">ALPHA=1, BETA=2</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1 text-[#A7F3D0]">
                    <div>
                      <span className="text-[#FFD166]">Base Laplace Formula</span>
                      <div className="text-[#FFFDF7] font-bold">((k + 1)/(n + 2)) × 100</div>
                    </div>
                    <div>
                      <span className="text-[#FF6B6B]">DOA Deduction</span>
                      <div className="text-[#FFFDF7] font-bold">-8 pts / incident</div>
                    </div>
                    <div>
                      <span className="text-[#FF6B6B]">Serial Rugger Clamp</span>
                      <div className="text-[#FFFDF7] font-bold">Max 25 (if n≥6 ∧ k=0)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative pl-12 sm:pl-16 transition-all duration-300 ${activeWorkflowTab === 2 ? "opacity-100" : "opacity-85 hover:opacity-100"}`}>
              <span className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#042F2E] border-2 border-[#FF9F43] flex items-center justify-center text-xs font-mono font-black text-[#FF9F43] shadow-[0_0_14px_rgba(255,159,67,0.6)] z-10">
                03
              </span>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                    03. Track // State Delta Comparison
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#042F2E] text-[#FF9F43] border border-[#FF9F43]/30">
                    SINCE LAST CHECK ENGINE
                  </span>
                </div>

                <p className="text-sm text-[#A7F3D0] leading-relaxed max-w-4xl font-normal">
                  Every inspection records a snapshot. When revisited, Scout computes granular metric differences (FDV jumps, liquidity shifts, git commits, fee recipient modifications).
                </p>

                <div className="p-4 rounded-2xl bg-[#042F2E]/90 border border-[rgba(153,246,228,0.2)] font-mono text-xs space-y-2 max-w-3xl">
                  <div className="flex items-center justify-between text-[#FF9F43] text-[10px] pb-1.5 border-b border-[rgba(153,246,228,0.15)] font-bold">
                    <span>SNAPSHOT DELTA COMPARATOR</span>
                    <span className="text-[#A7F3D0]">Δt = 4h 12m</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1 text-[#A7F3D0]">
                    <div className="flex items-center justify-between bg-[#064E4A] p-2 rounded-xl">
                      <span>Market Cap Delta:</span>
                      <span className="font-bold text-[#99F6E4]">+28.4% (Threshold Exceeded)</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#064E4A] p-2 rounded-xl">
                      <span>Curve Phase:</span>
                      <span className="font-bold text-[#FFD166]">Graduated UniV3 Pool</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative pl-12 sm:pl-16 transition-all duration-300 ${activeWorkflowTab === 3 ? "opacity-100" : "opacity-85 hover:opacity-100"}`}>
              <span className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#042F2E] border-2 border-[#C084FC] flex items-center justify-center text-xs font-mono font-black text-[#C084FC] shadow-[0_0_14px_rgba(192,132,252,0.6)] z-10">
                04
              </span>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                    04. Publish // Immutable Forensic Dossier
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#042F2E] text-[#C084FC] border border-[#C084FC]/30">
                    EIP-191 CRYPTOGRAPHIC HASH
                  </span>
                </div>

                <p className="text-sm text-[#A7F3D0] leading-relaxed max-w-4xl font-normal">
                  Researchers can freeze their thesis and findings into permanent shareable case files with creator attribution, fork capability, and instant revocation controls.
                </p>

                <div className="p-4 rounded-2xl bg-[#042F2E]/90 border border-[rgba(153,246,228,0.2)] font-mono text-xs space-y-2 max-w-3xl">
                  <div className="flex items-center justify-between text-[#C084FC] text-[10px] pb-1.5 border-b border-[rgba(153,246,228,0.15)] font-bold">
                    <span>CRYPTOGRAPHIC SNAPSHOT PROOF</span>
                    <span className="text-[#A7F3D0]">IMMUTABLE STATE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1 text-[#A7F3D0]">
                    <div>
                      <span className="text-[#C084FC]">Digest Hash</span>
                      <div className="text-[#FFFDF7] font-bold truncate">0x7f2a...c89e</div>
                    </div>
                    <div>
                      <span className="text-[#99F6E4]">Author Proof</span>
                      <div className="text-[#FFFDF7] font-bold">EIP-191 Personal Sign</div>
                    </div>
                    <div>
                      <span className="text-[#FFD166]">State Access</span>
                      <div className="text-[#FFFDF7] font-bold">Read-Only / Forkable</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="bayesian-math" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-10 shadow-[0_20px_50px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD166] font-bold">
                SECTION 02 // MATHEMATICAL WORKBENCH
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight mt-1">
                Bayesian Mathematical Formulation &amp; Sandbox
              </h2>
            </div>
            <div className="px-3.5 py-1 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.3)] text-xs font-mono text-[#FFD166]">
              BAYESIAN REPUTATION SPEC v2.4
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-[#042F2E] rounded-2xl border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-3">
                  <span className="text-xs font-mono font-bold text-[#99F6E4] uppercase tracking-wider">
                    MATHEMATICAL SPECIFICATION CANVAS
                  </span>
                  <span className="text-[10px] font-mono text-[#A7F3D0]">4 CORE POSTULATES</span>
                </div>

                <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                  Scout replaces raw percentage graduation rates with a <strong>Laplace-Smoothed Bayesian Prior</strong> bounded by 3 forensic deduction factors:
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-[#064E4A]/80 border border-[rgba(153,246,228,0.2)] rounded-xl p-3.5 space-y-1.5 hover:border-[#FFD166]/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FFD166] font-bold uppercase">POSTULATE 1.1 // BASE LAPLACE PRIOR</span>
                      <button
                        onClick={() => handleCopy("S_base = ((k + 1) / (n + 2)) * 100", "p1")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "p1" ? <IconCheck size={12} className="text-[#99F6E4]" /> : <IconClipboard size={12} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-bold text-[#FFD166]">S_base = ((k + 1) / (n + 2)) × 100</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-normal">
                      Where <strong>k</strong> is graduation count and <strong>n</strong> is total lifetime genesis launches.
                    </p>
                  </div>

                  <div className="bg-[#064E4A]/80 border border-[rgba(153,246,228,0.2)] rounded-xl p-3.5 space-y-1.5 hover:border-[#FF6B6B]/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FF6B6B] font-bold uppercase">POSTULATE 1.2 // DEAD ON ARRIVAL (DOA) DEDUCTION</span>
                      <button
                        onClick={() => handleCopy("P_doa = min(8 * d, 30)", "p2")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "p2" ? <IconCheck size={12} className="text-[#99F6E4]" /> : <IconClipboard size={12} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-bold text-[#FF6B6B]">P_doa = min(8 × d, 30)</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-normal">
                      Docks 8 points per abandoned token whose trading volume halts or loses &gt;95% within 10 minutes of genesis.
                    </p>
                  </div>

                  <div className="bg-[#064E4A]/80 border border-[rgba(153,246,228,0.2)] rounded-xl p-3.5 space-y-1.5 hover:border-[#FF9F43]/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FF9F43] font-bold uppercase">POSTULATE 1.3 // BURST VELOCITY DAMPENER</span>
                      <button
                        onClick={() => handleCopy("P_burst = min((b / 100) * 15, 20)", "p3")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "p3" ? <IconCheck size={12} className="text-[#99F6E4]" /> : <IconClipboard size={12} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-bold text-[#FF9F43]">P_burst = min((b / 100) × 15, 20)</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-normal">
                      Penalizes automated deployment bots launching multiple tokens within 30 minutes.
                    </p>
                  </div>

                  <div className="bg-[#064E4A]/80 border border-[rgba(153,246,228,0.2)] rounded-xl p-3.5 space-y-1.5 hover:border-[#C084FC]/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#C084FC] font-bold uppercase">POSTULATE 1.4 // SERIAL RUGGER QUARANTINE CLAMP</span>
                      <button
                        onClick={() => handleCopy("If (n >= 6 && k == 0) -> S_final <= 25", "p4")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "p4" ? <IconCheck size={12} className="text-[#99F6E4]" /> : <IconClipboard size={12} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-bold text-[#C084FC]">If (n ≥ 6 ∧ k == 0) → S_final ≤ 25</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-normal">
                      Hard mathematical ceiling clamping score to maximum 25 whenever total launches ≥ 6 and graduations equal 0.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031E1D] border border-[#FFD166]/30 text-xs font-mono text-[#FFFDF7] flex items-center justify-between">
                <span className="text-[#99F6E4] font-bold">MASTER FORMULA:</span>
                <span className="text-[#FFD166] font-bold">S_final = clamp(S_base - P_doa - P_burst, 0, 100)</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#042F2E] rounded-2xl border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-5 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-3">
                  <span className="text-xs font-mono font-bold text-[#FFD166] uppercase">FORENSIC SIMULATOR INSTRUMENT</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${scoreBand.color}`}>
                    {scoreBand.label}
                  </span>
                </div>

                <div className="text-center py-5 bg-[#064E4A] rounded-2xl border border-[rgba(153,246,228,0.2)]">
                  <div className="text-5xl sm:text-6xl font-black text-[#FFFDF7] tracking-tight">{calculatedScore}</div>
                  <div className="text-[11px] font-mono text-[#A7F3D0] mt-1">CALCULATED REPUTATION SCORE / 100</div>
                  <p className="text-xs text-[#99F6E4] mt-2 px-4 font-medium">{scoreBand.desc}</p>
                </div>

                <div className="space-y-3.5 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1">
                      <span>Total Launches (n):</span>
                      <span className="font-bold text-[#FFFDF7]">{simTotal}</span>
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
                      className="w-full accent-[#FFD166] h-2 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1">
                      <span>Graduated Count (k):</span>
                      <span className="font-bold text-[#99F6E4]">{simGraduated}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={simTotal}
                      value={simGraduated}
                      onChange={(e) => setSimGraduated(Number(e.target.value))}
                      className="w-full accent-[#99F6E4] h-2 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1">
                      <span>DOA Incidents (d):</span>
                      <span className="font-bold text-[#FF6B6B]">{simDoa}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={simDoa}
                      onChange={(e) => setSimDoa(Number(e.target.value))}
                      className="w-full accent-[#FF6B6B] h-2 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1">
                      <span>Burst Velocity Ratio (b):</span>
                      <span className="font-bold text-[#FF9F43]">{simBurst}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={simBurst}
                      onChange={(e) => setSimBurst(Number(e.target.value))}
                      className="w-full accent-[#FF9F43] h-2 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(153,246,228,0.15)] text-[10px] font-mono text-[#A7F3D0] space-y-1">
                <div className="flex items-center justify-between">
                  <span>Base Score (S_base):</span>
                  <span className="text-[#FFD166] font-bold">{baseScoreVal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>DOA Penalty (-P_doa):</span>
                  <span className="text-[#FF6B6B] font-bold">-{doaDeductionVal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Burst Penalty (-P_burst):</span>
                  <span className="text-[#FF9F43] font-bold">-{burstDeductionVal}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="delta-engine" className="space-y-6 border-t border-[rgba(153,246,228,0.2)] pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 03 // REAL-TIME SURVEILLANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight mt-1">
                Since Last Check Delta Methodology
              </h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-xs font-mono text-[#99F6E4]">
              30 SNAPSHOT RETENTION BUFFER
            </div>
          </div>

          <p className="text-sm text-[#A7F3D0] leading-relaxed font-normal">
            Scout maintains up to 30 historical snapshots per token. When you revisit a case file, the comparison engine calculates deltas against 6 continuous telemetry streams:
          </p>

          <div className="overflow-x-auto border-t border-b border-[rgba(153,246,228,0.2)]">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#042F2E] text-left text-[#A7F3D0] border-b border-[rgba(153,246,228,0.2)]">
                  <th className="p-3.5">Metric Code</th>
                  <th className="p-3.5">Trigger Condition</th>
                  <th className="p-3.5 font-sans">Forensic Rationale</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(153,246,228,0.15)] text-[#FFFDF7]">
                {DELTA_METRICS.map((item) => (
                  <tr key={item.code} className="hover:bg-[#042F2E]/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-[#FFD166]">{item.code}</div>
                      <div className="text-[11px] text-[#99F6E4]">{item.name}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-1 rounded bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-[#99F6E4]">
                        {item.condition}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans text-[#A7F3D0] max-w-md">{item.rationale}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="graph-topology" className="space-y-6 border-t border-[rgba(153,246,228,0.2)] pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 04 // SYBIL DETECTION ENGINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight mt-1">
                Constellation Graph Relational Logic
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFD166]">
              <IconGraph size={16} />
              <span>3-TIER RELATIONAL SCHEMATIC</span>
            </div>
          </div>

          <p className="text-sm text-[#A7F3D0] leading-relaxed font-normal">
            The Constellation Engine maps multi-token clusters by evaluating cryptographic lineage across 3 distinct edge weight classes:
          </p>

          <div className="border-t border-b border-[rgba(153,246,228,0.2)] divide-y divide-[rgba(153,246,228,0.15)] font-mono text-xs">
            <div className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 md:max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#042F2E] text-[#99F6E4] border border-[#99F6E4]/30">
                    TIER 1 (WEIGHT = 1.00)
                  </span>
                  <span className="font-bold text-[#FFFDF7] font-sans text-sm">01. Direct Deployer Origin Link</span>
                </div>
                <p className="font-sans text-xs text-[#A7F3D0]">
                  Direct cryptographic connection linking all tokens deployed by the exact same Ethereum origin wallet.
                </p>
              </div>
              <div className="text-[#99F6E4] text-xs font-bold px-3 py-1.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] self-start md:self-auto">
                Formula: E_origin(T_i, T_j) = 1.00
              </div>
            </div>

            <div className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 md:max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#042F2E] text-[#FFD166] border border-[#FFD166]/30">
                    TIER 2 (WEIGHT = 0.85)
                  </span>
                  <span className="font-bold text-[#FFFDF7] font-sans text-sm">02. Shared Fee Recipient Sink</span>
                </div>
                <p className="font-sans text-xs text-[#A7F3D0]">
                  Uncovers stealth Sybil rings where distinct burner deployer addresses route their creator trading fees to a common destination sink.
                </p>
              </div>
              <div className="text-[#FFD166] text-xs font-bold px-3 py-1.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] self-start md:self-auto">
                Formula: E_fee(D_a, D_b) = 0.85
              </div>
            </div>

            <div className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 md:max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#042F2E] text-[#C084FC] border border-[#C084FC]/30">
                    TIER 3 (WEIGHT = 0.70)
                  </span>
                  <span className="font-bold text-[#FFFDF7] font-sans text-sm">03. Shared Upstream Funding Wallet</span>
                </div>
                <p className="font-sans text-xs text-[#A7F3D0]">
                  Traces coordinated creator wallets funded by common upstream CEX deposit addresses or relayer liquidity sources.
                </p>
              </div>
              <div className="text-[#C084FC] text-xs font-bold px-3 py-1.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] self-start md:self-auto">
                Formula: E_funder(W_1, W_2) = 0.70
              </div>
            </div>
          </div>
        </section>

        <section id="glossary-math" className="space-y-8 border-t border-[rgba(153,246,228,0.2)] pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 05 // ON-CHAIN RESEARCH LEXICON
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight mt-1">
                On-Chain Glossary &amp; Taxonomy
              </h2>
            </div>
            <div className="text-xs font-mono font-semibold text-[#A7F3D0]">
              {filteredGlossary.length} OF {GLOSSARY_DATA.length} SPECIFICATIONS
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99F6E4]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search glossary terms, formulas, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] text-xs text-[#FFFDF7] placeholder-[#A7F3D0]/60 focus:outline-none focus:border-[#FFD166] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Terms" },
                { id: "math", label: "Mathematical Models" },
                { id: "lifecycle", label: "Lifecycle" },
                { id: "heuristics", label: "Heuristics" },
                { id: "auth", label: "Network & Auth" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#FFD166] text-[#042F2E] shadow-sm"
                      : "bg-[#064E4A] text-[#A7F3D0] hover:text-[#FFFDF7] border border-[rgba(153,246,228,0.2)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[rgba(153,246,228,0.15)] border-t border-b border-[rgba(153,246,228,0.2)]">
            {filteredGlossary.map((item) => (
              <div key={item.term} className="py-5 space-y-2.5 hover:bg-[#042F2E]/40 px-2 rounded-xl transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#042F2E] text-[#99F6E4] border border-[rgba(153,246,228,0.2)]">
                      {item.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#FFFDF7] tracking-tight">
                      {item.term}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#A7F3D0] uppercase">
                    {item.categoryLabel}
                  </span>
                </div>

                {item.formula && (
                  <div className="p-2 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.15)] flex items-center justify-between text-xs font-mono text-[#FFD166] max-w-2xl">
                    <span>{item.formula}</span>
                    <button
                      onClick={() => handleCopy(item.formula!, item.id)}
                      className="p-1 hover:text-[#FFFDF7] text-[#99F6E4] transition-colors cursor-pointer"
                      title="Copy formula"
                    >
                      {copiedKey === item.id ? <IconCheck size={14} /> : <IconClipboard size={14} />}
                    </button>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                  {item.definition}
                </p>

                <div className="text-[11px] text-[#99F6E4] font-mono flex items-center gap-1.5 pt-1">
                  <span className="font-bold text-[#FFD166]">RESEARCH IMPLICATION:</span>
                  <span className="text-[#A7F3D0]">{item.implication}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-[rgba(153,246,228,0.2)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
          >
            <IconArrowLeft size={14} />
            <span>Read Technical API Documentation</span>
          </Link>

          <Link
            href="/census"
            className="inline-flex items-center gap-2 font-bold text-[#FFD166] hover:text-[#FFFDF7] hover:underline"
          >
            <span>Explore Ecosystem Census</span>
            <IconArrowRight size={14} />
          </Link>
        </footer>
      </main>
    </div>
  );
}
