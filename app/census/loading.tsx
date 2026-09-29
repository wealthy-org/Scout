import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function CensusLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <GlobalHeader isAuthenticated={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 relative z-10 animate-pulse">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-9 w-80 max-w-full bg-[#064E4A] rounded-full" />
              <div className="h-6 w-32 bg-[#064E4A] rounded-full" />
            </div>
            <div className="h-4 w-3/4 max-w-2xl bg-[#064E4A]/80 rounded-full" />
          </div>

          <div className="h-8 w-36 bg-[#064E4A] rounded-full shrink-0" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-3 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 bg-[#042F2E] rounded-full" />
                <div className="h-7 w-7 bg-[#042F2E] rounded-xl" />
              </div>
              <div className="space-y-1">
                <div className="h-9 w-24 bg-[#042F2E] rounded-lg" />
                <div className="h-3 w-36 bg-[#042F2E]/60 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-5 shadow-md h-72">
          <div className="flex justify-between items-center border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div className="space-y-1.5">
              <div className="h-6 w-64 bg-[#042F2E] rounded-full" />
              <div className="h-3 w-80 bg-[#042F2E]/70 rounded-full" />
            </div>
            <div className="h-6 w-36 bg-[#042F2E] rounded-full" />
          </div>
          <div className="h-40 w-full bg-[#042F2E] rounded-2xl" />
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-5 shadow-md h-96">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 space-y-1.5">
            <div className="h-6 w-52 bg-[#042F2E] rounded-full" />
            <div className="h-3 w-96 bg-[#042F2E]/70 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="h-10 w-full bg-[#042F2E] rounded-xl" />
            <div className="h-10 w-full bg-[#042F2E] rounded-xl" />
            <div className="h-10 w-full bg-[#042F2E] rounded-xl" />
            <div className="h-10 w-full bg-[#042F2E] rounded-xl" />
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="h-5 w-72 bg-[#042F2E] rounded-full border-b border-[rgba(153,246,228,0.2)] pb-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-[#042F2E] rounded-2xl p-4" />
            <div className="h-24 bg-[#042F2E] rounded-2xl p-4" />
            <div className="h-24 bg-[#042F2E] rounded-2xl p-4" />
          </div>
        </div>
      </main>
    </div>
  );
}
