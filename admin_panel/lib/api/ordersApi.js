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
        ...(status === "Cancelled" ? ["Product"] : []),
      ],
    }),

    // PATCH /api/admin/orders/:id/return  body: { action: "approve" | "reject" | "receive" | "refunded", note? }
    // "receive" puts stock back (and refunds online payments), so products / dashboard refetch too.
    updateReturn: build.mutation({
      query: ({ id, action, note }) => ({ url: `/admin/orders/${id}/return`, method: "PATCH", body: { action, note } }),
      invalidatesTags: (result, error, { id, action }) => [
        "Order",
        "Customer",
        { type: "Order", id },
        ...(action === "receive" ? ["Product"] : []),
      ],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, useUpdateOrderStatusMutation, useUpdateReturnMutation } = ordersApi;
