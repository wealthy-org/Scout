import React from "react";
import { Header } from "@/components/layout/Header";

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24 selection:bg-[#FFD166] selection:text-[#042F2E]">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10 sm:space-y-14 relative z-10 animate-pulse">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-6 space-y-2">
          <div className="h-3 w-48 bg-[#064E4A] rounded-full" />
          <div className="h-10 w-full max-w-xl bg-[#064E4A] rounded-2xl" />
          <div className="h-4 w-3/4 bg-[#064E4A]/80 rounded-full" />
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-4 shadow-md h-80">
          <div className="h-6 w-60 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="h-28 w-full bg-[#042F2E] rounded-2xl" />
          <div className="h-24 w-full bg-[#042F2E] rounded-xl" />
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-4 shadow-md h-96">
          <div className="h-6 w-56 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="h-20 w-full bg-[#042F2E] rounded-xl" />
          <div className="h-20 w-full bg-[#042F2E] rounded-xl" />
        </div>

        <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 space-y-4 shadow-md h-72">
          <div className="h-6 w-72 bg-[#042F2E] rounded-full border-b pb-4" />
          <div className="h-44 w-full bg-[#042F2E] rounded-2xl" />
        </div>

        <div className="rounded-3xl border border-[#FF6B6B]/40 bg-[#064E4A] p-6 sm:p-8 space-y-3 shadow-md h-36">
          <div className="h-5 w-52 bg-[#042F2E] rounded-full" />
          <div className="h-16 w-full bg-[#042F2E] rounded-xl" />
        </div>
      </main>
    </div>
  );
}
