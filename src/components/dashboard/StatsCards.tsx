import type { BotStats } from "@/lib/simulation/types";

function fmt(n: number, digits = 4) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function fmtUsd(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function StatsCards({ stats }: { stats: BotStats }) {
  const cards = [
    {
      label: "DRK Price",
      value: `$${fmt(stats.price, 4)}`,
      sub: `${stats.change24h >= 0 ? "+" : ""}${stats.change24h}% 24h`,
      tone: stats.change24h >= 0 ? "text-emerald-400" : "text-rose-400",
    },
    {
      label: "24h Volume",
      value: fmtUsd(stats.volume24h),
      sub: `${stats.filledToday} fills today`,
      tone: "text-sky-300",
    },
    {
      label: "Spread",
      value: `${stats.spreadBps} bps`,
      sub: `Bid ${fmt(stats.bid, 4)} · Ask ${fmt(stats.ask, 4)}`,
      tone: "text-teal-300",
    },
    {
      label: "Sim PnL",
      value: `${stats.pnlUSDT >= 0 ? "+" : ""}${fmt(stats.pnlUSDT, 2)} USDT`,
      sub: `${stats.openOrders} open orders`,
      tone: stats.pnlUSDT >= 0 ? "text-emerald-400" : "text-rose-400",
    },
    {
      label: "DRK Balance",
      value: fmt(stats.balances.DRK, 0),
      sub: "Darkfi Coin inventory",
      tone: "text-white",
    },
    {
      label: "USDT Balance",
      value: fmt(stats.balances.USDT, 0),
      sub: "Quote reserve",
      tone: "text-white",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map((c) => (
        <div key={c.label} className="panel-soft px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            {c.label}
          </p>
          <p className={`mt-2 font-mono text-lg font-semibold ${c.tone}`}>
            {c.value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
