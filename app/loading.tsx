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
              <div className="space-y-4">
                <div className="h-16 sm:h-20 w-full max-w-xl bg-[#064E4A] rounded-3xl" />
                <div className="h-6 w-full max-w-lg bg-[#064E4A]/80 rounded-full" />
              </div>

              <div className="max-w-xl h-16 rounded-2xl sm:rounded-full bg-[#064E4A] border-2 border-[#042F2E] p-2 flex items-center justify-between shadow-[4px_4px_0px_#042F2E]">
                <div className="h-5 w-48 bg-[#042F2E] rounded-full ml-4" />
                <div className="h-10 w-36 bg-[#042F2E] rounded-xl sm:rounded-full mr-1" />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="h-7 w-36 bg-[#064E4A] rounded-full border border-[rgba(153,246,228,0.2)]" />
                <div className="h-7 w-40 bg-[#064E4A] rounded-full border border-[rgba(153,246,228,0.2)]" />
                <div className="h-7 w-36 bg-[#064E4A] rounded-full border border-[rgba(153,246,228,0.2)]" />
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
              <div className="w-full max-w-[420px] aspect-square rounded-full bg-[#064E4A]/80 border-2 border-[#042F2E] relative flex items-center justify-center shadow-[6px_6px_0px_#042F2E]">
                <div className="w-44 h-44 rounded-full bg-[#042F2E]" />
                <div className="absolute -top-2 -left-2 h-9 w-44 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)]" />
                <div className="absolute top-1/2 -right-4 h-9 w-40 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)]" />
                <div className="absolute -bottom-4 -left-2 h-9 w-36 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl p-6 sm:p-8 bg-[#064E4A] border-2 border-[#042F2E] shadow-[8px_8px_0px_#042F2E] space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 w-full max-w-2xl">
              <div className="h-6 w-44 bg-[#042F2E] rounded-full" />
              <div className="h-9 w-3/4 bg-[#042F2E] rounded-xl" />
              <div className="h-4 w-full bg-[#042F2E] rounded-full" />
            </div>
            <div className="w-full lg:w-80 h-24 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] shrink-0" />
          </div>

          <div className="border-t-2 border-[#042F2E] pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-2">
                <div className="h-4 w-28 bg-[#064E4A] rounded-full" />
                <div className="h-8 w-24 bg-[#064E4A] rounded-lg" />
                <div className="h-3 w-full bg-[#064E4A]/80 rounded-full" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="h-6 w-36 bg-[#064E4A] rounded-full mx-auto" />
            <div className="h-10 w-full max-w-lg bg-[#064E4A] rounded-2xl mx-auto" />
            <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-[#064E4A]/75 border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] p-6 sm:p-7 min-h-[420px] sm:min-h-[450px] flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-6 w-32 bg-[#042F2E] rounded-full" />
                    <div className="h-6 w-28 bg-[#042F2E] rounded-lg" />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-8 w-3/4 bg-[#042F2E] rounded-xl" />
                    <div className="h-4 w-full bg-[#042F2E] rounded-full" />
                    <div className="h-4 w-5/6 bg-[#042F2E] rounded-full" />
                  </div>
                </div>
                <div className="pt-4 border-t border-[#042F2E]/60">
                  <div className="h-11 w-full bg-[#042F2E] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl sm:rounded-[36px] bg-[#064E4A] border-2 border-[#042F2E] shadow-[8px_8px_0px_#042F2E] p-6 sm:p-10 lg:p-12 space-y-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            <div className="space-y-6 max-w-xl text-left w-full">
              <div className="h-6 w-48 bg-[#042F2E] rounded-full" />
              <div className="h-12 w-3/4 bg-[#042F2E] rounded-xl" />
              <div className="h-4 w-full bg-[#042F2E] rounded-full" />
              <div className="h-4 w-5/6 bg-[#042F2E] rounded-full" />
              <div className="h-12 w-52 bg-[#042F2E] rounded-full pt-2" />
            </div>
            <div className="w-full max-w-[340px] sm:max-w-[420px] aspect-square rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t-2 border-[#042F2E]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#042F2E] p-4 sm:p-5 rounded-2xl border-2 border-[#042F2E] shadow-[4px_4px_0px_#042F2E] space-y-2">
                <div className="h-3 w-28 bg-[#064E4A] rounded-full" />
                <div className="h-8 w-36 bg-[#064E4A] rounded-lg" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="h-6 w-36 bg-[#064E4A] rounded-full mx-auto" />
            <div className="h-10 w-full max-w-lg bg-[#064E4A] rounded-2xl mx-auto" />
            <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] shadow-[6px_6px_0px_#042F2E] p-6 sm:p-7 flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-10 bg-[#042F2E] rounded-full" />
                  <div className="w-9 h-9 rounded-xl bg-[#042F2E]" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-24 bg-[#042F2E] rounded-lg" />
                  <div className="h-4 w-full bg-[#042F2E] rounded-full" />
                  <div className="h-4 w-3/4 bg-[#042F2E] rounded-full" />
                </div>
                <div className="pt-2">
                  <div className="h-5 w-28 bg-[#042F2E] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
