import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";

export const authAPI = createApi({
  reducerPath: "authAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/auth`,
  }),

  tagTypes: ["Auth","Profile"],

  endpoints: (builder) => ({

    // 🔐 REGISTER
    register: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 🔐 LOGIN
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    getProfile: builder.query({
      query: (id) => `/profile/${id}`,
      providesTags: ["Profile"],
    })
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery
} = authAPI;