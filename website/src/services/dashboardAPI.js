import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";

export const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  tagTypes: ["Dashboard"],

  endpoints: (builder) => ({

    // 📊 1. STATS API (always)
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),

    // 📈 2. CHART API (filtered)
    getDashboardChart: builder.query({
      query: ({ classId, subjectId }) => ({
        url: "/dashboard/chart",
        method: "GET",
        params: {
          ...(classId && { classId }),
          ...(subjectId && { subjectId }),
        },
      }),
      providesTags: ["Dashboard"],
    }),

  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetDashboardChartQuery,
} = dashboardAPI;