import { baseApi } from "./baseApi";

// Contact page messages: /api/admin/messages
// one message = { _id, name, email, orderId, topic, message, isResolved, createdAt }
export const messagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query({
      query: () => "/admin/messages",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Message"],
    }),

    // { id, isResolved: boolean }
    setMessageResolved: build.mutation({
      query: ({ id, isResolved }) => ({ url: `/admin/messages/${id}`, method: "PATCH", body: { isResolved } }),
      invalidatesTags: ["Message"],
    }),

    deleteMessage: build.mutation({
      query: (id) => ({ url: `/admin/messages/${id}`, method: "DELETE" }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useGetMessagesQuery, useSetMessageResolvedMutation, useDeleteMessageMutation } = messagesApi;
