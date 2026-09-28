/**
 * Demo Pump — Darkfi Coin market-making demo configuration.
 * Adapted from adamant-tradebot concepts for a web-first demo.
 */

export const APP = {
  name: "Demo Pump",
  tagline: "Premium market-making demo for Darkfi Coin",
  coin: {
    name: "Darkfi Coin",
    symbol: "DRK",
    pair: "DRK/USDT",
    quote: "USDT",
  },
  version: "1.0.0",
  modeDefault: "simulation" as const,
} as const;

export const SIMULATION_DEFAULTS = {
  basePrice: 0.0842,
  volatility: 0.012,
  tickMs: 1500,
  orderBookDepth: 18,
  spreadBps: 28,
  startingBalance: {
    DRK: 2_500_000,
    USDT: 180_000,
  },
  dailyVolumeTarget: 1_250_000,
} as const;

/** Premium + basic MM feature registry (inspired by adamant-tradebot modules/commands/features.js) */
export const FEATURES = [
  {
    id: "t",
    name: "Trader",
    description: "Makes trading volume with configurable buy/sell policies",
    premium: false,
    defaultActive: true,
  },
  {
    id: "ob",
    name: "Order Book Builder",
    description: "Dynamically builds and maintains order book depth",
    premium: false,
    defaultActive: true,
  },
  {
    id: "liq",
    name: "Liquidity Provider",
    description: "Maintains liquidity and tighter spreads around mid price",
    premium: false,
    defaultActive: true,
  },
  {
    id: "pw",
    name: "Price Watcher",
    description: "Keeps price activity within configured support/resistance ranges",
    premium: false,
    defaultActive: true,
  },
  {
    id: "bw",
    name: "Balance Watcher",
    description: "Monitors coin balances and alerts on abnormal drawdowns",
    premium: true,
    defaultActive: true,
  },
  {
    id: "ag",
    name: "Anti-Gap",
    description: "Fills gaps in the order book for a healthier market look",
    premium: true,
    defaultActive: true,
  },
  {
    id: "cl",
    name: "Cleaner",
    description: "Removes noisy/outlier orders and keeps the book tidy",
    premium: true,
    defaultActive: false,
  },
  {
    id: "ld",
    name: "Ladder / Grid",
    description: "Places laddered grid orders across a price range",
    premium: true,
    defaultActive: false,
  },
  {
    id: "qh",
    name: "Quote Hunter",
    description: "Hunts better quotes and improves fill quality",
    premium: true,
    defaultActive: false,
  },
  {
    id: "vc",
    name: "Volatility Chart",
    description: "Shapes candle volatility for smoother chart appearance",
    premium: true,
    defaultActive: true,
  },
  {
    id: "vv",
    name: "Volume Volatility",
    description: "Adds realistic volume variance to simulated activity",
    premium: true,
    defaultActive: true,
  },
  {
    id: "pmv",
    name: "Price Maker Volume",
    description: "Creates additional volume via price-maker + price-watcher",
    premium: true,
    defaultActive: false,
  },
  {
    id: "sbw",
    name: "Sniper Bot Watcher",
    description: "Detects third-party sniper bots and can enter safe mode",
    premium: true,
    defaultActive: true,
  },
  {
    id: "nc",
    name: "Nice Chart",
    description: "Smoother chart behavior for presentation-ready candles",
    premium: true,
    defaultActive: true,
  },
  {
    id: "dex",
    name: "DEX Price Watcher",
    description: "Watches DEX reference prices for arbitrage-style guidance",
    premium: true,
    defaultActive: false,
  },
] as const;

export type FeatureId = (typeof FEATURES)[number]["id"];
