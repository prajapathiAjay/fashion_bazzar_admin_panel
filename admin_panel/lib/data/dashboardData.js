// Static dashboard data — replace with API calls once the backend endpoints exist.

// Deterministic pseudo-random so the 30-day series is stable between renders
const wave = (i, base, amp, seed = 1) =>
  Math.round(base + amp * Math.sin(i / 2.3 + seed) + (amp / 2) * Math.cos(i / 1.1 + seed * 2) + i * (amp / 12));

const days30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 8, 4 + i);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
});

export const RANGES = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "12m", label: "12 months" },
];

export const REVENUE = {
  "7d": {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    current: [142000, 168500, 121300, 134800, 151200, 162900, 189400],
    previous: [128400, 149000, 118900, 126300, 139700, 141200, 160800],
  },
  "30d": {
    labels: days30,
    current: days30.map((_, i) => wave(i, 145000, 26000, 1)),
    previous: days30.map((_, i) => wave(i, 132000, 22000, 2.4)),
  },
  "12m": {
    labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    current: [3120000, 4380000, 3410000, 3090000, 3560000, 3820000, 3990000, 3710000, 4050000, 4420000, 4610000, 4980000],
    previous: [2640000, 3720000, 2910000, 2700000, 3050000, 3180000, 3320000, 3260000, 3480000, 3610000, 3870000, 4120000],
  },
};

// Sparklines reuse the trend of each KPI over the selected range
export const KPIS = {
  "7d": [
    { key: "revenue", label: "Total Revenue", value: 1070100, format: "currency", change: 11.4, spark: [128, 149, 119, 126, 140, 141, 161, 142, 168, 121, 135, 151, 163, 189] },
    { key: "orders", label: "Orders", value: 1284, format: "number", change: 8.2, spark: [160, 172, 150, 158, 166, 171, 180, 168, 190, 162, 170, 182, 188, 204] },
    { key: "customers", label: "New Customers", value: 342, format: "number", change: 14.9, spark: [38, 41, 36, 40, 44, 42, 47, 45, 49, 43, 48, 51, 50, 56] },
    { key: "aov", label: "Avg. Order Value", value: 833, format: "currency", change: -2.1, spark: [860, 852, 848, 851, 845, 842, 846, 839, 841, 836, 838, 834, 835, 833] },
  ],
  "30d": [
    { key: "revenue", label: "Total Revenue", value: 4612300, format: "currency", change: 9.6, spark: [132, 138, 129, 141, 136, 145, 150, 139, 152, 148, 156, 161, 158, 166] },
    { key: "orders", label: "Orders", value: 5518, format: "number", change: 6.8, spark: [170, 176, 168, 181, 179, 184, 190, 186, 192, 189, 196, 199, 197, 204] },
    { key: "customers", label: "New Customers", value: 1426, format: "number", change: 12.3, spark: [40, 42, 41, 44, 43, 46, 47, 46, 49, 48, 51, 52, 51, 54] },
    { key: "aov", label: "Avg. Order Value", value: 836, format: "currency", change: 2.6, spark: [812, 815, 818, 816, 820, 823, 821, 826, 828, 827, 831, 833, 834, 836] },
  ],
  "12m": [
    { key: "revenue", label: "Total Revenue", value: 47140000, format: "currency", change: 18.7, spark: [264, 312, 372, 438, 291, 341, 270, 309, 305, 356, 318, 382, 332, 399, 326, 371, 348, 405, 361, 442, 387, 461, 412, 498] },
    { key: "orders", label: "Orders", value: 58240, format: "number", change: 15.2, spark: [36, 41, 47, 55, 39, 44, 37, 40, 41, 46, 42, 49, 44, 51, 43, 48, 45, 52, 47, 56, 50, 58, 53, 62] },
    { key: "customers", label: "New Customers", value: 16930, format: "number", change: 21.4, spark: [9, 11, 13, 16, 10, 12, 10, 11, 11, 13, 12, 14, 12, 15, 12, 14, 13, 15, 14, 16, 15, 17, 16, 19] },
    { key: "aov", label: "Avg. Order Value", value: 809, format: "currency", change: 3.1, spark: [771, 776, 779, 783, 780, 784, 786, 788, 787, 791, 790, 794, 793, 796, 795, 799, 798, 801, 802, 804, 803, 806, 807, 809] },
  ],
};

