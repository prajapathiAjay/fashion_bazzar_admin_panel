import { baseApi } from "./baseApi";

// Help centre questions: /api/admin/faqs
// getFaqs -> { topics: ["Orders & payment", ...], faqs: [{ _id, topic, question, answer, isPublished, createdAt, updatedAt }] }
export const faqsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFaqs: build.query({
      query: () => "/admin/faqs",
      transformResponse: (response) => response?.data ?? { topics: [], faqs: [] },
      providesTags: ["Faq"],
    }),

    // { topic, question, answer, isPublished? }
    createFaq: build.mutation({
      query: (body) => ({ url: "/admin/faqs", method: "POST", body }),
      invalidatesTags: ["Faq"],
    }),

    // { id, ...any of topic / question / answer / isPublished }
    updateFaq: build.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/faqs/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Faq"],
    }),

    deleteFaq: build.mutation({
      query: (id) => ({ url: `/admin/faqs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Faq"],
    }),
  }),
});

export const { useGetFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } = faqsApi;
