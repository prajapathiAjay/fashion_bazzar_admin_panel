// Shared helpers for the admin Orders pages (list + detail)

export const ORDER_STATUSES = ["Ordered", "Packed", "Shipped", "Delivered", "Cancelled"];

// Same rules as the backend (order.repository.js NEXT_STATUSES):
// forward one step at a time, cancel only before shipping, Delivered/Cancelled are final.
export const NEXT_STEP = { Ordered: "Packed", Packed: "Shipped", Shipped: "Delivered" };
export const canCancel = (status) => status === "Ordered" || status === "Packed";

// Badge colours for the order status (values come from order.schema.js)
const STATUS_STYLES = {
  Ordered: "bg-info-50 text-info ring-info/30",
  Packed: "bg-sun-50 text-sun-dark ring-sun/40",
  Shipped: "bg-brand-50 text-brand ring-brand/25",
  Delivered: "bg-success-50 text-success ring-success/30",
  Cancelled: "bg-danger-50 text-danger ring-danger/30",
};

const PAYMENT_STYLES = {
  Pending: "bg-sun-50 text-sun-dark ring-sun/40",
  Paid: "bg-success-50 text-success ring-success/30",
  Failed: "bg-danger-50 text-danger ring-danger/30",
  Refunded: "bg-mist text-muted ring-line-strong",
};

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 whitespace-nowrap";

export function StatusBadge({ status }) {
  return (
    <span className={`${badgeBase} ${STATUS_STYLES[status] ?? "bg-mist text-muted ring-line"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status ?? "—"}
    </span>
  );
}

export function PaymentBadge({ status }) {
  return (
    <span className={`${badgeBase} ${PAYMENT_STYLES[status] ?? "bg-mist text-muted ring-line"}`}>
      {status ?? "—"}
    </span>
  );
}

export const paymentMethodLabel = (method) =>
  method === "cod" ? "Cash on delivery" : method === "razorpay" ? "Online (Razorpay)" : method ?? "—";

// Name of the delivery option on an order. New orders save the name; older ones only have the code.
export const shippingMethodLabel = (order) => {
  if (order?.shippingMethodName) return order.shippingMethodName;
  const code = order?.shippingMethod;
  if (!code) return "—";
  return code.charAt(0).toUpperCase() + code.slice(1).replace(/-/g, " ");
};

// user is populated by the backend; it can be null if the account was deleted
export const customerName = (user) => {
  if (!user) return "Deleted user";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || user.email || "—";
};

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

// total pieces in the order (2 shirts + 1 kurta = 3)
export const itemCount = (order) =>
  (order?.items ?? []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
