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
        // Fallback to initial seed nodes on offline / unauthenticated
      } finally {
        setLoading(false);
      }
    }

    loadConnections();
  }, []);

  return (
    <div className="min-h-screen bg-[#080b0f] text-gray-100 flex flex-col font-sans">
      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
              Connection Map
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Global relational constellation linking dossiers by deployer, fee routing, repositories, and thesis mentions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-bold">
              {`${nodes.length} Nodes`}
            </span>
            <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-800 text-purple-300 font-bold">
              {`${edges.length} Links`}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-[600px] w-full">
          {loading ? (
            <div className="w-full h-[650px] bg-[#0d1117] border border-gray-800 rounded-xl flex items-center justify-center animate-pulse">
              <div className="text-xs text-gray-500 font-mono">
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
