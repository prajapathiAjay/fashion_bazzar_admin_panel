import { formatCompactINR, formatNumber } from "@/components/dashboard/format";

export default function RegionList({ regions }) {
  const max = Math.max(...regions.map((r) => r.revenue));

  return (
    <ul className="space-y-3.5">
      {regions.map((r, i) => (
        <li key={r.state} className="flex items-center gap-3">
          <span className="w-4 text-xs font-medium tabular-nums text-[#A6A69C]">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="truncate text-[#2A2A28]">{r.state}</span>
              <span className="tabular-nums text-[#2A2A28]">
                {formatCompactINR(r.revenue)}
                <span className="ml-2 text-xs text-[#A6A69C]">{formatNumber(r.orders)} orders</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#F3F0EA]">
              <div className="h-1.5 rounded-full bg-[#7A1F2B]" style={{ width: `${(r.revenue / max) * 100}%` }} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