export const CATEGORY_SALES = [
  { name: "Women's Ethnic", revenue: 1384000 },
  { name: "Men's Casual", revenue: 1046000 },
  { name: "Footwear", revenue: 812000 },
  { name: "Western Wear", revenue: 655000 },
  { name: "Accessories", revenue: 418000 },
  { name: "Kids", revenue: 297300 },
];

// Order matters: adjacent segments were validated for colour-blind separation
export const ORDER_STATUS = [
  { status: "Delivered", count: 3412, color: "#109474" },
  { status: "Shipped", count: 1186, color: "#4F63C0" },
  { status: "Processing", count: 674, color: "#C9893A" },
  { status: "Cancelled", count: 246, color: "#9A2E3C" },
];

export const RECENT_ORDERS = [
  { id: "#FB-10482", customer: "Priya Sharma", email: "priya.s@gmail.com", items: 3, total: 4297, status: "Processing", date: "03 Oct, 10:42 AM" },
  { id: "#FB-10481", customer: "Rahul Verma", email: "rahul.v@outlook.com", items: 1, total: 1899, status: "Shipped", date: "03 Oct, 09:18 AM" },
  { id: "#FB-10480", customer: "Ananya Iyer", email: "ananya.iyer@gmail.com", items: 5, total: 8640, status: "Delivered", date: "02 Oct, 07:55 PM" },
  { id: "#FB-10479", customer: "Karan Mehta", email: "karan.m@yahoo.com", items: 2, total: 2598, status: "Pending", date: "02 Oct, 05:31 PM" },
  { id: "#FB-10478", customer: "Sneha Reddy", email: "sneha.r@gmail.com", items: 1, total: 3499, status: "Cancelled", date: "02 Oct, 02:09 PM" },
  { id: "#FB-10477", customer: "Arjun Nair", email: "arjun.nair@gmail.com", items: 4, total: 5126, status: "Delivered", date: "02 Oct, 11:47 AM" },
];

export const TOP_PRODUCTS = [
  { name: "Banarasi Silk Saree", category: "Women's Ethnic", sold: 412, revenue: 1029588, initials: "BS" },
  { name: "Linen Relaxed Shirt", category: "Men's Casual", sold: 386, revenue: 501414, initials: "LS" },
  { name: "Leather Kolhapuri", category: "Footwear", sold: 341, revenue: 409159, initials: "LK" },
  { name: "Anarkali Kurta Set", category: "Women's Ethnic", sold: 298, revenue: 625502, initials: "AK" },
  { name: "Denim Trucker Jacket", category: "Western Wear", sold: 254, revenue: 558546, initials: "DJ" },
];

export const LOW_STOCK = [
  { name: "Chikankari Kurti — M", sku: "WE-CHK-021-M", stock: 3, threshold: 15 },
  { name: "Slim Chinos Olive — 32", sku: "MC-CHN-114-32", stock: 5, threshold: 20 },
  { name: "Juttis Gold — 7", sku: "FW-JUT-008-7", stock: 2, threshold: 10 },
  { name: "Silk Dupatta Maroon", sku: "AC-DUP-045", stock: 7, threshold: 25 },
];

export const ACTIVITY = [
  { type: "order", text: "New order #FB-10482 placed by Priya Sharma", time: "12 min ago" },
  { type: "review", text: "5★ review on Banarasi Silk Saree", time: "38 min ago" },
  { type: "stock", text: "Juttis Gold — 7 dropped below threshold", time: "1 hr ago" },
  { type: "customer", text: "24 new customers signed up today", time: "2 hr ago" },
  { type: "product", text: "Festive Collection '26 published (18 products)", time: "5 hr ago" },
];
