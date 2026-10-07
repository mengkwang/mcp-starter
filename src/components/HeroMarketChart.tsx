import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { generateCandlesForSymbol } from '../data/marketData';
import { CandleData } from '../types/market';
import { Maximize2, Activity } from 'lucide-react';

interface HeroMarketChartProps {
  symbol?: string;
}

export const HeroMarketChart: React.FC<HeroMarketChartProps> = ({ symbol: propSymbol }) => {
  const { assets, selectedSymbol, setSelectedSymbol, openDetail, setActiveTab } = useMarket();
  const currentSymbol = propSymbol || selectedSymbol;
  const asset = assets.find(a => a.symbol === currentSymbol) || assets[0];

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate historical data bars based on symbol and timeframe
  const candles = useMemo(() => {
    const count = timeframe === '1D' ? 48 : timeframe === '5D' ? 60 : timeframe === '1M' ? 70 : 80;
    return generateCandlesForSymbol(currentSymbol, count, asset.price);
  }, [currentSymbol, timeframe, asset.price]);

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  const isPositive = asset.changePercent >= 0;
  const primaryColor = isPositive ? '#089981' : '#f23645';

  // SVG Chart bounds
  const width = 800;
  const height = 300;
  const chartBottom = 240;
  const volumeHeight = 50;

  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;

  const maxVolume = Math.max(...candles.map(c => c.volume));

  // Area path calculations
  const points = candles.map((c, i) => {
    const x = (i / (candles.length - 1)) * width;
    const y = chartBottom - ((c.close - minPrice) / priceRange) * (chartBottom - 30);
    return { x, y, candle: c };
  });

  const linePath = `M ${points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
  const areaPath = `${linePath} L ${width},${chartBottom} L 0,${chartBottom} Z`;

  // Quick switch chips for common benchmark tickers
  const quickTickers = ['SPX', 'NDX', 'DJI', 'BTCUSD', 'NVDA', 'AAPL'];

  return (
    <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 md:p-6 flex flex-col justify-between">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
        <div className="flex items-center gap-3">
          {/* Symbol Selectors */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {quickTickers.map(sym => {
              const symAsset = assets.find(a => a.symbol === sym);
              if (!symAsset) return null;
              const isSelected = sym === currentSymbol;
              return (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2962ff] text-white shadow-sm'
                      : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframe & Chart Style Toggle */}
        <div className="flex items-center gap-2">
          {/* Timeframes */}
          <div className="flex items-center bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
            {(['1D', '5D', '1M', '6M', '1Y'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  timeframe === tf ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Area vs Candles */}
          <div className="flex items-center bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                chartType === 'area' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('candles')}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                chartType === 'candles' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Candles
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedSymbol(currentSymbol);
              setActiveTab('chart');
            }}
            className="p-1.5 rounded-lg bg-[#131722] border border-[#2a2e39] text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
            title="Open in Supercharts Studio"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Symbol Live Readout */}
      <div className="py-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">{asset.name}</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-[#131722] border border-[#2a2e39] text-[#787b86]">
              {asset.exchange} · {asset.currency}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl md:text-4xl font-extrabold font-mono tabular-nums text-white">
              {asset.type === 'forex' ? activeCandle.close.toFixed(4) : activeCandle.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center gap-1.5 font-mono text-sm font-semibold ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              <span>{isPositive ? '+' : ''}{asset.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* OHLC Bar Readout */}
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#787b86]">
          <span>O: <strong className="text-white">{activeCandle.open.toFixed(2)}</strong></span>
          <span>H: <strong className="text-white">{activeCandle.high.toFixed(2)}</strong></span>
          <span>L: <strong className="text-white">{activeCandle.low.toFixed(2)}</strong></span>
          <span>C: <strong className="text-white">{activeCandle.close.toFixed(2)}</strong></span>
          <span className="hidden md:inline">Time: <strong className="text-[#9db2ce]">{activeCandle.time}</strong></span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        className="relative w-full h-[300px] select-none cursor-crosshair mt-2"
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const idx = Math.min(candles.length - 1, Math.max(0, Math.round((mouseX / rect.width) * (candles.length - 1))));
          setHoverIndex(idx);
        }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="heroChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.28} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={chartBottom * 0.25} x2={width} y2={chartBottom * 0.25} stroke="#2a2e39" strokeDasharray="3 3" opacity={0.6} />
          <line x1="0" y1={chartBottom * 0.50} x2={width} y2={chartBottom * 0.50} stroke="#2a2e39" strokeDasharray="3 3" opacity={0.6} />
          <line x1="0" y1={chartBottom * 0.75} x2={width} y2={chartBottom * 0.75} stroke="#2a2e39" strokeDasharray="3 3" opacity={0.6} />
          <line x1="0" y1={chartBottom} x2={width} y2={chartBottom} stroke="#2a2e39" opacity={0.8} />

          {/* Volume histogram at bottom */}
          {candles.map((c, i) => {
            const barW = Math.max(2, (width / candles.length) * 0.65);
            const x = (i / (candles.length - 1)) * width - barW / 2;
            const barH = (c.volume / maxVolume) * volumeHeight;
            const y = height - barH;
            const barColor = c.close >= c.open ? '#089981' : '#f23645';
            return (
              <rect
                key={`vol-${i}`}
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={barColor}
                opacity={0.35}
                rx={1}
              />
            );
          })}

          {/* Area or Candlesticks */}
          {chartType === 'area' ? (
            <>
              <path d={areaPath} fill="url(#heroChartGradient)" />
              <path d={linePath} fill="none" stroke={primaryColor} strokeWidth={2.5} strokeLinejoin="round" />
            </>
          ) : (
            // Candlestick rendering
            candles.map((c, i) => {
              const x = (i / (candles.length - 1)) * width;
              const candleW = Math.max(3, (width / candles.length) * 0.7);
              const isBull = c.close >= c.open;
              const color = isBull ? '#089981' : '#f23645';

              const yHigh = chartBottom - ((c.high - minPrice) / priceRange) * (chartBottom - 30);
              const yLow = chartBottom - ((c.low - minPrice) / priceRange) * (chartBottom - 30);
              const yOpen = chartBottom - ((c.open - minPrice) / priceRange) * (chartBottom - 30);
              const yClose = chartBottom - ((c.close - minPrice) / priceRange) * (chartBottom - 30);

              const topBody = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

              return (
                <g key={`candle-${i}`}>
                  {/* High-Low Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth={1.5} />
                  {/* Candle Body */}
                  <rect
                    x={x - candleW / 2}
                    y={topBody}
                    width={candleW}
                    height={bodyHeight}
                    fill={color}
                    rx={1}
                  />
                </g>
              );
            })
          )}

          {/* Interactive Crosshair */}
          {hoverIndex !== null && points[hoverIndex] && (
            <g>
              {/* Vertical line */}
              <line
                x1={points[hoverIndex].x}
                y1={0}
                x2={points[hoverIndex].x}
                y2={height}
                stroke="#787b86"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              {/* Horizontal line */}
              <line
                x1={0}
                y1={points[hoverIndex].y}
                x2={width}
                y2={points[hoverIndex].y}
                stroke="#787b86"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              {/* Tracking Dot */}
              <circle
                cx={points[hoverIndex].x}
                cy={points[hoverIndex].y}
                r={4.5}
                fill="#ffffff"
                stroke={primaryColor}
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {/* Hover Crosshair price label */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div
            className="absolute right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#2962ff] text-white shadow pointer-events-none"
            style={{ top: `${(points[hoverIndex].y / height) * 100}%`, transform: 'translateY(-50%)' }}
          >
            ${points[hoverIndex].candle.close.toFixed(2)}
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-3 mt-2 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#787b86]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#089981]" />
          <span>Real-time continuous pricing simulation active</span>
        </div>
        <button
          onClick={() => openDetail(asset)}
          className="text-[#2962ff] hover:underline font-medium cursor-pointer"
        >
          View Full Fundamentals & Depth →
        </button>
      </div>
    </div>
  );
};
