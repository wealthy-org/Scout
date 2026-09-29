import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function HowLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-20 selection:bg-[#FFD166] selection:text-[#042F2E] overflow-x-hidden">
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <GlobalHeader isAuthenticated={false} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-12 sm:space-y-16 relative z-10 animate-pulse">
        {/* 1. HERO SKELETON */}
        <header className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl w-full">
              <div className="flex gap-2">
                <div className="h-6 w-48 bg-[#042F2E] rounded-xl" />
                <div className="h-6 w-28 bg-[#042F2E] rounded-xl" />
              </div>
              <div className="h-10 sm:h-12 w-3/4 bg-[#042F2E] rounded-2xl" />
              <div className="h-4 w-full bg-[#042F2E]/70 rounded-md" />
              <div className="h-4 w-5/6 bg-[#042F2E]/50 rounded-md" />
              <div className="flex flex-wrap gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-7 w-24 bg-[#042F2E] rounded-xl" />
                ))}
              </div>
            </div>

            {/* Avionics Block Skeleton */}
            <div className="lg:w-80 shrink-0 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-4 space-y-3">
              <div className="flex justify-between border-b border-[#064E4A] pb-2">
                <div className="h-4 w-28 bg-[#064E4A] rounded" />
                <div className="h-4 w-20 bg-[#064E4A] rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#064E4A] p-2.5 rounded-xl space-y-1.5">
                    <div className="h-2.5 w-16 bg-[#042F2E] rounded" />
                    <div className="h-4 w-20 bg-[#042F2E] rounded" />
                    <div className="h-1.5 w-full bg-[#042F2E] rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* 2. SECTION 01: WORKFLOW SKELETON */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b-2 border-[#042F2E] pb-3">
            <div className="space-y-1.5">
              <div className="h-3 w-36 bg-[#064E4A] rounded" />
              <div className="h-7 w-64 bg-[#042F2E] rounded-xl" />
            </div>
            <div className="h-6 w-32 bg-[#042F2E] rounded-xl" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#064E4A] border-2 border-[#042F2E] space-y-2">
                <div className="h-7 w-7 bg-[#042F2E] rounded-xl" />
                <div className="h-4 w-24 bg-[#042F2E] rounded" />
                <div className="h-3 w-32 bg-[#042F2E]/60 rounded" />
              </div>
            ))}
          </div>

          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6 space-y-4">
                <div className="h-6 w-24 bg-[#042F2E] rounded-xl" />
                <div className="h-7 w-3/4 bg-[#042F2E] rounded-xl" />
                <div className="h-12 w-full bg-[#042F2E]/60 rounded-xl" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-[#042F2E] rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-6 bg-[#031E1D] border-2 border-[#042F2E] rounded-2xl p-4 h-52 space-y-3">
                <div className="h-4 w-40 bg-[#042F2E] rounded" />
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 w-full bg-[#042F2E]/70 rounded" />
                  <div className="h-3 w-5/6 bg-[#042F2E]/50 rounded" />
                  <div className="h-3 w-4/6 bg-[#042F2E]/40 rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION 02: BAYESIAN MATH SKELETON */}
        <section className="rounded-3xl border-2 border-[#042F2E] bg-[#064E4A] p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E] space-y-8">
          <div className="flex justify-between items-center border-b-2 border-[#042F2E] pb-4">
            <div className="space-y-1.5">
              <div className="h-3 w-44 bg-[#042F2E] rounded" />
              <div className="h-7 w-72 bg-[#042F2E] rounded-xl" />
            </div>
            <div className="h-7 w-20 bg-[#042F2E] rounded-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 4 Formulas Drafting Table */}
            <div className="lg:col-span-7 bg-[#042F2E] rounded-3xl border-2 border-[#042F2E] p-5 sm:p-6 space-y-5">
              <div className="flex justify-between border-b border-[#064E4A] pb-2">
                <div className="h-4 w-40 bg-[#064E4A] rounded" />
                <div className="h-4 w-24 bg-[#064E4A] rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#064E4A] p-4 rounded-2xl border-2 border-[#042F2E] space-y-2 h-28">
                    <div className="h-3 w-28 bg-[#042F2E] rounded" />
                    <div className="h-5 w-36 bg-[#042F2E] rounded-md" />
                    <div className="h-3 w-full bg-[#042F2E]/60 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-10 bg-[#031E1D] rounded-2xl" />
            </div>

            {/* Right Simulator Console */}
            <div className="lg:col-span-5 bg-[#042F2E] rounded-3xl border-2 border-[#042F2E] p-5 sm:p-6 space-y-5">
              <div className="flex justify-between border-b border-[#064E4A] pb-2">
                <div className="h-4 w-36 bg-[#064E4A] rounded" />
                <div className="h-4 w-28 bg-[#064E4A] rounded" />
              </div>
              <div className="h-28 bg-[#064E4A] rounded-2xl" />
              <div className="grid grid-cols-2 gap-3.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-[#064E4A] rounded-xl" />
                ))}
              </div>
              <div className="h-4 w-full bg-[#064E4A]/70 rounded pt-3 border-t border-[#064E4A]" />
            </div>
          </div>
        </section>

        {/* 4. SECTION 03: DELTA TELEMETRY MONITOR SKELETON */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b-2 border-[#042F2E] pb-3">
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-[#064E4A] rounded" />
              <div className="h-7 w-72 bg-[#042F2E] rounded-xl" />
            </div>
            <div className="h-6 w-36 bg-[#042F2E] rounded-xl" />
          </div>

          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#042F2E] space-y-5">
            <div className="h-4 w-52 bg-[#042F2E] rounded" />
            <div className="h-64 bg-[#042F2E] rounded-2xl" />
            <div className="h-16 bg-[#042F2E] rounded-2xl" />
          </div>
        </section>

        {/* 5. SECTION 04: CONSTELLATION TOPOLOGY SKELETON */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b-2 border-[#042F2E] pb-3">
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-[#064E4A] rounded" />
              <div className="h-7 w-64 bg-[#042F2E] rounded-xl" />
            </div>
            <div className="h-6 w-32 bg-[#042F2E] rounded-xl" />
          </div>

          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#042F2E] grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#042F2E] border-2 border-[#042F2E] space-y-2 h-24" />
              ))}
            </div>
            <div className="lg:col-span-6 bg-[#031E1D] border-2 border-[#042F2E] rounded-2xl p-5 h-72" />
          </div>
        </section>

        {/* 6. SECTION 05: GLOSSARY CODEX TWO-PANE SKELETON */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b-2 border-[#042F2E] pb-3">
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-[#064E4A] rounded" />
              <div className="h-7 w-72 bg-[#042F2E] rounded-xl" />
            </div>
            <div className="h-6 w-32 bg-[#042F2E] rounded-xl" />
          </div>

          <div className="bg-[#064E4A] border-2 border-[#042F2E] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#042F2E] space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="h-11 flex-1 bg-[#042F2E] rounded-2xl" />
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-11 w-20 bg-[#042F2E] rounded-xl" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Pane Index Skeleton */}
              <div className="lg:col-span-5 space-y-2 bg-[#042F2E] p-3 rounded-2xl border-2 border-[#042F2E]">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-12 bg-[#064E4A] rounded-xl" />
                ))}
              </div>

              {/* Right Pane Dossier Sheet Skeleton */}
              <div className="lg:col-span-7 bg-[#042F2E] border-2 border-[#042F2E] rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex justify-between items-start border-b-2 border-[#064E4A] pb-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="h-5 w-20 bg-[#064E4A] rounded-lg" />
                      <div className="h-5 w-24 bg-[#064E4A] rounded-md" />
                    </div>
                    <div className="h-8 w-56 bg-[#064E4A] rounded-xl" />
                  </div>
                  <div className="h-6 w-28 bg-[#064E4A] rounded-xl" />
                </div>

                <div className="h-28 bg-[#031E1D] rounded-2xl" />
                <div className="h-20 bg-[#064E4A] rounded-2xl" />
                <div className="h-16 bg-[#064E4A] rounded-2xl" />
                <div className="h-8 w-3/4 bg-[#064E4A] rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* 7. FOOTER SKELETON */}
        <footer className="pt-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="h-12 w-56 bg-[#064E4A] rounded-2xl" />
          <div className="h-12 w-56 bg-[#FFD166] rounded-2xl" />
        </footer>
      </main>
    </div>
  );
}
