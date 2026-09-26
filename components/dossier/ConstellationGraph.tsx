"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";

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

    let color = "#06b6d4";
    if (node.status === "passed") color = "#10b981";
    else if (node.status === "rugged") color = "#ef4444";
    else if (node.status === "hold") color = "#f59e0b";

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
      <div className="flex h-64 w-full items-center justify-center border border-border bg-surface p-4 font-mono text-xs text-ink-muted">
        No constellation connections detected
      </div>
    );
  }

  return (
    <div className="relative border border-border bg-surface p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink">
          <span>Constellation Graph</span>
          <span className="text-[10px] text-ink-muted">
            ({layoutNodes.length} connected dossiers)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-neutral-400" />
            <span className="text-ink-muted">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-neutral-400" />
            <span className="text-ink-muted">Hypothesis</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#06b6d4]" />
            <span className="text-ink-muted">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span className="text-ink-muted">Passed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
            <span className="text-ink-muted">Rugged</span>
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
                  stroke="#a3a3a3"
                  strokeWidth={isConfirmed ? 2 : 1.5}
                  strokeDasharray={isConfirmed ? undefined : "4 4"}
                  className="transition-colors hover:stroke-cyan-500"
                />
              </g>
            );
          })}

          {layoutNodes.map((n) => (
            <g
              key={n.contractAddress}
              onPointerDown={(e) => handlePointerDown(n.contractAddress, n, e)}
              onMouseEnter={() => setHoveredNode(n)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-grab active:cursor-grabbing"
            >
              {n.isCurrent && (
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r={n.r + 5}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="dark:stroke-white"
                />
              )}

              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.r}
                fill={n.color}
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-transform duration-75 hover:scale-110"
              />

              <text
                x={n.cx}
                y={n.cy + 3.5}
                textAnchor="middle"
                fill="#ffffff"
                className="pointer-events-none font-mono text-[10px] font-bold"
              >
                ${n.symbol.slice(0, 5)}
              </text>

              <text
                x={n.cx}
                y={n.cy + n.r + 12}
                textAnchor="middle"
                className="pointer-events-none fill-ink font-mono text-[9px] font-semibold"
              >
                ${n.symbol}
              </text>
            </g>
          ))}
        </svg>

        {hoveredNode && (
          <div className="pointer-events-none absolute bottom-3 left-3 border border-border bg-surface p-2 font-mono text-xs shadow-md">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <span>${hoveredNode.symbol}</span>
              <span
                className="px-1 text-[9px] uppercase"
                style={{
                  backgroundColor: `${hoveredNode.color}20`,
                  color: hoveredNode.color,
                }}
              >
                {hoveredNode.status || "active"}
              </span>
              {hoveredNode.isCurrent && (
                <span className="rounded bg-neutral-200 px-1 text-[9px] text-ink-muted dark:bg-neutral-800">
                  CURRENT
                </span>
              )}
            </div>
            <div className="mt-1 text-[10px] text-ink-muted">
              {hoveredNode.contractAddress}
            </div>
            <div className="mt-1 flex gap-2">
              <Link
                href={`/d/${hoveredNode.contractAddress}`}
                className="text-[10px] font-bold text-cyan-600 underline"
              >
                Open Dossier &rarr;
              </Link>
            </div>
          </div>
        )}

        {hoveredEdge && (
          <div className="pointer-events-none absolute top-3 right-3 rounded border border-border bg-surface px-2.5 py-1.5 font-mono text-xs shadow-md">
            <span className="font-bold uppercase text-ink">
              {hoveredEdge.type} Connection
            </span>
            {hoveredEdge.reason && (
              <div className="text-[10px] text-ink-muted">
                {hoveredEdge.reason}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
