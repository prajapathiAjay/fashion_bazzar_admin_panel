"use client";

import { PanelLeftClose, PanelLeft, Search, Bell } from "lucide-react";

export default function AdminNavbar({ collapsed, onToggle }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/90 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 text-muted hover:bg-mist hover:text-ink transition-colors"
        >
          {collapsed ? (
            <PanelLeft size={19} strokeWidth={1.75} />
          ) : (
            <PanelLeftClose size={19} strokeWidth={1.75} />
          )}
        </button>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-md border border-line bg-snow px-3 py-2 w-72 focus-within:ring-1 focus-within:ring-brand/40">
          <Search size={16} className="text-subtle" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-subtle outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <button
          aria-label="Notifications"
          className="relative rounded-md p-2 text-muted hover:bg-mist hover:text-ink transition-colors"
        >
          <Bell size={18} strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
        </button>

        <div className="flex items-center gap-3 border-l border-line pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-medium text-white">
            A
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-ink">Admin</p>
            <p className="text-xs text-subtle">Store Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
