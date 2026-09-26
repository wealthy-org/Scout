import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function CensusLoading() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-20">
      <GlobalHeader isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6 animate-pulse">
        <div className="border-b-2 border-border-primary pb-4 space-y-2">
          <div className="h-8 w-72 bg-bg-secondary border-2 border-border-primary" />
          <div className="h-4 w-96 max-w-full bg-bg-secondary border border-border-primary" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-xs space-y-2">
              <div className="h-3 w-28 bg-bg-secondary border border-border-primary" />
              <div className="h-8 w-20 bg-bg-secondary border-2 border-border-primary" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-sm" />
          <div className="h-72 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-sm" />
        </div>
      </main>
    </div>
  );
}
