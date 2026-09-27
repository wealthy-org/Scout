"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface ConnectionItem {
  id?: string;
  contractAddress: string;
  symbol?: string;
  name?: string;
  type: "confirmed" | "hypothesis";
  reason?: string;
  createdAt?: string | Date;
}

export interface TimelineLogItem {
  id: string;
  at: string | Date;
  text: string;
}

export interface ConnectionsTimelineProps {
  connections?: ConnectionItem[];
  timelineLogs?: TimelineLogItem[];
  activeTab?: "connections" | "timeline";
  onAddConnection?: (connection: {
    contractAddress: string;
    symbol: string;
    type: "confirmed" | "hypothesis";
    reason: string;
  }) => void | Promise<void>;
  isLoading?: boolean;
}

export function ConnectionsTimeline({
  connections = [],
  timelineLogs = [],
  activeTab: initialTab = "connections",
  onAddConnection,
  isLoading = false,
}: ConnectionsTimelineProps) {
  const [currentTab, setCurrentTab] = useState<"connections" | "timeline">(
    initialTab
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    contractAddress: "",
    symbol: "",
    type: "hypothesis" as "confirmed" | "hypothesis",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedLogs = [...timelineLogs].sort((a, b) => {
    const timeA = new Date(a.at).getTime();
    const timeB = new Date(b.at).getTime();
    return timeB - timeA;
  }).slice(0, 200);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contractAddress.trim()) return;

    if (onAddConnection) {
      setIsSubmitting(true);
      try {
        await onAddConnection(formData);
        setFormData({
          contractAddress: "",
          symbol: "",
          type: "hypothesis",
          reason: "",
        });
        setIsModalOpen(false);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsModalOpen(false);
    }
  };

  const formatLogDate = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toISOString().replace("T", " ").substring(0, 19);
  };

  return (
    <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] overflow-hidden shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] font-sans">
      <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] px-5 pt-3">
        <div className="flex space-x-2">
          <button
            id="tab-connections-btn"
            type="button"
            onClick={() => setCurrentTab("connections")}
            className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 flex items-center space-x-2 ${
              currentTab === "connections"
                ? "border-[#99F6E4] text-[#99F6E4]"
                : "border-transparent text-[#A7F3D0] hover:text-[#FFFDF7]"
            }`}
          >
            <span>Connections</span>
            <span className="px-1.5 py-0.5 text-xs bg-[#042F2E] text-[#99F6E4] rounded-full font-mono">
              {connections.length}
            </span>
          </button>
          <button
            id="tab-timeline-btn"
            type="button"
            onClick={() => setCurrentTab("timeline")}
            className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 flex items-center space-x-2 ${
              currentTab === "timeline"
                ? "border-[#99F6E4] text-[#99F6E4]"
                : "border-transparent text-[#A7F3D0] hover:text-[#FFFDF7]"
            }`}
          >
            <span>Timeline</span>
            <span className="px-1.5 py-0.5 text-xs bg-[#042F2E] text-[#99F6E4] rounded-full font-mono">
              {timelineLogs.length}
            </span>
          </button>
        </div>

        {currentTab === "connections" && (
          <button
            id="add-connection-btn"
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mb-2 px-3 py-1.5 text-xs font-bold pop-btn-yellow rounded-xl transition-all flex items-center space-x-1"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Connection</span>
          </button>
        )}
      </div>

      <div className="p-5">
        {currentTab === "connections" ? (
          <div>
            {connections.length === 0 ? (
              <div className="text-center py-8 text-[#A7F3D0]/70 text-sm">
                No connected tokens found. Add token relations or hypotheses manually.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {connections.map((conn, idx) => (
                  <div
                    key={conn.id || `conn-${idx}`}
                    className="p-3.5 rounded-2xl bg-[#042F2E] border border-[rgba(153,246,228,0.2)] hover:border-[#99F6E4] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/d/${conn.contractAddress}`}
                          className="font-mono text-sm font-bold text-[#FFFDF7] hover:text-[#99F6E4] transition-colors flex items-center space-x-2"
                        >
                          <span>{conn.symbol || "UNKNOWN"}</span>
                          {conn.name && (
                            <span className="text-xs text-[#A7F3D0] font-sans font-normal">
                              ({conn.name})
                            </span>
                          )}
                        </Link>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase border-[1.5px] border-[#042F2E] ${
                            conn.type === "confirmed"
                              ? "bg-[#99F6E4] text-[#042F2E]"
                              : "bg-[#FFD166] text-[#042F2E]"
                          }`}
                        >
                          {conn.type === "confirmed" ? "Confirmed" : "Hypothesis"}
                        </span>
                      </div>

                      {conn.reason && (
                        <p className="text-xs text-[#A7F3D0] leading-relaxed mb-2">
                          {conn.reason}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[rgba(153,246,228,0.15)] flex items-center justify-between text-[11px] text-[#A7F3D0] font-mono">
                      <span>{conn.contractAddress.slice(0, 8)}...{conn.contractAddress.slice(-6)}</span>
                      <Link
                        href={`/d/${conn.contractAddress}`}
                        className="text-[#99F6E4] hover:text-[#FFFDF7] hover:underline"
                      >
                        View Dossier &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {sortedLogs.length === 0 ? (
              <div className="text-center py-8 text-[#A7F3D0]/70 text-sm">
                No timeline logs recorded for this dossier.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto pr-2 space-y-3 font-mono text-xs">
                {sortedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-[#042F2E] border-l-2 border-[#99F6E4] pl-3 flex flex-col space-y-1"
                  >
                    <div className="text-[11px] text-[#99F6E4] font-semibold">
                      {formatLogDate(log.at)}
                    </div>
                    <div className="text-[#FFFDF7] font-sans text-xs leading-relaxed">
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042F2E]/80 backdrop-blur-sm p-4">
          <div className="bg-[#064E4A] border border-[rgba(153,246,228,0.3)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#FFFDF7]">Add Token Connection</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="connection-ca-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#A7F3D0] mb-1"
                >
                  Contract Address (CA) *
                </label>
                <input
                  id="connection-ca-input"
                  type="text"
                  required
                  placeholder="0x..."
                  value={formData.contractAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, contractAddress: e.target.value })
                  }
                  className="w-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3 py-2 text-sm text-[#FFFDF7] font-mono placeholder:text-[#A7F3D0]/50 focus:outline-hidden focus:border-[#99F6E4]"
                />
              </div>

              <div>
                <label
                  htmlFor="connection-symbol-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#A7F3D0] mb-1"
                >
                  Symbol
                </label>
                <input
                  id="connection-symbol-input"
                  type="text"
                  placeholder="e.g. TICKER"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value })
                  }
                  className="w-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3 py-2 text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:outline-hidden focus:border-[#99F6E4]"
                />
              </div>

              <div>
                <label
                  htmlFor="connection-type-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#A7F3D0] mb-1"
                >
                  Connection Type
                </label>
                <select
                  id="connection-type-select"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "confirmed" | "hypothesis",
                    })
                  }
                  className="w-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3 py-2 text-sm text-[#FFFDF7] focus:outline-hidden focus:border-[#99F6E4]"
                >
                  <option value="hypothesis">Hypothesis (Suspected link/cluster)</option>
                  <option value="confirmed">Confirmed (On-chain verified)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="connection-reason-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#A7F3D0] mb-1"
                >
                  Reason / Hypothesis Notes
                </label>
                <textarea
                  id="connection-reason-input"
                  rows={3}
                  placeholder="Describe why these tokens or deployers are linked..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full bg-[#042F2E] border border-[rgba(153,246,228,0.25)] rounded-xl px-3 py-2 text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:outline-hidden focus:border-[#99F6E4]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] border border-[rgba(153,246,228,0.2)] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="px-4 py-2 text-xs font-bold pop-btn-yellow rounded-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Connection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
