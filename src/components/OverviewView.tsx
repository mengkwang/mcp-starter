import React from 'react';
import { useMarket } from '../context/MarketContext';
import { HeroMarketChart } from './HeroMarketChart';
import { TechnicalGauge } from './TechnicalGauge';
import { Sparkline } from './Sparkline';
import { SECTOR_PERFORMANCE, MARKET_NEWS } from '../data/marketData';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Newspaper,
  Compass,
  ChevronRight,
  Gauge
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { assets, openDetail, setSelectedSymbol, setActiveTab } = useMarket();

  // Top gainers and losers
  const sortedByGain = [...assets].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedByGain.slice(0, 4);
  const topLosers = [...assets].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
  const mostActive = [...assets].sort((a, b) => b.volumeNum - a.volumeNum).slice(0, 4);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-8">
      {/* 1. Hero Grid: Main Interactive Chart & Technical Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Chart Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <HeroMarketChart />
        </div>

        {/* Technical Summary & Market Health Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Technical Gauge Card */}
          <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#2962ff]" />
                <h2 className="text-sm font-bold text-white tracking-wide">Market Technical Rating</h2>
              </div>
              <span className="text-[11px] font-mono text-[#089981] font-semibold bg-[#089981]/10 px-2 py-0.5 rounded">
                Bullish Bias
              </span>
            </div>

            <div className="py-4">
              <TechnicalGauge rating="Buy" size="md" showCounters={true} />
            </div>

            <p className="text-xs text-[#787b86] pt-2 border-t border-[#2a2e39]">
              Analysis combines 26 technical indicators including Relative Strength Index (RSI), MACD, Stochastic, and Moving Average envelopes.
            </p>
          </div>

          {/* Market Health Stat Matrix */}
          <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#131722] p-3 rounded-lg border border-[#2a2e39]">
              <span className="text-[#787b86] text-[11px] block">Market Breadth</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-bold text-[#089981] text-sm">342 Adv</span>
                <span className="text-[#787b86]">/</span>
                <span className="font-mono font-bold text-[#f23645] text-sm">158 Dec</span>
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-lg border border-[#2a2e39]">
              <span className="text-[#787b86] text-[11px] block">S&P 500 P/E (TTM)</span>
              <div className="font-mono font-bold text-white text-sm mt-1">
                27.8x
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-lg border border-[#2a2e39]">
              <span className="text-[#787b86] text-[11px] block">Volatility Index (VIX)</span>
              <div className="font-mono font-bold text-[#089981] text-sm mt-1">
                15.24 <span className="text-[11px] font-normal text-[#089981]">(-3.1%)</span>
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-lg border border-[#2a2e39]">
              <span className="text-[#787b86] text-[11px] block">US 10Y Benchmark</span>
              <div className="font-mono font-bold text-white text-sm mt-1">
                4.025%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Movers Grid: Gainers, Losers, Most Active */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Top Gainers */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#089981]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Gainers</h3>
            </div>
            <button
              onClick={() => setActiveTab('stocks')}
              className="text-[11px] text-[#2962ff] hover:underline cursor-pointer"
            >
              More →
            </button>
          </div>

          <div className="divide-y divide-[#2a2e39]/50 pt-1">
            {topGainers.map(asset => (
              <div
                key={asset.symbol}
                onClick={() => {
                  setSelectedSymbol(asset.symbol);
                  openDetail(asset);
                }}
                className="py-2.5 flex items-center justify-between hover:bg-[#2a2e39]/40 px-1 rounded transition-colors cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-[#787b86] font-mono">{asset.exchange}</span>
                  </div>
                  <span className="text-[11px] text-[#787b86] truncate block max-w-[130px]">
                    {asset.name}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-right">
                  <Sparkline data={asset.sparkline} isPositive={true} width={45} height={18} />
                  <div>
                    <div className="font-mono text-xs font-semibold text-white tabular-nums">
                      ${asset.price.toFixed(2)}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-[#089981] tabular-nums">
                      +{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#f23645]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Losers</h3>
            </div>
            <button
              onClick={() => setActiveTab('stocks')}
              className="text-[11px] text-[#2962ff] hover:underline cursor-pointer"
            >
              More →
            </button>
          </div>

          <div className="divide-y divide-[#2a2e39]/50 pt-1">
            {topLosers.map(asset => (
              <div
                key={asset.symbol}
                onClick={() => {
                  setSelectedSymbol(asset.symbol);
                  openDetail(asset);
                }}
                className="py-2.5 flex items-center justify-between hover:bg-[#2a2e39]/40 px-1 rounded transition-colors cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-[#787b86] font-mono">{asset.exchange}</span>
                  </div>
                  <span className="text-[11px] text-[#787b86] truncate block max-w-[130px]">
                    {asset.name}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-right">
                  <Sparkline data={asset.sparkline} isPositive={false} width={45} height={18} />
                  <div>
                    <div className="font-mono text-xs font-semibold text-white tabular-nums">
                      ${asset.price.toFixed(2)}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-[#f23645] tabular-nums">
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active by Volume */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Most Active</h3>
            </div>
            <button
              onClick={() => setActiveTab('stocks')}
              className="text-[11px] text-[#2962ff] hover:underline cursor-pointer"
            >
              More →
            </button>
          </div>

          <div className="divide-y divide-[#2a2e39]/50 pt-1">
            {mostActive.map(asset => {
              const isPos = asset.changePercent >= 0;
              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    setSelectedSymbol(asset.symbol);
                    openDetail(asset);
                  }}
                  className="py-2.5 flex items-center justify-between hover:bg-[#2a2e39]/40 px-1 rounded transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] text-[#787b86] font-mono">{asset.exchange}</span>
                    </div>
                    <span className="text-[11px] text-[#787b86] truncate block max-w-[130px]">
                      Vol: {asset.volume}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-white tabular-nums">
                      ${asset.price.toFixed(2)}
                    </div>
                    <div className={`font-mono text-[11px] font-bold tabular-nums ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Sectors Performance & Heatmap Preview Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sectors Performance (6 cols) */}
        <div className="lg:col-span-6 bg-[#1e222d] border border-[#2a2e39] rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
            <h3 className="text-sm font-bold text-white tracking-wide">US Sectors Performance</h3>
            <span className="text-xs text-[#787b86]">Today's change</span>
          </div>

          <div className="space-y-3">
            {SECTOR_PERFORMANCE.map(sec => {
              const isPos = sec.changePercent >= 0;
              const barWidth = Math.min(100, Math.abs(sec.changePercent) * 25);
              return (
                <div key={sec.name} className="flex items-center justify-between text-xs gap-3">
                  <span className="w-40 font-medium text-[#d1d4dc] truncate">{sec.name}</span>

                  <div className="flex-1 bg-[#131722] h-2 rounded-full overflow-hidden flex items-center relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isPos ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <span className={`w-16 text-right font-mono font-semibold tabular-nums ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {isPos ? '+' : ''}{sec.changePercent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heatmap Preview & CTA (6 cols) */}
        <div className="lg:col-span-6 bg-[#1e222d] border border-[#2a2e39] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2962ff]" />
              <h3 className="text-sm font-bold text-white tracking-wide">Market Heatmap Snapshot</h3>
            </div>
            <button
              onClick={() => setActiveTab('heatmap')}
              className="text-xs text-[#2962ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Open Full Heatmap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Interactive Heatmap Preview Grid */}
          <div className="grid grid-cols-4 gap-2 h-56 my-2">
            <div
              onClick={() => { setSelectedSymbol('NVDA'); setActiveTab('heatmap'); }}
              className="col-span-2 row-span-2 bg-[#089981] rounded-lg p-2.5 flex flex-col justify-between cursor-pointer hover:brightness-110 transition-all shadow-sm"
            >
              <div>
                <span className="font-bold text-white text-base">NVDA</span>
                <span className="text-[10px] text-white/80 block">NVIDIA</span>
              </div>
              <span className="font-mono text-sm font-bold text-white tabular-nums">+3.61%</span>
            </div>

            <div
              onClick={() => { setSelectedSymbol('AAPL'); setActiveTab('heatmap'); }}
              className="col-span-2 row-span-1 bg-[#2e7d32] rounded-lg p-2.5 flex flex-col justify-between cursor-pointer hover:brightness-110 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-white text-xs">AAPL</span>
                <span className="font-mono text-xs font-bold text-white tabular-nums">+0.84%</span>
              </div>
            </div>

            <div
              onClick={() => { setSelectedSymbol('MSFT'); setActiveTab('heatmap'); }}
              className="col-span-1 row-span-1 bg-[#c62828] rounded-lg p-2 flex flex-col justify-between cursor-pointer hover:brightness-110 transition-all shadow-sm"
            >
              <span className="font-bold text-white text-xs">MSFT</span>
              <span className="font-mono text-[11px] font-bold text-white tabular-nums">-0.55%</span>
            </div>

            <div
              onClick={() => { setSelectedSymbol('AMZN'); setActiveTab('heatmap'); }}
              className="col-span-1 row-span-1 bg-[#26a69a] rounded-lg p-2 flex flex-col justify-between cursor-pointer hover:brightness-110 transition-all shadow-sm"
            >
              <span className="font-bold text-white text-xs">AMZN</span>
              <span className="font-mono text-[11px] font-bold text-white tabular-nums">+1.67%</span>
            </div>

            <div
              onClick={() => { setSelectedSymbol('META'); setActiveTab('heatmap'); }}
              className="col-span-2 row-span-1 bg-[#089981] rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:brightness-110 transition-all shadow-sm"
            >
              <span className="font-bold text-white text-xs">META</span>
              <span className="font-mono text-xs font-bold text-white tabular-nums">+2.47%</span>
            </div>

            <div
              onClick={() => { setSelectedSymbol('TSLA'); setActiveTab('heatmap'); }}
              className="col-span-2 row-span-1 bg-[#f23645] rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:brightness-110 transition-all shadow-sm"
            >
              <span className="font-bold text-white text-xs">TSLA</span>
              <span className="font-mono text-xs font-bold text-white tabular-nums">-3.04%</span>
            </div>
          </div>

          <p className="text-xs text-[#787b86] mt-2">
            Click any tile to inspect company valuations, or launch full screener to filter across 500+ securities.
          </p>
        </div>
      </div>

      {/* 4. Latest News Feed */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-sm font-bold text-white tracking-wide">Market News & Analysis</h3>
          </div>
          <span className="text-xs text-[#787b86]">Curated real-time wire</span>
        </div>

        <div className="divide-y divide-[#2a2e39]/50">
          {MARKET_NEWS.map(news => (
            <div key={news.id} className="py-4 hover:bg-[#2a2e39]/30 px-2 rounded transition-colors">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
                <a
                  href={news.url}
                  onClick={e => e.preventDefault()}
                  className="font-bold text-sm text-white hover:text-[#2962ff] transition-colors leading-snug"
                >
                  {news.title}
                </a>
                <span className="text-[11px] text-[#787b86] whitespace-nowrap font-mono">
                  {news.source} · {news.time}
                </span>
              </div>

              <p className="text-xs text-[#787b86] mt-1.5 leading-relaxed line-clamp-2">
                {news.snippet}
              </p>

              {/* Related symbols */}
              <div className="flex items-center gap-2 mt-2">
                {news.symbols.map(sym => (
                  <button
                    key={sym}
                    onClick={() => {
                      setSelectedSymbol(sym);
                      const target = assets.find(a => a.symbol === sym);
                      if (target) openDetail(target);
                    }}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#131722] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#9db2ce] hover:text-white transition-colors cursor-pointer"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
