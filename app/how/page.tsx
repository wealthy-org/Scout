import type { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { getSession } from "@/lib/auth/session";

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

  const glossaryItems = [
    {
      term: "Bonding Curve",
      definition:
        "An algorithmic smart contract mechanism (Pons V2) that determines token price dynamically as tokens are purchased or sold along a deterministic mathematical curve before DEX graduation.",
    },
    {
      term: "Graduated Phase",
      definition:
        "The milestone reached when 100% of a token's bonding curve threshold is reached, migrating liquidity and unlocking automated Uniswap V3 liquidity pool creation.",
    },
    {
      term: "Swept Phase",
      definition:
        "State where fee recipient or factory treasury has swept collected bonding curve protocol fees into designated recipient addresses.",
    },
    {
      term: "Laplace Smoothing",
      definition:
        "Bayesian probability technique defined as (Graduated + 1) / (Total + 2), preventing artificial 100% perfection scores on small sample sizes (e.g. 1/1 launches).",
    },
    {
      term: "Dead on Arrival (DOA)",
      definition:
        "A token launch whose trading volume halts or loses >95% value within 10 minutes of genesis. High DOA frequency heavily penalizes creator score.",
    },
    {
      term: "Burst Rate",
      definition:
        "The proportion of genesis deployments initiated within 30 minutes of a previous token by the same deployer, signaling automated token spam or rapid-fire rug activity.",
    },
    {
      term: "Serial Penalty Cap",
      definition:
        "A strict mathematical ceiling clamping deployer reputation to a maximum of 25 (Red Band) whenever total launches >= 6 and graduated count equals 0.",
    },
    {
      term: "Sign-In with Ethereum (SIWE)",
      definition:
        "EIP-4361 standard cryptographic authentication proving private key ownership via an EIP-191 personal sign message, establishing encrypted stateless sessions without passwords.",
    },
    {
      term: "MultiCall3 Aggregation",
      definition:
        "Batching up to 50 smart contract read operations into a single RPC JSON-RPC payload to achieve sub-100ms dossier hydration while avoiding RPC rate limit throttling.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10 sm:space-y-14 relative z-10">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div className="text-[10px] uppercase font-bold text-[#99F6E4] tracking-widest">
            Intelligence Systems // Protocol Specifications
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FFFDF7] mt-1">
            Methodology &amp; Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[#A7F3D0] mt-2 leading-relaxed font-normal">
            The mathematical models, delta detection triggers, graph formation algorithms, and terminology powering Scout Dossier.OS.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight flex items-center gap-2 border-b border-[rgba(153,246,228,0.2)] pb-3">
            <span className="text-[#99F6E4]">Section 01 //</span>
            <span>The 4-Step Intelligence Workflow</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl space-y-2">
              <div className="text-2xl font-black text-[#99F6E4]">01. Investigate</div>
              <h3 className="text-sm font-bold text-[#FFFDF7] uppercase tracking-tight">MultiCall3 Bytecode &amp; On-Chain Audit</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                When a contract address is inspected, Scout concurrently batches factory state, token metadata, liquidity balances, and DexScreener pricing pairs into a single roundtrip payload.
              </p>
            </div>

            <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl space-y-2">
              <div className="text-2xl font-black text-[#FFD166]">02. Score</div>
              <h3 className="text-sm font-bold text-[#FFFDF7] uppercase tracking-tight">Bayesian Deployer Reputation</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Deployer origin wallets are scored between 0–100 using Laplace-smoothed graduation rate, DOA penalties, burst rate dampeners, and hard serial penalty clamps.
              </p>
            </div>

            <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl space-y-2">
              <div className="text-2xl font-black text-[#FF9F43]">03. Track</div>
              <h3 className="text-sm font-bold text-[#FFFDF7] uppercase tracking-tight">Since Last Check Delta Engine</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Every inspection records a snapshot. When revisited, Scout computes granular metric differences (FDV jumps, liquidity shifts, git commits, fee recipient modifications).
              </p>
            </div>

            <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl space-y-2">
              <div className="text-2xl font-black text-[#C084FC]">04. Publish</div>
              <h3 className="text-sm font-bold text-[#FFFDF7] uppercase tracking-tight">Immutable Case File Snapshots</h3>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Researchers can freeze their thesis and findings into permanent shareable case files with creator attribution, fork capability, and instant revocation controls.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight flex items-center gap-2 border-b border-[rgba(153,246,228,0.2)] pb-3">
            <span className="text-[#99F6E4]">Section 02 //</span>
            <span>Since Last Check Delta Methodology</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            Scout maintains up to 30 historical snapshots per token. When you reopen a dossier, the snapshot comparison engine evaluates metric deltas against the following predefined sensitivity thresholds:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-xs font-bold text-[#99F6E4] uppercase">FDV Fluctuations</div>
              <div className="text-xl font-black mt-1 text-[#FFFDF7]">±20% Delta</div>
              <p className="text-[11px] text-[#A7F3D0] mt-1 font-normal">
                Triggers when Market Cap shifts up or down by 20% or more since previous visit.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-xs font-bold text-[#99F6E4] uppercase">Liquidity Shifts</div>
              <div className="text-xl font-black mt-1 text-[#FFFDF7]">±20% Delta</div>
              <p className="text-[11px] text-[#A7F3D0] mt-1 font-normal">
                Monitors pool drainage or sudden liquidity injection on DEX pairs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-xs font-bold text-[#99F6E4] uppercase">Phase Progression</div>
              <div className="text-xl font-black mt-1 text-[#FFFDF7]">Curve → Graduated</div>
              <p className="text-[11px] text-[#A7F3D0] mt-1 font-normal">
                Triggers instantly upon graduation migration or protocol fee sweep events.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-xs font-bold text-[#99F6E4] uppercase">Fee Recipient Routing</div>
              <div className="text-xl font-black mt-1 text-[#FFFDF7]">Address Change</div>
              <p className="text-[11px] text-[#A7F3D0] mt-1 font-normal">
                Flags any modification in the recipient address receiving creator trading fees.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-xs font-bold text-[#99F6E4] uppercase">GitHub Activity</div>
              <div className="text-xl font-black mt-1 text-[#FFFDF7]">New Commit SHA</div>
              <p className="text-[11px] text-[#A7F3D0] mt-1 font-normal">
                Alerts researcher when fresh code is pushed to associated public repositories.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-xs font-bold text-[#99F6E4] uppercase">Deployer Genesis</div>
              <div className="text-xl font-black mt-1 text-[#FFFDF7]">New Launch Event</div>
              <p className="text-[11px] text-[#A7F3D0] mt-1 font-normal">
                Notifies when creator wallet deploys a subsequent token elsewhere in the factory.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight flex items-center gap-2 border-b border-[rgba(153,246,228,0.2)] pb-3">
            <span className="text-[#99F6E4]">Section 03 //</span>
            <span>Constellation Graph Relational Logic</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            The Constellation Engine maps multi-token clusters by analyzing cryptographic and behavioral links across the blockchain:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
              <div className="text-xs font-bold uppercase text-[#99F6E4]">01. Direct Deployer Link</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Edges connect all tokens deployed by the exact same origin Ethereum address, showing the creator&apos;s chronological timeline.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
              <div className="text-xs font-bold uppercase text-[#99F6E4]">02. Shared Fee Recipient</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Connects distinct deployer wallets that route their creator protocol fees to an identical destination address (Sybil cluster detection).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
              <div className="text-xs font-bold uppercase text-[#99F6E4]">03. Shared Dev Wallet</div>
              <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
                Uncovers coordinated wallets funded by common upstream CEX or relayer liquidity sources.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">
              Section 04 // On-Chain Glossary
            </h2>
            <span className="text-xs font-semibold text-[#A7F3D0]">PRD REFERENCE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {glossaryItems.map((item) => (
              <div
                key={item.term}
                className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] space-y-2 backdrop-blur-xl"
              >
                <div className="text-sm font-bold uppercase text-[#99F6E4]">{item.term}</div>
                <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">{item.definition}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-[rgba(153,246,228,0.2)] pt-8 flex items-center justify-between text-xs">
          <Link href="/docs" className="font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:underline">
            ← Read Technical Documentation
          </Link>
          <Link href="/census" className="font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:underline">
            Explore Ecosystem Census →
          </Link>
        </div>
      </main>
    </div>
  );
}
