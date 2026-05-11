import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attendanceAPI = createApi({
  reducerPath: "attendanceAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/attendance",
  }),
  tagTypes: ["Attendance"],

  endpoints: (builder) => ({

    // 🔥 START SESSION
    startSession: builder.mutation({
      query: (data) => ({
        url: "/start",
        method: "POST",
        body: data,
      }),
    }),

    // 🔥 MARK ATTENDANCE (FORMDATA)
    markAttendance: builder.mutation({
      query: (formData) => ({
        url: "/mark",
        method: "POST",
        body: formData,
      }),
    }),

    // 🔥 STOP SESSION
    stopSession: builder.mutation({
      query: (data) => ({
        url: "/stop",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useStartSessionMutation,
  useMarkAttendanceMutation,
  useStopSessionMutation,
} = attendanceAPI;