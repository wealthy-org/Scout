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
    <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] px-2 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
            Top Wallets
          </span>
          <span className="font-mono text-[10px] text-[#A7F3D0]">
            (Top {rows.length} by volume)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[rgba(153,246,228,0.2)] text-[10px] uppercase text-[#A7F3D0]">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Wallet</th>
              <th className="py-2.5 px-3">Tags</th>
              <th className="py-2.5 px-3 text-right">Volume</th>
              <th className="py-2.5 px-3 text-right">Net Flow</th>
              <th className="py-2.5 px-3 text-right">Trades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(153,246,228,0.15)]">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-xs text-[#A7F3D0]/70"
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
                    className="transition-colors hover:bg-[#064E4A]/60"
                  >
                    <td className="py-2 px-3 text-[#A7F3D0]">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        {isDep ? (
                          <Link
                            href={`/deployer/${row.address}`}
                            className="font-bold text-[#99F6E4] underline decoration-[#FFD166]/50 underline-offset-2 hover:text-[#FFFDF7]"
                          >
                            {shortAddr}
                          </Link>
                        ) : (
                          <span className="text-[#FFFDF7]">{shortAddr}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(row.address)}
                          title="Copy address"
                          className="text-[#A7F3D0] hover:text-[#FFFDF7]"
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
                          <span className="text-[9px] font-bold text-[#99F6E4]">
                            Copied
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {isDep && (
                          <span className="border-[1.5px] border-[#042F2E] bg-[#FFD166] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#042F2E]">
                            Deployer
                          </span>
                        )}
                        {isFee && (
                          <span className="border-[1.5px] border-[#042F2E] bg-[#99F6E4] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#042F2E]">
                            Fee Recipient
                          </span>
                        )}
                        {isEarly && (
                          <span className="border-[1.5px] border-[#042F2E] bg-[#C084FC] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#042F2E]">
                            Early
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-[#FFFDF7]">
                      ${Math.round(row.volume).toLocaleString()}
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-bold ${
                        isNetPositive
                          ? "text-[#99F6E4]"
                          : "text-[#FF6B6B]"
                      }`}
                    >
                      {`${isNetPositive ? "+" : "-"}$${Math.abs(
                        Math.round(row.netFlow)
                      ).toLocaleString()}`}
                    </td>
                    <td className="py-2 px-3 text-right text-[#A7F3D0]">
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
