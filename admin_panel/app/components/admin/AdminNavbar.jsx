"use client";

import { PanelLeftClose, PanelLeft, Search, Bell } from "lucide-react";

export default function AdminNavbar({ collapsed, onToggle }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E8E4DC] bg-white/90 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 text-[#6B6B63] hover:bg-[#F5F1E8] hover:text-[#2A2A28] transition-colors"
        >
          {collapsed ? (
            <PanelLeft size={19} strokeWidth={1.75} />
          ) : (
            <PanelLeftClose size={19} strokeWidth={1.75} />
          )}
        </button>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-md border border-[#E8E4DC] bg-[#FAFAF8] px-3 py-2 w-72 focus-within:ring-1 focus-within:ring-[#7A1F2B]/40">
          <Search size={16} className="text-[#A6A69C]" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full bg-transparent text-sm text-[#2A2A28] placeholder:text-[#A6A69C] outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <button
          aria-label="Notifications"
          className="relative rounded-md p-2 text-[#6B6B63] hover:bg-[#F5F1E8] hover:text-[#2A2A28] transition-colors"
        >
          <Bell size={18} strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#7A1F2B]" />
        </button>

        <div className="flex items-center gap-3 border-l border-[#E8E4DC] pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7A1F2B] text-sm font-medium text-white">
            A
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-[#2A2A28]">Admin</p>
            <p className="text-xs text-[#A6A69C]">Store Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
