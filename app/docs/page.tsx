import type { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Technical Documentation & API Reference | Scout",
  description: "Mathematical specifications, REST API schemas, rate limits, and integration documentation for Scout Dossier.OS.",
};

export default async function DocsPage() {
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

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#00E599]/10 via-[#00F0FF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10 sm:space-y-14 relative z-10">
        <div className="border-b border-slate-800/80 pb-6">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">
            Developer &amp; Researcher Documentation // v1.0
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-1">
            Technical Documentation &amp; API Reference
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-normal">
            Mathematical scoring algorithms, public endpoints, rate limits, data schemas, and integration guidelines.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Section 01 // Deployer Score Formula
            </h2>
            <span className="text-xs font-semibold text-cyan-400">MATHEMATICAL SPEC</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Deployer reputation scores are deterministically calculated based on historical launch performance on Robinhood Chain:
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-cyan-300 space-y-2">
            <div className="font-bold text-white font-sans">Score Formula Definition:</div>
            <div className="overflow-x-auto whitespace-pre">
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
                <tr className="border-b border-slate-800 bg-slate-950/40 text-left text-slate-400 font-semibold uppercase">
                  <th className="p-3">Score Range</th>
                  <th className="p-3">Band</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">65 – 100</td>
                  <td className="p-3 text-emerald-400 font-bold">GREEN</td>
                  <td className="p-3">Fresh / Repeat</td>
                  <td className="p-3 text-slate-400">High graduation velocity; minimal DOA/burst penalties.</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">35 – 64</td>
                  <td className="p-3 text-amber-400 font-bold">YELLOW</td>
                  <td className="p-3">Fresh / Repeat</td>
                  <td className="p-3 text-slate-400">Average launch track record or unproven new deployer.</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">0 – 34</td>
                  <td className="p-3 text-rose-400 font-bold">RED</td>
                  <td className="p-3">Serial / Repeat</td>
                  <td className="p-3 text-slate-400">Serial launcher penalty or high frequency of rapid abandonments.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Section 02 // Public API Reference
            </h2>
            <span className="text-xs font-semibold text-cyan-400">REST / JSON</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-md">
                GET
              </span>
              <span className="text-sm font-bold font-mono text-white">/api/deployer/:address</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Returns reputation score, 5 algorithmic signals, and up to 40 historical genesis launches for a deployer address.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300">
              <div className="text-[10px] text-slate-500 uppercase mb-1 font-sans">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/deployer/0x89e2...89b2</code>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-md">
                GET
              </span>
              <span className="text-sm font-bold font-mono text-white">/api/census</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Returns macro ecosystem metrics, repeat launcher share, score distribution, and top 20 creators on Robinhood Chain.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300">
              <div className="text-[10px] text-slate-500 uppercase mb-1 font-sans">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/census</code>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-md">
                GET
              </span>
              <span className="text-sm font-bold font-mono text-white">/api/p/:slug</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Retrieves a frozen, published case file snapshot by its public URL slug. Returns HTTP 410 if revoked by author.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300">
              <div className="text-[10px] text-slate-500 uppercase mb-1 font-sans">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/p/scout-protocol-dossier-4b82f1</code>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Section 03 // Rate Limits &amp; System Constraints
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-left text-slate-400 font-semibold uppercase">
                  <th className="p-3">Resource / Action</th>
                  <th className="p-3">Constraint Limit</th>
                  <th className="p-3">Enforcement Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Public API Endpoints</td>
                  <td className="p-3">30 requests / minute / IP</td>
                  <td className="p-3 text-rose-400">HTTP 429 Too Many Requests (Retry-After)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">User Watchlist Quota</td>
                  <td className="p-3">30 deployer addresses max</td>
                  <td className="p-3 text-rose-400">HTTP 422 Unprocessable Entity</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Dossier Items Limit</td>
                  <td className="p-3">50 items max per section</td>
                  <td className="p-3 text-rose-400">Payload schema validation rejection</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Research Thesis Length</td>
                  <td className="p-3">4,000 characters max</td>
                  <td className="p-3 text-rose-400">Zod schema string truncation / rejection</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Historical Snapshots</td>
                  <td className="p-3">30 snapshots retention limit</td>
                  <td className="p-3 text-slate-400">Automated FIFO rotation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-base font-bold uppercase text-rose-400 tracking-tight">
              Section 04 // On-Chain Risk Disclaimer
            </h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Scout Dossier.OS is an open on-chain intelligence surveillance tool. Scores, metrics, and case files are computed algorithmically from public blockchain bytecode and RPC events. Nothing on this platform constitutes financial, investment, or legal advice. On-chain trading, bonding curves, and decentralized tokens carry extreme risks of total capital loss. Always perform independent verification before interacting with smart contracts.
          </p>
        </section>

        <div className="border-t border-slate-800 pt-8 flex items-center justify-between text-xs">
          <Link href="/how" className="font-bold text-cyan-400 hover:underline">
            ← Explore Methodology &amp; Glossary
          </Link>
          <Link href="/feed" className="font-bold text-cyan-400 hover:underline">
            Browse Launch Feed →
          </Link>
        </div>
      </main>
    </div>
  );
}
