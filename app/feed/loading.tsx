import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function FeedLoading() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-20">
      <GlobalHeader isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6 animate-pulse">
        <div className="border-b-2 border-border-primary pb-4 space-y-2">
          <div className="h-8 w-60 bg-bg-secondary border-2 border-border-primary" />
          <div className="h-4 w-80 max-w-full bg-bg-secondary border border-border-primary" />
        </div>

        <div className="h-12 bg-bg-primary border-2 border-border-primary shadow-neo-xs" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-xs space-y-2">
              <div className="h-5 w-28 bg-bg-secondary border border-border-primary" />
              <div className="h-4 w-full bg-bg-secondary border border-border-primary" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
