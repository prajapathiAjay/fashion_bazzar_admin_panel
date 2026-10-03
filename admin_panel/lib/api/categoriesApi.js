import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /category
    getCategories: build.query({
      query: () => "/category",
      transformResponse: (response) => response.data,
      providesTags: ["Category"],
    }),

    // POST /category  (body: JSON, or FormData when an image file is attached)
    createCategory: build.mutation({
      query: (body) => ({ url: "/category", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoriesApi;
