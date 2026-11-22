// Helpers for the admin Discounts pages (data comes from lib/api/discountsApi.js)
//
// One discount from the API:
// {
//   _id, code, description,
//   type: "percentage" | "fixed",   value: 20 (=20%) or 200 (=₹200),
//   maxDiscount: cap in ₹ for percentage codes (null = no cap),
//   minOrder: smallest cart total in ₹ (0 = any),
//   usageLimit: total uses allowed (null = unlimited), perCustomer: uses per shopper,
//   used / totalDiscountGiven: filled by checkout once it applies coupons,
//   startsAt, endsAt (null = never ends), isActive, createdAt
// }

export const DISCOUNT_STATUSES = ["Active", "Scheduled", "Expired", "Disabled"];

// Work out the status from dates, usage and the on/off switch
export function discountStatus(d, now = new Date()) {
  if (!d.isActive) return "Disabled";
  if (d.startsAt && new Date(d.startsAt) > now) return "Scheduled";
  if (d.endsAt && new Date(d.endsAt) < now) return "Expired";
  if (d.usageLimit != null && d.used >= d.usageLimit) return "Expired"; // used up
  return "Active";
}

const STATUS_STYLES = {
  Active: "bg-success-50 text-success ring-success/30",
  Scheduled: "bg-info-50 text-info ring-info/30",
  Expired: "bg-mist text-muted ring-line-strong",
  Disabled: "bg-danger-50 text-danger ring-danger/30",
};

export function DiscountStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        STATUS_STYLES[status] ?? STATUS_STYLES.Expired
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

// "20% off" / "₹200 off"
export const discountValueLabel = (d) =>
  d.type === "percentage" ? `${Number(d.value) || 0}% off` : `${inr.format(Number(d.value) || 0)} off`;

// "Up to ₹1,000" for capped percentage codes
export const discountCapLabel = (d) =>
  d.type === "percentage" && d.maxDiscount ? `Up to ${inr.format(d.maxDiscount)}` : null;

export const formatShortDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

// A random readable code like "FB-7KQ2M" (no 0/O/1/I to avoid mix-ups)
export function generateCode(prefix = "FB") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${out}`;
}
