"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Search, X, XCircle } from "lucide-react";
import Table from "@/components/admin/Table";
import ActionsMenu from "@/components/admin/ActionsMenu";
import { useGetOrdersQuery } from "@/lib/api/ordersApi";
import { formatCurrency } from "@/components/dashboard/format";
import useOrderStatusChange, { noticeClass } from "@/components/orders/useOrderStatusChange";
import {
  NEXT_STEP,
  canCancel,
  ORDER_STATUSES,
  PaymentBadge,
  StatusBadge,
  customerName,
  formatDate,
  itemCount,
  paymentMethodLabel,
} from "@/components/orders/orderUtils";

const columns = [
  { col_label: "Order", value: "orderCell" },
  { col_label: "Customer", value: "customerCell" },
  { col_label: "Date", value: "date" },
  { col_label: "Items", value: "items" },
  { col_label: "Total", value: "total" },
  { col_label: "Payment", value: "paymentCell" },
  { col_label: "Status", value: "statusCell" },
  { col_label: "Actions", value: "actions" },
];

const FILTERS = ["All", ...ORDER_STATUSES];

export default function OrdersPage() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { changeStatus, updatingId, updatingStatus, notice, clearNotice } = useOrderStatusChange();

  // hide the result message after a few seconds (warnings/errors stay until closed)
  useEffect(() => {
    if (notice?.type !== "success") return undefined;
    const timer = setTimeout(clearNotice, 4000);
    return () => clearTimeout(timer);
  }, [notice]); // eslint-disable-line react-hooks/exhaustive-deps

  // how many orders are in each status, for the filter pills
  const counts = useMemo(() => {
    const c = { All: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  // filter by status, then by order number / customer name / email
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      if (!q) return true;
      return [o.orderNumber, customerName(o.user), o.user?.email]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(q));
    });
  }, [orders, statusFilter, search]);

  if (isLoading) return <p className="text-muted">Loading orders...</p>;
  if (error) return <p className="text-danger">Failed to load orders</p>;

  const rows = filtered.map((o) => ({
    _id: o._id,
    orderCell: (
      <Link href={`/orders/${o._id}`} className="font-semibold text-ink hover:text-brand">
        {o.orderNumber ?? o._id.slice(-6)}
      </Link>
    ),
    customerCell: (
      <div className="leading-tight">
        <p className="font-medium text-ink">{customerName(o.user)}</p>
        {o.user?.email && <p className="text-xs text-muted">{o.user.email}</p>}
      </div>
    ),
    date: formatDate(o.createdAt),
    items: itemCount(o),
    total: <span className="font-medium">{formatCurrency(o.totalAmount ?? 0)}</span>,
    paymentCell: (
      <div className="flex flex-col items-start gap-1">
        <PaymentBadge status={o.paymentStatus} />
        <span className="text-xs text-muted">{paymentMethodLabel(o.paymentMethod)}</span>
      </div>
    ),
    statusCell: <StatusBadge status={o.status} />,
    actions: <ActionsMenu label={`Actions for ${o.orderNumber}`} items={rowActions(o)} />,
  }));

  // View, then only the status changes this order is allowed (same rules as the backend)
  function rowActions(o) {
    const busy = updatingId === o._id;
    const items = [{ label: "View details", icon: Eye, href: `/orders/${o._id}` }];
    const next = NEXT_STEP[o.status];
    if (next) {
      items.push({
        label: busy && updatingStatus === next ? "Saving..." : `Mark as ${next}`,
        icon: ArrowRight,
        disabled: busy,
        onClick: () => changeStatus(o, next),
      });
    }
    if (canCancel(o.status)) {
      items.push({
        label: busy && updatingStatus === "Cancelled" ? "Cancelling..." : "Cancel order",
        icon: XCircle,
        danger: true,
        disabled: busy,
        onClick: () => changeStatus(o, "Cancelled"),
      });
    }
    return items;
  }

  return (
    <>
      {/* Heading, status filters and search in one row so the table keeps its height */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <h3 className="mr-2 text-base font-semibold text-ink">Orders</h3>

        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              aria-pressed={statusFilter === f}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === f
                  ? "bg-brand text-white"
                  : "bg-white text-ink-soft ring-1 ring-line-strong hover:bg-mist"
              }`}
            >
              {f} <span className="opacity-70">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>

        <label className="relative ml-auto">
          <span className="sr-only">Search orders</span>
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order no., customer or email"
            className="h-9 w-64 rounded-md border border-line-strong bg-white pl-8 pr-3 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </div>

      <Table columns={columns} data={rows} />

      {/* Result of a status change, floating so the table doesn't jump */}
      {notice && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-[0_12px_32px_rgba(28,23,20,0.14)] ring-1 ring-black/5 ${noticeClass(notice.type)}`}
        >
          <p className="flex-1">{notice.text}</p>
          <button type="button" onClick={clearNotice} aria-label="Close message" className="opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
