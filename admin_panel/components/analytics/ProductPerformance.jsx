import { AlertTriangle } from "lucide-react";
import { formatCompactINR, formatNumber } from "@/components/dashboard/format";

// Return rate above this gets flagged — tune to your category norms
const RETURN_WARN = 10;

export default function ProductPerformance({ products }) {
  const maxRevenue = Math.max(...products.map((p) => p.revenue));

  return (
    <div className="-mx-5 -mb-5 overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-y border-shimmer bg-snow text-left text-xs uppercase tracking-wide text-subtle">
            <th className="px-5 py-2.5 font-medium">Product</th>
            <th className="px-5 py-2.5 text-right font-medium">Views</th>
            <th className="px-5 py-2.5 text-right font-medium">Add-to-cart</th>
            <th className="px-5 py-2.5 text-right font-medium">Conversion</th>
            <th className="px-5 py-2.5 font-medium">Revenue</th>
            <th className="px-5 py-2.5 text-right font-medium">Return rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-shimmer">
          {products.map((p) => {
            const flagged = p.returnRate > RETURN_WARN;
            return (
              <tr key={p.name} className="transition-colors hover:bg-snow">
                <td className="px-5 py-3 leading-tight">
                  <p className="font-medium text-ink">{p.name}</p>
                  <p className="text-xs text-subtle">{p.category}</p>
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-muted">{formatNumber(p.views)}</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted">{p.cartRate}%</td>
                <td className="px-5 py-3 text-right font-medium tabular-nums text-ink">{p.conversion}%</td>
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
                <td className="px-5 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1 tabular-nums ${
                      flagged ? "font-medium text-danger" : "text-muted"
                    }`}
                  >
                    {flagged && <AlertTriangle size={12} strokeWidth={2} />}
                    {p.returnRate}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
