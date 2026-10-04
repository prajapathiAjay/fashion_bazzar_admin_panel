// Static analytics data — replace with API calls once tracking + aggregation endpoints exist.

export { RANGES } from "./dashboardData";

export const ANALYTICS_KPIS = {
  "7d": [
    { key: "sessions", label: "Sessions", value: 48210, format: "number", change: 7.4, spark: [61, 66, 58, 63, 70, 68, 74, 66, 72, 63, 69, 75, 73, 81] },
    { key: "conversion", label: "Conversion Rate", value: 2.66, format: "percent", change: 0.8, spark: [2.4, 2.5, 2.3, 2.5, 2.6, 2.5, 2.6, 2.5, 2.7, 2.5, 2.6, 2.7, 2.6, 2.7] },
    { key: "returning", label: "Returning Customers", value: 38.2, format: "percent", change: 3.1, spark: [34, 35, 34, 36, 35, 36, 37, 36, 37, 37, 38, 37, 38, 38] },
    { key: "refund", label: "Return Rate", value: 6.4, format: "percent", change: -1.2, invert: true, spark: [7.8, 7.6, 7.5, 7.3, 7.4, 7.1, 7.0, 6.9, 6.9, 6.7, 6.6, 6.6, 6.5, 6.4] },
  ],
  "30d": [
    { key: "sessions", label: "Sessions", value: 206480, format: "number", change: 9.8, spark: [58, 61, 60, 64, 62, 66, 69, 65, 70, 68, 72, 75, 73, 78] },
    { key: "conversion", label: "Conversion Rate", value: 2.67, format: "percent", change: 0.4, spark: [2.5, 2.5, 2.6, 2.5, 2.6, 2.6, 2.6, 2.7, 2.6, 2.7, 2.6, 2.7, 2.7, 2.7] },
    { key: "returning", label: "Returning Customers", value: 37.5, format: "percent", change: 2.4, spark: [33, 34, 34, 35, 35, 35, 36, 36, 36, 37, 37, 37, 37, 38] },
    { key: "refund", label: "Return Rate", value: 6.9, format: "percent", change: -0.7, invert: true, spark: [7.6, 7.5, 7.5, 7.4, 7.3, 7.3, 7.2, 7.1, 7.1, 7.0, 7.0, 6.9, 6.9, 6.9] },
  ],
  "12m": [
    { key: "sessions", label: "Sessions", value: 2184600, format: "number", change: 22.6, spark: [12, 14, 17, 21, 14, 15, 13, 14, 15, 17, 16, 18, 17, 19, 17, 18, 18, 20, 19, 22, 20, 23, 22, 25] },
    { key: "conversion", label: "Conversion Rate", value: 2.61, format: "percent", change: 0.3, spark: [2.3, 2.4, 2.6, 2.9, 2.4, 2.5, 2.4, 2.4, 2.5, 2.5, 2.5, 2.6, 2.5, 2.6, 2.5, 2.6, 2.6, 2.6, 2.6, 2.7, 2.6, 2.7, 2.7, 2.8] },
    { key: "returning", label: "Returning Customers", value: 35.8, format: "percent", change: 4.6, spark: [29, 30, 30, 31, 31, 32, 32, 32, 33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36, 37] },
    { key: "refund", label: "Return Rate", value: 7.3, format: "percent", change: -1.9, invert: true, spark: [9.4, 9.2, 9.1, 8.9, 8.8, 8.6, 8.5, 8.4, 8.3, 8.1, 8.0, 7.9, 7.9, 7.8, 7.7, 7.6, 7.6, 7.5, 7.5, 7.4, 7.4, 7.3, 7.3, 7.3] },
  ],
};

// Each stage is a count of sessions that reached it
export const FUNNEL = [
  { stage: "Sessions", count: 206480 },
  { stage: "Product views", count: 124310 },
  { stage: "Added to cart", count: 28940 },
  { stage: "Reached checkout", count: 11260 },
  { stage: "Purchased", count: 5518 },
];

