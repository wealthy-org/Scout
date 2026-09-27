import React from "react";
import { Header } from "@/components/layout/Header";

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-pulse relative z-10">
        <div className="border-b border-[rgba(153,246,228,0.2)] pb-5 space-y-2">
          <div className="h-8 w-60 bg-[#064E4A] rounded-full" />
          <div className="h-4 w-96 max-w-full bg-[#064E4A]/80 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5" />
          <div className="h-64 rounded-2xl bg-[#064E4A] border border-[rgba(153,246,228,0.25)] p-5 md:col-span-2" />
        </div>
      </main>
    </div>
  );
}
