import type { BotStats } from "@/lib/simulation/types";

function formatUptime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}

export function ControlPanel({
  stats,
  busy,
  onMode,
}: {
  stats: BotStats;
  busy: boolean;
  onMode: (mode: "simulation" | "live") => void;
}) {
  return (
    <div className="panel p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Control
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">Bot mode</h2>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-1 text-sm font-semibold uppercase text-white">
            {stats.status}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Uptime {formatUptime(stats.uptimeSec)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={busy}
            onClick={() => onMode("simulation")}
            className={`rounded-xl px-3 py-3 text-sm font-medium ring-1 transition disabled:opacity-50 ${
              stats.mode === "simulation"
                ? "bg-teal-400/15 text-teal-200 ring-teal-400/30"
                : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
            }`}
          >
            Simulation
          </button>
          <button
            disabled={busy}
            onClick={() => onMode("live")}
            className={`rounded-xl px-3 py-3 text-sm font-medium ring-1 transition disabled:opacity-50 ${
              stats.mode === "live"
                ? "bg-rose-400/15 text-rose-200 ring-rose-400/30"
                : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
            }`}
          >
            Live (prep)
          </button>
        </div>

        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-100/90">
          <strong className="font-semibold text-amber-200">Demo note:</strong>{" "}
          Simulation is fully active for Darkfi Coin. Live mode is a preparation
          switch — connect exchange API keys via the sibling{" "}
          <code className="text-amber-50">adamant-tradebot</code> engine for
          production fills.
        </div>

        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Pair</span>
            <span className="font-mono text-slate-200">{stats.pair}</span>
          </div>
          <div className="flex justify-between">
            <span>Coin</span>
            <span className="text-slate-200">Darkfi Coin (DRK)</span>
          </div>
          <div className="flex justify-between">
            <span>Active modules</span>
            <span className="text-slate-200">
              {stats.features.filter((f) => f.active).length}/
              {stats.features.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
