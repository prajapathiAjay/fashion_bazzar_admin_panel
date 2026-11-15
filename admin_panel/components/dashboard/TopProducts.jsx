import { formatCompactINR, formatNumber } from "./format";

export default function TopProducts({ products }) {
  return (
    <ol className="space-y-4">
      {products.map((p, i) => (
        <li key={p.name} className="flex items-center gap-3">
          <span className="w-4 text-xs font-medium text-subtle tabular-nums">{i + 1}</span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mist font-display text-sm text-brand">
            {p.initials}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-ink">{p.name}</p>
            <p className="text-xs text-subtle">{p.category}</p>
          </div>
          <div className="text-right leading-tight">
            <p className="text-sm font-medium tabular-nums text-ink">{formatCompactINR(p.revenue)}</p>
            <p className="text-xs tabular-nums text-subtle">{formatNumber(p.sold)} sold</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
