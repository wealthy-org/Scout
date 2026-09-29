import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-20 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <GlobalHeader isAuthenticated={false} />

      <main className="max-w-7xl 2xl:max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-10 relative z-10 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-8 2xl:gap-10 items-start">
          <aside className="w-full lg:w-56 xl:w-60 2xl:w-64 shrink-0 space-y-4 pb-6">
            <div className="h-5 w-32 bg-[#064E4A] rounded-md hidden lg:block" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((g) => (
                <div key={g} className="space-y-2">
                  <div className="h-3.5 w-24 bg-[#042F2E] rounded" />
                  <div className="space-y-1">
                    <div className="h-6 w-full bg-[#064E4A]/80 rounded-md" />
                    <div className="h-6 w-5/6 bg-[#064E4A]/60 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0 w-full space-y-12">
            <div className="space-y-3 pb-6 border-b border-[rgba(153,246,228,0.2)]">
              <div className="h-4 w-40 bg-[#064E4A] rounded" />
              <div className="h-10 w-3/4 max-w-md bg-[#042F2E] rounded-xl" />
              <div className="h-5 w-full bg-[#064E4A]/70 rounded-md" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-28 bg-[#042F2E] rounded-full" />
                <div className="h-6 w-24 bg-[#042F2E] rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-7 w-48 bg-[#042F2E] rounded-md" />
              <div className="h-16 w-full bg-[#064E4A]/60 rounded-xl" />
              <div className="h-20 w-full bg-[#042F2E] rounded-xl" />
            </div>

            <div className="space-y-4">
              <div className="h-7 w-56 bg-[#042F2E] rounded-md" />
              <div className="h-28 w-full bg-[#042F2E] rounded-xl" />
              <div className="h-40 w-full bg-[#064E4A]/60 rounded-xl" />
            </div>

            <div className="space-y-4">
              <div className="h-7 w-52 bg-[#042F2E] rounded-md" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-24 bg-[#042F2E] rounded-lg" />
                ))}
              </div>
              <div className="h-32 w-full bg-[#042F2E] rounded-xl" />
            </div>

            <div className="space-y-4">
              <div className="h-7 w-48 bg-[#042F2E] rounded-md" />
              <div className="h-24 w-full bg-[#042F2E] rounded-xl" />
            </div>
          </div>

          <aside className="hidden xl:block w-44 2xl:w-48 shrink-0 space-y-3 p-4 rounded-2xl bg-[#064E4A] mr-1">
            <div className="h-4 w-28 bg-[#042F2E] rounded" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 w-32 bg-[#064E4A]/60 rounded" />
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
