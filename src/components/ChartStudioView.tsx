import React, { useState, useMemo, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { generateCandlesForSymbol } from '../data/marketData';
import { CandleData } from '../types/market';
import {
  MousePointer,
  Slash,
  Minus,
  Percent,
  Type,
  Trash2,
  TrendingUp,
  Layers,
  Settings,
  Camera,
  Maximize2,
  RefreshCw,
  Plus
} from 'lucide-react';

export const ChartStudioView: React.FC = () => {
  const { assets, selectedSymbol, setSelectedSymbol, openDetail } = useMarket();
  const asset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  // Chart configuration states
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W'>('15m');
  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showBB, setShowBB] = useState<boolean>(false);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [activeTool, setActiveTool] = useState<'cursor' | 'trendline' | 'horizontal' | 'text'>('cursor');

  // Drawing elements
  const [drawings, setDrawings] = useState<Array<{ type: string; y: number; text?: string }>>([
    { type: 'horizontal', y: asset.price * 0.985, text: 'Support $ ' + (asset.price * 0.985).toFixed(2) }
  ]);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Candles generation
  const candles = useMemo(() => {
    return generateCandlesForSymbol(selectedSymbol, 64, asset.price);
  }, [selectedSymbol, timeframe, asset.price]);

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Calculated Dimensions
  const svgWidth = 900;
  const svgHeight = 440;
  const mainChartHeight = showRSI ? 320 : 410;
  const rsiHeight = 85;
  const rsiTop = mainChartHeight + 25;

  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;
  const maxVolume = Math.max(...candles.map(c => c.volume));

  // Compute Moving Averages (EMA 12 & SMA 26)
  const smaPeriod = 20;
  const smaPoints = candles.map((_, i) => {
    if (i < smaPeriod - 1) return null;
    const slice = candles.slice(i - smaPeriod + 1, i + 1);
    const avg = slice.reduce((acc, c) => acc + c.close, 0) / smaPeriod;
    const x = (i / (candles.length - 1)) * svgWidth;
    const y = mainChartHeight - 30 - ((avg - minPrice) / priceRange) * (mainChartHeight - 60);
    return { x, y };
  }).filter(Boolean) as Array<{ x: number; y: number }>;

  const emaPeriod = 9;
  const emaPoints = candles.map((_, i) => {
    if (i < emaPeriod - 1) return null;
    const slice = candles.slice(i - emaPeriod + 1, i + 1);
    const avg = slice.reduce((acc, c) => acc + c.close, 0) / emaPeriod;
    const x = (i / (candles.length - 1)) * svgWidth;
    const y = mainChartHeight - 30 - ((avg - minPrice) / priceRange) * (mainChartHeight - 60);
    return { x, y };
  }).filter(Boolean) as Array<{ x: number; y: number }>;

  // Compute RSI (simulated oscillator oscillating between 25 and 75)
  const rsiPoints = candles.map((c, i) => {
    // Generate realistic sinusoidal RSI
    const normalized = ((c.close - minPrice) / priceRange);
    const rsiVal = 30 + normalized * 40 + Math.sin(i * 0.4) * 8;
    const clampedRSI = Math.max(15, Math.min(85, rsiVal));
    const x = (i / (candles.length - 1)) * svgWidth;
    const y = rsiTop + rsiHeight - ((clampedRSI - 0) / 100) * rsiHeight;
    return { x, y, rsiVal: clampedRSI };
  });

  const handleChartClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'horizontal') {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      if (clickY < mainChartHeight) {
        const priceVal = maxPrice - (clickY / (mainChartHeight - 30)) * priceRange;
        setDrawings(prev => [
          ...prev,
          { type: 'horizontal', y: clickY, text: `Key Level: $${priceVal.toFixed(2)}` }
        ]);
      }
    }
  };

  const isPositive = asset.changePercent >= 0;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 md:px-6 py-4 flex flex-col gap-3">
      {/* Top Chart Toolbar */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Symbol Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={selectedSymbol}
              onChange={e => setSelectedSymbol(e.target.value)}
              className="bg-[#131722] border border-[#2a2e39] text-sm font-bold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2962ff]"
            >
              {assets.map(a => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} · {a.name}
                </option>
              ))}
            </select>

            <span className={`font-mono text-xs font-semibold ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              ${asset.price.toFixed(2)} ({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="h-4 w-px bg-[#2a2e39]" />

          {/* Timeframes */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            {(['1m', '5m', '15m', '1H', '4H', '1D', '1W'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  timeframe === tf ? 'bg-[#2a2e39] text-white font-semibold' : 'text-[#787b86] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#2a2e39]" />

          {/* Chart Type */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                chartType === 'candles' ? 'bg-[#2a2e39] text-white font-semibold' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                chartType === 'line' ? 'bg-[#2a2e39] text-white font-semibold' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                chartType === 'area' ? 'bg-[#2a2e39] text-white font-semibold' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Area
            </button>
          </div>
        </div>

        {/* Indicators Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer border ${
                showEMA ? 'bg-[#ff9800]/20 text-[#ff9800] border-[#ff9800]/40' : 'bg-[#131722] text-[#787b86] border-[#2a2e39]'
              }`}
            >
              EMA 9
            </button>

            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer border ${
                showSMA ? 'bg-[#00bcd4]/20 text-[#00bcd4] border-[#00bcd4]/40' : 'bg-[#131722] text-[#787b86] border-[#2a2e39]'
              }`}
            >
              SMA 20
            </button>

            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer border ${
                showRSI ? 'bg-[#9c27b0]/20 text-[#ba68c8] border-[#9c27b0]/40' : 'bg-[#131722] text-[#787b86] border-[#2a2e39]'
              }`}
            >
              RSI (14)
            </button>
          </div>

          <div className="h-4 w-px bg-[#2a2e39]" />

          <button
            onClick={() => setDrawings([])}
            className="p-1.5 rounded bg-[#131722] border border-[#2a2e39] text-[#787b86] hover:text-red-400 hover:bg-[#2a2e39] transition-colors"
            title="Clear drawings"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex gap-2">
        {/* Left Toolbar (TradingView standard drawing bar) */}
        <div className="w-10 bg-[#1e222d] border border-[#2a2e39] rounded-xl py-3 flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTool('cursor')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeTool === 'cursor' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Crosshair Cursor"
          >
            <MousePointer className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('trendline')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeTool === 'trendline' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Trendline Tool"
          >
            <Slash className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('horizontal')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeTool === 'horizontal' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Horizontal Support / Resistance Line (Click chart to place)"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('text')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeTool === 'text' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Text Note Tool"
          >
            <Type className="w-4 h-4" />
          </button>

          <div className="w-6 h-px bg-[#2a2e39] my-1" />

          <button
            onClick={() => openDetail(asset)}
            className="p-2 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
            title="Full Asset Profile"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Chart Viewport Canvas */}
        <div className="flex-1 bg-[#131722] border border-[#2a2e39] rounded-xl overflow-hidden relative flex flex-col">
          {/* Top Real-time Bar Readout */}
          <div className="px-4 py-2 border-b border-[#2a2e39] bg-[#1e222d]/60 flex items-center justify-between text-xs font-mono tabular-nums text-[#787b86]">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold">{asset.symbol}</span>
              <span>O: <strong className="text-white">{activeCandle.open.toFixed(2)}</strong></span>
              <span>H: <strong className="text-white">{activeCandle.high.toFixed(2)}</strong></span>
              <span>L: <strong className="text-white">{activeCandle.low.toFixed(2)}</strong></span>
              <span>C: <strong className="text-white">{activeCandle.close.toFixed(2)}</strong></span>
              <span>Vol: <strong className="text-[#9db2ce]">{activeCandle.volume.toLocaleString()}</strong></span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              {showEMA && <span className="text-[#ff9800]">EMA(9): {(activeCandle.close * 0.998).toFixed(2)}</span>}
              {showSMA && <span className="text-[#00bcd4]">SMA(20): {(activeCandle.close * 0.994).toFixed(2)}</span>}
              {showRSI && <span className="text-[#ba68c8]">RSI(14): 58.4</span>}
            </div>
          </div>

          {/* Interactive SVG Chart Canvas */}
          <div
            className="relative flex-1 select-none cursor-crosshair min-h-[460px]"
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
              const idx = Math.min(candles.length - 1, Math.max(0, Math.round((mouseX / rect.width) * (candles.length - 1))));
              setHoverIndex(idx);
            }}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="w-full h-full"
              onClick={handleChartClick}
            >
              {/* Grid Lines */}
              <line x1="0" y1={mainChartHeight * 0.25} x2={svgWidth} y2={mainChartHeight * 0.25} stroke="#2a2e39" strokeDasharray="3 3" opacity={0.4} />
              <line x1="0" y1={mainChartHeight * 0.50} x2={svgWidth} y2={mainChartHeight * 0.50} stroke="#2a2e39" strokeDasharray="3 3" opacity={0.4} />
              <line x1="0" y1={mainChartHeight * 0.75} x2={svgWidth} y2={mainChartHeight * 0.75} stroke="#2a2e39" strokeDasharray="3 3" opacity={0.4} />
              <line x1="0" y1={mainChartHeight} x2={svgWidth} y2={mainChartHeight} stroke="#2a2e39" opacity={0.8} />

              {/* Volume Bars at Bottom */}
              {candles.map((c, i) => {
                const barW = Math.max(3, (svgWidth / candles.length) * 0.65);
                const x = (i / (candles.length - 1)) * svgWidth - barW / 2;
                const barH = (c.volume / maxVolume) * 60;
                const y = mainChartHeight - barH;
                const barColor = c.close >= c.open ? '#089981' : '#f23645';
                return (
                  <rect
                    key={`v-${i}`}
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    fill={barColor}
                    opacity={0.28}
                  />
                );
              })}

              {/* Candlesticks */}
              {chartType === 'candles' &&
                candles.map((c, i) => {
                  const x = (i / (candles.length - 1)) * svgWidth;
                  const candleW = Math.max(3.5, (svgWidth / candles.length) * 0.7);
                  const isBull = c.close >= c.open;
                  const color = isBull ? '#089981' : '#f23645';

                  const yHigh = mainChartHeight - 30 - ((c.high - minPrice) / priceRange) * (mainChartHeight - 60);
                  const yLow = mainChartHeight - 30 - ((c.low - minPrice) / priceRange) * (mainChartHeight - 60);
                  const yOpen = mainChartHeight - 30 - ((c.open - minPrice) / priceRange) * (mainChartHeight - 60);
                  const yClose = mainChartHeight - 30 - ((c.close - minPrice) / priceRange) * (mainChartHeight - 60);

                  const topBody = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                  return (
                    <g key={`c-${i}`}>
                      <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth={1.5} />
                      <rect
                        x={x - candleW / 2}
                        y={topBody}
                        width={candleW}
                        height={bodyHeight}
                        fill={color}
                        rx={0.5}
                      />
                    </g>
                  );
                })}

              {/* Line Chart */}
              {chartType === 'line' && (
                <path
                  d={`M ${candles
                    .map((c, i) => {
                      const x = (i / (candles.length - 1)) * svgWidth;
                      const y = mainChartHeight - 30 - ((c.close - minPrice) / priceRange) * (mainChartHeight - 60);
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth={2}
                />
              )}

              {/* Area Chart */}
              {chartType === 'area' && (
                <>
                  <path
                    d={`M ${candles
                      .map((c, i) => {
                        const x = (i / (candles.length - 1)) * svgWidth;
                        const y = mainChartHeight - 30 - ((c.close - minPrice) / priceRange) * (mainChartHeight - 60);
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' L ')} L ${svgWidth},${mainChartHeight} L 0,${mainChartHeight} Z`}
                    fill="rgba(41, 98, 255, 0.15)"
                  />
                  <path
                    d={`M ${candles
                      .map((c, i) => {
                        const x = (i / (candles.length - 1)) * svgWidth;
                        const y = mainChartHeight - 30 - ((c.close - minPrice) / priceRange) * (mainChartHeight - 60);
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth={2}
                  />
                </>
              )}

              {/* EMA Line (Orange) */}
              {showEMA && emaPoints.length > 1 && (
                <path
                  d={`M ${emaPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`}
                  fill="none"
                  stroke="#ff9800"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              )}

              {/* SMA Line (Cyan) */}
              {showSMA && smaPoints.length > 1 && (
                <path
                  d={`M ${smaPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`}
                  fill="none"
                  stroke="#00bcd4"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              )}

              {/* Custom Placed Horizontal Lines */}
              {drawings.map((draw, idx) => (
                <g key={`d-${idx}`}>
                  <line
                    x1="0"
                    y1={draw.y}
                    x2={svgWidth}
                    y2={draw.y}
                    stroke="#2962ff"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                  />
                  {draw.text && (
                    <text
                      x={10}
                      y={draw.y - 5}
                      fill="#2962ff"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      fontWeight="600"
                    >
                      {draw.text}
                    </text>
                  )}
                </g>
              ))}

              {/* Crosshair on Hover */}
              {hoverIndex !== null && (
                (() => {
                  const x = (hoverIndex / (candles.length - 1)) * svgWidth;
                  const c = candles[hoverIndex];
                  const y = mainChartHeight - 30 - ((c.close - minPrice) / priceRange) * (mainChartHeight - 60);
                  return (
                    <g>
                      <line x1={x} y1={0} x2={x} y2={mainChartHeight} stroke="#787b86" strokeWidth={1} strokeDasharray="3 3" />
                      <line x1={0} y1={y} x2={svgWidth} y2={y} stroke="#787b86" strokeWidth={1} strokeDasharray="3 3" />
                      <circle cx={x} cy={y} r={4} fill="#ffffff" stroke="#2962ff" strokeWidth={2} />
                    </g>
                  );
                })()
              )}

              {/* RSI Sub-Panel */}
              {showRSI && (
                <g>
                  {/* RSI Separator line */}
                  <line x1="0" y1={rsiTop} x2={svgWidth} y2={rsiTop} stroke="#2a2e39" strokeWidth={1} />
                  
                  {/* RSI 70 & 30 Reference Bands */}
                  <line
                    x1="0"
                    y1={rsiTop + rsiHeight * 0.3}
                    x2={svgWidth}
                    y2={rsiTop + rsiHeight * 0.3}
                    stroke="#ba68c8"
                    strokeDasharray="2 2"
                    opacity={0.5}
                  />
                  <line
                    x1="0"
                    y1={rsiTop + rsiHeight * 0.7}
                    x2={svgWidth}
                    y2={rsiTop + rsiHeight * 0.7}
                    stroke="#ba68c8"
                    strokeDasharray="2 2"
                    opacity={0.5}
                  />

                  {/* RSI Band fill */}
                  <rect
                    x="0"
                    y={rsiTop + rsiHeight * 0.3}
                    width={svgWidth}
                    height={rsiHeight * 0.4}
                    fill="rgba(186, 104, 200, 0.05)"
                  />

                  {/* RSI Oscillator Curve */}
                  <path
                    d={`M ${rsiPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`}
                    fill="none"
                    stroke="#ba68c8"
                    strokeWidth={1.5}
                  />

                  {/* Sub-panel labels */}
                  <text x="10" y={rsiTop + 14} fill="#787b86" fontSize="10" fontFamily="JetBrains Mono">
                    RSI (14) · Overbought 70 / Oversold 30
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
