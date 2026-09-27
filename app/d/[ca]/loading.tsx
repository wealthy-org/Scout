import React from "react";
import { Header } from "@/components/layout/Header";

export default function DossierDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10 animate-pulse">
        <div className="rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#042F2E]" />
              <div className="h-8 w-36 bg-[#042F2E] rounded-full" />
              <div className="h-6 w-24 bg-[#042F2E] rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-24 bg-[#042F2E] rounded-full" />
              <div className="h-9 w-32 bg-[#042F2E] rounded-full" />
            </div>
          </div>
          <div className="h-8 w-full max-w-lg bg-[#042F2E] rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-4 space-y-2 shadow-sm">
                  <div className="h-3 w-20 bg-[#042F2E] rounded-full" />
                  <div className="h-7 w-24 bg-[#042F2E] rounded-lg" />
                </div>
              ))}
            </div>

            <div className="h-80 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 shadow-md">
              <div className="h-4 w-44 bg-[#042F2E] rounded-full" />
              <div className="h-56 w-full bg-[#042F2E] rounded-2xl" />
            </div>

            <div className="h-96 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 shadow-md">
              <div className="h-4 w-56 bg-[#042F2E] rounded-full" />
              <div className="h-72 w-full bg-[#042F2E] rounded-2xl" />
            </div>

            <div className="h-56 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 shadow-md">
              <div className="h-4 w-40 bg-[#042F2E] rounded-full" />
              <div className="h-32 w-full bg-[#042F2E] rounded-2xl" />
            </div>

            <div className="h-96 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 shadow-md">
              <div className="h-4 w-52 bg-[#042F2E] rounded-full" />
              <div className="h-72 w-full bg-[#042F2E] rounded-2xl" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-64 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 shadow-md">
              <div className="h-4 w-36 bg-[#042F2E] rounded-full" />
              <div className="space-y-2">
                <div className="h-12 w-full bg-[#042F2E] rounded-xl" />
                <div className="h-12 w-full bg-[#042F2E] rounded-xl" />
                <div className="h-12 w-full bg-[#042F2E] rounded-xl" />
              </div>
            </div>

            <div className="h-[480px] rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 sm:p-6 space-y-4 shadow-md">
              <div className="h-4 w-40 bg-[#042F2E] rounded-full" />
              <div className="h-9 w-full bg-[#042F2E] rounded-xl" />
              <div className="h-24 w-full bg-[#042F2E] rounded-xl" />
              <div className="h-24 w-full bg-[#042F2E] rounded-xl" />
              <div className="h-10 w-full bg-[#042F2E] rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
