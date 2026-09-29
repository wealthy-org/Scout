import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function DeployerLoading() {
  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-[#14B8A6]/25 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader isAuthenticated={false} />

      <main className="flex-1 min-h-0 w-full max-w-[1600px] mx-auto p-3 sm:p-6 lg:p-8 flex flex-col overflow-hidden relative z-10 animate-pulse">
        <div className="w-full flex-1 min-h-0 flex flex-col rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] overflow-hidden shadow-[0_15px_35px_rgba(4,47,46,0.65)] backdrop-blur-2xl">
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[#064E4A] via-[#042F2E] to-[#042F2E] border-b border-[rgba(153,246,228,0.2)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-8">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="h-5 w-64 bg-[#0D746E] rounded-md" />
                <div className="flex items-center gap-2.5">
                  <div className="h-7 sm:h-8 w-72 sm:w-96 bg-[#064E4A] rounded-xl" />
                  <div className="h-7 w-16 bg-[#064E4A] rounded-lg" />
                </div>
                <div className="h-7 w-36 bg-[#064E4A] rounded-lg pt-1" />
              </div>

              <div className="h-9 w-36 bg-[#064E4A] rounded-lg shrink-0" />
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 overflow-hidden">
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4 rounded-xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A]/80 p-5 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-[#042F2E] rounded-full" />
                  <div className="h-6 w-24 bg-[#042F2E] rounded-full" />
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="h-14 w-28 bg-[#042F2E] rounded-2xl" />
                  <div className="h-6 w-16 bg-[#042F2E] rounded-lg" />
                </div>

                <div className="flex gap-1.5 h-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-[#042F2E]" />
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#042F2E] space-y-2">
                <div className="h-4 w-40 bg-[#064E4A] rounded-full" />
                <div className="h-3 w-full bg-[#064E4A]/70 rounded-full" />
                <div className="h-3 w-4/5 bg-[#064E4A]/70 rounded-full" />
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col space-y-4 min-h-0 overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-3 bg-[#064E4A]/80 border border-[rgba(153,246,228,0.2)] rounded-xl space-y-1.5">
                    <div className="h-3 w-20 bg-[#042F2E] rounded-full" />
                    <div className="h-6 w-14 bg-[#042F2E] rounded-lg" />
                    <div className="h-2.5 w-16 bg-[#042F2E]/60 rounded-full" />
                  </div>
                ))}
              </div>

              <div className="flex-1 min-h-0 bg-[#064E4A]/80 border border-[rgba(153,246,228,0.2)] rounded-xl overflow-hidden p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.15)] pb-2.5">
                  <div className="h-4 w-36 bg-[#042F2E] rounded-full" />
                  <div className="h-4 w-20 bg-[#042F2E] rounded-full" />
                </div>
                <div className="space-y-2.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-11 bg-[#042F2E] rounded-lg p-2.5 flex items-center justify-between">
                      <div className="h-4 w-48 bg-[#064E4A] rounded-md" />
                      <div className="h-4 w-20 bg-[#064E4A] rounded-md" />
                      <div className="h-5 w-16 bg-[#064E4A] rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
