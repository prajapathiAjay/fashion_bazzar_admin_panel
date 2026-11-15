import { AlertTriangle } from "lucide-react";

export default function LowStock({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const pct = (item.stock / item.threshold) * 100;
        const critical = item.stock <= 3;
        return (
          <li key={item.sku}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm text-ink">{item.name}</p>
                <p className="text-xs text-subtle">{item.sku}</p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums ${
                  critical ? "text-danger" : "text-ink-soft"
                }`}
              >
                <AlertTriangle size={12} strokeWidth={2} />
                {item.stock} left
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-mist">
              <div
                className={`h-1.5 rounded-full ${critical ? "bg-danger" : "bg-sun"}`}
                style={{ width: `${Math.max(pct, 4)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
