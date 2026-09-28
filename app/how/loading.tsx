import React from "react";
import { Header } from "@/components/layout/Header";

export default function HowLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[750px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="max-w-5xl lg:max-w-6xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-10 space-y-10 sm:space-y-16 relative z-10 animate-pulse">
        <div className="border-b border-[rgba(153,246,228,0.25)] pb-6 sm:pb-8 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-52 bg-[#064E4A] rounded-full" />
            <div className="h-5 w-28 bg-[#042F2E] rounded-md" />
          </div>
          <div className="h-9 w-full max-w-lg bg-[#064E4A] rounded-xl" />
          <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-[#042F2E] rounded-xl" />
            ))}
          </div>
        </div>

        <section className="space-y-6">
          <div className="h-6 w-64 bg-[#064E4A] rounded-md" />
          <div className="relative pl-9 sm:pl-12 space-y-6">
            <div className="absolute left-3.5 sm:left-4 top-3 bottom-3 w-[2px] bg-[#064E4A]" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative space-y-2">
                <div className="absolute -left-9 sm:-left-12 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#042F2E]" />
                <div className="h-5 w-56 bg-[#042F2E] rounded-md" />
                <div className="h-10 w-full bg-[#042F2E]/60 rounded-xl" />
                <div className="h-14 w-full bg-[#042F2E] rounded-xl" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-7 space-y-5 shadow-xl">
          <div className="h-6 w-72 bg-[#042F2E] rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-7 bg-[#042F2E] rounded-2xl p-4 space-y-3">
              <div className="h-4 w-40 bg-[#064E4A] rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-[#064E4A] rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 bg-[#042F2E] rounded-2xl p-4 space-y-3">
              <div className="h-4 w-36 bg-[#064E4A] rounded-md" />
              <div className="h-20 bg-[#064E4A] rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-[#064E4A] rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="h-6 w-64 bg-[#064E4A] rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#042F2E] space-y-2 h-28" />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="h-6 w-60 bg-[#064E4A] rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#042F2E] space-y-2 h-28" />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="h-6 w-52 bg-[#064E4A] rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#064E4A] space-y-2 h-32" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
