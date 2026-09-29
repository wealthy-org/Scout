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
  IconCpu,
} from "@/components/icons/Vectors";

interface HowClientProps {
  isAuthenticated: boolean;
  userAddress?: string;
}

interface GlossaryVariable {
  symbol: string;
  meaning: string;
}

interface GlossaryItem {
  id: string;
  term: string;
  category: "math" | "lifecycle" | "heuristics" | "auth";
  categoryLabel: string;
  formula?: string;
  variables?: GlossaryVariable[];
  definition: string;
  implication: string;
  badge: string;
  severity: "STANDARD" | "PENALTY HEURISTIC" | "CRITICAL CLAMP" | "SECURITY PROTOCOL";
  severityColor: string;
  relatedIds: string[];
}

const GLOSSARY_DATA: GlossaryItem[] = [
  {
    id: "bonding-curve",
    term: "Bonding Curve",
    category: "lifecycle",
    categoryLabel: "Protocol Lifecycle",
    formula: "P(x) = k · x^γ (Pons V2 Standard)",
    variables: [
      { symbol: "P(x)", meaning: "Token price at circulating supply x" },
      { symbol: "k", meaning: "Factory invariant pricing constant" },
      { symbol: "γ", meaning: "Exponential curvature power factor" },
    ],
    definition:
      "An algorithmic smart contract mechanism that determines token price dynamically as tokens are purchased or sold along a deterministic mathematical curve prior to DEX graduation.",
    implication:
      "Guarantees continuous on-chain liquidity from genesis without requiring pre-funded Uniswap pools.",
    badge: "Pons V2",
    severity: "STANDARD",
    severityColor: "bg-[#99F6E4] text-[#042F2E]",
    relatedIds: ["graduated-phase", "bonding-velocity", "swept-phase"],
  },
  {
    id: "graduated-phase",
    term: "Graduated Phase",
    category: "lifecycle",
    categoryLabel: "Protocol Lifecycle",
    formula: "Curve_Progress == 100% → Pool_Migrate()",
    variables: [
      { symbol: "Curve_Progress", meaning: "Current total volume deposited / threshold required" },
      { symbol: "Pool_Migrate()", meaning: "Atomic contract call locking Uniswap V3 liquidity" },
    ],
    definition:
      "The milestone reached when 100% of a token's bonding curve threshold is reached, migrating liquidity and unlocking automated Uniswap V3 liquidity pool creation.",
    implication:
      "Transitions the token from factory bonding curve to free secondary market trading.",
    badge: "DEX Migration",
    severity: "STANDARD",
    severityColor: "bg-[#99F6E4] text-[#042F2E]",
    relatedIds: ["bonding-curve", "swept-phase", "laplace-smoothing"],
  },
  {
    id: "swept-phase",
    term: "Swept Phase",
    category: "lifecycle",
    categoryLabel: "Protocol Lifecycle",
    formula: "Treasury_Sweep(fees, recipient_addr)",
    variables: [
      { symbol: "fees", meaning: "Accrued protocol fee balance in ETH" },
      { symbol: "recipient_addr", meaning: "Authorized beneficiary or treasury contract address" },
    ],
    definition:
      "State where fee recipient or factory treasury has swept collected bonding curve protocol fees into designated recipient addresses.",
    implication:
      "Triggers automated fee routing verification in Scout Constellation engine.",
    badge: "Treasury",
    severity: "STANDARD",
    severityColor: "bg-[#99F6E4] text-[#042F2E]",
    relatedIds: ["sybil-cluster-ratio", "bonding-curve", "graduated-phase"],
  },
  {
    id: "laplace-smoothing",
    term: "Laplace Smoothing",
    category: "math",
    categoryLabel: "Mathematical Models",
    formula: "P_prior = (Graduated + 1) / (Total + 2)",
    variables: [
      { symbol: "Graduated (k)", meaning: "Number of successfully migrated tokens by creator" },
      { symbol: "Total (n)", meaning: "Total token contracts deployed by creator" },
      { symbol: "+1 / +2", meaning: "Laplace uniform pseudocount prior parameters (α=1, β=2)" },
    ],
    definition:
      "Bayesian probability technique defined as (Graduated + 1) / (Total + 2), preventing artificial 100% perfection scores on small sample sizes (e.g. 1/1 launches).",
    implication:
      "Ensures deployers with 1 launch cannot outrank established creators with dozens of proven graduations.",
    badge: "Bayesian Prior",
    severity: "STANDARD",
    severityColor: "bg-[#FFD166] text-[#042F2E]",
    relatedIds: ["doa", "burst-rate", "serial-penalty-cap"],
  },
  {
    id: "doa",
    term: "Dead on Arrival (DOA)",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "Loss > 95% ∧ Δt ≤ 600s",
    variables: [
      { symbol: "Loss", meaning: "Percentage decline from genesis opening price" },
      { symbol: "Δt", meaning: "Elapsed time since deployment transaction (10 minutes window)" },
    ],
    definition:
      "A token launch whose trading volume halts or loses >95% value within 10 minutes of genesis. High DOA frequency heavily penalizes creator score.",
    implication:
      "Docks deployer score by 8 to 15 points per abandoned deployment.",
    badge: "Penalty Signal",
    severity: "PENALTY HEURISTIC",
    severityColor: "bg-[#FF6B6B] text-[#042F2E]",
    relatedIds: ["laplace-smoothing", "burst-rate", "serial-penalty-cap"],
  },
  {
    id: "burst-rate",
    term: "Burst Rate",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "Burst% = N(Δt_deploy ≤ 1800s) / N_total",
    variables: [
      { symbol: "N(Δt ≤ 1800s)", meaning: "Count of genesis deployments spaced < 30 minutes apart" },
      { symbol: "N_total", meaning: "Total deployments recorded for the creator address" },
    ],
    definition:
      "The proportion of genesis deployments initiated within 30 minutes of a previous token by the same deployer, signaling automated token spam or rapid-fire rug activity.",
    implication:
      "Flags automated deployment bots and multi-contract pump-and-dump syndicates.",
    badge: "Velocity Clamp",
    severity: "PENALTY HEURISTIC",
    severityColor: "bg-[#FF9F43] text-[#042F2E]",
    relatedIds: ["doa", "serial-penalty-cap", "sybil-cluster-ratio"],
  },
  {
    id: "serial-penalty-cap",
    term: "Serial Penalty Cap",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "If (N_total ≥ 6 ∧ N_grad == 0) → Score ≤ 25",
    variables: [
      { symbol: "N_total ≥ 6", meaning: "High volume deployment threshold" },
      { symbol: "N_grad == 0", meaning: "Complete absence of liquidity graduation" },
      { symbol: "Score ≤ 25", meaning: "Hard quarantine in Hostile Red Band" },
    ],
    definition:
      "A strict mathematical ceiling clamping deployer reputation to a maximum of 25 (Red Band) whenever total launches >= 6 and graduated count equals 0.",
    implication:
      "Guarantees that serial deployers with 0 successful graduations are quarantined in the hostile zone.",
    badge: "Hard Quarantine",
    severity: "CRITICAL CLAMP",
    severityColor: "bg-[#EF4444] text-[#FFFDF7]",
    relatedIds: ["doa", "burst-rate", "laplace-smoothing"],
  },
  {
    id: "siwe",
    term: "Sign-In with Ethereum (SIWE)",
    category: "auth",
    categoryLabel: "Network & Auth",
    formula: "EIP-4361 / EIP-191 Personal_Sign",
    variables: [
      { symbol: "EIP-4361", meaning: "Standardized human-readable authentication message schema" },
      { symbol: "EIP-191", meaning: "Signed data prefix: '\\x19Ethereum Signed Message:\\n' + len" },
    ],
    definition:
      "EIP-4361 standard cryptographic authentication proving private key ownership via an EIP-191 personal sign message, establishing encrypted stateless sessions without passwords.",
    implication:
      "Secures private watchlists, dossier bookmarks, and case file publishing authority.",
    badge: "EIP-4361",
    severity: "SECURITY PROTOCOL",
    severityColor: "bg-[#C084FC] text-[#042F2E]",
    relatedIds: ["immutability-proof", "multicall3"],
  },
  {
    id: "multicall3",
    term: "MultiCall3 Aggregation",
    category: "auth",
    categoryLabel: "Network & Auth",
    formula: "MultiCall3.aggregate3(call_payloads[50])",
    variables: [
      { symbol: "aggregate3", meaning: "Atomic batch execution function with individual try-catch flags" },
      { symbol: "call_payloads", meaning: "Array of target contracts and encoded calldata" },
    ],
    definition:
      "Batching up to 50 smart contract read operations into a single RPC JSON-RPC payload to achieve sub-100ms dossier hydration while avoiding RPC rate limit throttling.",
    implication:
      "Drastically reduces HTTP overhead and provides atomic on-chain state inspection.",
    badge: "Sub-100ms RPC",
    severity: "SECURITY PROTOCOL",
    severityColor: "bg-[#C084FC] text-[#042F2E]",
    relatedIds: ["siwe", "immutability-proof"],
  },
  {
    id: "sybil-cluster-ratio",
    term: "Sybil Cluster Ratio",
    category: "heuristics",
    categoryLabel: "Forensic Heuristics",
    formula: "S_ratio = Wallets_routed / Unique_Recipients",
    variables: [
      { symbol: "Wallets_routed", meaning: "Count of burner creator addresses sharing fee sinks" },
      { symbol: "Unique_Recipients", meaning: "Distinct fund collection addresses" },
    ],
    definition:
      "Heuristic metric calculating the degree of fund consolidation between supposedly independent deployers sharing downstream liquidity addresses.",
    implication:
      "Reveals stealth dev operations operating across multiple burner addresses.",
    badge: "Graph Topology",
    severity: "PENALTY HEURISTIC",
    severityColor: "bg-[#FF9F43] text-[#042F2E]",
    relatedIds: ["burst-rate", "swept-phase", "doa"],
  },
  {
    id: "bonding-velocity",
    term: "Bonding Curve Velocity",
    category: "math",
    categoryLabel: "Mathematical Models",
    formula: "V_bc = d(Curve%) / dt",
    variables: [
      { symbol: "d(Curve%)", meaning: "Incremental change in bonding curve completion percentage" },
      { symbol: "dt", meaning: "Time delta in seconds or block intervals" },
    ],
    definition:
      "First derivative of bonding curve progress with respect to time, measuring buy pressure acceleration and graduation trajectory.",
    implication:
      "Helps distinguish organic accumulation surges from wash-trading spikes.",
    badge: "Derivative Rate",
    severity: "STANDARD",
    severityColor: "bg-[#FFD166] text-[#042F2E]",
    relatedIds: ["bonding-curve", "graduated-phase"],
  },
  {
    id: "immutability-proof",
    term: "Immutability Proof",
    category: "auth",
    categoryLabel: "Network & Auth",
    formula: "Hash(State_t || Author_Addr || Nonce)",
    variables: [
      { symbol: "State_t", meaning: "Serialized JSON snapshot of all dossier metrics" },
      { symbol: "Author_Addr", meaning: "Checksummed Ethereum address of publishing researcher" },
      { symbol: "Nonce", meaning: "Cryptographic single-use entropy seed" },
    ],
    definition:
      "Cryptographic digest generated when a researcher publishes a public dossier case file, locking the thesis, notes, and delta metrics permanently.",
    implication:
      "Guarantees that public case files cannot be tampered with or retroactively falsified.",
    badge: "Cryptographic Hash",
    severity: "SECURITY PROTOCOL",
    severityColor: "bg-[#C084FC] text-[#042F2E]",
    relatedIds: ["siwe", "multicall3"],
  },
];

