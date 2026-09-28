import type { TradeFill } from "@/lib/simulation/types";

export function TradeFeed({ trades }: { trades: TradeFill[] }) {
  return (
    <div className="panel flex flex-col p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Recent trades
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">Live fills</h2>
      </div>
      <div className="scrollbar-thin max-h-[420px] space-y-1 overflow-auto">
        {trades.length === 0 && (
          <p className="text-sm text-slate-500">Waiting for simulated fills…</p>
        )}
        {trades.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-[64px_1fr_1fr] items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-2 text-xs"
          >
            <span
              className={`rounded-md px-2 py-1 text-center font-semibold uppercase ${
                t.side === "buy"
                  ? "bg-emerald-400/15 text-emerald-300"
                  : "bg-rose-400/15 text-rose-300"
              }`}
            >
              {t.side}
            </span>
            <span className="font-mono text-slate-200">
              {t.price.toFixed(5)}
            </span>
            <span className="text-right font-mono text-slate-400">
              {t.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
              DRK
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
