"use client";

import { useState } from "react";
import { Clock, IndianRupee, Truck } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/format";
import { SAMPLE_CARTS, etaLabel, shippingCost } from "./shippingUtils";

/**
 * Create / edit a delivery option.
 * Pass `initialValues` for edit mode.
 *
 * @param {object} [initialValues]
 * @param {(method: object) => Promise|void} onSubmit  receives the cleaned method; throw to show an error
 * @param {() => void} onCancel
 */

const empty = { name: "", description: "", price: "", freeAbove: "", minDays: "", maxDays: "", enabled: true };
const toText = (v) => (v === null || v === undefined ? "" : String(v));

const inputClass = (error) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder-subtle shadow-sm transition focus:outline-none focus:ring-4 ${
    error ? "border-danger/60 focus:border-danger focus:ring-danger-50" : "border-line-strong focus:border-brand focus:ring-brand-100"
  }`;
const labelClass = "mb-1.5 block text-sm font-medium text-ink-soft";
const cardClass = "rounded-xl border border-line bg-white shadow-sm";

const Err = ({ msg }) => (msg ? <p className="mt-1.5 text-xs text-danger">{msg}</p> : null);

function CardHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-5 py-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand">
        <Icon size={16} />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ShippingMethodForm({ initialValues, onSubmit, onCancel }) {
  const isEdit = Boolean(initialValues);
  const [form, setForm] = useState(() =>
    initialValues
      ? {
          ...empty,
          name: initialValues.name ?? "",
          description: initialValues.description ?? "",
          price: toText(initialValues.price),
          freeAbove: toText(initialValues.freeAbove),
          minDays: toText(initialValues.minDays),
          maxDays: toText(initialValues.maxDays),
          enabled: initialValues.enabled ?? true,
        }
      : empty
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Give it a name";
    if (form.price === "" || Number(form.price) < 0) e.price = "Enter a price (0 for free)";
    if (form.freeAbove !== "" && Number(form.freeAbove) < 0) e.freeAbove = "Must be 0 or more";
    if (form.minDays === "" || Number(form.minDays) < 0) e.minDays = "Required";
    if (form.maxDays === "" || Number(form.maxDays) < 0) e.maxDays = "Required";
    if (!e.minDays && !e.maxDays && Number(form.minDays) > Number(form.maxDays)) e.maxDays = "Must be at least the minimum";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      await onSubmit?.({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        freeAbove: form.freeAbove === "" ? null : Number(form.freeAbove),
        minDays: Number(form.minDays),
        maxDays: Number(form.maxDays),
        enabled: form.enabled,
      });
    } catch (err) {
      setErrors({ form: err?.data?.message || "Could not save the shipping method" });
    } finally {
      setSubmitting(false);
    }
  };

  const buttons = (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-line-strong bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-sm transition hover:bg-snow"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : isEdit ? "Save changes" : "Create method"}
      </button>
    </>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-5xl pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted">
            <button type="button" onClick={onCancel} className="hover:text-brand">
              Shipping
            </button>
            <span>/</span>
            <span className="font-medium text-ink-soft">{isEdit ? initialValues.name : "New"}</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {isEdit ? "Edit shipping method" : "Add shipping method"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isEdit
              ? `Code "${initialValues.code}" stays the same so past orders still match.`
              : "For example Same day, Next day, Store pickup or Heavy items."}
          </p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">{buttons}</div>
      </div>

      {errors.form && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger-50 px-4 py-3 text-sm text-danger">{errors.form}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Name */}
          <section className={cardClass}>
            <CardHeader icon={Truck} title="Details" subtitle="What shoppers see at checkout" />
            <div className="space-y-5 p-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={set("name")}
                  maxLength={40}
                  placeholder="e.g. Same day"
                  className={inputClass(errors.name)}
                  autoFocus={!isEdit}
                />
                <Err msg={errors.name} />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>
                  Short description
                </label>
                <input
                  id="description"
                  value={form.description}
                  onChange={set("description")}
                  maxLength={80}
                  placeholder="e.g. Delivered today in metro cities"
                  className={inputClass()}
                />
              </div>
            </div>
          </section>

          {/* Price */}
          <section className={cardClass}>
            <CardHeader icon={IndianRupee} title="Price" subtitle="What the shopper pays for delivery" />
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (₹) <span className="text-danger">*</span>
                </label>
                <input id="price" type="number" min="0" value={form.price} onChange={set("price")} placeholder="99" className={inputClass(errors.price)} />
                <p className="mt-1.5 text-xs text-subtle">Use 0 to always make it free.</p>
                <Err msg={errors.price} />
              </div>
              <div>
                <label htmlFor="freeAbove" className={labelClass}>
                  Free on orders of (₹)
                </label>
                <input
                  id="freeAbove"
                  type="number"
                  min="0"
                  value={form.freeAbove}
                  onChange={set("freeAbove")}
                  placeholder="Never free"
                  className={inputClass(errors.freeAbove)}
                />
                <p className="mt-1.5 text-xs text-subtle">Leave empty if it should never be free.</p>
                <Err msg={errors.freeAbove} />
              </div>
            </div>
          </section>

          {/* Time */}
          <section className={cardClass}>
            <CardHeader icon={Clock} title="Delivery time" subtitle="Business days, shown as the estimate" />
            <div className="p-5">
              <div className="flex flex-wrap items-start gap-3">
                <div>
                  <label htmlFor="minDays" className="mb-1.5 block text-xs text-muted">From</label>
                  <input id="minDays" type="number" min="0" value={form.minDays} onChange={set("minDays")} placeholder="4" className={`${inputClass(errors.minDays)} w-28`} />
                  <Err msg={errors.minDays} />
                </div>
                <div>
                  <label htmlFor="maxDays" className="mb-1.5 block text-xs text-muted">To</label>
                  <input id="maxDays" type="number" min="0" value={form.maxDays} onChange={set("maxDays")} placeholder="6" className={`${inputClass(errors.maxDays)} w-28`} />
                  <Err msg={errors.maxDays} />
                </div>
              </div>
              <p className="mt-2 text-xs text-subtle">Use 0 to 0 for same-day delivery.</p>
            </div>
          </section>
        </div>

        {/* Side */}
        <div className="space-y-6">
          <section className={`${cardClass} p-5`}>
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-ink">Show at checkout</span>
                <span className="block text-xs text-muted">Turn off to hide it without deleting</span>
              </span>
              <input type="checkbox" checked={form.enabled} onChange={set("enabled")} className="peer sr-only" />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
            </label>
          </section>

          {/* Preview: looks like the checkout option */}
          <section className={`${cardClass} lg:sticky lg:top-24`}>
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink">Preview</h2>
              <p className="text-xs text-muted">How it looks at checkout</p>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-brand bg-brand-50/60 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
                  <Truck size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink">{form.name || "Method name"}</span>
                  <span className="block text-xs text-subtle">
                    {form.minDays !== "" && form.maxDays !== "" ? etaLabel(form) : "Delivery time"}
                  </span>
                </span>
                <span className="text-sm font-bold text-ink">
                  {form.price === "" ? "₹—" : Number(form.price) === 0 ? "Free" : formatCurrency(Number(form.price))}
                </span>
              </div>

              <table className="w-full text-sm">
                <tbody className="divide-y divide-line">
                  {SAMPLE_CARTS.map((cart) => {
                    const cost = shippingCost(form, cart);
                    return (
                      <tr key={cart}>
                        <td className="py-2 text-muted">{formatCurrency(cart)} cart</td>
                        <td className="py-2 text-right">
                          {cost === 0 ? <span className="font-semibold text-success">Free</span> : formatCurrency(cost)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Phone: buttons stuck to the bottom */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-end gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        {buttons}
      </div>
    </form>
  );
}
