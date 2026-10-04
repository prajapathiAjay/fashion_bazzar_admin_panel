"use client";

import { useState } from "react";
import { Download, CalendarDays } from "lucide-react";
import Card from "@/components/dashboard/Card";
import StatCard from "@/components/dashboard/StatCard";
import RangeTabs from "@/components/dashboard/RangeTabs";
import ConversionFunnel from "@/components/analytics/ConversionFunnel";
import TrafficSources from "@/components/analytics/TrafficSources";
import CustomerMix from "@/components/analytics/CustomerMix";
import DeviceSplit from "@/components/analytics/DeviceSplit";
import TopSearches from "@/components/analytics/TopSearches";
import SalesHeatmap from "@/components/analytics/SalesHeatmap";
import RegionList from "@/components/analytics/RegionList";
import CohortTable from "@/components/analytics/CohortTable";
import ProductPerformance from "@/components/analytics/ProductPerformance";
import {
  RANGES,
  ANALYTICS_KPIS,
  FUNNEL,
  TRAFFIC_SOURCES,
  CUSTOMER_MIX,
  DEVICES,
  TOP_SEARCHES,
  HEATMAP,
  REGIONS,
  COHORTS,
  PRODUCT_PERFORMANCE,
} from "@/lib/data/analyticsData";

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");
  const rangeLabel = RANGES.find((r) => r.key === range).label;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#A6A69C]">Insights</p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight text-[#2A2A28]">Analytics</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B6B63]">
            <CalendarDays size={14} strokeWidth={1.75} />
            Last {rangeLabel}, compared with the previous {rangeLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RangeTabs ranges={RANGES} value={range} onChange={setRange} />
          <button className="inline-flex items-center gap-2 rounded-lg border border-[#E8E4DC] bg-white px-3.5 py-2 text-sm font-medium text-[#2A2A28] transition-colors hover:bg-[#F5F1E8]">
            <Download size={15} strokeWidth={1.75} />
            Export report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ANALYTICS_KPIS[range].map((kpi) => (
          <StatCard key={kpi.key} kpi={kpi} rangeLabel={rangeLabel} />
        ))}
      </div>

      {/* Funnel + traffic */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="Conversion Funnel" subtitle="Where shoppers drop off on the way to purchase" className="xl:col-span-2">
          <ConversionFunnel stages={FUNNEL} />
        </Card>
        <Card title="Traffic Sources" subtitle="Sessions and conversion by channel">
          <TrafficSources sources={TRAFFIC_SOURCES} />
        </Card>
      </div>

      {/* Customers + devices/search */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="New vs Returning Customers" subtitle="Customers who placed an order, by month" className="xl:col-span-2">
          <CustomerMix data={CUSTOMER_MIX} />
        </Card>
        <div className="flex flex-col gap-6">
          <Card title="Devices" subtitle="Share of sessions">
            <DeviceSplit devices={DEVICES} />
          </Card>
          <Card title="Top Searches" subtitle="What shoppers look for on the store" className="flex-1">
            <TopSearches terms={TOP_SEARCHES} />
          </Card>
        </div>
      </div>

      {/* Heatmap + regions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="When Customers Shop" subtitle="Orders by day of week and time (IST)" className="xl:col-span-2">
          <SalesHeatmap data={HEATMAP} />
        </Card>
        <Card title="Top Regions" subtitle="Revenue by state">
          <RegionList regions={REGIONS} />
        </Card>
      </div>

      {/* Cohorts */}
      <Card title="Customer Retention" subtitle="Share of each signup cohort that ordered again in the months after joining">
        <CohortTable cohorts={COHORTS} />
      </Card>

      {/* Product performance */}
      <Card
        title="Product Performance"
        subtitle="Views, conversion and returns for your top products"
        action={{ label: "All products", href: "/products" }}
      >
        <ProductPerformance products={PRODUCT_PERFORMANCE} />
      </Card>
    </div>
  );
}
