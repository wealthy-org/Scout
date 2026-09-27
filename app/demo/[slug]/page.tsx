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
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[120px] pointer-events-none -z-10" />

      <Header isAuthenticated={false} />

      <div className="bg-[#FFD166]/20 border-b border-[#FFD166]/30 text-[#FFD166] px-6 py-2.5 text-center text-xs font-bold uppercase tracking-wider backdrop-blur-md">
        ⚠️ [DEMO MODE] This is a static synthetic case file fixture for evaluation. No live RPC connections.
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#A7F3D0] uppercase tracking-wider">Demo Fixtures:</span>
            {DEMO_SLUGS.map((s) => (
              <Link
                key={s}
                href={`/demo/${s}`}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase border transition-all ${
                  s === slug
                    ? "bg-[#FFD166] text-[#042F2E] border-[1.5px] border-[#042F2E] shadow-[2px_2px_0px_#042F2E]"
                    : "bg-[#042F2E] border border-[rgba(153,246,228,0.2)] text-[#A7F3D0] hover:text-[#FFFDF7] hover:border-[#99F6E4]"
                }`}
              >
                {s}
              </Link>
            ))}
          </div>

          <Link
            href="/feed"
            className="px-4 py-1.5 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] text-xs font-bold text-[#FFFDF7] hover:bg-[#14B8A6]/30 transition-colors"
          >
            Launch Live Feed →
          </Link>
        </div>

        <section className="rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#FFFDF7]">{`$${dossier.symbol}`}</span>
              <span className="text-lg font-bold text-[#A7F3D0]">{dossier.name}</span>
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full border-[1.5px] border-[#042F2E] shadow-[2px_2px_0px_#042F2E] ${
                  dossier.status === "In position"
                    ? "bg-[#99F6E4] text-[#042F2E]"
                    : dossier.status === "Passed"
                    ? "bg-[#FF6B6B] text-[#042F2E]"
                    : "bg-[#FFD166] text-[#042F2E]"
                }`}
              >
                {dossier.status}
              </span>
            </div>

            <div className="text-xs text-[#A7F3D0] font-mono break-all bg-[#042F2E] px-3 py-1.5 rounded-xl border border-[rgba(153,246,228,0.2)]">
              CA: {dossier.contractAddress}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] uppercase font-bold text-[#A7F3D0] tracking-wider">Market Cap (FDV)</div>
              <div className="text-xl sm:text-2xl font-black text-[#FFFDF7] mt-1">
                {`$${dossier.snapshot.fdv_usd.toLocaleString()}`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] uppercase font-bold text-[#A7F3D0] tracking-wider">Liquidity Depth</div>
              <div className="text-xl sm:text-2xl font-black text-[#99F6E4] mt-1">
                {`$${dossier.snapshot.liquidity_usd.toLocaleString()}`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] uppercase font-bold text-[#A7F3D0] tracking-wider">Bonding Phase</div>
              <div className="text-xl sm:text-2xl font-black mt-1 uppercase text-[#FFD166]">
                {dossier.snapshot.pool_phase}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]">
              <div className="text-[10px] uppercase font-bold text-[#A7F3D0] tracking-wider">Deployer Score</div>
              <div className="text-xl sm:text-2xl font-black mt-1">
                <span
                  className={
                    dossier.deployerBand === "green"
                      ? "text-[#99F6E4]"
                      : dossier.deployerBand === "red"
                      ? "text-[#FF6B6B]"
                      : "text-[#FFD166]"
                  }
                >
                  {dossier.deployerScore}
                </span>
                <span className="text-xs font-bold text-[#A7F3D0]"> / 100</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
            <div className="text-xs font-bold uppercase text-[#99F6E4] tracking-wider">Research Thesis:</div>
            <p className="text-sm leading-relaxed text-[#FFFDF7] font-normal">
              {dossier.thesis}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] p-5 space-y-3">
              <div className="text-xs font-bold uppercase text-[#FFFDF7] border-b border-[rgba(153,246,228,0.2)] pb-2">
                Evidence &amp; Checkpoints ({dossier.items.length})
              </div>
              <div className="space-y-2">
                {dossier.items.map((it) => (
                  <div key={it.id} className="flex items-start gap-2 text-xs">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-[1.5px] border-[#042F2E] shrink-0 ${
                        it.kind === "pro"
                          ? "bg-[#99F6E4] text-[#042F2E]"
                          : it.kind === "con"
                          ? "bg-[#FF6B6B] text-[#042F2E]"
                          : it.kind === "checked"
                          ? "bg-[#FFD166] text-[#042F2E]"
                          : "bg-[#064E4A] text-[#FFFDF7]"
                      }`}
                    >
                      {it.kind}
                    </span>
                    <span className="text-[#FFFDF7] leading-tight">{it.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] p-5 space-y-3">
              <div className="text-xs font-bold uppercase text-[#FFFDF7] border-b border-[rgba(153,246,228,0.2)] pb-2">
                Deployer Intelligence
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[#A7F3D0]">Origin Wallet: </span>
                  <span className="font-bold text-[#FFFDF7] font-mono break-all">
                    {dossier.deployerAddress}
                  </span>
                </div>
                <div>
                  <span className="text-[#A7F3D0]">Reputation Label: </span>
                  <span className="font-bold uppercase text-[#99F6E4]">{dossier.deployerLabel}</span>
                </div>
                <div>
                  <span className="text-[#A7F3D0]">Risk Band: </span>
                  <span
                    className={`font-bold uppercase ${
                      dossier.deployerBand === "green"
                        ? "text-[#99F6E4]"
                        : dossier.deployerBand === "red"
                        ? "text-[#FF6B6B]"
                        : "text-[#FFD166]"
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
