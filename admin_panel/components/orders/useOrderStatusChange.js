"use client";

import { useState } from "react";
import { useUpdateOrderStatusMutation } from "@/lib/api/ordersApi";
import { formatCurrency } from "@/components/dashboard/format";

// Shared by the orders table and the order detail page:
// asks for confirmation, calls the API and keeps the result message.
export default function useOrderStatusChange() {
  const [updateStatus, { isLoading: isUpdating, originalArgs }] = useUpdateOrderStatusMutation();
  // result of the last change: { type: "success" | "warning" | "error", text }
  const [notice, setNotice] = useState(null);

  const changeStatus = async (order, status) => {
    let question = `Mark order ${order.orderNumber} as ${status}?`;
    if (status === "Cancelled") {
      question = `Cancel order ${order.orderNumber}? The items go back into stock.`;
      if (order.paymentMethod === "razorpay" && order.paymentStatus === "Paid") {
        question += ` The customer will be refunded ${formatCurrency(order.totalAmount ?? 0)} through Razorpay.`;
      }
      question += " This can't be undone.";
    }
    if (!window.confirm(question)) return;

    setNotice(null);
    try {
      const res = await updateStatus({ id: order._id, status }).unwrap();
      setNotice({
        type: res.refundFailed ? "warning" : "success",
        text: `${order.orderNumber}: ${res.message}`,
      });
    } catch (err) {
      setNotice({ type: "error", text: err?.data?.message || "Could not update the order" });
    }
  };

  return {
    changeStatus,
    isUpdating,
    // which order / status is being saved right now (for spinners and disabling)
    updatingId: isUpdating ? originalArgs?.id : null,
    updatingStatus: isUpdating ? originalArgs?.status : null,
    notice,
    clearNotice: () => setNotice(null),
  };
}

// Colours for the result message
export const noticeClass = (type) =>
  type === "success"
    ? "bg-success-50 text-success"
    : type === "warning"
      ? "bg-sun-50 text-sun-dark"
      : "bg-danger-50 text-danger";
