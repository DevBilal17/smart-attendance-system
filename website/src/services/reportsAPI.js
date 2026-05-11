import { BASE_URL } from "@/utils/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportsAPI = createApi({
  reducerPath: "reportsAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/reports`,
  }),

  endpoints: (builder) => ({

    // 📊 REPORT (LAZY CONTROLLED)
    getTeacherReport: builder.query({
      query: ({ teacherId, classId, subjectId, type }) => {
        const params = new URLSearchParams();

        if (classId) params.append("classId", classId);
        if (subjectId) params.append("subjectId", subjectId);
        if (type) params.append("type", type); // 🔥 DAILY/WEEKLY/MONTHLY

        return `/teacher/${teacherId}?${params.toString()}`;
      },
    }),

    getClassReport: builder.query({
      query: ({ classId, subjectId }) => {
        const params = new URLSearchParams();
        if (classId) params.append("classId", classId);
        if (subjectId) params.append("subjectId", subjectId);
        return `/class/${classId}/subject/${subjectId}?${params.toString()}`;
      },
    }),

    // 📄 PDF EXPORT
    downloadTeacherPDF: builder.query({
      query: ({ teacherId, classId, subjectId, type }) => {
        const params = new URLSearchParams();

        if (classId) params.append("classId", classId);
        if (subjectId) params.append("subjectId", subjectId);
        if (type) params.append("type", type);

        return `/teacher/${teacherId}/pdf?${params.toString()}`;
      },
    }),

  }),
});

export const {
  useGetTeacherReportQuery,
  useLazyGetTeacherReportQuery,   // 🔥 ADD THIS
  useLazyDownloadTeacherPDFQuery,
  useGetClassReportQuery,
} = reportsAPI;