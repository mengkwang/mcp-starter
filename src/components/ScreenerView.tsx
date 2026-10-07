import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketAsset, MarketAssetType } from '../types/market';
import { Sparkline } from './Sparkline';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Star, ExternalLink, Filter } from 'lucide-react';

interface ScreenerViewProps {
  filterType?: MarketAssetType;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({ filterType }) => {
  const { assets, openDetail, setSelectedSymbol, watchlist, toggleWatchlist, lastTickSymbol } = useMarket();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [activePreset, setActivePreset] = useState<'all' | 'gainers' | 'losers' | 'active' | 'strong_buy'>('all');
  const [sortField, setSortField] = useState<keyof MarketAsset>('volumeNum');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Available sectors
  const sectors = useMemo(() => {
    return Array.from(new Set(assets.map(a => a.sector).filter(Boolean))) as string[];
  }, [assets]);

  // Filtered and sorted assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter(asset => {
        // Filter by asset type if specified
        if (filterType && asset.type !== filterType) return false;

        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchSym = asset.symbol.toLowerCase().includes(q);
          const matchName = asset.name.toLowerCase().includes(q);
          if (!matchSym && !matchName) return false;
        }

        // Sector filter
        if (selectedSector !== 'All' && asset.sector !== selectedSector) {
          return false;
        }

