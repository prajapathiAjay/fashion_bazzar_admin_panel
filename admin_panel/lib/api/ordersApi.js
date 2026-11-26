import { baseApi } from "./baseApi";

// Admin can view orders and change their status (nothing else).
export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /api/admin/orders -> every order, newest first (user = { firstName, lastName, email })
    getOrders: build.query({
      query: () => "/admin/orders",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Order"],
    }),

    // GET /api/admin/orders/:id -> one order with items, address, payment and customer
    getOrder: build.query({
      query: (id) => `/admin/orders/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // PATCH /api/admin/orders/:id/status  body: { status }
    // returns the whole response so the page can read `message` and `refundFailed`.
    // Cancelling puts stock back, so the product list is refetched too.
    updateOrderStatus: build.mutation({
      query: ({ id, status }) => ({ url: `/admin/orders/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: (result, error, { id, status }) => [
        "Order",
        "Customer", // customer pages show order status and total spent
        { type: "Order", id },
        // cancelling gives stock and the coupon use back
        ...(status === "Cancelled" ? ["Product", "Discount"] : []),
      ],
    }),

    // PATCH /api/admin/orders/:id/refund  body: { mode: "retry" | "manual" }
    // a cancelled online order whose Razorpay refund failed: try again, or record a manual refund
    settleRefund: build.mutation({
      query: ({ id, mode }) => ({ url: `/admin/orders/${id}/refund`, method: "PATCH", body: { mode } }),
      invalidatesTags: (result, error, { id }) => ["Order", "Customer", { type: "Order", id }],
    }),

    // PATCH /api/admin/orders/:id/return  body: { action: "approve" | "reject" | "receive" | "refunded", note? }
    // "receive" puts stock back (and refunds online payments), so products / dashboard refetch too.
    updateReturn: build.mutation({
      query: ({ id, action, note }) => ({ url: `/admin/orders/${id}/return`, method: "PATCH", body: { action, note } }),
      invalidatesTags: (result, error, { id, action }) => [
        "Order",
        "Customer",
        { type: "Order", id },
        // receiving a return gives stock and the coupon use back
        ...(action === "receive" ? ["Product", "Discount"] : []),
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useUpdateReturnMutation,
  useSettleRefundMutation,
} = ordersApi;
