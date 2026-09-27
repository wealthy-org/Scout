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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10 sm:space-y-14 relative z-10">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div className="text-[10px] uppercase font-bold text-[#99F6E4] tracking-widest">
            Developer &amp; Researcher Documentation // v1.0
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FFFDF7] mt-1">
            Technical Documentation &amp; API Reference
          </h1>
          <p className="text-xs sm:text-sm text-[#A7F3D0] mt-2 leading-relaxed font-normal">
            Mathematical scoring algorithms, public endpoints, rate limits, data schemas, and integration guidelines.
          </p>
        </div>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">
              Section 01 // Deployer Score Formula
            </h2>
            <span className="text-xs font-semibold text-[#FFD166]">MATHEMATICAL SPEC</span>
          </div>

          <p className="text-xs sm:text-sm text-[#A7F3D0] leading-relaxed font-normal">
            Deployer reputation scores are deterministically calculated based on historical launch performance on Robinhood Chain:
          </p>

          <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] font-mono text-xs text-[#99F6E4] space-y-2">
            <div className="font-bold text-[#FFFDF7] font-sans">Score Formula Definition:</div>
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

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">
              Section 02 // Public API Reference
            </h2>
            <span className="text-xs font-semibold text-[#FFD166]">REST / JSON</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-[#99F6E4] text-[#042F2E] border-[1.5px] border-[#042F2E] font-bold text-xs rounded-md shadow-[2px_2px_0px_#042F2E]">
                GET
              </span>
              <span className="text-sm font-bold font-mono text-[#FFFDF7]">/api/deployer/:address</span>
            </div>
            <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
              Returns reputation score, 5 algorithmic signals, and up to 40 historical genesis launches for a deployer address.
            </p>
            <div className="p-3.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-mono text-[#99F6E4]">
              <div className="text-[10px] text-[#A7F3D0] uppercase mb-1 font-sans">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/deployer/0x89e2...89b2</code>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[rgba(153,246,228,0.2)]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-[#99F6E4] text-[#042F2E] border-[1.5px] border-[#042F2E] font-bold text-xs rounded-md shadow-[2px_2px_0px_#042F2E]">
                GET
              </span>
              <span className="text-sm font-bold font-mono text-[#FFFDF7]">/api/census</span>
            </div>
            <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
              Returns macro ecosystem metrics, repeat launcher share, score distribution, and top 20 creators on Robinhood Chain.
            </p>
            <div className="p-3.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-mono text-[#99F6E4]">
              <div className="text-[10px] text-[#A7F3D0] uppercase mb-1 font-sans">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/census</code>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[rgba(153,246,228,0.2)]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-[#99F6E4] text-[#042F2E] border-[1.5px] border-[#042F2E] font-bold text-xs rounded-md shadow-[2px_2px_0px_#042F2E]">
                GET
              </span>
              <span className="text-sm font-bold font-mono text-[#FFFDF7]">/api/p/:slug</span>
            </div>
            <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
              Retrieves a frozen, published case file snapshot by its public URL slug. Returns HTTP 410 if revoked by author.
            </p>
            <div className="p-3.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-xs font-mono text-[#99F6E4]">
              <div className="text-[10px] text-[#A7F3D0] uppercase mb-1 font-sans">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/p/scout-protocol-dossier-4b82f1</code>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF7] tracking-tight">
              Section 03 // Rate Limits &amp; System Constraints
            </h2>
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
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4">
            <h2 className="text-base font-bold uppercase text-[#FF6B6B] tracking-tight">
              Section 04 // On-Chain Risk Disclaimer
            </h2>
          </div>

          <p className="text-xs text-[#A7F3D0] leading-relaxed font-normal">
            Scout Dossier.OS is an open on-chain intelligence surveillance tool. Scores, metrics, and case files are computed algorithmically from public blockchain bytecode and RPC events. Nothing on this platform constitutes financial, investment, or legal advice. On-chain trading, bonding curves, and decentralized tokens carry extreme risks of total capital loss. Always perform independent verification before interacting with smart contracts.
          </p>
        </section>

        <div className="border-t border-[rgba(153,246,228,0.2)] pt-8 flex items-center justify-between text-xs">
          <Link href="/how" className="font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:underline">
            ← Explore Methodology &amp; Glossary
          </Link>
          <Link href="/feed" className="font-bold text-[#99F6E4] hover:text-[#FFFDF7] hover:underline">
            Browse Launch Feed →
          </Link>
        </div>
      </main>
    </div>
  );
}
