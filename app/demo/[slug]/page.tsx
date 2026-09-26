import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { getDemoDossier, DEMO_SLUGS } from "@/config/demo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dossier = getDemoDossier(slug);
  if (!dossier) return { title: "Demo Dossier Not Found | Scout" };

  return {
    title: `[DEMO] $${dossier.symbol} - ${dossier.name} | Scout`,
    description: `Synthetic demonstration case file for ${dossier.name} ($${dossier.symbol}) on Scout Dossier.OS.`,
  };
}

export default async function DemoDossierPage({ params }: PageProps) {
  const { slug } = await params;
  const dossier = getDemoDossier(slug);

  if (!dossier) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-24">
      <GlobalHeader isAuthenticated={false} />

      <div className="bg-accent text-accent-fg px-6 py-2 text-center text-xs font-black uppercase tracking-wider border-b-2 border-border-primary">
        ⚠️ [DEMO MODE] This is a static synthetic case file fixture for evaluation. No live RPC connections.
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border-primary pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink-secondary uppercase">Demo Fixtures:</span>
            {DEMO_SLUGS.map((s) => (
              <Link
                key={s}
                href={`/demo/${s}`}
                className={`text-xs px-3 py-1 font-bold uppercase border transition-colors ${
                  s === slug
                    ? "bg-accent text-accent-fg border-border-primary shadow-neo-xs"
                    : "bg-bg-primary border-border-secondary text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {s}
              </Link>
            ))}
          </div>

          <Link
            href="/feed"
            className="px-3 py-1 bg-bg-secondary border border-border-primary text-xs font-bold hover:bg-canvas transition-colors"
          >
            Launch Live Feed →
          </Link>
        </div>

        <section className="border-2 border-border-primary bg-bg-primary p-6 md:p-8 shadow-neo-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border-primary pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black">{`$${dossier.symbol}`}</span>
              <span className="text-lg font-bold text-ink-secondary">{dossier.name}</span>
              <span
                className={`text-xs font-extrabold uppercase px-2.5 py-0.5 border ${
                  dossier.status === "In position"
                    ? "bg-status-success/10 border-status-success text-status-success"
                    : dossier.status === "Passed"
                    ? "bg-status-danger/10 border-status-danger text-status-danger"
                    : "bg-status-warning/10 border-status-warning text-status-warning"
                }`}
              >
                {dossier.status}
              </span>
            </div>

            <div className="text-xs text-ink-tertiary font-mono break-all">
              CA: {dossier.contractAddress}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-canvas border border-border-secondary">
              <div className="text-[10px] uppercase font-bold text-ink-tertiary">Market Cap (FDV)</div>
              <div className="text-xl font-black mt-1">
                {`$${dossier.snapshot.fdv_usd.toLocaleString()}`}
              </div>
            </div>

            <div className="p-4 bg-canvas border border-border-secondary">
              <div className="text-[10px] uppercase font-bold text-ink-tertiary">Liquidity Depth</div>
              <div className="text-xl font-black mt-1">
                {`$${dossier.snapshot.liquidity_usd.toLocaleString()}`}
              </div>
            </div>

            <div className="p-4 bg-canvas border border-border-secondary">
              <div className="text-[10px] uppercase font-bold text-ink-tertiary">Bonding Phase</div>
              <div className="text-xl font-black mt-1 uppercase text-accent">
                {dossier.snapshot.pool_phase}
              </div>
            </div>

            <div className="p-4 bg-canvas border border-border-secondary">
              <div className="text-[10px] uppercase font-bold text-ink-tertiary">Deployer Score</div>
              <div className="text-xl font-black mt-1">
                <span
                  className={
                    dossier.deployerBand === "green"
                      ? "text-status-success"
                      : dossier.deployerBand === "red"
                      ? "text-status-danger"
                      : "text-status-warning"
                  }
                >
                  {dossier.deployerScore}
                </span>
                <span className="text-xs font-bold text-ink-tertiary"> / 100</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-canvas border-2 border-border-secondary space-y-2">
            <div className="text-xs font-bold uppercase text-accent">Research Thesis:</div>
            <p className="text-sm leading-relaxed text-ink-primary font-medium">
              {dossier.thesis}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border-secondary bg-canvas p-5 space-y-3">
              <div className="text-xs font-bold uppercase text-ink-primary border-b border-border-secondary pb-2">
                Evidence &amp; Checkpoints ({dossier.items.length})
              </div>
              <div className="space-y-2">
                {dossier.items.map((it) => (
                  <div key={it.id} className="flex items-start gap-2 text-xs">
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 border shrink-0 ${
                        it.kind === "pro"
                          ? "bg-status-success/20 border-status-success text-status-success"
                          : it.kind === "con"
                          ? "bg-status-danger/20 border-status-danger text-status-danger"
                          : it.kind === "checked"
                          ? "bg-accent/20 border-accent text-accent"
                          : "bg-bg-secondary border-border-primary text-ink-secondary"
                      }`}
                    >
                      {it.kind}
                    </span>
                    <span className="text-ink-secondary leading-tight">{it.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border-secondary bg-canvas p-5 space-y-3">
              <div className="text-xs font-bold uppercase text-ink-primary border-b border-border-secondary pb-2">
                Deployer Intelligence
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-ink-tertiary">Origin Wallet: </span>
                  <span className="font-bold text-ink-primary break-all">
                    {dossier.deployerAddress}
                  </span>
                </div>
                <div>
                  <span className="text-ink-tertiary">Reputation Label: </span>
                  <span className="font-bold uppercase text-accent">{dossier.deployerLabel}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary">Risk Band: </span>
                  <span
                    className={`font-bold uppercase ${
                      dossier.deployerBand === "green"
                        ? "text-status-success"
                        : dossier.deployerBand === "red"
                        ? "text-status-danger"
                        : "text-status-warning"
                    }`}
                  >
                    {dossier.deployerBand} BAND
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