const DELTA_TELEMETRY = [
  {
    code: "DELTA-01",
    name: "FDV Fluctuation",
    vector: "MARKET DYNAMICS",
    condition: "|FDV_t - FDV_0| / FDV_0 ≥ 20%",
    status: "ACTIVE TRIGGER",
    statusBadge: "bg-[#99F6E4] text-[#042F2E]",
    threshold: "±20.0% Band",
    sensitivity: "High",
    rationale: "Triggers on-chain alert whenever market capitalization shifts by ±20% or more since previous inspection snapshot.",
  },
  {
    code: "DELTA-02",
    name: "Liquidity Shift",
    vector: "RESERVE BALANCES",
    condition: "|Liq_t - Liq_0| / Liq_0 ≥ 20%",
    status: "ACTIVE TRIGGER",
    statusBadge: "bg-[#99F6E4] text-[#042F2E]",
    threshold: "±20.0% Band",
    sensitivity: "High",
    rationale: "Detects sudden pool drainage or abrupt liquidity injection on DEX pairs indicating whale accumulation or rug prep.",
  },
  {
    code: "DELTA-03",
    name: "Phase Progression",
    vector: "LIFECYCLE STATE",
    condition: "Phase_t ≠ Phase_0 (Curve → Graduated)",
    status: "CRITICAL EVENT",
    statusBadge: "bg-[#FFD166] text-[#042F2E]",
    threshold: "State Transition",
    sensitivity: "Real-Time",
    rationale: "Fires instantaneous notification upon bonding curve graduation migration or protocol fee sweep events.",
  },
  {
    code: "DELTA-04",
    name: "Fee Recipient Routing",
    vector: "SYBIL FORENSICS",
    condition: "Recipient_addr_t ≠ Recipient_addr_0",
    status: "SYBIL ALERT",
    statusBadge: "bg-[#FF6B6B] text-[#042F2E]",
    threshold: "Reroute Event",
    sensitivity: "Instant",
    rationale: "Flags any modification in the recipient address receiving creator trading fees to detect hidden Sybil fund sinks.",
  },
  {
    code: "DELTA-05",
    name: "GitHub Activity",
    vector: "CODE REPOSITORY",
    condition: "Commit_SHA_t ≠ Commit_SHA_0",
    status: "REPO UPDATE",
    statusBadge: "bg-[#C084FC] text-[#042F2E]",
    threshold: "Fresh Commit",
    sensitivity: "Batch Sync",
    rationale: "Alerts researcher when fresh code commits are pushed to associated public repositories.",
  },
  {
    code: "DELTA-06",
    name: "Deployer Genesis",
    vector: "CREATOR VELOCITY",
    condition: "Total_Deployments_t > Total_0",
    status: "NEW LAUNCH",
    statusBadge: "bg-[#FF9F43] text-[#042F2E]",
    threshold: "ΔN ≥ +1 Token",
    sensitivity: "Mempool / RPC",
    rationale: "Notifies when creator wallet deploys a subsequent token elsewhere across Robinhood Chain factories.",
  },
];

