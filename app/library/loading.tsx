import React from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-mono pb-20">
      <GlobalHeader isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border-primary pb-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-bg-secondary border-2 border-border-primary" />
            <div className="h-4 w-96 max-w-full bg-bg-secondary border border-border-primary" />
          </div>
          <div className="h-10 w-36 bg-bg-secondary border-2 border-border-primary" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-9 w-20 bg-bg-secondary border-2 border-border-primary" />
          <div className="h-9 w-24 bg-bg-secondary border-2 border-border-primary" />
          <div className="h-9 w-28 bg-bg-secondary border-2 border-border-primary" />
          <div className="h-9 w-24 bg-bg-secondary border-2 border-border-primary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-bg-primary border-2 border-border-primary p-4 shadow-neo-sm space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-6 w-24 bg-bg-secondary border border-border-primary" />
                <div className="h-5 w-20 bg-bg-secondary border border-border-primary" />
              </div>
              <div className="h-4 w-3/4 bg-bg-secondary border border-border-primary" />
              <div className="h-16 w-full bg-canvas border border-border-primary" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
