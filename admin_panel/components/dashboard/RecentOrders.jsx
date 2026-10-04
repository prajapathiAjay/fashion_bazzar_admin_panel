import { CheckCircle2, Truck, Loader, Clock, XCircle } from "lucide-react";
import { formatCurrency } from "./format";

// Icon + label so status never relies on colour alone
const STATUS_STYLES = {
  Delivered: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", icon: CheckCircle2 },
  Shipped: { cls: "bg-indigo-50 text-indigo-700 ring-indigo-600/15", icon: Truck },
  Processing: { cls: "bg-amber-50 text-amber-800 ring-amber-600/20", icon: Loader },
  Pending: { cls: "bg-stone-100 text-stone-700 ring-stone-500/15", icon: Clock },
  Cancelled: { cls: "bg-red-50 text-red-700 ring-red-600/15", icon: XCircle },
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
          <tr className="border-y border-[#EFECE5] bg-[#FAFAF8] text-left text-xs font-medium uppercase tracking-wide text-[#8A8A80]">
            <th className="px-5 py-2.5 font-medium">Order</th>
            <th className="px-5 py-2.5 font-medium">Customer</th>
            <th className="px-5 py-2.5 font-medium">Date</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFECE5]">
          {orders.map((o) => (
            <tr key={o.id} className="transition-colors hover:bg-[#FAFAF8]">
              <td className="px-5 py-3 font-medium text-[#2A2A28]">
                {o.id}
                <p className="text-xs font-normal text-[#A6A69C]">
                  {o.items} item{o.items > 1 ? "s" : ""}
                </p>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F1E8] text-xs font-medium text-[#7A1F2B]">
                    {o.customer.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="leading-tight">
                    <p className="text-[#2A2A28]">{o.customer}</p>
                    <p className="text-xs text-[#A6A69C]">{o.email}</p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-[#6B6B63]">{o.date}</td>
              <td className="px-5 py-3">
                <StatusBadge status={o.status} />
              </td>
              <td className="px-5 py-3 text-right font-medium tabular-nums text-[#2A2A28]">{formatCurrency(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
