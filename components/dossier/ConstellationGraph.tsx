"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons/Vectors";

export type ConnectionType = "confirmed" | "hypothesis";

export interface ConstellationNode {
  contractAddress: string;
  symbol: string;
  status?: "active" | "passed" | "rugged" | "hold" | string;
  isCurrent?: boolean;
  x?: number;
  y?: number;
}

export interface ConstellationEdge {
  source: string;
  target: string;
  type: ConnectionType;
  reason?: string;
}

export interface ConstellationGraphProps {
  nodes?: ConstellationNode[];
  edges?: ConstellationEdge[];
  currentContractAddress?: string;
  height?: number;
  width?: number;
}

interface InternalConstellationNode extends ConstellationNode {
  cx: number;
  cy: number;
  r: number;
  color: string;
}

export function computeConstellationLayout(
  nodes: ConstellationNode[] = [],
  currentContractAddress?: string,
  width: number = 600,
  height: number = 360,
  customPositions: Record<string, { x: number; y: number }> = {}
): InternalConstellationNode[] {
  if (!nodes || nodes.length === 0) return [];

  const centerX = width / 2;
  const centerY = height / 2;

  return nodes.map((node, i) => {
    const isCur =
      node.isCurrent ||
      (currentContractAddress
        ? node.contractAddress.toLowerCase() ===
          currentContractAddress.toLowerCase()
        : i === 0);

    const r = isCur ? 22 : 17;

    let defaultCx = centerX;
    let defaultCy = centerY;

    if (!isCur) {
      const angle = (i / Math.max(nodes.length - 1, 1)) * 2 * Math.PI;
      const radius = 100 + (i % 2) * 35;
      defaultCx = node.x ?? centerX + Math.cos(angle) * radius;
      defaultCy = node.y ?? centerY + Math.sin(angle) * radius;
    } else {
      defaultCx = node.x ?? centerX;
      defaultCy = node.y ?? centerY;
    }

    const custom = customPositions[node.contractAddress.toLowerCase()];
    const cx = custom?.x ?? defaultCx;
    const cy = custom?.y ?? defaultCy;

    let color = "#99F6E4";
    if (node.status === "passed") color = "#A7F3D0";
    else if (node.status === "rugged") color = "#FF6B6B";
    else if (node.status === "hold") color = "#FFD166";

    return {
      ...node,
      isCurrent: isCur,
      cx: Math.max(r + 5, Math.min(width - r - 5, cx)),
      cy: Math.max(r + 15, Math.min(height - r - 15, cy)),
      r,
      color,
    };
  });
}

