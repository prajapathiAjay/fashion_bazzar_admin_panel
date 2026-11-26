import Link from "next/link";
import { AlertTriangle } from "lucide-react";

// Active products running out (from /admin/stats/dashboard -> lowStock).
// threshold = the "low" line set in the backend; the bar shows how close to empty each one is.
export default function LowStock({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const pct = item.threshold ? (item.stock / item.threshold) * 100 : 0;
        const critical = item.stock <= 3;
        return (
          <li key={item.id}>
            <Link href={`/products/${item.id}`} className="group block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm text-ink group-hover:text-brand">{item.name}</p>
                  <p className="text-xs text-subtle">{item.category}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums ${
                    critical ? "text-danger" : "text-ink-soft"
                  }`}
                >
                  <AlertTriangle size={12} strokeWidth={2} />
                  {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-mist">
                <div
                  className={`h-1.5 rounded-full ${critical ? "bg-danger" : "bg-sun"}`}
                  style={{ width: `${Math.max(pct, 4)}%` }}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
