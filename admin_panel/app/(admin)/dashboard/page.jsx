"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Card from "@/components/dashboard/Card";
import StatCard from "@/components/dashboard/StatCard";
import RangeTabs from "@/components/dashboard/RangeTabs";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CategorySales from "@/components/dashboard/CategorySales";
import OrderStatus from "@/components/dashboard/OrderStatus";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopProducts from "@/components/dashboard/TopProducts";
import LowStock from "@/components/dashboard/LowStock";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import EmptyState from "@/components/dashboard/EmptyState";
import { RANGES, useGetDashboardStatsQuery } from "@/lib/api/statsApi";

export default function AdminDashboard() {
  const [range, setRange] = useState("30d");
  const rangeLabel = RANGES.find((r) => r.key === range).label;
  // all numbers come from the backend (GET /api/admin/stats/dashboard), worked out from real orders
  const { data, isLoading, isFetching, isError, refetch } = useGetDashboardStatsQuery(range, { refetchOnMountOrArgChange: true });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ordersInRange = data?.orderStatus?.reduce((sum, s) => sum + s.count, 0) ?? 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p suppressHydrationWarning className="text-xs font-medium uppercase tracking-wider text-subtle">
            {today}
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight text-ink">Good to see you, Admin</h1>
          <p className="mt-1 text-sm text-muted">Here&apos;s how Fashion Bazar is performing.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RangeTabs ranges={RANGES} value={range} onChange={setRange} />
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            <Plus size={15} strokeWidth={2} />
            Add Product
          </Link>
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-line bg-white p-10 text-center">
          <p className="text-sm text-muted">Couldn&apos;t load the dashboard numbers.</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-mist"
          >
            Try again
          </button>
        </div>
      ) : isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className={`space-y-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.kpis.map((kpi) => (
              <StatCard key={kpi.key} kpi={kpi} rangeLabel={rangeLabel} />
            ))}
          </div>

          {/* Revenue + categories */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card title="Gross sales" subtitle={`Last ${rangeLabel}`} className="xl:col-span-2">
              <RevenueChart series={data.revenue} />
            </Card>
            <Card title="Sales by Category" subtitle="Revenue share" action={{ label: "View all", href: "/category" }}>
              {data.categorySales.length ? (
                <CategorySales data={data.categorySales} />
              ) : (
                <EmptyState>No sales in the last {rangeLabel}.</EmptyState>
              )}
            </Card>
          </div>

          {/* Orders + top products */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card
              title="Recent Orders"
              subtitle="Latest orders across the store"
              action={{ label: "View all orders", href: "/orders" }}
              className="xl:col-span-2"
            >
              {data.recentOrders.length ? (
                <RecentOrders orders={data.recentOrders} />
              ) : (
                <EmptyState>No orders yet.</EmptyState>
              )}
            </Card>
            <Card title="Top Products" subtitle="Best sellers by revenue" action={{ label: "View all", href: "/products" }}>
              {data.topProducts.length ? (
                <TopProducts products={data.topProducts} />
              ) : (
                <EmptyState>No sales in the last {rangeLabel}.</EmptyState>
              )}
            </Card>
          </div>

          {/* Status, stock, activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <Card title="Order Status" subtitle={`Orders placed in the last ${rangeLabel}`}>
              {ordersInRange ? (
                <OrderStatus data={data.orderStatus} />
              ) : (
                <EmptyState>No orders in the last {rangeLabel}.</EmptyState>
              )}
            </Card>
            <Card
              title="Low Stock Alerts"
              subtitle={
                data.lowStockCount
                  ? `${data.lowStockCount} product${data.lowStockCount === 1 ? "" : "s"} need restocking`
                  : "Every product is well stocked"
              }
              action={{ label: "Manage", href: "/products" }}
            >
              {data.lowStock.length ? (
                <LowStock items={data.lowStock} />
              ) : (
                <EmptyState>Nothing is running low.</EmptyState>
              )}
            </Card>
            <Card title="Recent Activity" subtitle="What's happening in your store" className="lg:col-span-2 xl:col-span-1">
              {data.activity.length ? (
                <ActivityFeed items={data.activity} />
              ) : (
                <EmptyState>Nothing has happened yet.</EmptyState>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  const block = "animate-pulse rounded-xl border border-line bg-white";
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${block} h-32`} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className={`${block} h-96 xl:col-span-2`} />
        <div className={`${block} h-96`} />
      </div>
    </div>
  );
}
