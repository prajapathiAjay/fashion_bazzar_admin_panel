"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Check, Eye, EyeOff, KeyRound, Store, UserRound } from "lucide-react";
import { setCredentials } from "@/lib/slice/authSlice";
import { checkEmail, checkPhone } from "@/lib/validation";
import {
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
} from "@/lib/api/settingsApi";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

// A titled card with an icon, used for each group of settings
function Section({ icon: Icon, title, hint, children, footer }) {
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
      {footer && <div className="flex items-center justify-end gap-3 border-t border-line px-5 py-3">{footer}</div>}
    </section>
  );
}

function TextField({ label, wide, hint, error, ...props }) {
  return (
    <label className={`block text-sm font-medium text-ink-soft ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <input className={`${inputClass} ${error ? "border-danger" : ""}`} aria-invalid={Boolean(error)} {...props} />
      {error ? (
        <span role="alert" className="mt-1 block text-xs font-medium text-danger">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs font-normal text-subtle">{hint}</span>
      )}
    </label>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="text-sm">
      <p className="font-medium text-ink-soft">{label}</p>
      <p className="mt-1.5 rounded-lg bg-mist px-3.5 py-2.5 text-ink">{value || <span className="text-subtle">—</span>}</p>
    </div>
  );
}

function PasswordField({ label, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block text-sm font-medium text-ink-soft">
      {label}
      <span className="relative block">
        <input type={show ? "text" : "password"} className={`${inputClass} pr-11`} {...props} />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-[calc(50%+3px)] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-subtle hover:bg-mist hover:text-ink"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </span>
    </label>
  );
}

// "Saved" tick or an error, shown in a section's footer
function Status({ ok, error, okText }) {
  if (error)
    return (
      <p role="alert" className="mr-auto text-sm text-danger">
        {error}
      </p>
    );
  if (ok)
    return (
      <p role="status" className="mr-auto inline-flex items-center gap-1.5 text-sm font-medium text-success">
        <Check size={16} /> {okText}
      </p>
    );
  return null;
}

/* ---------------- My account (read only) ---------------- */

function AccountSection() {
  const { data: me, isLoading } = useGetMyProfileQuery();
  const name = [me?.firstName, me?.lastName].filter(Boolean).join(" ");
  return (
    <Section icon={UserRound} title="My account" hint="Who is signed in to this admin panel">
      {isLoading ? (
        <p className="text-sm text-muted sm:col-span-2">Loading…</p>
      ) : (
        <>
          <ReadOnlyField label="Name" value={name} />
          <ReadOnlyField label="Email" value={me?.email} />
        </>
      )}
    </Section>
  );
}

/* ---------------- Change password ---------------- */

const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };
const passwordOk = (v) => v.length >= 8 && /[a-zA-Z]/.test(v) && /\d/.test(v);

function PasswordSection() {
  const [values, setValues] = useState(EMPTY_PASSWORDS);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const dispatch = useDispatch();

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setError("");
    setDone(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = values;
    if (!currentPassword) return setError("Enter your current password.");
    if (!passwordOk(newPassword)) return setError("New password needs 8+ characters with a letter and a number.");
    if (newPassword !== confirmPassword) return setError("New passwords don't match.");
    if (newPassword === currentPassword) return setError("New password must be different from the current one.");
    try {
      const res = await changePassword({ currentPassword, newPassword }).unwrap();
      // the change logs out every older login, including this one, so keep the fresh token
      if (res?.data?.token) dispatch(setCredentials(res.data.token));
      setValues(EMPTY_PASSWORDS);
      setDone(true);
    } catch (err) {
      setError(err?.data?.message || "Couldn't change your password.");
    }
  };

  const canSubmit = values.currentPassword && values.newPassword && values.confirmPassword && !isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <Section
        icon={KeyRound}
        title="Change password"
        hint="At least 8 characters, with a letter and a number"
        footer={
          <>
            <Status ok={done} error={error} okText="Password changed" />
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Changing…" : "Change password"}
            </button>
          </>
        }
      >
        <div className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
          <PasswordField
            label="Current password"
            autoComplete="current-password"
            value={values.currentPassword}
            onChange={set("currentPassword")}
          />
        </div>
        <PasswordField
          label="New password"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={set("newPassword")}
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={set("confirmPassword")}
        />
      </Section>
    </form>
  );
}

/* ---------------- Store details ---------------- */

// The form only mounts once the saved values have loaded, so it can start from them.
function StoreForm({ initial }) {
  // saved = what the server has now (starts as the loaded values, then the result of each save)
  const [saved, setSaved] = useState(initial);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [updateStore, { isLoading }] = useUpdateStoreSettingsMutation();

  const changed = Object.keys(saved).some((k) => form[k] !== saved[k]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
    setDone(false);
    setFieldErrors((fe) => ({ ...fe, [key]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // same checks as the server, shown under each field
    const errors = {
      storeName: form.storeName?.trim() ? "" : "Store name can't be empty",
      supportEmail: checkEmail(form.supportEmail, { optional: true }),
      supportPhone: checkPhone(form.supportPhone, { optional: true }),
    };
    const shown = Object.fromEntries(Object.entries(errors).filter(([, m]) => m));
    setFieldErrors(shown);
    if (Object.keys(shown).length) return;
    try {
      // the server trims spaces, so show exactly what it saved
      const result = (await updateStore(form).unwrap()) ?? form;
      const next = { ...form, ...result };
      setSaved(next);
      setForm(next);
      setDone(true);
    } catch (err) {
      setError(err?.data?.message || "Couldn't save the store details.");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Section
        icon={Store}
        title="Store details"
        hint="Shown on the website's footer, Contact page and legal pages. Leave a field empty to hide it."
        footer={
          <>
            {changed && !error ? (
              <p className="mr-auto text-sm text-muted">You have unsaved changes</p>
            ) : (
              <Status ok={done} error={error} okText="Saved. The website shows it now." />
            )}
            <button
              type="button"
              disabled={!changed || isLoading}
              onClick={() => {
                setForm(saved);
                setError("");
              }}
              className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={!changed || isLoading}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Saving…" : "Save changes"}
            </button>
          </>
        }
      >
        <TextField label="Store name" value={form.storeName} onChange={set("storeName")} maxLength={60} error={fieldErrors.storeName} />
        <TextField
          label="Support email"
          type="email"
          error={fieldErrors.supportEmail}
          value={form.supportEmail}
          onChange={set("supportEmail")}
          maxLength={200}
          placeholder="support@yourstore.com"
        />
        <TextField
          label="Support phone"
          type="tel"
          error={fieldErrors.supportPhone}
          value={form.supportPhone}
          onChange={set("supportPhone")}
          maxLength={30}
          placeholder="+91 98765 43210"
        />
        <TextField
          label="Support hours"
          value={form.supportHours}
          onChange={set("supportHours")}
          maxLength={100}
          placeholder="Mon–Sat: 10 AM – 7 PM IST"
        />
        <TextField
          label="Address"
          wide
          value={form.address}
          onChange={set("address")}
          maxLength={300}
          placeholder="Shop no, street, city, state, PIN"
        />
      </Section>
    </form>
  );
}

function StoreSection() {
  const { data, isLoading, error } = useGetStoreSettingsQuery();
  if (isLoading) return <p className="text-sm text-muted">Loading store details…</p>;
  if (error) return <p className="text-sm text-danger">Failed to load store details</p>;
  // the form keeps its own copy after a save, so the "Saved" message stays on screen
  return <StoreForm initial={data} />;
}

export default function Settings() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <p className="text-xs font-medium uppercase tracking-wider text-subtle">Configuration</p>
      <h1 className="mt-1 text-3xl tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted">Your admin account and the store details shoppers see.</p>

      <div className="mt-6 space-y-6">
        <AccountSection />
        <PasswordSection />
        <StoreSection />
      </div>
    </div>
  );
}
