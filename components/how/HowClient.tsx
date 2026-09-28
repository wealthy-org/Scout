"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import {
  IconArrowLeft,
  IconArrowRight,
  IconRadar,
  IconShield,
  IconRepeat,
  IconLock,
  IconCpu,
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
    if (calculatedScore >= 70) return { label: "RELIABLE", color: "text-[#99F6E4] bg-[#14B8A6]/20 border-[#99F6E4]/40" };
    if (calculatedScore >= 40) return { label: "CAUTION", color: "text-[#FFD166] bg-[#FFD166]/20 border-[#FFD166]/40" };
    return { label: "HOSTILE", color: "text-[#FF6B6B] bg-[#FF6B6B]/20 border-[#FF6B6B]/40" };
  }, [calculatedScore]);

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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-12 sm:space-y-16 relative z-10">
        <header className="border-b border-[rgba(153,246,228,0.2)] pb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#064E4A] border border-[rgba(153,246,228,0.3)] text-[#99F6E4]">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              PROTOCOL ARCHITECTURE // ROBINHOOD CHAIN 4663
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#042F2E] text-[#FFD166] border border-[#FFD166]/30">
              BAYESIAN DOSSIER.OS v2.4
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#FFFDF7]">
            Methodology &amp; Architecture
          </h1>
          <p className="text-sm sm:text-base text-[#A7F3D0] mt-3 leading-relaxed max-w-3xl font-normal">
            The mathematical models, delta detection triggers, graph formation algorithms, and terminology powering Scout Dossier.OS.
          </p>

          <nav aria-label="Page Sections" className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-[rgba(153,246,228,0.15)]">
            <a
              href="#pipeline"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              00 // Pipeline Stage
            </a>
            <a
              href="#workflow"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              01 // 4-Step Workflow
            </a>
            <a
              href="#delta-engine"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              02 // Delta Triggers
            </a>
            <a
              href="#graph-topology"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              03 // Graph Relational
            </a>
            <a
              href="#glossary-math"
              className="px-3 py-1.5 rounded-xl bg-[#064E4A] hover:bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-bold text-[#FFD166] hover:text-[#FFFDF7] transition-all"
            >
              04 // Glossary &amp; Formulas
            </a>
          </nav>
        </header>

        <section id="pipeline" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SYSTEM TOPOLOGY // END-TO-END DATAFLOW
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Architectural Execution Pipeline
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A7F3D0]">
              <span className="w-2 h-2 rounded-full bg-[#99F6E4]" />
              <span>SUB-100MS HYDRATION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3 relative overflow-hidden group hover:border-[#99F6E4]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#99F6E4]">STAGE 01</span>
                <IconCpu size={18} className="text-[#99F6E4]" />
              </div>
              <div className="font-bold text-sm text-[#FFFDF7]">MultiCall3 Batching</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Batches factory state, token bytecode, pool reserves, and DEX pricing in 1 RPC roundtrip.
              </p>
              <div className="text-[10px] font-mono text-[#99F6E4] pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#99F6E4]" />
                RPC Latency &lt; 85ms
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3 relative overflow-hidden group hover:border-[#FFD166]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#FFD166]">STAGE 02</span>
                <IconShield size={18} className="text-[#FFD166]" />
              </div>
              <div className="font-bold text-sm text-[#FFFDF7]">Bayesian Scoring</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Evaluates deployer origin wallet through Laplace smoothing, DOA velocity, and serial penalty clamps.
              </p>
              <div className="text-[10px] font-mono text-[#FFD166] pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]" />
                Alpha=1, Beta=2 Prior
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3 relative overflow-hidden group hover:border-[#FF9F43]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#FF9F43]">STAGE 03</span>
                <IconGraph size={18} className="text-[#FF9F43]" />
              </div>
              <div className="font-bold text-sm text-[#FFFDF7]">Constellation Graph</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Maps cross-token cluster connections via shared fee recipients, dev wallets, and creator histories.
              </p>
              <div className="text-[10px] font-mono text-[#FF9F43] pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F43]" />
                Sybil Ring Resolution
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-3 relative overflow-hidden group hover:border-[#C084FC]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#C084FC]">STAGE 04</span>
                <IconLock size={18} className="text-[#C084FC]" />
              </div>
              <div className="font-bold text-sm text-[#FFFDF7]">Immutable Case File</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Freezes thesis, snapshots, and metrics with cryptographic hash proofs and author attribution.
              </p>
              <div className="text-[10px] font-mono text-[#C084FC] pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
                Permanent SHA Digest
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 01 // OPERATIONAL FRAMEWORK
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                The 4-Step Intelligence Workflow
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-[#064E4A] p-1 rounded-xl border border-[rgba(153,246,228,0.2)]">
              {["01. Investigate", "02. Score", "03. Track", "04. Publish"].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => setActiveWorkflowTab(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeWorkflowTab === idx
                      ? "bg-[#FFD166] text-[#042F2E] shadow-sm"
                      : "text-[#A7F3D0] hover:text-[#FFFDF7] hover:bg-[#042F2E]"
                  }`}
                >
                  {label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div
              className={`rounded-3xl border transition-all p-6 sm:p-7 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 0
                  ? "border-[#99F6E4] bg-[#064E4A] ring-2 ring-[#99F6E4]/20 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#99F6E4] tracking-wider uppercase">
                    Step 01 // Bytecode &amp; DEX Audit
                  </div>
                  <h3 className="text-2xl font-black text-[#FFFDF7] mt-0.5">01. Investigate</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#042F2E] border border-[#99F6E4]/30 flex items-center justify-center text-[#99F6E4]">
                  <IconRadar size={22} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                When a contract address is inspected, Scout concurrently batches factory state, token metadata, liquidity balances, and DexScreener pricing pairs into a single roundtrip payload.
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-3.5 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#99F6E4] text-[10px] pb-1.5 border-b border-[rgba(153,246,228,0.15)]">
                  <span>MULTICALL3 EXECUTION // CALLLIST</span>
                  <span className="text-[#A7F3D0]">4663 RPC</span>
                </div>
                <div className="text-[#A7F3D0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>1. Factory.getPool(ca)</span>
                    <span className="text-[#99F6E4]">0x90a2...b41</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. ERC20.totalSupply()</span>
                    <span className="text-[#FFD166]">1,000,000,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. PonsV2.getReserves()</span>
                    <span className="text-[#99F6E4]">42.5 ETH</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border transition-all p-6 sm:p-7 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 1
                  ? "border-[#FFD166] bg-[#064E4A] ring-2 ring-[#FFD166]/20 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#FFD166] tracking-wider uppercase">
                    Step 02 // Bayesian Prior Model
                  </div>
                  <h3 className="text-2xl font-black text-[#FFFDF7] mt-0.5">02. Score</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#042F2E] border border-[#FFD166]/30 flex items-center justify-center text-[#FFD166]">
                  <IconShield size={22} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Deployer origin wallets are scored between 0–100 using Laplace-smoothed graduation rate, DOA penalties, burst rate dampeners, and hard serial penalty clamps.
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#FFD166] font-bold">INTERACTIVE SCORE SIMULATOR</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${scoreBand.color}`}>
                    {calculatedScore}/100 • {scoreBand.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#A7F3D0]">
                  <div>
                    <label className="block text-[9px] uppercase text-[#99F6E4]">Graduated: {simGraduated}</label>
                    <input
                      type="range"
                      min="0"
                      max={simTotal}
                      value={simGraduated}
                      onChange={(e) => setSimGraduated(Number(e.target.value))}
                      className="w-full accent-[#FFD166] h-1.5 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-[#99F6E4]">Total: {simTotal}</label>
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
                      className="w-full accent-[#FFD166] h-1.5 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-[#FF6B6B]">DOA Incidents: {simDoa}</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={simDoa}
                      onChange={(e) => setSimDoa(Number(e.target.value))}
                      className="w-full accent-[#FF6B6B] h-1.5 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-[#FF9F43]">Burst Velocity: {simBurst}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={simBurst}
                      onChange={(e) => setSimBurst(Number(e.target.value))}
                      className="w-full accent-[#FF9F43] h-1.5 bg-[#064E4A] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#A7F3D0] pt-1.5 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                  <span>Priors: α=1, β=2</span>
                  <span>Hard Clamp: N≥6 ∧ G=0 → Max 25</span>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border transition-all p-6 sm:p-7 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 2
                  ? "border-[#FF9F43] bg-[#064E4A] ring-2 ring-[#FF9F43]/20 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#FF9F43] tracking-wider uppercase">
                    Step 03 // State Delta Comparison
                  </div>
                  <h3 className="text-2xl font-black text-[#FFFDF7] mt-0.5">03. Track</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#042F2E] border border-[#FF9F43]/30 flex items-center justify-center text-[#FF9F43]">
                  <IconRepeat size={22} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Every inspection records a snapshot. When revisited, Scout computes granular metric differences (FDV jumps, liquidity shifts, git commits, fee recipient modifications).
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-3.5 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#FF9F43] text-[10px] pb-1.5 border-b border-[rgba(153,246,228,0.15)]">
                  <span>SNAPSHOT DELTA INSPECTOR</span>
                  <span className="text-[#A7F3D0]">Δt = 4h 12m</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-[#064E4A] border border-[rgba(153,246,228,0.15)]">
                    <span className="text-[#A7F3D0]">Market Cap Delta</span>
                    <div className="text-sm font-bold text-[#99F6E4] mt-0.5">+28.4% (Trigger)</div>
                  </div>
                  <div className="p-2 rounded bg-[#064E4A] border border-[rgba(153,246,228,0.15)]">
                    <span className="text-[#A7F3D0]">Curve Phase</span>
                    <div className="text-sm font-bold text-[#FFD166] mt-0.5">Curve → Graduated</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border transition-all p-6 sm:p-7 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 3
                  ? "border-[#C084FC] bg-[#064E4A] ring-2 ring-[#C084FC]/20 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#C084FC] tracking-wider uppercase">
                    Step 04 // Immutable Forensic Dossier
                  </div>
                  <h3 className="text-2xl font-black text-[#FFFDF7] mt-0.5">04. Publish</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#042F2E] border border-[#C084FC]/30 flex items-center justify-center text-[#C084FC]">
                  <IconLock size={22} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Researchers can freeze their thesis and findings into permanent shareable case files with creator attribution, fork capability, and instant revocation controls.
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-3.5 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#C084FC] text-[10px] pb-1.5 border-b border-[rgba(153,246,228,0.15)]">
                  <span>CRYPTOGRAPHIC SNAPSHOT PROOF</span>
                  <span className="text-[#A7F3D0]">IMMUTABLE</span>
                </div>
                <div className="text-[#A7F3D0] space-y-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span>Digest:</span>
                    <span className="text-[#C084FC] font-bold">0x7f2a...c89e</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Author Proof:</span>
                    <span className="text-[#99F6E4]">EIP-191 Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>State Lock:</span>
                    <span className="text-[#FFD166]">Read-Only / Forkable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="delta-engine" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 02 // REAL-TIME SURVEILLANCE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Since Last Check Delta Methodology
              </h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-xs font-mono text-[#99F6E4]">
              30 SNAPSHOT BUFFER / TOKEN
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            Scout maintains up to 30 historical snapshots per token. When you reopen a dossier, the snapshot comparison engine evaluates metric deltas against the following predefined sensitivity thresholds:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#99F6E4]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#99F6E4]">METRIC 01</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">VOLATILITY</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#99F6E4] uppercase tracking-wide">FDV Fluctuations</div>
                <div className="text-xl font-black mt-1 text-[#FFFDF7]">±20% Delta</div>
              </div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Triggers when Market Cap shifts up or down by 20% or more since previous visit.
              </p>
              <div className="text-[10px] font-mono text-[#99F6E4] pt-2 border-t border-[rgba(153,246,228,0.15)]">
                Formula: |FDV_t - FDV_0| / FDV_0 ≥ 0.20
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#99F6E4]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#99F6E4]">METRIC 02</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">LIQUIDITY</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#99F6E4] uppercase tracking-wide">Liquidity Shifts</div>
                <div className="text-xl font-black mt-1 text-[#FFFDF7]">±20% Delta</div>
              </div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Monitors pool drainage or sudden liquidity injection on DEX pairs.
              </p>
              <div className="text-[10px] font-mono text-[#99F6E4] pt-2 border-t border-[rgba(153,246,228,0.15)]">
                Formula: |Liq_t - Liq_0| / Liq_0 ≥ 0.20
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#FFD166]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#FFD166]">METRIC 03</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">MILESTONE</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#FFD166] uppercase tracking-wide">Phase Progression</div>
                <div className="text-xl font-black mt-1 text-[#FFFDF7]">Curve → Graduated</div>
              </div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Triggers instantly upon graduation migration or protocol fee sweep events.
              </p>
              <div className="text-[10px] font-mono text-[#FFD166] pt-2 border-t border-[rgba(153,246,228,0.15)]">
                Event: Phase_t != Phase_0 (Pons V2 → UniV3)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#FF6B6B]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#FF6B6B]">METRIC 04</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">FORENSIC</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#FF6B6B] uppercase tracking-wide">Fee Recipient Routing</div>
                <div className="text-xl font-black mt-1 text-[#FFFDF7]">Address Change</div>
              </div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Flags any modification in the recipient address receiving creator trading fees.
              </p>
              <div className="text-[10px] font-mono text-[#FF6B6B] pt-2 border-t border-[rgba(153,246,228,0.15)]">
                Condition: Recipient_addr_t != Recipient_addr_0
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#99F6E4]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#99F6E4]">METRIC 05</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">CODEBASE</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#99F6E4] uppercase tracking-wide">GitHub Activity</div>
                <div className="text-xl font-black mt-1 text-[#FFFDF7]">New Commit SHA</div>
              </div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Alerts researcher when fresh code is pushed to associated public repositories.
              </p>
              <div className="text-[10px] font-mono text-[#99F6E4] pt-2 border-t border-[rgba(153,246,228,0.15)]">
                Digest: Commit_SHA_t != Commit_SHA_0
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#FFD166]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#FFD166]">METRIC 06</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">CREATOR</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#FFD166] uppercase tracking-wide">Deployer Genesis</div>
                <div className="text-xl font-black mt-1 text-[#FFFDF7]">New Launch Event</div>
              </div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Notifies when creator wallet deploys a subsequent token elsewhere in the factory.
              </p>
              <div className="text-[10px] font-mono text-[#FFD166] pt-2 border-t border-[rgba(153,246,228,0.15)]">
                Delta: Total_Deployments_t &gt; Total_0
              </div>
            </div>
          </div>
        </section>

        <section id="graph-topology" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_12px_30px_-6px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 03 // MULTI-ENTITY SYBIL DETECTION
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Constellation Graph Relational Logic
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFD166]">
              <IconGraph size={16} />
              <span>CLUSTER MAPPER</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            The Constellation Engine maps multi-token clusters by analyzing cryptographic and behavioral links across the blockchain:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#99F6E4]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#99F6E4]">EDGE TYPE 01</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">DETERMINISTIC</span>
              </div>
              <div className="text-sm font-bold uppercase text-[#99F6E4]">01. Direct Deployer Link</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Edges connect all tokens deployed by the exact same origin Ethereum address, showing the creator&apos;s chronological timeline.
              </p>
              <div className="text-[10px] font-mono text-[#99F6E4] pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <span>E_origin(T_i, T_j)</span>
                <span>Weight = 1.0</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#FFD166]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#FFD166]">EDGE TYPE 02</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">SYBIL DETECTION</span>
              </div>
              <div className="text-sm font-bold uppercase text-[#FFD166]">02. Shared Fee Recipient</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Connects distinct deployer wallets that route their creator protocol fees to an identical destination address (Sybil cluster detection).
              </p>
              <div className="text-[10px] font-mono text-[#FFD166] pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <span>E_fee(D_a, D_b)</span>
                <span>Weight = 0.85</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-3 hover:border-[#C084FC]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E4A] text-[#C084FC]">EDGE TYPE 03</span>
                <span className="text-[10px] font-mono text-[#A7F3D0]">LIQUIDITY SOURCE</span>
              </div>
              <div className="text-sm font-bold uppercase text-[#C084FC]">03. Shared Dev Wallet</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Uncovers coordinated wallets funded by common upstream CEX or relayer liquidity sources.
              </p>
              <div className="text-[10px] font-mono text-[#C084FC] pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <span>E_funder(W_1, W_2)</span>
                <span>Weight = 0.70</span>
              </div>
            </div>
          </div>
        </section>

        <section id="glossary-math" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 04 // PROTOCOL TAXONOMY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFFDF7] tracking-tight">
                Section 04 // On-Chain Glossary
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item) => (
              <div
                key={item.term}
                className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] space-y-3 backdrop-blur-xl hover:border-[#99F6E4]/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#042F2E] text-[#99F6E4] border border-[rgba(153,246,228,0.2)]">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#A7F3D0] uppercase">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#FFFDF7] tracking-tight">
                    {item.term}
                  </h3>

                  {item.formula && (
                    <div className="p-2.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.15)] flex items-center justify-between text-xs font-mono text-[#FFD166]">
                      <span>{item.formula}</span>
                      <button
                        onClick={() => handleCopy(item.formula!, item.id)}
                        className="p-1 hover:text-[#FFFDF7] text-[#99F6E4] transition-colors"
                        title="Copy formula"
                      >
                        {copiedKey === item.id ? <IconCheck size={14} /> : <IconClipboard size={14} />}
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                    {item.definition}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(153,246,228,0.15)] text-[11px] text-[#99F6E4] font-mono flex items-center gap-1.5">
                  <span className="font-bold text-[#FFD166]">IMPLICATION:</span>
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
            <span>Read Technical Documentation</span>
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
