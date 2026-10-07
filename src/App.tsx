/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewView } from './components/OverviewView';
import { ScreenerView } from './components/ScreenerView';
import { HeatmapView } from './components/HeatmapView';
import { ChartStudioView } from './components/ChartStudioView';
import { CalendarView } from './components/CalendarView';
import { SymbolModal } from './components/SymbolModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const { activeTab } = useMarket();

  return (
    <div className="min-h-screen flex flex-col bg-[#131722] text-[#d1d4dc] transition-colors selection:bg-[#2962ff]/30 selection:text-white">
      {/* 1. Top Ticker Tape Ribbon */}
      <TickerTape />

      {/* 2. Top Header Navigation (Top Bar Contract) */}
      <Header />

      {/* 3. Category Tabs */}
      <NavigationTabs />

      {/* 4. Active Screen Content */}
      <main className="flex-1">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'stocks' && <ScreenerView filterType="stock" />}
        {activeTab === 'crypto' && <ScreenerView filterType="crypto" />}
        {activeTab === 'forex' && <ScreenerView filterType="forex" />}
        {activeTab === 'indices' && <ScreenerView filterType="index" />}
        {activeTab === 'commodities' && <ScreenerView filterType="commodity" />}
        {activeTab === 'bonds' && <ScreenerView filterType="bond" />}
        {activeTab === 'heatmap' && <HeatmapView />}
        {activeTab === 'chart' && <ChartStudioView />}
        {activeTab === 'calendar' && <CalendarView />}
      </main>

      {/* 5. Clean Footer */}
      <Footer />

      {/* 6. Overlays & Modals */}
      <SymbolModal />
      <WatchlistDrawer />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainLayout />
    </MarketProvider>
  );
}
