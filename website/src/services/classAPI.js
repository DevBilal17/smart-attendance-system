import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";
export const classAPI = createApi({
  reducerPath: "classAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/classes`,
  }),
  tagTypes: ["Class"],

  endpoints: (builder) => ({
    // GET CLASSES
    getClasses: builder.query({
      query: ({ page = 1, limit = 10, session, degree } = {}) => {
        let url = `?page=${page}&limit=${limit}`;
        if (session) url += `&session=${session}`;
        if (degree) url += `&degree=${degree}`;
        return url;
      },
      providesTags: ["Class"],
    }),

    // CREATE CLASS
    createClass: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Class"],
    }),

    // DELETE CLASS
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),

    // UPDATE CLASS
    updateClass: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useDeleteClassMutation,
    useUpdateClassMutation,
} = classAPI;
