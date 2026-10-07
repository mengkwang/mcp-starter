import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Sparkline } from './Sparkline';
import { X, Bookmark, Bell, Trash2, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export const WatchlistDrawer: React.FC = () => {
  const {
    isWatchlistOpen,
    setIsWatchlistOpen,
    watchlist,
    assets,
    toggleWatchlist,
    openDetail,
    setSelectedSymbol,
    alerts,
    removeAlert,
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'alerts'>('watchlist');

  if (!isWatchlistOpen) return null;

  const watchlistAssets = assets.filter(a => watchlist.includes(a.symbol));

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 md:w-96 bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between bg-[#131722]/80">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-sm font-bold text-white">Watchlist & Alerts</h2>
        </div>

        <button
          onClick={() => setIsWatchlistOpen(false)}
          className="p-1 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2a2e39] bg-[#131722]/50">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'watchlist'
              ? 'border-[#2962ff] text-white'
              : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
          }`}
        >
          Watchlist ({watchlistAssets.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'alerts'
              ? 'border-[#2962ff] text-white'
              : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
          }`}
        >
          Alerts ({alerts.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50">
        {activeTab === 'watchlist' ? (
          watchlistAssets.length === 0 ? (
            <div className="p-8 text-center text-[#787b86] text-xs">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Your watchlist is empty.</p>
              <p className="mt-1 text-[11px]">Click the star next to any asset to pin it here.</p>
            </div>
          ) : (
            watchlistAssets.map(asset => {
              const isPos = asset.changePercent >= 0;
              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    setSelectedSymbol(asset.symbol);
                    openDetail(asset);
                  }}
                  className="p-3.5 hover:bg-[#2a2e39]/50 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs group-hover:text-[#2962ff] transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-[#787b86] font-mono">{asset.exchange}</span>
                      </div>
                      <span className="text-[11px] text-[#787b86] truncate block max-w-[120px]">
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Sparkline data={asset.sparkline} isPositive={isPos} width={50} height={20} />

                    <div className="text-right">
                      <div className="font-mono text-xs font-semibold text-white tabular-nums">
                        ${asset.price.toFixed(2)}
                      </div>
                      <div className={`font-mono text-[11px] font-bold tabular-nums ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleWatchlist(asset.symbol);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-red-400 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )
        ) : (
          alerts.length === 0 ? (
            <div className="p-8 text-center text-[#787b86] text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No active price alerts.</p>
              <p className="mt-1 text-[11px]">Set alerts inside any asset's detail modal.</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className="p-3.5 hover:bg-[#2a2e39]/40 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{alert.symbol}</span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#787b86]">Created {alert.createdAt}</span>
                </div>

                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-1 text-[#787b86] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};
