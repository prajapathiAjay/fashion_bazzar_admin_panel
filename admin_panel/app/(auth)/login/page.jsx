"use client";
import {useSignInMutation} from "@/lib/api/adminApi.js"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearSessionExpired, setCredentials } from "@/lib/slice/authSlice";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LayoutGrid,
  Loader2,
  PackageCheck,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";

// What the admin can do, shown beside the form on large screens
const FEATURES = [
  { icon: LayoutGrid, title: "Products & categories", desc: "List, edit and organise every stall's pieces." },
  { icon: PackageCheck, title: "Orders", desc: "Follow each order from placed to delivered." },
  { icon: PlayCircle, title: "Open demo", desc: "Visitors can look around in read-only mode." },
];

const inputClass =
  "h-12 w-full rounded-xl border border-white/15 bg-black/30 px-3.5 text-sm text-snow outline-none transition-colors placeholder:text-subtle focus:border-sun/60 focus:ring-4 focus:ring-sun/15";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router=useRouter()
  const dispatch=useDispatch()
  // true when the admin was logged out because their login expired / stopped working
  const expiredNotice = useSelector((state) => state.auth.sessionExpired);
  const [submitting, setSubmitting] = useState(false);
 const [signIn]=useSignInMutation()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(clearSessionExpired()); // hide the "session expired" message once they try again
    setSubmitting(true);
    try {
      // backend only lets admins sign in here, so no role check needed
      const { token } = await signIn({ email, password }).unwrap();
      dispatch(setCredentials(token));
      router.replace("/dashboard");
    } catch (err) {
      setError(err?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setError("");
    // TODO(api): sign in with the demo account (NEXT_PUBLIC_DEMO_EMAIL / NEXT_PUBLIC_DEMO_PASSWORD)
  };

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#0e0c0b] text-snow"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      {/* Soft wine + gold glows */}
      <div className="pointer-events-none absolute -right-24 top-1/4 h-[520px] w-[520px] rounded-full bg-brand opacity-45 blur-[130px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-sun opacity-[0.12] blur-[120px]" />

      {/* Top bar */}
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold tracking-tight">
            Fashion<i className="text-sun">Bazar</i>
          </span>
          <span className="rounded-full border border-sun/40 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.2em] text-sun">
            ADMIN
          </span>
        </div>
        <span className="hidden items-center gap-2 text-xs text-subtle sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
          All systems operational
        </span>
      </header>

      <main className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-5 pb-12 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Brand side (large screens) */}
        <section className="hidden lg:block">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-sun">THE BACK OFFICE</p>
          <div className="mt-4 h-px w-14 bg-sun" />
          <h2 className="mt-6 font-display text-5xl leading-[1.1]">
            Every stall, every order,
            <br />
            <i className="text-[#f2c9cf]">in one quiet room.</i>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-faint">
            The admin console for Fashion Bazar, where products are listed, categories are sorted and
            orders go out.
          </p>

          <ul className="mt-10 flex max-w-md flex-col gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sun/30 bg-sun/10 text-sun">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-subtle">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Glass card */}
        <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-9 lg:mx-0 lg:justify-self-end">
          {/* gold hairline on top */}
          <span className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-sun to-transparent" />

          <p className="text-[11px] font-semibold tracking-[0.3em] text-sun">ADMIN SIGN IN</p>
          <h1 className="mt-3 font-display text-[34px] leading-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-faint">Sign in to manage the store.</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium tracking-wide text-faint">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fashionbazar.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium tracking-wide text-faint">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-white/10 hover:text-snow"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {expiredNotice && !error && (
              <p role="status" className="rounded-lg border border-sun/30 bg-sun/10 px-3 py-2 text-xs text-sun">
                Your session expired. Please sign in again.
              </p>
            )}

            {error && (
              <p role="alert" className="rounded-lg border border-[#f2a7b5]/30 bg-brand/25 px-3 py-2 text-xs text-[#f8d3da]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-sun text-[15px] font-semibold text-ink transition-all hover:bg-[#e0c07f] active:scale-[0.98] disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-subtle">
            <span className="h-px flex-1 bg-white/10" />
            Just looking around?
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleDemo}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#f2a7b5]/40 bg-brand/25 text-sm font-semibold text-[#f8d3da] transition-colors hover:bg-brand/40"
          >
            <PlayCircle size={16} />
            Launch demo · read-only
          </button>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-subtle">
            <ShieldCheck size={13} />
            Protected by JWT · role-based access
          </p>
        </div>
      </main>

      <footer className="relative mx-auto w-full max-w-6xl px-5 pb-6 text-xs text-muted sm:px-8">
        © {new Date().getFullYear()} Fashion Bazar
      </footer>
    </div>
  );
}
