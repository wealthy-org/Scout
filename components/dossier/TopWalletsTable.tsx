"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface TopWalletRow {
  address: string;
  volume: number;
  netFlow: number;
  tradeCount?: number;
  isDeployer?: boolean;
  isFeeRecipient?: boolean;
  isEarly?: boolean;
  firstTradeIndex?: number;
}

export interface TopWalletsTableProps {
  wallets?: TopWalletRow[];
  deployerAddress?: string;
  feeRecipientAddress?: string;
}

export function TopWalletsTable({
  wallets = [],
  deployerAddress,
  feeRecipientAddress,
}: TopWalletsTableProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = async (addr: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(addr);
      setCopiedAddress(addr);
      setTimeout(() => setCopiedAddress(null), 2000);
    }
  };

  const rows = wallets.slice(0, 12);

  return (
    <div className="border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Top Wallets
          </span>
          <span className="font-mono text-[10px] text-ink-muted">
            (Top {rows.length} by volume)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-border bg-neutral-50 dark:bg-neutral-900/50 text-[10px] uppercase text-ink-muted">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Wallet</th>
              <th className="py-2.5 px-3">Tags</th>
              <th className="py-2.5 px-3 text-right">Volume</th>
              <th className="py-2.5 px-3 text-right">Net Flow</th>
              <th className="py-2.5 px-3 text-right">Trades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-xs text-ink-muted"
                >
                  No wallet records found
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const isDep =
                  row.isDeployer ||
                  (deployerAddress
                    ? row.address.toLowerCase() === deployerAddress.toLowerCase()
                    : false);
                const isFee =
                  row.isFeeRecipient ||
                  (feeRecipientAddress
                    ? row.address.toLowerCase() ===
                      feeRecipientAddress.toLowerCase()
                    : false);
                const isEarly =
                  row.isEarly ||
                  (row.firstTradeIndex !== undefined &&
                    row.firstTradeIndex < 10);
                const isNetPositive = row.netFlow >= 0;

                const shortAddr = `${row.address.slice(0, 6)}...${row.address.slice(
                  -4
                )}`;

                return (
                  <tr
                    key={row.address || idx}
                    className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                  >
                    <td className="py-2 px-3 text-ink-muted">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        {isDep ? (
                          <Link
                            href={`/deployer/${row.address}`}
                            className="font-bold text-ink underline decoration-amber-500/50 underline-offset-2 hover:text-amber-600 dark:hover:text-amber-400"
                          >
                            {shortAddr}
                          </Link>
                        ) : (
                          <span className="text-ink">{shortAddr}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(row.address)}
                          title="Copy address"
                          className="text-ink-muted hover:text-ink"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        {copiedAddress === row.address && (
                          <span className="text-[9px] font-bold text-emerald-500">
                            Copied
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {isDep && (
                          <span className="border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400">
                            Deployer
                          </span>
                        )}
                        {isFee && (
                          <span className="border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-600 dark:text-cyan-400">
                            Fee Recipient
                          </span>
                        )}
                        {isEarly && (
                          <span className="border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-purple-600 dark:text-purple-400">
                            Early
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-ink">
                      ${Math.round(row.volume).toLocaleString()}
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-bold ${
                        isNetPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {`${isNetPositive ? "+" : "-"}$${Math.abs(
                        Math.round(row.netFlow)
                      ).toLocaleString()}`}
                    </td>
                    <td className="py-2 px-3 text-right text-ink-muted">
                      {row.tradeCount ?? "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
