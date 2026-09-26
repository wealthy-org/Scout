import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function WatchlistLoading() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-20">
      <GlobalHeader isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border-primary pb-4">
          <div className="space-y-2">
            <div className="h-8 w-60 bg-bg-secondary border-2 border-border-primary" />
            <div className="h-4 w-80 max-w-full bg-bg-secondary border border-border-primary" />
          </div>
          <div className="h-10 w-44 bg-bg-secondary border-2 border-border-primary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-sm space-y-3">
              <div className="h-5 w-48 bg-bg-secondary border border-border-primary" />
              <div className="h-8 w-24 bg-bg-secondary border-2 border-border-primary" />
              <div className="h-4 w-full bg-bg-secondary border border-border-primary" />
            </div>
          ))}
        </div>

        <div className="h-72 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-sm" />
      </main>
    </div>
  );
}
