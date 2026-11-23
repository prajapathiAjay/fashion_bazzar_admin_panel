"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/slice/authSlice";
import { getTokenExpiry, isTokenExpired } from "@/lib/tokenExpiry";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const dispatch = useDispatch();
  // false while the server renders / during hydration, true in the browser after that.
  // The server can't see localStorage, so the token is only known in the browser.
  const inBrowser = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  // show the admin pages only with a token that hasn't expired
  const ready = inBrowser && Boolean(token) && !isTokenExpired(token);

  // Runs after hydration, so it sees the real token from localStorage.
  // Also re-runs on logout (token -> null) and sends the user to login.
  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return undefined;
    }
    // token already past its expiry time -> log out before any page asks the API (and fails)
    if (isTokenExpired(token)) {
      dispatch(logout({ expired: true }));
      return undefined;
    }

    // also log out at the exact moment it expires, if the admin keeps the tab open
    const expiry = getTokenExpiry(token);
    if (expiry === null) return undefined;
    const msLeft = expiry - Date.now();
    if (msLeft > 2147483647) return undefined; // longer than setTimeout can wait (~24 days)
    const timer = setTimeout(() => dispatch(logout({ expired: true })), msLeft);
    return () => clearTimeout(timer);
  }, [token, router, dispatch]);

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
