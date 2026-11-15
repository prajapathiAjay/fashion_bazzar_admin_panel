import { CheckCircle2, Truck, Loader, Clock, XCircle } from "lucide-react";
import { formatCurrency } from "./format";

// Icon + label so status never relies on colour alone
const STATUS_STYLES = {
  Delivered: { cls: "bg-success-50 text-success ring-success/15", icon: CheckCircle2 },
  Shipped: { cls: "bg-brand-50 text-brand-dark ring-brand/15", icon: Truck },
  Processing: { cls: "bg-sun-50 text-ink-soft ring-sun-dark/20", icon: Loader },
  Pending: { cls: "bg-mist text-ink-soft ring-muted/15", icon: Clock },
  Cancelled: { cls: "bg-danger-50 text-danger ring-danger/15", icon: XCircle },
};

export function StatusBadge({ status }) {
  const { cls, icon: Icon } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      <Icon size={12} strokeWidth={2} />
      {status}
    </span>
  );
}

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
                {o.id}
                <p className="text-xs font-normal text-subtle">
                  {o.items} item{o.items > 1 ? "s" : ""}
                </p>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-medium text-brand">
                    {o.customer.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="leading-tight">
                    <p className="text-ink">{o.customer}</p>
                    <p className="text-xs text-subtle">{o.email}</p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-muted">{o.date}</td>
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
