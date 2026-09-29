import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#FFD166]/15 via-[#C084FC]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <GlobalHeader isAuthenticated={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 relative z-10 space-y-6 sm:space-y-8 animate-pulse">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.25)] pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-8 w-56 bg-[#064E4A] rounded-full" />
              <div className="h-6 w-36 bg-[#064E4A] rounded-full" />
            </div>
            <div className="h-4 w-96 max-w-full bg-[#064E4A]/80 rounded-full mt-2" />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-24 bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-xl" />
            <div className="h-9 w-28 bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl p-4 sm:p-5 bg-[#064E4A] border border-[rgba(153,246,228,0.25)] space-y-2 h-24 shadow-sm flex flex-col justify-between">
              <div className="h-3 w-20 bg-[#042F2E] rounded-full" />
              <div className="h-7 w-12 bg-[#042F2E] rounded-lg" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-3 sm:p-4 rounded-2xl shadow-md">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-8 w-20 bg-[#042F2E] rounded-full" />
            <div className="h-8 w-24 bg-[#042F2E] rounded-full" />
            <div className="h-8 w-28 bg-[#042F2E] rounded-full" />
            <div className="h-8 w-24 bg-[#042F2E] rounded-full" />
            <div className="h-8 w-20 bg-[#042F2E] rounded-full" />
          </div>
          <div className="h-9 w-full sm:w-72 bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between space-y-4 min-h-[290px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#042F2E]" />
                    <div className="h-5 w-20 bg-[#042F2E] rounded-full" />
                  </div>
                  <div className="h-5 w-20 bg-[#042F2E] rounded-full" />
                </div>

                <div className="space-y-1">
                  <div className="h-3 w-24 bg-[#042F2E] rounded-full" />
                  <div className="h-7 w-full bg-[#042F2E] rounded-lg" />
                </div>

                <div className="h-14 w-full bg-[#042F2E] rounded-2xl p-3" />
                <div className="h-3 w-32 bg-[#042F2E] rounded-full" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[rgba(153,246,228,0.2)]">
                <div className="h-4 w-24 bg-[#042F2E] rounded-full" />
                <div className="h-6 w-20 bg-[#042F2E] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
