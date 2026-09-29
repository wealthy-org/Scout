import React from "react";

export default function PublicDossierLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-20 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[120px] pointer-events-none -z-10" />

      <header className="border-b border-[rgba(153,246,228,0.2)] bg-[#064E4A]/90 backdrop-blur-xl px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-lg animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-36 bg-[#042F2E] rounded-md" />
            <div className="h-5 w-28 bg-[#042F2E] rounded-full" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-28 bg-[#042F2E] rounded-xl" />
            <div className="h-8 w-28 bg-[#042F2E] rounded-xl" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 relative z-10 animate-pulse space-y-6 sm:space-y-8">
        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.15)] pb-5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-44 bg-[#042F2E] rounded-xl" />
                <div className="h-6 w-20 bg-[#042F2E] rounded-full" />
              </div>
              <div className="h-4 w-72 bg-[#042F2E]/80 rounded-full" />
            </div>
            <div className="h-6 w-32 bg-[#042F2E] rounded-full" />
          </div>

          <div className="space-y-4">
            <div className="h-5 w-32 bg-[#042F2E] rounded-md" />
            <div className="h-20 w-full bg-[#042F2E] rounded-2xl" />
          </div>

          <div className="space-y-4">
            <div className="h-5 w-40 bg-[#042F2E] rounded-md" />
            <div className="h-32 w-full bg-[#042F2E] rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
