import { formatNumber } from "@/components/dashboard/format";

export default function TrafficSources({ sources }) {
  const max = Math.max(...sources.map((s) => s.sessions));
  const total = sources.reduce((a, s) => a + s.sessions, 0);
  const best = sources.reduce((a, s) => (s.conversion > a.conversion ? s : a));

  return (
    <div>
      <div className="mb-3 flex justify-between text-[11px] font-medium uppercase tracking-wide text-subtle">
        <span>Source</span>
        <span>Sessions · Conv.</span>
      </div>
      <ul className="space-y-3.5">
        {sources.map((s) => (
          <li key={s.source} title={`${s.source}: ${formatNumber(s.sessions)} sessions, ${s.conversion}% conversion`}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="text-ink">{s.source}</span>
              <span className="tabular-nums text-muted">
                {formatNumber(s.sessions)}
                <span className="ml-2 inline-block w-10 text-right text-xs font-medium text-ink">
                  {s.conversion}%
                </span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-mist">
              <div className="h-1.5 rounded-full bg-brand" style={{ width: `${(s.sessions / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-shimmer pt-3 text-xs text-subtle">
        <span className="font-medium text-ink">{best.source}</span> converts best at {best.conversion}% ·{" "}
        {formatNumber(total)} sessions in total
      </p>
    </div>
  );
}
