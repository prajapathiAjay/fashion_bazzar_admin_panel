"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import Table from "@/components/admin/Table";
import { useGetCustomersQuery } from "@/lib/api/customersApi";
import { formatCurrency } from "@/components/dashboard/format";
import { customerName, formatDate } from "@/components/orders/orderUtils";

const columns = [
  { col_label: "Customer", value: "customerCell" },
  { col_label: "Phone", value: "phone" },
  { col_label: "Joined", value: "joined" },
  { col_label: "Orders", value: "orders" },
  { col_label: "Total spent", value: "spent" },
  { col_label: "Last order", value: "lastOrder" },
  { col_label: "Actions", value: "view" },
];

// First letters of the name for the round avatar ("Ravi Kumar" -> "RK")
const initials = (c) =>
  ([c.firstName?.[0], c.lastName?.[0]].filter(Boolean).join("") || c.email?.[0] || "?").toUpperCase();

export default function CustomersPage() {
  const { data: customers = [], isLoading, error } = useGetCustomersQuery();
  const [search, setSearch] = useState("");

  // search by name, email or phone
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [customerName(c), c.email, c.phone].filter(Boolean).some((text) => text.toLowerCase().includes(q))
    );
  }, [customers, search]);

  if (isLoading) return <p className="text-muted">Loading customers...</p>;
  if (error) return <p className="text-danger">Failed to load customers</p>;

  const rows = filtered.map((c) => ({
    _id: c._id,
    customerCell: (
      <Link href={`/customers/${c._id}`} className="group flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand">
          {initials(c)}
        </span>
        <span className="leading-tight">
          <span className="block font-medium text-ink group-hover:text-brand">{customerName(c)}</span>
          <span className="block text-xs text-muted">{c.email}</span>
        </span>
      </Link>
    ),
    phone: c.phone || <span className="text-subtle">—</span>,
    joined: formatDate(c.createdAt),
    orders: c.orderCount,
    spent: <span className="font-medium">{formatCurrency(c.totalSpent ?? 0)}</span>,
    lastOrder: c.lastOrderAt ? formatDate(c.lastOrderAt) : <span className="text-subtle">No orders yet</span>,
    view: (
      <Link
        href={`/customers/${c._id}`}
        className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-white px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-mist hover:text-ink"
      >
        <Eye size={14} /> View
      </Link>
    ),
  }));

  return (
    <>
      {/* Heading and search in one row so the table keeps its height */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <h3 className="text-base font-semibold text-ink">Customers</h3>
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-muted">{customers.length}</span>

        <label className="relative ml-auto">
          <span className="sr-only">Search customers</span>
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email or phone"
            className="h-9 w-64 rounded-md border border-line-strong bg-white pl-8 pr-3 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </div>

      <Table columns={columns} data={rows} />
    </>
  );
}
