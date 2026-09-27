import React from "react";
import { Header } from "@/components/layout/Header";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 space-y-10 sm:space-y-16 relative z-10 animate-pulse">
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="h-6 w-48 bg-[#064E4A] rounded-full mx-auto" />
          <div className="h-12 w-full max-w-xl bg-[#064E4A] rounded-2xl mx-auto" />
          <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full mx-auto" />
          <div className="h-14 w-full max-w-xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-2xl mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 space-y-3">
              <div className="h-4 w-24 bg-[#042F2E] rounded-full" />
              <div className="h-8 w-20 bg-[#042F2E] rounded-lg" />
            </div>
          ))}
        </div>

        <div className="h-72 rounded-3xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-6 space-y-4">
          <div className="h-6 w-48 bg-[#042F2E] rounded-full" />
          <div className="h-24 bg-[#042F2E] rounded-xl" />
        </div>
      </main>
    </div>
  );
}
