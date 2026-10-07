import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { TechnicalGauge } from './TechnicalGauge';
import { Sparkline } from './Sparkline';
import {
  X,
  Star,
  Maximize2,
  TrendingUp,
  TrendingDown,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const SymbolModal: React.FC = () => {
  const {
    detailModalAsset: asset,
    closeDetail,
    watchlist,
    toggleWatchlist,
    setActiveTab,
    setSelectedSymbol,
    addAlert,
  } = useMarket();

  const [activeTab, setActiveTabLocal] = useState<'overview' | 'orderbook' | 'technicals'>('overview');
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [alertCreated, setAlertCreated] = useState<boolean>(false);

  if (!asset) return null;

  const inWatchlist = watchlist.includes(asset.symbol);
  const isPos = asset.changePercent >= 0;

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(alertPrice);
    if (!isNaN(priceNum)) {
      addAlert(asset.symbol, priceNum, priceNum > asset.price ? 'above' : 'below');
      setAlertCreated(true);
      setTimeout(() => setAlertCreated(false), 2500);
      setAlertPrice('');
    }
  };

  // Generate simulated order book bids & asks
  const spread = asset.price * 0.0004;
  const bids = [
    { price: (asset.price - spread * 1).toFixed(2), size: 1420, total: 1420 },
    { price: (asset.price - spread * 2).toFixed(2), size: 3100, total: 4520 },
    { price: (asset.price - spread * 3).toFixed(2), size: 5400, total: 9920 },
    { price: (asset.price - spread * 4).toFixed(2), size: 7800, total: 17720 },
    { price: (asset.price - spread * 5).toFixed(2), size: 12500, total: 30220 },
  ];
  const asks = [
    { price: (asset.price + spread * 1).toFixed(2), size: 1200, total: 1200 },
    { price: (asset.price + spread * 2).toFixed(2), size: 2800, total: 4000 },
    { price: (asset.price + spread * 3).toFixed(2), size: 4900, total: 8900 },
    { price: (asset.price + spread * 4).toFixed(2), size: 8100, total: 17000 },
    { price: (asset.price + spread * 5).toFixed(2), size: 11400, total: 28400 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-[#2a2e39] flex items-center justify-between bg-[#131722]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2962ff]/10 border border-[#2962ff]/30 flex items-center justify-center font-bold text-white text-base">
              {asset.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{asset.name}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#2a2e39] text-[#d1d4dc] font-semibold">
                  {asset.symbol}
                </span>
                <span className="text-xs text-[#787b86]">
                  {asset.exchange} · {asset.currency}
                </span>
              </div>
              <div className="text-xs text-[#787b86] mt-0.5">{asset.sector || asset.type.toUpperCase()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(asset.symbol)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                inWatchlist
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-white'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${inWatchlist ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                setSelectedSymbol(asset.symbol);
                closeDetail();
                setActiveTab('chart');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Chart</span>
            </button>

            <button
              onClick={closeDetail}
              className="p-2 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Price Bar & Sub-Tabs */}
        <div className="px-5 py-3 bg-[#131722]/40 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
              {asset.type === 'forex' 
                ? asset.price.toFixed(4)
                : asset.type === 'bond'
                ? `${asset.price.toFixed(3)}%`
                : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
            <div className={`flex items-center gap-1 font-mono text-sm font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              {isPos ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{isPos ? '+' : ''}{asset.change.toFixed(2)}</span>
              <span>({isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setActiveTabLocal('overview')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Overview & Stats
            </button>
            <button
              onClick={() => setActiveTabLocal('technicals')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeTab === 'technicals' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Technical Analysis
            </button>
            <button
              onClick={() => setActiveTabLocal('orderbook')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeTab === 'orderbook' ? 'bg-[#2a2e39] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Level 2 Depth
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">Day's Range</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    ${asset.low24h.toFixed(2)} — ${asset.high24h.toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">52-Week Range</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    ${asset.range52wLow.toFixed(2)} — ${asset.range52wHigh.toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">Market Capitalization</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    {asset.marketCap || 'N/A'}
                  </div>
                </div>

                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">24h Trading Volume</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    {asset.volume}
                  </div>
                </div>

                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">P/E Ratio (TTM)</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    {asset.peRatio ? `${asset.peRatio}x` : 'N/A'}
                  </div>
                </div>

                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">Dividend Yield</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    {asset.dividendYield !== undefined ? `${(asset.dividendYield * 100).toFixed(2)}%` : 'N/A'}
                  </div>
                </div>

                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">Beta (5Y Monthly)</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    {asset.beta || '1.00'}
                  </div>
                </div>

                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
                  <span className="text-[#787b86] text-[11px] block">Next Earnings Date</span>
                  <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                    {asset.earningsDate || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Sparkline & Technical preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#131722] p-4 rounded-xl border border-[#2a2e39] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider text-[#787b86]">
                      7-Day Intraday Path
                    </h3>
                    <p className="text-xs text-[#787b86] mt-0.5">Continuous price progression</p>
                  </div>
                  <div className="py-4 flex justify-center">
                    <Sparkline data={asset.sparkline} isPositive={isPos} width={280} height={90} strokeWidth={2.5} />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#787b86] border-t border-[#2a2e39] pt-2">
                    <span>Low: ${asset.low24h.toFixed(2)}</span>
                    <span>High: ${asset.high24h.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-[#131722] p-4 rounded-xl border border-[#2a2e39] flex flex-col justify-between items-center text-center">
                  <div className="w-full text-left">
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider text-[#787b86]">
                      Technical Gauge
                    </h3>
                    <p className="text-xs text-[#787b86] mt-0.5">Aggregate moving averages & oscillators</p>
                  </div>
                  <div className="my-2">
                    <TechnicalGauge rating={asset.rating} size="md" showCounters={false} />
                  </div>
                  <div className="text-xs font-medium text-[#787b86]">
                    TradingView Technical Summary: <span className="text-white font-bold">{asset.rating}</span>
                  </div>
                </div>
              </div>

              {/* About description */}
              <div className="bg-[#131722] p-4 rounded-xl border border-[#2a2e39]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2962ff]" />
                  About {asset.name}
                </h3>
                <p className="text-xs text-[#d1d4dc] leading-relaxed">
                  {asset.description}
                </p>
              </div>

              {/* Price Alert Setter */}
              <div className="bg-[#131722] p-4 rounded-xl border border-[#2a2e39]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white">Create Price Alert for {asset.symbol}</h3>
                  </div>
                  {alertCreated && (
                    <span className="text-xs text-[#089981] flex items-center gap-1 font-medium animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Alert active!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSetAlert} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#787b86]">$</span>
                    <input
                      type="number"
                      step="any"
                      placeholder={`Target price (e.g. ${(asset.price * 1.05).toFixed(2)})`}
                      value={alertPrice}
                      onChange={e => setAlertPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-[#1e222d] border border-[#2a2e39] rounded-lg text-xs font-mono text-white placeholder-[#787b86] focus:outline-none focus:border-[#2962ff]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Set Alert
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab === 'technicals' && (
            <div className="flex flex-col items-center justify-center p-6 bg-[#131722] rounded-xl border border-[#2a2e39]">
              <h3 className="text-base font-bold text-white mb-1">Detailed Technical Rating</h3>
              <p className="text-xs text-[#787b86] mb-6">Real-time oscillator evaluation across 1D timeframe</p>
              <TechnicalGauge rating={asset.rating} size="lg" showCounters={true} />
            </div>
          )}

          {activeTab === 'orderbook' && (
            <div className="bg-[#131722] rounded-xl border border-[#2a2e39] p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2a2e39]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Level 2 Market Depth</h3>
                <span className="text-xs font-mono text-[#787b86]">Spread: ${(spread * 2).toFixed(4)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                {/* Asks (Sell Orders) */}
                <div>
                  <div className="text-[11px] text-[#f23645] font-bold mb-2 flex justify-between">
                    <span>ASK PRICE ($)</span>
                    <span>SIZE</span>
                  </div>
                  <div className="space-y-1">
                    {asks.map((ask, i) => (
                      <div key={i} className="flex justify-between py-1 px-2 rounded bg-[#f23645]/10 text-white">
                        <span className="text-[#f23645] font-semibold">{ask.price}</span>
                        <span>{ask.size.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bids (Buy Orders) */}
                <div>
                  <div className="text-[11px] text-[#089981] font-bold mb-2 flex justify-between">
                    <span>BID PRICE ($)</span>
                    <span>SIZE</span>
                  </div>
                  <div className="space-y-1">
                    {bids.map((bid, i) => (
                      <div key={i} className="flex justify-between py-1 px-2 rounded bg-[#089981]/10 text-white">
                        <span className="text-[#089981] font-semibold">{bid.price}</span>
                        <span>{bid.size.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
