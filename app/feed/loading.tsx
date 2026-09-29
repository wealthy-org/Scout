import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function FeedLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] flex flex-col font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-10 w-[700px] h-[400px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <GlobalHeader isAuthenticated={false} />

      <div className="w-full h-9 bg-[#042F2E] border-b border-[rgba(153,246,228,0.2)] animate-pulse" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-5 relative z-10 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-40 bg-[#064E4A] rounded-full" />
              <div className="h-6 w-24 bg-[#064E4A] rounded-full" />
            </div>
            <div className="h-3.5 w-80 max-w-full bg-[#064E4A]/80 rounded-full mt-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 font-sans select-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-[112px] shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-18 bg-[#042F2E] rounded-full" />
                <div className="h-3 w-3 bg-[#042F2E] rounded-full" />
              </div>
              <div className="h-6 w-16 bg-[#042F2E] rounded-lg" />
              <div className="h-2 w-20 bg-[#042F2E]/60 rounded-full" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-2xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-[rgba(153,246,228,0.15)] bg-[#042F2E]/70 p-3 sm:p-3.5 gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="h-7 w-24 bg-[#064E4A] rounded-full" />
                  <div className="h-7 w-28 bg-[#064E4A] rounded-full" />
                  <div className="h-7 w-32 bg-[#064E4A] rounded-full" />
                  <div className="h-7 w-32 bg-[#064E4A] rounded-full" />
                </div>
                <div className="h-7 w-full md:w-56 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-full" />
              </div>

              <div className="h-10 bg-[#042F2E]/90 border-b border-[rgba(153,246,228,0.15)]" />

              <div className="divide-y divide-[rgba(153,246,228,0.08)]">
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <div key={row} className="h-14 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#042F2E]" />
                      <div className="space-y-1">
                        <div className="h-3.5 w-16 bg-[#042F2E] rounded-full" />
                        <div className="h-2.5 w-14 bg-[#042F2E]/60 rounded-full" />
                      </div>
                    </div>
                    <div className="h-4 w-20 bg-[#042F2E] rounded-full" />
                    <div className="h-3.5 w-24 bg-[#042F2E] rounded-full" />
                    <div className="h-4 w-14 bg-[#042F2E] rounded-full" />
                    <div className="h-4 w-14 bg-[#042F2E] rounded-full" />
                    <div className="h-3.5 w-12 bg-[#042F2E] rounded-full" />
                    <div className="h-6 w-14 bg-[#042F2E] rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-lg">
              <div className="flex justify-between items-center border-b border-[rgba(153,246,228,0.2)] pb-2.5">
                <div className="h-3.5 w-24 bg-[#042F2E] rounded-full" />
                <div className="h-3.5 w-10 bg-[#042F2E] rounded-full" />
              </div>
              <div className="space-y-1.5">
                {[1, 2, 3].map((t) => (
                  <div key={t} className="h-11 bg-[#042F2E] rounded-xl p-2.5" />
                ))}
              </div>
            </div>

            <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-lg">
              <div className="flex justify-between items-center border-b border-[rgba(153,246,228,0.2)] pb-2.5">
                <div className="h-3.5 w-28 bg-[#042F2E] rounded-full" />
                <div className="h-3.5 w-10 bg-[#042F2E] rounded-full" />
              </div>
              <div className="space-y-1.5">
                {[1, 2].map((g) => (
                  <div key={g} className="h-11 bg-[#042F2E] rounded-xl p-2.5" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
