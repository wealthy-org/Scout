import React from "react";
import { Header } from "@/components/layout/Header";

export default function MapLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] flex flex-col font-sans relative overflow-hidden pb-16 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col space-y-6 relative z-10 animate-pulse">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div>
            <div className="h-8 w-52 bg-[#064E4A] rounded-full" />
            <div className="h-4 w-96 max-w-full bg-[#064E4A]/80 rounded-full mt-2" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-20 bg-[#064E4A] rounded-full" />
            <div className="h-7 w-20 bg-[#064E4A] rounded-full" />
          </div>
        </div>

        <div className="flex-1 min-h-[600px] w-full">
          <div className="w-full h-[650px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-4 sm:p-6 shadow-2xl relative flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-[rgba(153,246,228,0.2)] pb-3">
              <div className="h-4 w-36 bg-[#042F2E] rounded-full" />
              <div className="flex gap-3">
                <div className="h-4 w-28 bg-[#042F2E] rounded-full" />
                <div className="h-4 w-28 bg-[#042F2E] rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-center my-auto">
              <div className="h-10 w-64 bg-[#042F2E] rounded-2xl flex items-center justify-center" />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[rgba(153,246,228,0.2)]">
              <div className="h-4 w-44 bg-[#042F2E] rounded-full" />
              <div className="h-8 w-24 bg-[#042F2E] rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
