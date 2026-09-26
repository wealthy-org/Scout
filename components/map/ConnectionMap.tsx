"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";

export type ConnectionType = "confirmed" | "hypothesis";

export interface MapNode {
  contractAddress: string;
  symbol: string;
  name?: string;
  status?: "active" | "passed" | "rugged" | "hold" | string;
  x?: number;
  y?: number;
}

export interface MapEdge {
  source: string;
  target: string;
  type: ConnectionType;
  reason?: string;
}

export interface ConnectionMapProps {
  nodes?: MapNode[];
  edges?: MapEdge[];
  onNodeClick?: (node: MapNode) => void;
}

interface CalculatedNode extends MapNode {
  cx: number;
  cy: number;
  r: number;
  color: string;
}

export function computeMapLayout(
  nodes: MapNode[] = [],
  width: number = 1000,
  height: number = 700,
  customPositions: Record<string, { x: number; y: number }> = {}
): CalculatedNode[] {
  if (!nodes || nodes.length === 0) return [];

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  return nodes.map((node, i) => {
    const custom = customPositions[node.contractAddress.toLowerCase()];
    let cx = custom?.x ?? 0;
    let cy = custom?.y ?? 0;

    if (!custom) {
      if (nodes.length === 1) {
        cx = centerX;
        cy = centerY;
      } else {
        const angle = (2 * Math.PI * i) / nodes.length;
        cx = centerX + radius * Math.cos(angle);
        cy = centerY + radius * Math.sin(angle);
      }
    }

    let color = "#10b981";
    const st = (node.status || "active").toLowerCase();
    if (st === "passed") color = "#64748b";
    else if (st === "rugged") color = "#ef4444";
    else if (st === "hold") color = "#f59e0b";

    return {
      ...node,
      cx,
      cy,
      r: 22,
      color,
    };
  });
}

export function ConnectionMap({
  nodes = [],
  edges = [],
  onNodeClick,
}: ConnectionMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [customPositions, setCustomPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CalculatedNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const width = 1000;
  const height = 700;

  const calculatedNodes = useMemo(() => {
    return computeMapLayout(nodes, width, height, customPositions);
  }, [nodes, customPositions]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, CalculatedNode>();
    calculatedNodes.forEach((n) => {
      map.set(n.contractAddress.toLowerCase(), n);
    });
    return map;
  }, [calculatedNodes]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(0.4, prev + delta), 2.5));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).tagName === "circle" || draggingNode) {
      return;
    }
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingNode) {
        const svgRect = containerRef.current?.getBoundingClientRect();
        if (svgRect) {
          const clientX = (e.clientX - svgRect.left - pan.x) / zoom;
          const clientY = (e.clientY - svgRect.top - pan.y) / zoom;
          setCustomPositions((prev) => ({
            ...prev,
            [draggingNode.toLowerCase()]: { x: clientX, y: clientY },
          }));
        }
        return;
      }

      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [draggingNode, isPanning, pan.x, pan.y, panStart.x, panStart.y, zoom]
  );

  const handlePointerUp = () => {
    setIsPanning(false);
    setDraggingNode(null);
  };

  if (nodes.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#0d1117] border border-gray-800 rounded-xl p-8 text-center">
        <div>
          <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center mx-auto mb-3 text-cyan-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1">No dossier connections found</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Add dossiers with shared deployers, fee recipients, or notes mentions to visualize relationships.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[700px] bg-[#080b0f] border border-gray-800 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl"
    >
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[#0d1117]/90 backdrop-blur-md p-1.5 rounded-lg border border-gray-800 shadow-lg">
        <button
          type="button"
          data-testid="zoom-in-btn"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          className="w-8 h-8 rounded bg-[#161c24] hover:bg-gray-800 text-white font-bold text-base flex items-center justify-center transition-colors"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          data-testid="zoom-out-btn"
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
          className="w-8 h-8 rounded bg-[#161c24] hover:bg-gray-800 text-white font-bold text-base flex items-center justify-center transition-colors"
          aria-label="Zoom Out"
        >
          -
        </button>
        <button
          type="button"
          data-testid="zoom-reset-btn"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-8 h-8 rounded bg-[#161c24] hover:bg-gray-800 text-cyan-400 font-bold text-xs flex items-center justify-center transition-colors"
          aria-label="Reset View"
        >
          1x
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-20 bg-[#0d1117]/90 backdrop-blur-md p-3.5 rounded-xl border border-gray-800 shadow-xl space-y-3 text-xs">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Status Legend
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-gray-300">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-gray-300">Hold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-gray-300">Rugged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-gray-300">Passed</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Connection Links
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 bg-cyan-400" />
              <span className="text-cyan-300 font-medium">Confirmed (On-Chain / Repo)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 border-b-2 border-dashed border-purple-400" />
              <span className="text-purple-300 font-medium">Hypothesis (Note Mentions)</span>
            </div>
          </div>
        </div>
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {edges.map((edge, idx) => {
            const src = nodeMap.get(edge.source.toLowerCase());
            const tgt = nodeMap.get(edge.target.toLowerCase());
            if (!src || !tgt) return null;

            const isConfirmed = edge.type === "confirmed";

            return (
              <line
                key={`edge-${idx}`}
                x1={src.cx}
                y1={src.cy}
                x2={tgt.cx}
                y2={tgt.cy}
                stroke={isConfirmed ? "#06b6d4" : "#a855f7"}
                strokeWidth={isConfirmed ? "2" : "1.5"}
                strokeDasharray={isConfirmed ? "none" : "5 4"}
                opacity={0.8}
              />
            );
          })}

          {calculatedNodes.map((node) => (
            <g
              key={node.contractAddress}
              transform={`translate(${node.cx}, ${node.cy})`}
              onPointerDown={(e) => {
                e.stopPropagation();
                setDraggingNode(node.contractAddress);
              }}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => onNodeClick?.(node)}
              className="cursor-pointer"
            >
              <circle
                r={node.r + 4}
                fill={node.color}
                opacity={0.2}
                className="animate-pulse"
              />
              <circle
                r={node.r}
                fill="#0d1117"
                stroke={node.color}
                strokeWidth="2.5"
              />
              <text
                dy="4"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {node.symbol.slice(0, 5)}
              </text>

              <foreignObject
                x="-50"
                y="26"
                width="100"
                height="30"
                className="pointer-events-auto"
              >
                <Link
                  href={`/d/${node.contractAddress}`}
                  className="block text-center text-[10px] font-bold text-cyan-400 hover:underline truncate"
                >
                  {`$${node.symbol}`}
                </Link>
              </foreignObject>
            </g>
          ))}
        </g>
      </svg>

      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            left: hoveredNode.cx * zoom + pan.x + 20,
            top: hoveredNode.cy * zoom + pan.y - 20,
          }}
          className="z-30 pointer-events-none bg-[#161c24] border border-gray-700 px-3 py-2 rounded-lg shadow-xl text-xs text-white"
        >
          <div className="font-bold text-cyan-400">{`$${hoveredNode.symbol}`}</div>
          {hoveredNode.name && <div className="text-gray-400 text-[10px]">{hoveredNode.name}</div>}
          <div className="text-[10px] uppercase font-bold text-gray-400 mt-1">
            {`Status: ${hoveredNode.status || "active"}`}
          </div>
        </div>
      )}
    </div>
  );
}
