export type BotMode = "simulation" | "live";
export type BotStatus = "running" | "paused" | "stopped";
export type Side = "buy" | "sell";

export interface FeatureState {
  id: string;
  name: string;
  description: string;
  premium: boolean;
  active: boolean;
}

export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export interface TradeFill {
  id: string;
  side: Side;
  price: number;
  amount: number;
  time: number;
  simulated: boolean;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Balances {
  DRK: number;
  USDT: number;
}

export interface BotStats {
  status: BotStatus;
  mode: BotMode;
  pair: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  spreadBps: number;
  midPrice: number;
  bid: number;
  ask: number;
  openOrders: number;
  filledToday: number;
  pnlUSDT: number;
  balances: Balances;
  features: FeatureState[];
  uptimeSec: number;
  lastTickAt: number;
}

export interface MarketSnapshot {
  stats: BotStats;
  orderBook: {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
  };
  trades: TradeFill[];
  candles: Candle[];
}
