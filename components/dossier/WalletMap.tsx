"use client";

import React, { useState, useRef, useMemo } from "react";

export interface WalletBubbleItem {
  address: string;
  volume: number;
  netFlow: number;
  isDeployer?: boolean;
  isFeeRecipient?: boolean;
  isEarly?: boolean;
  x?: number;
  y?: number;
}

export interface WalletMapProps {
  wallets?: WalletBubbleItem[];
  deployerAddress?: string;
  height?: number;
  width?: number;
}

interface InternalBubble extends WalletBubbleItem {
  cx: number;
  cy: number;
  r: number;
}

export function computeWalletBubbles(
  wallets: WalletBubbleItem[] = [],
  deployerAddress?: string,
  width: number = 600,
  height: number = 360,
  customPositions: Record<string, { x: number; y: number }> = {}
): InternalBubble[] {
  if (!wallets || wallets.length === 0) return [];

  const maxVol = Math.max(...wallets.map((w) => w.volume), 1);
  const minVol = Math.min(...wallets.map((w) => w.volume), 0);
  const volSpan = maxVol - minVol || 1;

  const centerX = width / 2;
  const centerY = height / 2;

  return wallets.slice(0, 24).map((w, i) => {
    const norm = (w.volume - minVol) / volSpan;
    const r = 14 + norm * 24;

    const angle = (i / Math.min(wallets.length, 24)) * 2 * Math.PI;
    const radius = 60 + (i % 3) * 45;
    const defaultCx = w.x ?? centerX + Math.cos(angle) * radius;
    const defaultCy = w.y ?? centerY + Math.sin(angle) * radius;

    const custom = customPositions[w.address.toLowerCase()];
    const cx = custom?.x ?? defaultCx;
    const cy = custom?.y ?? defaultCy;

    const isDep =
      w.isDeployer ||
      (deployerAddress
        ? w.address.toLowerCase() === deployerAddress.toLowerCase()
        : false);

    return {
      ...w,
      isDeployer: isDep,
      cx: Math.max(r, Math.min(width - r, cx)),
      cy: Math.max(r, Math.min(height - r, cy)),
      r,
    };
  });
}

export function WalletMap({
  wallets = [],
  deployerAddress,
  height = 360,
  width = 600,
}: WalletMapProps) {
  const [customPositions, setCustomPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [hovered, setHovered] = useState<InternalBubble | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [dragAddress, setDragAddress] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const bubbles = useMemo(
    () =>
      computeWalletBubbles(
        wallets,
        deployerAddress,
        width,
        height,
        customPositions
      ),
    [wallets, deployerAddress, width, height, customPositions]
  );

  const handlePointerDown = (
    address: string,
    bubble: InternalBubble,
    e: React.PointerEvent
  ) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragAddress(address.toLowerCase());
    dragOffsetRef.current = {
      x: e.clientX - bubble.cx,
      y: e.clientY - bubble.cy,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragAddress) return;
    const bubble = bubbles.find(
      (b) => b.address.toLowerCase() === dragAddress
    );
    if (!bubble) return;

    const newCx = e.clientX - dragOffsetRef.current.x;
    const newCy = e.clientY - dragOffsetRef.current.y;

    const boundedX = Math.max(bubble.r, Math.min(width - bubble.r, newCx));
    const boundedY = Math.max(bubble.r, Math.min(height - bubble.r, newCy));

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

  const handleCopy = async (addr: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(addr);
      setCopiedAddress(addr);
      setTimeout(() => setCopiedAddress(null), 2000);
    }
  };

  if (!wallets || wallets.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center border border-border bg-surface p-4 font-mono text-xs text-ink-muted">
        No wallet data available
      </div>
    );
  }

  return (
    <div className="relative border border-border bg-surface p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink">
          <span>Wallet Map</span>
          <span className="text-[10px] text-ink-muted">
            ({bubbles.length} active nodes)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            <span className="text-ink-muted">Net Buyer</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
            <span className="text-ink-muted">Net Seller</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border border-[#eab308] bg-[#10b981]" />
            <span className="text-ink-muted">Deployer Ring</span>
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
          <defs>
            <radialGradient id="bubbleBuyer" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </radialGradient>
            <radialGradient id="bubbleSeller" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </radialGradient>
          </defs>

          {bubbles.map((b, i) => {
            const isBuyer = b.netFlow >= 0;
            const fill = isBuyer ? "#10b981" : "#ef4444";
            const shortAddr = `${b.address.slice(0, 4)}..${b.address.slice(-2)}`;

            return (
              <g
                key={b.address || i}
                onPointerDown={(e) => handlePointerDown(b.address, b, e)}
                onMouseEnter={() => setHovered(b)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleCopy(b.address)}
                className="cursor-grab active:cursor-grabbing"
              >
                {b.isDeployer && (
                  <circle
                    cx={b.cx}
                    cy={b.cy}
                    r={b.r + 4}
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2.5"
                    strokeDasharray="3 2"
                  />
                )}

                <circle
                  cx={b.cx}
                  cy={b.cy}
                  r={b.r}
                  fill={fill}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-transform duration-75 hover:scale-105"
                />

                {b.r >= 18 && (
                  <text
                    x={b.cx}
                    y={b.cy + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    className="pointer-events-none font-mono text-[9px] font-bold"
                  >
                    {shortAddr}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hovered && (
          <div className="pointer-events-none absolute bottom-3 left-3 border border-border bg-surface p-2 font-mono text-xs shadow-md">
            <div className="flex items-center gap-1 font-bold text-ink">
              <span>{hovered.address}</span>
              {hovered.isDeployer && (
                <span className="rounded bg-amber-500/20 px-1 text-[9px] text-amber-600 dark:text-amber-400">
                  DEPLOYER
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-ink-muted">
              <span>Vol: ${hovered.volume.toLocaleString()}</span>
              <span
                className={
                  hovered.netFlow >= 0
                    ? "font-bold text-emerald-600"
                    : "font-bold text-red-600"
                }
              >
                Net: {hovered.netFlow >= 0 ? "+" : ""}$
                {hovered.netFlow.toLocaleString()}
              </span>
            </div>
            <div className="mt-0.5 text-[9px] text-ink-muted">
              Click to copy address
            </div>
          </div>
        )}

        {copiedAddress && (
          <div className="pointer-events-none absolute top-3 right-3 rounded border border-emerald-500 bg-emerald-500/20 px-2 py-1 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow">
            Copied: {copiedAddress.slice(0, 6)}...{copiedAddress.slice(-4)}
          </div>
        )}
      </div>
    </div>
  );
}
