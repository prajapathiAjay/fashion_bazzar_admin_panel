"use client";

import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
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
