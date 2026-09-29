import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={false} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10 animate-pulse">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6 space-y-2">
          <div className="h-8 w-56 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)]" />
          <div className="h-4 w-96 max-w-full rounded-md bg-[#042F2E] border border-[rgba(153,246,228,0.15)]" />
        </div>

        <div className="space-y-6 sm:space-y-8">
          <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-5">
            <div className="h-6 w-48 rounded-lg bg-[#042F2E] border border-[rgba(153,246,228,0.2)]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
                <div className="h-3 w-28 rounded bg-[#064E4A]" />
                <div className="h-4 w-48 rounded bg-[#064E4A]" />
              </div>
              <div className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2">
                <div className="h-3 w-28 rounded bg-[#064E4A]" />
                <div className="h-4 w-32 rounded bg-[#064E4A]" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="h-3 w-40 rounded bg-[#042F2E]" />
                <div className="h-10 w-full rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)]" />
                <div className="h-3 w-80 max-w-full rounded bg-[#042F2E]" />
              </div>

              <div className="h-9 w-32 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)]" />
            </div>
          </section>

          <section className="rounded-3xl border border-[#FF6B6B]/40 bg-[#064E4A] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-5">
            <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 space-y-1">
              <div className="h-5 w-32 rounded bg-[#042F2E] border border-[#FF6B6B]/30" />
              <div className="h-3 w-72 max-w-full rounded bg-[#042F2E]" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-44 rounded bg-[#042F2E]" />
                <div className="h-3.5 w-96 max-w-full rounded bg-[#042F2E]" />
              </div>

              <div className="h-10 w-36 rounded-xl bg-[#042F2E] border border-[#FF6B6B]/40 shrink-0" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
