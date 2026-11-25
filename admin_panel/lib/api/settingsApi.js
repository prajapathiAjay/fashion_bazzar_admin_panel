import { baseApi } from "./baseApi";

// Settings page: store details + the signed-in admin's own account
export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /api/admin/settings -> { storeName, supportEmail, supportPhone, supportHours, address }
    getStoreSettings: build.query({
      query: () => "/admin/settings",
      transformResponse: (response) => response?.data,
      providesTags: ["Settings"],
    }),

    // PATCH /api/admin/settings  (any of the fields above)
    updateStoreSettings: build.mutation({
      query: (body) => ({ url: "/admin/settings", method: "PATCH", body }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Settings"],
    }),

    // GET /api/users -> the signed-in admin's profile { firstName, lastName, email, ... }
    getMyProfile: build.query({
      query: () => "/users",
      transformResponse: (response) => response?.data?.user,
    }),

    // PUT /api/users/resetPassword  { currentPassword, newPassword }
    // a wrong current password comes back as 400 (not 401), so it doesn't log the admin out
    changePassword: build.mutation({
      query: (body) => ({ url: "/users/resetPassword", method: "PUT", body }),
    }),
  }),
});

export const {
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
  useGetMyProfileQuery,
  useChangePasswordMutation,
} = settingsApi;
