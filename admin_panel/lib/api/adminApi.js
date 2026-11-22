import { baseApi } from "./baseApi";


export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (data) => ({
        url: "/users/admin/signin", method: "POST", body:data

      }),
      transformResponse:(response)=>response?.data
    })

  })
})

export const {useSignInMutation}=adminApi