"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Pencil, Plus, Power, Search, Trash2 } from "lucide-react";
import Table from "@/components/admin/Table";
import ActionsMenu from "@/components/admin/ActionsMenu";
import { formatCurrency } from "@/components/dashboard/format";
import {
  useDeleteDiscountMutation,
  useGetDiscountsQuery,
  useUpdateDiscountMutation,
} from "@/lib/api/discountsApi";
import {
  DISCOUNT_STATUSES,
  DiscountStatusBadge,
  discountCapLabel,
  discountStatus,
  discountValueLabel,
  formatShortDate,
} from "@/components/discounts/discountUtils";

const columns = [
  { col_label: "Code", value: "codeCell" },
  { col_label: "Discount", value: "valueCell" },
  { col_label: "Min. order", value: "minOrder" },
  { col_label: "Usage", value: "usageCell" },
  { col_label: "Given away", value: "given" },
  { col_label: "Valid", value: "validCell" },
  { col_label: "Status", value: "statusCell" },
  { col_label: "Actions", value: "actions" },
];

const FILTERS = ["All", ...DISCOUNT_STATUSES];

// used / limit with a small bar ("166 / 1,000")
function Usage({ used, limit }) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : null;
  return (
    <div className="w-32">
      <p className="text-sm text-ink">
        {used.toLocaleString("en-IN")}
        <span className="text-muted"> / {limit ? limit.toLocaleString("en-IN") : "∞"}</span>
      </p>
      {pct !== null && (
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div
            className={`h-full rounded-full ${pct >= 100 ? "bg-muted" : pct >= 80 ? "bg-sun" : "bg-brand"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function DiscountsPage() {
  const { data: discounts = [], isLoading, error } = useGetDiscountsQuery();
  const [updateDiscount, { isLoading: isToggling, originalArgs: toggleArgs }] = useUpdateDiscountMutation();
  const [deleteDiscount, { isLoading: isDeleting, originalArgs: deletingId }] = useDeleteDiscountMutation();
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(null);

  const withStatus = useMemo(() => discounts.map((d) => ({ ...d, status: discountStatus(d) })), [discounts]);

  const counts = useMemo(() => {
    const c = { All: withStatus.length };
    for (const d of withStatus) c[d.status] = (c[d.status] ?? 0) + 1;
    return c;
  }, [withStatus]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return withStatus.filter((d) => {
      if (statusFilter !== "All" && d.status !== statusFilter) return false;
      if (!q) return true;
      return d.code.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
    });
  }, [withStatus, statusFilter, search]);

  // ---- actions ----
  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard blocked, ignore */
    }
  };

  const toggleActive = async (d) => {
    try {
      await updateDiscount({ id: d._id, isActive: !d.isActive }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Could not update the discount");
    }
  };

  const remove = async (d) => {
    if (!window.confirm(`Delete code "${d.code}"? Shoppers won't be able to use it any more.`)) return;
    try {
      await deleteDiscount(d._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Could not delete the discount");
    }
  };

  if (isLoading) return <p className="text-muted">Loading discounts...</p>;
  if (error) return <p className="text-danger">Failed to load discounts</p>;

  const rows = filtered.map((d) => ({
    _id: d._id,
    codeCell: (
      <div className="leading-tight">
        <button
          type="button"
          onClick={() => copyCode(d.code)}
          title="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-brand/40 bg-brand-50 px-2 py-1 font-mono text-xs font-semibold tracking-wider text-brand transition hover:border-brand"
        >
          {d.code}
          <Copy size={12} className="opacity-60" />
        </button>
        {copied === d.code && <span className="ml-2 text-xs text-success">Copied</span>}
        <p className="mt-1 max-w-56 truncate text-xs text-muted" title={d.description}>
          {d.description}
        </p>
      </div>
    ),
    valueCell: (
      <div className="leading-tight">
        <p className="font-semibold text-ink">{discountValueLabel(d)}</p>
        {discountCapLabel(d) && <p className="text-xs text-muted">{discountCapLabel(d)}</p>}
      </div>
    ),
    minOrder: d.minOrder ? formatCurrency(d.minOrder) : <span className="text-subtle">Any</span>,
    usageCell: <Usage used={d.used} limit={d.usageLimit} />,
    given: formatCurrency(d.totalDiscountGiven),
    validCell: (
      <div className="text-xs leading-relaxed text-ink-soft">
        <p>{formatShortDate(d.startsAt) ?? "—"}</p>
        <p className="text-muted">to {formatShortDate(d.endsAt) ?? "no end date"}</p>
      </div>
    ),
    statusCell: <DiscountStatusBadge status={d.status} />,
    actions: (
      <ActionsMenu
        label={`Actions for ${d.code}`}
        items={[
          { label: "Edit", icon: Pencil, href: `/discounts/${d._id}/edit` },
          { label: "Copy code", icon: Copy, onClick: () => copyCode(d.code) },
          {
            label: isToggling && toggleArgs?.id === d._id ? "Saving..." : d.isActive ? "Disable" : "Enable",
            icon: Power,
            disabled: isToggling && toggleArgs?.id === d._id,
            onClick: () => toggleActive(d),
          },
          {
            label: isDeleting && deletingId === d._id ? "Deleting..." : "Delete",
            icon: Trash2,
            danger: true,
            disabled: isDeleting && deletingId === d._id,
            onClick: () => remove(d),
          },
        ]}
      />
    ),
  }));

  return (
    <>
      {/* Heading, filters, search and create button in one row so the table keeps its height */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <h3 className="mr-2 text-base font-semibold text-ink">Discounts</h3>

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

        <div className="ml-auto flex items-center gap-3">
          <label className="relative">
            <span className="sr-only">Search discounts</span>
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code"
              className="h-9 w-52 rounded-md border border-line-strong bg-white pl-8 pr-3 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </label>
          <Link
            href="/discounts/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            <Plus size={16} /> Create discount
          </Link>
        </div>
      </div>

      <Table columns={columns} data={rows} />
    </>
  );
}
