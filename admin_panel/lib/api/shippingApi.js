import { baseApi } from "./baseApi";

// Delivery rates: /api/admin/shipping
// data = { standard: { enabled, price, freeAbove, minDays, maxDays }, express: { ...same } }
export const shippingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShippingSettings: build.query({
      query: () => "/admin/shipping",
      transformResponse: (response) => response?.data,
      providesTags: ["Shipping"],
    }),

    // body: { standard?: {...}, express?: {...} }
    updateShippingSettings: build.mutation({
      query: (body) => ({ url: "/admin/shipping", method: "PATCH", body }),
      invalidatesTags: ["Shipping"],
    }),
  }),
});

export const { useGetShippingSettingsQuery, useUpdateShippingSettingsMutation } = shippingApi;
