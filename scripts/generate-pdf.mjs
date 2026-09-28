/**
 * Generates Demo_Pump_Darkfi_Documentation.pdf
 * Run: node scripts/generate-pdf.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public");
const outFile = path.join(outDir, "Demo_Pump_Darkfi_Documentation.pdf");

fs.mkdirSync(outDir, { recursive: true });

const doc = new PDFDocument({
  margin: 54,
  size: "A4",
  info: {
    Title: "Demo Pump — Darkfi Coin Project Documentation",
    Author: "Demo Pump",
    Subject: "Market-making demo for Darkfi Coin",
  },
});

const stream = fs.createWriteStream(outFile);
doc.pipe(stream);

const ink = "#0f172a";
const muted = "#475569";
const accent = "#0f766e";

function h1(text) {
  doc.moveDown(0.4);
  doc.fillColor(ink).font("Helvetica-Bold").fontSize(20).text(text);
  doc.moveDown(0.35);
}

function h2(text) {
  doc.moveDown(0.5);
  doc.fillColor(accent).font("Helvetica-Bold").fontSize(13).text(text);
  doc.moveDown(0.25);
}

function p(text) {
  doc.fillColor(muted).font("Helvetica").fontSize(10.5).text(text, {
    align: "justify",
    lineGap: 2,
  });
  doc.moveDown(0.35);
}

function bullet(items) {
  doc.fillColor(muted).font("Helvetica").fontSize(10.5);
  for (const item of items) {
    doc.text(`•  ${item}`, { indent: 8, lineGap: 2 });
  }
  doc.moveDown(0.4);
}

// Cover
doc
  .fillColor(accent)
  .font("Helvetica-Bold")
  .fontSize(28)
  .text("Demo Pump", { align: "left" });
doc
  .fillColor(ink)
  .font("Helvetica-Bold")
  .fontSize(16)
  .text("Darkfi Coin Market-Making Demo");
doc.moveDown(0.4);
doc
  .fillColor(muted)
  .font("Helvetica")
  .fontSize(11)
  .text("Project documentation — what is included and what each part is for");
doc.moveDown(0.2);
doc
  .fillColor(muted)
  .fontSize(10)
  .text(`Generated: ${new Date().toISOString().slice(0, 10)}`);
doc.moveDown(0.6);
doc
  .strokeColor("#99f6e4")
  .lineWidth(2)
  .moveTo(54, doc.y)
  .lineTo(541, doc.y)
  .stroke();
doc.moveDown(0.8);

h1("1. Executive summary");
p(
  "Demo Pump is a web-first market-making demonstration built for Darkfi Coin (ticker DRK, pair DRK/USDT). It was created from client requirements to clone ADAMANT Market-Making Software concepts, surface premium features, add simulation mode, and present everything in a modern dark UI that can go live on the web.",
);
p(
  "The product name is Demo Pump. The focus asset is Darkfi Coin. For the demo phase, paper/simulation trading is the default so stakeholders can evaluate market quality (depth, spread, volume, chart behavior) without exchange API keys.",
);

h2("Client goals covered");
bullet([
  "Clone / adapt adamant-tradebot as the foundation",
  "Brand as Demo Pump with coin name Darkfi Coin",
  "Include premium-style market-making features",
  "Add simulation mode for safe demos",
  "Ship a modern attractive dark web UI",
  "Make it runnable live on the web",
  "Provide this PDF explaining the project",
]);

h1("2. What is in the project");
h2("2.1 Next.js application (demo-pump/)");
p(
  "A single Next.js 15 app hosts both the frontend dashboard and the backend API routes. This keeps deployment simple for a web demo: one process, one URL.",
);
bullet([
  "Landing page — brand-first intro for Demo Pump / Darkfi Coin",
  "Dashboard (/dashboard) — live console with charts, order book, trades, feature toggles",
  "Docs page (/docs) — human-readable overview + PDF download",
  "API routes under /api/* — status, market snapshot, feature catalog, bot control",
]);

h2("2.2 Simulation engine (src/lib/simulation/)");
p(
  "An in-memory simulation engine ticks on an interval and produces realistic market microstructure for DRK/USDT: mid price, bid/ask, order book depth, candles, fills, balances, spread (bps), open orders, and simulated PnL. Feature toggles change behavior (tighter spreads with liquidity, denser books with order-book builder, smoother candles with nice-chart / volatility modules, etc.).",
);

h2("2.3 Trading engine copy (engine/)");
p(
  "The original adamant-tradebot codebase is copied into demo-pump/engine/. This is the production-oriented Node market-making bot with exchange connectors, MongoDB persistence, command system, and WebUI API. Use it when moving from simulation to live CEX market-making.",
);
bullet([
  "engine/trade/ — trader, order book builder, liquidity provider, price watcher, exchange connectors",
  "engine/modules/ — config, DB, commands, market-making helpers",
  "engine/api/ — Fastify WebUI API + Socket.IO (premium-style control surface)",
  "engine/config.default.jsonc — all bot parameters with comments",
]);

h2("2.4 Frontend UI");
p(
  "Dark trading-terminal aesthetic with teal/sky accents (not a generic purple theme). Components include stats cards, area chart (Recharts), depth order book, trade feed, control panel (simulation vs live prep), and a premium/core feature switchboard.",
);

h1("3. Feature catalog — what each module is for");
bullet([
  "Trader (t) — creates buy/sell volume with configurable policies",
  "Order Book Builder (ob) — keeps visible depth and dynamic book structure",
  "Liquidity Provider (liq) — maintains liquidity and tighter spreads",
  "Price Watcher (pw) — keeps price within support/resistance guidance",
  "Balance Watcher (bw, premium) — monitors inventory drawdowns",
  "Anti-Gap (ag, premium) — fills gaps so the book looks healthy",
  "Cleaner (cl, premium) — removes noisy/outlier orders",
  "Ladder / Grid (ld, premium) — grid orders across a price range",
  "Quote Hunter (qh, premium) — seeks better quote placement",
  "Volatility Chart (vc, premium) — shapes candle volatility",
  "Volume Volatility (vv, premium) — adds realistic volume variance",
  "Price Maker Volume (pmv, premium) — extra volume via price-maker logic",
  "Sniper Bot Watcher (sbw, premium) — detects aggressive sniper behavior",
  "Nice Chart (nc, premium) — smoother presentation-ready chart behavior",
  "DEX Price Watcher (dex, premium) — reference DEX pricing guidance",
]);

h1("4. How the pieces work together");
p(
  "In demo mode, the browser polls GET /api/market every ~1.5s. The simulation engine returns a MarketSnapshot. Operators pause/start/stop/reset via POST /api/control and toggle modules the same way. Simulation is the default because the client priority is a convincing Darkfi Coin demo.",
);
p(
  "When ready for live markets, configure the engine/ bot (pair, exchange keys, MongoDB) and keep the Next.js UI as the public-facing demo shell — or point live mode at the engine WebUI API. Live mode in the dashboard is labeled as preparation until exchange credentials and connectors are wired for Darkfi’s listed market.",
);

h1("5. Running and going live on the web");
h2("Local demo");
p("From the demo-pump folder: npm install && npm run dev — then open http://localhost:3000. Dashboard: /dashboard. Docs: /docs. PDF: /Demo_Pump_Darkfi_Documentation.pdf");

h2("Production web deploy");
bullet([
  "Deploy demo-pump to Vercel, Railway, Render, or any Node 20+ host",
  "Set build command: npm run build | start command: npm start",
  "Share the public URL with stakeholders as the Darkfi Demo Pump",
  "For real trading, run engine/ on a VPS with MongoDB and exchange API keys (never commit secrets)",
]);

h1("6. Security & compliance notes");
bullet([
  "Never paste exchange API keys into chat or commit them to git",
  "Use .env / secret managers for live credentials",
  "Simulation does not place real orders — safe for demos",
  "Live trading involves financial risk; review configs before enabling",
]);

h1("7. Folder map");
bullet([
  "demo-pump/src/app — pages (landing, dashboard, docs) + API routes",
  "demo-pump/src/components — dark UI dashboard components",
  "demo-pump/src/lib — config + simulation engine",
  "demo-pump/engine — full adamant-tradebot copy for live MM",
  "demo-pump/public — static assets + this PDF",
  "demo-pump/scripts — PDF generator and tooling",
]);

h1("8. Branding");
p(
  "Product: Demo Pump. Asset: Darkfi Coin (DRK). Market shown: DRK/USDT. Tagline focus: premium market-making demo — depth, spread, volume, and chart quality — so the team can “see what Darkfi got for us” on the web.",
);

doc.moveDown(1);
doc
  .fillColor(accent)
  .font("Helvetica-Bold")
  .fontSize(11)
  .text("End of document — Demo Pump / Darkfi Coin");

doc.end();

stream.on("finish", () => {
  console.log(`Wrote ${outFile}`);
});
