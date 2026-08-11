"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageSearch,
  Users,
  Tags,
  Truck,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

// Add/remove sections here — the sidebar renders whatever is in this list
const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: PackageSearch },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Discounts", href: "/admin/discounts", icon: Tags },
  { label: "Shipping", href: "/admin/shipping", icon: Truck },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const EXPANDED_WIDTH = "w-64";
const COLLAPSED_WIDTH = "w-[72px]";

export default function AdminSidebar({ collapsed }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[#E8E4DC] bg-white transition-all duration-200 ${
        collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
      }`}
    >
      {/* Wordmark */}
      <div className="flex h-16 shrink-0 items-center border-b border-[#E8E4DC] px-5 overflow-hidden">
        {collapsed ? (
          <span className="font-serif text-lg font-semibold text-[#7A1F2B]">
            FB
          </span>
        ) : (
          <span className="font-serif text-xl tracking-tight text-[#2A2A28] whitespace-nowrap">
            Fashion <span className="text-[#7A1F2B]">Bazar</span>
          </span>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-1 scrollbar-thin">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === href : pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-[#7A1F2B]/[0.08] text-[#7A1F2B] font-medium"
                  : "text-[#6B6B63] hover:bg-[#F5F1E8] hover:text-[#2A2A28]"
              }`}
            >
              <Icon size={19} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-[#2A2A28] px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-40">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#E8E4DC] px-5 py-4 overflow-hidden">
        <p className="text-xs text-[#A6A69C] whitespace-nowrap">
          {collapsed ? "v1.0" : "Fashion Bazar Admin · v1.0"}
        </p>
      </div>
    </aside>
  );
}
