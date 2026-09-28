import React from "react";
import { Header } from "@/components/layout/Header";

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="max-w-5xl lg:max-w-7xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-8 relative z-10 animate-pulse">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6 mb-6 sm:pb-8 sm:mb-8 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-56 bg-[#064E4A] rounded-full" />
            <div className="h-5 w-24 bg-[#042F2E] rounded-md" />
          </div>
          <div className="h-9 w-full max-w-lg bg-[#064E4A] rounded-xl" />
          <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <aside className="w-full lg:w-64 shrink-0 space-y-4">
            <div className="rounded-2xl lg:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 space-y-3.5 shadow-lg">
              <div className="h-4 w-32 bg-[#042F2E] rounded-md" />
              <div className="space-y-1.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-7 w-full bg-[#042F2E] rounded-lg" />
                ))}
              </div>
              <div className="pt-2 border-t border-[rgba(153,246,228,0.15)] space-y-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-full bg-[#042F2E] rounded-md" />
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-8 sm:space-y-12 w-full">
            <div className="rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-7 space-y-4 shadow-lg">
              <div className="h-6 w-52 bg-[#042F2E] rounded-md" />
              <div className="h-24 w-full bg-[#042F2E] rounded-xl" />
              <div className="h-28 w-full bg-[#042F2E] rounded-xl" />
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-7 space-y-4 shadow-lg">
              <div className="h-6 w-48 bg-[#042F2E] rounded-md" />
              <div className="h-40 w-full bg-[#042F2E] rounded-2xl" />
              <div className="h-32 w-full bg-[#042F2E] rounded-xl" />
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-7 space-y-4 shadow-lg">
              <div className="h-6 w-52 bg-[#042F2E] rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-36 bg-[#042F2E] rounded-xl" />
                <div className="h-36 bg-[#042F2E] rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-7 space-y-4 shadow-lg">
              <div className="h-6 w-64 bg-[#042F2E] rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-[#042F2E] rounded-xl" />
                ))}
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-7 space-y-4 shadow-lg">
              <div className="h-6 w-60 bg-[#042F2E] rounded-md" />
              <div className="h-32 w-full bg-[#042F2E] rounded-xl" />
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[#FF6B6B]/40 bg-[#064E4A] p-4 sm:p-7 space-y-3 shadow-lg">
              <div className="h-5 w-44 bg-[#042F2E] rounded-md" />
              <div className="h-16 w-full bg-[#042F2E] rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
