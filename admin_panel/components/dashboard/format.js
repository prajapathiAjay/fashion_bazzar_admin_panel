const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-IN");

export const formatCurrency = (v) => inr.format(v);
export const formatNumber = (v) => num.format(v);

// Compact Indian notation for axes and tight spaces: ₹4.6L, ₹1.2Cr
export function formatCompactINR(v) {
  if (v >= 1e7) return `₹${+(v / 1e7).toFixed(2)}Cr`;
  if (v >= 1e5) return `₹${+(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${+(v / 1e3).toFixed(1)}K`;
  return `₹${v}`;
}

// Round an axis max up to a "nice" value and return evenly spaced ticks
export function niceTicks(max, count = 4) {
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}
