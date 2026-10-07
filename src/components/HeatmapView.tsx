import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset } from '../types/market';
import { Filter, Eye, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const HeatmapView: React.FC = () => {
  const { assets, openDetail, setSelectedSymbol } = useMarket();
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sizeMetric, setSizeMetric] = useState<'marketCap' | 'volume'>('marketCap');
  const [hoveredAsset, setHoveredAsset] = useState<MarketAsset | null>(null);

  // Focus primarily on stocks and major index assets with market caps
  const filteredAssets = assets
    .filter(a => a.type === 'stock' || a.marketCapNum)
    .filter(a => selectedSector === 'All' || a.sector === selectedSector);

  // Group by sector
  const sectors = Array.from(new Set(assets.map(a => a.sector).filter(Boolean))) as string[];

  const getHeatmapColor = (changePercent: number) => {
    if (changePercent >= 4) return 'bg-[#089981] hover:brightness-110';
    if (changePercent >= 2) return 'bg-[#26a69a] hover:brightness-110';
    if (changePercent >= 0.5) return 'bg-[#2e7d32] hover:brightness-110';
    if (changePercent >= 0) return 'bg-[#1b5e20] hover:brightness-110';
    if (changePercent >= -1) return 'bg-[#c62828] hover:brightness-110';
    if (changePercent >= -3) return 'bg-[#d32f2f] hover:brightness-110';
    return 'bg-[#f23645] hover:brightness-110';
  };

  // Compute total weight for sizing
  const totalWeight = filteredAssets.reduce((sum, a) => {
    return sum + (sizeMetric === 'marketCap' ? (a.marketCapNum || 100) : (a.volumeNum || 1000000) / 1000000);
  }, 0);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2962ff]" />
            <h1 className="text-xl font-bold tracking-tight text-white">Stock Market Heatmap</h1>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            S&P 500 & US Equities grouped by sector, sized by market capitalization and colored by daily performance.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sector filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#787b86]">Sector:</span>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="bg-[#131722] border border-[#2a2e39] text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2962ff]"
            >
              <option value="All">All Sectors</option>
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sizing toggle */}
          <div className="flex items-center bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setSizeMetric('marketCap')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                sizeMetric === 'marketCap' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Market Cap
            </button>
            <button
              onClick={() => setSizeMetric('volume')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                sizeMetric === 'volume' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Volume
            </button>
          </div>

          {/* Color Legend */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono tabular-nums text-[#787b86]">
            <span>-3%</span>
            <div className="flex h-3 w-28 rounded overflow-hidden">
              <div className="flex-1 bg-[#f23645]" />
              <div className="flex-1 bg-[#d32f2f]" />
              <div className="flex-1 bg-[#c62828]" />
              <div className="flex-1 bg-[#1b5e20]" />
              <div className="flex-1 bg-[#2e7d32]" />
              <div className="flex-1 bg-[#089981]" />
            </div>
            <span>+3%</span>
          </div>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="relative bg-[#131722] border border-[#2a2e39] rounded-xl p-3 min-h-[550px]">
        {/* Treemap Grid Layout */}
        <div className="grid grid-cols-12 gap-2 w-full h-[600px]">
          {filteredAssets.map((asset, index) => {
            const weight = sizeMetric === 'marketCap' 
              ? (asset.marketCapNum || 100) 
              : (asset.volumeNum || 1000000) / 1000000;
            const weightFraction = weight / totalWeight;

            // Responsive col span calculation based on weight fraction
            let colSpan = 'col-span-3';
            let rowSpan = 'row-span-2';

            if (weightFraction > 0.18) {
              colSpan = 'col-span-6 md:col-span-4';
              rowSpan = 'row-span-4 md:row-span-3';
            } else if (weightFraction > 0.10) {
              colSpan = 'col-span-4 md:col-span-3';
              rowSpan = 'row-span-3 md:row-span-2';
            } else if (weightFraction > 0.05) {
              colSpan = 'col-span-3 md:col-span-2';
              rowSpan = 'row-span-2';
            } else {
              colSpan = 'col-span-3 md:col-span-2';
              rowSpan = 'row-span-1';
            }

            const colorClass = getHeatmapColor(asset.changePercent);
            const isPos = asset.changePercent >= 0;

            return (
              <div
                key={asset.symbol}
                onMouseEnter={() => setHoveredAsset(asset)}
                onMouseLeave={() => setHoveredAsset(null)}
                onClick={() => {
                  setSelectedSymbol(asset.symbol);
                  openDetail(asset);
                }}
                className={`${colSpan} ${rowSpan} ${colorClass} rounded-lg p-3 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm relative group overflow-hidden border border-black/10`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-base md:text-lg text-white tracking-wide block drop-shadow-sm">
                      {asset.symbol}
                    </span>
                    <span className="text-[11px] text-white/80 truncate block max-w-[130px] font-medium">
                      {asset.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white/90">
                    {asset.sector || 'US'}
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="font-mono font-bold text-white text-sm md:text-base tabular-nums drop-shadow-sm">
                    ${asset.price.toFixed(2)}
                  </div>
                  <div className="font-mono text-xs md:text-sm font-semibold text-white/95 tabular-nums flex items-center">
                    {isPos ? <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5" />}
                    {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-[10px] font-mono text-white/70 tabular-nums mt-0.5">
                    {asset.marketCap}
                  </div>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded backdrop-blur-sm flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect {asset.symbol}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Tooltip on Hover */}
        {hoveredAsset && (
          <div className="fixed bottom-8 right-8 z-50 bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-2xl pointer-events-none w-72 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#2a2e39]">
              <div>
                <span className="font-bold text-white text-base">{hoveredAsset.symbol}</span>
                <span className="text-xs text-[#787b86] block truncate">{hoveredAsset.name}</span>
              </div>
              <span className={`font-mono text-sm font-bold ${hoveredAsset.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {hoveredAsset.changePercent >= 0 ? '+' : ''}{hoveredAsset.changePercent.toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3">
              <div>
                <span className="text-[#787b86] text-[11px] block">Price</span>
                <span className="font-mono font-semibold text-white">${hoveredAsset.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[#787b86] text-[11px] block">Market Cap</span>
                <span className="font-mono font-semibold text-white">{hoveredAsset.marketCap || '-'}</span>
              </div>
              <div>
                <span className="text-[#787b86] text-[11px] block">P/E Ratio</span>
                <span className="font-mono font-semibold text-white">{hoveredAsset.peRatio || '-'}</span>
              </div>
              <div>
                <span className="text-[#787b86] text-[11px] block">Volume (24h)</span>
                <span className="font-mono font-semibold text-white">{hoveredAsset.volume}</span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="text-[#787b86] text-[11px] block">Technical Rating</span>
                <span className="font-semibold text-[#089981]">{hoveredAsset.rating}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
