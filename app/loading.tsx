import React from "react";
import { Header } from "@/components/layout/Header";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 space-y-16 sm:space-y-24 animate-pulse relative z-10">
        <section className="pt-6 sm:pt-10 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              <div className="h-8 w-80 max-w-full bg-[#064E4A] rounded-full" />

              <div className="space-y-4">
                <div className="h-16 sm:h-20 w-full max-w-xl bg-[#064E4A] rounded-3xl" />
                <div className="h-6 w-full max-w-lg bg-[#064E4A]/80 rounded-full" />
              </div>

              <div className="max-w-xl h-16 rounded-2xl sm:rounded-full bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-2 flex items-center justify-between">
                <div className="h-5 w-48 bg-[#042F2E] rounded-full ml-4" />
                <div className="h-10 w-36 bg-[#042F2E] rounded-xl sm:rounded-full mr-1" />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="h-7 w-36 bg-[#064E4A] rounded-full" />
                <div className="h-7 w-40 bg-[#064E4A] rounded-full" />
                <div className="h-7 w-36 bg-[#064E4A] rounded-full" />
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
              <div className="w-full max-w-[420px] aspect-square rounded-full bg-[#064E4A] border border-[rgba(153,246,228,0.25)] relative flex items-center justify-center">
                <div className="w-44 h-44 rounded-full bg-[#042F2E]" />
                <div className="absolute -top-2 -left-2 h-8 w-44 rounded-2xl bg-[#042F2E]" />
                <div className="absolute -bottom-4 -right-2 h-24 w-56 rounded-3xl bg-[#042F2E]" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl p-6 sm:p-8 bg-[#064E4A] border border-[rgba(153,246,228,0.25)] h-44 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 w-full max-w-xl">
            <div className="h-6 w-44 bg-[#042F2E] rounded-full" />
            <div className="h-8 w-3/4 bg-[#042F2E] rounded-lg" />
            <div className="h-4 w-full bg-[#042F2E] rounded-full" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#042F2E] shrink-0" />
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-[#042F2E] rounded-full" />
                <div className="w-8 h-8 rounded-xl bg-[#042F2E]" />
              </div>
              <div className="h-10 w-28 bg-[#042F2E] rounded-lg" />
              <div className="h-3 w-full bg-[#042F2E] rounded-full" />
            </div>
          ))}
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="h-6 w-36 bg-[#064E4A] rounded-full mx-auto" />
            <div className="h-10 w-full max-w-lg bg-[#064E4A] rounded-2xl mx-auto" />
            <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[36px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-7 sm:p-8 min-h-[480px] sm:min-h-[520px] flex flex-col justify-end space-y-3">
                <div className="h-7 w-3/4 bg-[#042F2E] rounded-lg" />
                <div className="h-4 w-full bg-[#042F2E] rounded-full" />
                <div className="h-4 w-2/3 bg-[#042F2E] rounded-full" />
                <div className="h-4 w-32 bg-[#042F2E] rounded-full pt-2" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] sm:rounded-[44px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-8 sm:p-12 min-h-[420px] flex flex-col justify-between">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="h-10 w-3/4 bg-[#042F2E] rounded-xl" />
              <div className="h-4 w-full bg-[#042F2E] rounded-full" />
              <div className="h-4 w-5/6 bg-[#042F2E] rounded-full" />
              <div className="h-12 w-52 bg-[#042F2E] rounded-full pt-2" />
            </div>
            <div className="w-72 h-72 rounded-3xl bg-[#042F2E] shrink-0 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-[rgba(153,246,228,0.2)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-28 bg-[#042F2E] rounded-full" />
                <div className="h-8 w-36 bg-[#042F2E] rounded-lg" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
