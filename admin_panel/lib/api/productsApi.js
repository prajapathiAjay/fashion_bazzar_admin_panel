import { baseApi } from "./baseApi";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET http://localhost:3200/api/products
    getProducts: build.query({
      query: () => "/products",
    //   query: () => ({ url: "/products", method: "GET" })
      transformResponse: (response) => response.data,
      providesTags: ["Product"],
    }),

    // GET http://localhost:3200/api/products/:id
    getProduct: build.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // POST http://localhost:3200/api/products
    // body: { name, summary, description, brand, price, discount, stock, isActive,
    //         categories: [id], sizes: [String], colors: [String], images: [url] }
    createProduct: build.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product"],
    }),

    // PATCH http://localhost:3200/api/products/:id  (body: same shape as create)
    updateProduct: build.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => ["Product", { type: "Product", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productsApi;
