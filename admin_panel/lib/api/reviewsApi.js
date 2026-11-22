import { baseApi } from "./baseApi";

// Review moderation: /api/admin/reviews
// one review = { _id, rating, title, comment, helpful, isHidden, reply?: { text, repliedAt },
//                verifiedPurchase, createdAt, product: { _id, name, images } | null,
//                user: { _id, firstName, lastName, email } | null }
export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReviews: build.query({
      query: () => "/admin/reviews",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Review"],
    }),

    // { id, isHidden?: boolean, reply?: string }  (reply "" removes the store's answer)
    // hiding changes the product's rating, so products are refetched too
    moderateReview: build.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/reviews/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { isHidden }) => ["Review", ...(isHidden !== undefined ? ["Product"] : [])],
    }),

    deleteReview: build.mutation({
      query: (id) => ({ url: `/admin/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Review", "Product"],
    }),
  }),
});

export const { useGetReviewsQuery, useModerateReviewMutation, useDeleteReviewMutation } = reviewsApi;
