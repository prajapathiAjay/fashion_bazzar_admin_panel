import { baseApi } from "./baseApi";

// Coupon codes (admin only): /api/admin/discounts
export const discountsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // every discount, newest first
    getDiscounts: build.query({
      query: () => "/admin/discounts",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Discount"],
    }),

    // one discount, for the edit page
    getDiscount: build.query({
      query: (id) => `/admin/discounts/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "Discount", id }],
    }),

    // body: { code, description, type, value, maxDiscount, minOrder, usageLimit, perCustomer, startsAt, endsAt, isActive }
    createDiscount: build.mutation({
      query: (body) => ({ url: "/admin/discounts", method: "POST", body }),
      invalidatesTags: ["Discount"],
    }),

    // any subset of the fields above, e.g. { id, isActive: false }
    updateDiscount: build.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/discounts/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => ["Discount", { type: "Discount", id }],
    }),

    deleteDiscount: build.mutation({
      query: (id) => ({ url: `/admin/discounts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Discount"],
    }),
  }),
});

export const {
  useGetDiscountsQuery,
  useGetDiscountQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountsApi;
