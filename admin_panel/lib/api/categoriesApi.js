import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /category
    getCategories: build.query({
      query: () => "/category",
      transformResponse: (response) => response.data,
      providesTags: ["Category"],
    }),

    // GET /category/:id
    getCategory: build.query({
      query: (id) => `/category/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // POST /category  (body: { categoryName, description, isActive, image: url | null })
    createCategory: build.mutation({
      query: (body) => ({ url: "/category", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),

    // PUT /category/:id  (body: same shape as create)
    updateCategory: build.mutation({
      query: ({ id, ...body }) => ({ url: `/category/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => ["Category", { type: "Category", id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesApi;
