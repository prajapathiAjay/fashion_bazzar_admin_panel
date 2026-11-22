// Helpers for the admin Shipping pages

// Same rule as the backend (shipping.schema.js calcShippingCost)
export const shippingCost = (method, subTotal) => {
  if (!method) return 0;
  const free = method.freeAbove;
  if (free !== null && free !== undefined && free !== "" && subTotal >= Number(free)) return 0;
  return Number(method.price) || 0;
};

// "4–6 days", "2 days", "Same day"
export const etaLabel = ({ minDays, maxDays }) => {
  const min = Number(minDays) || 0;
  const max = Number(maxDays) || 0;
  if (max === 0) return "Same day";
  if (min === max) return `${max} ${max === 1 ? "day" : "days"}`;
  return `${min}–${max} days`;
};

// example cart totals for the "what shoppers pay" previews
export const SAMPLE_CARTS = [499, 999, 1999, 4999];
