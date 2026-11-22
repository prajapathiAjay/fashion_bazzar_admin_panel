"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
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
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/slice/authSlice";
import { baseApi } from "@/lib/api/baseApi";
import { useGetOrdersQuery } from "@/lib/api/ordersApi";
import { useGetReviewsQuery } from "@/lib/api/reviewsApi";

// Add/remove sections here — the sidebar renders whatever is in this list.
// `badge` names a live count from useBadgeCounts() below.
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", href: "/products", icon: ShoppingBag },
      { label: "Categories", href: "/category", icon: LayoutGrid },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/orders", icon: PackageSearch, badge: "orders" },
      { label: "Discounts", href: "/discounts", icon: Tags },
      { label: "Shipping", href: "/shipping", icon: Truck },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Reviews", href: "/reviews", icon: MessageSquare, badge: "reviews" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "FAQs", href: "/faq", icon: CircleHelp },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const EXPANDED_WIDTH = "w-64";
const COLLAPSED_WIDTH = "w-[72px]";

// Numbers that need the admin's attention (same data the Orders / Reviews pages use, so it's cached)
function useBadgeCounts() {
  const { data: orders = [] } = useGetOrdersQuery();
  const { data: reviews = [] } = useGetReviewsQuery();
  return {
    orders: orders.filter((o) => o.status === "Ordered").length,                  // new, not packed yet
    reviews: reviews.filter((r) => !r.isHidden && !r.reply?.text).length,         // waiting for a reply
  };
}

export default function AdminSidebar({ collapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const counts = useBadgeCounts();

  const handleLogout = () => {
    dispatch(logout());                       // clears the token (Redux + localStorage)
    dispatch(baseApi.util.resetApiState());   // forget the last admin's cached data
    router.replace("/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-linear-to-b from-[#6a2533] to-[#521b27] text-snow/70 transition-all duration-200 ${
        collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
      }`}
    >
      {/* Wordmark */}
      <div className={`flex h-16 shrink-0 items-center gap-3 overflow-hidden ${collapsed ? "justify-center px-0" : "px-5"}`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-sun/35 bg-sun/15 font-display text-sm font-semibold text-sun">
          FB
        </span>
        {!collapsed && (
          <span className="whitespace-nowrap font-display text-xl tracking-tight text-snow">
            Fashion <i className="font-medium text-sun">Bazar</i>
          </span>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={gi === 0 ? "" : "mt-4"}>
            {collapsed ? (
              gi > 0 && <div className="mx-auto mb-3 h-px w-8 bg-snow/15" />
            ) : (
              <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-sun/75">
                {group.label}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon, badge }) => {
                const isActive = pathname?.startsWith(href);
                const count = badge ? counts[badge] : 0;

                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-snow font-semibold text-brand shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
                        : "hover:bg-snow/10 hover:text-snow"
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.75} className="shrink-0" />
                    {!collapsed && <span className="whitespace-nowrap">{label}</span>}

                    {/* live count */}
                    {count > 0 &&
                      (collapsed ? (
                        <span className="absolute right-3 top-2 h-2 w-2 rounded-full bg-sun ring-2 ring-[#5e2130]" />
                      ) : (
                        <span
                          className={`ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                            isActive ? "bg-brand text-white" : "bg-sun/20 text-sun"
                          }`}
                        >
                          {count}
                        </span>
                      ))}

                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full z-40 ml-3 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        {label}
                        {count > 0 && <span className="ml-1.5 text-sun">{count}</span>}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile + log out */}
      <div className={`shrink-0 ${collapsed ? "px-3 pb-4" : "m-3 rounded-xl bg-black/20 p-3"}`}>
        {collapsed ? (
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="flex h-10 w-full items-center justify-center rounded-lg text-snow/60 transition-colors hover:bg-snow/10 hover:text-snow"
          >
            <LogOut size={18} strokeWidth={1.75} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sun text-sm font-semibold text-brand-dark">
              A
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-snow">Admin</p>
              <p className="truncate text-xs text-snow/55">Store owner</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="ml-auto rounded-md p-2 text-snow/55 transition-colors hover:bg-snow/10 hover:text-snow"
            >
              <LogOut size={17} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
