import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#131722] border-t border-[#2a2e39] py-8 px-4 md:px-6 mt-12 text-xs text-[#787b86]">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#2962ff] flex items-center justify-center text-white font-bold text-xs">
            TV
          </div>
          <span className="font-semibold text-[#d1d4dc]">TradingView Markets</span>
          <span>· Real-time global market data & analytics</span>
        </div>

        <div className="flex items-center gap-6 text-[#787b86]">
          <span className="hover:text-white transition-colors cursor-pointer">Indices</span>
          <span className="hover:text-white transition-colors cursor-pointer">Stocks</span>
          <span className="hover:text-white transition-colors cursor-pointer">Crypto</span>
          <span className="hover:text-white transition-colors cursor-pointer">Forex</span>
          <span className="hover:text-white transition-colors cursor-pointer">Futures</span>
          <span className="hover:text-white transition-colors cursor-pointer">Calendar</span>
        </div>

        <div className="text-[11px] text-[#787b86]">
          Data provided for informational and educational purposes only. Not financial advice.
        </div>
      </div>
    </footer>
  );
};
