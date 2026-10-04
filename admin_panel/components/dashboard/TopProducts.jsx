import { formatCompactINR, formatNumber } from "./format";

export default function TopProducts({ products }) {
  return (
    <ol className="space-y-4">
      {products.map((p, i) => (
        <li key={p.name} className="flex items-center gap-3">
          <span className="w-4 text-xs font-medium text-[#A6A69C] tabular-nums">{i + 1}</span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F1E8] font-serif text-sm text-[#7A1F2B]">
            {p.initials}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-[#2A2A28]">{p.name}</p>
            <p className="text-xs text-[#A6A69C]">{p.category}</p>
          </div>
          <div className="text-right leading-tight">
            <p className="text-sm font-medium tabular-nums text-[#2A2A28]">{formatCompactINR(p.revenue)}</p>
            <p className="text-xs tabular-nums text-[#A6A69C]">{formatNumber(p.sold)} sold</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
