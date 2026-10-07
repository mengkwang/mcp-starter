import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, assets, setSelectedSymbol, openDetail, setActiveTab } = useMarket();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = assets.filter(asset => {
    if (activeFilter !== 'all' && asset.type !== activeFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2a2e39] flex items-center gap-3 bg-[#131722]/80">
          <Search className="w-5 h-5 text-[#2962ff]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbols, indices, crypto, or forex..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-[#787b86] focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-[#2a2e39] text-[#787b86] rounded border border-[#363a45]">
            ESC
          </kbd>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-[#787b86] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#2a2e39] bg-[#131722]/40 overflow-x-auto text-xs">
          {['all', 'stock', 'crypto', 'forex', 'index', 'commodity'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                activeFilter === cat ? 'bg-[#2962ff] text-white font-medium' : 'text-[#787b86] hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Markets' : cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#2a2e39]/50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#787b86] text-xs">
              No matching symbols found for "{query}".
            </div>
          ) : (
            filtered.map(asset => {
              const isPos = asset.changePercent >= 0;
              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    setSelectedSymbol(asset.symbol);
                    openDetail(asset);
                    setIsSearchOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-[#2a2e39]/60 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#2962ff]">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs group-hover:text-[#2962ff] transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#131722] text-[#787b86]">
                          {asset.exchange}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#787b86] truncate block max-w-sm">
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono text-xs font-semibold text-white">
                        ${asset.price.toFixed(2)}
                      </div>
                      <div className={`font-mono text-[11px] font-bold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
