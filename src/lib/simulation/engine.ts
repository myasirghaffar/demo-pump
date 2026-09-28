import { APP, FEATURES, SIMULATION_DEFAULTS, type FeatureId } from "@/lib/config";
import type {
  BotMode,
  BotStats,
  BotStatus,
  Candle,
  FeatureState,
  MarketSnapshot,
  OrderBookLevel,
  Side,
  TradeFill,
} from "./types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round(n: number, digits = 6) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

class SimulationEngine {
  private status: BotStatus = "running";
  private mode: BotMode = "simulation";
  private price: number = SIMULATION_DEFAULTS.basePrice;
  private open: number = SIMULATION_DEFAULTS.basePrice;
  private high24h: number = SIMULATION_DEFAULTS.basePrice;
  private low24h: number = SIMULATION_DEFAULTS.basePrice;
  private volume24h = 0;
  private filledToday = 0;
  private openOrders = 42;
  private pnlUSDT = 0;
  private balances = {
    DRK: SIMULATION_DEFAULTS.startingBalance.DRK as number,
    USDT: SIMULATION_DEFAULTS.startingBalance.USDT as number,
  };
  private startedAt = Date.now();
  private lastTickAt = Date.now();
  private trades: TradeFill[] = [];
  private candles: Candle[] = [];
  private features: FeatureState[] = FEATURES.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    premium: f.premium,
    active: f.defaultActive,
  }));
  private timer: ReturnType<typeof setInterval> | null = null;
  private spreadBps: number = SIMULATION_DEFAULTS.spreadBps;

  constructor() {
    this.seedCandles();
    this.startLoop();
  }

  private seedCandles() {
    const now = Date.now();
    let p = this.price;
    for (let i = 80; i >= 0; i--) {
      const drift = (Math.random() - 0.48) * SIMULATION_DEFAULTS.volatility * p;
      const open = p;
      const close = Math.max(0.0001, open + drift);
      const high = Math.max(open, close) * (1 + Math.random() * 0.004);
      const low = Math.min(open, close) * (1 - Math.random() * 0.004);
      const volume = 8_000 + Math.random() * 45_000;
      this.candles.push({
        time: now - i * 60_000,
        open: round(open),
        high: round(high),
        low: round(low),
        close: round(close),
        volume: round(volume, 2),
      });
      p = close;
    }
    this.price = p;
    this.open = this.candles[0]?.open ?? p;
    this.high24h = Math.max(...this.candles.map((c) => c.high));
    this.low24h = Math.min(...this.candles.map((c) => c.low));
    this.volume24h = this.candles.reduce((s, c) => s + c.volume, 0);
  }

  private startLoop() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), SIMULATION_DEFAULTS.tickMs);
  }

  private stopLoop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private activeFeature(id: FeatureId) {
    return this.features.find((f) => f.id === id)?.active ?? false;
  }

  private tick() {
    if (this.status !== "running") return;

    const volMult = this.activeFeature("vv") ? 1.35 : 1;
    const nice = this.activeFeature("nc") || this.activeFeature("vc");
    const noiseScale = nice ? 0.55 : 1;
    const pw = this.activeFeature("pw");

    let drift =
      (Math.random() - 0.5) *
      SIMULATION_DEFAULTS.volatility *
      this.price *
      noiseScale;

    // Mild upward bias for demo pump narrative
    drift += this.price * 0.00035;

    if (pw) {
      const support = SIMULATION_DEFAULTS.basePrice * 0.92;
      const resist = SIMULATION_DEFAULTS.basePrice * 1.18;
      if (this.price + drift < support) drift = Math.abs(drift);
      if (this.price + drift > resist) drift = -Math.abs(drift);
    }

    const prev = this.price;
    this.price = round(Math.max(0.0001, this.price + drift));
    this.high24h = Math.max(this.high24h, this.price);
    this.low24h = Math.min(this.low24h, this.price);
    this.lastTickAt = Date.now();

    const spreadTarget = this.activeFeature("liq")
      ? SIMULATION_DEFAULTS.spreadBps * 0.75
      : SIMULATION_DEFAULTS.spreadBps;
    this.spreadBps = round(
      clamp(spreadTarget + (Math.random() - 0.5) * 4, 8, 80),
      1,
    );

    if (this.activeFeature("t") && Math.random() > 0.25) {
      this.emitTrade(volMult);
    }

    // Update latest candle / roll new minute candle
    const last = this.candles[this.candles.length - 1];
    const minute = Math.floor(Date.now() / 60_000) * 60_000;
    if (!last || last.time < minute) {
      this.candles.push({
        time: minute,
        open: prev,
        high: Math.max(prev, this.price),
        low: Math.min(prev, this.price),
        close: this.price,
        volume: round(2_000 + Math.random() * 12_000 * volMult, 2),
      });
      if (this.candles.length > 120) this.candles.shift();
    } else {
      last.high = Math.max(last.high, this.price);
      last.low = Math.min(last.low, this.price);
      last.close = this.price;
      last.volume = round(last.volume + Math.random() * 800 * volMult, 2);
    }

    this.openOrders = Math.floor(
      28 + Math.random() * 40 + (this.activeFeature("ob") ? 20 : 0),
    );

    // Soft PnL drift in simulation
    this.pnlUSDT = round(
      this.pnlUSDT + (this.price - prev) * (8_000 + Math.random() * 4_000),
      2,
    );
  }

  private emitTrade(volMult: number) {
    const side: Side = Math.random() > 0.48 ? "buy" : "sell";
    const amount = round((400 + Math.random() * 9_000) * volMult, 2);
    const slip = (Math.random() - 0.5) * this.price * 0.0015;
    const price = round(this.price + slip);
    const trade: TradeFill = {
      id: uid("tr"),
      side,
      price,
      amount,
      time: Date.now(),
      simulated: this.mode === "simulation",
    };
    this.trades.unshift(trade);
    if (this.trades.length > 60) this.trades.pop();
    this.volume24h = round(this.volume24h + amount * price, 2);
    this.filledToday += 1;

    if (side === "buy") {
      this.balances.USDT = round(
        Math.max(0, this.balances.USDT - amount * price),
        2,
      );
      this.balances.DRK = round(this.balances.DRK + amount, 2);
    } else {
      this.balances.DRK = round(Math.max(0, this.balances.DRK - amount), 2);
      this.balances.USDT = round(this.balances.USDT + amount * price, 2);
    }
  }

  private buildOrderBook(): { bids: OrderBookLevel[]; asks: OrderBookLevel[] } {
    const mid = this.price;
    const half = (this.spreadBps / 10_000) * mid;
    const bids: OrderBookLevel[] = [];
    const asks: OrderBookLevel[] = [];
    const depth = SIMULATION_DEFAULTS.orderBookDepth;
    const antiGap = this.activeFeature("ag");
    const builder = this.activeFeature("ob");

    let bidTotal = 0;
    let askTotal = 0;
    for (let i = 0; i < depth; i++) {
      const step = antiGap
        ? mid * (0.00035 + i * 0.00055)
        : mid * (0.0006 + i * 0.0009 + Math.random() * 0.0003);
      const sizeBase = builder ? 12_000 : 5_000;
      const bidAmt = round(sizeBase * (1 + Math.random()) * (1 + i * 0.08), 2);
      const askAmt = round(sizeBase * (1 + Math.random()) * (1 + i * 0.08), 2);
      bidTotal += bidAmt;
      askTotal += askAmt;
      bids.push({
        price: round(mid - half - step),
        amount: bidAmt,
        total: round(bidTotal, 2),
      });
      asks.push({
        price: round(mid + half + step),
        amount: askAmt,
        total: round(askTotal, 2),
      });
    }
    return { bids, asks };
  }

  getStats(): BotStats {
    const price = round(this.price);
    const half = (this.spreadBps / 10_000) * price;
    const change24h = ((price - this.open) / this.open) * 100;
    return {
      status: this.status,
      mode: this.mode,
      pair: APP.coin.pair,
      price,
      change24h: round(change24h, 2),
      high24h: round(this.high24h),
      low24h: round(this.low24h),
      volume24h: round(this.volume24h, 2),
      spreadBps: this.spreadBps,
      midPrice: price,
      bid: round(price - half),
      ask: round(price + half),
      openOrders: this.openOrders,
      filledToday: this.filledToday,
      pnlUSDT: this.pnlUSDT,
      balances: { ...this.balances },
      features: this.features.map((f) => ({ ...f })),
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      lastTickAt: this.lastTickAt,
    };
  }

  getSnapshot(): MarketSnapshot {
    return {
      stats: this.getStats(),
      orderBook: this.buildOrderBook(),
      trades: [...this.trades],
      candles: [...this.candles],
    };
  }

  setStatus(status: BotStatus) {
    this.status = status;
    if (status === "running") this.startLoop();
    if (status === "stopped") this.stopLoop();
    return this.getStats();
  }

  setMode(mode: BotMode) {
    this.mode = mode;
    return this.getStats();
  }

  toggleFeature(id: string, active?: boolean) {
    const f = this.features.find((x) => x.id === id);
    if (!f) return this.getStats();
    f.active = typeof active === "boolean" ? active : !f.active;
    return this.getStats();
  }

  reset() {
    this.stopLoop();
    this.status = "running";
    this.mode = "simulation";
    this.price = SIMULATION_DEFAULTS.basePrice;
    this.open = SIMULATION_DEFAULTS.basePrice;
    this.high24h = SIMULATION_DEFAULTS.basePrice;
    this.low24h = SIMULATION_DEFAULTS.basePrice;
    this.volume24h = 0;
    this.filledToday = 0;
    this.openOrders = 42;
    this.pnlUSDT = 0;
    this.balances = { ...SIMULATION_DEFAULTS.startingBalance };
    this.startedAt = Date.now();
    this.trades = [];
    this.candles = [];
    this.features = FEATURES.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      premium: f.premium,
      active: f.defaultActive,
    }));
    this.seedCandles();
    this.startLoop();
    return this.getSnapshot();
  }
}

const globalForSim = globalThis as unknown as {
  __demoPumpEngine?: SimulationEngine;
};

export function getEngine() {
  if (!globalForSim.__demoPumpEngine) {
    globalForSim.__demoPumpEngine = new SimulationEngine();
  }
  return globalForSim.__demoPumpEngine;
}
