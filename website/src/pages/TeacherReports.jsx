import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetTeacherReportQuery,
  useLazyDownloadTeacherPDFQuery,
  useLazyGetTeacherReportQuery,
} from "../services/reportsAPI";
import { BASE_URL } from "@/utils/constant";
import { useGetTeacherAssignmentsQuery } from "@/services/teacherAPI";

export default function TeacherReports() {

  const user = useSelector((state) => state.auth.user);

  const { data: assignmentsData } =
    useGetTeacherAssignmentsQuery(user?.id);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [reportType, setReportType] = useState("daily");
  // 📊 DATA FROM API
  const [getReport, { data, isLoading }] = useLazyGetTeacherReportQuery();
  console.log("Report Data:", data)
  // 📄 PDF DOWNLOAD
  const [downloadPDF] = useLazyDownloadTeacherPDFQuery();
const handleGenerateReport = () => {
  if (!classId || !subjectId) return;

  getReport({
    teacherId: user?.id,
    classId,
    subjectId,
    type: reportType, // 🔥 important
  });
};
 const report = data?.data || {};
const sessions = report?.sessions || [];
const records = report?.records || [];

  const handleDownload = async () => {
    window.open(
      `${BASE_URL}/api/reports/teacher/${user.id}/pdf?classId=${classId}&subjectId=${subjectId}`
    );
  };

  // 📊 CALCULATIONS (STATS)
const total = records.length;
const present = records.filter(r => r.status === "present").length;
const absent = records.filter(r => r.status === "absent").length;

const attendanceRate = total ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-8 bg-background">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">Teacher Reports</h1>
          <p className="text-muted-foreground text-sm">
            Class & Subject wise attendance analytics
          </p>
        </div>

        {/* <Button onClick={handleDownload}>
          Download PDF
        </Button> */}

      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="p-5 grid md:grid-cols-2 gap-5">

          <Select onValueChange={setClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
         <SelectContent>
              {assignmentsData?.data?.map((item) => (
                <SelectItem key={item.class._id} value={item.class._id}>
                  {item.class?.degree?.toUpperCase()} - Sem{" "}
                        {item.class?.semester} ({item.class?.batchStart}-
                        {item.class?.batchEnd})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSubjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
             <SelectContent>
              {assignmentsData?.data?.map((item) => (
                <SelectItem key={item.subject._id} value={item.subject._id}>
                  {item.subject.name} {`(${item.subject.code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setReportType} defaultValue="daily">
  <SelectTrigger>
    <SelectValue placeholder="Report Type" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="daily">Daily</SelectItem>
    <SelectItem value="weekly">Weekly</SelectItem>
    <SelectItem value="monthly">Monthly</SelectItem>
  </SelectContent>
</Select>
<Button
  onClick={handleGenerateReport}
  disabled={!classId || !subjectId || isLoading}
>
  {isLoading ? "Generating..." : "Generate Report"}
</Button>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5">

        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm text-muted-foreground">Attendance Rate</h2>
            <p className="text-3xl font-bold">{attendanceRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm text-muted-foreground">Present</h2>
            <p className="text-3xl font-bold text-green-600">{present}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm text-muted-foreground">Absent</h2>
            <p className="text-3xl font-bold text-red-500">{absent}</p>
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th>Student</th>
                <th>Roll</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Date</th>
<th>Time</th>
              </tr>
            </thead>

            <tbody>
              {report?.records?.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3">{r.student?.name}</td>
                  <td>{r.student?.rollNumber}</td>
                  <td>
                    <Badge className={
                      r.status === "present"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }>
                      {r.status}
                    </Badge>
                  </td>
                  <td>{r.confidence?.toFixed(2)}</td>
                  <td>{r.date}</td>

<td>{r.time}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </CardContent>
      </Card>

    </div>
  );
}