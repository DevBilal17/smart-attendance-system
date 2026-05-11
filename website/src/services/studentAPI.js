import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";

export const studentAPI = createApi({
  reducerPath: "studentAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/students`,
  }),

  tagTypes: ["Student"],

  endpoints: (builder) => ({

    // ================= GET STUDENTS =================
 getStudents: builder.query({
  query: ({ page = 1, limit = 10 }) => `?page=${page}&limit=${limit}`,
  providesTags: ["Student"],
}),

    // ================= GET STUDENTS BY CLASS =================
    getStudentsByClass: builder.query({
      query: (classId) => `/class/${classId}`,
      providesTags: ["Student"],
    }),

    // ================= CREATE STUDENT =================
    createStudent: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData, // 🔥 FormData for image
      }),
      invalidatesTags: ["Student"],
    }),

    // ================= DELETE STUDENT =================
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),

    // ================= UPDATE STUDENT =================
    updateStudent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT", // ⚠️ you must create this route in backend
        body: formData,
      }),
      invalidatesTags: ["Student"],
    }),

    // ================= GET STUDENTS BY CLASS =================
    // getStudentsByClass: builder.query({
    //   query: (classId) => `/class/${classId}`,
    //   providesTags: ["Student"],
    // })
  }),
});

// ================= EXPORT HOOKS =================
export const {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
  useGetStudentsByClassQuery,
} = studentAPI;