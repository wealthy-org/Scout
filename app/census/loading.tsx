import React from "react";
import { Header } from "@/components/layout/Header";

export default function CensusLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8 relative z-10 animate-pulse">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-5 space-y-2">
          <div className="h-8 w-80 max-w-full bg-[#064E4A] rounded-full" />
          <div className="h-4 w-96 max-w-full bg-[#064E4A]/80 rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-4 sm:p-5 space-y-2 shadow-sm">
              <div className="h-3 w-28 bg-[#042F2E] rounded-full" />
              <div className="h-8 w-20 bg-[#042F2E] rounded-lg" />
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-7 space-y-4 shadow-md h-64">
          <div className="flex justify-between items-center border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div className="space-y-1">
              <div className="h-5 w-48 bg-[#042F2E] rounded-full" />
              <div className="h-3 w-64 bg-[#042F2E] rounded-full" />
            </div>
            <div className="h-4 w-28 bg-[#042F2E] rounded-full" />
          </div>
          <div className="h-32 w-full bg-[#042F2E] rounded-2xl" />
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-7 space-y-4 shadow-md h-80">
          <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 space-y-1">
            <div className="h-5 w-40 bg-[#042F2E] rounded-full" />
            <div className="h-3 w-72 bg-[#042F2E] rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="h-8 w-full bg-[#042F2E] rounded-xl" />
            <div className="h-8 w-full bg-[#042F2E] rounded-xl" />
            <div className="h-8 w-full bg-[#042F2E] rounded-xl" />
            <div className="h-8 w-full bg-[#042F2E] rounded-xl" />
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-7 space-y-2 shadow-sm h-28">
          <div className="h-4 w-32 bg-[#042F2E] rounded-full" />
          <div className="h-3 w-full bg-[#042F2E] rounded-full" />
          <div className="h-3 w-3/4 bg-[#042F2E] rounded-full" />
        </div>
      </main>
    </div>
  );
}
