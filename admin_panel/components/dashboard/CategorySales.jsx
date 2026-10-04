import { formatCompactINR, formatCurrency } from "./format";

export default function CategorySales({ data }) {
  const max = Math.max(...data.map((d) => d.revenue));
  const total = data.reduce((a, d) => a + d.revenue, 0);

  return (
    <ul className="space-y-4">
      {data.map((d) => (
        <li key={d.name} className="group" title={`${d.name}: ${formatCurrency(d.revenue)}`}>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="text-[#2A2A28]">{d.name}</span>
            <span className="tabular-nums text-[#6B6B63]">
              {formatCompactINR(d.revenue)}
              <span className="ml-2 text-xs text-[#A6A69C]">{((d.revenue / total) * 100).toFixed(0)}%</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#F3F0EA]">
            <div
              className="h-2 rounded-full bg-[#7A1F2B] transition-opacity group-hover:opacity-80"
              style={{ width: `${(d.revenue / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
