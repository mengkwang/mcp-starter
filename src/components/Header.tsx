import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Search, Bookmark, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    watchlist,
    isWatchlistOpen,
    setIsWatchlistOpen,
    theme,
    toggleTheme,
    setIsSearchOpen,
  } = useMarket();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#131722] dark:bg-[#131722] border-b border-[#2a2e39] px-4 md:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            {/* TradingView Icon Mark */}
            <div className="w-8 h-8 rounded bg-[#2962ff] flex items-center justify-center text-white font-bold tracking-tight shadow-sm transition-transform group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="4" height="10" rx="1" fill="white" />
                <rect x="10" y="5" width="4" height="16" rx="1" fill="white" />
                <rect x="17" y="8" width="4" height="13" rx="1" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#2962ff] transition-colors">
              TradingView <span className="font-semibold text-[#787b86]">Markets</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeTab === 'overview'
                ? 'text-white border-[#2962ff]'
                : 'text-[#787b86] border-transparent hover:text-white'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('stocks')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeTab === 'stocks'
                ? 'text-white border-[#2962ff]'
                : 'text-[#787b86] border-transparent hover:text-white'
            }`}
          >
            Stocks Screener
          </button>

          <button
            onClick={() => setActiveTab('crypto')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeTab === 'crypto'
                ? 'text-white border-[#2962ff]'
                : 'text-[#787b86] border-transparent hover:text-white'
            }`}
          >
            Crypto
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeTab === 'heatmap'
                ? 'text-white border-[#2962ff]'
                : 'text-[#787b86] border-transparent hover:text-white'
            }`}
          >
            Stock Heatmap
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeTab === 'chart'
                ? 'text-white border-[#2962ff]'
                : 'text-[#787b86] border-transparent hover:text-white'
            }`}
          >
            Supercharts
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeTab === 'calendar'
                ? 'text-white border-[#2962ff]'
                : 'text-[#787b86] border-transparent hover:text-white'
            }`}
          >
            Economic Calendar
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Watchlist, Theme) */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#787b86] hover:text-white transition-colors cursor-pointer text-xs"
            title="Search symbols (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search markets...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-[#131722] rounded border border-[#363a45] text-[#787b86]">
              ⌘K
            </kbd>
          </button>

          {/* Watchlist Panel Drawer Toggle */}
          <button
            onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
              isWatchlistOpen
                ? 'bg-[#2962ff] border-[#2962ff] text-white'
                : 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Toggle Watchlist & Alerts"
          >
            <Bookmark className="w-4 h-4" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#089981] text-[10px] font-bold text-white flex items-center justify-center font-mono">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#1e222d] border border-[#2a2e39] text-[#d1d4dc] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
