import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";

export const teacherAPI = createApi({
  reducerPath: "teacherAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/teachers`,
  }),

  tagTypes: ["Teacher"],

  endpoints: (builder) => ({

    // GET ALL TEACHERS (with pagination + filters optional later)
 getTeachers: builder.query({
  query: ({ page = 1, limit = 10, status, search } = {}) => {
    let url = `?page=${page}&limit=${limit}`;

    if (status) url += `&status=${status}`;
    if (search) url += `&search=${search}`;

    return url;
  },
  providesTags: ["Teacher"],
}),

    // CREATE TEACHER
    createTeacher: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teacher"],
    }),

    // UPDATE TEACHER
    updateTeacher: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Teacher"],
    }),

    // DELETE TEACHER
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),

    // GET SINGLE TEACHER (optional but useful for edit/profile)
    getTeacherById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Teacher"],
    }),

    getTeacherProfile: builder.query({
      query: (id) => `/profile/${id}`,
      providesTags: ["Teacher"],
    }),

    getTeacherAssignments: builder.query({
      query: (id) => `/assignments/${id}`,
      providesTags: ["Teacher"],
    }),

  }),
});

export const {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useGetTeacherByIdQuery,
  useGetTeacherProfileQuery,
  useGetTeacherAssignmentsQuery,
} = teacherAPI;