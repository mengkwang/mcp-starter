export type MarketAssetType = 'stock' | 'crypto' | 'forex' | 'index' | 'commodity' | 'bond';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  type: MarketAssetType;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  volumeNum: number;
  marketCap?: string;
  marketCapNum?: number;
  sector?: string;
  peRatio?: number;
  dividendYield?: number;
  range52wLow: number;
  range52wHigh: number;
  sparkline: number[];
  rating: TechnicalRating;
  description: string;
  logo: string;
  exchange: string;
  currency: string;
  beta?: number;
  earningsDate?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
  symbols: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  snippet: string;
  category: string;
}

export interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  country: string;
  countryCode: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
  unit?: string;
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  marketCap: string;
  leader: string;
  leaderChange: number;
}

export interface WatchlistAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  triggered?: boolean;
}
