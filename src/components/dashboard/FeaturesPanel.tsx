import type { FeatureState } from "@/lib/simulation/types";

export function FeaturesPanel({
  features,
  busy,
  onToggle,
}: {
  features: FeatureState[];
  busy: boolean;
  onToggle: (id: string, active: boolean) => void;
}) {
  return (
    <div className="panel p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Modules
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          Premium + core features
        </h2>
      </div>
      <div className="scrollbar-thin max-h-[420px] space-y-2 overflow-auto pr-1">
        {features.map((f) => (
          <button
            key={f.id}
            disabled={busy}
            onClick={() => onToggle(f.id, !f.active)}
            className="flex w-full items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-left transition hover:bg-white/[0.06] disabled:opacity-50"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-white">{f.name}</span>
                {f.premium && (
                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                    Premium
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {f.description}
              </p>
            </div>
            <span
              className={`mt-0.5 inline-flex min-w-[52px] justify-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                f.active
                  ? "bg-teal-400/15 text-teal-300"
                  : "bg-slate-500/20 text-slate-400"
              }`}
            >
              {f.active ? "On" : "Off"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
