import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useSelector } from "react-redux";

import { useGetTeacherAssignmentsQuery } from "@/services/teacherAPI";
import { useGetStudentsByClassQuery } from "@/services/studentAPI";
import { BASE_URL } from "@/utils/constant";

export default function TeachersStudents() {

  const user = useSelector((state) => state.auth.user);

  const { data: assignmentsData } =
    useGetTeacherAssignmentsQuery(user?.id);
  console.log("Assignments Data:", assignmentsData)
  const [classId, setClassId] = useState("");
  console.log("Selected Class ID:", classId)
  // 📌 fetch students by class
  const { data, isLoading } = useGetStudentsByClassQuery(classId, {
  skip: !classId,
});
  console.log("Students by Class Data:", data)
  const students = data?.data || [];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="text-muted-foreground">
          View students of assigned classes
        </p>
      </div>

      {/* CLASS SELECT */}
      <Card>
        <CardContent className="p-5">

          <Select onValueChange={setClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>

            <SelectContent>
              {assignmentsData?.data?.map((item) => (
                <SelectItem key={item.class._id} value={item.class?._id?.toString() || ""}>
                  {item.class?.degree?.toUpperCase()} - Sem {item.class?.semester} ({item.class?.session?.[0].toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>

        <CardContent className="p-0">

          {!classId ? (
            <p className="p-6 text-muted-foreground">
              Select a class to view students
            </p>
          ) : isLoading ? (
            <p className="p-6">Loading...</p>
          ) : (
            <table className="w-full text-sm">

              <thead>
                <tr className="text-left border-b">
                  <th className="p-4">Name</th>
                  <th>Roll</th>
                  <th>Class</th>
                  <th>Registered</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b hover:bg-muted/40">

                    <td className="p-4 flex items-center gap-2">
                      <img
                        src={`${BASE_URL}/${s.images?.[0]?.url}`}
                        className="w-8 h-8 rounded-full"
                      />
                      {s.name}
                    </td>

                    <td>{s.rollNumber}</td>

                    <td>
                       {s.class?.degree?.toUpperCase()} - Sem {s.class?.semester} ({s.class?.session?.[0].toUpperCase()})
                    </td>

                    <td>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </CardContent>
      </Card>

    </div>
  );
}