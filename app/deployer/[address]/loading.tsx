import React from "react";

export default function DeployerLoading() {
  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] font-sans relative overflow-hidden pb-16 sm:pb-24">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <header className="w-full h-14 bg-[#042F2E] border-b border-[rgba(153,246,228,0.2)] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#064E4A] animate-pulse border border-[rgba(153,246,228,0.2)]" />
          <div className="h-5 w-24 rounded-md bg-[#064E4A] animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-20 rounded-xl bg-[#064E4A] animate-pulse" />
          <div className="h-8 w-28 rounded-xl bg-[#064E4A] animate-pulse" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div className="space-y-2">
            <div className="h-3 w-48 rounded bg-[#042F2E] animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-72 sm:w-96 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] animate-pulse" />
              <div className="h-7 w-16 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] animate-pulse" />
            </div>
          </div>

          <div className="h-9 w-36 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.25)] animate-pulse" />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="h-3 w-36 rounded bg-[#042F2E] animate-pulse mb-3" />
              <div className="h-12 w-28 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 rounded bg-[#042F2E] animate-pulse" />
                <div className="h-3 w-24 rounded bg-[#042F2E] animate-pulse" />
              </div>

              <div className="flex gap-1.5 h-3.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-[#042F2E] border border-[rgba(153,246,228,0.2)] animate-pulse"
                  />
                ))}
              </div>

              <div className="h-6 w-36 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] animate-pulse" />
            </div>

            <div className="h-8 w-full rounded-md bg-[#042F2E] animate-pulse" />
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-6">
            <div className="border-b border-[rgba(153,246,228,0.2)] pb-4 flex items-center justify-between">
              <div className="h-5 w-48 rounded bg-[#042F2E] animate-pulse" />
              <div className="h-3 w-32 rounded bg-[#042F2E] animate-pulse" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] space-y-2"
                >
                  <div className="h-3 w-24 rounded bg-[#064E4A] animate-pulse" />
                  <div className="h-7 w-16 rounded bg-[#064E4A] animate-pulse" />
                  <div className="h-2.5 w-20 rounded bg-[#064E4A] animate-pulse" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-4 flex items-center justify-between">
              <div className="h-4 w-60 rounded bg-[#064E4A] animate-pulse" />
              <div className="h-4 w-4 rounded bg-[#064E4A] animate-pulse" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-4">
            <div className="space-y-1">
              <div className="h-5 w-44 rounded bg-[#042F2E] animate-pulse" />
              <div className="h-3 w-64 rounded bg-[#042F2E] animate-pulse" />
            </div>
            <div className="h-6 w-24 rounded-full bg-[#042F2E] border border-[rgba(153,246,228,0.2)] animate-pulse" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[rgba(153,246,228,0.2)] bg-[#042F2E]">
                  <th className="p-3.5 text-left"><div className="h-3.5 w-28 rounded bg-[#064E4A] animate-pulse" /></th>
                  <th className="p-3.5 text-left"><div className="h-3.5 w-16 rounded bg-[#064E4A] animate-pulse" /></th>
                  <th className="p-3.5 text-left"><div className="h-3.5 w-24 rounded bg-[#064E4A] animate-pulse" /></th>
                  <th className="p-3.5 text-right"><div className="h-3.5 w-16 rounded bg-[#064E4A] animate-pulse ml-auto" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(153,246,228,0.15)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-3.5"><div className="h-4 w-64 rounded bg-[#042F2E] animate-pulse" /></td>
                    <td className="p-3.5"><div className="h-4 w-20 rounded bg-[#042F2E] animate-pulse" /></td>
                    <td className="p-3.5"><div className="h-5 w-20 rounded-full bg-[#042F2E] animate-pulse" /></td>
                    <td className="p-3.5 text-right"><div className="h-4 w-28 rounded bg-[#042F2E] animate-pulse ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