export const TRAFFIC_SOURCES = [
  { source: "Instagram", sessions: 61940, conversion: 2.9 },
  { source: "Organic search", sessions: 52380, conversion: 3.1 },
  { source: "Direct", sessions: 38720, conversion: 3.6 },
  { source: "Google Ads", sessions: 27410, conversion: 2.2 },
  { source: "Email", sessions: 14860, conversion: 4.8 },
  { source: "Referral", sessions: 11170, conversion: 1.9 },
];

// Order matters: adjacent segments were validated for colour-blind separation
export const DEVICES = [
  { device: "Mobile", share: 71.4, color: "#109474" },
  { device: "Desktop", share: 22.8, color: "#4F63C0" },
  { device: "Tablet", share: 5.8, color: "#C9893A" },
];

export const CUSTOMER_MIX = {
  colors: { new: "#9A2E3C", returning: "#4F63C0" },
  months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  new: [3120, 2980, 3340, 3610, 3890, 4120],
  returning: [1640, 1720, 1890, 2080, 2310, 2540],
};

// Orders by weekday × 3-hour slot, used for the heatmap
export const HEATMAP = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  slots: ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"],
  values: [
    [18, 6, 22, 64, 92, 88, 121, 146],
    [16, 5, 24, 61, 89, 84, 118, 139],
    [19, 7, 21, 66, 95, 90, 126, 151],
    [21, 6, 25, 68, 97, 93, 131, 158],
    [27, 9, 23, 63, 101, 106, 149, 187],
    [38, 12, 19, 58, 124, 142, 168, 196],
    [35, 11, 17, 52, 118, 137, 159, 172],
  ],
};

export const REGIONS = [
  { state: "Maharashtra", orders: 1284, revenue: 1092400 },
  { state: "Karnataka", orders: 962, revenue: 846300 },
  { state: "Delhi NCR", orders: 911, revenue: 801700 },
  { state: "Tamil Nadu", orders: 708, revenue: 569200 },
  { state: "Telangana", orders: 586, revenue: 498100 },
  { state: "Gujarat", orders: 471, revenue: 372600 },
  { state: "West Bengal", orders: 396, revenue: 311800 },
];

// % of each monthly signup cohort that ordered again in month N
export const COHORTS = [
  { cohort: "Apr 2026", size: 2840, retention: [100, 31.2, 24.6, 21.3, 19.1, 17.8, 16.9] },
  { cohort: "May 2026", size: 3120, retention: [100, 33.4, 26.1, 22.7, 20.2, 18.6] },
  { cohort: "Jun 2026", size: 2980, retention: [100, 32.8, 25.9, 22.1, 19.8] },
  { cohort: "Jul 2026", size: 3340, retention: [100, 35.1, 27.4, 23.6] },
  { cohort: "Aug 2026", size: 3610, retention: [100, 36.7, 28.9] },
  { cohort: "Sep 2026", size: 3890, retention: [100, 38.2] },
];

export const PRODUCT_PERFORMANCE = [
  { name: "Banarasi Silk Saree", category: "Women's Ethnic", views: 18420, cartRate: 9.8, conversion: 2.24, revenue: 1029588, returnRate: 3.1 },
  { name: "Anarkali Kurta Set", category: "Women's Ethnic", views: 15360, cartRate: 8.4, conversion: 1.94, revenue: 625502, returnRate: 5.8 },
  { name: "Denim Trucker Jacket", category: "Western Wear", views: 14980, cartRate: 6.1, conversion: 1.7, revenue: 558546, returnRate: 9.4 },
  { name: "Linen Relaxed Shirt", category: "Men's Casual", views: 12840, cartRate: 11.2, conversion: 3.01, revenue: 501414, returnRate: 4.2 },
  { name: "Leather Kolhapuri", category: "Footwear", views: 10230, cartRate: 12.6, conversion: 3.33, revenue: 409159, returnRate: 11.7 },
  { name: "Printed Maxi Dress", category: "Western Wear", views: 9870, cartRate: 5.2, conversion: 1.21, revenue: 286230, returnRate: 13.2 },
];

export const TOP_SEARCHES = [
  { term: "saree", count: 8420 },
  { term: "kurta set", count: 6110 },
  { term: "linen shirt", count: 4380 },
  { term: "festive wear", count: 3960 },
  { term: "kolhapuri", count: 2870 },
  { term: "oversized tshirt", count: 2410 },
];
