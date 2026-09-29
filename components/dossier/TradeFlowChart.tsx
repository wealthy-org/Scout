import React, { useState, useMemo, useRef, useCallback } from "react";

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
  tokenSymbol?: string;
}

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1D" | "ALL";
type ChartType = "candles" | "area" | "line" | "heikin-ashi";
type OverlayIndicator = "ma" | "bollinger" | "rsi" | "volume";
type DrawingTool = "cursor" | "trendline" | "horizontal" | "fib";

export function TradeFlowChart({
  candles = [],
  graduationIndex = null,
  height = 420,
  width = 860,
  tokenSymbol = "TOKEN",
}: TradeFlowChartProps) {
  const [hoveredCandle, setHoveredCandle] = useState<TradeCandleData | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("15m");
  const [chartType, setChartType] = useState<ChartType>("candles");
  const [activeOverlays, setActiveOverlays] = useState<Set<OverlayIndicator>>(
    new Set(["ma", "volume"])
  );
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("cursor");
  const [isLogScale, setIsLogScale] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const [customTrendline, setCustomTrendline] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const toggleOverlay = (overlay: OverlayIndicator) => {
    setActiveOverlays((prev) => {
      const next = new Set(prev);
      if (next.has(overlay)) {
        next.delete(overlay);
      } else {
        next.add(overlay);
      }
      return next;
    });
  };

  const processedCandles = useMemo(() => {
    if (!candles || candles.length === 0) return [];

    let raw = [...candles];

    if (timeframe === "1m") {
      raw = candles.slice(-16);
    } else if (timeframe === "5m") {
      raw = candles.slice(-20);
    } else if (timeframe === "15m") {
      raw = candles;
    } else if (timeframe === "1h" || timeframe === "4h" || timeframe === "1D") {
      const step = timeframe === "1h" ? 2 : timeframe === "4h" ? 3 : 4;
      const aggregated: TradeCandleData[] = [];
      for (let i = 0; i < candles.length; i += step) {
        const chunk = candles.slice(i, i + step);
        if (chunk.length === 0) continue;
        const open = chunk[0].open;
        const close = chunk[chunk.length - 1].close;
        const high = Math.max(...chunk.map((c) => c.high));
        const low = Math.min(...chunk.map((c) => c.low));
        const volume = chunk.reduce((sum, c) => sum + c.volume, 0);
        const hasGrad = chunk.some((c) => c.isGraduation);
        aggregated.push({
          index: aggregated.length + 1,
          open,
          high,
          low,
          close,
          volume,
          isBuy: close >= open,
          isGraduation: hasGrad,
          txHash: chunk[chunk.length - 1].txHash,
          timestamp: chunk[chunk.length - 1].timestamp,
        });
      }
      raw = aggregated;
    }

    if (chartType === "heikin-ashi") {
      const haCandles: TradeCandleData[] = [];
      let prevHAOpen = raw[0].open;
      let prevHAClose = raw[0].close;

      raw.forEach((c, idx) => {
        const haClose = (c.open + c.high + c.low + c.close) / 4;
        const haOpen = idx === 0 ? (c.open + c.close) / 2 : (prevHAOpen + prevHAClose) / 2;
        const haHigh = Math.max(c.high, haOpen, haClose);
        const haLow = Math.min(c.low, haOpen, haClose);
        haCandles.push({
          ...c,
          open: haOpen,
          close: haClose,
          high: haHigh,
          low: haLow,
          isBuy: haClose >= haOpen,
        });
        prevHAOpen = haOpen;
        prevHAClose = haClose;
      });
      return haCandles;
    }

    return raw;
  }, [candles, timeframe, chartType]);

  const showRsi = activeOverlays.has("rsi");
  const chartHeight = isExpanded ? 540 : height;
  const padding = { top: 35, right: 75, bottom: showRsi ? 90 : 45, left: 20 };
  const plotWidth = width - padding.left - padding.right;
  const availableHeight = chartHeight - padding.top - padding.bottom;

  const priceHeight = showRsi ? availableHeight * 0.65 : availableHeight * 0.72;
  const volumeHeight = showRsi ? availableHeight * 0.18 : availableHeight * 0.22;
  const rsiHeight = showRsi ? 60 : 0;
  const gap = 12;

  const minPrice = useMemo(() => {
    if (processedCandles.length === 0) return 0;
    const min = Math.min(...processedCandles.map((c) => c.low));
    return isLogScale ? Math.max(1, min * 0.95) : min * 0.95;
  }, [processedCandles, isLogScale]);

  const maxPrice = useMemo(() => {
    if (processedCandles.length === 0) return 100;
    const max = Math.max(...processedCandles.map((c) => c.high));
    return max * 1.05;
  }, [processedCandles]);

  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = useMemo(() => {
    if (processedCandles.length === 0) return 1;
    return Math.max(...processedCandles.map((c) => c.volume), 1);
  }, [processedCandles]);

  const candleSpacing = processedCandles.length > 0 ? plotWidth / processedCandles.length : plotWidth;
  const candleWidth = Math.max(candleSpacing * 0.68, 3.5);

  const getYForPrice = useCallback(
    (p: number) => {
      if (isLogScale) {
        const logMin = Math.log10(Math.max(1, minPrice));
        const logMax = Math.log10(Math.max(2, maxPrice));
        const logP = Math.log10(Math.max(1, p));
        const norm = (logP - logMin) / (logMax - logMin || 1);
        return padding.top + priceHeight - norm * priceHeight;
      }
      const norm = (p - minPrice) / priceRange;
      return padding.top + priceHeight - norm * priceHeight;
    },
    [minPrice, maxPrice, priceRange, isLogScale, padding.top, priceHeight]
  );

  const volBottom = padding.top + priceHeight + gap + volumeHeight;
  const getYForVolume = (v: number) => {
    const norm = v / maxVolume;
    return volBottom - norm * volumeHeight;
  };

  const rsiTop = volBottom + 16;
  const rsiBottom = rsiTop + rsiHeight;

  const ma7Points = useMemo(() => {
    if (!activeOverlays.has("ma") || processedCandles.length < 3) return null;
    const points: string[] = [];
    for (let i = 0; i < processedCandles.length; i++) {
      const slice = processedCandles.slice(Math.max(0, i - 6), i + 1);
      const avg = slice.reduce((sum, c) => sum + c.close, 0) / slice.length;
      const x = padding.left + (i + 0.5) * candleSpacing;
      const y = getYForPrice(avg);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }, [processedCandles, activeOverlays, candleSpacing, padding.left, getYForPrice]);

  const ma25Points = useMemo(() => {
    if (!activeOverlays.has("ma") || processedCandles.length < 5) return null;
    const points: string[] = [];
    for (let i = 0; i < processedCandles.length; i++) {
      const slice = processedCandles.slice(Math.max(0, i - 14), i + 1);
      const avg = slice.reduce((sum, c) => sum + c.close, 0) / slice.length;
      const x = padding.left + (i + 0.5) * candleSpacing;
      const y = getYForPrice(avg);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }, [processedCandles, activeOverlays, candleSpacing, padding.left, getYForPrice]);

  const bollingerBands = useMemo(() => {
    if (!activeOverlays.has("bollinger") || processedCandles.length < 5) return null;
    const upper: string[] = [];
    const lower: string[] = [];
    for (let i = 0; i < processedCandles.length; i++) {
      const slice = processedCandles.slice(Math.max(0, i - 10), i + 1);
      const mean = slice.reduce((sum, c) => sum + c.close, 0) / slice.length;
      const variance = slice.reduce((sum, c) => sum + Math.pow(c.close - mean, 2), 0) / slice.length;
      const stdDev = Math.sqrt(variance);
      const x = padding.left + (i + 0.5) * candleSpacing;
      upper.push(`${x},${getYForPrice(mean + stdDev * 1.8)}`);
      lower.push(`${x},${getYForPrice(Math.max(0, mean - stdDev * 1.8))}`);
    }
    return {
      upperPath: upper.join(" "),
      lowerPath: lower.join(" "),
      areaPath: `M ${upper.join(" L ")} L ${lower.reverse().join(" L ")} Z`,
    };
  }, [processedCandles, activeOverlays, candleSpacing, padding.left, getYForPrice]);

  const rsiPoints = useMemo(() => {
    if (!showRsi || processedCandles.length < 4) return null;
    const points: string[] = [];
    for (let i = 0; i < processedCandles.length; i++) {
      const slice = processedCandles.slice(Math.max(0, i - 6), i + 1);
      let gains = 0;
      let losses = 0;
      for (let j = 1; j < slice.length; j++) {
        const diff = slice[j].close - slice[j - 1].close;
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const avgGain = gains / Math.max(1, slice.length - 1);
      const avgLoss = losses / Math.max(1, slice.length - 1);
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsiVal = 100 - 100 / (1 + rs);
      const x = padding.left + (i + 0.5) * candleSpacing;
      const yNorm = rsiVal / 100;
      const y = rsiBottom - yNorm * rsiHeight;
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }, [processedCandles, showRsi, candleSpacing, padding.left, rsiBottom, rsiHeight]);

  const areaGradientPath = useMemo(() => {
    if (processedCandles.length === 0) return "";
    const points = processedCandles.map((c, i) => {
      const x = padding.left + (i + 0.5) * candleSpacing;
      const y = getYForPrice(c.close);
      return `${x},${y}`;
    });
    const firstX = padding.left + 0.5 * candleSpacing;
    const lastX = padding.left + (processedCandles.length - 0.5) * candleSpacing;
    const bottomY = padding.top + priceHeight;
    return `M ${firstX},${bottomY} L ${points.join(" L ")} L ${lastX},${bottomY} Z`;
  }, [processedCandles, candleSpacing, padding.left, padding.top, priceHeight, getYForPrice]);

  const linePath = useMemo(() => {
    if (processedCandles.length === 0) return "";
    return processedCandles
      .map((c, i) => {
        const x = padding.left + (i + 0.5) * candleSpacing;
        const y = getYForPrice(c.close);
        return `${x},${y}`;
      })
      .join(" ");
  }, [processedCandles, candleSpacing, padding.left, getYForPrice]);

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * chartHeight;
    setCrosshairPos({ x, y });

    const candleIdx = Math.floor((x - padding.left) / candleSpacing);
    if (candleIdx >= 0 && candleIdx < processedCandles.length) {
      setHoveredCandle(processedCandles[candleIdx]);
    }

    if (drawingTool === "trendline" && drawStart) {
      setCustomTrendline({
        x1: drawStart.x,
        y1: drawStart.y,
        x2: x,
        y2: y,
      });
    }
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (drawingTool === "trendline" && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * width;
      const y = ((e.clientY - rect.top) / rect.height) * chartHeight;
      setDrawStart({ x, y });
    }
  };

  const handleSvgMouseUp = () => {
    if (drawingTool === "trendline") {
      setDrawStart(null);
    }
  };

  const activeDisplayCandle = hoveredCandle || processedCandles[processedCandles.length - 1] || null;
  const candleChangePct = activeDisplayCandle
    ? ((activeDisplayCandle.close - activeDisplayCandle.open) / (activeDisplayCandle.open || 1)) * 100
    : 0;

  if (!candles || candles.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-4 font-mono text-xs text-[#A7F3D0]">
        No trade flow data available
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3 sm:p-5 shadow-2xl font-sans space-y-3">
      
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(153,246,228,0.15)] pb-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm sm:text-base text-[#FFFDF7] tracking-tight">
              ${tokenSymbol} / USDG
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#14B8A6]/20 text-[#99F6E4] border border-[#14B8A6]/30">
              PONS V2
            </span>
          </div>

          <div className="flex items-center gap-0.5 bg-[#064E4A] p-0.5 rounded-lg border border-[rgba(153,246,228,0.2)] text-[10px] sm:text-xs font-mono">
            {(["1m", "5m", "15m", "1h", "4h", "1D"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? "bg-[#FFD166] text-[#042F2E] shadow"
                    : "text-[#A7F3D0] hover:text-[#FFFDF7]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-0.5 bg-[#064E4A] p-0.5 rounded-lg border border-[rgba(153,246,228,0.2)] text-[10px] sm:text-xs font-mono">
            {(["candles", "area", "line", "heikin-ashi"] as const).map((ct) => (
              <button
                key={ct}
                onClick={() => setChartType(ct)}
                className={`px-2 py-0.5 rounded capitalize font-medium transition-all cursor-pointer ${
                  chartType === ct
                    ? "bg-[#14B8A6] text-[#042F2E] font-bold shadow"
                    : "text-[#A7F3D0] hover:text-[#FFFDF7]"
                }`}
              >
                {ct === "heikin-ashi" ? "HA" : ct}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => toggleOverlay("ma")}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
              activeOverlays.has("ma")
                ? "bg-[#FFD166]/20 border-[#FFD166] text-[#FFD166]"
                : "bg-[#064E4A]/60 border-[rgba(153,246,228,0.2)] text-[#A7F3D0]"
            }`}
          >
            MA (7/25)
          </button>

          <button
            onClick={() => toggleOverlay("bollinger")}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
              activeOverlays.has("bollinger")
                ? "bg-[#14B8A6]/20 border-[#99F6E4] text-[#99F6E4]"
                : "bg-[#064E4A]/60 border-[rgba(153,246,228,0.2)] text-[#A7F3D0]"
            }`}
          >
            BANDS
          </button>

          <button
            onClick={() => toggleOverlay("rsi")}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
              activeOverlays.has("rsi")
                ? "bg-[#C084FC]/20 border-[#C084FC] text-[#C084FC]"
                : "bg-[#064E4A]/60 border-[rgba(153,246,228,0.2)] text-[#A7F3D0]"
            }`}
          >
            RSI 14
          </button>

          <button
            onClick={() => setIsLogScale(!isLogScale)}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
              isLogScale
                ? "bg-[#99F6E4] text-[#042F2E] border-[#99F6E4]"
                : "bg-[#064E4A]/60 border-[rgba(153,246,228,0.2)] text-[#A7F3D0]"
            }`}
          >
            LOG
          </button>

          <button
            onClick={() => setDrawingTool(drawingTool === "cursor" ? "trendline" : "cursor")}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
              drawingTool === "trendline"
                ? "bg-[#FF9F43] text-[#042F2E] border-[#FF9F43]"
                : "bg-[#064E4A]/60 border-[rgba(153,246,228,0.2)] text-[#A7F3D0]"
            }`}
          >
            {drawingTool === "trendline" ? "DRAW: ON" : "DRAW"}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded bg-[#064E4A] hover:bg-[#14B8A6]/30 text-[#A7F3D0] hover:text-[#FFFDF7] border border-[rgba(153,246,228,0.2)] text-[11px] cursor-pointer"
            title="Expand Chart"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A7F3D0]">
          {activeDisplayCandle && (
            <>
              <div>
                O: <span className="font-bold text-[#FFFDF7]">${activeDisplayCandle.open.toLocaleString()}</span>
              </div>
              <div>
                H: <span className="font-bold text-[#99F6E4]">${activeDisplayCandle.high.toLocaleString()}</span>
              </div>
              <div>
                L: <span className="font-bold text-[#FF6B6B]">${activeDisplayCandle.low.toLocaleString()}</span>
              </div>
              <div>
                C: <span className="font-bold text-[#FFFDF7]">${activeDisplayCandle.close.toLocaleString()}</span>
              </div>
              <div>
                Vol: <span className="font-bold text-[#FFD166]">${activeDisplayCandle.volume.toLocaleString()}</span>
              </div>
              <div className={`font-bold ${candleChangePct >= 0 ? "text-[#99F6E4]" : "text-[#FF6B6B]"}`}>
                {candleChangePct >= 0 ? "+" : ""}{candleChangePct.toFixed(2)}%
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#A7F3D0]">
          {activeOverlays.has("ma") && (
            <>
              <span className="flex items-center gap-1 text-[#FFD166]">
                <span className="w-2 h-0.5 bg-[#FFD166]" /> MA7
              </span>
              <span className="flex items-center gap-1 text-[#99F6E4]">
                <span className="w-2 h-0.5 bg-[#99F6E4]" /> MA25
              </span>
            </>
          )}
          {activeOverlays.has("bollinger") && (
            <span className="flex items-center gap-1 text-[#C084FC]">
              <span className="w-2 h-0.5 bg-[#C084FC]" /> BOLL (20, 2)
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl border border-[rgba(153,246,228,0.15)] bg-[#03201F]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${chartHeight}`}
          onMouseMove={handleSvgMouseMove}
          onMouseDown={handleSvgMouseDown}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={() => {
            setCrosshairPos(null);
            setHoveredCandle(null);
          }}
          className="h-auto w-full select-none cursor-crosshair"
        >
          <defs>
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0D746E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#03201F" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bullCandleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#99F6E4" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
            <linearGradient id="bearCandleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#E05252" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = padding.top + priceHeight * pct;
            return (
              <line
                key={idx}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(153,246,228,0.12)"
                strokeDasharray="2 4"
              />
            );
          })}

          <line
            x1={padding.left}
            y1={volBottom}
            x2={width - padding.right}
            y2={volBottom}
            stroke="rgba(153,246,228,0.2)"
          />

          {[0, 0.33, 0.66, 1].map((pct, idx) => {
            const price = minPrice + priceRange * (1 - pct);
            const y = padding.top + priceHeight * pct;
            return (
              <text
                key={idx}
                x={width - padding.right + 6}
                y={y + 3.5}
                className="fill-[#A7F3D0] font-mono text-[9px] select-none"
              >
                ${Math.round(price).toLocaleString()}
              </text>
            );
          })}

          {bollingerBands && (
            <g>
              <path d={bollingerBands.areaPath} fill="#C084FC" fillOpacity="0.08" />
              <path d={`M ${bollingerBands.upperPath}`} fill="none" stroke="#C084FC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <path d={`M ${bollingerBands.lowerPath}`} fill="none" stroke="#C084FC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            </g>
          )}

          {chartType === "area" && areaGradientPath && (
            <g>
              <path d={areaGradientPath} fill="url(#areaGlow)" />
              <polyline
                points={linePath}
                fill="none"
                stroke="#99F6E4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {chartType === "line" && linePath && (
            <polyline
              points={linePath}
              fill="none"
              stroke="#99F6E4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {(chartType === "candles" || chartType === "heikin-ashi") &&
            processedCandles.map((candle, i) => {
              const cx = padding.left + (i + 0.5) * candleSpacing;
              const yHigh = getYForPrice(candle.high);
              const yLow = getYForPrice(candle.low);
              const yOpen = getYForPrice(candle.open);
              const yClose = getYForPrice(candle.close);
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2.5);
              const color = candle.isBuy ? "#99F6E4" : "#FF6B6B";
              const gradFill = candle.isBuy ? "url(#bullCandleGrad)" : "url(#bearCandleGrad)";

              const yVol = getYForVolume(candle.volume);
              const vHeight = Math.max(volBottom - yVol, 1.5);

              const isGrad =
                candle.isGraduation ||
                (graduationIndex !== null && candle.index === graduationIndex);

              return (
                <g key={candle.index || i} className="transition-opacity">
                  <line
                    x1={cx}
                    y1={yHigh}
                    x2={cx}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <rect
                    x={cx - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={gradFill}
                    stroke={color}
                    strokeWidth="0.5"
                    rx="1.5"
                  />

                  {activeOverlays.has("volume") && (
                    <rect
                      x={cx - candleWidth / 2}
                      y={yVol}
                      width={candleWidth}
                      height={vHeight}
                      fill={color}
                      opacity={hoveredCandle?.index === candle.index ? "0.85" : "0.4"}
                      rx="1"
                    />
                  )}

                  {isGrad && (
                    <g>
                      <line
                        x1={cx}
                        y1={padding.top - 12}
                        x2={cx}
                        y2={volBottom}
                        stroke="#FFD166"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <rect
                        x={cx - 36}
                        y={padding.top - 24}
                        width={72}
                        height={18}
                        fill="#FFD166"
                        rx="9"
                      />
                      <text
                        x={cx}
                        y={padding.top - 11}
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

          {ma7Points && (
            <polyline
              points={ma7Points}
              fill="none"
              stroke="#FFD166"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {ma25Points && (
            <polyline
              points={ma25Points}
              fill="none"
              stroke="#99F6E4"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {customTrendline && (
            <line
              x1={customTrendline.x1}
              y1={customTrendline.y1}
              x2={customTrendline.x2}
              y2={customTrendline.y2}
              stroke="#FFD166"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
          )}

          {showRsi && (
            <g>
              <line x1={padding.left} y1={rsiTop} x2={width - padding.right} y2={rsiTop} stroke="rgba(153,246,228,0.2)" />
              <line x1={padding.left} y1={rsiTop + rsiHeight * 0.3} x2={width - padding.right} y2={rsiTop + rsiHeight * 0.3} stroke="#FF6B6B" strokeDasharray="2 4" opacity="0.4" />
              <line x1={padding.left} y1={rsiTop + rsiHeight * 0.7} x2={width - padding.right} y2={rsiTop + rsiHeight * 0.7} stroke="#99F6E4" strokeDasharray="2 4" opacity="0.4" />
              <line x1={padding.left} y1={rsiBottom} x2={width - padding.right} y2={rsiBottom} stroke="rgba(153,246,228,0.2)" />

              <text x={width - padding.right + 6} y={rsiTop + rsiHeight * 0.3 + 3} className="fill-[#FF6B6B] font-mono text-[8px]">
                70
              </text>
              <text x={width - padding.right + 6} y={rsiTop + rsiHeight * 0.7 + 3} className="fill-[#99F6E4] font-mono text-[8px]">
                30
              </text>
              <text x={padding.left + 4} y={rsiTop + 10} className="fill-[#C084FC] font-mono text-[9px] font-bold">
                RSI 14
              </text>

              {rsiPoints && (
                <polyline
                  points={rsiPoints}
                  fill="none"
                  stroke="#C084FC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          )}

          {crosshairPos && (
            <g>
              <line
                x1={crosshairPos.x}
                y1={padding.top}
                x2={crosshairPos.x}
                y2={showRsi ? rsiBottom : volBottom}
                stroke="rgba(255,209,102,0.6)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <line
                x1={padding.left}
                y1={crosshairPos.y}
                x2={width - padding.right}
                y2={crosshairPos.y}
                stroke="rgba(255,209,102,0.6)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />

              {crosshairPos.y >= padding.top && crosshairPos.y <= padding.top + priceHeight && (
                <g>
                  <rect
                    x={width - padding.right + 2}
                    y={crosshairPos.y - 8}
                    width={padding.right - 4}
                    height={16}
                    fill="#FFD166"
                    rx="3"
                  />
                  <text
                    x={width - padding.right + 6}
                    y={crosshairPos.y + 3.5}
                    className="fill-[#042F2E] font-mono text-[9px] font-black"
                  >
                    ${Math.round(minPrice + priceRange * (1 - (crosshairPos.y - padding.top) / priceHeight)).toLocaleString()}
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(153,246,228,0.15)] pt-2.5 text-[11px] font-mono text-[#A7F3D0]">
        <div className="flex items-center gap-4">
          <span>
            Total Volume: <strong className="text-[#99F6E4]">${Math.round(candles.reduce((s, c) => s + c.volume, 0)).toLocaleString()}</strong>
          </span>
          <span>
            Trades: <strong className="text-[#FFFDF7]">{candles.length}</strong>
          </span>
          <span>
            Resolution: <strong className="text-[#FFD166]">{timeframe.toUpperCase()}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
            Robinhood RPC Live Feed
          </span>
        </div>
      </div>
    </div>
  );
}
