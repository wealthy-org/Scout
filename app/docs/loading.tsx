import React from "react";
import { Header } from "@/components/layout/Header";

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-[#00E599]/15 via-[#00F0FF]/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <Header isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-pulse relative z-10">
        <div className="border-b border-slate-800 pb-5 space-y-2">
          <div className="h-8 w-60 bg-slate-800/80 rounded-full" />
          <div className="h-4 w-96 max-w-full bg-slate-800/40 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 p-5" />
          <div className="h-64 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 p-5 md:col-span-2" />
        </div>
      </main>
    </div>
  );
}
