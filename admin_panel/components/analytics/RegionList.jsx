import { formatCompactINR, formatNumber } from "@/components/dashboard/format";

export default function RegionList({ regions }) {
  const max = Math.max(...regions.map((r) => r.revenue));

  return (
    <ul className="space-y-3.5">
      {regions.map((r, i) => (
        <li key={r.state} className="flex items-center gap-3">
          <span className="w-4 text-xs font-medium tabular-nums text-subtle">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="truncate text-ink">{r.state}</span>
              <span className="tabular-nums text-ink">
                {formatCompactINR(r.revenue)}
                <span className="ml-2 text-xs text-subtle">{formatNumber(r.orders)} orders</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-mist">
              <div className="h-1.5 rounded-full bg-brand" style={{ width: `${(r.revenue / max) * 100}%` }} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
