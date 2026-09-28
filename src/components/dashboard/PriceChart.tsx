"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BotStats, Candle } from "@/lib/simulation/types";

export function PriceChart({
  candles,
  stats,
}: {
  candles: Candle[];
  stats: BotStats;
}) {
  const data = candles.map((c) => ({
    time: new Date(c.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: c.close,
    volume: c.volume,
  }));

  return (
    <div className="panel p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Price chart
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            {stats.pair} · Darkfi Coin
          </h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-semibold text-white">
            ${stats.price.toFixed(4)}
          </p>
          <p
            className={`text-sm ${
              stats.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {stats.change24h >= 0 ? "+" : ""}
            {stats.change24h}% · H {stats.high24h.toFixed(4)} / L{" "}
            {stats.low24h.toFixed(4)}
          </p>
        </div>
      </div>
      <div className="h-[280px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="drkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(120,160,200,0.08)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={58}
              tickFormatter={(v) => Number(v).toFixed(4)}
            />
            <Tooltip
              contentStyle={{
                background: "#0d1420",
                border: "1px solid rgba(120,160,200,0.2)",
                borderRadius: 12,
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "#2dd4bf" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2dd4bf"
              strokeWidth={2}
              fill="url(#drkFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
