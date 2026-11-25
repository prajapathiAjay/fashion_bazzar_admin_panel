import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../slice/authSlice";

// The normal request: base URL + "Authorization: Bearer <token>"
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Every request goes through here. If the backend says 401 (token expired, made with an
// old secret, or missing), log out: the (admin) layout then sends the admin to /login.
// 403 is NOT handled here: it means "logged in, but not allowed" and the page shows the error.
const baseQueryWithLogout = async (args, api, extraOptions) => {
  const sentToken = api.getState().auth?.token;
  const result = await rawBaseQuery(args, api, extraOptions);

  // Only if the refused token is still the one in use: after a password change the panel
  // swaps in a fresh token, and a slow request made with the old one mustn't log the admin out.
  if (
    result.error?.status === 401 &&
    api.endpoint !== "signIn" &&
    sentToken === api.getState().auth?.token
  ) {
    api.dispatch(logout({ expired: true }));
    // throw away the old session's cached data (baseApi exists by the time a request runs)
    api.dispatch(baseApi.util.resetApiState());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Product","Category","Order","Customer","Discount","Shipping","Review","Message","Faq","Settings"],
  endpoints: () => ({}),
});
