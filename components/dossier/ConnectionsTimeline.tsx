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
    <div className="bg-[#11161d] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-800 px-5 pt-3">
        <div className="flex space-x-2">
          <button
            id="tab-connections-btn"
            type="button"
            onClick={() => setCurrentTab("connections")}
            className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 flex items-center space-x-2 ${
              currentTab === "connections"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Connections</span>
            <span className="px-1.5 py-0.5 text-xs bg-gray-800 text-gray-300 rounded-full font-mono">
              {connections.length}
            </span>
          </button>
          <button
            id="tab-timeline-btn"
            type="button"
            onClick={() => setCurrentTab("timeline")}
            className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 flex items-center space-x-2 ${
              currentTab === "timeline"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Timeline</span>
            <span className="px-1.5 py-0.5 text-xs bg-gray-800 text-gray-300 rounded-full font-mono">
              {timelineLogs.length}
            </span>
          </button>
        </div>

        {currentTab === "connections" && (
          <button
            id="add-connection-btn"
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mb-2 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors flex items-center space-x-1"
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
              <div className="text-center py-8 text-gray-500 text-sm">
                No connected tokens found. Add token relations or hypotheses manually.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {connections.map((conn, idx) => (
                  <div
                    key={conn.id || `conn-${idx}`}
                    className="p-3.5 rounded-lg bg-[#161c24] border border-gray-800 hover:border-gray-700 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/d/${conn.contractAddress}`}
                          className="font-mono text-sm font-bold text-white hover:text-cyan-400 transition-colors flex items-center space-x-2"
                        >
                          <span>{conn.symbol || "UNKNOWN"}</span>
                          {conn.name && (
                            <span className="text-xs text-gray-400 font-sans font-normal">
                              ({conn.name})
                            </span>
                          )}
                        </Link>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            conn.type === "confirmed"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                              : "bg-amber-950/60 text-amber-400 border border-amber-800/60 border-dashed"
                          }`}
                        >
                          {conn.type === "confirmed" ? "Confirmed" : "Hypothesis"}
                        </span>
                      </div>

                      {conn.reason && (
                        <p className="text-xs text-gray-300 leading-relaxed mb-2">
                          {conn.reason}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                      <span>{conn.contractAddress.slice(0, 8)}...{conn.contractAddress.slice(-6)}</span>
                      <Link
                        href={`/d/${conn.contractAddress}`}
                        className="text-cyan-400 hover:underline"
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
              <div className="text-center py-8 text-gray-500 text-sm">
                No timeline logs recorded for this dossier.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto pr-2 space-y-3 font-mono text-xs">
                {sortedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded bg-[#161c24] border-l-2 border-cyan-500/80 pl-3 flex flex-col space-y-1"
                  >
                    <div className="text-[11px] text-cyan-400 font-semibold">
                      {formatLogDate(log.at)}
                    </div>
                    <div className="text-gray-300 font-sans text-xs leading-relaxed">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#161c24] border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Token Connection</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="connection-ca-input"
                  className="block text-xs font-medium text-gray-300 mb-1"
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
                  className="w-full bg-[#11161d] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label
                  htmlFor="connection-symbol-input"
                  className="block text-xs font-medium text-gray-300 mb-1"
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
                  className="w-full bg-[#11161d] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label
                  htmlFor="connection-type-select"
                  className="block text-xs font-medium text-gray-300 mb-1"
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
                  className="w-full bg-[#11161d] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="hypothesis">Hypothesis (Suspected link/cluster)</option>
                  <option value="confirmed">Confirmed (On-chain verified)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="connection-reason-input"
                  className="block text-xs font-medium text-gray-300 mb-1"
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
                  className="w-full bg-[#11161d] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="px-4 py-2 text-xs font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors disabled:opacity-50"
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
