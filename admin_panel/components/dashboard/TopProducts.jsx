import Link from "next/link";
import { formatCompactINR, formatNumber } from "./format";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

// Best sellers by revenue in the selected range (from /admin/stats/dashboard -> topProducts)
export default function TopProducts({ products }) {
  return (
    <ol className="space-y-4">
      {products.map((p, i) => (
        <li key={p.id}>
          <Link href={`/products/${p.id}`} className="group flex items-center gap-3">
            <span className="w-4 text-xs font-medium text-subtle tabular-nums">{i + 1}</span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist font-display text-sm text-brand">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(p.name)
              )}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-ink group-hover:text-brand">{p.name}</p>
              <p className="text-xs text-subtle">{p.category}</p>
            </div>
            <div className="text-right leading-tight">
              <p className="text-sm font-medium tabular-nums text-ink">{formatCompactINR(p.revenue)}</p>
              <p className="text-xs tabular-nums text-subtle">{formatNumber(p.sold)} sold</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
