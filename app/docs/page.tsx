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
    // Session fallback
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-24">
      <GlobalHeader isAuthenticated={isAuthenticated} walletAddress={userAddress} />

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-12">
        <div className="border-b-2 border-border-primary pb-6">
          <div className="text-[10px] uppercase font-bold text-accent tracking-widest">
            Developer & Researcher Documentation // v1.0
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mt-1">
            Technical Documentation &amp; API Reference
          </h1>
          <p className="text-xs md:text-sm text-ink-secondary mt-2 leading-relaxed">
            Mathematical scoring algorithms, public endpoints, rate limits, data schemas, and integration guidelines.
          </p>
        </div>

        <section className="border-2 border-border-primary bg-bg-primary p-6 md:p-8 shadow-neo-md space-y-6">
          <div className="border-b-2 border-border-primary pb-3 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Section 01 // Deployer Score Formula
            </h2>
            <span className="text-xs font-bold text-accent">MATHEMATICAL SPEC</span>
          </div>

          <p className="text-xs text-ink-secondary leading-relaxed">
            Deployer reputation scores $S \in [0, 100]$ are deterministically calculated based on historical launch performance on Robinhood Chain:
          </p>

          <div className="p-4 bg-canvas border border-border-secondary font-mono text-xs space-y-2">
            <div className="font-bold text-accent">Score Formula Definition:</div>
            <div className="overflow-x-auto whitespace-pre">
              {`Base Score:  B = ((graduated + 1) / (total + 2)) * 100
Penalties:   P_doa = doa_rate * 25
             P_burst = burst_rate * 15
Raw Score:   S_raw = clamp(B - P_doa - P_burst, 0, 100)
Serial Cap:  If (total >= 6 AND graduated == 0) -> S = min(S_raw, 25)`}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-border-primary bg-bg-secondary text-left">
                  <th className="p-2.5 uppercase">Score Range</th>
                  <th className="p-2.5 uppercase">Band</th>
                  <th className="p-2.5 uppercase">Label</th>
                  <th className="p-2.5 uppercase">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-secondary">
                  <td className="p-2.5 font-bold">65 – 100</td>
                  <td className="p-2.5 text-status-success font-bold">GREEN</td>
                  <td className="p-2.5">Fresh / Repeat</td>
                  <td className="p-2.5 text-ink-secondary">High graduation velocity; minimal DOA/burst penalties.</td>
                </tr>
                <tr className="border-b border-border-secondary">
                  <td className="p-2.5 font-bold">35 – 64</td>
                  <td className="p-2.5 text-status-warning font-bold">YELLOW</td>
                  <td className="p-2.5">Fresh / Repeat</td>
                  <td className="p-2.5 text-ink-secondary">Average launch track record or unproven new deployer.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">0 – 34</td>
                  <td className="p-2.5 text-status-danger font-bold">RED</td>
                  <td className="p-2.5">Serial / Repeat</td>
                  <td className="p-2.5 text-ink-secondary">Serial launcher penalty or high frequency of rapid abandonments.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-6 md:p-8 shadow-neo-md space-y-8">
          <div className="border-b-2 border-border-primary pb-3 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Section 02 // Public API Reference
            </h2>
            <span className="text-xs font-bold text-accent">REST / JSON</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-status-success/20 border border-status-success text-status-success font-bold text-xs">
                GET
              </span>
              <span className="text-sm font-bold font-mono">/api/deployer/:address</span>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Returns reputation score, 5 algorithmic signals, and up to 40 historical genesis launches for a deployer address.
            </p>
            <div className="p-3 bg-canvas border border-border-secondary text-xs">
              <div className="text-[10px] text-ink-tertiary uppercase mb-1">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/deployer/0x89e2...89b2</code>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border-secondary">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-status-success/20 border border-status-success text-status-success font-bold text-xs">
                GET
              </span>
              <span className="text-sm font-bold font-mono">/api/census</span>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Returns macro ecosystem metrics, repeat launcher share, score distribution, and top 20 creators on Robinhood Chain.
            </p>
            <div className="p-3 bg-canvas border border-border-secondary text-xs">
              <div className="text-[10px] text-ink-tertiary uppercase mb-1">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/census</code>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border-secondary">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-status-success/20 border border-status-success text-status-success font-bold text-xs">
                GET
              </span>
              <span className="text-sm font-bold font-mono">/api/p/:slug</span>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Retrieves a frozen, published case file snapshot by its public URL slug. Returns HTTP 410 if revoked by author.
            </p>
            <div className="p-3 bg-canvas border border-border-secondary text-xs">
              <div className="text-[10px] text-ink-tertiary uppercase mb-1">Example Request</div>
              <code>curl -X GET https://scout.wealthypeople.org/api/p/scout-protocol-dossier-4b82f1</code>
            </div>
          </div>
        </section>

        <section className="border-2 border-border-primary bg-bg-primary p-6 md:p-8 shadow-neo-md space-y-6">
          <div className="border-b-2 border-border-primary pb-3">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Section 03 // Rate Limits &amp; System Constraints
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-border-primary bg-bg-secondary text-left">
                  <th className="p-2.5 uppercase">Resource / Action</th>
                  <th className="p-2.5 uppercase">Constraint Limit</th>
                  <th className="p-2.5 uppercase">Enforcement Behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-secondary">
                  <td className="p-2.5 font-bold">Public API Endpoints</td>
                  <td className="p-2.5">30 requests / minute / IP</td>
                  <td className="p-2.5 text-status-danger">HTTP 429 Too Many Requests (Retry-After)</td>
                </tr>
                <tr className="border-b border-border-secondary">
                  <td className="p-2.5 font-bold">User Watchlist Quota</td>
                  <td className="p-2.5">30 deployer addresses max</td>
                  <td className="p-2.5 text-status-danger">HTTP 422 Unprocessable Entity</td>
                </tr>
                <tr className="border-b border-border-secondary">
                  <td className="p-2.5 font-bold">Dossier Items Limit</td>
                  <td className="p-2.5">50 items max per section</td>
                  <td className="p-2.5 text-status-danger">Payload schema validation rejection</td>
                </tr>
                <tr className="border-b border-border-secondary">
                  <td className="p-2.5 font-bold">Research Thesis Length</td>
                  <td className="p-2.5">4,000 characters max</td>
                  <td className="p-2.5 text-status-danger">Zod schema string truncation / rejection</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Historical Snapshots</td>
                  <td className="p-2.5">30 snapshots retention limit</td>
                  <td className="p-2.5 text-ink-secondary">Automated FIFO rotation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-2 border-status-danger bg-bg-primary p-6 md:p-8 shadow-neo-md space-y-4">
          <div className="border-b border-border-secondary pb-3">
            <h2 className="text-base font-black uppercase text-status-danger">
              Section 04 // On-Chain Risk Disclaimer
            </h2>
          </div>

          <p className="text-xs text-ink-secondary leading-relaxed">
            Scout Dossier.OS is an open on-chain intelligence surveillance tool. Scores, metrics, and case files are computed algorithmically from public blockchain bytecode and RPC events. Nothing on this platform constitutes financial, investment, or legal advice. On-chain trading, bonding curves, and decentralized tokens carry extreme risks of total capital loss. Always perform independent verification before interacting with smart contracts.
          </p>
        </section>

        <div className="border-t-2 border-border-primary pt-8 flex items-center justify-between text-xs">
          <Link href="/how" className="font-bold text-accent hover:underline">
            ← Explore Methodology &amp; Glossary
          </Link>
          <Link href="/feed" className="font-bold text-accent hover:underline">
            Browse Launch Feed →
          </Link>
        </div>
      </main>
    </div>
  );
}
