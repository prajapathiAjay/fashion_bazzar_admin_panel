import { baseApi } from "./baseApi";

// Time ranges the Dashboard and Analytics pages can show (same keys as the backend)
export const RANGES = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "12m", label: "12 months" },
];

// Dashboard + Analytics numbers, worked out by the backend from real orders/products/customers.
// They use the same tags as those pages, so changing an order, product or review refreshes them.
const STATS_TAGS = ["Order", "Product", "Customer", "Review", "Category"];

export const statsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /api/admin/stats/dashboard?range=30d
    // -> { kpis, revenue, categorySales, orderStatus, recentOrders, topProducts, lowStock, lowStockCount, activity }
    getDashboardStats: build.query({
      query: (range) => ({ url: "/admin/stats/dashboard", params: { range } }),
      transformResponse: (response) => response?.data,
      providesTags: STATS_TAGS,
    }),

    // GET /api/admin/stats/analytics?range=30d
    // -> { kpis, heatmap, regions, customerMix, productPerformance }
    getAnalyticsStats: build.query({
      query: (range) => ({ url: "/admin/stats/analytics", params: { range } }),
      transformResponse: (response) => response?.data,
      providesTags: STATS_TAGS,
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetAnalyticsStatsQuery } = statsApi;
