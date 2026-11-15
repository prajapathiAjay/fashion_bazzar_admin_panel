"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageSearch,
  Users,
  Tags,
  LayoutGrid,
  Truck,
  MessageSquare,
  CircleHelp,
  BarChart3,
  Settings,
} from "lucide-react";

// Add/remove sections here — the sidebar renders whatever is in this list
const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: ShoppingBag },
  { label: "Categories", href: "/category", icon: LayoutGrid },
  { label: "Orders", href: "/orders", icon: PackageSearch },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Discounts", href: "/discounts", icon: Tags },
  { label: "Shipping", href: "/shipping", icon: Truck },
  { label: "Reviews", href: "/reviews", icon: MessageSquare },
  { label: "FAQs", href: "/faq", icon: CircleHelp },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const EXPANDED_WIDTH = "w-64";
const COLLAPSED_WIDTH = "w-[72px]";

export default function AdminSidebar({ collapsed }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-line bg-white transition-all duration-200 ${
        collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
      }`}
    >
      {/* Wordmark */}
      <div className="flex h-16 shrink-0 items-center border-b border-line px-5 overflow-hidden">
        {collapsed ? (
          <span className="font-display text-lg font-semibold text-brand">
            FB
          </span>
        ) : (
          <span className="font-display text-xl tracking-tight text-ink whitespace-nowrap">
            Fashion <span className="text-brand">Bazar</span>
          </span>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-1 scrollbar-thin">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-brand/[0.08] text-brand font-medium"
                  : "text-muted hover:bg-mist hover:text-ink"
              }`}
            >
              <Icon size={19} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-40">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-line px-5 py-4 overflow-hidden">
        <p className="text-xs text-subtle whitespace-nowrap">
          {collapsed ? "v1.0" : "Fashion Bazar Admin · v1.0"}
        </p>
      </div>
    </aside>
  );
}
