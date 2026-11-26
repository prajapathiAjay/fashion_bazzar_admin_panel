import Link from "next/link";
import { formatCurrency } from "./format";
import { StatusBadge, formatDateTime } from "@/components/orders/orderUtils";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

// Latest orders in the store (from /admin/stats/dashboard -> recentOrders)
export default function RecentOrders({ orders }) {
  return (
    <div className="-mx-5 -mb-5 overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-y border-shimmer bg-snow text-left text-xs font-medium uppercase tracking-wide text-subtle">
            <th className="px-5 py-2.5 font-medium">Order</th>
            <th className="px-5 py-2.5 font-medium">Customer</th>
            <th className="px-5 py-2.5 font-medium">Date</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-shimmer">
          {orders.map((o) => (
            <tr key={o.id} className="transition-colors hover:bg-snow">
              <td className="px-5 py-3 font-medium text-ink">
                <Link href={`/orders/${o.id}`} className="hover:text-brand hover:underline">
                  {o.orderNumber}
                </Link>
                <p className="text-xs font-normal text-subtle">
                  {o.items} item{o.items === 1 ? "" : "s"}
                </p>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-medium text-brand">
                    {initials(o.customer)}
                  </span>
                  <div className="leading-tight">
                    <p className="text-ink">{o.customer}</p>
                    <p className="text-xs text-subtle">{o.email}</p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-muted">{formatDateTime(o.createdAt)}</td>
              <td className="px-5 py-3">
                <StatusBadge status={o.status} />
              </td>
              <td className="px-5 py-3 text-right font-medium tabular-nums text-ink">{formatCurrency(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
