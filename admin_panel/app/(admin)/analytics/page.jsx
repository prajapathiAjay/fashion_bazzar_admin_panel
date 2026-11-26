"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import Card from "@/components/dashboard/Card";
import StatCard from "@/components/dashboard/StatCard";
import RangeTabs from "@/components/dashboard/RangeTabs";
import EmptyState from "@/components/dashboard/EmptyState";
import CustomerMix from "@/components/analytics/CustomerMix";
import SalesHeatmap from "@/components/analytics/SalesHeatmap";
import RegionList from "@/components/analytics/RegionList";
import ProductPerformance from "@/components/analytics/ProductPerformance";
import { RANGES, useGetAnalyticsStatsQuery } from "@/lib/api/statsApi";

const MIX_COLORS = { new: "#9A2E3C", returning: "#4F63C0" };

// Everything here is worked out from real orders (GET /api/admin/stats/analytics).
// Visits, traffic sources, devices and searches need a tracking tool, so they are not shown.
export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");
  const rangeLabel = RANGES.find((r) => r.key === range).label;
  const { data, isLoading, isFetching, isError, refetch } = useGetAnalyticsStatsQuery(range, { refetchOnMountOrArgChange: true });

  const heatmapTotal = data?.heatmap?.values.flat().reduce((a, b) => a + b, 0) ?? 0;
  const mixTotal = data ? [...data.customerMix.new, ...data.customerMix.returning].reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Insights</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight text-ink">Analytics</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <CalendarDays size={14} strokeWidth={1.75} />
            Last {rangeLabel}, compared with the previous {rangeLabel}
          </p>
        </div>
        <RangeTabs ranges={RANGES} value={range} onChange={setRange} />
      </div>

      {isError ? (
        <div className="rounded-xl border border-line bg-white p-10 text-center">
          <p className="text-sm text-muted">Couldn&apos;t load analytics.</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-mist"
          >
            Try again
          </button>
        </div>
      ) : isLoading || !data ? (
        <div className="space-y-6" aria-busy="true" aria-label="Loading analytics">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl border border-line bg-white" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-xl border border-line bg-white" />
        </div>
      ) : (
        <div className={`space-y-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.kpis.map((kpi) => (
              <StatCard key={kpi.key} kpi={kpi} rangeLabel={rangeLabel} />
            ))}
          </div>

          {/* Customers + regions */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card
              title="New vs Returning Customers"
              subtitle="Customers who placed an order, last 6 months"
              className="xl:col-span-2"
            >
              {mixTotal ? (
                <CustomerMix data={{ ...data.customerMix, colors: MIX_COLORS }} />
              ) : (
                <EmptyState>No orders in the last 6 months.</EmptyState>
              )}
            </Card>
            <Card title="Top Regions" subtitle="Revenue by delivery state">
              {data.regions.length ? (
                <RegionList regions={data.regions} />
              ) : (
                <EmptyState>No orders in the last {rangeLabel}.</EmptyState>
              )}
            </Card>
          </div>

          {/* When customers shop */}
          <Card title="When Customers Shop" subtitle="Orders by day of week and time (IST)">
            {heatmapTotal ? (
              <SalesHeatmap data={data.heatmap} />
            ) : (
              <EmptyState>No orders in the last {rangeLabel}.</EmptyState>
            )}
          </Card>

          {/* Product performance */}
          <Card
            title="Product Performance"
            subtitle={`Best sellers in the last ${rangeLabel}`}
            action={{ label: "All products", href: "/products" }}
          >
            {data.productPerformance.length ? (
              <ProductPerformance products={data.productPerformance} />
            ) : (
              <EmptyState>No sales in the last {rangeLabel}.</EmptyState>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
