import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";

export const subjectAPI = createApi({
  reducerPath: "subjectAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/subjects`,
  }),

  tagTypes: ["Subject"],

  endpoints: (builder) => ({

    getSubjects: builder.query({
      query: () => "/",
      providesTags: ["Subject"],
    }),

    createSubject: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    updateSubject: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectAPI;