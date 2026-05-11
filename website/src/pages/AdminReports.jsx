import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  useGetClassReportQuery,
} from "@/services/reportsAPI";
import * as enUS from "date-fns/locale/en-US";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AttendanceCalendar from "@/components/Calendar/AttendanceCalendar";
import { useGetClassesQuery } from "@/services/classAPI";
import { useGetSubjectsQuery } from "@/services/subjectAPI";
import AttendanceHeatmap from "@/components/Calendar/AttendanceHeatmap";

export default function AdminReports() {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [expanded, setExpanded] = useState(null);
const [selectedStudent, setSelectedStudent] = useState(null);
  const { data: classesData } = useGetClassesQuery();
  const { data: subjectsData } = useGetSubjectsQuery();

  const classes = classesData?.data?.classes || [];
  const subjects = subjectsData?.data?.subjects || [];

  const { data, isLoading } = useGetClassReportQuery(
    classId ? { classId, subjectId } : skipToken
  );
  console.log("Class report data:", data);
  const report = data?.data || [];

  // 📊 STATS
  const totalStudents = report.length;

  const avgAttendance =
    report.length > 0
      ? Math.round(
          report.reduce((acc, s) => {
            const present = s.attendance.filter(a => a.status === "present").length;
            const total = s.attendance.length || 1;
            return acc + (present / total) * 100;
          }, 0) / report.length
        )
      : 0;

  const lowAttendance = report.filter((s) => {
    const present = s.attendance.filter(a => a.status === "present").length;
    const total = s.attendance.length || 1;
    return (present / total) * 100 < 75;
  }).length;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Attendance Report</h1>
   
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 flex-wrap">

        {/* CLASS */}
        <Select
          value={classId}
          onValueChange={(value) => {
            setClassId(value);
            setSubjectId(""); // reset subject
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>

          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.degree.toUpperCase()} - Sem {c.semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* SUBJECT */}
        <Select
          value={subjectId}
          onValueChange={setSubjectId}
          disabled={!classId}
        >
          <SelectTrigger className="w-[200px]">
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

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <h2 className="text-2xl font-bold">{totalStudents}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Attendance</p>
            <h2 className="text-2xl font-bold text-green-600">
              {avgAttendance}%
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Low Attendance</p>
            <h2 className="text-2xl font-bold text-red-500">
              {lowAttendance} Students
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Records</CardTitle>
        </CardHeader>

        <CardContent className="p-0">

          {!classId ? (
            <div className="p-6 text-muted-foreground">
              Select class to view report
            </div>
          ) : isLoading ? (
            <div className="p-6 text-muted-foreground">
              Loading report...
            </div>
          ) : report.length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No attendance records found
            </div>
          ) : (
            <table className="w-full text-sm">

              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Roll No</th>
                  <th className="p-3 text-left">Attendance %</th>
                </tr>
              </thead>

              <tbody>
                {report.map((student) => {
                  const present = student.attendance.filter(a => a.status === "present").length;
                  const total = student.attendance.length || 1;
                  const percentage = Math.round((present / total) * 100);

                  return (
                    <>
                      <tr
                        key={student.studentId}
                        className="border-t hover:bg-muted/40 cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="p-3 font-medium">
                          {student.name}
                        </td>

                        <td className="p-3">
                          {student.rollNumber}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            percentage >= 75
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {percentage}%
                          </span>
                        </td>
                      </tr>

                     {/* <td colSpan="3" className="p-4 bg-muted/30">

  <AttendanceCalendar attendance={student.attendance} />

</td> */}
                    </>
                  );
                })}
              </tbody>

            </table>
          )}

        </CardContent>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
    
    <DialogHeader>
      <DialogTitle>
        {selectedStudent?.name} - Attendance Analytics
      </DialogTitle>
    </DialogHeader>

    {selectedStudent && (
      <div className="space-y-6">
        
        <AttendanceCalendar
          attendance={selectedStudent.attendance}
        />

        <AttendanceHeatmap
          attendance={selectedStudent.attendance}
        />

      </div>
    )}

  </DialogContent>
</Dialog>

    </div>
  );
}