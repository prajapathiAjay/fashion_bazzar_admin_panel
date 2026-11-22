import { baseApi } from "./baseApi";

// Delivery options: /api/admin/shipping
// one method = { _id, code, name, description, price, freeAbove, minDays, maxDays, enabled, sortOrder }
export const shippingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShippingMethods: build.query({
      query: () => "/admin/shipping",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Shipping"],
    }),

    getShippingMethod: build.query({
      query: (id) => `/admin/shipping/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "Shipping", id }],
    }),

    // body: { name, description?, price, freeAbove?, minDays, maxDays, enabled? }
    createShippingMethod: build.mutation({
      query: (body) => ({ url: "/admin/shipping", method: "POST", body }),
      invalidatesTags: ["Shipping"],
    }),

    // any of the fields above, e.g. { id, enabled: false }
    updateShippingMethod: build.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/shipping/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => ["Shipping", { type: "Shipping", id }],
    }),

    deleteShippingMethod: build.mutation({
      query: (id) => ({ url: `/admin/shipping/${id}`, method: "DELETE" }),
      invalidatesTags: ["Shipping"],
    }),
  }),
});

export const {
  useGetShippingMethodsQuery,
  useGetShippingMethodQuery,
  useCreateShippingMethodMutation,
  useUpdateShippingMethodMutation,
  useDeleteShippingMethodMutation,
} = shippingApi;
