"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2, MapPin, Package, User, XCircle } from "lucide-react";
import { useGetOrderQuery } from "@/lib/api/ordersApi";
import { formatCurrency } from "@/components/dashboard/format";
import useOrderStatusChange, { noticeClass } from "@/components/orders/useOrderStatusChange";
import {
  NEXT_STEP,
  canCancel,
  PaymentBadge,
  StatusBadge,
  customerName,
  formatDateTime,
  itemCount,
  paymentMethodLabel,
  shippingMethodLabel,
} from "@/components/orders/orderUtils";

// The normal path of an order; Cancelled is shown separately
const STEPS = ["Ordered", "Packed", "Shipped", "Delivered"];

// Card with a small icon heading
function Card({ title, icon: Icon, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-line bg-white shadow-sm ${className}`}>
      <h2 className="flex items-center gap-2 border-b border-line px-5 py-3 text-sm font-semibold text-ink">
        {Icon && <Icon size={16} className="text-muted" />}
        {title}
      </h2>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

// One label / value row
function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{children}</dd>
    </div>
  );
}

// Ordered -> Packed -> Shipped -> Delivered, filled up to the current status (display only)
function StatusProgress({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger">
        <XCircle size={16} /> This order was cancelled
      </div>
    );
  }
  const current = STEPS.indexOf(status);
  return (
    <ol className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  done ? "bg-brand text-white" : "bg-mist text-subtle ring-1 ring-line-strong"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={`text-xs ${done ? "font-medium text-ink" : "text-subtle"}`}>{step}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={`mx-2 mb-5 h-0.5 flex-1 rounded ${i < current ? "bg-brand" : "bg-line-strong"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function ViewOrderPage() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderQuery(id);
  const { changeStatus: change, isUpdating, updatingStatus, notice } = useOrderStatusChange();
  const changeStatus = (status) => change(order, status);

  if (isLoading) return <p className="p-6 text-muted">Loading order...</p>;
  if (error || !order) {
    return (
      <div className="p-6">
        <p className="text-danger">Order not found</p>
        <Link href="/orders" className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
          <ArrowLeft size={14} /> Back to orders
        </Link>
      </div>
    );
  }

  const items = order.items ?? [];
  const address = order.shippingAddress ?? {};
  const user = order.user;
  const payment = order.paymentInfo ?? {};

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted">
            <Link href="/orders" className="hover:text-brand">
              Orders
            </Link>
            <span>/</span>
            <span className="font-medium text-ink-soft">{order.orderNumber}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Order {order.orderNumber}</h1>
            <StatusBadge status={order.status} />
            <PaymentBadge status={order.paymentStatus} />
          </div>
          <p className="mt-1 text-sm text-muted">
            Placed on {formatDateTime(order.createdAt)}
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <> · Last updated {formatDateTime(order.updatedAt)}</>
            )}
          </p>
        </div>

        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-line-strong bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-mist sm:self-auto"
        >
          <ArrowLeft size={15} /> Back to orders
        </Link>
      </div>

      {/* Progress + status actions */}
      <div className="mb-6 rounded-xl border border-line bg-white px-5 py-5 shadow-sm">
        <StatusProgress status={order.status} />

        {(NEXT_STEP[order.status] || canCancel(order.status)) && (
          <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-4">
            {canCancel(order.status) && (
              <button
                type="button"
                onClick={() => changeStatus("Cancelled")}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-white px-4 py-2 text-sm font-medium text-danger shadow-sm transition hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingStatus === "Cancelled" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <XCircle size={15} />
                )}
                Cancel order
              </button>
            )}
            {NEXT_STEP[order.status] && (
              <button
                type="button"
                onClick={() => changeStatus(NEXT_STEP[order.status])}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingStatus === NEXT_STEP[order.status] ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <ArrowRight size={15} />
                )}
                Mark as {NEXT_STEP[order.status]}
              </button>
            )}
          </div>
        )}

        {notice && (
          <p
            role="status"
            className={`mt-4 rounded-lg px-4 py-2.5 text-sm ${noticeClass(notice.type)}`}
          >
            {notice.text}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: items + totals */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Card title={`Items (${itemCount(order)})`} icon={Package}>
            <ul className="-my-2 divide-y divide-line">
              {items.map((item, i) => (
                <li key={`${item.product}-${item.size}-${i}`} className="flex items-center gap-4 py-3">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-14 shrink-0 rounded-lg border border-line object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-lg bg-snow text-[10px] text-subtle">
                      No image
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product}`}
                      className="line-clamp-1 text-sm font-medium text-ink hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">
                      {item.size ? `Size ${item.size} · ` : ""}
                      {item.quantity} × {formatCurrency(item.price ?? 0)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {formatCurrency((item.price ?? 0) * (item.quantity ?? 0))}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Summary">
            <dl>
              <Row label="Subtotal">{formatCurrency(order.subTotal ?? 0)}</Row>
              <Row label={`Shipping (${shippingMethodLabel(order.shippingMethod)})`}>
                {order.shipping ? formatCurrency(order.shipping) : "Free"}
              </Row>
              <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
                <dt className="text-sm font-semibold text-ink">Total</dt>
                <dd className="text-lg font-semibold text-ink">{formatCurrency(order.totalAmount ?? 0)}</dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* Right: customer, address, payment */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Customer" icon={User}>
            <p className="text-sm font-medium text-ink">{customerName(user)}</p>
            {user?.email && (
              <a href={`mailto:${user.email}`} className="mt-1 block text-sm text-brand hover:underline">
                {user.email}
              </a>
            )}
            {user?.phone && <p className="mt-1 text-sm text-muted">{user.phone}</p>}
          </Card>

          <Card title="Shipping address" icon={MapPin}>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-ink">{address.name}</p>
              {address.tag && (
                <span className="rounded bg-mist px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {address.tag}
                </span>
              )}
            </div>
            <address className="mt-1 text-sm not-italic leading-relaxed text-ink-soft">
              {address.line1}
              {address.line2 && <><br />{address.line2}</>}
              <br />
              {[address.city, address.state].filter(Boolean).join(", ")}
              {address.pinCode && ` - ${address.pinCode}`}
            </address>
            {address.phone && <p className="mt-2 text-sm text-muted">Phone: {address.phone}</p>}
          </Card>

          <Card title="Payment" icon={CreditCard}>
            <dl>
              <Row label="Method">{paymentMethodLabel(order.paymentMethod)}</Row>
              <Row label="Status">
                <PaymentBadge status={order.paymentStatus} />
              </Row>
              {order.paymentMethod === "razorpay" && (
                <>
                  <Row label="Paid at">{formatDateTime(payment.paidAt)}</Row>
                  <Row label="Payment ID">
                    <span className="break-all font-mono text-xs">{payment.razorpayPaymentId ?? "—"}</span>
                  </Row>
                  <Row label="Razorpay order">
                    <span className="break-all font-mono text-xs">{payment.razorpayOrderId ?? "—"}</span>
                  </Row>
                </>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
