"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  // true once we've confirmed a token exists (checked in the browser only)
  const [ready, setReady] = useState(false);

  // Runs after hydration, so it sees the real token from localStorage.
  // Also re-runs on logout (token -> null) and sends the user to login.
  useEffect(() => {
    if (!token) {
      setReady(false);
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [token, router]);

  // Don't flash admin pages before the check is done
  if (!ready) return null;

  return (
    <div className="min-h-screen bg-snow">
      <AdminSidebar collapsed={collapsed} />

      {/* Offset content by current sidebar width */}
      <div
        className={`transition-all duration-200 ${
          collapsed ? "pl-[72px]" : "pl-64"
        }`}
      >
        <AdminNavbar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
