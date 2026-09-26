"use client";

import React, { useState, useEffect } from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { ConnectionMap, type MapNode, type MapEdge } from "@/components/map/ConnectionMap";

const defaultMockNodes: MapNode[] = [
  {
    contractAddress: "0x1111111111111111111111111111111111111111",
    symbol: "SCOUT",
    name: "Scout Intelligence",
    status: "active",
  },
  {
    contractAddress: "0x2222222222222222222222222222222222222222",
    symbol: "CYBER",
    name: "Cyber Doge",
    status: "active",
  },
  {
    contractAddress: "0x3333333333333333333333333333333333333333",
    symbol: "ALPHA",
    name: "Alpha Matrix",
    status: "hold",
  },
  {
    contractAddress: "0x4444444444444444444444444444444444444444",
    symbol: "RUGME",
    name: "Serial Test",
    status: "rugged",
  },
];

const defaultMockEdges: MapEdge[] = [
  {
    source: "0x1111111111111111111111111111111111111111",
    target: "0x2222222222222222222222222222222222222222",
    type: "confirmed",
    reason: "same_deployer",
  },
  {
    source: "0x1111111111111111111111111111111111111111",
    target: "0x3333333333333333333333333333333333333333",
    type: "hypothesis",
    reason: "note_mention",
  },
  {
    source: "0x3333333333333333333333333333333333333333",
    target: "0x4444444444444444444444444444444444444444",
    type: "confirmed",
    reason: "same_fee_recipient",
  },
];

export default function MapPage() {
  const [nodes, setNodes] = useState<MapNode[]>(defaultMockNodes);
  const [edges, setEdges] = useState<MapEdge[]>(defaultMockEdges);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadConnections() {
      try {
        setLoading(true);
        const res = await fetch("/api/connections");
        if (res.ok) {
          const data = await res.json();
          if (data.nodes && data.nodes.length > 0) {
            setNodes(data.nodes);
            setEdges(
              (data.links || []).map((l: { sourceAddress: string; targetAddress: string; type: "confirmed" | "hypothesis"; reason?: string }) => ({
                source: l.sourceAddress,
                target: l.targetAddress,
                type: l.type,
                reason: l.reason,
              }))
            );
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }

    loadConnections();
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#00F0FF]/10 via-[#D946EF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col space-y-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Connection Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
              Global relational constellation linking dossiers by deployer, fee routing, repositories, and thesis mentions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
              {`${nodes.length} Nodes`}
            </span>
            <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 font-bold">
              {`${edges.length} Links`}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-[600px] w-full">
          {loading ? (
            <div className="w-full h-[650px] bg-slate-900/80 border border-slate-800 rounded-3xl flex items-center justify-center animate-pulse">
              <div className="text-xs text-slate-400 font-mono">
                Calculating dossier force graph layout...
              </div>
            </div>
          ) : (
            <ConnectionMap nodes={nodes} edges={edges} />
          )}
        </div>
      </main>
    </div>
  );
}
