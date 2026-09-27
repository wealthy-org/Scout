"use client";

import React, { useState } from "react";

export interface TradeCandleData {
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isBuy: boolean;
  isGraduation?: boolean;
  txHash?: string;
  timestamp?: number | string;
}

export interface TradeFlowChartProps {
  candles?: TradeCandleData[];
  graduationIndex?: number | null;
  height?: number;
  width?: number;
}

export function TradeFlowChart({
  candles = [],
  graduationIndex = null,
  height = 320,
  width = 800,
}: TradeFlowChartProps) {
  const [hoveredCandle, setHoveredCandle] = useState<TradeCandleData | null>(null);

  if (!candles || candles.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-4 font-mono text-xs text-[#A7F3D0]">
        No trade flow data available
      </div>
    );
  }

  const padding = { top: 25, right: 60, bottom: 40, left: 60 };
  const plotWidth = width - padding.left - padding.right;
  const priceHeight = (height - padding.top - padding.bottom) * 0.7;
  const volumeHeight = (height - padding.top - padding.bottom) * 0.25;
  const gap = (height - padding.top - padding.bottom) * 0.05;

  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map((c) => c.volume), 1);

  const candleSpacing = plotWidth / candles.length;
  const candleWidth = Math.max(candleSpacing * 0.65, 3);

  const getYForPrice = (p: number) => {
    const norm = (p - minPrice) / priceRange;
    return padding.top + priceHeight - norm * priceHeight;
  };

  const getYForVolume = (v: number) => {
    const norm = v / maxVolume;
    const volBottom = padding.top + priceHeight + gap + volumeHeight;
    return volBottom - norm * volumeHeight;
  };

  const volBottom = padding.top + priceHeight + gap + volumeHeight;

  return (
    <div className="relative w-full rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] p-4 sm:p-5 shadow-xl font-sans">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFFDF7]">
            Trade Flow (Market Cap per Trade)
          </span>
          <span className="text-[11px] text-[#A7F3D0] font-mono">
            {candles.length} trades recorded
          </span>
        </div>
        {hoveredCandle && (
          <div className="font-mono text-xs text-[#99F6E4]">
            Trade #{hoveredCandle.index} | Close: ${hoveredCandle.close.toLocaleString()} | Vol: ${hoveredCandle.volume.toLocaleString()}
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[600px] select-none"
        >
          <line
            x1={padding.left}
            y1={padding.top}
            x2={width - padding.right}
            y2={padding.top}
            stroke="rgba(153,246,228,0.2)"
            strokeDasharray="2 2"
          />
          <line
            x1={padding.left}
            y1={padding.top + priceHeight / 2}
            x2={width - padding.right}
            y2={padding.top + priceHeight / 2}
            stroke="rgba(153,246,228,0.2)"
            strokeDasharray="2 2"
          />
          <line
            x1={padding.left}
            y1={padding.top + priceHeight}
            x2={width - padding.right}
            y2={padding.top + priceHeight}
            stroke="rgba(153,246,228,0.2)"
            strokeDasharray="2 2"
          />
          <line
            x1={padding.left}
            y1={volBottom}
            x2={width - padding.right}
            y2={volBottom}
            stroke="rgba(153,246,228,0.2)"
          />

          <text
            x={width - padding.right + 8}
            y={padding.top + 4}
            className="fill-[#A7F3D0] font-mono text-[10px]"
          >
            ${Math.round(maxPrice).toLocaleString()}
          </text>
          <text
            x={width - padding.right + 8}
            y={padding.top + priceHeight / 2 + 4}
            className="fill-[#A7F3D0] font-mono text-[10px]"
          >
            ${Math.round((maxPrice + minPrice) / 2).toLocaleString()}
          </text>
          <text
            x={width - padding.right + 8}
            y={padding.top + priceHeight + 4}
            className="fill-[#A7F3D0] font-mono text-[10px]"
          >
            ${Math.round(minPrice).toLocaleString()}
          </text>

          {candles.map((candle, i) => {
            const cx = padding.left + (i + 0.5) * candleSpacing;
            const yHigh = getYForPrice(candle.high);
            const yLow = getYForPrice(candle.low);
            const yOpen = getYForPrice(candle.open);
            const yClose = getYForPrice(candle.close);
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);
            const color = candle.isBuy ? "#99F6E4" : "#FF6B6B";

            const yVol = getYForVolume(candle.volume);
            const vHeight = Math.max(volBottom - yVol, 1);

            const isGrad =
              candle.isGraduation ||
              (graduationIndex !== null && candle.index === graduationIndex);

            return (
              <g
                key={candle.index || i}
                onMouseEnter={() => setHoveredCandle(candle)}
                onMouseLeave={() => setHoveredCandle(null)}
                className="cursor-pointer"
              >
                <line
                  x1={cx}
                  y1={yHigh}
                  x2={cx}
                  y2={yLow}
                  stroke={color}
                  strokeWidth="1.5"
                />

                <rect
                  x={cx - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                  rx="1"
                />

                <rect
                  x={cx - candleWidth / 2}
                  y={yVol}
                  width={candleWidth}
                  height={vHeight}
                  fill={color}
                  opacity="0.4"
                  rx="1"
                />

                {isGrad && (
                  <g>
                    <line
                      x1={cx}
                      y1={padding.top - 10}
                      x2={cx}
                      y2={volBottom}
                      stroke="#FFD166"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <rect
                      x={cx - 38}
                      y={padding.top - 20}
                      width={76}
                      height={18}
                      fill="#FFD166"
                      rx="9"
                    />
                    <text
                      x={cx}
                      y={padding.top - 7}
                      textAnchor="middle"
                      fill="#042F2E"
                      className="font-sans text-[9px] font-extrabold tracking-wider"
                    >
                      GRADUATED
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
