import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /category
    getCategories: build.query({
      query: () => "/category",
      transformResponse: (response) => response.data,
      // "LIST" lets a delete refresh the list without refetching the deleted category
      providesTags: [{ type: "Category", id: "LIST" }],
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

    // PATCH /category/:id  (body: same shape as create)
    updateCategory: build.mutation({
      query: ({ id, ...body }) => ({ url: `/category/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => ["Category", { type: "Category", id }],
    }),

    // DELETE /category/:id
    deleteCategory: build.mutation({
      query: (id) => ({ url: `/category/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
}= categoriesApi;