export function HowClient({ isAuthenticated, userAddress }: HowClientProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<number>(0);
  const [selectedDeltaRow, setSelectedDeltaRow] = useState<string>("DELTA-01");
  const [selectedGlossaryId, setSelectedGlossaryId] = useState<string>("bonding-curve");

  // Simulator State
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
        badgeBg: "bg-[#99F6E4] text-[#042F2E]",
        color: "text-[#99F6E4]",
        desc: "Low risk profile. High graduation frequency with verified liquidity permanence.",
      };
    if (calculatedScore >= 40)
      return {
        label: "CAUTION (YELLOW)",
        badgeBg: "bg-[#FFD166] text-[#042F2E]",
        color: "text-[#FFD166]",
        desc: "Moderate risk. Unproven graduation frequency or small statistical sample.",
      };
    return {
      label: "HOSTILE (RED)",
      badgeBg: "bg-[#FF6B6B] text-[#042F2E]",
      color: "text-[#FF6B6B]",
      desc: "High risk. Severe DOA abandonment rate or serial failure penalty enforced.",
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

  const activeGlossaryItem = useMemo(() => {
    const found = filteredGlossary.find((item) => item.id === selectedGlossaryId);
    return found || filteredGlossary[0] || GLOSSARY_DATA[0];
  }, [filteredGlossary, selectedGlossaryId]);

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-20 selection:bg-[#FFD166] selection:text-[#042F2E] overflow-x-hidden">
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-12 sm:space-y-16 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO: TACTICAL COMMAND BRIEFING HUD */}
        {/* ========================================================================= */}
        <header className="relative bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#99F6E4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-mono font-black tracking-widest uppercase bg-[#042F2E] border-2 border-[#042F2E] text-[#99F6E4] shadow-[2px_2px_0px_#042F2E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-ping" />
                  FIELD MANUAL // METHODOLOGY
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                  DOSSIER.OS v2.4
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FFFDF7] leading-[1.1]">
                Methodology &amp; Risk Architecture
              </h1>

              <p className="text-sm sm:text-base text-[#A7F3D0] leading-relaxed font-normal">
                Mathematical formulations, Bayesian reputation probabilities, real-time delta triggers, and relational graph topology powering algorithmic investigations on Robinhood Chain.
              </p>

              {/* Jump Nav Quick-Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: "01 // 4 Stages", href: "#workflow" },
                  { label: "02 // Math Lab", href: "#bayesian-math" },
                  { label: "03 // Delta Radar", href: "#delta-engine" },
                  { label: "04 // Sybil Graph", href: "#graph-topology" },
                  { label: "05 // Lexicon", href: "#glossary-math" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-3 py-1.5 rounded-xl bg-[#042F2E] hover:bg-[#FFD166] text-[#A7F3D0] hover:text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] font-mono text-[11px] font-black transition-all active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Avionics Telemetry Block */}
            <div className="lg:w-80 shrink-0 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-4 shadow-[6px_6px_0px_#042F2E] space-y-3">
              <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 text-[11px] font-mono font-black text-[#99F6E4]">
                <span className="flex items-center gap-1.5">
                  <IconCpu size={14} className="text-[#99F6E4]" />
                  ENGINE STATUS
                </span>
                <span className="text-[#FFD166]">LIVE HYDRATION</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 font-mono">
                <div className="bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E] space-y-1">
                  <div className="text-[9px] font-bold text-[#A7F3D0] uppercase">Bayesian Core</div>
                  <div className="text-xs font-black text-[#99F6E4]">Laplace (α=1, β=2)</div>
                  <div className="w-full bg-[#042F2E] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#99F6E4] h-full w-4/5 rounded-full" />
                  </div>
                </div>

                <div className="bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E] space-y-1">
                  <div className="text-[9px] font-bold text-[#A7F3D0] uppercase">Surveillance</div>
                  <div className="text-xs font-black text-[#FFD166]">6 Active Triggers</div>
                  <div className="w-full bg-[#042F2E] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#FFD166] h-full w-full rounded-full" />
                  </div>
                </div>

                <div className="bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E] space-y-1">
                  <div className="text-[9px] font-bold text-[#A7F3D0] uppercase">Graph Edges</div>
                  <div className="text-xs font-black text-[#FF9F43]">3 Weighted Tiers</div>
                  <div className="w-full bg-[#042F2E] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#FF9F43] h-full w-3/4 rounded-full" />
                  </div>
                </div>

                <div className="bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E] space-y-1">
                  <div className="text-[9px] font-bold text-[#A7F3D0] uppercase">RPC Execution</div>
                  <div className="text-xs font-black text-[#C084FC]">Sub-85ms Batch</div>
                  <div className="w-full bg-[#042F2E] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#C084FC] h-full w-5/6 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>


        {/* ========================================================================= */}
        {/* 2. SECTION 1: THE 4-STEP INTELLIGENCE WORKFLOW (INTERACTIVE PIPELINE STATION) */}
        {/* ========================================================================= */}
        <section id="workflow" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-[#042F2E] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-black">
                SECTION 01 // PROTOCOL PIPELINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                The 4-Step Intelligence Workflow
              </h2>
            </div>
            <div className="text-xs font-mono font-bold text-[#FFD166] bg-[#042F2E] px-3 py-1 rounded-xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
              STEP {activeWorkflowTab + 1} OF 4 ACTIVE
            </div>
          </div>

          {/* Stepper Navigation Track */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { idx: 0, num: "01", name: "Investigate", desc: "Bytecode & MultiCall3", color: "bg-[#99F6E4]" },
              { idx: 1, num: "02", name: "Score", desc: "Bayesian Probability", color: "bg-[#FFD166]" },
              { idx: 2, num: "03", name: "Track", desc: "Since Last Check Diff", color: "bg-[#FF9F43]" },
              { idx: 3, num: "04", name: "Publish", desc: "Immutable Forensic Dossier", color: "bg-[#C084FC]" },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setActiveWorkflowTab(step.idx)}
                className={`p-3.5 rounded-2xl border-2 border-[#042F2E] text-left transition-all cursor-pointer ${
                  activeWorkflowTab === step.idx
                    ? "bg-[#042F2E] shadow-[6px_6px_0px_#042F2E] -translate-x-[1px] -translate-y-[1px]"
                    : "bg-[#064E4A] hover:bg-[#064E4A]/80 shadow-[3px_3px_0px_#042F2E]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center border-2 border-[#042F2E] shadow-[1.5px_1.5px_0px_#042F2E] text-[#042F2E] ${step.color}`}
                  >
                    {step.num}
                  </span>
                  {activeWorkflowTab === step.idx && (
                    <span className="w-2 h-2 rounded-full bg-[#99F6E4] animate-pulse" />
                  )}
                </div>
                <div className="text-sm font-black text-[#FFFDF7]">{step.name}</div>
                <div className="text-[11px] font-mono text-[#A7F3D0] truncate mt-0.5">{step.desc}</div>
              </button>
            ))}
          </div>

          {/* Active Station Display View */}
          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E]">
            {activeWorkflowTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#99F6E4] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                        STAGE 01
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7]">
                        01. Investigate // Bytecode &amp; Liquidity Audit
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                      When a token contract is inspected, Scout concurrently batches factory state, token metadata, liquidity balances, and pricing pairs in a sub-100ms atomic call using MultiCall3.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono font-black text-[#99F6E4] uppercase">KEY FORENSIC VECTORS:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                      <div className="bg-[#042F2E] p-2.5 rounded-xl border-2 border-[#042F2E]">
                        <span className="text-[10px] text-[#99F6E4] font-bold">Factory Pool</span>
                        <div className="text-[#FFFDF7] font-black text-xs truncate mt-0.5">0x90a2...b41</div>
                      </div>
                      <div className="bg-[#042F2E] p-2.5 rounded-xl border-2 border-[#042F2E]">
                        <span className="text-[10px] text-[#FFD166] font-bold">Total Supply</span>
                        <div className="text-[#FFFDF7] font-black text-xs mt-0.5">1,000,000,000</div>
                      </div>
                      <div className="bg-[#042F2E] p-2.5 rounded-xl border-2 border-[#042F2E]">
                        <span className="text-[10px] text-[#99F6E4] font-bold">Reserves (ETH)</span>
                        <div className="text-[#FFFDF7] font-black text-xs mt-0.5">42.5 ETH</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terminal Window View */}
                <div className="lg:col-span-6 bg-[#031E1D] border-2 border-[#042F2E] rounded-2xl p-4 font-mono text-xs text-[#99F6E4] shadow-[4px_4px_0px_#042F2E] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#99F6E4]" />
                      <span className="text-[#A7F3D0] ml-2 font-bold">MULTICALL3 DISASSEMBLER</span>
                    </div>
                    <span className="text-[#FFD166]">BLOCK #27195420</span>
                  </div>
                  <pre className="overflow-x-auto text-[11px] text-[#FFFDF7] leading-relaxed">
{`>> MultiCall3.aggregate3([
     { target: 0x4663...0001, callData: "getPool(0x3b89...)" },
     { target: 0x3b89...7102, callData: "totalSupply()" },
     { target: 0x4663...0001, callData: "getReserves(0x3b89...)" },
     { target: 0x3b89...7102, callData: "owner()" }
   ])
<< 4 Call Returns Decoded in 68ms
[OK] Factory: Pons V2 Verified (0x4663...0001)
[OK] Curve Status: 100.0% Swept / Migrated
[OK] Origin Deployer: 0x89e247413697b0d911b3327d78fa1b94541889b2`}
                  </pre>
                </div>
              </div>
            )}

            {activeWorkflowTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                        STAGE 02
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7]">
                        02. Score // Bayesian Probability Model
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                      Deployer origin wallets are scored between 0–100 using Laplace-smoothed graduation rates, DOA penalties, burst rate dampeners, and hard serial penalty clamps.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono font-black text-[#FFD166] uppercase">FORMULA POSTULATE:</span>
                    <div className="font-mono text-xs font-black text-[#FFFDF7] bg-[#064E4A] p-2.5 rounded-xl">
                      Score = clamp(Base_Laplace - DOA_Loss - Burst_Decay, 0, 100)
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-5 shadow-[4px_4px_0px_#042F2E] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 font-mono text-xs font-black">
                    <span className="text-[#FFD166]">REPUTATION BREAKDOWN</span>
                    <span className="text-[#99F6E4]">SCORE: 84 / 100</span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[#A7F3D0]">Laplace Prior:</span>
                      <span className="font-black text-[#99F6E4]">+78.5 PTS</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[#A7F3D0]">DOA Deductions (1 token):</span>
                      <span className="font-black text-[#FF6B6B]">-8.0 PTS</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[#A7F3D0]">Burst Velocity Dampener:</span>
                      <span className="font-black text-[#FF9F43]">-3.0 PTS</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[#A7F3D0]">Serial Penalty Cap Status:</span>
                      <span className="font-black text-[#99F6E4]">CLEAR (0 Penalties)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#FF9F43] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                        STAGE 03
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7]">
                        03. Track // State Delta Comparison
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                      Every inspection records a snapshot. When revisited, Scout computes metric differences across FDV, liquidity, phase shifts, git commits, and fee recipients via our 30-snapshot buffer.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl flex items-center justify-between text-xs font-mono">
                    <span className="text-[#A7F3D0]">BUFFER RETENTION:</span>
                    <span className="font-black text-[#FF9F43]">30 FIFO SNAPSHOTS</span>
                  </div>
                </div>

                {/* Diff Console */}
                <div className="lg:col-span-6 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-4 shadow-[4px_4px_0px_#042F2E] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 font-mono text-xs font-black text-[#FF9F43]">
                    <span>SINCE LAST CHECK COMPARISON</span>
                    <span className="text-[#99F6E4]">Δ COMPUTED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-[#064E4A] p-3 rounded-xl border border-[#042F2E] space-y-1">
                      <div className="text-[10px] text-[#A7F3D0]">SNAPSHOT @ GENESIS</div>
                      <div className="text-xs font-bold text-[#FFFDF7]">$854,000 FDV</div>
                      <div className="text-[10px] text-[#FFD166]">Curve Phase (45%)</div>
                    </div>

                    <div className="bg-[#064E4A] p-3 rounded-xl border border-[#042F2E] space-y-1">
                      <div className="text-[10px] text-[#A7F3D0]">SNAPSHOT @ CURRENT</div>
                      <div className="text-xs font-bold text-[#99F6E4]">$2,450,000 FDV</div>
                      <div className="text-[10px] text-[#99F6E4]">Graduated (100%)</div>
                    </div>
                  </div>

                  <div className="bg-[#031E1D] p-2.5 rounded-xl text-[11px] font-mono flex items-center justify-between text-[#99F6E4]">
                    <span>DELTA STATUS:</span>
                    <span className="font-black text-[#99F6E4]">+186.8% SURGE // TRIGGER EXCEEDED</span>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowTab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#C084FC] text-[#042F2E] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
                        STAGE 04
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFFDF7]">
                        04. Publish // Immutable Forensic Dossier
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                      Freeze research thesis and findings into permanent case files with cryptographic author attribution, fork capability, and instant revocation controls via EIP-191 signatures.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl flex items-center justify-between text-xs font-mono">
                    <span className="text-[#A7F3D0]">INTEGRITY PROOF:</span>
                    <span className="font-black text-[#C084FC]">EIP-191 CRYPTOGRAPHIC DIGEST</span>
                  </div>
                </div>

                {/* Dossier Certificate Stamp Card */}
                <div className="lg:col-span-6 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-5 shadow-[4px_4px_0px_#042F2E] space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 font-mono text-xs font-black text-[#C084FC]">
                    <span>IMMUTABLE DOSSIER RECORD</span>
                    <span className="text-[#99F6E4]">SEALED</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[10px] text-[#A7F3D0]">Digest SHA-256:</span>
                      <div className="text-xs font-black text-[#FFFDF7] truncate mt-0.5">
                        0x7f2a8901bce471028391029384710293847102938471c89e
                      </div>
                    </div>
                    <div className="bg-[#064E4A] p-2.5 rounded-xl border border-[#042F2E]">
                      <span className="text-[10px] text-[#A7F3D0]">Author Signature:</span>
                      <div className="text-xs font-black text-[#C084FC] truncate mt-0.5">
                        EIP-191 Verified (0x12a9...4910)
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#031E1D] p-2 rounded-xl text-[10px] font-mono text-[#A7F3D0] flex items-center justify-between">
                    <span>STATE: IMMUTABLE PUBLIC CASE FILE</span>
                    <span className="text-[#FFD166] font-bold">PERMALINK ENABLED</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 3. SECTION 2: MATHEMATICAL WORKBENCH & INTERACTIVE LAB */}
        {/* ========================================================================= */}
        <section id="bayesian-math" className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E] space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#042F2E] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD166] font-black">
                SECTION 02 // MATHEMATICAL WORKBENCH
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                Bayesian Mathematical Formulation &amp; Sandbox
              </h2>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#042F2E] border-2 border-[#042F2E] text-xs font-mono font-black text-[#FFD166] shadow-[2px_2px_0px_#042F2E] self-start sm:self-auto">
              SPEC v2.4
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 4 Formulas Drafting Table */}
            <div className="lg:col-span-7 bg-[#042F2E] rounded-3xl border-2 border-[#042F2E] p-5 sm:p-6 shadow-[6px_6px_0px_#042F2E] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#064E4A] pb-2">
                  <span className="text-xs font-mono font-black text-[#99F6E4] uppercase tracking-wider">
                    MATHEMATICAL POSTULATES
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#A7F3D0] bg-[#064E4A] px-2.5 py-0.5 rounded-lg border border-[#042F2E]">
                    4 FORMULATIONS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
                  {/* 1.1 Base Laplace */}
                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-4 shadow-[4px_4px_0px_#042F2E] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FFD166] font-black uppercase">1.1 // BASE LAPLACE</span>
                      <button
                        onClick={() => handleCopy("S_base = ((k + 1) / (n + 2)) * 100", "p1")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p1" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-black text-[#FFD166]">((k + 1) / (n + 2)) × 100</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-snug">
                      Laplace smoothing prior preventing 100% false perfection on 1/1 creator sample sizes.
                    </p>
                  </div>

                  {/* 1.2 DOA Deduction */}
                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-4 shadow-[4px_4px_0px_#042F2E] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FF6B6B] font-black uppercase">1.2 // DOA DEDUCTION</span>
                      <button
                        onClick={() => handleCopy("P_doa = min(8 * d, 30)", "p2")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p2" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-black text-[#FF6B6B]">min(8 × d, 30)</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-snug">
                      Dead on Arrival (DOA) penalty docking 8 points per abandoned launch within 10m of genesis.
                    </p>
                  </div>

                  {/* 1.3 Burst Dampener */}
                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-4 shadow-[4px_4px_0px_#042F2E] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#FF9F43] font-black uppercase">1.3 // BURST DAMPENER</span>
                      <button
                        onClick={() => handleCopy("P_burst = min((b / 100) * 15, 20)", "p3")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p3" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-black text-[#FF9F43]">min((b/100) × 15, 20)</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-snug">
                      Burst rate velocity clamp for rapid-fire automated deployments launched &lt;30m apart.
                    </p>
                  </div>

                  {/* 1.4 Serial Clamp */}
                  <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-2xl p-4 shadow-[4px_4px_0px_#042F2E] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#C084FC] font-black uppercase">1.4 // SERIAL CLAMP</span>
                      <button
                        onClick={() => handleCopy("If (n >= 6 && k == 0) -> S_final <= 25", "p4")}
                        className="text-[10px] text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[#042F2E] px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedKey === "p4" ? <IconCheck size={10} className="text-[#99F6E4]" /> : <IconClipboard size={10} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm font-black text-[#C084FC]">If n≥6 ∧ k=0 → ≤25</div>
                    <p className="font-sans text-xs text-[#A7F3D0] leading-snug">
                      Serial Penalty Cap ceiling quarantining persistent zero-graduation creators into Hostile Red.
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Equation Strip */}
              <div className="p-3.5 rounded-2xl bg-[#031E1D] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] text-xs font-mono text-[#FFFDF7] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[#99F6E4] font-black">MASTER REPUTATION FORMULA:</span>
                <span className="text-[#FFD166] font-black text-sm">S = clamp(S_base - P_doa - P_burst, 0, 100)</span>
              </div>
            </div>

            {/* Right Simulator Console */}
            <div className="lg:col-span-5 bg-[#042F2E] rounded-3xl border-2 border-[#042F2E] p-5 sm:p-6 shadow-[6px_6px_0px_#042F2E] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#064E4A] pb-2">
                  <span className="text-xs font-mono font-black text-[#FFD166] uppercase">SIMULATOR INSTRUMENT</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black ${scoreBand.badgeBg}`}>
                    {scoreBand.label}
                  </span>
                </div>

                {/* Big Score Meter */}
                <div className="text-center py-4 sm:py-5 bg-[#064E4A] rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E]">
                  <div className={`text-4xl sm:text-6xl font-black tracking-tight ${scoreBand.color}`}>
                    {calculatedScore}
                  </div>
                  <div className="text-xs font-mono text-[#A7F3D0] mt-1 font-bold uppercase tracking-wider">
                    CALCULATED REPUTATION SCORE / 100
                  </div>
                </div>

                {/* 4 Interactive Sliders */}
                <div className="grid grid-cols-2 gap-3.5 font-mono text-xs">
                  <div className="bg-[#064E4A] p-3 rounded-xl border border-[#042F2E]">
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1.5 text-xs font-bold">
                      <span>Launches (n):</span>
                      <span className="font-black text-[#FFFDF7] text-sm">{simTotal}</span>
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
                      className="w-full accent-[#FFD166] h-2 bg-[#042F2E] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="bg-[#064E4A] p-3 rounded-xl border border-[#042F2E]">
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1.5 text-xs font-bold">
                      <span>Grads (k):</span>
                      <span className="font-black text-[#99F6E4] text-sm">{simGraduated}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={simTotal}
                      value={simGraduated}
                      onChange={(e) => setSimGraduated(Number(e.target.value))}
                      className="w-full accent-[#99F6E4] h-2 bg-[#042F2E] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="bg-[#064E4A] p-3 rounded-xl border border-[#042F2E]">
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1.5 text-xs font-bold">
                      <span>DOA (d):</span>
                      <span className="font-black text-[#FF6B6B] text-sm">{simDoa}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={simDoa}
                      onChange={(e) => setSimDoa(Number(e.target.value))}
                      className="w-full accent-[#FF6B6B] h-2 bg-[#042F2E] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="bg-[#064E4A] p-3 rounded-xl border border-[#042F2E]">
                    <div className="flex items-center justify-between text-[#A7F3D0] mb-1.5 text-xs font-bold">
                      <span>Burst (b):</span>
                      <span className="font-black text-[#FF9F43] text-sm">{simBurst}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={simBurst}
                      onChange={(e) => setSimBurst(Number(e.target.value))}
                      className="w-full accent-[#FF9F43] h-2 bg-[#042F2E] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Deduction Summary */}
              <div className="pt-3 border-t border-[#064E4A] text-xs font-mono text-[#A7F3D0] flex items-center justify-between">
                <span>Base: <strong className="text-[#FFD166]">{baseScoreVal}</strong></span>
                <span>DOA: <strong className="text-[#FF6B6B]">-{doaDeductionVal}</strong></span>
                <span>Burst: <strong className="text-[#FF9F43]">-{burstDeductionVal}</strong></span>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 4. SECTION 3: REAL-TIME SURVEILLANCE & DELTA TELEMETRY MONITOR (TABLE LAYOUT) */}
        {/* ========================================================================= */}
        <section id="delta-engine" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-[#042F2E] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-black">
                SECTION 03 // REAL-TIME SURVEILLANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                Since Last Check Delta Telemetry Monitor
              </h2>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#042F2E] border-2 border-[#042F2E] text-xs font-mono font-black text-[#99F6E4] shadow-[2px_2px_0px_#042F2E] self-start sm:self-auto">
              30-SNAPSHOT FIFO BUFFER
            </div>
          </div>

          {/* Telemetry Monitor Table Container */}
          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#042F2E] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#042F2E] pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-ping" />
                <span className="font-black text-[#99F6E4]">SURVEILLANCE SENSOR ARRAY ARMED</span>
              </div>
              <span className="text-[#A7F3D0]">SELECT A VECTOR TO INSPECT LIVE LOGIC</span>
            </div>

            {/* Structured Sensor Table */}
            <div className="overflow-x-auto rounded-2xl border-2 border-[#042F2E] bg-[#042F2E] shadow-[4px_4px_0px_#042F2E]">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#031E1D] text-[#99F6E4] border-b-2 border-[#042F2E] text-[11px] font-black uppercase">
                    <th className="py-3 px-4">SENSOR ID</th>
                    <th className="py-3 px-4">VECTOR</th>
                    <th className="py-3 px-4">TRIGGER CONDITION</th>
                    <th className="py-3 px-4">THRESHOLD</th>
                    <th className="py-3 px-4">SEVERITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#064E4A]">
                  {DELTA_TELEMETRY.map((item) => (
                    <tr
                      key={item.code}
                      onClick={() => setSelectedDeltaRow(item.code)}
                      className={`transition-colors cursor-pointer ${
                        selectedDeltaRow === item.code
                          ? "bg-[#064E4A] text-[#FFFDF7]"
                          : "hover:bg-[#064E4A]/50 text-[#A7F3D0]"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-black text-[#FFD166]">
                        {item.code}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#FFFDF7]">
                        {item.name}
                        <div className="text-[10px] text-[#A7F3D0] font-normal">{item.vector}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#031E1D] px-2 py-1 rounded-md text-[#99F6E4] border border-[#042F2E]">
                          {item.condition}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#FFD166] font-bold">
                        {item.threshold}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#042F2E] ${item.statusBadge}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Active Telemetry Detail Banner */}
            {(() => {
              const activeSensor = DELTA_TELEMETRY.find((d) => d.code === selectedDeltaRow) || DELTA_TELEMETRY[0];
              return (
                <div className="bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#042F2E] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-[#FFD166] bg-[#064E4A] px-2 py-0.5 rounded-lg border border-[#042F2E]">
                        {`${activeSensor.code} // ${activeSensor.name}`}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#99F6E4]">
                        SENSITIVITY: {activeSensor.sensitivity}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed">
                      {activeSensor.rationale}
                    </p>
                  </div>

                  <div className="shrink-0 bg-[#064E4A] p-3 rounded-xl border border-[#042F2E] font-mono text-xs text-[#FFD166] font-bold">
                    Condition: {activeSensor.condition}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 5. SECTION 4: CONSTELLATION GRAPH RELATIONAL TOPOLOGY (BLUEPRINT CANVAS) */}
        {/* ========================================================================= */}
        <section id="graph-topology" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-[#042F2E] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-black">
                SECTION 04 // SYBIL DETECTION ENGINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                Constellation Graph Relational Topology Canvas
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-black text-[#FFD166] self-start sm:self-auto bg-[#042F2E] px-3.5 py-1.5 rounded-xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
              <IconGraph size={14} />
              <span>3-TIER BLUEPRINT</span>
            </div>
          </div>

          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 3 Rails */}
            <div className="lg:col-span-6 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#042F2E] pb-2">
                  <span className="text-xs font-mono font-black text-[#99F6E4] uppercase">
                    HEURISTIC WEIGHT MATRIX
                  </span>
                  <span className="text-[10px] font-mono text-[#A7F3D0]">CONFIDENCE RATIO</span>
                </div>

                {/* Tier 1 */}
                <div className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#99F6E4]">01. Deployer Origin Link</span>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-[#99F6E4] text-[#042F2E]">
                      1.00 WEIGHT // 100%
                    </span>
                  </div>
                  <p className="text-xs text-[#A7F3D0] leading-snug">
                    Direct cryptographic link connecting token contracts created by the exact same Ethereum origin address.
                  </p>
                </div>

                {/* Tier 2 */}
                <div className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#FFD166]">02. Shared Fee Sink</span>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-[#FFD166] text-[#042F2E]">
                      0.85 WEIGHT // 85%
                    </span>
                  </div>
                  <p className="text-xs text-[#A7F3D0] leading-snug">
                    Uncovers Sybil rings where distinct deployer wallets funnel collected trading fees into a shared recipient address.
                  </p>
                </div>

                {/* Tier 3 */}
                <div className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#C084FC]">03. Upstream Dev Funder</span>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-[#C084FC] text-[#042F2E]">
                      0.70 WEIGHT // 70%
                    </span>
                  </div>
                  <p className="text-xs text-[#A7F3D0] leading-snug">
                    Traces burner deployers seeded with initial deployment gas from common upstream funding relays.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Topology Blueprint Visual Canvas */}
            <div className="lg:col-span-6 bg-[#031E1D] border-2 border-[#042F2E] rounded-2xl p-5 shadow-[4px_4px_0px_#042F2E] flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 text-[11px] font-mono">
                <span className="font-black text-[#99F6E4]">CONSTELLATION TOPOLOGY SIMULATOR</span>
                <span className="text-[#FFD166]">GRAPH ENGINE ACTIVE</span>
              </div>

              {/* Node Schematic Canvas */}
              <div className="relative h-44 sm:h-48 rounded-xl bg-[#042F2E]/60 border border-[#064E4A] flex items-center justify-around px-4">
                {/* Node 1 */}
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-[#99F6E4] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] text-[#042F2E] font-mono font-black text-xs flex items-center justify-center mx-auto">
                    D1
                  </div>
                  <div className="text-[10px] font-mono text-[#99F6E4]">Deployer A</div>
                </div>

                {/* Arrow 1 */}
                <div className="text-center font-mono text-[10px] text-[#FFD166]">
                  <span className="block border-t-2 border-dashed border-[#FFD166] w-12 sm:w-16 my-1" />
                  <span>Fee Sink</span>
                </div>

                {/* Center Hub */}
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD166] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] text-[#042F2E] font-mono font-black text-xs flex items-center justify-center mx-auto">
                    0x89e
                  </div>
                  <div className="text-[10px] font-mono text-[#FFD166] font-bold">Sink Hub</div>
                </div>

                {/* Arrow 2 */}
                <div className="text-center font-mono text-[10px] text-[#C084FC]">
                  <span className="block border-t-2 border-dashed border-[#C084FC] w-12 sm:w-16 my-1" />
                  <span>Sybil Link</span>
                </div>

                {/* Node 2 */}
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-[#C084FC] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] text-[#042F2E] font-mono font-black text-xs flex items-center justify-center mx-auto">
                    D2
                  </div>
                  <div className="text-[10px] font-mono text-[#C084FC]">Deployer B</div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#A7F3D0] bg-[#042F2E] p-2.5 rounded-xl border border-[#064E4A] flex items-center justify-between">
                <span>DETECTED CLUSTERS:</span>
                <span className="text-[#FFD166] font-bold">1 SYBIL RING (85% SIMILARITY)</span>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 6. SECTION 5: ON-CHAIN GLOSSARY & FORENSIC CODEX WORKBENCH (TWO-PANE SPLIT) */}
        {/* ========================================================================= */}
        <section id="glossary-math" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-[#042F2E] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD166] font-black">
                SECTION 05 // ON-CHAIN GLOSSARY &amp; CODEX
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                Forensic Research Codex &amp; Taxonomy
              </h2>
            </div>
            <div className="text-xs font-mono font-black text-[#FFD166] bg-[#042F2E] px-3.5 py-1.5 rounded-xl border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E]">
              {filteredGlossary.length} OF {GLOSSARY_DATA.length} CONCEPTS
            </div>
          </div>

          {/* Interactive Two-Pane Split Codex Workbench */}
          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#042F2E] space-y-6">
            
            {/* Top Toolbar: Search & Category Filter Pills */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <IconSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99F6E4]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword, mathematical formula, or vector..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] text-xs font-mono text-[#FFFDF7] placeholder-[#A7F3D0]/60 focus:outline-none focus:shadow-[4px_4px_0px_#042F2E]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: "all", label: "All (12)" },
                  { id: "math", label: "Math (3)" },
                  { id: "lifecycle", label: "Lifecycle (3)" },
                  { id: "heuristics", label: "Heuristics (3)" },
                  { id: "auth", label: "Auth (3)" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold font-mono whitespace-nowrap transition-all cursor-pointer border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] ${
                      selectedCategory === cat.id
                        ? "bg-[#FFD166] text-[#042F2E]"
                        : "bg-[#042F2E] text-[#A7F3D0] hover:text-[#FFFDF7]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Two-Pane Master-Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Pane: Interactive Navigator Ledger Index (5 cols) */}
              <div className="lg:col-span-5 space-y-2 bg-[#042F2E] p-3 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] max-h-[580px] overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1.5 text-[10px] font-mono font-black text-[#99F6E4] border-b border-[#064E4A]">
                  <span>INDEXED ENTRIES ({filteredGlossary.length})</span>
                  <span>CATEGORY</span>
                </div>

                {filteredGlossary.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-[#A7F3D0]">
                    No matching glossary concepts found.
                  </div>
                ) : (
                  filteredGlossary.map((item, index) => {
                    const isSelected = activeGlossaryItem.id === item.id;
                    const indexStr = String(index + 1).padStart(2, "0");
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedGlossaryId(item.id)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? "bg-[#064E4A] border-[#FFD166] shadow-[3px_3px_0px_#042F2E] -translate-x-[1px]"
                            : "bg-[#042F2E] border-transparent hover:border-[#064E4A] hover:bg-[#064E4A]/40 text-[#A7F3D0]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`font-mono text-[11px] font-black shrink-0 ${isSelected ? "text-[#FFD166]" : "text-[#99F6E4]"}`}>
                            #{indexStr}
                          </span>
                          <span className={`font-black text-xs truncate ${isSelected ? "text-[#FFFDF7]" : "text-[#A7F3D0]"}`}>
                            {item.term}
                          </span>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 border border-[#042F2E] ${
                          isSelected ? "bg-[#FFD166] text-[#042F2E]" : "bg-[#031E1D] text-[#A7F3D0]"
                        }`}>
                          {item.badge}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Pane: Active Deep-Dive Dossier Specification Sheet (7 cols) */}
              <div className="lg:col-span-7 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-5 sm:p-6 shadow-[6px_6px_0px_#042F2E] space-y-5">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-[#064E4A] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg bg-[#064E4A] text-[#99F6E4] border border-[#042F2E]">
                        {activeGlossaryItem.badge}
                      </span>
                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-md border border-[#042F2E] ${activeGlossaryItem.severityColor}`}>
                        {activeGlossaryItem.severity}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
                      {activeGlossaryItem.term}
                    </h3>
                  </div>

                  <div className="text-[10px] font-mono font-bold text-[#A7F3D0] uppercase bg-[#064E4A] px-3 py-1 rounded-xl border border-[#042F2E] self-start">
                    {activeGlossaryItem.categoryLabel}
                  </div>
                </div>

                {/* Mathematical Formulation Slate (if formula exists) */}
                {activeGlossaryItem.formula && (
                  <div className="bg-[#031E1D] border-2 border-[#042F2E] rounded-2xl p-4 shadow-[3px_3px_0px_#042F2E] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#064E4A] pb-2 text-[10px] font-mono">
                      <span className="text-[#99F6E4] font-black uppercase">MATHEMATICAL FORMULATION</span>
                      <button
                        onClick={() => handleCopy(activeGlossaryItem.formula!, `f-${activeGlossaryItem.id}`)}
                        className="text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#064E4A] px-2 py-0.5 rounded-md border border-[#042F2E] flex items-center gap-1 cursor-pointer active:translate-x-[1px]"
                      >
                        {copiedKey === `f-${activeGlossaryItem.id}` ? (
                          <IconCheck size={10} className="text-[#99F6E4]" />
                        ) : (
                          <IconClipboard size={10} />
                        )}
                        <span>Copy Formula</span>
                      </button>
                    </div>

                    <div className="text-sm sm:text-base font-mono font-black text-[#FFD166] tracking-wide">
                      {activeGlossaryItem.formula}
                    </div>

                    {activeGlossaryItem.variables && activeGlossaryItem.variables.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#064E4A] text-[11px] font-mono">
                        {activeGlossaryItem.variables.map((v, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[#A7F3D0]">
                            <span className="font-bold text-[#99F6E4] shrink-0">{v.symbol}:</span>
                            <span className="text-[#FFFDF7]/80 text-[10px]">{v.meaning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Formal Definition */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-black text-[#99F6E4] uppercase">
                    FORMAL SPECIFICATION &amp; MECHANICS:
                  </div>
                  <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal bg-[#064E4A] p-4 rounded-2xl border border-[#042F2E]">
                    {activeGlossaryItem.definition}
                  </p>
                </div>

                {/* Strategic Implication Alert Callout */}
                <div className="p-4 rounded-2xl bg-[#064E4A] border-2 border-[#FFD166] shadow-[3px_3px_0px_#042F2E] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-black text-[#FFD166]">
                    <span>⚡ RESEARCHER &amp; TRADER IMPLICATION</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#FFFDF7] leading-snug">
                    {activeGlossaryItem.implication}
                  </p>
                </div>

                {/* Cross-Referenced Related Concepts */}
                {activeGlossaryItem.relatedIds.length > 0 && (
                  <div className="pt-2 border-t border-[#064E4A] space-y-2">
                    <div className="text-[10px] font-mono font-bold text-[#A7F3D0] uppercase">
                      RELATED FORENSIC VECTORS:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeGlossaryItem.relatedIds.map((relId) => {
                        const target = GLOSSARY_DATA.find((g) => g.id === relId);
                        if (!target) return null;
                        return (
                          <button
                            key={relId}
                            onClick={() => {
                              setSelectedCategory("all");
                              setSelectedGlossaryId(relId);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#064E4A] hover:bg-[#FFD166] text-[#99F6E4] hover:text-[#042F2E] text-[11px] font-mono font-bold border border-[#042F2E] transition-colors cursor-pointer"
                          >
                            → {target.term}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 7. FOOTER NAVIGATION */}
        {/* ========================================================================= */}
        <footer className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <Link
            href="/docs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-6 py-3.5 rounded-2xl bg-[#064E4A] text-[#99F6E4] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <IconArrowLeft size={16} />
            <span>Read Developer Documentation</span>
          </Link>

          <Link
            href="/census"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-6 py-3.5 rounded-2xl bg-[#FFD166] text-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] hover:shadow-[6px_6px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <span>Explore Ecosystem Census</span>
            <IconArrowRight size={16} />
          </Link>
        </footer>
      </main>
    </div>
  );
}
