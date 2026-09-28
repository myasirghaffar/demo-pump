import type { OrderBookLevel } from "@/lib/simulation/types";

function Row({
  level,
  side,
  max,
}: {
  level: OrderBookLevel;
  side: "bid" | "ask";
  max: number;
}) {
  const width = Math.min(100, (level.total / max) * 100);
  const bg =
    side === "bid" ? "rgba(34,197,94,0.14)" : "rgba(244,63,94,0.14)";
  const color = side === "bid" ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="relative grid grid-cols-3 gap-2 px-2 py-1 text-xs font-mono">
      <div
        className="absolute inset-y-0 right-0"
        style={{ width: `${width}%`, background: bg }}
      />
      <span className={`relative ${color}`}>{level.price.toFixed(5)}</span>
      <span className="relative text-right text-slate-300">
        {level.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
      <span className="relative text-right text-slate-500">
        {level.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
    </div>
  );
}

export function OrderBook({
  book,
  mid,
}: {
  book: { bids: OrderBookLevel[]; asks: OrderBookLevel[] };
  mid: number;
}) {
  const asks = [...book.asks].slice(0, 12).reverse();
  const bids = book.bids.slice(0, 12);
  const max = Math.max(
    ...asks.map((a) => a.total),
    ...bids.map((b) => b.total),
    1,
  );

  return (
    <div className="panel flex flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Order book
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">DRK depth</h2>
        </div>
        <p className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-slate-300">
          mid {mid.toFixed(5)}
        </p>
      </div>
      <div className="mb-1 grid grid-cols-3 gap-2 px-2 text-[10px] uppercase tracking-wide text-slate-500">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>
      <div className="scrollbar-thin max-h-[360px] overflow-auto">
        {asks.map((level) => (
          <Row key={`a-${level.price}`} level={level} side="ask" max={max} />
        ))}
        <div className="my-2 rounded-lg bg-teal-400/10 px-3 py-2 text-center font-mono text-sm text-teal-200">
          {mid.toFixed(5)} USDT
        </div>
        {bids.map((level) => (
          <Row key={`b-${level.price}`} level={level} side="bid" max={max} />
        ))}
      </div>
    </div>
  );
}
