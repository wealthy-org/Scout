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
    let cx = 0;
    let cy = 0;

    if (custom && typeof custom.x === "number" && typeof custom.y === "number") {
      cx = custom.x;
      cy = custom.y;
    } else {
      if (nodes.length === 1) {
        cx = centerX;
        cy = centerY;
      } else {
        const angle = (2 * Math.PI * i) / nodes.length;
        cx = centerX + radius * Math.cos(angle);
        cy = centerY + radius * Math.sin(angle);
      }
    }

    let color = "#99F6E4";
    const st = (node.status || "active").toLowerCase();
    if (st === "passed") color = "#A7F3D0";
    else if (st === "rugged") color = "#FF6B6B";
    else if (st === "hold" || st === "watching" || st === "researching") color = "#FFD166";
    else if (st === "active" || st === "in position") color = "#99F6E4";

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
      <div className="w-full h-[600px] flex items-center justify-center bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl p-8 text-center backdrop-blur-xl shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)]">
        <div>
          <div className="w-14 h-14 rounded-2xl bg-[#FFD166] border-[1.5px] border-[#042F2E] flex items-center justify-center mx-auto mb-3 text-[#042F2E] shadow-[3px_3px_0px_#042F2E]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#FFFDF7] mb-1">No dossier connections found</h3>
          <p className="text-xs text-[#A7F3D0] max-w-sm">
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
      className="relative w-full h-[700px] bg-[#064E4A] border border-[rgba(153,246,228,0.25)] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] font-sans"
    >
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[#042F2E]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[rgba(153,246,228,0.25)] shadow-lg">
        <button
          type="button"
          data-testid="zoom-in-btn"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          className="w-8 h-8 rounded-xl bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[#FFFDF7] font-bold text-base flex items-center justify-center transition-colors"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          data-testid="zoom-out-btn"
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
          className="w-8 h-8 rounded-xl bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[#FFFDF7] font-bold text-base flex items-center justify-center transition-colors"
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
          className="w-8 h-8 rounded-xl bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[#FFD166] font-bold text-xs flex items-center justify-center transition-colors"
          aria-label="Reset View"
        >
          1x
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-20 bg-[#042F2E]/90 backdrop-blur-md p-4 rounded-2xl border border-[rgba(153,246,228,0.25)] shadow-xl space-y-3 text-xs">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#A7F3D0] mb-2">
            Status Legend
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#99F6E4]" />
              <span className="text-[#FFFDF7]">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166]" />
              <span className="text-[#FFFDF7]">Hold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
              <span className="text-[#FFFDF7]">Rugged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A7F3D0]" />
              <span className="text-[#FFFDF7]">Passed</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-[rgba(153,246,228,0.2)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#A7F3D0] mb-2">
            Connection Links
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 bg-[#99F6E4]" />
              <span className="text-[#99F6E4] font-medium">Confirmed (On-Chain / Repo)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 border-b-2 border-dashed border-[#C084FC]" />
              <span className="text-[#C084FC] font-medium">Hypothesis (Note Mentions)</span>
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
                stroke={isConfirmed ? "#99F6E4" : "#C084FC"}
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
                r={node.r + 5}
                fill={node.color}
                opacity={0.25}
                className="animate-pulse"
              />
              <circle
                r={node.r}
                fill="#042F2E"
                stroke={node.color}
                strokeWidth="2.5"
              />
              <text
                dy="4"
                textAnchor="middle"
                fill="#FFFDF7"
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none select-none font-sans"
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
                  className="block text-center text-[10px] font-bold text-[#99F6E4] hover:underline truncate font-sans"
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
          className="z-30 pointer-events-none bg-[#042F2E]/95 border border-[rgba(153,246,228,0.3)] px-3.5 py-2.5 rounded-2xl shadow-2xl text-xs text-[#FFFDF7] backdrop-blur-md font-sans"
        >
          <div className="font-bold text-[#99F6E4]">{`$${hoveredNode.symbol}`}</div>
          {hoveredNode.name && <div className="text-[#A7F3D0] text-[10px]">{hoveredNode.name}</div>}
          <div className="text-[10px] uppercase font-bold text-[#A7F3D0] mt-1">
            {`Status: ${hoveredNode.status || "active"}`}
          </div>
        </div>
      )}
    </div>
  );
}
