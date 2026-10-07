import React from 'react';
import { useMarket } from '../context/MarketContext';
import { LayoutDashboard, TrendingUp, Bitcoin, Globe, BarChart2, Flame, Landmark, Grid3X3, CandlestickChart, Calendar } from 'lucide-react';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useMarket();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'crypto', label: 'Crypto', icon: Bitcoin },
    { id: 'forex', label: 'Forex', icon: Globe },
    { id: 'indices', label: 'Indices', icon: BarChart2 },
    { id: 'commodities', label: 'Commodities', icon: Flame },
    { id: 'bonds', label: 'Bonds', icon: Landmark },
    { id: 'heatmap', label: 'Heatmap', icon: Grid3X3 },
    { id: 'chart', label: 'Supercharts', icon: CandlestickChart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="w-full bg-[#131722] dark:bg-[#131722] border-b border-[#2a2e39] overflow-x-auto scrollbar-none">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex items-center gap-1 py-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#2a2e39] text-white shadow-sm'
                  : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2962ff]' : 'text-[#787b86]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
