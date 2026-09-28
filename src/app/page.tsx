import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Layers,
  Shield,
  Sparkles,
  Waves,
} from "lucide-react";

const highlights = [
  {
    icon: Layers,
    title: "Premium MM suite",
    text: "Trader, order book builder, liquidity, anti-gap, cleaner, sniper watcher, and more.",
  },
  {
    icon: Waves,
    title: "Simulation mode",
    text: "Paper market for Darkfi Coin so you can demo pump strategy without live keys.",
  },
  {
    icon: Shield,
    title: "Self-hosted control",
    text: "Built on adamant-tradebot concepts — your keys, your server, your rules.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 ring-1 ring-teal-300/30">
            <Activity className="h-5 w-5 text-teal-300" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">Demo Pump</p>
            <p className="text-xs text-slate-400">Darkfi Coin · DRK/USDT</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="hidden rounded-full px-4 py-2 text-sm text-slate-300 transition hover:text-white sm:inline-flex"
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-16">
        <div className="rise">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs text-teal-200">
            <Sparkles className="h-3.5 w-3.5" />
            Live web demo · Simulation ready
          </div>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Demo Pump
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-300">
            Premium market-making for{" "}
            <span className="accent-text font-semibold">Darkfi Coin</span> —
            depth, spread, volume, and chart quality in one modern dark console.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Launch Darkfi demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <BookOpen className="h-4 w-4" />
              Project PDF & guide
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Engine concepts adapted from adamant-tradebot · Coin: Darkfi Coin (DRK)
          </p>
        </div>

        <div className="panel rise relative overflow-hidden p-5" style={{ animationDelay: "80ms" }}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market</p>
              <p className="text-xl font-semibold text-white">DRK / USDT</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              <span className="pulse-dot" />
              SIMULATION
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-4 ring-1 ring-white/5">
            <p className="text-sm text-slate-400">Last price</p>
            <p className="mt-1 font-mono text-4xl font-semibold text-white">0.0842</p>
            <p className="mt-2 text-sm text-emerald-400">+4.82% · 24h demo pump</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                ["Spread", "21 bps"],
                ["Depth", "Healthy"],
                ["Volume", "$1.2M"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/5 px-2 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{k}</p>
                  <p className="mt-1 text-sm font-medium text-white">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {["Order book builder active", "Liquidity + anti-gap on", "Nice chart shaping"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-teal-400/5 px-3 py-2 text-sm text-slate-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item, i) => (
            <div
              key={item.title}
              className="panel-soft rise p-5"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              <item.icon className="h-5 w-5 text-sky-300" />
              <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