export function ConstellationGraph({
  nodes = [],
  edges = [],
  currentContractAddress,
  height = 360,
  width = 600,
}: ConstellationGraphProps) {
  const [customPositions, setCustomPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [hoveredNode, setHoveredNode] =
    useState<InternalConstellationNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<ConstellationEdge | null>(
    null
  );
  const [dragAddress, setDragAddress] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const layoutNodes = useMemo(
    () =>
      computeConstellationLayout(
        nodes,
        currentContractAddress,
        width,
        height,
        customPositions
      ),
    [nodes, currentContractAddress, width, height, customPositions]
  );

  const nodeMap = useMemo(() => {
    const map = new Map<string, InternalConstellationNode>();
    for (const n of layoutNodes) {
      map.set(n.contractAddress.toLowerCase(), n);
    }
    return map;
  }, [layoutNodes]);

  const handlePointerDown = (
    address: string,
    node: InternalConstellationNode,
    e: React.PointerEvent
  ) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragAddress(address.toLowerCase());
    dragOffsetRef.current = {
      x: e.clientX - node.cx,
      y: e.clientY - node.cy,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragAddress) return;
    const node = layoutNodes.find(
      (n) => n.contractAddress.toLowerCase() === dragAddress
    );
    if (!node) return;

    const newCx = e.clientX - dragOffsetRef.current.x;
    const newCy = e.clientY - dragOffsetRef.current.y;

    const boundedX = Math.max(node.r + 5, Math.min(width - node.r - 5, newCx));
    const boundedY = Math.max(
      node.r + 15,
      Math.min(height - node.r - 15, newCy)
    );

    setCustomPositions((prev) => ({
      ...prev,
      [dragAddress]: { x: boundedX, y: boundedY },
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragAddress) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {}
      setDragAddress(null);
    }
  };

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] p-4 font-mono text-xs text-[#A7F3D0]">
        No constellation connections detected
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] p-4 sm:p-5 shadow-xl font-sans">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(153,246,228,0.2)] pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
          <span>Constellation Graph</span>
          <span className="text-[11px] text-[#A7F3D0] font-mono">
            ({layoutNodes.length} connected dossiers)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#99F6E4]" />
            <span className="text-[#A7F3D0]">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-[#C084FC]" />
            <span className="text-[#A7F3D0]">Hypothesis</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#99F6E4]" />
            <span className="text-[#A7F3D0]">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#A7F3D0]" />
            <span className="text-[#A7F3D0]">Passed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#FF6B6B]" />
            <span className="text-[#A7F3D0]">Rugged</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full touch-none select-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {edges.map((edge, idx) => {
            const src = nodeMap.get(edge.source.toLowerCase());
            const tgt = nodeMap.get(edge.target.toLowerCase());
            if (!src || !tgt) return null;

            const isConfirmed = edge.type === "confirmed";
            const isHovered = hoveredEdge === edge;

            return (
              <g
                key={`${edge.source}-${edge.target}-${idx}`}
                onMouseEnter={() => setHoveredEdge(edge)}
                onMouseLeave={() => setHoveredEdge(null)}
                className="cursor-pointer"
              >
                <line
                  x1={src.cx}
                  y1={src.cy}
                  x2={tgt.cx}
                  y2={tgt.cy}
                  stroke="transparent"
                  strokeWidth={14}
                />
                <line
                  x1={src.cx}
                  y1={src.cy}
                  x2={tgt.cx}
                  y2={tgt.cy}
                  stroke={isHovered ? "#FFFDF7" : isConfirmed ? "#99F6E4" : "#C084FC"}
                  strokeWidth={isHovered ? 3 : isConfirmed ? 2 : 1.5}
                  strokeDasharray={isConfirmed ? undefined : "4 4"}
                  className="pointer-events-none transition-colors duration-150"
                  opacity={isHovered ? 1 : 0.7}
                />
              </g>
            );
          })}

          {layoutNodes.map((n) => {
            const isHovered =
              hoveredNode?.contractAddress.toLowerCase() ===
              n.contractAddress.toLowerCase();

            return (
              <g
                key={n.contractAddress}
                onPointerDown={(e) => handlePointerDown(n.contractAddress, n, e)}
                onMouseEnter={() => setHoveredNode(n)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-grab active:cursor-grabbing"
              >
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r={n.r + 6}
                  fill="transparent"
                />

                {n.isCurrent && (
                  <circle
                    cx={n.cx}
                    cy={n.cy}
                    r={n.r + 5}
                    fill="none"
                    stroke="#FFFDF7"
                    strokeWidth="2.5"
                    className="animate-pulse pointer-events-none"
                  />
                )}

                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r={isHovered ? n.r + 3 : n.r}
                  fill={n.color}
                  stroke={isHovered ? "#FFFDF7" : "#042F2E"}
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="pointer-events-none transition-all duration-150"
                />

                <text
                  x={n.cx}
                  y={n.cy + 3.5}
                  textAnchor="middle"
                  fill="#042F2E"
                  className="pointer-events-none font-mono text-[10px] font-bold select-none"
                >
                  ${n.symbol.slice(0, 5)}
                </text>

                <text
                  x={n.cx}
                  y={n.cy + n.r + 12}
                  textAnchor="middle"
                  className="pointer-events-none fill-[#FFFDF7] font-sans text-[10px] font-semibold select-none"
                >
                  ${n.symbol}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredNode && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-[rgba(153,246,228,0.3)] bg-[#042F2E]/95 p-3 font-sans text-xs shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-[#FFFDF7]">
              <span>${hoveredNode.symbol}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold"
                style={{
                  backgroundColor: `${hoveredNode.color}20`,
                  color: hoveredNode.color,
                }}
              >
                {hoveredNode.status || "active"}
              </span>
              {hoveredNode.isCurrent && (
                <span className="rounded-full bg-[#064E4A] border border-[rgba(153,246,228,0.3)] px-2 py-0.5 text-[9px] text-[#FFFDF7] font-bold">
                  CURRENT
                </span>
              )}
            </div>
            <div className="mt-1 text-[10px] text-[#A7F3D0] font-mono">
              {hoveredNode.contractAddress}
            </div>
            <div className="mt-1.5 flex gap-2">
              <Link
                href={`/d/${hoveredNode.contractAddress}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#99F6E4] hover:underline"
              >
                <span>Open Dossier</span>
                <IconArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {hoveredEdge && (
          <div className="pointer-events-none absolute top-3 right-3 rounded-xl border border-[rgba(153,246,228,0.3)] bg-[#042F2E]/95 px-3 py-2 font-sans text-xs shadow-xl backdrop-blur-md">
            <span className="font-bold uppercase text-[#FFFDF7]">
              {hoveredEdge.type} Connection
            </span>
            {hoveredEdge.reason && (
              <div className="text-[10px] text-[#A7F3D0] mt-0.5">
                {hoveredEdge.reason}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
