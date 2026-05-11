import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";

export const timetableAPI = createApi({
  reducerPath: "timetableAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/timetable`,
  }),
  tagTypes: ["Timetable"],

  endpoints: (builder) => ({
    // 📥 GET ALL TIMETABLES (with filters)
    getTimetables: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.classId) queryParams.append("classId", params.classId);
        if (params.teacherId) queryParams.append("teacherId", params.teacherId);

        const queryString = queryParams.toString();

        return queryString ? `?${queryString}` : "";
      },
      providesTags: ["Timetable"],
    }),

    // 🔍 GET SINGLE TIMETABLE
    getTimetableById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Timetable"],
    }),

    // ➕ CREATE TIMETABLE
    createTimetable: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Timetable"],
    }),

    // ✏️ UPDATE TIMETABLE
    updateTimetable: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Timetable"],
    }),

    // ❌ DELETE TIMETABLE
    deleteTimetable: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timetable"],
    }),
  }),
});

export const {
  useGetTimetablesQuery,
  useLazyGetTimetablesQuery,
  useGetTimetableByIdQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
} = timetableAPI;
