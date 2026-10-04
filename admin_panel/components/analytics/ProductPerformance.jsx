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
          <tr className="border-y border-[#EFECE5] bg-[#FAFAF8] text-left text-xs uppercase tracking-wide text-[#8A8A80]">
            <th className="px-5 py-2.5 font-medium">Product</th>
            <th className="px-5 py-2.5 text-right font-medium">Views</th>
            <th className="px-5 py-2.5 text-right font-medium">Add-to-cart</th>
            <th className="px-5 py-2.5 text-right font-medium">Conversion</th>
            <th className="px-5 py-2.5 font-medium">Revenue</th>
            <th className="px-5 py-2.5 text-right font-medium">Return rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFECE5]">
          {products.map((p) => {
            const flagged = p.returnRate > RETURN_WARN;
            return (
              <tr key={p.name} className="transition-colors hover:bg-[#FAFAF8]">
                <td className="px-5 py-3 leading-tight">
                  <p className="font-medium text-[#2A2A28]">{p.name}</p>
                  <p className="text-xs text-[#A6A69C]">{p.category}</p>
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-[#6B6B63]">{formatNumber(p.views)}</td>
                <td className="px-5 py-3 text-right tabular-nums text-[#6B6B63]">{p.cartRate}%</td>
                <td className="px-5 py-3 text-right font-medium tabular-nums text-[#2A2A28]">{p.conversion}%</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 rounded-full bg-[#F3F0EA]">
                      <div
                        className="h-1.5 rounded-full bg-[#7A1F2B]"
                        style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-[#2A2A28]">{formatCompactINR(p.revenue)}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1 tabular-nums ${
                      flagged ? "font-medium text-red-700" : "text-[#6B6B63]"
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
