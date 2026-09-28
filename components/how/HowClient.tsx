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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-20 sm:pb-28 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[850px] h-[550px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-r from-[#FFD166]/10 via-[#14B8A6]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-14 sm:space-y-20 relative z-10">
        <header className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 p-8 sm:p-12 shadow-[0_20px_50px_rgba(4,47,46,0.6)] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FFD166]/15 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#042F2E] border border-[rgba(153,246,228,0.35)] text-[#99F6E4] shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse" />
              RESEARCH FIELD MANUAL // METHODOLOGY & HEURISTICS
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-[rgba(153,246,228,0.2)]">
            <div className="p-3.5 rounded-2xl bg-[#042F2E]/80 border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] font-mono font-bold uppercase text-[#A7F3D0]">BAYESIAN CORE</div>
              <div className="text-base font-extrabold text-[#FFFDF7] mt-0.5">Laplace Smoothing</div>
              <div className="text-[11px] font-mono text-[#99F6E4] mt-1">α=1, β=2 Prior</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#042F2E]/80 border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] font-mono font-bold uppercase text-[#A7F3D0]">SURVEILLANCE</div>
              <div className="text-base font-extrabold text-[#FFFDF7] mt-0.5">Delta Triggers</div>
              <div className="text-[11px] font-mono text-[#FFD166] mt-1">6 Metric Watches</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#042F2E]/80 border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] font-mono font-bold uppercase text-[#A7F3D0]">TOPOLOGY</div>
              <div className="text-base font-extrabold text-[#FFFDF7] mt-0.5">Sybil Cluster Graph</div>
              <div className="text-[11px] font-mono text-[#FF9F43] mt-1">3 Edge Weights</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#042F2E]/80 border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] font-mono font-bold uppercase text-[#A7F3D0]">SPEED</div>
              <div className="text-base font-extrabold text-[#FFFDF7] mt-0.5">MultiCall3 Batch</div>
              <div className="text-[11px] font-mono text-[#C084FC] mt-1">&lt; 85ms RPC Latency</div>
            </div>
          </div>

          <nav aria-label="Page Sections" className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[rgba(153,246,228,0.15)]">
            <a
              href="#workflow"
              className="px-4 py-2 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] text-xs font-bold text-[#99F6E4] hover:text-[#FFFDF7] transition-all"
            >
              01 // 4-Step Intelligence Loop
            </a>
            <a
              href="#bayesian-math"
              className="px-4 py-2 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] text-xs font-bold text-[#FFD166] hover:text-[#FFFDF7] transition-all"
            >
              02 // Mathematical Core &amp; Simulator
            </a>
            <a
              href="#delta-engine"
              className="px-4 py-2 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] text-xs font-bold text-[#FF9F43] hover:text-[#FFFDF7] transition-all"
            >
              03 // Delta Surveillance Triggers
            </a>
            <a
              href="#graph-topology"
              className="px-4 py-2 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] text-xs font-bold text-[#C084FC] hover:text-[#FFFDF7] transition-all"
            >
              04 // Constellation Graph Relational
            </a>
            <a
              href="#glossary-math"
              className="px-4 py-2 rounded-xl bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.25)] text-xs font-bold text-[#FFFDF7] hover:text-[#FFD166] transition-all"
            >
              05 // Glossary &amp; Research Taxonomy
            </a>
          </nav>
        </header>
        <section id="workflow" className="space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99F6E4] font-bold">
                SECTION 01 // OPERATIONAL FRAMEWORK
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div
              className={`rounded-3xl border transition-all p-6 sm:p-8 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 0
                  ? "border-[#99F6E4] bg-[#064E4A] ring-2 ring-[#99F6E4]/25 shadow-[0_15px_35px_-5px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 hover:border-[#99F6E4]/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#99F6E4] tracking-wider uppercase">
                    Step 01 // Bytecode &amp; Liquidity Audit
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] mt-0.5">01. Investigate</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#042F2E] border border-[#99F6E4]/40 flex items-center justify-center text-[#99F6E4] shadow-inner">
                  <IconRadar size={24} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                When a token contract address is inspected, Scout concurrently batches factory state, token metadata, liquidity balances, and DexScreener pricing pairs into a single atomic payload.
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-4 space-y-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#99F6E4] text-[10px] pb-2 border-b border-[rgba(153,246,228,0.15)]">
                  <span>MULTICALL3 BATCH RUNNER // RPC ENGINE</span>
                  <span className="text-[#A7F3D0]">4663 RPC</span>
                </div>
                <div className="text-[#A7F3D0] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>1. Factory.getPool(ca)</span>
                    <span className="text-[#99F6E4] font-semibold">0x90a2...b41</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. ERC20.totalSupply()</span>
                    <span className="text-[#FFD166] font-semibold">1,000,000,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. PonsV2.getReserves()</span>
                    <span className="text-[#99F6E4] font-semibold">42.5 ETH</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border transition-all p-6 sm:p-8 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 1
                  ? "border-[#FFD166] bg-[#064E4A] ring-2 ring-[#FFD166]/25 shadow-[0_15px_35px_-5px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 hover:border-[#FFD166]/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#FFD166] tracking-wider uppercase">
                    Step 02 // Bayesian Probability Model
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] mt-0.5">02. Score</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#042F2E] border border-[#FFD166]/40 flex items-center justify-center text-[#FFD166] shadow-inner">
                  <IconShield size={24} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Deployer origin wallets are scored between 0–100 using Laplace-smoothed graduation rates, DOA penalties, burst rate dampeners, and hard serial penalty clamps.
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-4 space-y-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#FFD166] text-[10px] pb-2 border-b border-[rgba(153,246,228,0.15)]">
                  <span>BAYESIAN WEIGHT MATRIX</span>
                  <span className="text-[#A7F3D0]">ALPHA=1, BETA=2</span>
                </div>
                <div className="text-[#A7F3D0] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Base Formula:</span>
                    <span className="text-[#FFD166]">((k + 1) / (n + 2)) × 100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DOA Deduction:</span>
                    <span className="text-[#FF6B6B]">-8 pts / event</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Serial Rugger Clamp:</span>
                    <span className="text-[#FF6B6B]">Max 25 if n≥6 ∧ k=0</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border transition-all p-6 sm:p-8 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 2
                  ? "border-[#FF9F43] bg-[#064E4A] ring-2 ring-[#FF9F43]/25 shadow-[0_15px_35px_-5px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 hover:border-[#FF9F43]/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#FF9F43] tracking-wider uppercase">
                    Step 03 // State Delta Comparison
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] mt-0.5">03. Track</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#042F2E] border border-[#FF9F43]/40 flex items-center justify-center text-[#FF9F43] shadow-inner">
                  <IconRepeat size={24} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Every inspection records a snapshot. When revisited, Scout computes granular metric differences (FDV jumps, liquidity shifts, git commits, fee recipient modifications).
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-4 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#FF9F43] text-[10px] pb-2 border-b border-[rgba(153,246,228,0.15)]">
                  <span>SNAPSHOT DELTA COMPARATOR</span>
                  <span className="text-[#A7F3D0]">Δt = 4h 12m</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2.5 rounded-xl bg-[#064E4A] border border-[rgba(153,246,228,0.15)]">
                    <span className="text-[#A7F3D0]">Market Cap Delta</span>
                    <div className="text-sm font-bold text-[#99F6E4] mt-0.5">+28.4% (Alert)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#064E4A] border border-[rgba(153,246,228,0.15)]">
                    <span className="text-[#A7F3D0]">Curve Phase</span>
                    <div className="text-sm font-bold text-[#FFD166] mt-0.5">Graduated UniV3</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border transition-all p-6 sm:p-8 space-y-4 backdrop-blur-xl ${
                activeWorkflowTab === 3
                  ? "border-[#C084FC] bg-[#064E4A] ring-2 ring-[#C084FC]/25 shadow-[0_15px_35px_-5px_rgba(4,47,46,0.8)]"
                  : "border-[rgba(153,246,228,0.25)] bg-[#064E4A]/90 hover:border-[#C084FC]/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#C084FC] tracking-wider uppercase">
                    Step 04 // Immutable Forensic Dossier
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] mt-0.5">04. Publish</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#042F2E] border border-[#C084FC]/40 flex items-center justify-center text-[#C084FC] shadow-inner">
                  <IconLock size={24} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Researchers can freeze their thesis and findings into permanent shareable case files with creator attribution, fork capability, and instant revocation controls.
              </p>

              <div className="rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] p-4 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#C084FC] text-[10px] pb-2 border-b border-[rgba(153,246,228,0.15)]">
                  <span>CRYPTOGRAPHIC SNAPSHOT PROOF</span>
                  <span className="text-[#A7F3D0]">IMMUTABLE</span>
                </div>
                <div className="text-[#A7F3D0] space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span>Digest Hash:</span>
                    <span className="text-[#C084FC] font-bold font-mono">0x7f2a...c89e</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Author Proof:</span>
                    <span className="text-[#99F6E4]">EIP-191 Personal Sign</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>State Access:</span>
                    <span className="text-[#FFD166]">Read-Only / Forkable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="bayesian-math" className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-10 shadow-[0_20px_50px_rgba(4,47,46,0.6)] backdrop-blur-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD166] font-bold">
                MATHEMATICAL ENGINE // REPUTATION FORMULATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight mt-1">
                Bayesian Scoring &amp; Live Sandbox
              </h2>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.3)] text-xs font-mono text-[#FFD166]">
              INTERACTIVE SIMULATOR
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-[#FFFDF7] tracking-tight">Mathematical Formulation</h3>
              <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
                Scout rejects simplistic percentage graduation rates, which grant a 100% score to deployers with just 1 lucky token. Instead, we compute a <strong>Laplace Smoothed Bayesian Prior</strong> with penalization factors:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-1">
                  <div className="text-[10px] text-[#99F6E4] uppercase font-bold">1. Base Laplace Score</div>
                  <div className="text-[#FFD166] text-sm font-bold">S_base = ((k + 1) / (n + 2)) × 100</div>
                  <div className="text-[11px] text-[#A7F3D0]">Where k = Graduated Count, n = Total Genesis Launches.</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-1">
                  <div className="text-[10px] text-[#FF6B6B] uppercase font-bold">2. Dead on Arrival (DOA) Penalty</div>
                  <div className="text-[#FF6B6B] text-sm font-bold">P_doa = min(8 × d, 30)</div>
                  <div className="text-[11px] text-[#A7F3D0]">Docks 8 points per abandoned launch within 10 minutes of genesis.</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-1">
                  <div className="text-[10px] text-[#FF9F43] uppercase font-bold">3. Rapid-Fire Burst Velocity Penalty</div>
                  <div className="text-[#FF9F43] text-sm font-bold">P_burst = min((b / 100) × 15, 20)</div>
                  <div className="text-[11px] text-[#A7F3D0]">Penalizes creator wallets deploying multiple tokens within 30 minutes.</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-1">
                  <div className="text-[10px] text-[#C084FC] uppercase font-bold">4. Serial Rugger Quarantine Clamp</div>
                  <div className="text-[#C084FC] text-sm font-bold">If (n ≥ 6 ∧ k == 0) → S_final ≤ 25</div>
                  <div className="text-[11px] text-[#A7F3D0]">Hard mathematical ceiling locking repeat zero-grad creators in Hostile Band.</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] space-y-5 flex flex-col justify-between shadow-inner">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-3">
                  <span className="text-xs font-mono font-bold text-[#FFD166] uppercase">Real-Time Parameter Simulator</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold border ${scoreBand.color}`}>
                    {scoreBand.label}
                  </span>
                </div>

                <div className="text-center py-4 bg-[#064E4A]/80 rounded-2xl border border-[rgba(153,246,228,0.2)]">
                  <div className="text-5xl sm:text-6xl font-black text-[#FFFDF7] tracking-tight">{calculatedScore}</div>
                  <div className="text-xs font-mono text-[#A7F3D0] mt-1">CALCULATED REPUTATION SCORE / 100</div>
                  <p className="text-xs text-[#99F6E4] mt-2 px-4 font-medium">{scoreBand.desc}</p>
                </div>

                <div className="space-y-3 font-mono text-xs">
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

              <div className="pt-3 border-t border-[rgba(153,246,228,0.15)] text-[10px] font-mono text-[#A7F3D0] flex items-center justify-between">
                <span>Model: Laplace Prior</span>
                <span>Bounds: Clamped [0, 100]</span>
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
