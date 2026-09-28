import React from "react";
import { Header } from "@/components/layout/Header";

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-12 sm:space-y-16 relative z-10 animate-pulse">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-64 bg-[#064E4A] rounded-full" />
            <div className="h-6 w-36 bg-[#042F2E] rounded-md" />
          </div>
          <div className="h-10 w-full max-w-xl bg-[#064E4A] rounded-2xl" />
          <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full" />
          <div className="flex items-center gap-2 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-[#064E4A] rounded-xl" />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="h-6 w-60 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="h-28 w-full bg-[#042F2E] rounded-2xl" />
          <div className="h-28 w-full bg-[#042F2E] rounded-xl" />
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="h-6 w-56 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-28 bg-[#042F2E] rounded-xl" />
            ))}
          </div>
          <div className="h-64 w-full bg-[#042F2E] rounded-3xl" />
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="h-6 w-56 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-[#042F2E] rounded-2xl" />
            <div className="h-48 bg-[#042F2E] rounded-2xl" />
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="h-6 w-72 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#042F2E] space-y-2 h-32" />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="h-6 w-72 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="h-44 w-full bg-[#042F2E] rounded-2xl" />
        </div>

        <div className="rounded-3xl border border-[#FF6B6B]/40 bg-[#064E4A] p-6 sm:p-8 space-y-3 shadow-md h-36">
          <div className="h-5 w-52 bg-[#042F2E] rounded-full" />
          <div className="h-16 w-full bg-[#042F2E] rounded-xl" />
        </div>
      </main>
    </div>
  );
}
