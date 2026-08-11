"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up auth logic
    redirect("admin")
    console.log({ email, password });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#FAFAF8]">
      {/* Left branding panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#1B1B1B] p-12 overflow-hidden">
        {/* Subtle decorative texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)",
          }}
        />

        <span className="relative font-serif text-2xl tracking-tight text-[#FAFAF8]">
          Fashion <span className="text-[#C9A0A6]">Bazar</span>
        </span>

        <div className="relative max-w-sm">
          <p className="font-serif text-3xl leading-snug text-[#FAFAF8]">
            Run your store with clarity, not clutter.
          </p>
          <p className="mt-4 text-sm text-[#A9A9A3]">
            Manage products, orders, and customers from a single, focused
            workspace built for Fashion Bazar.
          </p>
        </div>

        <p className="relative text-xs text-[#6B6B66]">
          © {new Date().getFullYear()} Fashion Bazar. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile wordmark */}
          <span className="mb-10 block font-serif text-xl tracking-tight text-[#1B1B1B] lg:hidden">
            Fashion <span className="text-[#7A1F2B]">Bazar</span>
          </span>

          <h1 className="font-serif text-2xl text-[#1B1B1B]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#6B6B66]">
            Sign in to your admin account to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-[#4A4A46]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fashionbazar.com"
                className="w-full rounded-md border border-[#E5E3DD] bg-white px-3.5 py-2.5 text-sm text-[#1B1B1B] placeholder:text-[#B5B5AE] outline-none transition-shadow focus:ring-2 focus:ring-[#7A1F2B]/25 focus:border-[#7A1F2B]/50"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#4A4A46]"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-[#7A1F2B] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#E5E3DD] bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1B1B1B] placeholder:text-[#B5B5AE] outline-none transition-shadow focus:ring-2 focus:ring-[#7A1F2B]/25 focus:border-[#7A1F2B]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A93] hover:text-[#4A4A46]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.75} />
                  ) : (
                    <Eye size={16} strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-[#4A4A46]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#E5E3DD] text-[#7A1F2B] focus:ring-[#7A1F2B]/30"
              />
              Keep me signed in
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#1B1B1B] py-2.5 text-sm font-medium text-[#FAFAF8] transition-colors hover:bg-[#7A1F2B]"
            >
              Sign in
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#9A9A93]">
            Having trouble signing in? Contact your store owner.
          </p>
        </div>
      </div>
    </div>
  );
}