        // Preset filters
        if (activePreset === 'gainers' && asset.changePercent <= 0) return false;
        if (activePreset === 'losers' && asset.changePercent >= 0) return false;
        if (activePreset === 'strong_buy' && asset.rating !== 'Strong Buy') return false;
        if (activePreset === 'active' && asset.volumeNum < 20000000) return false;

        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField] ?? 0;
        const valB = b[sortField] ?? 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? (Number(valA) - Number(valB)) : (Number(valB) - Number(valA));
      });
  }, [assets, filterType, searchQuery, selectedSector, activePreset, sortField, sortAsc]);

  const handleSort = (field: keyof MarketAsset) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getSortIcon = (field: keyof MarketAsset) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#787b86] opacity-40 group-hover:opacity-100" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-[#2962ff]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#2962ff]" />
    );
  };

  const pageTitle = filterType 
    ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Screener`
    : 'Markets Screener';

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-5">
      {/* Top Header & Search Filter Controls */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">{pageTitle}</h1>
          <p className="text-xs text-[#787b86] mt-0.5">
            Real-time financial screener with technical ratings, valuation metrics, and volume analysis.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset Buttons */}
          <div className="flex items-center bg-[#131722] p-1 rounded-lg border border-[#2a2e39] overflow-x-auto">
            <button
              onClick={() => setActivePreset('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'all' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActivePreset('gainers')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'gainers' ? 'bg-[#2a2e39] text-[#089981] shadow-sm font-semibold' : 'text-[#787b86] hover:text-[#089981]'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => setActivePreset('losers')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'losers' ? 'bg-[#2a2e39] text-[#f23645] shadow-sm font-semibold' : 'text-[#787b86] hover:text-[#f23645]'
              }`}
            >
              Top Losers
            </button>
            <button
              onClick={() => setActivePreset('active')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'active' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Most Active
            </button>
            <button
              onClick={() => setActivePreset('strong_buy')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'strong_buy' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Strong Buy
            </button>
          </div>

          {/* Sector filter (if applicable) */}
          {sectors.length > 0 && (
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
          )}

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              placeholder="Filter ticker or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-44 md:w-52 pl-8 pr-3 py-1.5 bg-[#131722] border border-[#2a2e39] rounded-lg text-xs text-white placeholder-[#787b86] focus:outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#131722] border-b border-[#2a2e39] text-[#787b86] font-medium select-none">
                <th className="py-3 px-4 w-10 text-center"></th>
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-4 cursor-pointer hover:text-white group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Ticker</span>
                    {getSortIcon('symbol')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Last Price</span>
                    {getSortIcon('price')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('change')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Change</span>
                    {getSortIcon('change')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Change %</span>
                    {getSortIcon('changePercent')}
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
                <th
                  onClick={() => handleSort('volumeNum')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Volume</span>
                    {getSortIcon('volumeNum')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('marketCapNum')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Market Cap</span>
                    {getSortIcon('marketCapNum')}
                  </div>
                </th>
                <th className="py-3 px-4 w-36 text-center">52W Range</th>
                <th className="py-3 px-4 w-32 text-center">Trend (24h)</th>
                <th className="py-3 px-4 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-[#787b86]">
                    No assets matched your search filters.
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSector('All');
                        setActivePreset('all');
                      }}
                      className="block mx-auto mt-2 text-[#2962ff] hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => {
                  const isPos = asset.changePercent >= 0;
                  const isTickingNow = lastTickSymbol === asset.symbol;
                  const inWatchlist = watchlist.includes(asset.symbol);

                  // 52-week position calculation (0 to 100%)
                  const rangeSpan = asset.range52wHigh - asset.range52wLow;
                  const currentPosPct = Math.min(
                    100,
                    Math.max(0, ((asset.price - asset.range52wLow) / (rangeSpan || 1)) * 100)
                  );

                  return (
                    <tr
                      key={asset.symbol}
                      className={`hover:bg-[#2a2e39]/40 transition-colors group cursor-pointer ${
                        isTickingNow ? (isPos ? 'bg-[#089981]/15' : 'bg-[#f23645]/15') : ''
                      }`}
                      onClick={() => {
                        setSelectedSymbol(asset.symbol);
                        openDetail(asset);
                      }}
                    >
                      {/* Watchlist Star Toggle */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={e => {
                          e.stopPropagation();
                          toggleWatchlist(asset.symbol);
                        }}
                      >
                        <button
                          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                          className="text-[#787b86] hover:text-amber-400 transition-colors"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              inWatchlist ? 'text-amber-400 fill-amber-400' : 'text-[#787b86]'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Symbol and Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-[11px] text-[#2962ff] shrink-0">
                            {asset.symbol.slice(0, 2)}
                          </div>
                          <div className="truncate max-w-[180px]">
                            <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors block">
                              {asset.symbol}
                            </span>
                            <span className="text-[11px] text-[#787b86] truncate block font-normal">
                              {asset.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Last Price */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-white">
                        {asset.type === 'forex' 
                          ? asset.price.toFixed(4)
                          : asset.type === 'bond'
                          ? `${asset.price.toFixed(3)}%`
                          : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </td>

                      {/* Change $ */}
                      <td className={`py-3 px-4 text-right font-mono tabular-nums font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{asset.change.toFixed(2)}
                      </td>

                      {/* Change % */}
                      <td className={`py-3 px-4 text-right font-mono tabular-nums font-bold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </td>

                      {/* Technical Rating */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block font-semibold text-[11px] px-2 py-0.5 rounded ${
                            asset.rating === 'Strong Buy'
                              ? 'bg-[#089981]/15 text-[#089981]'
                              : asset.rating === 'Buy'
                              ? 'bg-[#26a69a]/15 text-[#26a69a]'
                              : asset.rating === 'Neutral'
                              ? 'bg-[#787b86]/15 text-[#9db2ce]'
                              : 'bg-[#f23645]/15 text-[#f23645]'
                          }`}
                        >
                          {asset.rating}
                        </span>
                      </td>

                      {/* Volume */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#d1d4dc]">
                        {asset.volume}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#d1d4dc]">
                        {asset.marketCap || '-'}
                      </td>

                      {/* 52-Week Range Bar */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="w-full bg-[#131722] h-1.5 rounded-full overflow-hidden relative">
                            <div
                              className="bg-[#2962ff] h-full rounded-full transition-all duration-300"
                              style={{ width: `${currentPosPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono tabular-nums text-[#787b86]">
                            <span>{asset.range52wLow.toFixed(0)}</span>
                            <span>{asset.range52wHigh.toFixed(0)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Sparkline mini chart */}
                      <td className="py-3 px-4 text-center">
                        <Sparkline data={asset.sparkline} isPositive={isPos} width={90} height={24} />
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            openDetail(asset);
                          }}
                          className="p-1 rounded text-[#787b86] hover:text-white hover:bg-[#131722] transition-colors"
                          title="Inspect Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
