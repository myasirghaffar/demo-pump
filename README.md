# Demo Pump — Darkfi Coin

Modern dark-UI market-making demo for **Darkfi Coin (DRK/USDT)**.

Built from client requirements using [adamant-tradebot](https://github.com/Adamant-im/adamant-tradebot) as the trading engine foundation, with a Next.js web console and **simulation mode** for demos.

## What's included

| Path | Purpose |
|------|---------|
| `src/app` | Landing, dashboard, docs + API routes |
| `src/components` | Dark trading UI |
| `src/lib/simulation` | Paper market engine for Darkfi Coin |
| `engine/` | Full adamant-tradebot copy for live MM |
| `public/Demo_Pump_Darkfi_Documentation.pdf` | Project PDF documentation |
| `scripts/generate-pdf.mjs` | Regenerates the PDF |

## Quick start (web demo)

```bash
cd demo-pump
npm install
npm run docs:pdf
npm run dev
```

Open:

- http://localhost:3000 — landing
- http://localhost:3000/dashboard — live Darkfi console
- http://localhost:3000/docs — documentation + PDF download

## Features

**Core:** Trader, Order Book Builder, Liquidity Provider, Price Watcher  

**Premium-style:** Balance Watcher, Anti-Gap, Cleaner, Ladder/Grid, Quote Hunter, Volatility Chart, Volume Volatility, Price Maker Volume, Sniper Bot Watcher, Nice Chart, DEX Price Watcher  

**Modes:** Simulation (default demo) · Live (prep — wire `engine/` + exchange keys)

## Go live on the web

1. Deploy `demo-pump` to Vercel / Railway / Render / any Node host.
2. Build: `npm run build` · Start: `npm start`
3. Share the public URL as the Darkfi Demo Pump.

For **real** exchange fills, configure and run the bot under `engine/` (MongoDB + API keys). Never commit secrets.

## Documentation PDF

```bash
npm run docs:pdf
```

Output: `public/Demo_Pump_Darkfi_Documentation.pdf`

## Brand

- **Product:** Demo Pump  
- **Coin:** Darkfi Coin (`DRK`)  
- **Pair:** `DRK/USDT`
