"use client";

import { PanelLeftClose, PanelLeft } from "lucide-react";

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
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
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
