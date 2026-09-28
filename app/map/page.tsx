"use client";

import React, { useState, useEffect } from "react";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { ConnectionMap, type MapNode, type MapEdge } from "@/components/map/ConnectionMap";

export default function MapPage() {
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [edges, setEdges] = useState<MapEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConnections() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/connections");
        if (res.ok) {
          const data = await res.json();
          setNodes(data.nodes || []);
          setEdges(
            (data.links || []).map((l: { sourceAddress: string; targetAddress: string; type: "confirmed" | "hypothesis"; reason?: string }) => ({
              source: l.sourceAddress,
              target: l.targetAddress,
              type: l.type,
              reason: l.reason,
            }))
          );
        } else {
          setError("Failed to fetch connection map data");
        }
      } catch {
        setError("Network error loading connection map");
      } finally {
        setLoading(false);
      }
    }

    loadConnections();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] flex flex-col font-sans relative overflow-hidden pb-16">
      <div className="absolute top-0 right-1/4 w-[700px] h-[450px] bg-gradient-to-b from-[#14B8A6]/20 via-[#99F6E4]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      <GlobalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col space-y-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF7]">
              Connection Map
            </h1>
            <p className="text-xs sm:text-sm text-[#A7F3D0] mt-1 font-normal">
              Global relational constellation linking dossiers by deployer, fee routing, repositories, and thesis mentions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#99F6E4] border-[1.5px] border-[#042F2E] text-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]">
              {`${nodes.length} Nodes`}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FFD166] border-[1.5px] border-[#042F2E] text-[#042F2E] font-bold shadow-[2px_2px_0px_#042F2E]">
              {`${edges.length} Links`}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-[600px] w-full">
          {loading ? (
            <div className="w-full h-[650px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl flex items-center justify-center animate-pulse">
              <div className="text-xs text-[#A7F3D0] font-mono">
                Calculating dossier force graph layout...
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-[650px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="text-sm text-[#FFD166] font-bold">
                Unable to Load Relational Graph
              </div>
              <div className="text-xs text-[#A7F3D0] max-w-md font-mono">
                {error}
              </div>
            </div>
          ) : nodes.length === 0 ? (
            <div className="w-full h-[650px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="text-sm font-bold text-[#FFFDF7]">
                No Dossier Connections Found
              </div>
              <div className="text-xs text-[#A7F3D0] max-w-md">
                Add dossiers to your library or link tokens through deployer investigations to generate graph nodes.
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

