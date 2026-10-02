import { baseApi } from "./baseApi";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET http://localhost:3200/api/products
    getProducts: build.query({
      query: () => "/products",
      transformResponse: (response) => response.data,
      providesTags: ["Product"],
    }),

    // GET http://localhost:3200/api/products/:id
    getProduct: build.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // POST http://localhost:3200/api/products
    createProduct: build.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
} = productsApi;
