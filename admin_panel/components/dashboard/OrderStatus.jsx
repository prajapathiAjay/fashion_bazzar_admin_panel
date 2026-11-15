import { formatNumber } from "./format";

export default function OrderStatus({ data }) {
  const total = data.reduce((a, d) => a + d.count, 0);

  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight text-ink tabular-nums">{formatNumber(total)}</p>
      <p className="text-xs text-subtle">orders this period</p>

      {/* Single stacked bar; 2px white gaps keep adjacent segments distinct */}
      <div className="mt-5 flex h-3 gap-[2px] overflow-hidden rounded-full">
        {data.map((d) => (
          <div
            key={d.status}
            title={`${d.status}: ${formatNumber(d.count)}`}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(d.count / total) * 100}%`, backgroundColor: d.color }}
          />
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        {data.map((d) => (
          <li key={d.status} className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
            <div className="leading-tight">
              <p className="text-xs text-muted">{d.status}</p>
              <p className="text-sm font-medium text-ink tabular-nums">
                {formatNumber(d.count)}
                <span className="ml-1.5 text-xs font-normal text-subtle">
                  {((d.count / total) * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
