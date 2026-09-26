import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#00E599]/15 via-[#00F0FF]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <Header isAuthenticated={false} />

      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 text-amber-300 px-6 py-2.5 text-center text-xs font-bold uppercase tracking-wider backdrop-blur-md">
        ⚠️ [DEMO MODE] This is a static synthetic case file fixture for evaluation. No live RPC connections.
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo Fixtures:</span>
            {DEMO_SLUGS.map((s) => (
              <Link
                key={s}
                href={`/demo/${s}`}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase border transition-all ${
                  s === slug
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                    : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {s}
              </Link>
            ))}
          </div>

          <Link
            href="/feed"
            className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
          >
            Launch Live Feed →
          </Link>
        </div>

        <section className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-white">{`$${dossier.symbol}`}</span>
              <span className="text-lg font-bold text-slate-400">{dossier.name}</span>
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                  dossier.status === "In position"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : dossier.status === "Passed"
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                    : "bg-amber-500/10 border-amber-500/40 text-amber-400"
                }`}
              >
                {dossier.status}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono break-all bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
              CA: {dossier.contractAddress}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Market Cap (FDV)</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {`$${dossier.snapshot.fdv_usd.toLocaleString()}`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Liquidity Depth</div>
              <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
                {`$${dossier.snapshot.liquidity_usd.toLocaleString()}`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bonding Phase</div>
              <div className="text-xl sm:text-2xl font-black mt-1 uppercase text-emerald-400">
                {dossier.snapshot.pool_phase}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deployer Score</div>
              <div className="text-xl sm:text-2xl font-black mt-1">
                <span
                  className={
                    dossier.deployerBand === "green"
                      ? "text-emerald-400"
                      : dossier.deployerBand === "red"
                      ? "text-rose-400"
                      : "text-amber-400"
                  }
                >
                  {dossier.deployerScore}
                </span>
                <span className="text-xs font-bold text-slate-500"> / 100</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-xs font-bold uppercase text-cyan-400 tracking-wider">Research Thesis:</div>
            <p className="text-sm leading-relaxed text-slate-300 font-normal">
              {dossier.thesis}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-300 border-b border-slate-800 pb-2">
                Evidence &amp; Checkpoints ({dossier.items.length})
              </div>
              <div className="space-y-2">
                {dossier.items.map((it) => (
                  <div key={it.id} className="flex items-start gap-2 text-xs">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                        it.kind === "pro"
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : it.kind === "con"
                          ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                          : it.kind === "checked"
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                          : "bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      {it.kind}
                    </span>
                    <span className="text-slate-300 leading-tight">{it.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-300 border-b border-slate-800 pb-2">
                Deployer Intelligence
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400">Origin Wallet: </span>
                  <span className="font-bold text-white font-mono break-all">
                    {dossier.deployerAddress}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Reputation Label: </span>
                  <span className="font-bold uppercase text-cyan-400">{dossier.deployerLabel}</span>
                </div>
                <div>
                  <span className="text-slate-400">Risk Band: </span>
                  <span
                    className={`font-bold uppercase ${
                      dossier.deployerBand === "green"
                        ? "text-emerald-400"
                        : dossier.deployerBand === "red"
                        ? "text-rose-400"
                        : "text-amber-400"
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
