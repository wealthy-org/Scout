import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function DossierDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <GlobalHeader isAuthenticated={false} />

      <main className="max-w-[1520px] mx-auto p-3 sm:p-5 lg:p-6 relative z-10 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <aside className="w-full lg:w-[360px] xl:w-[390px] shrink-0 space-y-4">
            <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/80 p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#042F2E]" />
                  <div className="space-y-1">
                    <div className="h-5 w-24 bg-[#042F2E] rounded-md" />
                    <div className="h-3 w-32 bg-[#042F2E]/70 rounded-md" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-[#042F2E] rounded-full" />
              </div>
              <div className="h-8 w-full bg-[#042F2E] rounded-xl" />
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/80 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-3">
                <div className="h-4 w-28 bg-[#042F2E] rounded-full" />
                <div className="h-4 w-16 bg-[#042F2E] rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-[#042F2E] rounded-full" />
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-[#042F2E] rounded-full" />
                  <div className="h-3 w-12 bg-[#042F2E] rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-2.5 bg-[#042F2E] rounded-xl space-y-1.5">
                    <div className="h-2.5 w-16 bg-[#064E4A] rounded-full" />
                    <div className="h-5 w-20 bg-[#064E4A] rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A]/80 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-3">
                <div className="h-4 w-32 bg-[#042F2E] rounded-full" />
                <div className="h-6 w-20 bg-[#042F2E] rounded-lg" />
              </div>
              <div className="space-y-3">
                <div className="h-16 w-full bg-[#042F2E] rounded-xl" />
                <div className="h-24 w-full bg-[#042F2E] rounded-xl" />
                <div className="h-10 w-full bg-[#042F2E] rounded-xl" />
              </div>
            </div>
          </aside>

          <section className="flex-1 min-w-0 w-full space-y-5">
            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <div className="h-4 w-40 bg-[#064E4A] rounded-full" />
                <div className="h-3 w-48 bg-[#064E4A] rounded-full" />
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="h-72 w-full bg-[#042F2E] rounded-xl" />
                <div className="h-24 w-full bg-[#042F2E] rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <div className="h-4 w-48 bg-[#064E4A] rounded-full" />
                <div className="h-3 w-40 bg-[#064E4A] rounded-full" />
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="h-64 w-full bg-[#042F2E] rounded-xl" />
                <div className="h-48 w-full bg-[#042F2E] rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="bg-[#042F2E] px-4 py-2.5 border-b border-[rgba(153,246,228,0.15)] flex items-center justify-between">
                <div className="h-4 w-52 bg-[#064E4A] rounded-full" />
                <div className="h-3 w-36 bg-[#064E4A] rounded-full" />
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="h-32 w-full bg-[#042F2E] rounded-xl" />
                <div className="h-64 w-full bg-[#042F2E] rounded-xl" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
