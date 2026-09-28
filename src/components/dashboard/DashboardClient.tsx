"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  Pause,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import type { MarketSnapshot } from "@/lib/simulation/types";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { OrderBook } from "@/components/dashboard/OrderBook";
import { TradeFeed } from "@/components/dashboard/TradeFeed";
import { FeaturesPanel } from "@/components/dashboard/FeaturesPanel";
import { ControlPanel } from "@/components/dashboard/ControlPanel";

async function fetchMarket(): Promise<MarketSnapshot> {
  const res = await fetch("/api/market", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load market");
  return res.json();
}

async function postControl(body: Record<string, unknown>) {
  const res = await fetch("/api/control", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Control failed");
  return res.json();
}

export function DashboardClient() {
  const [data, setData] = useState<MarketSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const snap = await fetchMarket();
      setData(snap);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load error");
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 1500);
    return () => clearInterval(id);
  }, [refresh]);

  const run = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      await postControl(body);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const stats = data?.stats;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#070b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/15 ring-1 ring-teal-300/30">
                <Activity className="h-4 w-4 text-teal-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Demo Pump</p>
                <p className="text-[11px] text-slate-400">Darkfi Coin console</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {stats && (
              <div className="mr-2 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 md:flex">
                <span className="pulse-dot" />
                {stats.mode.toUpperCase()} · {stats.status.toUpperCase()} ·{" "}
                {stats.pair}
              </div>
            )}
            <button
              disabled={busy}
              onClick={() => run({ action: "start" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/20 hover:bg-emerald-400/25 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" /> Start
            </button>
            <button
              disabled={busy}
              onClick={() => run({ action: "pause" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1.5 text-xs font-medium text-amber-300 ring-1 ring-amber-400/20 hover:bg-amber-400/25 disabled:opacity-50"
            >
              <Pause className="h-3.5 w-3.5" /> Pause
            </button>
            <button
              disabled={busy}
              onClick={() => run({ action: "stop" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-400/15 px-3 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-400/25 disabled:opacity-50"
            >
              <Square className="h-3.5 w-3.5" /> Stop
            </button>
            <button
              disabled={busy}
              onClick={() => run({ action: "reset" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-300 ring-1 ring-sky-400/20 hover:bg-sky-400/20"
            >
              <BookOpen className="h-3.5 w-3.5" /> Docs
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-4 px-4 py-4 sm:px-6 sm:py-6">
        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {!data ? (
          <div className="panel flex h-64 items-center justify-center text-slate-400">
            Loading Darkfi market…
          </div>
        ) : (
          <>
            <StatsCards stats={data.stats} />

            <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
              <PriceChart candles={data.candles} stats={data.stats} />
              <OrderBook book={data.orderBook} mid={data.stats.midPrice} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
              <ControlPanel
                stats={data.stats}
                busy={busy}
                onMode={(mode) => run({ action: "mode", mode })}
              />
              <FeaturesPanel
                features={data.stats.features}
                busy={busy}
                onToggle={(id, active) =>
                  run({ action: "toggleFeature", id, active })
                }
              />
              <TradeFeed trades={data.trades} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
