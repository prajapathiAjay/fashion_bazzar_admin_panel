"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { useGetCustomerQuery } from "@/lib/api/customersApi";
import { formatCurrency } from "@/components/dashboard/format";
import {
  PaymentBadge,
  StatusBadge,
  customerName,
  formatDate,
  itemCount,
  paymentMethodLabel,
} from "@/components/orders/orderUtils";

// Card with a small icon heading
function Card({ title, icon: Icon, children, action }) {
  return (
    <section className="rounded-xl border border-line bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          {Icon && <Icon size={16} className="text-muted" />}
          {title}
        </h2>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1.5 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default function ViewCustomerPage() {
  const { id } = useParams();
  const { data: customer, isLoading, error } = useGetCustomerQuery(id);

  if (isLoading) return <p className="p-6 text-muted">Loading customer...</p>;
  if (error || !customer) {
    return (
      <div className="p-6">
        <p className="text-danger">Customer not found</p>
        <Link href="/customers" className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
          <ArrowLeft size={14} /> Back to customers
        </Link>
      </div>
    );
  }

  const orders = customer.orders ?? [];
  const addresses = customer.addresses ?? [];
  // cancelled orders are not money spent
  const counted = orders.filter((o) => o.status !== "Cancelled");
  const totalSpent = counted.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const avgOrder = counted.length ? totalSpent / counted.length : 0;
  const initials =
    ([customer.firstName?.[0], customer.lastName?.[0]].filter(Boolean).join("") || customer.email?.[0] || "?").toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-muted">
            <Link href="/customers" className="hover:text-brand">
              Customers
            </Link>
            <span>/</span>
            <span className="truncate font-medium text-ink-soft">{customerName(customer)}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg font-semibold text-brand">
              {initials}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-ink">{customerName(customer)}</h1>
              <p className="mt-0.5 text-sm text-muted">Customer since {formatDate(customer.createdAt)}</p>
            </div>
          </div>
        </div>

        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-line-strong bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-mist sm:self-auto"
        >
          <ArrowLeft size={15} /> Back to customers
        </Link>
      </div>

      {/* Numbers */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Orders" value={orders.length} />
        <Stat label="Total spent" value={formatCurrency(totalSpent)} />
        <Stat label="Average order" value={formatCurrency(Math.round(avgOrder))} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: contact + addresses */}
        <div className="flex flex-col gap-6">
          <Card title="Contact">
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-muted" />
                <a href={`mailto:${customer.email}`} className="truncate text-brand hover:underline">
                  {customer.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-muted" />
                {customer.phone ? (
                  <span className="text-ink">{customer.phone}</span>
                ) : (
                  <span className="text-subtle">No phone added</span>
                )}
              </li>
            </ul>
          </Card>

          <Card title={`Addresses (${addresses.length})`} icon={MapPin}>
            {addresses.length === 0 ? (
              <p className="text-sm text-subtle">No saved addresses</p>
            ) : (
              <ul className="-my-1 divide-y divide-line">
                {addresses.map((a, i) => (
                  <li key={a._id ?? i} className="py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded bg-mist px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {a.tag || "Address"}
                      </span>
                      {a.isDefault && (
                        <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                          Default
                        </span>
                      )}
                    </div>
                    <address className="text-sm not-italic leading-relaxed text-ink-soft">
                      {a.line1}
                      {a.line2 && <>, {a.line2}</>}
                      <br />
                      {[a.city, a.state].filter(Boolean).join(", ")}
                      {a.pinCode && ` - ${a.pinCode}`}
                    </address>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right: order history */}
        <div className="lg:col-span-2">
          <Card title={`Orders (${orders.length})`} icon={ShoppingBag}>
            {orders.length === 0 ? (
              <p className="py-6 text-center text-sm text-subtle">This customer hasn&apos;t ordered anything yet</p>
            ) : (
              <div className="-mx-5 -my-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-line text-sm">
                  <thead className="bg-snow">
                    <tr>
                      {["Order", "Date", "Items", "Total", "Payment", "Status"].map((h) => (
                        <th key={h} className="whitespace-nowrap px-5 py-2.5 text-left font-semibold text-ink-soft">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {orders.map((o) => (
                      <tr key={o._id} className="transition-colors hover:bg-snow">
                        <td className="whitespace-nowrap px-5 py-3">
                          <Link href={`/orders/${o._id}`} className="font-semibold text-ink hover:text-brand">
                            {o.orderNumber}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-ink-soft">{formatDate(o.createdAt)}</td>
                        <td className="px-5 py-3 text-ink-soft">{itemCount(o)}</td>
                        <td className="whitespace-nowrap px-5 py-3 font-medium text-ink">
                          {formatCurrency(o.totalAmount ?? 0)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <PaymentBadge status={o.paymentStatus} />
                            <span className="text-xs text-muted">{paymentMethodLabel(o.paymentMethod)}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <StatusBadge status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
