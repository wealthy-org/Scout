import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-20">
      <GlobalHeader isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8 animate-pulse">
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="h-6 w-48 bg-bg-secondary border-2 border-border-primary mx-auto" />
          <div className="h-12 w-full max-w-xl bg-bg-secondary border-2 border-border-primary mx-auto" />
          <div className="h-4 w-3/4 bg-bg-secondary border border-border-primary mx-auto" />
          <div className="h-12 w-full max-w-xl bg-bg-secondary border-2 border-border-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="h-28 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-xs" />
          <div className="h-28 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-xs" />
          <div className="h-28 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-xs col-span-2 md:col-span-1" />
        </div>

        <div className="h-64 bg-bg-primary border-2 border-border-primary p-6 shadow-neo-sm" />
      </main>
    </div>
  );
}
