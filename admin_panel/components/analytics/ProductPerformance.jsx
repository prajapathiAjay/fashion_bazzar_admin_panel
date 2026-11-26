import Link from "next/link";
import { Star } from "lucide-react";
import { formatCompactINR, formatNumber } from "@/components/dashboard/format";

// Best-selling products in the selected range (from /admin/stats/analytics -> productPerformance)
export default function ProductPerformance({ products }) {
  const maxRevenue = Math.max(...products.map((p) => p.revenue), 1);

  return (
    <div className="-mx-5 -mb-5 overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-y border-shimmer bg-snow text-left text-xs uppercase tracking-wide text-subtle">
            <th className="px-5 py-2.5 font-medium">Product</th>
            <th className="px-5 py-2.5 text-right font-medium">Units sold</th>
            <th className="px-5 py-2.5 text-right font-medium">Orders</th>
            <th className="px-5 py-2.5 font-medium">Revenue</th>
            <th className="px-5 py-2.5 text-right font-medium">Rating</th>
            <th className="px-5 py-2.5 text-right font-medium">In stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-shimmer">
          {products.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-snow">
              <td className="px-5 py-3 leading-tight">
                <Link href={`/products/${p.id}`} className="font-medium text-ink hover:text-brand hover:underline">
                  {p.name}
                </Link>
                <p className="text-xs text-subtle">{p.category}</p>
              </td>
              <td className="px-5 py-3 text-right font-medium tabular-nums text-ink">{formatNumber(p.sold)}</td>
              <td className="px-5 py-3 text-right tabular-nums text-muted">{formatNumber(p.orders)}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 rounded-full bg-mist">
                    <div
                      className="h-1.5 rounded-full bg-brand"
                      style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-ink">{formatCompactINR(p.revenue)}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-muted">
                {p.ratingCount ? (
                  <span className="inline-flex items-center gap-1">
                    <Star size={12} className="fill-sun text-sun" />
                    {p.rating.toFixed(1)}
                    <span className="text-xs text-subtle">({p.ratingCount})</span>
                  </span>
                ) : (
                  <span className="text-subtle">—</span>
                )}
              </td>
              <td
                className={`px-5 py-3 text-right tabular-nums ${
                  p.stock === 0 ? "font-medium text-danger" : "text-muted"
                }`}
              >
                {p.stock == null ? "—" : formatNumber(p.stock)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
