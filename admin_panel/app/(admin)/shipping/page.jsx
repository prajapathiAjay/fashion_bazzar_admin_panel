"use client";

import { useState } from "react";
import { Calculator, Loader2, Truck, Zap } from "lucide-react";
import { useGetShippingSettingsQuery, useUpdateShippingSettingsMutation } from "@/lib/api/shippingApi";
import { formatCurrency } from "@/components/dashboard/format";

const METHODS = [
  { key: "standard", label: "Standard delivery", icon: Truck, hint: "The everyday option" },
  { key: "express", label: "Express delivery", icon: Zap, hint: "Faster, usually costs more" },
];

// example cart totals for the preview table
const SAMPLE_CARTS = [499, 999, 1999, 4999];

// API values -> strings for the inputs ("" = empty box)
const toForm = (m) => ({
  enabled: m?.enabled ?? true,
  price: m?.price ?? "",
  freeAbove: m?.freeAbove ?? "",
  minDays: m?.minDays ?? "",
  maxDays: m?.maxDays ?? "",
});

// same rule as the backend (shipping.schema.js calcShippingCost)
const costFor = (m, subTotal) => {
  if (m.freeAbove !== "" && subTotal >= Number(m.freeAbove)) return 0;
  return Number(m.price) || 0;
};

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder-subtle shadow-sm transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:bg-snow disabled:text-subtle";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-soft";

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span className="text-xs font-medium text-muted">{checked ? "On" : "Off"}</span>
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}

// The form is a separate component so it can start from the loaded settings
function ShippingForm({ settings }) {
  const [updateSettings, { isLoading: saving }] = useUpdateShippingSettingsMutation();
  const [form, setForm] = useState({ standard: toForm(settings.standard), express: toForm(settings.express) });
  const [notice, setNotice] = useState(null);

  const set = (method, field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [method]: { ...f[method], [field]: value } }));
    setNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // numbers as numbers; empty "free above" = never free
    const clean = (m) => ({
      enabled: m.enabled,
      price: Number(m.price),
      freeAbove: m.freeAbove === "" ? null : Number(m.freeAbove),
      minDays: Number(m.minDays),
      maxDays: Number(m.maxDays),
    });
    try {
      const res = await updateSettings({ standard: clean(form.standard), express: clean(form.express) }).unwrap();
      setNotice({ type: "success", text: res.message || "Saved" });
    } catch (err) {
      setNotice({ type: "error", text: err?.data?.message || "Could not save shipping settings" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Shipping</h1>
          <p className="mt-1 text-sm text-muted">
            Delivery prices and times shoppers see in the cart and at checkout. Changes apply to new orders straight away.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className={`mb-5 rounded-lg px-4 py-2.5 text-sm ${
            notice.type === "success" ? "bg-success-50 text-success" : "bg-danger-50 text-danger"
          }`}
        >
          {notice.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Method cards */}
        <div className="space-y-6 lg:col-span-2">
          {METHODS.map(({ key, label, icon: Icon, hint }) => {
            const m = form[key];
            return (
              <section key={key} className={`rounded-xl border border-line bg-white shadow-sm ${m.enabled ? "" : "opacity-75"}`}>
                <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand">
                      <Icon size={16} />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-ink">{label}</h2>
                      <p className="text-xs text-muted">{m.enabled ? hint : "Hidden from checkout"}</p>
                    </div>
                  </div>
                  <Toggle checked={m.enabled} onChange={set(key, "enabled")} label={`${label} on or off`} />
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${key}-price`} className={labelClass}>
                      Price (₹)
                    </label>
                    <input
                      id={`${key}-price`}
                      type="number"
                      min="0"
                      required
                      value={m.price}
                      onChange={set(key, "price")}
                      disabled={!m.enabled}
                      className={inputClass}
                    />
                    <p className="mt-1.5 text-xs text-subtle">Use 0 to always make it free.</p>
                  </div>

                  <div>
                    <label htmlFor={`${key}-free`} className={labelClass}>
                      Free on orders of (₹)
                    </label>
                    <input
                      id={`${key}-free`}
                      type="number"
                      min="0"
                      value={m.freeAbove}
                      onChange={set(key, "freeAbove")}
                      disabled={!m.enabled}
                      placeholder="Never free"
                      className={inputClass}
                    />
                    <p className="mt-1.5 text-xs text-subtle">Leave empty if it should never be free.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className={labelClass}>Delivery time (business days)</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        required
                        aria-label={`${label} minimum days`}
                        value={m.minDays}
                        onChange={set(key, "minDays")}
                        disabled={!m.enabled}
                        className={`${inputClass} w-28`}
                      />
                      <span className="text-sm text-muted">to</span>
                      <input
                        type="number"
                        min="0"
                        required
                        aria-label={`${label} maximum days`}
                        value={m.maxDays}
                        onChange={set(key, "maxDays")}
                        disabled={!m.enabled}
                        className={`${inputClass} w-28`}
                      />
                      <span className="text-sm text-muted">days</span>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Preview */}
        <section className="h-fit rounded-xl border border-line bg-white shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand">
              <Calculator size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-ink">What shoppers pay</h2>
              <p className="text-xs text-muted">Updates as you type</p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-snow text-left text-xs text-muted">
              <tr>
                <th className="px-5 py-2.5 font-medium">Cart total</th>
                <th className="px-3 py-2.5 font-medium">Standard</th>
                <th className="px-5 py-2.5 font-medium">Express</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SAMPLE_CARTS.map((cart) => (
                <tr key={cart}>
                  <td className="px-5 py-2.5 font-medium text-ink">{formatCurrency(cart)}</td>
                  {METHODS.map(({ key }, i) => {
                    const m = form[key];
                    const cost = costFor(m, cart);
                    return (
                      <td key={key} className={`${i === 0 ? "px-3" : "px-5"} py-2.5`}>
                        {!m.enabled ? (
                          <span className="text-subtle">Off</span>
                        ) : cost === 0 ? (
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

          <div className="space-y-1 border-t border-line px-5 py-4 text-xs text-muted">
            {METHODS.map(({ key, label }) =>
              form[key].enabled ? (
                <p key={key}>
                  {label}: arrives in {form[key].minDays || 0}–{form[key].maxDays || 0} business days
                </p>
              ) : null
            )}
          </div>
        </section>
      </div>
    </form>
  );
}

export default function ShippingPage() {
  const { data: settings, isLoading, error } = useGetShippingSettingsQuery();

  if (isLoading) return <p className="text-muted">Loading shipping settings...</p>;
  if (error || !settings) return <p className="text-danger">Failed to load shipping settings</p>;

  // the form starts from the loaded settings; after a save it already shows what was saved
  return <ShippingForm settings={settings} />;
}
