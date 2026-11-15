"use client";

import { useState } from "react";
import { Boxes, Check, Megaphone, Store, Truck, UserRound } from "lucide-react";

// Static page: these values are samples kept in the browser's memory only.
// When a settings API exists, load them with a query and save them with a mutation.
const INITIAL_SETTINGS = {
  // My account
  adminName: "Admin",
  adminEmail: "admin@fashionbazar.com",
  // Store details (same placeholders as the website's contact page)
  storeName: "Fashion Bazar",
  supportEmail: "support@fashionbazar.com",
  supportPhone: "+91 98765 43210",
  address: "12 MG Road, Bengaluru, Karnataka 560001",
  supportHours: "Mon–Sat: 10 AM – 7 PM IST",
  // Shipping and order rules
  freeShippingOver: 999,
  standardFee: 49,
  expressFee: 149,
  returnDays: 30,
  codEnabled: true,
  onlinePaymentEnabled: true,
  // Inventory
  lowStockAt: 5,
  hideOutOfStock: false,
  // Announcement bar
  announcements: "Free shipping on orders over ₹999 — this week only\nBazar days: up to 50% off across 180+ stalls\nNew drops land every Friday at 10am",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

// A titled card with an icon, used for each group of settings
function Section({ icon: Icon, title, hint, children }) {
  return (
    <section className="rounded-xl border border-line bg-white">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          <p className="text-xs text-subtle">{hint}</p>
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function TextField({ label, wide, ...props }) {
  return (
    <label className={`block text-sm font-medium text-ink-soft ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <input className={inputClass} {...props} />
    </label>
  );
}

// A number input with a unit in front (₹) or behind (days, items)
function NumberField({ label, prefix, suffix, ...props }) {
  return (
    <label className="block text-sm font-medium text-ink-soft">
      {label}
      <span className="mt-1.5 flex items-center overflow-hidden rounded-lg border border-line-strong bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        {prefix && <span className="pl-3.5 text-sm text-subtle">{prefix}</span>}
        <input
          type="number"
          min="0"
          className="w-full bg-transparent px-3 py-2.5 text-sm text-ink focus:outline-none"
          {...props}
        />
        {suffix && <span className="pr-3.5 text-sm text-subtle">{suffix}</span>}
      </span>
    </label>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3 sm:col-span-2">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-subtle">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-line-hover"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [saved, setSaved] = useState(INITIAL_SETTINGS); // the last "saved" values
  const [form, setForm] = useState(INITIAL_SETTINGS); // what is in the fields now
  const [justSaved, setJustSaved] = useState(false);

  const changed = JSON.stringify(form) !== JSON.stringify(saved);

  const set = (key) => (e) => {
    const { type, value } = e.target;
    setForm((f) => ({ ...f, [key]: type === "number" ? (value === "" ? "" : Number(value)) : value }));
    setJustSaved(false);
  };
  const setFlag = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setJustSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(form);
    setJustSaved(true);
  };

  return (
    <form onSubmit={handleSave} className="mx-auto w-full max-w-4xl">
      <p className="text-xs font-medium uppercase tracking-wider text-subtle">Configuration</p>
      <h1 className="mt-1 text-3xl tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted">Store details and the rules the shop runs on.</p>

      <p className="mt-4 rounded-lg border border-sun/40 bg-sun-50 px-4 py-2.5 text-sm text-ink-soft">
        Sample data: this page is not connected to the store yet. Changes are kept only until you refresh.
      </p>

      <div className="mt-6 space-y-6">
        <Section icon={UserRound} title="My account" hint="Who is signed in to this admin panel">
          <TextField label="Name" value={form.adminName} onChange={set("adminName")} required />
          <TextField label="Email" type="email" value={form.adminEmail} onChange={set("adminEmail")} required />
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button
              type="button"
              disabled
              title="Available once admin login is connected"
              className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Change password
            </button>
            <span className="text-xs text-subtle">Available once admin login is connected.</span>
          </div>
        </Section>

        <Section icon={Store} title="Store details" hint="Shown on the website's contact page and footer">
          <TextField label="Store name" value={form.storeName} onChange={set("storeName")} required />
          <TextField label="Support email" type="email" value={form.supportEmail} onChange={set("supportEmail")} required />
          <TextField label="Support phone" type="tel" value={form.supportPhone} onChange={set("supportPhone")} />
          <TextField label="Support hours" value={form.supportHours} onChange={set("supportHours")} />
          <TextField label="Address" wide value={form.address} onChange={set("address")} />
        </Section>

        <Section icon={Truck} title="Shipping and orders" hint="Delivery charges, returns and payment options">
          <NumberField label="Free shipping on orders over" prefix="₹" value={form.freeShippingOver} onChange={set("freeShippingOver")} />
          <NumberField label="Return window" suffix="days" value={form.returnDays} onChange={set("returnDays")} />
          <NumberField label="Standard delivery fee" prefix="₹" value={form.standardFee} onChange={set("standardFee")} />
          <NumberField label="Express delivery fee" prefix="₹" value={form.expressFee} onChange={set("expressFee")} />
          <Toggle
            label="Cash on delivery"
            hint="Let shoppers pay when the order arrives"
            checked={form.codEnabled}
            onChange={setFlag("codEnabled")}
          />
          <Toggle
            label="Online payment"
            hint="UPI, cards and net banking at checkout"
            checked={form.onlinePaymentEnabled}
            onChange={setFlag("onlinePaymentEnabled")}
          />
        </Section>

        <Section icon={Boxes} title="Inventory" hint="When stock warnings appear">
          <NumberField label="Show “low stock” at or below" suffix="items" value={form.lowStockAt} onChange={set("lowStockAt")} />
          <Toggle
            label="Hide out-of-stock products"
            hint="Remove sold-out products from the shop until they are restocked"
            checked={form.hideOutOfStock}
            onChange={setFlag("hideOutOfStock")}
          />
        </Section>

        <Section icon={Megaphone} title="Announcement bar" hint="The rotating messages at the top of the website">
          <label className="block text-sm font-medium text-ink-soft sm:col-span-2">
            Messages <span className="font-normal text-subtle">(one per line)</span>
            <textarea rows={4} value={form.announcements} onChange={set("announcements")} className={`${inputClass} resize-none`} />
          </label>
        </Section>
      </div>

      {/* Save bar: sticks to the bottom of the screen while the form scrolls,
          and stays the same width as the form (also when the sidebar is collapsed) */}
      <div className="sticky bottom-4 z-20 mt-6 rounded-xl border border-line bg-white/95 shadow-[0_8px_28px_rgba(28,23,20,0.12)] backdrop-blur">
        <div className="flex items-center justify-end gap-3 px-5 py-3">
          {justSaved && !changed && (
            <span className="mr-auto inline-flex items-center gap-1.5 text-sm font-medium text-success" role="status">
              <Check size={16} /> Saved for this session
            </span>
          )}
          {changed && <span className="mr-auto text-sm text-muted">You have unsaved changes</span>}
          <button
            type="button"
            disabled={!changed}
            onClick={() => setForm(saved)}
            className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={!changed}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
  );
}
