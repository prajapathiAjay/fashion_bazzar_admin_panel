"use client";

import Link from "next/link";
import { Clock, Pencil, Plus, Trash2, Truck } from "lucide-react";
import ActionsMenu from "@/components/admin/ActionsMenu";
import { formatCurrency } from "@/components/dashboard/format";
import {
  useDeleteShippingMethodMutation,
  useGetShippingMethodsQuery,
  useUpdateShippingMethodMutation,
} from "@/lib/api/shippingApi";
import { SAMPLE_CARTS, etaLabel, shippingCost } from "@/components/shipping/shippingUtils";

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? "cursor-wait opacity-60" : "cursor-pointer"}`}>
      <span className="text-xs font-medium text-muted">{checked ? "On" : "Off"}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}

export default function ShippingPage() {
  const { data: methods = [], isLoading, error } = useGetShippingMethodsQuery();
  const [updateMethod, { isLoading: isToggling, originalArgs: toggleArgs }] = useUpdateShippingMethodMutation();
  const [deleteMethod] = useDeleteShippingMethodMutation();

  const toggle = async (m) => {
    try {
      await updateMethod({ id: m._id, enabled: !m.enabled }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Could not update the method");
    }
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete "${m.name}"? Shoppers won't see it at checkout any more. Past orders keep its name.`)) return;
    try {
      await deleteMethod(m._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Could not delete the method");
    }
  };

  if (isLoading) return <p className="text-muted">Loading shipping methods...</p>;
  if (error) return <p className="text-danger">Failed to load shipping methods</p>;

  const enabled = methods.filter((m) => m.enabled);

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Shipping</h1>
          <p className="mt-1 text-sm text-muted">
            Delivery options shoppers pick at checkout. The first one that is on is selected by default.
          </p>
        </div>
        <Link
          href="/shipping/new"
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark sm:self-auto"
        >
          <Plus size={16} /> Add shipping method
        </Link>
      </div>

      {/* Method cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {methods.map((m, i) => {
          const busy = isToggling && toggleArgs?.id === m._id;
          const isDefault = enabled[0]?._id === m._id;
          return (
            <section
              key={m._id}
              className={`flex flex-col rounded-xl border bg-white shadow-sm transition ${
                m.enabled ? "border-line" : "border-dashed border-line-strong opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3 px-5 pt-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <Truck size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-base font-semibold text-ink">{m.name}</h2>
                      {isDefault && (
                        <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">{m.description || <span className="text-subtle">No description</span>}</p>
                  </div>
                </div>
                <ActionsMenu
                  label={`Actions for ${m.name}`}
                  items={[
                    { label: "Edit", icon: Pencil, href: `/shipping/${m._id}/edit` },
                    { label: "Delete", icon: Trash2, danger: true, onClick: () => remove(m) },
                  ]}
                />
              </div>

              <div className="mt-4 flex items-end justify-between gap-3 px-5">
                <div>
                  <p className="text-2xl font-semibold text-ink">{m.price === 0 ? "Free" : formatCurrency(m.price)}</p>
                  <p className="text-xs text-muted">
                    {m.price === 0
                      ? "Always free"
                      : m.freeAbove != null
                        ? `Free on orders of ${formatCurrency(m.freeAbove)}+`
                        : "Never free"}
                  </p>
                </div>
                <p className="flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink-soft">
                  <Clock size={13} /> {etaLabel(m)}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line px-5 py-3">
                <span className="font-mono text-[11px] text-subtle" title="Code saved on orders">
                  #{i + 1} · {m.code}
                </span>
                <Toggle checked={m.enabled} onChange={() => toggle(m)} disabled={busy} label={`${m.name} on or off`} />
              </div>
            </section>
          );
        })}
      </div>

      {/* Comparison */}
      {enabled.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">What shoppers pay</h2>
            <p className="text-xs text-muted">Delivery charge for different cart totals (methods that are on)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-snow text-left text-xs text-muted">
                <tr>
                  <th className="whitespace-nowrap px-5 py-2.5 font-medium">Cart total</th>
                  {enabled.map((m) => (
                    <th key={m._id} className="whitespace-nowrap px-5 py-2.5 font-medium">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SAMPLE_CARTS.map((cart) => (
                  <tr key={cart}>
                    <td className="whitespace-nowrap px-5 py-2.5 font-medium text-ink">{formatCurrency(cart)}</td>
                    {enabled.map((m) => {
                      const cost = shippingCost(m, cart);
                      return (
                        <td key={m._id} className="whitespace-nowrap px-5 py-2.5">
                          {cost === 0 ? (
                            <span className="font-semibold text-success">Free</span>
                          ) : (
                            <span className="text-ink">{formatCurrency(cost)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
