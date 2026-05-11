import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { skipToken } from "@reduxjs/toolkit/query";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Users,
  BookOpen,
  UserCheck,
} from "lucide-react";

import {
  useGetDashboardChartQuery,
  useGetDashboardStatsQuery,
} from "@/services/dashboardAPI";
import { useGetSubjectsQuery } from "@/services/subjectAPI";
import { useGetClassesQuery } from "@/services/classAPI";

// TEMP DATA
const classes = [
  { _id: "class1", name: "BSCS - Sem 5" },
  { _id: "class2", name: "BSCS - Sem 6" },
];



// ================= COMPONENT =================
const Home = () => {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  // ✅ STATS (always)
  const {
    data: statsRes,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardStatsQuery();

  // ✅ CHART (conditional)
  const {
    data: chartRes,
    isLoading: chartLoading,
    error: chartError,
  } = useGetDashboardChartQuery(
    classId && subjectId
      ? { classId, subjectId }
      : skipToken
  );
  console.log("Chart API response:", chartRes);
 const {
  data: subjectsData,
  isLoading: subjectsLoading,
  error: subjectsError,
} = useGetSubjectsQuery();
  const { data: classesData, isLoading: classesLoading, error: classesError } = useGetClassesQuery();
  const subjects = subjectsData?.data?.subjects || [];
  
  const classes = classesData?.data?.classes || [];
  // 🔥 SAFE DATA EXTRACTION
  const statsData = statsRes?.data || {};

  const chartData = Array.isArray(chartRes?.data)
    ? chartRes.data
    : [];
  const isFilterSelected = classId && subjectId;
const hasChartData = chartData && chartData.length > 0;
  return (
    <div className="space-y-6">

      {/* HEADER + FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time attendance intelligence and school metrics
          </p>
        </div>

        {/* DROPDOWNS */}
        <div className="flex gap-2">

          <Select value={classId} onValueChange={(value) => {
  setClassId(value);
  setSubjectId(""); // reset subject
}}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select Class" />
  </SelectTrigger>

  <SelectContent>
    {classes.map((c) => (
      <SelectItem key={c._id} value={c._id}>
        {c.degree.toUpperCase()} - Sem {c.semester} {c.session}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

        <Select
  value={subjectId}
  onValueChange={(value) => setSubjectId(value)}
  disabled={!classId}
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select Subject" />
  </SelectTrigger>

  <SelectContent>
    {subjects.map((s) => (
      <SelectItem key={s._id} value={s._id}>
        {s.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

        </div>
      </div>

      {/* ERROR STATES */}
      {statsError && (
        <div className="text-red-500">Stats failed to load</div>
      )}

      {chartError && (
        <div className="text-red-500">Chart failed to load</div>
      )}

      {/* STATS LOADING */}
      {statsLoading ? (
        <div className="text-muted-foreground">
          Loading stats...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <Card>
            <CardContent className="p-5 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Students
                </p>
                <h2 className="text-2xl font-bold">
                  {statsData.totalStudents || 0}
                </h2>
              </div>
              <Users className="text-blue-600 w-5 h-5" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Classes
                </p>
                <h2 className="text-2xl font-bold">
                  {statsData.totalClasses || 0}
                </h2>
              </div>
              <BookOpen className="text-orange-500 w-5 h-5" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Teachers
                </p>
                <h2 className="text-2xl font-bold">
                  {statsData.totalTeachers || 0}
                </h2>
              </div>
              <UserCheck className="text-purple-500 w-5 h-5" />
            </CardContent>
          </Card>

        </div>
      )}

      {/* CHART */}
     <Card>
  <CardHeader>
    <CardTitle>Attendance Trends</CardTitle>
  </CardHeader>

  <CardContent className="h-[300px]">

    {chartLoading ? (
      <div className="text-muted-foreground">
        Loading chart...
      </div>
    ) : isFilterSelected && !hasChartData ? (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No attendance data found
      </div>
    ) : hasChartData ? (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <Tooltip />
          <Bar
            dataKey="attendance"
            radius={[6, 6, 0, 0]}
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select class & subject to view chart
      </div>
    )}

  </CardContent>
</Card>

    </div>
  );
};

export default Home;