"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
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
import {
  RANGES,
  KPIS,
  REVENUE,
  CATEGORY_SALES,
  ORDER_STATUS,
  RECENT_ORDERS,
  TOP_PRODUCTS,
  LOW_STOCK,
  ACTIVITY,
} from "@/lib/data/dashboardData";

export default function AdminDashboard() {
  const [range, setRange] = useState("30d");
  const rangeLabel = RANGES.find((r) => r.key === range).label;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p suppressHydrationWarning className="text-xs font-medium uppercase tracking-wider text-[#A6A69C]">
            {today}
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight text-[#2A2A28]">Good to see you, Admin</h1>
          <p className="mt-1 text-sm text-[#6B6B63]">Here&apos;s how Fashion Bazar is performing.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RangeTabs ranges={RANGES} value={range} onChange={setRange} />

          <button className="inline-flex items-center gap-2 rounded-lg border border-[#E8E4DC] bg-white px-3.5 py-2 text-sm font-medium text-[#2A2A28] transition-colors hover:bg-[#F5F1E8]">
            <Download size={15} strokeWidth={1.75} />
            Export
          </button>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2A2A28] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            <Plus size={15} strokeWidth={2} />
            Add Product
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS[range].map((kpi) => (
          <StatCard key={kpi.key} kpi={kpi} rangeLabel={rangeLabel} />
        ))}
      </div>

      {/* Revenue + categories */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="Revenue" subtitle={`Last ${rangeLabel}`} className="xl:col-span-2">
          <RevenueChart series={REVENUE[range]} />
        </Card>
        <Card title="Sales by Category" subtitle="Revenue share" action={{ label: "View all", href: "/category" }}>
          <CategorySales data={CATEGORY_SALES} />
        </Card>
      </div>

      {/* Orders + top products */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Recent Orders"
          subtitle="Latest transactions across the store"
          action={{ label: "View all orders", href: "/orders" }}
          className="xl:col-span-2"
        >
          <RecentOrders orders={RECENT_ORDERS} />
        </Card>
        <Card title="Top Products" subtitle="Best sellers by revenue" action={{ label: "View all", href: "/products" }}>
          <TopProducts products={TOP_PRODUCTS} />
        </Card>
      </div>

      {/* Status, stock, activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card title="Order Status" subtitle="Fulfilment breakdown">
          <OrderStatus data={ORDER_STATUS} />
        </Card>
        <Card
          title="Low Stock Alerts"
          subtitle={`${LOW_STOCK.length} items need restocking`}
          action={{ label: "Manage", href: "/products" }}
        >
          <LowStock items={LOW_STOCK} />
        </Card>
        <Card title="Recent Activity" subtitle="What's happening in your store" className="lg:col-span-2 xl:col-span-1">
          <ActivityFeed items={ACTIVITY} />
        </Card>
      </div>
    </div>
  );
}
