import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketAsset, WatchlistAlert } from '../types/market';
import { INITIAL_ASSETS } from '../data/marketData';

interface MarketContextType {
  assets: MarketAsset[];
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  activeAsset: MarketAsset;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  isWatchlistOpen: boolean;
  setIsWatchlistOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  detailModalAsset: MarketAsset | null;
  openDetail: (asset: MarketAsset) => void;
  closeDetail: () => void;
  alerts: WatchlistAlert[];
  addAlert: (symbol: string, targetPrice: number, condition: 'above' | 'below') => void;
  removeAlert: (id: string) => void;
  liveTicking: boolean;
  setLiveTicking: (enabled: boolean) => void;
  lastTickSymbol: string | null;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [watchlist, setWatchlist] = useState<string[]>(['SPX', 'NVDA', 'AAPL', 'BTCUSD', 'XAUUSD', 'US10Y']);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [detailModalAsset, setDetailModalAsset] = useState<MarketAsset | null>(null);
  const [alerts, setAlerts] = useState<WatchlistAlert[]>([
    { id: '1', symbol: 'NVDA', targetPrice: 145.00, condition: 'above', createdAt: 'Today, 09:30' },
    { id: '2', symbol: 'BTCUSD', targetPrice: 65000.00, condition: 'below', createdAt: 'Yesterday, 16:20' }
  ]);
  const [liveTicking, setLiveTicking] = useState<boolean>(true);
  const [lastTickSymbol, setLastTickSymbol] = useState<string | null>(null);

  // Keyboard shortcut Ctrl+K or Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme synchronization with HTML document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#131722';
      document.body.style.color = '#d1d4dc';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8f9fd';
      document.body.style.color = '#131722';
    }
  }, [theme]);

  // Simulated live ticking prices
  useEffect(() => {
    if (!liveTicking) return;

    const interval = setInterval(() => {
      // Pick random asset to tick
      const randomIndex = Math.floor(Math.random() * assets.length);
      const targetAsset = assets[randomIndex];
      
      // Calculate micro-tick
      const priceDeltaPct = (Math.random() - 0.49) * 0.003; // +/- 0.15%
      const rawNewPrice = targetAsset.price * (1 + priceDeltaPct);
      const decimals = targetAsset.type === 'forex' ? 4 : targetAsset.type === 'bond' ? 3 : 2;
      const newPrice = Number(rawNewPrice.toFixed(decimals));
      const newChange = Number((targetAsset.change + (newPrice - targetAsset.price)).toFixed(decimals));
      const newChangePercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));

      setLastTickSymbol(targetAsset.symbol);

      setAssets(prevAssets =>
        prevAssets.map((asset, idx) => {
          if (idx !== randomIndex) return asset;
          const updatedSpark = [...asset.sparkline.slice(1), newPrice];
          return {
            ...asset,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high24h: Math.max(asset.high24h, newPrice),
            low24h: Math.min(asset.low24h, newPrice),
            sparkline: updatedSpark,
          };
        })
      );

      // Reset tick indicator after 800ms
      setTimeout(() => {
        setLastTickSymbol(null);
      }, 800);
    }, 2800);

    return () => clearInterval(interval);
  }, [liveTicking, assets]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const isInWatchlist = (symbol: string) => watchlist.includes(symbol);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openDetail = (asset: MarketAsset) => {
    setDetailModalAsset(asset);
  };

  const closeDetail = () => {
    setDetailModalAsset(null);
  };

  const addAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    const newAlert: WatchlistAlert = {
      id: Date.now().toString(),
      symbol,
      targetPrice,
      condition,
      createdAt: 'Just now',
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const activeAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  return (
    <MarketContext.Provider
      value={{
        assets,
        selectedSymbol,
        setSelectedSymbol,
        activeAsset,
        activeTab,
        setActiveTab,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        isWatchlistOpen,
        setIsWatchlistOpen,
        theme,
        toggleTheme,
        isSearchOpen,
        setIsSearchOpen,
        detailModalAsset,
        openDetail,
        closeDetail,
        alerts,
        addAlert,
        removeAlert,
        liveTicking,
        setLiveTicking,
        lastTickSymbol,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
