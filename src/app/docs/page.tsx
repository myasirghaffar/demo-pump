import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

const sections = [
  {
    title: "What is Demo Pump?",
    body: "Demo Pump is a modern web market-making console branded for Darkfi Coin (DRK/USDT). It wraps concepts from ADAMANT Market-Making Software (adamant-tradebot) into a Next.js app with a dark UI, live dashboard, and simulation mode for demos.",
  },
  {
    title: "Why we built it",
    body: "The client asked for a clone-style demo named Demo Pump, focused on Darkfi Coin, with premium features, simulation, and a live web UI — without needing exchange keys for the first demo.",
  },
  {
    title: "Architecture",
    body: "Frontend and backend live in one Next.js project. React UI talks to App Router API routes. A simulation engine powers paper trading. The full production trading engine from adamant-tradebot is included under /engine for live exchange connectors when ready.",
  },
  {
    title: "Simulation mode",
    body: "Simulation generates order books, candles, fills, balances, spread, and PnL for DRK/USDT. Toggle premium modules (anti-gap, nice chart, sniper watcher, etc.) to show how each feature changes market quality.",
  },
  {
    title: "Premium features included",
    body: "Trader, Order Book Builder, Liquidity Provider, Price Watcher, Balance Watcher, Anti-Gap, Cleaner, Ladder/Grid, Quote Hunter, Volatility Chart, Volume Volatility, Price Maker Volume, Sniper Bot Watcher, Nice Chart, DEX Price Watcher.",
  },
  {
    title: "Going live",
    body: "Deploy the Next.js app (Vercel or any Node host) for the web UI. For real fills, configure and run the engine/ bot with exchange API keys, MongoDB, and pair DRK/USDT (or the listed Darkfi market).",
  },
];

export default function DocsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-300">
            Documentation
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Demo Pump · Darkfi Coin
          </h1>
          <p className="mt-2 text-slate-400">
            Project overview, modules, and how each part is used.
          </p>
        </div>
        <a
          href="/Demo_Pump_Darkfi_Documentation.pdf"
          className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-300"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>
      </div>

      <div className="mt-10 space-y-4">
        {sections.map((s) => (
          <article key={s.title} className="panel p-5">
            <div className="mb-2 flex items-center gap-2 text-teal-300">
              <FileText className="h-4 w-4" />
              <h2 className="text-lg font-semibold text-white">{s.title}</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{s.body}</p>
          </article>
        ))}
      </div>

      <div className="panel mt-6 p-5 text-sm text-slate-400">
        <p className="font-medium text-white">Quick start</p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-teal-100">
{`cd demo-pump
npm install
npm run dev
# open http://localhost:3000
npm run docs:pdf   # regenerate PDF`}
        </pre>
      </div>
    </main>
  );
}
