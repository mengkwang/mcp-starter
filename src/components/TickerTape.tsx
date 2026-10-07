import React from 'react';
import { useMarket } from '../context/MarketContext';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const { assets, setSelectedSymbol, openDetail, lastTickSymbol, liveTicking, setLiveTicking } = useMarket();

  // Top marquee assets
  const tapeSymbols = ['SPX', 'NDX', 'DJI', 'BTCUSD', 'ETHUSD', 'XAUUSD', 'USOIL', 'US10Y', 'EURUSD', 'NVDA', 'AAPL', 'TSLA', 'PLTR'];
  const tapeAssets = tapeSymbols
    .map(sym => assets.find(a => a.symbol === sym))
    .filter(Boolean) as typeof assets;

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] border-b border-[#2a2e39] text-xs select-none">
      <div className="flex items-center overflow-x-auto scrollbar-none px-3 py-1.5 gap-4">
        {/* Live stream badge */}
        <button
          onClick={() => setLiveTicking(!liveTicking)}
          title={liveTicking ? 'Live price stream active (click to pause)' : 'Price stream paused (click to resume)'}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors bg-[#131722] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#d1d4dc] shrink-0"
        >
          <span className={`w-2 h-2 rounded-full ${liveTicking ? 'bg-[#089981] animate-pulse' : 'bg-[#787b86]'}`} />
          <span className="font-mono">{liveTicking ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* Ticker items */}
        <div className="flex items-center gap-5 whitespace-nowrap">
          {tapeAssets.map(asset => {
            const isPos = asset.changePercent >= 0;
            const isTickingNow = lastTickSymbol === asset.symbol;
            const formattedPrice = asset.type === 'forex' 
              ? asset.price.toFixed(4) 
              : asset.type === 'bond' 
              ? `${asset.price.toFixed(3)}%` 
              : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            return (
              <div
                key={asset.symbol}
                onClick={() => {
                  setSelectedSymbol(asset.symbol);
                  openDetail(asset);
                }}
                className={`flex items-center gap-2 cursor-pointer transition-all duration-300 px-2 py-0.5 rounded hover:bg-[#2a2e39]/70 ${
                  isTickingNow ? (isPos ? 'bg-[#089981]/20 ring-1 ring-[#089981]/50' : 'bg-[#f23645]/20 ring-1 ring-[#f23645]/50') : ''
                }`}
              >
                <span className="font-semibold text-white hover:text-[#2962ff] transition-colors">
                  {asset.symbol}
                </span>

                <span className="font-mono tabular-nums text-[#d1d4dc] font-medium">
                  {formattedPrice}
                </span>

                <span
                  className={`flex items-center font-mono tabular-nums text-[11px] font-semibold ${
                    isPos ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
