"use client";

import { useState } from "react";
import { CalendarDays, Percent, IndianRupee, Shuffle, Tag, Users, Eye } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/format";
import { discountCapLabel, discountValueLabel, formatShortDate, generateCode } from "./discountUtils";

/**
 * Create / edit a discount code.
 * Pass `initialValues` for edit mode.
 *
 * @param {object} [initialValues]
 * @param {(discount: object) => Promise|void} onSubmit  receives the cleaned discount
 * @param {() => void} onCancel
 */

const empty = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  maxDiscount: "",
  minOrder: "",
  usageLimit: "",
  perCustomer: "1",
  startsAt: "", // set to today when the form opens (see useState below)
  endsAt: "",
  isActive: true,
};

// Date from the API -> "2026-10-15" for <input type="date">, in the admin's own time zone
// (the API sends UTC, so IST midnight arrives as the previous day 18:30Z; slicing the string would be a day off)
const toDateInput = (v) => {
  if (!v) return "";
  const d = new Date(v);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const toText = (v) => (v === null || v === undefined ? "" : String(v));

const EXAMPLE_CART = 2000;

// ---- small pieces, kept outside the form so React doesn't recreate them every render ----

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

function ActionButtons({ onCancel, submitting, isEdit }) {
  return (
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
        {submitting ? "Saving..." : isEdit ? "Save changes" : "Create discount"}
      </button>
    </>
  );
}

export default function DiscountForm({ initialValues, onSubmit, onCancel }) {
  const isEdit = Boolean(initialValues);
  const [form, setForm] = useState(() =>
    initialValues
      ? {
          ...empty,
          ...initialValues,
          value: toText(initialValues.value),
          maxDiscount: toText(initialValues.maxDiscount),
          minOrder: toText(initialValues.minOrder),
          usageLimit: toText(initialValues.usageLimit),
          perCustomer: toText(initialValues.perCustomer),
          startsAt: toDateInput(initialValues.startsAt),
          endsAt: toDateInput(initialValues.endsAt),
        }
      : { ...empty, startsAt: toDateInput(new Date()) }
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (field === "code") value = value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const isPercent = form.type === "percentage";

  const validate = () => {
    const e = {};
    const value = Number(form.value);
    if (form.code.length < 3) e.code = "Code must be at least 3 characters";
    if (!form.value || value <= 0) e.value = "Enter a discount value";
    else if (isPercent && value > 90) e.value = "Percentage can't be more than 90%";
    if (form.maxDiscount && Number(form.maxDiscount) <= 0) e.maxDiscount = "Must be more than 0";
    if (!isPercent && form.minOrder && value >= Number(form.minOrder))
      e.value = "Flat discount must be less than the minimum order";
    if (form.usageLimit && Number(form.usageLimit) < 1) e.usageLimit = "Must be at least 1";
    if (!form.perCustomer || Number(form.perCustomer) < 1) e.perCustomer = "Must be at least 1";
    if (!form.startsAt) e.startsAt = "Pick a start date";
    if (form.endsAt && form.startsAt && form.endsAt < form.startsAt) e.endsAt = "End date is before the start date";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    // numbers as numbers, empty optional fields as null
    const num = (v) => (v === "" ? null : Number(v));
    const discount = {
      code: form.code,
      description: form.description.trim(),
      type: form.type,
      value: Number(form.value),
      maxDiscount: isPercent ? num(form.maxDiscount) : null,
      minOrder: num(form.minOrder) ?? 0,
      usageLimit: num(form.usageLimit),
      perCustomer: Number(form.perCustomer),
      startsAt: form.startsAt,
      endsAt: form.endsAt || null,
      isActive: form.isActive,
    };

    setSubmitting(true);
    try {
      await onSubmit?.(discount);
    } catch (err) {
      setErrors({ form: err?.data?.message || "Could not save the discount" });
    } finally {
      setSubmitting(false);
    }
  };

  // what a shopper saves on an example cart
  const exampleSaving = (() => {
    const value = Number(form.value) || 0;
    if (form.minOrder && EXAMPLE_CART < Number(form.minOrder)) return null;
    let saving = isPercent ? (EXAMPLE_CART * value) / 100 : value;
    if (isPercent && form.maxDiscount) saving = Math.min(saving, Number(form.maxDiscount));
    return Math.min(saving, EXAMPLE_CART);
  })();

  const preview = { ...form, value: Number(form.value) || 0, maxDiscount: Number(form.maxDiscount) || null };

  // ---- styles (same as CategoryForm / ProductForm) ----
  const inputClass = (field) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder-subtle shadow-sm transition focus:outline-none focus:ring-4 ${
      errors[field]
        ? "border-danger/60 focus:border-danger focus:ring-danger-50"
        : "border-line-strong focus:border-brand focus:ring-brand-100"
    }`;
  const cardClass = "rounded-xl border border-line bg-white shadow-sm";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-soft";
  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-6xl pb-24">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted">
            <button type="button" onClick={onCancel} className="hover:text-brand">
              Discounts
            </button>
            <span>/</span>
            <span className="font-medium text-ink-soft">{isEdit ? form.code || "Edit" : "New"}</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {isEdit ? "Edit discount" : "Create discount"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isEdit ? "Update the code and save your changes." : "Make a code shoppers can apply at checkout."}
          </p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <ActionButtons onCancel={onCancel} submitting={submitting} isEdit={isEdit} />
        </div>
      </div>

      {errors.form && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger-50 px-4 py-3 text-sm text-danger">
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Code */}
          <section className={cardClass}>
            <CardHeader icon={Tag} title="Discount code" subtitle="What shoppers type at checkout" />
            <div className="space-y-5 p-5">
              <div>
                <label htmlFor="code" className={labelClass}>
                  Code <span className="text-danger">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="code"
                    value={form.code}
                    onChange={set("code")}
                    placeholder="e.g. FESTIVE25"
                    className={`${inputClass("code")} font-mono uppercase tracking-wider`}
                    autoFocus={!isEdit}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, code: generateCode() }));
                      setErrors((er) => ({ ...er, code: undefined }));
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 text-sm font-medium text-ink-soft shadow-sm transition hover:bg-mist"
                  >
                    <Shuffle size={15} /> Generate
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-subtle">Capital letters, numbers and dashes only.</p>
                <Err msg={errors.code} />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value.slice(0, 120) }))}
                  placeholder="e.g. Festive sale on all ethnic wear (only admins see this)"
                  className={inputClass("description")}
                />
              </div>
            </div>
          </section>

          {/* Value */}
          <section className={cardClass}>
            <CardHeader icon={Percent} title="Discount value" subtitle="How much the shopper saves" />
            <div className="space-y-5 p-5">
              {/* Type switch */}
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-mist p-1">
                {[
                  { type: "percentage", label: "Percentage", icon: Percent },
                  { type: "fixed", label: "Fixed amount", icon: IndianRupee },
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type }))}
                    aria-pressed={form.type === type}
                    className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition ${
                      form.type === type ? "bg-white text-brand shadow-sm" : "text-muted hover:text-ink"
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="value" className={labelClass}>
                    {isPercent ? "Percentage off" : "Amount off (₹)"} <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="value"
                      type="number"
                      min="0"
                      value={form.value}
                      onChange={set("value")}
                      placeholder={isPercent ? "25" : "200"}
                      className={`${inputClass("value")} ${isPercent ? "pr-9" : "pl-8"}`}
                    />
                    {!isPercent && (
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">₹</span>
                    )}
                    {isPercent && (
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">%</span>
                    )}
                  </div>
                  <Err msg={errors.value} />
                </div>

                {isPercent && (
                  <div>
                    <label htmlFor="maxDiscount" className={labelClass}>
                      Maximum discount (₹)
                    </label>
                    <input
                      id="maxDiscount"
                      type="number"
                      min="0"
                      value={form.maxDiscount}
                      onChange={set("maxDiscount")}
                      placeholder="No limit"
                      className={inputClass("maxDiscount")}
                    />
                    <p className="mt-1.5 text-xs text-subtle">Caps the saving on big carts.</p>
                    <Err msg={errors.maxDiscount} />
                  </div>
                )}

                <div>
                  <label htmlFor="minOrder" className={labelClass}>
                    Minimum order (₹)
                  </label>
                  <input
                    id="minOrder"
                    type="number"
                    min="0"
                    value={form.minOrder}
                    onChange={set("minOrder")}
                    placeholder="Any amount"
                    className={inputClass("minOrder")}
                  />
                  <p className="mt-1.5 text-xs text-subtle">Cart total needed before the code works.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Limits */}
          <section className={cardClass}>
            <CardHeader icon={Users} title="Usage limits" subtitle="How many times the code can be used" />
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <label htmlFor="usageLimit" className={labelClass}>
                  Total uses
                </label>
                <input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={form.usageLimit}
                  onChange={set("usageLimit")}
                  placeholder="Unlimited"
                  className={inputClass("usageLimit")}
                />
                <Err msg={errors.usageLimit} />
              </div>
              <div>
                <label htmlFor="perCustomer" className={labelClass}>
                  Uses per customer <span className="text-danger">*</span>
                </label>
                <input
                  id="perCustomer"
                  type="number"
                  min="1"
                  value={form.perCustomer}
                  onChange={set("perCustomer")}
                  className={inputClass("perCustomer")}
                />
                <Err msg={errors.perCustomer} />
              </div>
            </div>
          </section>

          {/* Dates */}
          <section className={cardClass}>
            <CardHeader icon={CalendarDays} title="Active dates" subtitle="When shoppers can use the code" />
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <label htmlFor="startsAt" className={labelClass}>
                  Starts on <span className="text-danger">*</span>
                </label>
                <input id="startsAt" type="date" value={form.startsAt} onChange={set("startsAt")} className={inputClass("startsAt")} />
                <Err msg={errors.startsAt} />
              </div>
              <div>
                <label htmlFor="endsAt" className={labelClass}>
                  Ends on
                </label>
                <input id="endsAt" type="date" value={form.endsAt} onChange={set("endsAt")} className={inputClass("endsAt")} />
                <p className="mt-1.5 text-xs text-subtle">Leave empty for no end date.</p>
                <Err msg={errors.endsAt} />
              </div>
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Status */}
          <section className={`${cardClass} p-5`}>
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-ink">Active</span>
                <span className="block text-xs text-muted">Turn off to pause the code without deleting it</span>
              </span>
              <input type="checkbox" checked={form.isActive} onChange={set("isActive")} className="peer sr-only" />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
            </label>
          </section>

          {/* Live preview */}
          <section className={`${cardClass} sticky top-24`}>
            <CardHeader icon={Eye} title="Preview" subtitle="How it adds up" />
            <div className="space-y-4 p-5">
              {/* Coupon ticket */}
              <div className="relative overflow-hidden rounded-xl bg-brand px-5 py-4 text-white">
                <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                <p className="text-2xl font-semibold">{discountValueLabel(preview)}</p>
                {discountCapLabel(preview) && <p className="text-xs text-white/75">{discountCapLabel(preview)}</p>}
                <div className="mt-3 border-t border-dashed border-white/30 pt-3">
                  <span className="rounded-md bg-white/15 px-2 py-1 font-mono text-sm font-semibold tracking-widest">
                    {form.code || "YOURCODE"}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-ink-soft">
                <li>
                  {form.minOrder ? <>On orders of {formatCurrency(Number(form.minOrder))} or more</> : "On any order amount"}
                </li>
                <li>
                  {form.usageLimit ? `${Number(form.usageLimit).toLocaleString("en-IN")} uses in total` : "Unlimited uses"},{" "}
                  {form.perCustomer || 1} per customer
                </li>
                <li>
                  {formatShortDate(form.startsAt) ? `From ${formatShortDate(form.startsAt)}` : "No start date"}
                  {form.endsAt ? ` to ${formatShortDate(form.endsAt)}` : ", no end date"}
                </li>
              </ul>

              <div className="rounded-lg bg-snow px-4 py-3 text-sm">
                <p className="text-muted">On a {formatCurrency(EXAMPLE_CART)} cart</p>
                {exampleSaving === null ? (
                  <p className="mt-0.5 font-medium text-ink-soft">Code doesn&apos;t apply (below minimum)</p>
                ) : (
                  <p className="mt-0.5 font-medium text-ink">
                    Saves <span className="text-success">{formatCurrency(exampleSaving)}</span> · pays{" "}
                    {formatCurrency(EXAMPLE_CART - exampleSaving)}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Phone: buttons stuck to the bottom */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-end gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <ActionButtons onCancel={onCancel} submitting={submitting} isEdit={isEdit} />
      </div>
    </form>
  );
}
