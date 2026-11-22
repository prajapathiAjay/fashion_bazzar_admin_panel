import { baseApi } from "./baseApi";

// Admin can only VIEW customers, so there are no mutations here.
export const customersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /api/admin/customers
    // -> [{ _id, firstName, lastName, email, phone, createdAt, orderCount, totalSpent, lastOrderAt }]
    getCustomers: build.query({
      query: () => "/admin/customers",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Customer"],
    }),

    // GET /api/admin/customers/:id -> profile + addresses + orders (newest first)
    getCustomer: build.query({
      query: (id) => `/admin/customers/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
  }),
});

export const { useGetCustomersQuery, useGetCustomerQuery } = customersApi;
